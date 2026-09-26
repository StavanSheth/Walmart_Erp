export interface ReportKpiItem {
  value: number;
  formattedValue: string;
  changePercent: number;
  trend: "up" | "down" | "neutral";
  comparisonText: string;
}

export interface ReportOverviewKpis {
  totalSales: ReportKpiItem;
  totalOrders: ReportKpiItem;
  avgOrderValue: ReportKpiItem;
  totalStores: ReportKpiItem;
  productsSold: ReportKpiItem;
}

export interface SalesTrendDataPoint {
  date: string;
  label: string;
  onlineSales: number;
  inStoreSales: number;
  wholesaleSales: number;
  total: number;
}

export interface SalesTrendSeries {
  dates: string[];
  points: SalesTrendDataPoint[];
  onlineSales: number[];
  inStoreSales: number[];
  wholesaleSales: number[];
  yAxisMax: number;
}

export interface CategoryDistributionItem {
  categoryId: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface QuickReportItem {
  id: string;
  name: string;
  category: string;
  periodLabel: string;
  icon: string;
  filters: Record<string, string>;
}

export interface ScheduledReportItem {
  id: string;
  name: string;
  schedule: string;
  icon: string;
  enabled: boolean;
  type: string;
}

export interface GeneratedReportRecord {
  id: string;
  reportNumber: number;
  name: string;
  type: "Sales" | "Inventory" | "Store" | "Partner" | "Financial" | "Operational" | "Custom";
  dateRange: string;
  generatedOn: string;
  generatedBy: string;
  status: "Completed" | "Processing" | "Pending";
  fileSize?: string;
  downloadUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface FilterOptionItem {
  id: string;
  name: string;
  code?: string;
}

export interface ReportsFilterOptions {
  regions: FilterOptionItem[];
  stores: (FilterOptionItem & { regionId?: string | null })[];
  categories: FilterOptionItem[];
  products: (FilterOptionItem & { sku?: string })[];
  partnerTypes: string[];
  partners: (FilterOptionItem & { type: string })[];
  orderStatuses: string[];
}

export interface ReportCategoryItem {
  id: string;
  name: string;
  description: string;
  countLabel: string;
  reportCount: number;
  icon: "sales" | "inventory" | "store" | "partner" | "financial" | "operational" | "custom";
  isAction?: boolean;
}

export interface ReportsOverviewData {
  reportType: string;
  period: string;
  dateRangeLabel: string;
  categoryCards: ReportCategoryItem[];
  kpis: ReportOverviewKpis;
  salesTrend: SalesTrendSeries;
  categoryDistribution: {
    items: CategoryDistributionItem[];
    totalSales: number;
    formattedTotalSales: string;
  };
  quickReports: QuickReportItem[];
  scheduledReports: ScheduledReportItem[];
  generatedReports: {
    items: GeneratedReportRecord[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  filterOptions: ReportsFilterOptions;
}
