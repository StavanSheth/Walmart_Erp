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
// 1. BUSINESS FORMULAS & PURE LOCAL CALCULATION HELPERS
// ============================================================================

/**
 * Calculates physical stock available for sale or transfer.
 * available = Math.max(0, onHand - reserved)
 */
export function calculateAvailableStock(onHand: number, reserved: number): number {
  return Math.max(0, onHand - reserved);
}

/**
 * Standard business rule for stock status:
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
 * Calculates total valuation for a given quantity and unit cost price.
 * Valuation = onHand * costPrice (never uses selling price)
 */
export function calculateInventoryValue(quantity: number, costPrice: number): number {
  return Math.max(0, quantity * costPrice);
}

/**
 * Unified status and tab resolver.
 * Maps status query params and tab selections to single internal target status.
 * Tabs: all -> ALL, low-stock -> LOW_STOCK, out-of-stock -> OUT_OF_STOCK, most-stocked -> ALL (sort only)
 */
export function resolveTargetStatus(
  status?: string,
  tab?: string
): "ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" {
  if (status && status !== "ALL") {
    if (status === "IN_STOCK" || status === "LOW_STOCK" || status === "OUT_OF_STOCK") {
      return status;
    }
  }
  if (tab === "low-stock") return "LOW_STOCK";
  if (tab === "out-of-stock") return "OUT_OF_STOCK";
  return "ALL";
}

/**
 * Deterministic Inventory Health Score calculation based on stock ratios.
 * Isolated health indicator for presentation only; never alters financial or inventory truths.
 */
export function calculateHealthScore(
  inStock: number,
  lowStock: number,
  outOfStock: number
): {
  healthScore: number;
  healthRating: "Good" | "Average" | "Needs Attention";
} {
  const total = inStock + lowStock + outOfStock;
  if (total === 0) {
    return { healthScore: 100, healthRating: "Good" };
  }
  const inStockRatio = inStock / total;
  const lowStockRatio = lowStock / total;
  const outOfStockRatio = outOfStock / total;

  // Penalize low-stock and out-of-stock ratios deterministically
  const rawScore = Math.round(inStockRatio * 100 - lowStockRatio * 30 - outOfStockRatio * 60);
  const healthScore = Math.max(0, Math.min(100, rawScore));
  const healthRating: "Good" | "Average" | "Needs Attention" =
    healthScore >= 80 ? "Good" : healthScore >= 60 ? "Average" : "Needs Attention";

  return { healthScore, healthRating };
}

/**
 * Deterministic Store Health Status presentation indicator based on issue ratio.
 */
export function calculateStoreStatus(
  lowStock: number,
  outOfStock: number,
  totalItems: number
): "Healthy" | "Watch" {
  if (totalItems === 0) return "Healthy";
  const issueRatio = (lowStock + outOfStock) / totalItems;
  return issueRatio < 0.25 ? "Healthy" : "Watch";
}

/**
 * Standardizes signed quantity and human-readable type labels for inventory movements.
 */
