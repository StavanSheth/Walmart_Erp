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
}

export interface StorePerformanceItem {
  storeId: string;
  storeName: string;
  sales: number;
  orders: number;
  averageOrderValue: number;
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

export interface DashboardOverviewData {
  summary: DesktopSummary;
  mobileSummary: MobileSummary;
  salesOverview: SalesOverviewData;
  inventoryDistribution: InventoryDistributionData;
  storePerformance: StorePerformanceItem[];
  inventoryAlerts: DashboardAlertItem[];
  recentActivity: RecentInventoryActivityItem[];
  topCategories: TopCategoryItem[];
}

export interface DashboardOverviewResponse {
  success: boolean;
  data: DashboardOverviewData;
}
