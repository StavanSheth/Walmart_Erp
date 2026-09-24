export interface DashboardSummary {
  grossSales: number;
  netSales: number;
  orders: number;
  averageOrderValue: number;
  activeStores: number;
  totalSkus: number;
  lowStockSkus: number;
}

export interface SalesTrendPoint {
  date: string;
  sales: number;
  orders: number;
}

export interface StorePerformance {
  storeId: string;
  storeName: string;
  sales: number;
  orders: number;
  averageOrderValue: number;
}

export interface InventorySummary {
  totalProducts: number;
  totalUnits: number;
  inventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface RecentSale {
  orderId: string;
  orderNumber: string;
  storeName: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface DashboardOverviewData {
  summary: DashboardSummary;
  salesTrend: SalesTrendPoint[];
  storePerformance: StorePerformance[];
  inventorySummary: InventorySummary;
  recentSales: RecentSale[];
}

export interface DashboardOverviewResponse {
  success: boolean;
  data: DashboardOverviewData;
}
