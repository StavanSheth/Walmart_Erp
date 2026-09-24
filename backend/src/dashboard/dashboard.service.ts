import { Prisma } from "@prisma/client";
import { prisma } from "../common/database/prisma.js";
import { NotFoundError } from "../common/errors/app-error.js";
import type { DashboardQueryParams } from "./dashboard.schemas.js";
import type {
  DashboardOverviewData,
  SalesTrendPoint,
  StorePerformance,
  RecentSale
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

  // 2. Build where clause for SalesOrder
  const orderWhere: Prisma.SalesOrderWhereInput = {
    organizationId
  };

  if (params.storeId) {
    orderWhere.storeId = params.storeId;
  } else if (params.regionId) {
    orderWhere.store = { regionId: params.regionId };
  }

  if (params.from || params.to) {
    orderWhere.createdAt = {};
    if (params.from) {
      const fromDate = new Date(params.from);
      if (!isNaN(fromDate.getTime())) {
        orderWhere.createdAt.gte = fromDate;
      }
    }
    if (params.to) {
      const toDate = new Date(params.to);
      if (!isNaN(toDate.getTime())) {
        // If YYYY-MM-DD string, set to end of that day
        if (params.to.length === 10) {
          toDate.setHours(23, 59, 59, 999);
        }
        orderWhere.createdAt.lte = toDate;
      }
    }
  }

  // 3. Concurrent database queries
  const [
    salesAgg,
    activeStoresCount,
    storesList,
    storeGroupedSales,
    inventoryRecords,
    totalProductsCount,
    completedOrdersForTrend,
    recentOrders
  ] = await Promise.all([
    // Sales KPIs for COMPLETED orders
    prisma.salesOrder.aggregate({
      where: {
        ...orderWhere,
        status: "COMPLETED"
      },
      _sum: {
        subtotal: true,
        discount: true,
        tax: true,
        total: true
      },
      _count: {
        id: true
      }
    }),

    // Active stores count
    prisma.store.count({
      where: {
        organizationId,
        status: "ACTIVE",
        ...(params.storeId
          ? { id: params.storeId }
          : params.regionId
            ? { regionId: params.regionId }
            : {})
      }
    }),

    // Stores list for store performance breakdown
    prisma.store.findMany({
      where: {
        organizationId,
        status: "ACTIVE",
        ...(params.storeId
          ? { id: params.storeId }
          : params.regionId
            ? { regionId: params.regionId }
            : {})
      },
      select: {
        id: true,
        name: true
      }
    }),

    // Store-level sales aggregation
    prisma.salesOrder.groupBy({
      by: ["storeId"],
      where: {
        ...orderWhere,
        status: "COMPLETED"
      },
      _sum: {
        total: true
      },
      _count: {
        id: true
      }
    }),

    // Inventory query
    prisma.inventory.findMany({
      where: {
        organizationId,
        ...(params.storeId
          ? { storeId: params.storeId }
          : params.regionId
            ? { store: { regionId: params.regionId } }
            : {})
      },
      include: {
        product: {
          select: {
            id: true,
            costPrice: true,
            reorderLevel: true,
            status: true
          }
        }
      }
    }),

    // Active products count
    prisma.product.count({
      where: {
        organizationId,
        status: "ACTIVE"
      }
    }),

    // Completed orders for sales trend
    prisma.salesOrder.findMany({
      where: {
        ...orderWhere,
        status: "COMPLETED"
      },
      select: {
        createdAt: true,
        total: true
      },
      orderBy: {
        createdAt: "asc"
      }
    }),

    // Recent orders (limited to 6)
    prisma.salesOrder.findMany({
      where: orderWhere,
      take: 6,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        store: {
          select: {
            name: true
          }
        },
        customer: {
          select: {
            name: true
          }
        }
      }
    })
  ]);

  // 4. Calculate Sales KPIs
  const grossSales = Number(salesAgg._sum.subtotal ?? 0);
  const netSales = Number(salesAgg._sum.total ?? 0);
  const orders = salesAgg._count.id;
  const averageOrderValue =
    orders > 0 ? Math.round((netSales / orders) * 100) / 100 : 0;

  // 5. Calculate Inventory KPIs
  const inventoryProductIds = new Set<string>();
  const lowStockProductIds = new Set<string>();
  let totalUnits = 0;
  let inventoryValue = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  for (const inv of inventoryRecords) {
    inventoryProductIds.add(inv.productId);
    totalUnits += inv.onHand;
    inventoryValue += inv.onHand * Number(inv.product.costPrice);

    const availableStock = inv.onHand - inv.reserved;
    if (availableStock <= 0) {
      outOfStockCount++;
    } else if (availableStock <= inv.product.reorderLevel) {
      lowStockCount++;
      lowStockProductIds.add(inv.productId);
    }
  }

  const totalSkus = params.storeId
    ? inventoryProductIds.size
    : totalProductsCount || inventoryProductIds.size;

  // 6. Calculate Sales Trend
  const trendMap = new Map<string, { date: string; sales: number; orders: number }>();
  for (const order of completedOrdersForTrend) {
    const dateKey = order.createdAt.toISOString().slice(0, 10);
    const existing = trendMap.get(dateKey) ?? {
      date: dateKey,
      sales: 0,
      orders: 0
    };
    existing.sales = Math.round((existing.sales + Number(order.total)) * 100) / 100;
    existing.orders += 1;
    trendMap.set(dateKey, existing);
  }

  const salesTrend: SalesTrendPoint[] = Array.from(trendMap.values()).sort(
    (a, b) => a.date.localeCompare(b.date)
  );

  // 7. Calculate Store Performance
  const storeSalesMap = new Map(
    storeGroupedSales.map((item) => [
      item.storeId,
      {
        sales: Number(item._sum.total ?? 0),
        orders: item._count.id
      }
    ])
  );

  const storePerformance: StorePerformance[] = storesList
    .map((store) => {
      const stats = storeSalesMap.get(store.id) ?? { sales: 0, orders: 0 };
      const aov =
        stats.orders > 0
          ? Math.round((stats.sales / stats.orders) * 100) / 100
          : 0;
      return {
        storeId: store.id,
        storeName: store.name,
        sales: Math.round(stats.sales * 100) / 100,
        orders: stats.orders,
        averageOrderValue: aov
      };
    })
    .sort((a, b) => b.sales - a.sales);

  // 8. Format Recent Sales
  const recentSales: RecentSale[] = recentOrders.map((order) => ({
    orderId: order.id,
    orderNumber: order.orderNumber,
    storeName: order.store.name,
    customerName: order.customer?.name ?? "Walk-in Customer",
    total: Number(order.total),
    status: order.status,
    createdAt: order.createdAt.toISOString()
  }));

  return {
    summary: {
      grossSales: Math.round(grossSales * 100) / 100,
      netSales: Math.round(netSales * 100) / 100,
      orders,
      averageOrderValue,
      activeStores: activeStoresCount,
      totalSkus,
      lowStockSkus: lowStockProductIds.size
    },
    salesTrend,
    storePerformance,
    inventorySummary: {
      totalProducts: totalSkus,
      totalUnits,
      inventoryValue: Math.round(inventoryValue * 100) / 100,
      lowStockCount,
      outOfStockCount
    },
    recentSales
  };
}
