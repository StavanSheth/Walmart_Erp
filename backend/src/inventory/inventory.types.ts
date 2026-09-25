export interface InventorySummaryDto {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  inTransitItems: number;
  inventoryValue: number;
  totalUnits: number;
}

export interface InventoryTrendPointDto {
  month: string;
  inventoryValue: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  inTransit: number;
  units: number;
  skuCount: number;
}

export interface CategoryDistributionDto {
  categoryId: string;
  categoryName: string;
  value: number;
  percentage: number;
  itemCount: number;
}

export interface StockStatusItemDto {
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "IN_TRANSIT";
  label: string;
  count: number;
  percentage: number;
}

export interface StockStatusSummaryDto {
  statuses: StockStatusItemDto[];
  healthScore: number;
  healthRating: "Good" | "Average" | "Needs Attention";
}

export interface StoreInventorySummaryDto {
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

export interface InventoryAnalyticsDto {
  inventoryTrend: InventoryTrendPointDto[];
  categoryDistribution: CategoryDistributionDto[];
  stockStatus: StockStatusSummaryDto;
  storeSummary: StoreInventorySummaryDto[];
}

export interface InventoryProductItemDto {
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
  image: string | null;
}

export interface PaginationDto {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface InventoryMovementDto {
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

export interface FilterOptionDto {
  id: string;
  name: string;
  code: string;
  regionId?: string | null;
}

export interface InventoryResponseData {
  summary: InventorySummaryDto;
  analytics: InventoryAnalyticsDto;
  products: {
    items: InventoryProductItemDto[];
    pagination: PaginationDto;
  };
  recentMovements: InventoryMovementDto[];
  filterOptions: {
    regions: FilterOptionDto[];
    stores: FilterOptionDto[];
    categories: FilterOptionDto[];
  };
}

export interface InventoryDetailData {
  item: InventoryProductItemDto & {
    createdAt: string;
    updatedAt: string;
  };
  recentMovements: InventoryMovementDto[];
}
