import { Prisma } from "@prisma/client";
import { prisma } from "../common/database/prisma.js";
import { NotFoundError } from "../common/errors/app-error.js";
import type {
  StoresQueryParams,
  StoresOverviewQueryParams,
  StoresNetworkQueryParams
} from "./stores.schemas.js";
import type {
  StoreSummary,
  StoreNetworkPoint,
  StoresOverviewData,
  StoreDetailData,
  TopPerformerStore,
  StoreAlertItem,
  RegionOption
} from "./stores.types.js";

async function getDemoOrganizationId(): Promise<string> {
  const org = await prisma.organization.findFirst({
    where: { status: "ACTIVE" },
    select: { id: true }
  });
  if (org) return org.id;

  const fallback = await prisma.organization.findFirst({
    select: { id: true }
  });
  if (fallback) return fallback.id;

  throw new NotFoundError("No organization found in database");
}

function getPeriodRange(period = "30d", now = new Date()) {
  let currentStart: Date;
  const currentEnd = now;
  let previousStart: Date;
  let previousEnd: Date;

  if (period === "7d") {
    currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    previousStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    previousEnd = currentStart;
  } else if (period === "90d") {
    currentStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    previousStart = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    previousEnd = currentStart;
  } else if (period === "ytd") {
    currentStart = new Date(now.getFullYear(), 0, 1);
    previousStart = new Date(now.getFullYear() - 1, 0, 1);
    previousEnd = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  } else {
    // 30d default
    currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    previousStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    previousEnd = currentStart;
  }

  return { currentStart, currentEnd, previousStart, previousEnd };
}

