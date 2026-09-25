export type PartnerEntityType = "partner" | "customer";

export interface SparklinePoint {
  label: string;
  value: number;
}

export interface SummaryMetricTrend {
  value: number;
  changePercent: number | null;
  sparkline: SparklinePoint[];
}

export interface PartnersSummary {
  totalPartners: number;
  retailers: number;
  suppliers: number;
  endCustomers: number;
  trends: {
    totalPartners: SummaryMetricTrend;
    retailers: SummaryMetricTrend;
    suppliers: SummaryMetricTrend;
    endCustomers: SummaryMetricTrend;
  };
}

export interface PartnerDistributionItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface PartnerGrowthPoint {
  month: string;
  Retailers: number;
  Wholesalers: number;
  Suppliers: number;
  Customers: number;
}

export interface PartnerInsights {
  activeRetailers: number;
  activeSuppliers: number;
  newPartnersYtd: number;
  satisfactionScore: number;
  retailersTrend: number | null;
  suppliersTrend: number | null;
  newPartnersTrend: number | null;
  satisfactionTrend: number | null;
}

export interface PartnerListItem {
  id: string;
  name: string;
  type: string;
  rawType: string;
  entity: PartnerEntityType;
  region: string;
  regionId: string | null;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  status: "ACTIVE" | "INACTIVE";
  lastOrderDate: string | null;
  totalValue: number;
  orderCount: number;
  creditLimit: number;
  address: string | null;
}

export interface TopPartnerItem {
  rank: number;
  id: string;
  name: string;
  type: string;
  totalValue: number;
  entity: PartnerEntityType;
}

export interface PartnerOnboardingMetric {
  onboarded: number;
  eligible: number;
  percentage: number;
}

export interface PartnersFilterOptions {
  types: string[];
  regions: Array<{ id: string; name: string }>;
  statuses: string[];
}

export interface PartnersOverviewData {
  summary: PartnersSummary;
  distribution: PartnerDistributionItem[];
  growth: PartnerGrowthPoint[];
  insights: PartnerInsights;
  list: {
    items: PartnerListItem[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
  topPartners: TopPartnerItem[];
  onboarding: PartnerOnboardingMetric;
  filterOptions: PartnersFilterOptions;
}

export interface PartnerDetailData {
  id: string;
  name: string;
  type: string;
  rawType: string;
  entity: PartnerEntityType;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxId?: string | null;
  creditLimit: number;
  status: "ACTIVE" | "INACTIVE";
  region: string;
  latestStoreName: string | null;
  orderCount: number;
  totalValue: number;
  averageOrderValue: number;
  lastOrderDate: string | null;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    date: string;
    total: number;
    status: string;
    storeName: string;
  }>;
}
