import { Prisma } from "@prisma/client";
import type {
  InventorySummaryDto,
  InventoryTrendPointDto,
  CategoryDistributionDto,
  StoreInventorySummaryDto,
  InventoryMovementDto
} from "./inventory.types.js";

// ============================================================================
// 1. BUSINESS FORMULAS & PURE LOCAL CALCULATION HELPERS
// ============================================================================

/**
 * Calculates physical stock available for sale or transfer.
 * available = Math.max(0, onHand - reserved)
 * Note: available stock is never persisted directly in the database.
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
 * Valuation = onHand * costPrice (strictly never uses selling price)
 */
export function calculateInventoryValue(quantity: number, costPrice: number): number {
  return Math.max(0, quantity * costPrice);
}

/**
 * Unified status and tab resolver.
 * Maps status query params and tab selections to a single internal target status.
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
 * Pure presentation/derived metric; does not alter financial or inventory records.
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
 * Pure presentation/derived metric for demo dashboards.
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

/**
 * Builds derived/demo historical inventory trend points over the past 12 months.
 * Reconstructed backwards from the authoritative current snapshot and logged historical movements.
 * Note: Represents derived demo trends rather than audited financial balances.
 */
export function buildInventoryTrend(
  historicalMovements: Array<{ quantity: number; unitCost: Prisma.Decimal | number | null; productId: string; createdAt: Date }>,
  currentSnapshot: {
    totalUnits: number;
    totalInventoryValue: number;
    totalProducts: number;
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
      skuCount: monthSkus
    });

    runningUnits = Math.max(0, runningUnits - netUnitsThisMonth);
    runningVal = Math.max(0, runningVal - netValThisMonth);
  }

  return rawTrendReversed.reverse();
}
