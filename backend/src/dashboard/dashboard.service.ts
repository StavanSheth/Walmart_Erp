import { prisma } from "../common/database/prisma.js";
import { NotFoundError } from "../common/errors/app-error.js";
import type { DashboardQueryParams } from "./dashboard.schemas.js";
import type {
  DashboardOverviewData,
  ChartSeriesPoint,
  StorePerformanceItem,
  RecentInventoryActivityItem,
  TopCategoryItem,
  DashboardAlertItem,
  DesktopSummary,
  MobileSummary,
  SalesOverviewData,
  InventoryDistributionData
} from "./dashboard.types.js";

export async function getDashboardOverview(
  params: DashboardQueryParams
): Promise<DashboardOverviewData> {
  // 1. Resolve default demo organization
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

  // 2. Consistent Date Boundaries for Selected Period
  const period = params.period ?? "30d";
  const now = new Date();
  let currentStart: Date;
  let currentEnd = now;
  let previousStart: Date;
  let previousEnd: Date;

  if (period === "today") {
    // start = beginning of current local business day, end = current time
    currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    currentEnd = now;
    // previous period = immediately preceding day
    previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - 1);
    previousEnd = currentStart;
  } else if (period === "7d") {
    // current period = last 7 days
    currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    currentEnd = now;
    // previous period = immediately preceding 7 days
    previousStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    previousEnd = currentStart;
  } else {
    // 30d: current period = last 30 days
    currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    currentEnd = now;
    // previous period = immediately preceding 30 days
    previousStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    previousEnd = currentStart;
  }

  const storeFilter = params.storeId ? { storeId: params.storeId } : {};

  // 3. Concurrent Database Queries
  const [
    // Current period sales aggregation
    currentSalesAgg,
    // Previous period sales aggregation
    previousSalesAgg,
    // Active stores count
    activeStoresCount,
    // Active stores list
    storesList,
    // Store grouped sales in current period
    storeGroupedSales,
    // Inventory with product details
    inventoryRecords,
    // Active catalog products count
    totalProductsCount,
    // Completed sales orders in current period for trend
    completedSalesOrders,
    // Purchase orders in current period for trend
    purchaseOrders,
    // Recent inventory movements (5 records)
    recentMovements,
    // Active categories
    categoriesList,
    // Pending purchase orders count
    pendingPoCount,
    // Today's actual sales aggregation
    todaySalesAgg
  ] = await Promise.all([
    // Current period completed sales
    prisma.salesOrder.aggregate({
      where: {
        organizationId,
        status: "COMPLETED",
        ...storeFilter,
        createdAt: {
          gte: currentStart,
          lte: currentEnd
        }
      },
      _sum: {
        total: true
      },
      _count: {
        id: true
      }
    }),

    // Previous period completed sales for comparison
    prisma.salesOrder.aggregate({
      where: {
        organizationId,
        status: "COMPLETED",
        ...storeFilter,
        createdAt: {
          gte: previousStart,
          lt: previousEnd
        }
      },
      _sum: {
        total: true
      }
    }),

    // Active stores count
    prisma.store.count({
      where: {
        organizationId,
        status: "ACTIVE",
        ...(params.storeId ? { id: params.storeId } : {})
      }
    }),

    // Stores list
    prisma.store.findMany({
      where: {
        organizationId,
        status: "ACTIVE",
        ...(params.storeId ? { id: params.storeId } : {})
      },
      select: {
        id: true,
        name: true
      }
    }),

    // Store sales grouped in current period
    prisma.salesOrder.groupBy({
      by: ["storeId"],
      where: {
        organizationId,
        status: "COMPLETED",
        ...storeFilter,
        createdAt: {
          gte: currentStart,
          lte: currentEnd
        }
      },
      _sum: {
        total: true
      },
      _count: {
        id: true
      }
    }),

    // Inventory records
    prisma.inventory.findMany({
      where: {
        organizationId,
        ...storeFilter
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            costPrice: true,
            reorderLevel: true,
            categoryId: true
          }
        },
        store: {
          select: {
            id: true,
            name: true
          }
        }
      }
    }),

    // Catalog products count
    prisma.product.count({
      where: {
        organizationId,
        status: "ACTIVE"
      }
    }),

    // Completed sales orders for sales trend in current period
    prisma.salesOrder.findMany({
      where: {
        organizationId,
        status: "COMPLETED",
        ...storeFilter,
        createdAt: {
          gte: currentStart,
          lte: currentEnd
        }
      },
      select: {
        createdAt: true,
        total: true
      },
      orderBy: {
        createdAt: "asc"
      }
    }),

    // Purchase orders in current period
    prisma.purchaseOrder.findMany({
      where: {
        organizationId,
        ...storeFilter,
        createdAt: {
          gte: currentStart,
          lte: currentEnd
        }
      },
      select: {
        createdAt: true,
        total: true
      },
      orderBy: {
        createdAt: "asc"
      }
    }),

    // Recent inventory movements (take 5)
    prisma.inventoryMovement.findMany({
      where: {
        organizationId,
        ...storeFilter
      },
      take: 5,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        product: {
          select: {
            name: true
          }
        },
        store: {
          select: {
            name: true
          }
        }
      }
    }),

    // Categories
    prisma.category.findMany({
      where: {
        organizationId,
        status: "ACTIVE"
      },
      select: {
        id: true,
        name: true
      }
    }),

    // Pending purchase orders count
    prisma.purchaseOrder.count({
      where: {
        organizationId,
        ...storeFilter,
        status: {
          in: ["DRAFT", "ORDERED", "PARTIALLY_RECEIVED"]
        }
      }
    }),

    // Actual today's sales (calendar day)
    prisma.salesOrder.aggregate({
      where: {
        organizationId,
        status: "COMPLETED",
        ...storeFilter,
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
          lte: now
        }
      },
      _sum: {
        total: true
      }
    })
  ]);

  // 4. Inventory Calculations
  let totalUnits = 0;
  let inStockUnits = 0;
  let lowStockUnits = 0;
  let outOfStockUnits = 0;
  let lowStockItemCount = 0;
  let outOfStockItemCount = 0;
  let totalInventoryValue = 0;
  const productIds = new Set<string>();
  const categoryValueMap = new Map<string, number>();

  const outOfStockRecords: typeof inventoryRecords = [];
  const lowStockRecords: typeof inventoryRecords = [];

  for (const inv of inventoryRecords) {
    productIds.add(inv.productId);
    totalUnits += inv.onHand;
    const itemCost = Number(inv.product.costPrice);
    const stockVal = inv.onHand * itemCost;
    totalInventoryValue += stockVal;

    if (inv.product.categoryId) {
      const currentCatVal = categoryValueMap.get(inv.product.categoryId) ?? 0;
      categoryValueMap.set(inv.product.categoryId, currentCatVal + stockVal);
    }

    const available = inv.onHand - inv.reserved;
    if (available <= 0) {
      outOfStockItemCount++;
      outOfStockUnits += Math.max(0, inv.onHand);
      outOfStockRecords.push(inv);
    } else if (available <= inv.product.reorderLevel) {
      lowStockItemCount++;
      lowStockUnits += inv.onHand;
      lowStockRecords.push(inv);
    } else {
      inStockUnits += inv.onHand;
    }
  }

  const inStockPercentage = totalUnits > 0 ? Math.round((inStockUnits / totalUnits) * 100) : 0;
  const lowStockPercentage = totalUnits > 0 ? Math.round((lowStockUnits / totalUnits) * 100) : 0;
  const outOfStockPercentage = totalUnits > 0 ? Math.max(0, 100 - inStockPercentage - lowStockPercentage) : 0;

  const inventoryDistribution: InventoryDistributionData = {
    totalUnits,
    inStock: inStockUnits,
    inStockPercentage,
    lowStock: lowStockUnits,
    lowStockPercentage,
    outOfStock: outOfStockUnits,
    outOfStockPercentage
  };

  // 5. Desktop Summary KPIs
  const totalProducts = params.storeId
    ? productIds.size
    : totalProductsCount || productIds.size;

  const desktopSummary: DesktopSummary = {
    totalProducts,
    inStockUnits,
    lowStockItems: lowStockItemCount,
    outOfStockItems: outOfStockItemCount,
    totalStores: activeStoresCount
  };

  // 6. Mobile Summary KPIs
  const totalSalesToday = Math.round(Number(todaySalesAgg._sum.total ?? 0) * 100) / 100;
  const totalOrdersCount = currentSalesAgg._count.id;

  const mobileSummary: MobileSummary = {
    totalSalesToday,
    totalOrders: totalOrdersCount,
    activeStores: activeStoresCount,
    inventoryValue: Math.round(totalInventoryValue * 100) / 100
  };

  // 7. Sales Overview (Current vs Database-Calculated Previous Period)
  const currentSalesTotal = Number(currentSalesAgg._sum.total ?? 0);
  const previousSalesTotal = Number(previousSalesAgg._sum.total ?? 0);

  const changePercent =
    previousSalesTotal === 0
      ? 0
      : Math.round(((currentSalesTotal - previousSalesTotal) / previousSalesTotal) * 1000) / 10;

  const salesMap = new Map<string, { amount: number; orders: number }>();
  for (const s of completedSalesOrders) {
    const k = s.createdAt.toISOString().slice(0, 10);
    const curr = salesMap.get(k) ?? { amount: 0, orders: 0 };
    curr.amount = Math.round((curr.amount + Number(s.total)) * 100) / 100;
    curr.orders += 1;
    salesMap.set(k, curr);
  }

  const purchaseMap = new Map<string, { amount: number; orders: number }>();
  for (const p of purchaseOrders) {
    const k = p.createdAt.toISOString().slice(0, 10);
    const curr = purchaseMap.get(k) ?? { amount: 0, orders: 0 };
    curr.amount = Math.round((curr.amount + Number(p.total)) * 100) / 100;
    curr.orders += 1;
    purchaseMap.set(k, curr);
  }

  const allDates = Array.from(new Set([...salesMap.keys(), ...purchaseMap.keys()])).sort();
  const salesSeries: ChartSeriesPoint[] = [];
  const purchasesSeries: ChartSeriesPoint[] = [];

  for (const date of allDates) {
    const s = salesMap.get(date);
    salesSeries.push({
      date,
      amount: s?.amount ?? 0,
      orders: s?.orders ?? 0
    });
    const p = purchaseMap.get(date);
    purchasesSeries.push({
      date,
      amount: p?.amount ?? 0,
      orders: p?.orders ?? 0
    });
  }

  const salesOverview: SalesOverviewData = {
    totalSales: Math.round(currentSalesTotal * 100) / 100,
    previousPeriodSales: Math.round(previousSalesTotal * 100) / 100,
    changePercent,
    sales: salesSeries,
    purchases: purchasesSeries
  };

  // 8. Store Performance (Neutral metrics: storeName, sales, orders, AOV)
  const storeSalesMap = new Map(
    storeGroupedSales.map((item) => [
      item.storeId,
      {
        sales: Number(item._sum.total ?? 0),
        orders: item._count.id
      }
    ])
  );

  const storePerformance: StorePerformanceItem[] = storesList
    .map((store) => {
      const stats = storeSalesMap.get(store.id) ?? { sales: 0, orders: 0 };
      const aov =
        stats.orders > 0 ? Math.round((stats.sales / stats.orders) * 100) / 100 : 0;
      return {
        storeId: store.id,
        storeName: store.name,
        sales: Math.round(stats.sales * 100) / 100,
        orders: stats.orders,
        averageOrderValue: aov
      };
    })
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // 9. Recent Inventory Activity
  const activityMap: Record<
    string,
    { label: string; color: "success" | "warning" | "danger" | "info" }
  > = {
    PURCHASE: { label: "Stock Added", color: "success" },
    SALE: { label: "Stock Sold", color: "info" },
    ADJUSTMENT: { label: "Stock Updated", color: "warning" },
    RETURN: { label: "Stock Returned", color: "warning" },
    TRANSFER_IN: { label: "Stock Received", color: "success" },
    TRANSFER_OUT: { label: "Stock Transferred", color: "info" },
    OPENING: { label: "Opening Stock", color: "info" }
  };

  const recentActivity: RecentInventoryActivityItem[] = recentMovements.map(
    (mv) => {
      const meta = activityMap[mv.type] ?? {
        label: "Stock Movement",
        color: "info" as const
      };
      return {
        id: mv.id,
        productName: mv.product.name,
        storeName: mv.store.name,
        activityType: mv.type,
        activityLabel: `${meta.label} (${Math.abs(mv.quantity)} units)`,
        quantity: mv.quantity,
        time: mv.createdAt.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit"
        }),
        statusColor: meta.color
      };
    }
  );

  // 10. Top Categories by Stock Value
  const sortedCategories = categoriesList
    .map((cat) => {
      const stockVal = categoryValueMap.get(cat.id) ?? 0;
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        stockValue: Math.round(stockVal)
      };
    })
    .filter((c) => c.stockValue > 0)
    .sort((a, b) => b.stockValue - a.stockValue)
    .slice(0, 5);

  const highestCatVal = sortedCategories[0]?.stockValue || 1;
  const topCategories: TopCategoryItem[] = sortedCategories.map((c) => ({
    ...c,
    relativePercentage: Math.round((c.stockValue / highestCatVal) * 100)
  }));

  // 11. Alerts & Notifications (100% Real Database Derived)
  const inventoryAlerts: DashboardAlertItem[] = [];

  // Out of stock alerts
  for (const inv of outOfStockRecords.slice(0, 2)) {
    inventoryAlerts.push({
      id: `alert-oos-${inv.id}`,
      title: `Out of stock: ${inv.product.name} (${inv.store.name})`,
      type: "danger",
      timestamp: "Immediate reorder required"
    });
  }

  // Low stock alerts
  for (const inv of lowStockRecords.slice(0, 2)) {
    const avail = inv.onHand - inv.reserved;
    inventoryAlerts.push({
      id: `alert-low-${inv.id}`,
      title: `Low stock: ${inv.product.name} (${avail} units in ${inv.store.name})`,
      type: "warning",
      timestamp: "Below reorder threshold"
    });
  }

  // Pending purchase orders alert
  if (pendingPoCount > 0) {
    inventoryAlerts.push({
      id: "alert-po-pending",
      title: `${pendingPoCount} purchase ${pendingPoCount === 1 ? "order" : "orders"} awaiting receipt / approval`,
      type: "info",
      timestamp: "Procurement pending"
    });
  }

  return {
    summary: desktopSummary,
    mobileSummary,
    salesOverview,
    inventoryDistribution,
    storePerformance,
    inventoryAlerts,
    recentActivity,
    topCategories
  };
}
