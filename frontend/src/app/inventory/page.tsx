"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PageContainer } from "@/components/common/page-container";
import { ErrorState } from "@/components/common/error-state";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

import { InventoryPageHeader } from "@/components/inventory/inventory-page-header";
import { InventoryKPIGrid } from "@/components/inventory/inventory-kpi-grid";
import { InventoryAnalyticsSection } from "@/components/inventory/inventory-analytics";
import { InventoryProducts } from "@/components/inventory/inventory-products";
import { InventoryStoreSummary } from "@/components/inventory/inventory-store-summary";
import { InventoryMovements } from "@/components/inventory/inventory-movements";
import { InventoryPromoCards } from "@/components/inventory/inventory-promo-cards";
import { InventoryDetailModal } from "@/components/inventory/inventory-detail";

import { useInventory } from "@/hooks/use-inventory";
import type {
  InventoryQueryParams,
  StockStatus,
  InventoryTab,
  InventoryItem
} from "@/types/inventory";

function InventoryPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Read filter & pagination state directly from URL query parameters
  const regionIdParam = searchParams.get("regionId") || "ALL";
  const storeIdParam = searchParams.get("storeId") || "ALL";
  const categoryIdParam = searchParams.get("categoryId") || "ALL";
  const statusParam = (searchParams.get("status") as StockStatus) || "ALL";
  const tabParam = (searchParams.get("tab") as InventoryTab) || "most-stocked";
  const searchParam = searchParams.get("search") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const pageSizeParam = parseInt(searchParams.get("pageSize") || "25", 10);

  // Detail Modal state
  const [selectedInventoryId, setSelectedInventoryId] = React.useState<string | null>(null);

  // Add Product Placeholder Modal state
  const [addProductModalOpen, setAddProductModalOpen] = React.useState(false);

  // View All Movements Modal state
  const [viewAllMovementsModalOpen, setViewAllMovementsModalOpen] = React.useState(false);

  // 2. Query parameters for TanStack Query
  const queryParams = React.useMemo<InventoryQueryParams>(() => ({
    regionId: regionIdParam !== "ALL" ? regionIdParam : undefined,
    storeId: storeIdParam !== "ALL" ? storeIdParam : undefined,
    categoryId: categoryIdParam !== "ALL" ? categoryIdParam : undefined,
    status: statusParam !== "ALL" ? statusParam : undefined,
    tab: tabParam !== "all" ? tabParam : undefined,
    search: searchParam.trim() ? searchParam.trim() : undefined,
    page: !isNaN(pageParam) && pageParam > 0 ? pageParam : 1,
    pageSize: !isNaN(pageSizeParam) && pageSizeParam > 0 ? pageSizeParam : 25
  }), [regionIdParam, storeIdParam, categoryIdParam, statusParam, tabParam, searchParam, pageParam, pageSizeParam]);

  // 3. Fetch inventory data from backend API
  const { data, isLoading, isError, error, refetch, isFetching } = useInventory(queryParams);

  // 4. Update URL query parameters helper
  const updateUrlParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === "" || val === "ALL" || (key === "tab" && val === "all")) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, val);
        }
      });

      const queryString = nextParams.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // Handlers
  const handleRegionChange = (val: string) => {
    updateUrlParams({ regionId: val !== "ALL" ? val : null, page: null });
  };

  const handleCategorySelect = (val: string) => {
    updateUrlParams({ categoryId: val !== "ALL" ? val : null, page: null });
  };

  const handleStatusChange = (val: StockStatus) => {
    updateUrlParams({ status: val !== "ALL" ? val : null, page: null });
  };

  const handleTabChange = (newTab: InventoryTab) => {
    updateUrlParams({ tab: newTab !== "most-stocked" ? newTab : null, page: null });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage > 1 ? String(newPage) : null });
  };

  const handlePageSizeChange = (newSize: number) => {
    updateUrlParams({ pageSize: newSize !== 5 ? String(newSize) : null, page: null });
  };

  return (
    <PageContainer>
      <div className="space-y-4 sm:space-y-5 pb-16 md:pb-6">
        {/* 1. Inventory Page Header with Live Tag, Slogan Banner, Date Card & Add Product */}
        <InventoryPageHeader
          onRefresh={() => refetch()}
          isFetching={isFetching}
          onAddProduct={() => setAddProductModalOpen(true)}
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

        {/* 2. KPI Summary (5 Cards: Total Products, Low Stock, Out of Stock, In Transit, Value) */}
        <div className="pt-36 sm:pt-48 lg:pt-60 xl:pt-72">
          <InventoryKPIGrid
            summary={data?.summary}
            isLoading={isLoading}
            selectedStatus={statusParam}
            onStatusClick={handleStatusChange}
          />
        </div>

        {/* 3. Inventory Analytics Section (Overview Chart, Donut Category Chart, Stock Status) */}
        <InventoryAnalyticsSection
          analytics={data?.analytics}
          totalProducts={data?.summary?.totalProducts}
          isLoading={isLoading}
          onStatusClick={handleStatusChange}
          onCategorySelect={handleCategorySelect}
        />

        {/* 4. Second Row: Top Products Table (7/12) + Store-wise Inventory (5/12) */}
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
              onRowClick={(item: InventoryItem) => setSelectedInventoryId(item.id)}
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

        {/* 5. Third Row: Recent Inventory Movements (7/12) + Promotional Cards (5/12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
          <div className="lg:col-span-7 flex flex-col h-full">
            <InventoryMovements
              movements={data?.recentMovements || []}
              isLoading={isLoading}
              onViewAll={() => setViewAllMovementsModalOpen(true)}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col h-full">
            <InventoryPromoCards />
          </div>
        </div>

        {/* 6. Product Detail View Modal */}
        <InventoryDetailModal
          inventoryId={selectedInventoryId}
          onClose={() => setSelectedInventoryId(null)}
        />

        {/* 6.1 View All Movements Modal */}
        <Modal
          isOpen={viewAllMovementsModalOpen}
          onClose={() => setViewAllMovementsModalOpen(false)}
          title="All Inventory Audit Movements"
          description="Complete log of recent stock receipts, warehouse transfers, sales debits, and cycle adjustments."
          size="lg"
        >
          <div className="space-y-4 py-2">
            <div className="overflow-x-auto overflow-y-auto max-h-[420px] rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-slate-50 z-10">
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3 text-center">Type</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3">Store Location</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {(data?.recentMovements || []).map((mov) => {
                    const isPositive = mov.quantity > 0;
                    const isNegative = mov.quantity < 0;
                    return (
                      <tr key={mov.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-slate-500">
                          {mov.code}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true
                          }).format(new Date(mov.createdAt))}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {mov.productName}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {mov.typeLabel}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums font-bold">
                          <span
                            className={
                              isPositive
                                ? "text-emerald-600"
                                : isNegative
                                ? "text-rose-600"
                                : "text-slate-700"
                            }
                          >
                            {isPositive ? `+${mov.quantity}` : mov.quantity}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {mov.storeName}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            {mov.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewAllMovementsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>

        {/* 7. Add Product Placeholder Modal (Phase 6 requirement: no full CRUD workflow, clean placeholder) */}
        <Modal
          isOpen={addProductModalOpen}
          onClose={() => setAddProductModalOpen(false)}
          title="Add New Product"
          description="Create a new catalog item and provision initial warehouse stock."
          size="md"
        >
          <div className="space-y-4 py-2">
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 leading-relaxed">
              <span className="font-bold block mb-1">ℹ️ Catalog & Product Ingestion</span>
              Full product creation, barcode generation, and supplier provisioning will be wired in the upcoming Procurement & Catalog phase.
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. Great Value Organic Honey"
                  disabled
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="Auto-generated"
                    disabled
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    placeholder="100"
                    disabled
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddProductModalOpen(false)}
              >
                Close
              </Button>
              <Button
                size="sm"
                disabled
                className="bg-brand-primary text-white opacity-60 cursor-not-allowed"
              >
                Submit (Upcoming)
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageContainer>
  );
}

export default function InventoryPage() {
  return (
    <React.Suspense
      fallback={
        <PageContainer>
          <div className="space-y-4 py-4">
            <div className="h-8 w-48 bg-slate-200 rounded-xl animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-5 h-72 bg-slate-100 rounded-2xl animate-pulse" />
              <div className="lg:col-span-4 h-72 bg-slate-100 rounded-2xl animate-pulse" />
              <div className="lg:col-span-3 h-72 bg-slate-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        </PageContainer>
      }
    >
      <InventoryPageContent />
    </React.Suspense>
  );
}
