import { Prisma } from "@prisma/client";
import { prisma } from "../common/database/prisma.js";
import { NotFoundError } from "../common/errors/app-error.js";
import type { InventoryQueryParams } from "./inventory.schemas.js";
import type {
  InventoryResponseData,
  InventoryProductItemDto,
  StockStatusSummaryDto,
  InventoryDetailData
} from "./inventory.types.js";
import {
  calculateAvailableStock,
  calculateStockStatus,
  calculateInventoryValue,
  resolveTargetStatus,
  calculateHealthScore,
  calculateStoreStatus,
  mapInventoryMovement,
  buildInventorySummary,
  buildCategoryDistribution,
  buildStoreSummary,
  buildInventoryTrend
} from "./inventory.helpers.js";

// Re-export pure helpers for external consumers/tests if needed
export {
  calculateAvailableStock,
  calculateStockStatus,
  calculateInventoryValue,
  resolveTargetStatus,
  calculateHealthScore,
  calculateStoreStatus,
  mapInventoryMovement,
  buildInventorySummary,
  buildCategoryDistribution,
  buildStoreSummary,
  buildInventoryTrend
};

// ============================================================================
// 1. QUERY BUILDER & ORG RESOLUTION
// ============================================================================

/**
 * Builds Prisma where input for inventory queries.
 * Enforces multi-tenant isolation, store constraints, search, and category filters.
 */
