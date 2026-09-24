export interface DesktopSummary {
  totalProducts: number;
  inStockUnits: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalStores: number;
}

export interface MobileSummary {
  totalSalesToday: number;
  totalOrders: number;
  activeStores: number;
  inventoryValue: number;
}

export interface ChartSeriesPoint {
  date: string;
  amount: number;
  orders: number;
}

export interface SalesOverviewData {
  totalSales: number;
  previousPeriodSales: number;
  changePercent: number;
  sales: ChartSeriesPoint[];
  purchases: ChartSeriesPoint[];
}

export interface InventoryDistributionData {
  totalUnits: number;
  inStock: number;
  inStockPercentage: number;
  lowStock: number;
  lowStockPercentage: number;
  outOfStock: number;
  outOfStockPercentage: number;
  inTransit: number;
  inTransitPercentage: number;
}

export interface OrderFulfillmentData {
  fulfilled: number;
  pending: number;
  cancelled: number;
  fulfillmentRate: number;
}

export interface StorePerformanceItem {
  rank: number;
  storeId: string;
  storeName: string;
  sales: number;
  orders: number;
  averageOrderValue: number;
  relativePercentage: number;
}

export interface RecentInventoryActivityItem {
  id: string;
  productName: string;
  storeName: string;
  activityType: string;
  activityLabel: string;
  quantity: number;
  time: string;
  statusColor: "success" | "warning" | "danger" | "info";
}

export interface TopCategoryItem {
  categoryId: string;
  categoryName: string;
  stockValue: number;
  relativePercentage: number;
}

export interface DashboardAlertItem {
  id: string;
  title: string;
  type: "warning" | "danger" | "info" | "success";
  timestamp: string;
}

export interface RecentTransactionItem {
  id: string;
  orderNumber: string;
  productName: string;
  customerName: string;
  storeName: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface DashboardOverviewData {
  summary: DesktopSummary;
  mobileSummary: MobileSummary;
  salesOverview: SalesOverviewData;
  inventoryDistribution: InventoryDistributionData;
  orderFulfillment: OrderFulfillmentData;
  storePerformance: StorePerformanceItem[];
  recentInventoryActivity: RecentInventoryActivityItem[];
  topCategories: TopCategoryItem[];
  alerts: DashboardAlertItem[];
  recentTransactions: RecentTransactionItem[];
}

export interface DashboardOverviewResponse {
  success: boolean;
  data: DashboardOverviewData;
}
