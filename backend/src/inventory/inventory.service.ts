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

// ============================================================================
// 1. LOCAL HELPER FUNCTIONS
// ============================================================================

/**
 * Cached demo organization resolution to prevent redundant queries.
 */
let cachedDemoOrgId: string | null = null;

async function getDemoOrganizationId(): Promise<string> {
  if (cachedDemoOrgId) {
    return cachedDemoOrgId;
  }
  const org =
    (await prisma.organization.findFirst({
      where: { status: "ACTIVE" },
      select: { id: true }
    })) ??
    (await prisma.organization.findFirst({
      select: { id: true }
    }));

  if (!org) {
    throw new NotFoundError("No organization found in database");
  }

  cachedDemoOrgId = org.id;
  return org.id;
}

/**
 * Standard business rule for stock status:
 * available = onHand - reserved
 * OUT_OF_STOCK: available <= 0
 * LOW_STOCK: available > 0 AND available <= reorderLevel
 * IN_STOCK: available > reorderLevel
 */
export function calculateStockStatus(
  available: number,
  reorderLevel: number
): "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" {
  if (available <= 0) {
    return "OUT_OF_STOCK";
  }
  if (available <= reorderLevel) {
    return "LOW_STOCK";
  }
  return "IN_STOCK";
}

/**
 * Standardizes signed quantity and human-readable type labels for inventory movements.
 */
function mapInventoryMovement(m: {
  id: string;
  type: string;
  quantity: number;
  unitCost: Prisma.Decimal | number | null;
  referenceType: string | null;
  referenceId: string | null;
  notes: string | null;
  createdAt: Date;
  product?: { name: string } | null;
  store?: { name: string; code: string } | null;
}): InventoryMovementDto {
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
    productName: m.product?.name ?? "Unknown Product",
    storeName: m.store?.name ?? "Unknown Store",
    storeCode: m.store?.code ?? "N/A",
    status: "Completed"
  };
}

/**
 * Builds Prisma where input for inventory queries.
 */
function buildInventoryWhere(
  organizationId: string,
  params: InventoryQueryParams,
  storeIdsInRegion?: string[]
): Prisma.InventoryWhereInput {
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

  return where;
}

// ============================================================================
// 2. PRIMARY INVENTORY LIST ENDPOINT SERVICE
// ============================================================================

