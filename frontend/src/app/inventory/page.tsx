"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { ErrorState } from "@/components/common/error-state";
import { useUrlFilters } from "@/hooks/use-url-filters";

import { InventoryPageHeader } from "@/components/inventory/inventory-page-header";
import { InventoryFilters } from "@/components/inventory/inventory-filters";
import { InventoryKPIGrid } from "@/components/inventory/inventory-kpi-grid";
import { InventoryAnalyticsSection } from "@/components/inventory/inventory-analytics";
import { InventoryProducts } from "@/components/inventory/inventory-products";
import { InventoryStoreSummary } from "@/components/inventory/inventory-store-summary";
import { InventoryMovements } from "@/components/inventory/inventory-movements";
import { InventoryDetailModal } from "@/components/inventory/inventory-detail";

import { useInventory } from "@/hooks/use-inventory";
import type {
  InventoryQueryParams,
  StockStatus,
  InventoryTab,
  InventoryItem
} from "@/types/inventory";

function InventoryPageContent() {
  const { get, getNumber, setFilters } = useUrlFilters();

  // 1. Read filter & pagination state directly from URL query parameters
  const regionIdParam = get("regionId", "ALL");
  const storeIdParam = get("storeId", "ALL");
  const categoryIdParam = get("categoryId", "ALL");
  const statusParam = get("status", "ALL") as StockStatus;
  const tabParam = get("tab", "all") as InventoryTab;
  const searchParam = get("search", "");
  const pageParam = getNumber("page", 1);
  const pageSizeParam = getNumber("pageSize", 25);

  // Detail Modal state & Mobile Filter drawer state
  const [selectedInventoryId, setSelectedInventoryId] = React.useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = React.useState<string | undefined>(undefined);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  // 2. Query parameters for TanStack Query
  const queryParams = React.useMemo<InventoryQueryParams>(
    () => ({
      regionId: regionIdParam !== "ALL" ? regionIdParam : undefined,
      storeId: storeIdParam !== "ALL" ? storeIdParam : undefined,
      categoryId: categoryIdParam !== "ALL" ? categoryIdParam : undefined,
      status: statusParam !== "ALL" ? statusParam : undefined,
      tab: tabParam !== "all" ? tabParam : undefined,
      search: searchParam.trim() ? searchParam.trim() : undefined,
      page: pageParam > 0 ? pageParam : 1,
      pageSize: pageSizeParam > 0 ? pageSizeParam : 25
    }),
    [
      regionIdParam,
      storeIdParam,
      categoryIdParam,
      statusParam,
      tabParam,
      searchParam,
      pageParam,
      pageSizeParam
    ]
  );

  // 3. Single primary API request for the entire inventory view
  const { data, isLoading, isError, error, refetch, isFetching } = useInventory(queryParams);

  // Handlers using centralized URL filter synchronization
  const handleSearchChange = (val: string) => {
    setFilters({ search: val.trim() ? val : null, page: null });
  };

  const handleRegionChange = (val: string) => {
    setFilters({ regionId: val !== "ALL" ? val : null, page: null });
  };

  const handleStoreChange = (val: string) => {
    setFilters({ storeId: val !== "ALL" ? val : null, page: null });
  };

  const handleCategorySelect = (val: string) => {
    setFilters({ categoryId: val !== "ALL" ? val : null, page: null });
  };

  const handleStatusChange = (val: StockStatus) => {
    setFilters({ status: val !== "ALL" ? val : null, page: null });
  };

  const handleTabChange = (newTab: InventoryTab) => {
    setFilters({ tab: newTab !== "all" ? newTab : null, page: null });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage > 1 ? newPage : null });
  };

  const handlePageSizeChange = (newSize: number) => {
    setFilters({ pageSize: newSize !== 25 ? newSize : null, page: null });
  };

  const handleResetFilters = () => {
    setFilters({
      search: null,
      regionId: null,
      storeId: null,
      categoryId: null,
      status: null,
      tab: null,
      page: null
    });
  };

  const activeFilterCount = [
    Boolean(searchParam.trim()),
    regionIdParam !== "ALL",
    storeIdParam !== "ALL",
    categoryIdParam !== "ALL",
    statusParam !== "ALL"
  ].filter(Boolean).length;

  return (
    <PageContainer>
      <div className="space-y-4 sm:space-y-5 pb-16 md:pb-6">
        {/* 1. Header with live formatted date, refresh sync, and mobile filter trigger */}
        <InventoryPageHeader
          onRefresh={() => refetch()}
          isFetching={isFetching}
          onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        {/* 2. Unified Filter Component (desktop bar + mobile drawer) */}
        <InventoryFilters
          search={searchParam}
          regionId={regionIdParam}
          storeId={storeIdParam}
          categoryId={categoryIdParam}
          status={statusParam}
          regions={data?.filterOptions?.regions || []}
          stores={data?.filterOptions?.stores || []}
          categories={data?.filterOptions?.categories || []}
          onSearchChange={handleSearchChange}
          onRegionChange={handleRegionChange}
          onStoreChange={handleStoreChange}
          onCategoryChange={handleCategorySelect}
          onStatusChange={handleStatusChange}
          onResetFilters={handleResetFilters}
          isMobileOpen={isMobileFilterOpen}
          onMobileClose={() => setIsMobileFilterOpen(false)}
        />

        {/* Global Error Banner with Retry */}
        {isError && (
          <ErrorState
            title="Failed to load inventory data"
            message={
              error instanceof Error
                ? error.message
                : "An unexpected error occurred while communicating with the database."
            }
            onRetry={() => refetch()}
          />
        )}

        {/* 3. KPI Summary (5 Cards: Total Products, Low Stock, Out of Stock, In Transit, Value) */}
        <div className="mt-2 sm:mt-3">
          <InventoryKPIGrid
            summary={data?.summary}
            isLoading={isLoading}
            selectedStatus={statusParam}
            onStatusClick={handleStatusChange}
          />
        </div>

        {/* 4. Analytics Section (Overview Chart, Donut Category Chart, Stock Status) */}
        <InventoryAnalyticsSection
          analytics={data?.analytics}
          totalProducts={data?.summary?.totalProducts}
          isLoading={isLoading}
          onStatusClick={handleStatusChange}
          onCategorySelect={handleCategorySelect}
        />

        {/* 5. Products Table (7/12) + Store-wise Inventory (5/12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
          <div className="lg:col-span-7 flex flex-col h-full">
            <InventoryProducts
              items={data?.products?.items || []}
              pagination={
                data?.products?.pagination || {
                  page: pageParam,
                  pageSize: pageSizeParam,
                  total: 0,
                  totalPages: 1
                }
              }
              currentTab={tabParam}
              onTabChange={handleTabChange}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onRowClick={(item: InventoryItem) => {
                setSelectedInventoryId(item.id);
                setSelectedStoreId(item.storeId);
              }}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col h-full">
            <InventoryStoreSummary
              stores={data?.analytics?.storeSummary || []}
              regions={data?.filterOptions?.regions || []}
              selectedRegionId={regionIdParam}
              onRegionChange={handleRegionChange}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* 6. Recent Inventory Movements */}
        <div className="w-full">
          <InventoryMovements
            movements={data?.recentMovements || []}
            isLoading={isLoading}
          />
        </div>

        {/* 7. Product Detail View (Modal on desktop, Sheet on mobile) */}
        <InventoryDetailModal
          inventoryId={selectedInventoryId}
          storeId={selectedStoreId}
          onClose={() => {
            setSelectedInventoryId(null);
            setSelectedStoreId(undefined);
          }}
        />
      </div>
    </PageContainer>
  );
}

export default function InventoryPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 font-medium">
          Loading inventory workspace...
        </div>
      }
    >
      <InventoryPageContent />
    </React.Suspense>
  );
}
