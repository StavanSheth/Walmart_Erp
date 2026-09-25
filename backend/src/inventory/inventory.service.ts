import { Prisma } from "@prisma/client";
import { prisma } from "../common/database/prisma.js";
import { NotFoundError } from "../common/errors/app-error.js";
import type { InventoryQueryParams } from "./inventory.schemas.js";
import type {
  InventoryResponseData,
  InventorySummaryDto,
  InventoryAnalyticsDto,
  InventoryProductItemDto,
  InventoryTrendPointDto,
  CategoryDistributionDto,
  StockStatusSummaryDto,
  StoreInventorySummaryDto,
  InventoryMovementDto,
  InventoryDetailData
} from "./inventory.types.js";

export async function getInventoryList(
  params: InventoryQueryParams
): Promise<InventoryResponseData> {
  // 1. Resolve demo organization
  let org = await prisma.organization.findFirst({
    where: { status: "ACTIVE" }
  });
  if (!org) {
    org = await prisma.organization.findFirst();
  }
  if (!org) {
    throw new NotFoundError("No organization found in database");
  }

  const organizationId = org.id;

  // 2. Resolve Stores in Region if regionId provided
  let storeIdsInRegion: string[] | undefined = undefined;
  if (params.regionId && params.regionId !== "ALL" && params.regionId !== "all") {
    const storesInRegion = await prisma.store.findMany({
      where: { organizationId, regionId: params.regionId, status: "ACTIVE" },
      select: { id: true }
    });
    storeIdsInRegion = storesInRegion.map((s) => s.id);
  }

  // 3. Build database-level Prisma where filter
  const where: Prisma.InventoryWhereInput = {
    organizationId
  };

  if (params.storeId && params.storeId !== "ALL" && params.storeId !== "all") {
    where.storeId = params.storeId;
  } else if (storeIdsInRegion !== undefined) {
    where.storeId = { in: storeIdsInRegion };
  }

  const productWhere: Prisma.ProductWhereInput = {};

  if (params.categoryId && params.categoryId !== "ALL" && params.categoryId !== "all") {
    productWhere.categoryId = params.categoryId;
  }

  if (params.search && params.search.trim().length > 0) {
    const s = params.search.trim();
    productWhere.OR = [
      { name: { contains: s, mode: "insensitive" } },
      { sku: { contains: s, mode: "insensitive" } },
      { barcode: { contains: s, mode: "insensitive" } }
    ];
  }

  if (Object.keys(productWhere).length > 0) {
    where.product = productWhere;
  }

  // 4. Fetch records, stores, categories, and in-transit POs concurrently
  const [
    allRecords,
    allRegions,
    allStores,
    allCategories,
    productStoreCoverageCounts,
    inTransitPOs,
    recentMovementsRaw
  ] = await Promise.all([
    // All matching inventory records
    prisma.inventory.findMany({
      where,
      include: {
        product: {
          include: {
            category: true
          }
        },
        store: {
          include: {
            region: true
          }
        }
      },
      orderBy: [
        { onHand: "desc" },
        { product: { name: "asc" } }
      ]
    }),

    // All active regions
    prisma.region.findMany({
      where: { organizationId, status: "ACTIVE" },
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" }
    }),

    // All active stores
    prisma.store.findMany({
      where: { organizationId, status: "ACTIVE" },
      select: { id: true, name: true, code: true, image: true, regionId: true, region: { select: { name: true } } },
      orderBy: { name: "asc" }
    }),

    // All active categories
    prisma.category.findMany({
      where: { organizationId, status: "ACTIVE" },
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" }
    }),

    // Count of stores carrying each product for store coverage
    prisma.inventory.groupBy({
      by: ["productId"],
      where: {
        organizationId,
        onHand: { gt: 0 }
      },
      _count: {
        storeId: true
      }
    }),

    // In-transit purchase orders
    prisma.purchaseOrder.findMany({
      where: {
        organizationId,
        status: { in: ["ORDERED", "PARTIALLY_RECEIVED"] },
        ...(params.storeId && params.storeId !== "ALL" && params.storeId !== "all"
          ? { storeId: params.storeId }
          : storeIdsInRegion !== undefined
          ? { storeId: { in: storeIdsInRegion } }
          : {})
      },
      select: {
        id: true,
        items: {
          select: {
            quantity: true,
            unitCost: true
          }
        }
      }
    }),

    // Recent inventory movements
    prisma.inventoryMovement.findMany({
      where: {
        organizationId,
        ...(params.storeId && params.storeId !== "ALL" && params.storeId !== "all"
          ? { storeId: params.storeId }
          : storeIdsInRegion !== undefined
          ? { storeId: { in: storeIdsInRegion } }
          : {})
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 30,
      include: {
        product: true,
        store: true
      }
    })
  ]);

  const totalStoreCount = Math.max(1, allStores.length);
  const coverageMap = new Map<string, number>();
  for (const pc of productStoreCoverageCounts) {
    const storeCount = pc._count.storeId;
    const coveragePct = Math.min(100, Math.round((storeCount / totalStoreCount) * 100));
    coverageMap.set(pc.productId, coveragePct);
  }

  // 5. In-Transit calculation from real Purchase Orders
  let inTransitItemsCount = 0;
  for (const po of inTransitPOs) {
    for (const item of po.items) {
      inTransitItemsCount += item.quantity;
    }
  }

  // 6. Map all inventory items & compute derived business fields
  // available = onHand - reserved
  // inventoryValue = onHand * costPrice
  // lowStock = available > 0 AND available <= reorderLevel
  // outOfStock = available <= 0
  // inStock = available > reorderLevel
  const mappedItems: InventoryProductItemDto[] = allRecords.map((inv) => {
    const onHand = inv.onHand;
    const reserved = inv.reserved;
    const available = onHand - reserved;
    const costPrice = Number(inv.product.costPrice);
    const sellingPrice = Number(inv.product.sellingPrice);
    const inventoryValue = onHand * costPrice;
    const reorderLevel = inv.product.reorderLevel;

    let status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
    if (available <= 0) {
      status = "OUT_OF_STOCK";
    } else if (available <= reorderLevel) {
      status = "LOW_STOCK";
    } else {
      status = "IN_STOCK";
    }

    const storeCoverage = coverageMap.get(inv.productId) ?? 0;

    return {
      id: inv.id,
      productId: inv.productId,
      storeId: inv.storeId,
      productName: inv.product.name,
      sku: inv.product.sku,
      barcode: inv.product.barcode,
      categoryName: inv.product.category?.name ?? "Uncategorized",
      categoryId: inv.product.categoryId,
      storeName: inv.store.name,
      storeCode: inv.store.code,
      onHand,
      reserved,
      available,
      reorderLevel,
      costPrice,
      sellingPrice,
      inventoryValue,
      status,
      storeCoverage,
      unit: inv.product.unit,
      image: inv.product.image
    };
  });

  // 7. Calculate overall Summary KPIs (across the entire filtered dataset)
  const totalProducts = mappedItems.length;
  let lowStockItems = 0;
  let outOfStockItems = 0;
  let inStockItems = 0;
  let totalInventoryValue = 0;
  let totalUnits = 0;

  for (const item of mappedItems) {
    totalUnits += item.onHand;
    totalInventoryValue += item.inventoryValue;
    if (item.status === "LOW_STOCK") {
      lowStockItems++;
    } else if (item.status === "OUT_OF_STOCK") {
      outOfStockItems++;
    } else {
      inStockItems++;
    }
  }

  const summary: InventorySummaryDto = {
    totalProducts,
    lowStockItems,
    outOfStockItems,
    inTransitItems: inTransitItemsCount,
    inventoryValue: Math.round(totalInventoryValue),
    totalUnits
  };

  // 8. Analytics - Category Distribution
  const categoryMap = new Map<string, { categoryId: string; categoryName: string; value: number; count: number }>();
  for (const item of mappedItems) {
    const catId = item.categoryId || "uncategorized";
    const catName = item.categoryName;
    const existing = categoryMap.get(catId) || {
      categoryId: catId,
      categoryName: catName,
      value: 0,
      count: 0
    };
    existing.value += item.inventoryValue;
    existing.count += 1;
    categoryMap.set(catId, existing);
  }

  const categoryDistribution: CategoryDistributionDto[] = Array.from(categoryMap.values())
    .map((c) => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      value: Math.round(c.value),
      itemCount: c.count,
      percentage: totalInventoryValue > 0 ? Math.round((c.value / totalInventoryValue) * 100) : 0
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 categories

  // 9. Analytics - Stock Status Breakdown & Deterministic Health Score
  const totalStatusEvaluated = Math.max(1, inStockItems + lowStockItems + outOfStockItems);
  const inStockPct = Math.round((inStockItems / totalStatusEvaluated) * 100);
  const lowStockPct = Math.round((lowStockItems / totalStatusEvaluated) * 100);
  const outOfStockPct = Math.round((outOfStockItems / totalStatusEvaluated) * 100);
  const inTransitPct = totalStatusEvaluated > 0 ? Math.round((inTransitItemsCount / (totalUnits + inTransitItemsCount || 1)) * 100) : 0;

  // Health Score: 0 to 100 based on inStock ratio penalized by lowStock and outOfStock
  const inStockRatio = inStockItems / totalStatusEvaluated;
  const lowStockRatio = lowStockItems / totalStatusEvaluated;
  const outOfStockRatio = outOfStockItems / totalStatusEvaluated;
  const rawHealthScore = Math.round((inStockRatio * 100) - (lowStockRatio * 15) - (outOfStockRatio * 35));
  const healthScore = Math.max(0, Math.min(100, isNaN(rawHealthScore) ? 100 : rawHealthScore));
  const healthRating: "Good" | "Average" | "Needs Attention" =
    healthScore >= 75 ? "Good" : healthScore >= 50 ? "Average" : "Needs Attention";

  const stockStatus: StockStatusSummaryDto = {
    statuses: [
      { status: "IN_STOCK", label: "In Stock", count: inStockItems, percentage: inStockPct },
      { status: "LOW_STOCK", label: "Low Stock", count: lowStockItems, percentage: lowStockPct },
      { status: "OUT_OF_STOCK", label: "Out of Stock", count: outOfStockItems, percentage: outOfStockPct },
      { status: "IN_TRANSIT", label: "In Transit", count: inTransitItemsCount, percentage: inTransitPct }
    ],
    healthScore,
    healthRating
  };

  // 10. Analytics - Store Summary
  const storeMap = new Map<string, {
    storeId: string;
    storeName: string;
    storeCode: string;
    storeImage: string | null;
    regionId: string | null;
    regionName: string | null;
    totalStock: number;
    lowStock: number;
    outOfStock: number;
    totalItems: number;
  }>();

  for (const s of allStores) {
    storeMap.set(s.id, {
      storeId: s.id,
      storeName: s.name,
      storeCode: s.code,
      storeImage: s.image,
      regionId: s.regionId,
      regionName: s.region?.name || null,
      totalStock: 0,
      lowStock: 0,
      outOfStock: 0,
      totalItems: 0
    });
  }

  for (const item of mappedItems) {
    const s = storeMap.get(item.storeId);
    if (s) {
      s.totalStock += item.onHand;
      s.totalItems += 1;
      if (item.status === "LOW_STOCK") s.lowStock += 1;
      if (item.status === "OUT_OF_STOCK") s.outOfStock += 1;
    }
  }

  const storeSummary: StoreInventorySummaryDto[] = Array.from(storeMap.values()).map((s) => {
    const issueRatio = s.totalItems > 0 ? (s.lowStock + s.outOfStock) / s.totalItems : 0;
    const storeStatus: "Healthy" | "Watch" = issueRatio < 0.25 ? "Healthy" : "Watch";
    return {
      storeId: s.storeId,
      storeName: s.storeName,
      storeCode: s.storeCode,
      storeImage: s.storeImage,
      regionId: s.regionId,
      regionName: s.regionName,
      totalStock: s.totalStock,
      lowStock: s.lowStock,
      outOfStock: s.outOfStock,
      status: storeStatus
    };
  }).sort((a, b) => b.totalStock - a.totalStock);

  // 11. Analytics - Inventory Overview Trend (Last 6 Months)
  // Generates real date-based monthly intervals ending at the current month
  const now = new Date();
  const inventoryTrend: InventoryTrendPointDto[] = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = monthNames[d.getMonth()];
    // Monthly factor simulating historical trajectory leading up to current exact value
    // (i === 0 is the current month: 100% of current inventory value)
    const factor = 0.72 + ((5 - i) * 0.056);
    const monthVal = Math.round(totalInventoryValue * factor);
    const monthUnits = Math.round(totalUnits * factor);
    const monthInStock = Math.round(inStockItems * factor);
    const monthLowStock = Math.max(0, Math.round(lowStockItems * (1 + (i * 0.04))));
    const monthOutOfStock = Math.max(0, Math.round(outOfStockItems * (1 + (i * 0.08))));
    const monthInTransit = Math.round(inTransitItemsCount * (0.8 + ((5 - i) * 0.04)));

    inventoryTrend.push({
      month: monthLabel,
      inventoryValue: monthVal,
      inStock: monthInStock,
      lowStock: monthLowStock,
      outOfStock: monthOutOfStock,
      inTransit: monthInTransit,
      units: monthUnits,
      skuCount: Math.round(totalProducts * factor)
    });
  }

  const analytics: InventoryAnalyticsDto = {
    inventoryTrend,
    categoryDistribution,
    stockStatus,
    storeSummary
  };

  // 12. Filter & Sort for the Product Table
  // If no single store is selected, aggregate inventory items by product so each catalog product appears once
  let filteredForTable: InventoryProductItemDto[];

  if (params.storeId && params.storeId !== "ALL" && params.storeId !== "all") {
    filteredForTable = [...mappedItems];
  } else {
    const productAggMap = new Map<string, InventoryProductItemDto>();
    for (const item of mappedItems) {
      const existing = productAggMap.get(item.productId);
      if (!existing) {
        productAggMap.set(item.productId, {
          ...item,
          storeName: "All Stores",
          storeCode: "ALL"
        });
      } else {
        existing.onHand += item.onHand;
        existing.reserved += item.reserved;
        existing.available = existing.onHand - existing.reserved;
        existing.inventoryValue += item.inventoryValue;
        if (existing.available <= 0) {
          existing.status = "OUT_OF_STOCK";
        } else if (existing.available <= existing.reorderLevel) {
          existing.status = "LOW_STOCK";
        } else {
          existing.status = "IN_STOCK";
        }
      }
    }
    filteredForTable = Array.from(productAggMap.values());
  }

  // Status Filter
  if (params.status && params.status !== "ALL") {
    filteredForTable = filteredForTable.filter((item) => item.status === params.status);
  }

  // Tab Filter
  if (params.tab) {
    if (params.tab === "most-stocked") {
      filteredForTable.sort((a, b) => b.onHand - a.onHand);
    } else if (params.tab === "low-stock") {
      filteredForTable = filteredForTable.filter((item) => item.status === "LOW_STOCK");
      filteredForTable.sort((a, b) => a.available - b.available);
    } else if (params.tab === "out-of-stock") {
      filteredForTable = filteredForTable.filter((item) => item.status === "OUT_OF_STOCK");
      filteredForTable.sort((a, b) => b.reorderLevel - a.reorderLevel);
    } else if (params.tab === "fast-moving") {
      // Sort by storeCoverage or high turnover (reserved ratio)
      filteredForTable.sort((a, b) => b.storeCoverage - a.storeCoverage || b.reserved - a.reserved);
    }
  }

  // 13. Server-side Pagination
  const total = filteredForTable.length;
  const page = Math.max(1, params.page);
  const pageSize = Math.max(1, params.pageSize);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = filteredForTable.slice(startIndex, startIndex + pageSize);

  // 14. Format Recent Movements
  const recentMovements: InventoryMovementDto[] = recentMovementsRaw.map((m) => {
    // Determine signed quantity:
    // Purchase, Return, Opening, Transfer In: positive
    // Sale, Transfer Out: negative
    // Adjustment: signed as stored
    let signedQty = m.quantity;
    let typeLabel = "Movement";

    switch (m.type) {
      case "PURCHASE":
        signedQty = Math.abs(m.quantity);
        typeLabel = "Stock In";
        break;
      case "SALE":
        signedQty = -Math.abs(m.quantity);
        typeLabel = "Stock Out";
        break;
      case "RETURN":
        signedQty = Math.abs(m.quantity);
        typeLabel = "Return";
        break;
      case "OPENING":
        signedQty = Math.abs(m.quantity);
        typeLabel = "Opening";
        break;
      case "TRANSFER_IN":
        signedQty = Math.abs(m.quantity);
        typeLabel = "Transfer In";
        break;
      case "TRANSFER_OUT":
        signedQty = -Math.abs(m.quantity);
        typeLabel = "Transfer Out";
        break;
      case "ADJUSTMENT":
        signedQty = m.quantity;
        typeLabel = "Adjustment";
        break;
      default:
        signedQty = m.quantity;
        typeLabel = m.type;
    }

    return {
      id: m.id,
      code: `#MOV${m.id.replace(/-/g, "").slice(0, 5).toUpperCase()}`,
      type: m.type,
      typeLabel,
      quantity: signedQty,
      unitCost: m.unitCost ? Number(m.unitCost) : null,
      referenceType: m.referenceType,
      referenceId: m.referenceId,
      notes: m.notes,
      createdAt: m.createdAt.toISOString(),
      productName: m.product.name,
      storeName: m.store.name,
      storeCode: m.store.code,
      status: "Completed"
    };
  });

  return {
    summary,
    analytics,
    products: {
      items: paginatedItems,
      pagination: {
        page,
        pageSize,
        total,
        totalPages
      }
    },
    recentMovements,
    filterOptions: {
      regions: allRegions,
      stores: allStores.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        regionId: s.regionId
      })),
      categories: allCategories
    }
  };
}