export async function getInventoryList(
  params: InventoryQueryParams
): Promise<InventoryResponseData> {
  const organizationId = await getDemoOrganizationId();

  // 1. Resolve Stores in Region if regionId provided
  let storeIdsInRegion: string[] | undefined = undefined;
  if (params.regionId && params.regionId !== "ALL" && params.regionId !== "all") {
    const storesInRegion = await prisma.store.findMany({
      where: { organizationId, regionId: params.regionId, status: "ACTIVE" },
      select: { id: true }
    });
    storeIdsInRegion = storesInRegion.map((s) => s.id);
  }

  // 2. Base database filter
  const baseWhere = buildInventoryWhere(organizationId, params, storeIdsInRegion);

  // 3. Concurrently execute:
  // - Focused summary query (only fields needed for valuation and status calculations)
  // - Dropdown filter options (regions, stores, categories)
  // - In-transit purchase orders (only ORDERED status)
  // - Recent movements (focused select)
  const [
    summaryRecords,
    allRegions,
    allStores,
    allCategories,
    inTransitPOs,
    recentMovementsRaw
  ] = await Promise.all([
    // Focused inventory records for aggregate summary & status determination
    prisma.inventory.findMany({
      where: baseWhere,
      select: {
        id: true,
        productId: true,
        storeId: true,
        onHand: true,
        reserved: true,
        product: {
          select: {
            categoryId: true,
            category: { select: { name: true } },
            costPrice: true,
            reorderLevel: true
          }
        }
      }
    }),

    // Active regions for filter dropdown
    prisma.region.findMany({
      where: { organizationId, status: "ACTIVE" },
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" }
    }),

    // Active stores with minimal fields (used for dropdown & store summary)
    prisma.store.findMany({
      where: { organizationId, status: "ACTIVE" },
      select: {
        id: true,
        name: true,
        code: true,
        regionId: true,
        region: { select: { name: true } }
      },
      orderBy: { name: "asc" }
    }),

    // Active categories for filter dropdown
    prisma.category.findMany({
      where: { organizationId, status: "ACTIVE" },
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" }
    }),

    // In-transit purchase orders (reliable ORDERED quantities)
    prisma.purchaseOrder.findMany({
      where: {
        organizationId,
        status: "ORDERED",
        ...(params.storeId && params.storeId !== "ALL" && params.storeId !== "all"
          ? { storeId: params.storeId }
          : storeIdsInRegion !== undefined
          ? { storeId: { in: storeIdsInRegion } }
          : {})
      },
      select: {
        items: {
          select: {
            quantity: true
          }
        }
      }
    }),

    // Recent inventory movements (focused select: no full product or store records)
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
      select: {
        id: true,
        type: true,
        quantity: true,
        unitCost: true,
        referenceType: true,
        referenceId: true,
        notes: true,
        createdAt: true,
        product: { select: { name: true } },
        store: { select: { name: true, code: true } }
      }
    })
  ]);

  // 4. In-Transit count
  let inTransitItemsCount = 0;
  for (const po of inTransitPOs) {
    for (const item of po.items) {
      inTransitItemsCount += item.quantity;
    }
  }

  // 5. Evaluate summary metrics and category distribution from focused records
  const totalProducts = summaryRecords.length;
  let totalUnits = 0;
  let totalInventoryValue = 0;
  let lowStockItems = 0;
  let outOfStockItems = 0;
  let inStockItems = 0;

  const categoryMap = new Map<string, { categoryId: string; categoryName: string; value: number; count: number }>();
  const storeStockMap = new Map<string, { totalStock: number; lowStock: number; outOfStock: number; totalItems: number }>();

  // ID arrays for status filtering in database pagination
  const matchingStatusIds: string[] = [];

  for (const record of summaryRecords) {
    const onHand = record.onHand;
    const reserved = record.reserved;
    const available = onHand - reserved;
    const costPrice = Number(record.product.costPrice);
    const value = onHand * costPrice;
    const status = calculateStockStatus(available, record.product.reorderLevel);

    totalUnits += onHand;
    totalInventoryValue += value;

    if (status === "LOW_STOCK") {
      lowStockItems++;
    } else if (status === "OUT_OF_STOCK") {
      outOfStockItems++;
    } else {
      inStockItems++;
    }

    // Category aggregation
    const catId = record.product.categoryId || "uncategorized";
    const catName = record.product.category?.name || "Uncategorized";
    const catEntry = categoryMap.get(catId) || { categoryId: catId, categoryName: catName, value: 0, count: 0 };
    catEntry.value += value;
    catEntry.count += 1;
    categoryMap.set(catId, catEntry);

    // Store aggregation
    const storeEntry = storeStockMap.get(record.storeId) || { totalStock: 0, lowStock: 0, outOfStock: 0, totalItems: 0 };
    storeEntry.totalStock += onHand;
    storeEntry.totalItems += 1;
    if (status === "LOW_STOCK") storeEntry.lowStock += 1;
    if (status === "OUT_OF_STOCK") storeEntry.outOfStock += 1;
    storeStockMap.set(record.storeId, storeEntry);

    // Filter matching IDs if status or tab filter active
    const targetStatus =
      params.status && params.status !== "ALL"
        ? params.status
        : params.tab === "low-stock"
        ? "LOW_STOCK"
        : params.tab === "out-of-stock"
        ? "OUT_OF_STOCK"
        : null;

    if (targetStatus) {
      if (status === targetStatus) {
        matchingStatusIds.push(record.id);
      }
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

  // 6. Category Distribution (Top 8 categories)
  const categoryDistribution: CategoryDistributionDto[] = Array.from(categoryMap.values())
    .map((c) => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      value: Math.round(c.value),
      itemCount: c.count,
      percentage: totalInventoryValue > 0 ? Math.round((c.value / totalInventoryValue) * 100) : 0
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // 7. Stock Status & Transparent Health Indicator (In-stock % ratio)
  const totalEvaluated = Math.max(1, inStockItems + lowStockItems + outOfStockItems);
  const inStockPct = Math.round((inStockItems / totalEvaluated) * 100);
  const lowStockPct = Math.round((lowStockItems / totalEvaluated) * 100);
  const outOfStockPct = Math.round((outOfStockItems / totalEvaluated) * 100);
  const inTransitPct =
    totalUnits + inTransitItemsCount > 0
      ? Math.round((inTransitItemsCount / (totalUnits + inTransitItemsCount)) * 100)
      : 0;

  // Simple, transparent health indicator: percentage of items in stock
  const healthScore = inStockPct;
  const healthRating: "Good" | "Average" | "Needs Attention" =
    healthScore >= 80 ? "Good" : healthScore >= 60 ? "Average" : "Needs Attention";

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

  // 8. Store Summary (using minimal fields)
  const storeSummary: StoreInventorySummaryDto[] = allStores
    .map((s) => {
      const stats = storeStockMap.get(s.id) || { totalStock: 0, lowStock: 0, outOfStock: 0, totalItems: 0 };
      const issueRatio = stats.totalItems > 0 ? (stats.lowStock + stats.outOfStock) / stats.totalItems : 0;
      const status: "Healthy" | "Watch" = issueRatio < 0.25 ? "Healthy" : "Watch";
      return {
        storeId: s.id,
        storeName: s.name,
        storeCode: s.code,
        storeImage: null,
        regionId: s.regionId,
        regionName: s.region?.name || null,
        totalStock: stats.totalStock,
        lowStock: stats.lowStock,
        outOfStock: stats.outOfStock,
        status
      };
    })
    .sort((a, b) => b.totalStock - a.totalStock);

  // 9. Real Historical Inventory Movements (Option A: aggregated from real InventoryMovement records)
  const now = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const historicalMovements = await prisma.inventoryMovement.findMany({
    where: {
      organizationId,
      ...(params.storeId && params.storeId !== "ALL" && params.storeId !== "all"
        ? { storeId: params.storeId }
        : storeIdsInRegion !== undefined
        ? { storeId: { in: storeIdsInRegion } }
        : {}),
      createdAt: { gte: sixMonthsAgo }
    },
    select: {
      quantity: true,
      unitCost: true,
      productId: true,
      createdAt: true
    }
  });

  // Aggregate actual movements by month
  const monthlyBuckets = new Map<
    string,
    { units: number; value: number; skus: Set<string>; netMovements: number }
  >();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthlyBuckets.set(key, { units: 0, value: 0, skus: new Set<string>(), netMovements: 0 });
  }

  for (const m of historicalMovements) {
    const d = new Date(m.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = monthlyBuckets.get(key);
    if (bucket) {
      bucket.units += Math.abs(m.quantity);
      bucket.netMovements += m.quantity;
      if (m.unitCost) {
        bucket.value += Math.abs(m.quantity) * Number(m.unitCost);
      }
      bucket.skus.add(m.productId);
    }
  }

  const inventoryTrend: InventoryTrendPointDto[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = monthlyBuckets.get(key) || { units: 0, value: 0, skus: new Set<string>(), netMovements: 0 };
    const monthLabel = monthNames[d.getMonth()];

    // Current month reflects exact live summary; previous months reflect real movement activity
    if (i === 0) {
      inventoryTrend.push({
        month: monthLabel,
        inventoryValue: Math.round(totalInventoryValue),
        inStock: inStockItems,
        lowStock: lowStockItems,
        outOfStock: outOfStockItems,
        inTransit: inTransitItemsCount,
        units: totalUnits,
        skuCount: totalProducts
      });
    } else {
      inventoryTrend.push({
        month: monthLabel,
        inventoryValue: Math.round(bucket.value),
        inStock: bucket.netMovements > 0 ? bucket.skus.size : 0,
        lowStock: 0,
        outOfStock: 0,
        inTransit: 0,
        units: bucket.units,
        skuCount: bucket.skus.size
      });
    }
  }

  const analytics: InventoryAnalyticsDto = {
    inventoryTrend,
    categoryDistribution,
    stockStatus,
    storeSummary
  };

  // 10. True Database Pagination & Filtering for Products Table
  const tableWhere: Prisma.InventoryWhereInput = { ...baseWhere };

  const isStatusFiltering =
    (params.status && params.status !== "ALL") ||
    params.tab === "low-stock" ||
    params.tab === "out-of-stock";

  if (isStatusFiltering) {
    tableWhere.id = { in: matchingStatusIds };
  }

  const orderBy: Prisma.InventoryOrderByWithRelationInput[] =
    params.tab === "low-stock"
      ? [{ onHand: "asc" }, { product: { name: "asc" } }]
      : [{ onHand: "desc" }, { product: { name: "asc" } }];

  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize ?? 25));

  const [total, paginatedRecords] = await Promise.all([
    prisma.inventory.count({ where: tableWhere }),
    prisma.inventory.findMany({
      where: tableWhere,
      select: {
        id: true,
        productId: true,
        storeId: true,
        onHand: true,
        reserved: true,
        product: {
          select: {
            name: true,
            sku: true,
            barcode: true,
            unit: true,
            costPrice: true,
            sellingPrice: true,
            reorderLevel: true,
            image: true,
            categoryId: true,
            category: { select: { name: true } }
          }
        },
        store: {
          select: {
            name: true,
            code: true
          }
        }
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize
    })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // 11. Calculate Store Coverage ONLY for the paginated subset of products
  const pageProductIds = Array.from(new Set(paginatedRecords.map((r) => r.productId)));
  const totalStoreCount = Math.max(1, allStores.length);
  const coverageMap = new Map<string, number>();

  if (pageProductIds.length > 0) {
    const coverageCounts = await prisma.inventory.groupBy({
      by: ["productId"],
      where: {
        organizationId,
        productId: { in: pageProductIds },
        onHand: { gt: 0 }
      },
      _count: { storeId: true }
    });
    for (const pc of coverageCounts) {
      const pct = Math.min(100, Math.round((pc._count.storeId / totalStoreCount) * 100));
      coverageMap.set(pc.productId, pct);
    }
  }

  // 12. Map paginated table items
  const items: InventoryProductItemDto[] = paginatedRecords.map((inv) => {
    const onHand = inv.onHand;
    const reserved = inv.reserved;
    const available = onHand - reserved;
    const costPrice = Number(inv.product.costPrice);
    const sellingPrice = Number(inv.product.sellingPrice);
    const inventoryValue = onHand * costPrice;
    const reorderLevel = inv.product.reorderLevel;
    const status = calculateStockStatus(available, reorderLevel);
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

  // 13. Map Recent Movements
  const recentMovements: InventoryMovementDto[] = recentMovementsRaw.map(mapInventoryMovement);

  return {
    summary,
    analytics,
    products: {
      items,
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

// ============================================================================
// 3. INVENTORY DETAIL ENDPOINT SERVICE
// ============================================================================

export async function getInventoryById(id: string): Promise<InventoryDetailData> {
  const inv = await prisma.inventory.findUnique({
    where: { id },
    select: {
      id: true,
      organizationId: true,
      productId: true,
      storeId: true,
      onHand: true,
      reserved: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          name: true,
          sku: true,
          barcode: true,
          unit: true,
          costPrice: true,
          sellingPrice: true,
          reorderLevel: true,
          image: true,
          categoryId: true,
          category: { select: { name: true } }
        }
      },
      store: {
        select: {
          name: true,
          code: true
        }
      }
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
  const status = calculateStockStatus(available, reorderLevel);

  // Store coverage and recent movements concurrently
  const [totalStoreCount, storesCarryingProduct, recentMovementsRaw] = await Promise.all([
    prisma.store.count({
      where: { organizationId: inv.organizationId, status: "ACTIVE" }
    }),
    prisma.inventory.count({
      where: {
        organizationId: inv.organizationId,
        productId: inv.productId,
        onHand: { gt: 0 }
      }
    }),
    prisma.inventoryMovement.findMany({
      where: {
        storeId: inv.storeId,
        productId: inv.productId
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10,
      select: {
        id: true,
        type: true,
        quantity: true,
        unitCost: true,
        referenceType: true,
        referenceId: true,
        notes: true,
        createdAt: true,
        product: { select: { name: true } },
        store: { select: { name: true, code: true } }
      }
    })
  ]);

  const storeCoverage = Math.min(
    100,
    Math.round((storesCarryingProduct / Math.max(1, totalStoreCount)) * 100)
  );

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
    recentMovements: recentMovementsRaw.map(mapInventoryMovement)
  };
}