function calculateTrend(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export async function getStoresOverview(
  params: StoresOverviewQueryParams
): Promise<StoresOverviewData> {
  const organizationId = await getDemoOrganizationId();
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const { currentStart, currentEnd, previousStart, previousEnd } = getPeriodRange(params.period, now);

  // Region and status filters
  const storeWhere: Prisma.StoreWhereInput = {
    organizationId,
    ...(params.regionId && params.regionId !== "ALL" ? { regionId: params.regionId } : {}),
    ...(params.status && params.status !== "ALL" ? { status: params.status } : {}),
    ...(params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" } },
            { code: { contains: params.search, mode: "insensitive" } },
            { city: { contains: params.search, mode: "insensitive" } },
            { state: { contains: params.search, mode: "insensitive" } },
            { address: { contains: params.search, mode: "insensitive" } },
            { manager: { name: { contains: params.search, mode: "insensitive" } } }
          ]
        }
      : {})
  };

  // Base scope for KPIs (only region filtered, not status filtered, so user sees full breakdown)
  const kpiStoreWhere: Prisma.StoreWhereInput = {
    organizationId,
    ...(params.regionId && params.regionId !== "ALL" ? { regionId: params.regionId } : {})
  };

  // Parallel Execution: Fetch stores, regions, sales aggregation, and alerts
  const [
    allStores,
    totalStoresCount,
    operationalCount,
    maintenanceCount,
    newStoresCount,
    regionsList,
    currentSalesOrdersGrouped,
    previousSalesOrdersGrouped,
    currentUnitsSoldAgg,
    previousUnitsSoldAgg,
    inventoryStats,
    lowStockInventories
  ] = await Promise.all([
    // 1. All stores matching filter
    prisma.store.findMany({
      where: storeWhere,
      include: {
        region: { select: { id: true, name: true, code: true } },
        manager: { select: { id: true, name: true, email: true } }
      },
      orderBy: { name: "asc" }
    }),

    // 2. KPI Counts
    prisma.store.count({ where: kpiStoreWhere }),
    prisma.store.count({ where: { ...kpiStoreWhere, status: "ACTIVE" } }),
    prisma.store.count({ where: { ...kpiStoreWhere, status: "MAINTENANCE" } }),
    prisma.store.count({ where: { ...kpiStoreWhere, createdAt: { gte: startOfYear } } }),

    // 3. Regions in Org with store counts
    prisma.region.findMany({
      where: { organizationId },
      include: {
        _count: {
          select: { stores: true }
        }
      },
      orderBy: { name: "asc" }
    }),

    // 4. Completed Sales Orders in current period grouped by store
    prisma.salesOrder.groupBy({
      by: ["storeId"],
      where: {
        organizationId,
        status: "COMPLETED",
        createdAt: { gte: currentStart, lte: currentEnd },
        store: kpiStoreWhere
      },
      _sum: { total: true },
      _count: { id: true }
    }),

    // 5. Completed Sales Orders in previous period grouped by store
    prisma.salesOrder.groupBy({
      by: ["storeId"],
      where: {
        organizationId,
        status: "COMPLETED",
        createdAt: { gte: previousStart, lt: previousEnd },
        store: kpiStoreWhere
      },
      _sum: { total: true },
      _count: { id: true }
    }),

    // 6. Units sold in current period
    prisma.salesOrderItem.aggregate({
      where: {
        salesOrder: {
          organizationId,
          status: "COMPLETED",
          createdAt: { gte: currentStart, lte: currentEnd },
          store: kpiStoreWhere
        }
      },
      _sum: { quantity: true }
    }),

    // 7. Units sold in previous period
    prisma.salesOrderItem.aggregate({
      where: {
        salesOrder: {
          organizationId,
          status: "COMPLETED",
          createdAt: { gte: previousStart, lt: previousEnd },
          store: kpiStoreWhere
        }
      },
      _sum: { quantity: true }
    }),

    // 8. Inventory fill rate stats (in-stock items vs total tracked items)
    prisma.inventory.findMany({
      where: {
        organizationId,
        store: kpiStoreWhere
      },
      select: {
        storeId: true,
        onHand: true,
        reserved: true,
        product: {
          select: {
            costPrice: true,
            reorderLevel: true
          }
        }
      }
    }),

    // 9. Low stock items for derived alerts
    prisma.inventory.findMany({
      where: {
        organizationId,
        store: kpiStoreWhere
      },
      include: {
        product: { select: { id: true, name: true, sku: true, reorderLevel: true, unit: true } },
        store: { select: { id: true, name: true, city: true } }
      },
      take: 20
    })
  ]);

  // Compute Sales by Store Map
  const currentSalesMap = new Map<string, { total: number; count: number }>();
  for (const s of currentSalesOrdersGrouped) {
    currentSalesMap.set(s.storeId, {
      total: Number(s._sum.total || 0),
      count: s._count.id
    });
  }

  const previousSalesMap = new Map<string, { total: number; count: number }>();
  for (const s of previousSalesOrdersGrouped) {
    previousSalesMap.set(s.storeId, {
      total: Number(s._sum.total || 0),
      count: s._count.id
    });
  }

  // Compute Store Inventory Valuation Map
  const storeInventoryMap = new Map<string, { value: number; totalSkus: number; inStockSkus: number }>();
  for (const inv of inventoryStats) {
    const existing = storeInventoryMap.get(inv.storeId) || { value: 0, totalSkus: 0, inStockSkus: 0 };
    const costPrice = Number(inv.product.costPrice || 0);
    const available = inv.onHand - inv.reserved;
    existing.value += Math.max(0, inv.onHand * costPrice);
    existing.totalSkus += 1;
    if (available > 0) {
      existing.inStockSkus += 1;
    }
    storeInventoryMap.set(inv.storeId, existing);
  }

  // Network Points for Map
  const network: StoreNetworkPoint[] = allStores.map((s) => {
    const sales = currentSalesMap.get(s.id)?.total || 0;
    const inv = storeInventoryMap.get(s.id)?.value || 0;
    const isNewThisYear = new Date(s.createdAt) >= startOfYear;

    return {
      id: s.id,
      name: s.name,
      code: s.code,
      latitude: s.latitude ? Number(s.latitude) : null,
      longitude: s.longitude ? Number(s.longitude) : null,
      status: s.status,
      city: s.city,
      state: s.state,
      region: s.region ? { id: s.region.id, name: s.region.name } : null,
      salesRevenue: Math.round(sales * 100) / 100,
      inventoryValue: Math.round(inv * 100) / 100,
      isNewThisYear
    };
  });

  // Geo Quality
  const mappedStores = network.filter((p) => p.latitude != null && p.longitude != null).length;
  const unmappedStores = network.length - mappedStores;

  // Top Performing Stores (ranked by completed SalesOrder.total DESC, limit 3)
  const rankedStores: TopPerformerStore[] = allStores
    .map((s) => {
      const currentSales = currentSalesMap.get(s.id)?.total || 0;
      const prevSales = previousSalesMap.get(s.id)?.total || 0;
      const salesChangePct = calculateTrend(currentSales, prevSales);
      const orderCount = currentSalesMap.get(s.id)?.count || 0;

      return {
        id: s.id,
        name: s.name,
        code: s.code,
        city: s.city,
        state: s.state,
        regionName: s.region?.name || "General",
        image: s.image,
        status: s.status,
        salesRevenue: Math.round(currentSales * 100) / 100,
        salesChangePct,
        orderCount
      };
    })
    .sort((a, b) => {
      if (b.salesRevenue !== a.salesRevenue) {
        return b.salesRevenue - a.salesRevenue;
      }
      return a.name.localeCompare(b.name);
    })
    .slice(0, 3);

  // Performance Summary calculations
  const totalSalesRevenue = currentSalesOrdersGrouped.reduce(
    (acc, curr) => acc + Number(curr._sum.total || 0),
    0
  );
  const totalPrevSalesRevenue = previousSalesOrdersGrouped.reduce(
    (acc, curr) => acc + Number(curr._sum.total || 0),
    0
  );
  const salesRevenueChangePct = calculateTrend(totalSalesRevenue, totalPrevSalesRevenue);

  const unitsSold = currentUnitsSoldAgg._sum.quantity || 0;
  const prevUnitsSold = previousUnitsSoldAgg._sum.quantity || 0;
  const unitsSoldChangePct = calculateTrend(unitsSold, prevUnitsSold);

  // Fill Rate: inStockSkus / totalSkus * 100 across stores
  let globalInStockSkus = 0;
  let globalTotalSkus = 0;
  for (const inv of inventoryStats) {
    globalTotalSkus += 1;
    if (inv.onHand - inv.reserved > 0) {
      globalInStockSkus += 1;
    }
  }
  const inventoryFillRate =
    globalTotalSkus > 0 ? Math.round((globalInStockSkus / globalTotalSkus) * 1000) / 10 : 100;

  // Alerts logic: derived from real operational conditions
  const alerts: StoreAlertItem[] = [];

  // A. Maintenance stores alerts
  const maintenanceStores = allStores.filter((s) => s.status === "MAINTENANCE");
  for (const mStore of maintenanceStores) {
    alerts.push({
      id: `alert-maint-${mStore.id}`,
      type: "MAINTENANCE",
      severity: "WARNING",
      title: `Maintenance scheduled — ${mStore.name}`,
      description: `Facility maintenance in progress at ${mStore.city || "location"}. Operational checks underway.`,
      storeId: mStore.id,
      storeName: mStore.name,
      createdAt: mStore.updatedAt.toISOString()
    });
  }

  // B. Low stock alerts (onHand <= reorderLevel)
  for (const inv of lowStockInventories) {
    if (inv.onHand <= inv.product.reorderLevel) {
      const isOutOfStock = inv.onHand === 0;
      alerts.push({
        id: `alert-stock-${inv.id}`,
        type: isOutOfStock ? "OUT_OF_STOCK" : "LOW_STOCK",
        severity: isOutOfStock ? "CRITICAL" : "WARNING",
        title: isOutOfStock
          ? `Out of stock: ${inv.product.name}`
          : `Low stock: ${inv.product.name} (${inv.onHand} ${inv.product.unit || "units"})`,
        description: `Current inventory at ${inv.store.name} (${inv.store.city}) is below safety threshold (${inv.product.reorderLevel}).`,
        storeId: inv.store.id,
        storeName: inv.store.name,
        createdAt: inv.updatedAt.toISOString()
      });
      if (alerts.length >= 5) break;
    }
  }

  // C. New store alerts
  const newStoresList = allStores.filter((s) => new Date(s.createdAt) >= startOfYear);
  for (const nStore of newStoresList) {
    if (alerts.length >= 6) break;
    alerts.push({
      id: `alert-new-${nStore.id}`,
      type: "NEW_STORE",
      severity: "INFO",
      title: `Store network active — ${nStore.name}`,
      description: `New retail location operational in ${nStore.city || ""}, ${nStore.state || ""}.`,
      storeId: nStore.id,
      storeName: nStore.name,
      createdAt: nStore.createdAt.toISOString()
    });
  }

  // Sort alerts by urgency (CRITICAL > WARNING > INFO > SUCCESS)
  const severityRank: Record<string, number> = {
    CRITICAL: 1,
    WARNING: 2,
    INFO: 3,
    SUCCESS: 4
  };
  alerts.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
  const trimmedAlerts = alerts.slice(0, 5);

  const regions: RegionOption[] = regionsList.map((r) => ({
    id: r.id,
    name: r.name,
    code: r.code,
    storeCount: r._count.stores
  }));

  return {
    summary: {
      totalStores: totalStoresCount,
      operationalStores: operationalCount,
      maintenanceStores: maintenanceCount,
      newStores: newStoresCount,
      trends: {
        // Safe trend calculation
        totalStoresChangePct: null, // Stable network
        operationalChangePct: null,
        maintenanceChangePct: null,
        newStoresChangePct: null
      }
    },
    geoQuality: {
      totalStores: network.length,
      mappedStores,
      unmappedStores
    },
    regions,
    network,
    topPerformers: rankedStores,
    performance: {
      period: params.period || "30d",
      salesRevenue: Math.round(totalSalesRevenue * 100) / 100,
      salesRevenueChangePct,
      unitsSold,
      unitsSoldChangePct,
      inventoryFillRate,
      inventoryFillRateChangePct: null,
      activeStoresCount: operationalCount
    },
    alerts: trimmedAlerts
  };
}