export function mapInventoryMovement(m: {
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

// ============================================================================
// 2. MODULAR BUILDER HELPERS
// ============================================================================

export function buildInventorySummary(input: {
  totalProducts: number;
  totalUnits: number;
  totalInventoryValue: number;
  inTransitItems: number;
  lowStockItems: number;
  outOfStockItems: number;
}): InventorySummaryDto {
  return {
    totalProducts: input.totalProducts,
    lowStockItems: input.lowStockItems,
    outOfStockItems: input.outOfStockItems,
    inTransitItems: input.inTransitItems,
    inventoryValue: Math.round(input.totalInventoryValue),
    totalUnits: input.totalUnits
  };
}

export function buildCategoryDistribution(
  categoryMap: Map<string, { categoryId: string; categoryName: string; value: number; productIds: Set<string> }>,
  totalInventoryValue: number
): CategoryDistributionDto[] {
  return Array.from(categoryMap.values())
    .map((c) => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      value: Math.round(c.value),
      itemCount: c.productIds.size,
      percentage: totalInventoryValue > 0 ? Math.round((c.value / totalInventoryValue) * 100) : 0
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

export function buildStoreSummary(
  allStores: Array<{ id: string; name: string; code: string; regionId: string | null; region?: { name: string } | null }>,
  storeStockMap: Map<string, { totalStock: number; lowStock: number; outOfStock: number; totalItems: number }>
): StoreInventorySummaryDto[] {
  return allStores
    .map((s) => {
      const stats = storeStockMap.get(s.id) || {
        totalStock: 0,
        lowStock: 0,
        outOfStock: 0,
        totalItems: 0
      };
      const status = calculateStoreStatus(stats.lowStock, stats.outOfStock, stats.totalItems);
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
}

export function buildInventoryTrend(
  historicalMovements: Array<{ quantity: number; unitCost: Prisma.Decimal | number | null; productId: string; createdAt: Date }>,
  currentSnapshot: {
    totalUnits: number;
    totalInventoryValue: number;
    totalProducts: number;
    inStockItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    inTransitItems: number;
  },
  now: Date = new Date()
): InventoryTrendPointDto[] {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthlyMovementMap = new Map<string, { netUnits: number; netVal: number; skus: Set<string> }>();
  for (const m of historicalMovements) {
    const d = new Date(m.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    let entry = monthlyMovementMap.get(key);
    if (!entry) {
      entry = { netUnits: 0, netVal: 0, skus: new Set<string>() };
      monthlyMovementMap.set(key, entry);
    }
    entry.netUnits += m.quantity;
    if (m.unitCost) {
      entry.netVal += m.quantity * Number(m.unitCost);
    }
    entry.skus.add(m.productId);
  }

  let runningUnits = currentSnapshot.totalUnits;
  let runningVal = currentSnapshot.totalInventoryValue;
  const rawTrendReversed: InventoryTrendPointDto[] = [];

  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = monthNames[monthDate.getMonth()];
    const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;

    const monthData = monthlyMovementMap.get(monthKey);
    const netUnitsThisMonth = monthData?.netUnits ?? 0;
    const netValThisMonth = monthData?.netVal ?? 0;
    const activeSkusThisMonth = monthData?.skus ?? new Set<string>();

    const currentUnits = Math.max(0, Math.round(runningUnits));
    const currentVal = Math.max(0, Math.round(runningVal));

    const monthSkus =
      i === 0
        ? currentSnapshot.totalProducts
        : Math.min(currentSnapshot.totalProducts, Math.max(activeSkusThisMonth.size, currentUnits > 0 ? 1 : 0));

    rawTrendReversed.push({
      month: monthLabel,
      inventoryValue: i === 0 ? Math.round(currentSnapshot.totalInventoryValue) : currentVal,
      units: i === 0 ? currentSnapshot.totalUnits : currentUnits,
      skuCount: monthSkus,
      inStock: currentSnapshot.inStockItems,
      lowStock: currentSnapshot.lowStockItems,
      outOfStock: currentSnapshot.outOfStockItems,
      inTransit: i === 0 ? currentSnapshot.inTransitItems : 0
    });

    runningUnits -= netUnitsThisMonth;
    runningVal -= netValThisMonth;
  }

  return rawTrendReversed.reverse();
}

export interface ProductAggregationRecord {
  firstInvId: string;
  productId: string;
  productName: string;
  sku: string;
  barcode: string;
  categoryName: string;
  categoryId: string;
  onHand: number;
  reserved: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  storesCount: number;
  unit: string;
  image: string | null;
}

export function buildProductItems(input: {
  isMultiStore: boolean;
  productAggMap: Map<string, ProductAggregationRecord>;
  paginatedStoreRecords?: Array<{
    id: string;
    productId: string;
    storeId: string;
    onHand: number;
    reserved: number;
    product: {
      name: string;
      sku: string;
      barcode: string | null;
      unit: string;
      costPrice: Prisma.Decimal | number;
      sellingPrice: Prisma.Decimal | number;
      reorderLevel: number;
      image: string | null;
      categoryId: string | null;
      category?: { name: string } | null;
    };
    store: {
      name: string;
      code: string;
    };
  }>;
  totalStoreCount: number;
  storeCoverageMap?: Map<string, number>;
  targetStatus: "ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  tab?: string;
  page: number;
  pageSize: number;
}): { items: InventoryProductItemDto[]; total: number; totalPages: number } {
  const { isMultiStore, totalStoreCount, targetStatus, tab, page, pageSize } = input;

  if (!isMultiStore && input.paginatedStoreRecords) {
    const items = input.paginatedStoreRecords.map((inv) => {
      const onHand = inv.onHand;
      const reserved = inv.reserved;
      const available = calculateAvailableStock(onHand, reserved);
      const costPrice = Number(inv.product.costPrice);
      const sellingPrice = Number(inv.product.sellingPrice);
      const inventoryValue = calculateInventoryValue(onHand, costPrice);
      const reorderLevel = inv.product.reorderLevel;
      const status = calculateStockStatus(available, reorderLevel);
      const storeCoverage = input.storeCoverageMap?.get(inv.productId) ?? 0;

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

    return { items, total: 0, totalPages: 1 };
  }

  // All Stores / Multi-Store View: aggregate catalog products
  const aggregatedList: InventoryProductItemDto[] = [];
  for (const p of input.productAggMap.values()) {
    const available = calculateAvailableStock(p.onHand, p.reserved);
    const inventoryValue = calculateInventoryValue(p.onHand, p.costPrice);
    const storeCoverage = Math.min(100, Math.round((p.storesCount / totalStoreCount) * 100));
    const status = calculateStockStatus(available, p.reorderLevel);

    aggregatedList.push({
      id: p.firstInvId,
      productId: p.productId,
      storeId: "ALL",
      productName: p.productName,
      sku: p.sku,
      barcode: p.barcode,
      categoryName: p.categoryName,
      categoryId: p.categoryId,
      storeName: `All Outlets (${p.storesCount}/${totalStoreCount} Stores)`,
      storeCode: "ALL",
      onHand: p.onHand,
      reserved: p.reserved,
      available,
      reorderLevel: p.reorderLevel,
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
      inventoryValue,
      status,
      storeCoverage,
      unit: p.unit,
      image: p.image
    });
  }

  let filtered = aggregatedList;
  if (targetStatus !== "ALL") {
    filtered = filtered.filter((item) => item.status === targetStatus);
  }

  if (tab === "low-stock" || tab === "out-of-stock") {
    filtered.sort((a, b) => a.onHand - b.onHand || a.productName.localeCompare(b.productName));
  } else {
    filtered.sort((a, b) => b.onHand - a.onHand || a.productName.localeCompare(b.productName));
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const items = filtered.slice((page - 1) * pageSize, page * pageSize);

  return { items, total, totalPages };
}

/**
 * Builds Prisma where input for inventory queries.
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

// ============================================================================
// 3. ORG RESOLUTION
// ============================================================================

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
// 4. PRIMARY INVENTORY LIST SERVICE (Single unified entrypoint)
// ============================================================================

export async function getInventoryList(
  params: InventoryQueryParams
): Promise<InventoryResponseData> {
  const organizationId = await getDemoOrganizationId();
  const targetStatus = resolveTargetStatus(params.status, params.tab);

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

  // 3. Concurrently execute queries using Prisma selects
  const [
    summaryRecords,
    allRegions,
    allStores,
    allCategories,
    inTransitAgg,
    recentMovementsRaw
  ] = await Promise.all([
    // Focused inventory records for valuation, status and aggregation
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
    }),

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

    // In Transit: Derived from unreceived purchase order quantities with status ORDERED
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

  const inTransitItemsCount = inTransitAgg._sum.quantity ?? 0;
  const isMultiStore = !params.storeId || params.storeId === "ALL" || params.storeId === "all";
  const totalStoreCount = Math.max(1, allStores.length);

  // 4. Evaluate summary metrics and category distribution from filtered records
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
  const productAggMap = new Map<string, ProductAggregationRecord>();
  const matchingStatusIds: string[] = [];

  for (const record of summaryRecords) {
    const onHand = record.onHand;
    const reserved = record.reserved;
    const available = calculateAvailableStock(onHand, reserved);
    const costPrice = Number(record.product.costPrice);
    const value = calculateInventoryValue(onHand, costPrice);
    const status = calculateStockStatus(available, record.product.reorderLevel);

    totalUnits += onHand;
    totalInventoryValue += value;

    // Store aggregation
    const storeEntry = storeStockMap.get(record.storeId) || {
      totalStock: 0,
      lowStock: 0,
      outOfStock: 0,
      totalItems: 0
    };
    storeEntry.totalStock += onHand;
    storeEntry.totalItems += 1;
    if (status === "LOW_STOCK") storeEntry.lowStock += 1;
    if (status === "OUT_OF_STOCK") storeEntry.outOfStock += 1;
    storeStockMap.set(record.storeId, storeEntry);

    // Track for per-product aggregation
    let pEntry = productAggMap.get(record.productId);
    if (!pEntry) {
      pEntry = {
        firstInvId: record.id,
        productId: record.productId,
        productName: record.product.name,
        sku: record.product.sku,
        barcode: record.product.barcode ?? "N/A",
        categoryName: record.product.category?.name ?? "Uncategorized",
        categoryId: record.product.categoryId ?? "uncategorized",
        onHand: 0,
        reserved: 0,
        reorderLevel: record.product.reorderLevel,
        costPrice,
        sellingPrice: Number(record.product.sellingPrice),
        storesCount: 0,
        unit: record.product.unit,
        image: record.product.image
      };
      productAggMap.set(record.productId, pEntry);
    }
    pEntry.onHand += onHand;
    pEntry.reserved += reserved;
    if (onHand > 0) {
      pEntry.storesCount += 1;
    }

    // Category aggregation
    const catId = record.product.categoryId || "uncategorized";
    const catName = record.product.category?.name || "Uncategorized";
    const catEntry = categoryMap.get(catId) || {
      categoryId: catId,
      categoryName: catName,
      value: 0,
      productIds: new Set<string>()
    };
    catEntry.value += value;
    catEntry.productIds.add(record.productId);
    categoryMap.set(catId, catEntry);

    // Track matching IDs for single-store view status filtering
    if (!isMultiStore && targetStatus !== "ALL" && status === targetStatus) {
      matchingStatusIds.push(record.id);
    }
  }

  // Explicit Total Products Semantics:
  // All Stores: COUNT DISTINCT productId
  // Single Store: COUNT inventory records for that store
  const totalProducts = isMultiStore ? productAggMap.size : summaryRecords.length;

  if (isMultiStore) {
    for (const p of productAggMap.values()) {
      const available = calculateAvailableStock(p.onHand, p.reserved);
      const status = calculateStockStatus(available, p.reorderLevel);
      if (status === "OUT_OF_STOCK") {
        outOfStockItems++;
      } else if (status === "LOW_STOCK") {
        lowStockItems++;
      } else {
        inStockItems++;
      }
    }
  } else {
    for (const record of summaryRecords) {
      const available = calculateAvailableStock(record.onHand, record.reserved);
      const status = calculateStockStatus(available, record.product.reorderLevel);
      if (status === "LOW_STOCK") lowStockItems++;
      else if (status === "OUT_OF_STOCK") outOfStockItems++;
      else inStockItems++;
    }
  }

  // 5. Build Summary
  const summary = buildInventorySummary({
    totalProducts,
    totalUnits,
    totalInventoryValue,
    inTransitItems: inTransitItemsCount,
    lowStockItems,
    outOfStockItems
  });

  // 6. Build Category Distribution
  const categoryDistribution = buildCategoryDistribution(categoryMap, totalInventoryValue);

  // 7. Stock Status & Transparent Health Indicator
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
      { status: "IN_TRANSIT", label: "In Transit", count: inTransitItemsCount, percentage: inTransitPct }
    ],
    healthScore,
    healthRating
  };

  // 8. Build Store Summary
  const storeSummary = buildStoreSummary(allStores, storeStockMap);

  // 9. Historical Inventory Movements & Trend
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
      totalProducts,
      inStockItems,
      lowStockItems,
      outOfStockItems,
      inTransitItems: inTransitItemsCount
    },
    now
  );

  const analytics: InventoryAnalyticsDto = {
    inventoryTrend,
    categoryDistribution,
    stockStatus,
    storeSummary
  };

  // 10. Products Table: Pagination and Filtering
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize ?? 25));

  let items: InventoryProductItemDto[] = [];
  let total = 0;
  let totalPages = 1;

  if (!isMultiStore) {
    const tableWhere: Prisma.InventoryWhereInput = { ...baseWhere };
    if (targetStatus !== "ALL") {
      tableWhere.id = { in: matchingStatusIds };
    }

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

    const built = buildProductItems({
      isMultiStore: false,
      productAggMap,
      paginatedStoreRecords: paginatedRecords,
      totalStoreCount,
      storeCoverageMap: coverageMap,
      targetStatus,
      tab: params.tab,
      page,
      pageSize
    });
    items = built.items;
  } else {
    const built = buildProductItems({
      isMultiStore: true,
      productAggMap,
      totalStoreCount,
      targetStatus,
      tab: params.tab,
      page,
      pageSize
    });
    items = built.items;
    total = built.total;
    totalPages = built.totalPages;
  }

  // 11. Map Recent Movements
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
// 5. INVENTORY DETAIL SERVICE (Strict ID semantics — Inventory Record ID only)
// ============================================================================

export async function getInventoryById(inventoryId: string): Promise<InventoryDetailData> {
  const inv = await prisma.inventory.findUnique({
    where: { id: inventoryId },
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
    throw new NotFoundError(`Inventory record with ID "${inventoryId}" not found`);
  }

  const onHand = inv.onHand;
  const reserved = inv.reserved;
  const available = calculateAvailableStock(onHand, reserved);
  const costPrice = Number(inv.product.costPrice);
  const sellingPrice = Number(inv.product.sellingPrice);
  const inventoryValue = calculateInventoryValue(onHand, costPrice);
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