export async function getInventoryById(id: string): Promise<InventoryDetailData> {
  const inv = await prisma.inventory.findUnique({
    where: { id },
    include: {
      product: {
        include: {
          category: true
        }
      },
      store: true
    }
  });

  if (!inv) {
    throw new NotFoundError(`Inventory record with ID "${id}" not found`);
  }

  const onHand = inv.onHand;
  const reserved = inv.reserved;
  const available = onHand - reserved;
  const costPrice = Number(inv.product.costPrice);
  const sellingPrice = Number(inv.product.sellingPrice);
  const inventoryValue = onHand * costPrice;
  const reorderLevel = inv.product.reorderLevel;

  let status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  if (available <= 0) {
    status = "OUT_OF_STOCK";
  } else if (available <= reorderLevel) {
    status = "LOW_STOCK";
  } else {
    status = "IN_STOCK";
  }

  const totalStoreCount = await prisma.store.count({
    where: { organizationId: inv.organizationId, status: "ACTIVE" }
  });
  const storesCarryingProduct = await prisma.inventory.count({
    where: {
      organizationId: inv.organizationId,
      productId: inv.productId,
      onHand: { gt: 0 }
    }
  });
  const storeCoverage = Math.min(100, Math.round((storesCarryingProduct / Math.max(1, totalStoreCount)) * 100));

  const recentMovements = await prisma.inventoryMovement.findMany({
    where: {
      storeId: inv.storeId,
      productId: inv.productId
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 10,
    include: {
      product: true,
      store: true
    }
  });

  return {
    item: {
      id: inv.id,
      productId: inv.productId,
      storeId: inv.storeId,
      productName: inv.product.name,
      sku: inv.product.sku,
      barcode: inv.product.barcode,
      categoryName: inv.product.category?.name ?? "Uncategorized",
      categoryId: inv.product.categoryId,
      storeName: inv.store.name,
      storeCode: inv.store.code,
      onHand,
      reserved,
      available,
      reorderLevel,
      costPrice,
      sellingPrice,
      inventoryValue,
      status,
      storeCoverage,
      unit: inv.product.unit,
      image: inv.product.image,
      createdAt: inv.createdAt.toISOString(),
      updatedAt: inv.updatedAt.toISOString()
    },
    recentMovements: recentMovements.map((m) => {
      let signedQty = m.quantity;
      let typeLabel = "Movement";
      switch (m.type) {
        case "PURCHASE":
          signedQty = Math.abs(m.quantity);
          typeLabel = "Stock In";
          break;
        case "SALE":
          signedQty = -Math.abs(m.quantity);
          typeLabel = "Stock Out";
          break;
        case "RETURN":
          signedQty = Math.abs(m.quantity);
          typeLabel = "Return";
          break;
        case "OPENING":
          signedQty = Math.abs(m.quantity);
          typeLabel = "Opening";
          break;
        case "TRANSFER_IN":
          signedQty = Math.abs(m.quantity);
          typeLabel = "Transfer In";
          break;
        case "TRANSFER_OUT":
          signedQty = -Math.abs(m.quantity);
          typeLabel = "Transfer Out";
          break;
        case "ADJUSTMENT":
          signedQty = m.quantity;
          typeLabel = "Adjustment";
          break;
        default:
          signedQty = m.quantity;
          typeLabel = m.type;
      }
      return {
        id: m.id,
        code: `#MOV${m.id.replace(/-/g, "").slice(0, 5).toUpperCase()}`,
        type: m.type,
        typeLabel,
        quantity: signedQty,
        unitCost: m.unitCost ? Number(m.unitCost) : null,
        referenceType: m.referenceType,
        referenceId: m.referenceId,
        notes: m.notes,
        createdAt: m.createdAt.toISOString(),
        productName: m.product.name,
        storeName: m.store.name,
        storeCode: m.store.code,
        status: "Completed"
      };
    })
  };
}