export async function getStoresNetwork(
  params: StoresNetworkQueryParams
): Promise<{ stores: StoreNetworkPoint[] }> {
  const organizationId = await getDemoOrganizationId();
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const storeWhere: Prisma.StoreWhereInput = {
    organizationId,
    ...(params.regionId && params.regionId !== "ALL" ? { regionId: params.regionId } : {}),
    ...(params.status && params.status !== "ALL" ? { status: params.status } : {}),
    ...(params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" } },
            { code: { contains: params.search, mode: "insensitive" } },
            { city: { contains: params.search, mode: "insensitive" } },
            { state: { contains: params.search, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const stores = await prisma.store.findMany({
    where: storeWhere,
    include: {
      region: { select: { id: true, name: true } }
    },
    orderBy: { name: "asc" }
  });

  // Attach quick sales total and inventory value
  const storeIds = stores.map((s) => s.id);
  const [salesByStore, inventoryByStore] = await Promise.all([
    prisma.salesOrder.groupBy({
      by: ["storeId"],
      where: {
        organizationId,
        storeId: { in: storeIds },
        status: "COMPLETED"
      },
      _sum: { total: true }
    }),
    prisma.inventory.findMany({
      where: {
        organizationId,
        storeId: { in: storeIds }
      },
      select: {
        storeId: true,
        onHand: true,
        product: { select: { costPrice: true } }
      }
    })
  ]);

  const salesMap = new Map<string, number>();
  for (const s of salesByStore) {
    salesMap.set(s.storeId, Number(s._sum.total || 0));
  }

  const invMap = new Map<string, number>();
  for (const inv of inventoryByStore) {
    const cur = invMap.get(inv.storeId) || 0;
    const cost = Number(inv.product.costPrice || 0);
    invMap.set(inv.storeId, cur + Math.max(0, inv.onHand * cost));
  }

  const networkPoints: StoreNetworkPoint[] = stores.map((s) => ({
    id: s.id,
    name: s.name,
    code: s.code,
    latitude: s.latitude ? Number(s.latitude) : null,
    longitude: s.longitude ? Number(s.longitude) : null,
    status: s.status,
    city: s.city,
    state: s.state,
    region: s.region ? { id: s.region.id, name: s.region.name } : null,
    salesRevenue: Math.round((salesMap.get(s.id) || 0) * 100) / 100,
    inventoryValue: Math.round((invMap.get(s.id) || 0) * 100) / 100,
    isNewThisYear: new Date(s.createdAt) >= startOfYear
  }));

  return { stores: networkPoints };
}

export async function listStores(
  params: StoresQueryParams
): Promise<{ stores: StoreSummary[]; total: number; page: number; pageSize: number }> {
  const organizationId = await getDemoOrganizationId();
  const { page = 1, pageSize = 20, search, regionId, status } = params;
  const skip = (page - 1) * pageSize;

  const where: Prisma.StoreWhereInput = {
    organizationId,
    ...(regionId && regionId !== "ALL" ? { regionId } : {}),
    ...(status && status !== "ALL" ? { status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { code: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            { state: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { manager: { name: { contains: search, mode: "insensitive" } } }
          ]
        }
      : {})
  };

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      include: {
        region: { select: { id: true, name: true, code: true } },
        manager: { select: { id: true, name: true, email: true } }
      },
      orderBy: { name: "asc" },
      skip,
      take: pageSize
    }),
    prisma.store.count({ where })
  ]);

  const storeSummaries: StoreSummary[] = stores.map((s) => ({
    id: s.id,
    organizationId: s.organizationId,
    regionId: s.regionId,
    name: s.name,
    code: s.code,
    address: s.address,
    city: s.city,
    state: s.state,
    country: s.country,
    pincode: s.pincode,
    phone: s.phone,
    email: s.email,
    status: s.status,
    image: s.image,
    latitude: s.latitude ? Number(s.latitude) : null,
    longitude: s.longitude ? Number(s.longitude) : null,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    region: s.region,
    manager: s.manager
  }));

  return { stores: storeSummaries, total, page, pageSize };
}

export async function getStoreById(storeId: string): Promise<StoreDetailData> {
  const organizationId = await getDemoOrganizationId();

  const store = await prisma.store.findFirst({
    where: { id: storeId, organizationId },
    include: {
      region: { select: { id: true, name: true, code: true } },
      manager: { select: { id: true, name: true, email: true } }
    }
  });

  if (!store) {
    throw new NotFoundError(`Store with ID ${storeId} not found`);
  }

  // Fetch sales metrics, recent orders, inventory metrics, and low stock items
  const [salesAgg, recentOrders, inventoryItems] = await Promise.all([
    prisma.salesOrder.aggregate({
      where: {
        organizationId,
        storeId,
        status: "COMPLETED"
      },
      _sum: { total: true },
      _count: { id: true }
    }),

    prisma.salesOrder.findMany({
      where: { organizationId, storeId },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5
    }),

    prisma.inventory.findMany({
      where: { organizationId, storeId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            costPrice: true,
            reorderLevel: true,
            unit: true
          }
        }
      }
    })
  ]);

  const salesRevenue = Number(salesAgg._sum.total || 0);
  const completedOrders = salesAgg._count.id;
  const averageOrderValue = completedOrders > 0 ? Math.round((salesRevenue / completedOrders) * 100) / 100 : 0;

  let totalSkus = 0;
  let totalUnits = 0;
  let inventoryValuation = 0;
  const lowStockItems: StoreDetailData["lowStockItems"] = [];

  for (const inv of inventoryItems) {
    totalSkus += 1;
    totalUnits += inv.onHand;
    const cost = Number(inv.product.costPrice || 0);
    inventoryValuation += Math.max(0, inv.onHand * cost);

    if (inv.onHand <= inv.product.reorderLevel) {
      lowStockItems.push({
        id: inv.id,
        productName: inv.product.name,
        sku: inv.product.sku,
        onHand: inv.onHand,
        reorderLevel: inv.product.reorderLevel,
        unit: inv.product.unit || "units"
      });
    }
  }

  return {
    store: {
      id: store.id,
      organizationId: store.organizationId,
      regionId: store.regionId,
      name: store.name,
      code: store.code,
      address: store.address,
      city: store.city,
      state: store.state,
      country: store.country,
      pincode: store.pincode,
      phone: store.phone,
      email: store.email,
      status: store.status,
      image: store.image,
      latitude: store.latitude ? Number(store.latitude) : null,
      longitude: store.longitude ? Number(store.longitude) : null,
      createdAt: store.createdAt.toISOString(),
      updatedAt: store.updatedAt.toISOString(),
      region: store.region,
      manager: store.manager
    },
    metrics: {
      salesRevenue: Math.round(salesRevenue * 100) / 100,
      completedOrders,
      averageOrderValue,
      totalSkus,
      totalUnits,
      inventoryValuation: Math.round(inventoryValuation * 100) / 100,
      lowStockCount: lowStockItems.length
    },
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customer?.name || "Retail Customer",
      total: Number(o.total),
      status: o.status,
      createdAt: o.createdAt.toISOString()
    })),
    lowStockItems: lowStockItems.slice(0, 5)
  };
}
