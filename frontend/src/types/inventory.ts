export type StockStatus = "ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export type InventoryTab = "all" | "most-stocked" | "low-stock" | "out-of-stock";

export interface InventoryItem {
  id: string;
  productId: string;
  storeId: string;
  productName: string;
  sku: string;
  barcode: string | null;
  categoryName: string;
  categoryId: string | null;
  storeName: string;
  storeCode: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  inventoryValue: number;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  storeCoverage: number;
  unit: string;
  image?: string | null;
}

export interface InventorySummary {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  inTransitItems: number;
  inventoryValue: number;
  totalUnits: number;
}

export interface InventoryTrendPoint {
  month: string;
  inventoryValue: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  inTransit: number;
  units: number;
  skuCount: number;
}

export interface CategoryDistribution {
  categoryId: string;
  categoryName: string;
  value: number;
  percentage: number;
  itemCount: number;
}

export interface StockStatusItem {
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "IN_TRANSIT";
  label: string;
  count: number;
  percentage: number;
}

export interface StockStatusSummary {
  statuses: StockStatusItem[];
  healthScore: number;
  healthRating: "Good" | "Average" | "Needs Attention";
}

export interface StoreInventorySummary {
  storeId: string;
  storeName: string;
  storeCode: string;
  storeImage: string | null;
  regionId: string | null;
  regionName: string | null;
  totalStock: number;
  lowStock: number;
  outOfStock: number;
  status: "Healthy" | "Watch";
}

export interface InventoryAnalytics {
  inventoryTrend: InventoryTrendPoint[];
  categoryDistribution: CategoryDistribution[];
  stockStatus: StockStatusSummary;
  storeSummary: StoreInventorySummary[];
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface FilterOption {
  id: string;
  name: string;
  code: string;
  regionId?: string | null;
}

export interface InventoryMovement {
  id: string;
  code: string;
  type: string;
  typeLabel: string;
  quantity: number;
  unitCost: number | null;
  referenceType: string | null;
  referenceId: string | null;
  notes: string | null;
  createdAt: string;
  productName: string;
  storeName: string;
  storeCode: string;
  status: string;
}

export interface InventoryListData {
  summary: InventorySummary;
  analytics: InventoryAnalytics;
  products: {
    items: InventoryItem[];
    pagination: PaginationInfo;
  };
  recentMovements: InventoryMovement[];
  filterOptions: {
    regions: FilterOption[];
    stores: FilterOption[];
    categories: FilterOption[];
  };
}

export interface InventoryListResponse {
  success: boolean;
  data: InventoryListData;
}

export interface InventoryQueryParams {
  regionId?: string;
  storeId?: string;
  categoryId?: string;
  status?: StockStatus;
  tab?: InventoryTab;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface InventoryDetailData {
  item: InventoryItem & {
    createdAt: string;
    updatedAt: string;
  };
  recentMovements: InventoryMovement[];
}

export interface InventoryDetailResponse {
  success: boolean;
  data: InventoryDetailData;
}