export function buildInventoryWhere(
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

// ============================================================================
// 2. PRIMARY INVENTORY LIST SERVICE (Unified entrypoint)
// ============================================================================

export async function getInventoryList(
  params: InventoryQueryParams
): Promise<InventoryResponseData> {
  const organizationId = await getDemoOrganizationId();
  const targetStatus = resolveTargetStatus(params.status, params.tab);
  const isMultiStore = !params.storeId || params.storeId === "ALL" || params.storeId === "all";

  // 1. Resolve Stores in Region if regionId provided
  let storeIdsInRegion: string[] | undefined = undefined;
  if (params.regionId && params.regionId !== "ALL" && params.regionId !== "all") {
    const storesInRegion = await prisma.store.findMany({
      where: { organizationId, regionId: params.regionId, status: "ACTIVE" },
      select: { id: true }
    });
    storeIdsInRegion = storesInRegion.map((s) => s.id);
  }

  // 2. Base database filter (tenant, store/region, category, search)
  const baseWhere = buildInventoryWhere(organizationId, params, storeIdsInRegion);

  // 3. Concurrently fetch filter options, active stores, in-transit stock, and recent movements
  const [
    allRegions,
    allStores,
    allCategories,
    inTransitAgg,
    recentMovementsRaw
  ] = await Promise.all([
    // Active regions for filter dropdown
    prisma.region.findMany({
      where: { organizationId, status: "ACTIVE" },
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" }
    }),

    // Active stores with minimal fields
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

    // Incoming Stock: derived from open purchase order quantities in status ORDERED
    prisma.purchaseOrderItem.aggregate({
      where: {
        purchaseOrder: {
          organizationId,
          status: "ORDERED",
          ...(params.storeId && params.storeId !== "ALL" && params.storeId !== "all"
            ? { storeId: params.storeId }
            : storeIdsInRegion !== undefined
            ? { storeId: { in: storeIdsInRegion } }
            : {})
        }
      },
      _sum: {
        quantity: true
      }
    }),

    // Recent inventory movements (latest 10)
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

  const totalStoreCount = Math.max(1, allStores.length);
  const inTransitItemsCount = inTransitAgg._sum.quantity ?? 0;

  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize ?? 25));

  let items: InventoryProductItemDto[] = [];
  let total = 0;
  let totalPages = 1;

  // Variables for dataset-wide summary & analytics
  let totalProducts = 0;
  let totalUnits = 0;
  let totalInventoryValue = 0;
  let lowStockItems = 0;
  let outOfStockItems = 0;
  let inStockItems = 0;

  const categoryMap = new Map<
    string,
    { categoryId: string; categoryName: string; value: number; productIds: Set<string> }
  >();

  const storeStockMap = new Map<
    string,
    { totalStock: number; lowStock: number; outOfStock: number; totalItems: number }
  >();

  // ==========================================================================
  // PATH A: ALL STORES (PostgreSQL GROUP BY aggregation + true server-side pagination)
  // ==========================================================================
  if (isMultiStore) {
    // 1. DB-Level Aggregation: Group by productId across all stores matching the filter
    const productGroups = await prisma.inventory.groupBy({
      by: ["productId"],
      where: baseWhere,
      _sum: {
        onHand: true,
        reserved: true
      },
      _count: {
        storeId: true
      }
    });

    const distinctProductIds = productGroups.map((g) => g.productId);

    // 2. Fetch product metadata for the grouped products
    const productsMetadata = await prisma.product.findMany({
      where: { id: { in: distinctProductIds } },
      select: {
        id: true,
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
    });

    const productMetaMap = new Map(productsMetadata.map((p) => [p.id, p]));

    // Map DB group results to product-level aggregated rows
    interface AggregatedProductRow {
      productId: string;
      productName: string;
      sku: string;
      barcode: string | null;
      categoryName: string;
      categoryId: string | null;
      onHand: number;
      reserved: number;
      available: number;
      reorderLevel: number;
      costPrice: number;
      sellingPrice: number;
      inventoryValue: number;
      status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
      storesCount: number;
      unit: string;
      image: string | null;
    }

    const allAggregatedRows: AggregatedProductRow[] = [];

    for (const group of productGroups) {
      const meta = productMetaMap.get(group.productId);
      if (!meta) continue;

      const onHand = group._sum.onHand ?? 0;
      const reserved = group._sum.reserved ?? 0;
      const available = calculateAvailableStock(onHand, reserved);
      const costPrice = Number(meta.costPrice);
      const sellingPrice = Number(meta.sellingPrice);
      const inventoryValue = calculateInventoryValue(onHand, costPrice);
      const status = calculateStockStatus(available, meta.reorderLevel);

      // Accumulate full-dataset summary values
      totalUnits += onHand;
      totalInventoryValue += inventoryValue;

      if (status === "OUT_OF_STOCK") outOfStockItems++;
      else if (status === "LOW_STOCK") lowStockItems++;
      else inStockItems++;

      // Category aggregation for analytics
      const catId = meta.categoryId || "uncategorized";
      const catName = meta.category?.name || "Uncategorized";
      const catEntry = categoryMap.get(catId) || {
        categoryId: catId,
        categoryName: catName,
        value: 0,
        productIds: new Set<string>()
      };
      catEntry.value += inventoryValue;
      catEntry.productIds.add(meta.id);
      categoryMap.set(catId, catEntry);

      allAggregatedRows.push({
        productId: meta.id,
        productName: meta.name,
        sku: meta.sku,
        barcode: meta.barcode,
        categoryName: meta.category?.name ?? "Uncategorized",
        categoryId: meta.categoryId,
        onHand,
        reserved,
        available,
        reorderLevel: meta.reorderLevel,
        costPrice,
        sellingPrice,
        inventoryValue,
        status,
        storesCount: group._count.storeId,
        unit: meta.unit,
        image: meta.image
      });
    }

    // Total distinct products matching the filters
    totalProducts = allAggregatedRows.length;

    // Filter by stock status if requested
    let filteredRows = allAggregatedRows;
    if (targetStatus !== "ALL") {
      filteredRows = filteredRows.filter((r) => r.status === targetStatus);
    }

    // Sort by onHand (asc for low-stock / out-of-stock, desc otherwise)
    if (params.tab === "low-stock" || params.tab === "out-of-stock") {
      filteredRows.sort((a, b) => a.onHand - b.onHand || a.productName.localeCompare(b.productName));
    } else {
      filteredRows.sort((a, b) => b.onHand - a.onHand || a.productName.localeCompare(b.productName));
    }

    // True Server-Side Pagination over product-level rows
    total = filteredRows.length;
    totalPages = Math.max(1, Math.ceil(total / pageSize));
    const pageRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

    // Resolve store coverage for the current page items
    const pageProductIds = pageRows.map((r) => r.productId);
    const coverageMap = new Map<string, number>();

    if (pageProductIds.length > 0) {
      const activeStoresPerProduct = await prisma.inventory.groupBy({
        by: ["productId"],
        where: {
          organizationId,
          productId: { in: pageProductIds },
          onHand: { gt: 0 }
        },
        _count: { storeId: true }
      });
      for (const asp of activeStoresPerProduct) {
        const pct = Math.min(100, Math.round((asp._count.storeId / totalStoreCount) * 100));
        coverageMap.set(asp.productId, pct);
      }
    }

    // Build the final items for the current page
    items = pageRows.map((row) => ({
      id: row.productId, // Use productId as clean identifier for All Stores context
      productId: row.productId,
      storeId: "ALL",
      productName: row.productName,
      sku: row.sku,
      barcode: row.barcode,
      categoryName: row.categoryName,
      categoryId: row.categoryId,
      storeName: `All Outlets (${row.storesCount}/${totalStoreCount} Stores)`,
      storeCode: "ALL",
      onHand: row.onHand,
      reserved: row.reserved,
      available: row.available,
      reorderLevel: row.reorderLevel,
      costPrice: row.costPrice,
      sellingPrice: row.sellingPrice,
      inventoryValue: row.inventoryValue,
      status: row.status,
      storeCoverage: coverageMap.get(row.productId) ?? 0,
      unit: row.unit,
      image: row.image
    }));

    // Build store summary stats for analytics concurrently
    const storeStats = await prisma.inventory.groupBy({
      by: ["storeId"],
      where: {
        organizationId,
        ...(storeIdsInRegion !== undefined ? { storeId: { in: storeIdsInRegion } } : {})
      },
      _sum: { onHand: true },
      _count: { productId: true }
    });

    for (const ss of storeStats) {
      storeStockMap.set(ss.storeId, {
        totalStock: ss._sum.onHand ?? 0,
        lowStock: 0,
        outOfStock: 0,
        totalItems: ss._count.productId
      });
    }
  } else {
    // ========================================================================
    // PATH B: INDIVIDUAL STORE (Direct inventory records with DB pagination)
    // ========================================================================
    const storeRecords = await prisma.inventory.findMany({
      where: baseWhere,
      select: {
        id: true,
        productId: true,
        storeId: true,
        onHand: true,
        reserved: true,
        product: {
          select: {
            id: true,
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

    const matchingIds: string[] = [];

    // Calculate full filtered dataset summary
    for (const r of storeRecords) {
      const onHand = r.onHand;
      const reserved = r.reserved;
      const available = calculateAvailableStock(onHand, reserved);
      const costPrice = Number(r.product.costPrice);
      const value = calculateInventoryValue(onHand, costPrice);
      const status = calculateStockStatus(available, r.product.reorderLevel);

      totalUnits += onHand;
      totalInventoryValue += value;

      if (status === "OUT_OF_STOCK") outOfStockItems++;
      else if (status === "LOW_STOCK") lowStockItems++;
      else inStockItems++;

      if (targetStatus === "ALL" || status === targetStatus) {
        matchingIds.push(r.id);
      }

      // Category aggregation
      const catId = r.product.categoryId || "uncategorized";
      const catName = r.product.category?.name || "Uncategorized";
      const catEntry = categoryMap.get(catId) || {
        categoryId: catId,
        categoryName: catName,
        value: 0,
        productIds: new Set<string>()
      };
      catEntry.value += value;
      catEntry.productIds.add(r.productId);
      categoryMap.set(catId, catEntry);

      // Store stock tracking
      const sEntry = storeStockMap.get(r.storeId) || {
        totalStock: 0,
        lowStock: 0,
        outOfStock: 0,
        totalItems: 0
      };
      sEntry.totalStock += onHand;
      sEntry.totalItems += 1;
      if (status === "LOW_STOCK") sEntry.lowStock += 1;
      if (status === "OUT_OF_STOCK") sEntry.outOfStock += 1;
      storeStockMap.set(r.storeId, sEntry);
    }

    totalProducts = storeRecords.length;

    // Database Pagination for Store View
    const tableWhere: Prisma.InventoryWhereInput = {
      ...baseWhere,
      id: { in: matchingIds }
    };

    const orderBy: Prisma.InventoryOrderByWithRelationInput[] =
      params.tab === "low-stock"
        ? [{ onHand: "asc" }, { product: { name: "asc" } }]
        : [{ onHand: "desc" }, { product: { name: "asc" } }];

    const [storeTotal, paginatedRecords] = await Promise.all([
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

    total = storeTotal;
    totalPages = Math.max(1, Math.ceil(total / pageSize));

    // Coverage counts for the current page
    const pageProductIds = Array.from(new Set(paginatedRecords.map((r) => r.productId)));
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

    items = paginatedRecords.map((inv) => {
      const onHand = inv.onHand;
      const reserved = inv.reserved;
      const available = calculateAvailableStock(onHand, reserved);
      const costPrice = Number(inv.product.costPrice);
      const sellingPrice = Number(inv.product.sellingPrice);
      const inventoryValue = calculateInventoryValue(onHand, costPrice);
      const status = calculateStockStatus(available, inv.product.reorderLevel);

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
        reorderLevel: inv.product.reorderLevel,
        costPrice,
        sellingPrice,
        inventoryValue,
        status,
        storeCoverage: coverageMap.get(inv.productId) ?? 0,
        unit: inv.product.unit,
        image: inv.product.image
      };
    });
  }

  // ==========================================================================
  // 4. Summary & Analytics DTO Construction
  // ==========================================================================

  // Summary over the FULL FILTERED DATASET (never just current page)
  const summary = buildInventorySummary({
    totalProducts,
    totalUnits,
    totalInventoryValue,
    inTransitItems: inTransitItemsCount,
    lowStockItems,
    outOfStockItems
  });

  // Category Distribution
  const categoryDistribution = buildCategoryDistribution(categoryMap, totalInventoryValue);

  // Stock Status & Presentation Health Indicator
  const totalEvaluated = Math.max(1, inStockItems + lowStockItems + outOfStockItems);
  const inStockPct = Math.round((inStockItems / totalEvaluated) * 100);
  const lowStockPct = Math.round((lowStockItems / totalEvaluated) * 100);
  const outOfStockPct = Math.round((outOfStockItems / totalEvaluated) * 100);
  const inTransitPct =
    totalUnits + inTransitItemsCount > 0
      ? Math.round((inTransitItemsCount / (totalUnits + inTransitItemsCount)) * 100)
      : 0;

  const { healthScore, healthRating } = calculateHealthScore(
    inStockItems,
    lowStockItems,
    outOfStockItems
  );

  const stockStatus: StockStatusSummaryDto = {
    statuses: [
      { status: "IN_STOCK", label: "In Stock", count: inStockItems, percentage: inStockPct },
      { status: "LOW_STOCK", label: "Low Stock", count: lowStockItems, percentage: lowStockPct },
      { status: "OUT_OF_STOCK", label: "Out of Stock", count: outOfStockItems, percentage: outOfStockPct },
      { status: "IN_TRANSIT", label: "Incoming Stock", count: inTransitItemsCount, percentage: inTransitPct }
    ],
    healthScore,
    healthRating
  };

  // Store Summary
  const storeSummary = buildStoreSummary(allStores, storeStockMap);

  // Historical Movements & 12M Trend
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const historicalMovements = await prisma.inventoryMovement.findMany({
    where: {
      organizationId,
      ...(params.storeId && params.storeId !== "ALL" && params.storeId !== "all"
        ? { storeId: params.storeId }
        : storeIdsInRegion !== undefined
        ? { storeId: { in: storeIdsInRegion } }
        : {}),
      createdAt: { gte: twelveMonthsAgo }
    },
    select: {
      quantity: true,
      unitCost: true,
      productId: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });

  const inventoryTrend = buildInventoryTrend(
    historicalMovements,
    {
      totalUnits,
      totalInventoryValue,
      totalProducts
    },
    now
  );

  const analytics = {
    inventoryTrend,
    categoryDistribution,
    stockStatus,
    storeSummary
  };

  // Map Recent Movements
  const recentMovements = recentMovementsRaw.map(mapInventoryMovement);

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
// 3. INVENTORY DETAIL SERVICE (Context-aware: Store Inventory or Aggregated Product)
// ============================================================================

export async function getInventoryById(
  id: string,
  storeId?: string
): Promise<InventoryDetailData> {
  const organizationId = await getDemoOrganizationId();
  const isAllStores = storeId === "ALL" || storeId === "all";

  // Check if target is explicitly All Stores OR if the provided ID matches a Product
  let productTarget = isAllStores
    ? await prisma.product.findUnique({
        where: { id },
        include: { category: { select: { name: true } } }
      })
    : null;

  if (!productTarget && !isAllStores) {
    // Attempt standard single-store inventory record lookup first
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

    if (inv) {
      const onHand = inv.onHand;
      const reserved = inv.reserved;
      const available = calculateAvailableStock(onHand, reserved);
      const costPrice = Number(inv.product.costPrice);
      const sellingPrice = Number(inv.product.sellingPrice);
      const inventoryValue = calculateInventoryValue(onHand, costPrice);
      const reorderLevel = inv.product.reorderLevel;
      const status = calculateStockStatus(available, reorderLevel);

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

    // Fallback: Check if the passed ID was a productId
    productTarget = await prisma.product.findUnique({
      where: { id },
      include: { category: { select: { name: true } } }
    });
  }

  if (!productTarget) {
    throw new NotFoundError(`Inventory item with ID "${id}" not found`);
  }

  // ==========================================================================
  // ALL STORES AGGREGATED DETAIL: Represents the true aggregated product
  // ==========================================================================
  const [stockSum, totalStoreCount, storesCarryingProduct, recentMovementsRaw] = await Promise.all([
    prisma.inventory.aggregate({
      where: {
        organizationId,
        productId: productTarget.id
      },
      _sum: {
        onHand: true,
        reserved: true
      }
    }),
    prisma.store.count({
      where: { organizationId, status: "ACTIVE" }
    }),
    prisma.inventory.count({
      where: {
        organizationId,
        productId: productTarget.id,
        onHand: { gt: 0 }
      }
    }),
    prisma.inventoryMovement.findMany({
      where: {
        organizationId,
        productId: productTarget.id
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

  const onHand = stockSum._sum.onHand ?? 0;
  const reserved = stockSum._sum.reserved ?? 0;
  const available = calculateAvailableStock(onHand, reserved);
  const costPrice = Number(productTarget.costPrice);
  const sellingPrice = Number(productTarget.sellingPrice);
  const inventoryValue = calculateInventoryValue(onHand, costPrice);
  const reorderLevel = productTarget.reorderLevel;
  const status = calculateStockStatus(available, reorderLevel);

  const storeCoverage = Math.min(
    100,
    Math.round((storesCarryingProduct / Math.max(1, totalStoreCount)) * 100)
  );

  return {
    item: {
      id: productTarget.id,
      productId: productTarget.id,
      storeId: "ALL",
      productName: productTarget.name,
      sku: productTarget.sku,
      barcode: productTarget.barcode,
      categoryName: productTarget.category?.name ?? "Uncategorized",
      categoryId: productTarget.categoryId,
      storeName: `All Outlets (${storesCarryingProduct}/${totalStoreCount} Stores)`,
      storeCode: "ALL",
      onHand,
      reserved,
      available,
      reorderLevel,
      costPrice,
      sellingPrice,
      inventoryValue,
      status,
      storeCoverage,
      unit: productTarget.unit,
      image: productTarget.image,
      createdAt: productTarget.createdAt.toISOString(),
      updatedAt: productTarget.updatedAt.toISOString()
    },
    recentMovements: recentMovementsRaw.map(mapInventoryMovement)
  };
}
