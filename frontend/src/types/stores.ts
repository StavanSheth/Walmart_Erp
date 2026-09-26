export type StoreStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";
export type StorePeriod = "7d" | "30d" | "90d" | "ytd";

export interface StoreSummary {
  id: string;
  organizationId: string;
  regionId: string | null;
  name: string;
  code: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  pincode: string | null;
  phone: string | null;
  email: string | null;
  status: StoreStatus;
  image: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  region?: {
    id: string;
    name: string;
    code: string;
  } | null;
  manager?: {
    id: string;
    name: string;
    email: string;
  } | null;
  salesRevenue?: number;
  inventoryValue?: number;
}

export interface StoreNetworkPoint {
  id: string;
  name: string;
  code: string;
  latitude: number | null;
  longitude: number | null;
  status: StoreStatus;
  city: string | null;
  state: string | null;
  region: {
    id: string;
    name: string;
  } | null;
  salesRevenue: number;
  inventoryValue: number;
  isNewThisYear: boolean;
}

export interface StoreKPISummary {
  totalStores: number;
  operationalStores: number;
  maintenanceStores: number;
  newStores: number;
  trends: {
    totalStoresChangePct: number | null;
    operationalChangePct: number | null;
    maintenanceChangePct: number | null;
    newStoresChangePct: number | null;
  };
}

export interface GeoQualitySummary {
  totalStores: number;
  mappedStores: number;
  unmappedStores: number;
}

export interface RegionOption {
  id: string;
  name: string;
  code: string;
  storeCount: number;
}

export interface TopPerformerStore {
  id: string;
  name: string;
  code: string;
  city: string | null;
  state: string | null;
  regionName: string;
  image: string | null;
  status: StoreStatus;
  salesRevenue: number;
  salesChangePct: number | null;
  orderCount: number;
}

export interface StorePerformanceSummary {
  period: string;
  salesRevenue: number;
  salesRevenueChangePct: number | null;
  unitsSold: number;
  unitsSoldChangePct: number | null;
  inventoryFillRate: number;
  inventoryFillRateChangePct: number | null;
  activeStoresCount: number;
}

export type StoreAlertSeverity = "CRITICAL" | "WARNING" | "INFO" | "SUCCESS";
export type StoreAlertType = "LOW_STOCK" | "MAINTENANCE" | "NEW_STORE" | "OUT_OF_STOCK";

export interface StoreAlertItem {
  id: string;
  type: StoreAlertType;
  severity: StoreAlertSeverity;
  title: string;
  description: string;
  storeId: string;
  storeName: string;
  createdAt: string;
}

export interface StoresOverviewData {
  summary: StoreKPISummary;
  geoQuality: GeoQualitySummary;
  regions: RegionOption[];
  network: StoreNetworkPoint[];
  topPerformers: TopPerformerStore[];
  performance: StorePerformanceSummary;
  alerts: StoreAlertItem[];
}

export interface StoreDetailData {
  store: StoreSummary;
  metrics: {
    salesRevenue: number;
    completedOrders: number;
    averageOrderValue: number;
    totalSkus: number;
    totalUnits: number;
    inventoryValuation: number;
    lowStockCount: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  lowStockItems: Array<{
    id: string;
    productName: string;
    sku: string;
    onHand: number;
    reorderLevel: number;
    unit: string;
  }>;
}

export interface StoresQueryParams {
  search?: string;
  regionId?: string;
  status?: string;
  period?: StorePeriod;
  page?: number;
  pageSize?: number;
}
