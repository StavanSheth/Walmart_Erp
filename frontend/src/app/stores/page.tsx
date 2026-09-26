"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { ErrorState } from "@/components/common/error-state";
import { useShell } from "@/context/shell-context";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { useStoresOverview } from "@/hooks/use-stores";
import { StoresHeader } from "@/components/stores/stores-header";
import { StoresKPIGrid } from "@/components/stores/stores-kpi-grid";
import { StoresTabs, type StoresTab } from "@/components/stores/stores-tabs";
import { StoreNetworkMap } from "@/components/stores/store-network-map";
import { TopPerformingStores } from "@/components/stores/top-performing-stores";
import { StorePerformancePanel } from "@/components/stores/store-performance-panel";
import { StoresAlerts } from "@/components/stores/stores-alerts";
import { StoreNetworkBanner } from "@/components/stores/store-network-banner";
import { StoreDetailModal } from "@/components/stores/store-detail";
import { PerformanceView } from "@/components/stores/performance-view";
import { OperationsView } from "@/components/stores/operations-view";
import { ExpansionView } from "@/components/stores/expansion-view";
import type { StorePeriod, StoresQueryParams } from "@/types/stores";

function StoresPageContent() {
  const { currentStore, setCurrentStore } = useShell();
  const { get, setFilters } = useUrlFilters();

  // URL-backed filter states
  const activeTab = (get("tab", "network") as StoresTab) || "network";
  const search = get("search", "");
  const regionId = get("regionId", "ALL");
  const status = get("status", "ALL");
  const period = (get("period", "30d") as StorePeriod) || "30d";

  // Local selection and modal states
  const [selectedStoreId, setSelectedStoreId] = React.useState<string | null>(null);
  const [detailStoreId, setDetailStoreId] = React.useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  // Memoized query parameters for stable React Query caching
  const overviewParams = React.useMemo<StoresQueryParams>(
    () => ({
      search: search.trim() ? search.trim() : undefined,
      regionId: regionId !== "ALL" ? regionId : undefined,
      status: status !== "ALL" ? status : undefined,
      period
    }),
    [search, regionId, status, period]
  );

  // Fetch overview data from backend
  const { data, isLoading, isError, error, refetch } = useStoresOverview(overviewParams);

  const handleSelectStore = React.useCallback((id: string) => {
    setSelectedStoreId(id);
  }, []);

  const handleViewDetail = React.useCallback((id: string) => {
    setDetailStoreId(id);
    setIsDetailOpen(true);
  }, []);

  const handleSwitchStore = React.useCallback(
    (store: {
      id: string;
      name: string;
      code: string;
      city: string;
      state: string;
      region: string;
      address?: string | null;
      phone?: string | null;
    }) => {
      setCurrentStore({
        id: store.id,
        name: store.name,
        code: store.code,
        city: store.city,
        state: store.state,
        region: store.region,
        address: store.address || "",
        phone: store.phone || ""
      });
    },
    [setCurrentStore]
  );

  return (
    <PageContainer>
      <div className="space-y-5 pb-20 md:pb-6">
        {/* 1. Header with Dark Navy Curved Banner, Region Dropdown, and Glass Search Bar */}
        <StoresHeader
          regions={data?.regions || []}
          selectedRegion={regionId}
          onSelectRegion={(reg) => setFilters({ regionId: reg, page: 1 })}
          searchValue={search}
          onSearchChange={(newSearch) => setFilters({ search: newSearch, page: 1 })}
        />

        {/* 2. Database-derived KPI Cards with Status Filter click interaction */}
        <div className="pt-8 sm:pt-24 lg:pt-44 xl:pt-52">
          <StoresKPIGrid
            summary={data?.summary}
            selectedStatus={status}
            onStatusChange={(newStatus) => setFilters({ status: newStatus, page: 1 })}
            isLoading={isLoading}
          />
        </div>

        {/* 3. Tab Navigation */}
        <StoresTabs
          activeTab={activeTab}
          onTabChange={(newTab) => setFilters({ tab: newTab })}
        />

        {/* 4. Error State */}
        {isError && (
          <ErrorState
            title="Failed to load stores data"
            message={error?.message || "Could not retrieve store network telemetry from server."}
            onRetry={() => refetch()}
          />
        )}

        {/* 5. Tab Content */}
        {!isError && (
          <>
            {/* TAB A: Store Network (Main Reference View) */}
            {activeTab === "network" && (
              <div className="space-y-4 sm:space-y-5">
                {/* Store Locations Map */}
                <StoreNetworkMap
                  stores={data?.network || []}
                  geoQuality={data?.geoQuality}
                  selectedStoreId={selectedStoreId}
                  onSelectStore={handleSelectStore}
                  onViewDetail={handleViewDetail}
                  onViewAll={() => setFilters({ tab: "expansion" })}
                  onSwitchStore={handleSwitchStore}
                  isLoading={isLoading}
                />

                {/* Top Performing Stores */}
                <TopPerformingStores
                  stores={data?.topPerformers || []}
                  selectedStoreId={selectedStoreId}
                  onSelectStore={handleSelectStore}
                  onViewDetail={handleViewDetail}
                  onViewAll={() => setFilters({ tab: "performance" })}
                  onSwitchStore={handleSwitchStore}
                  currentStoreCode={currentStore?.code}
                  isLoading={isLoading}
                />

                {/* Two-Column Area: Store Performance & Recent Alerts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 items-stretch">
                  <StorePerformancePanel
                    performance={data?.performance}
                    selectedPeriod={period}
                    onPeriodChange={(p) => setFilters({ period: p })}
                    isLoading={isLoading}
                  />

                  <StoresAlerts
                    alerts={data?.alerts || []}
                    onSelectStore={handleSelectStore}
                    onViewDetail={handleViewDetail}
                    onViewAll={() => setFilters({ tab: "operations" })}
                    isLoading={isLoading}
                  />
                </div>

                {/* Stronger Stores Banner */}
                <StoreNetworkBanner
                  onActionClick={() => setFilters({ tab: "operations" })}
                />
              </div>
            )}

            {/* TAB B: Performance Tab */}
            {activeTab === "performance" && data && (
              <PerformanceView
                stores={data.network}
                performance={data.performance}
                selectedPeriod={period}
                onPeriodChange={(p) => setFilters({ period: p })}
                onSelectStore={handleSelectStore}
                onViewDetail={handleViewDetail}
              />
            )}

            {/* TAB C: Operations Tab */}
            {activeTab === "operations" && data && (
              <OperationsView
                stores={data.network}
                alerts={data.alerts}
                onSelectStore={handleSelectStore}
                onViewDetail={handleViewDetail}
              />
            )}

            {/* TAB D: Expansion Tab */}
            {activeTab === "expansion" && data && (
              <ExpansionView
                stores={data.network}
                regions={data.regions}
                geoQuality={data.geoQuality}
                onSelectStore={handleSelectStore}
                onViewDetail={handleViewDetail}
              />
            )}
          </>
        )}

        {/* 6. Store Detail Modal */}
        <StoreDetailModal
          storeId={detailStoreId}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setDetailStoreId(null);
          }}
          onSwitchStore={handleSwitchStore}
          isCurrentStore={detailStoreId === currentStore?.id}
        />
      </div>
    </PageContainer>
  );
}

export default function StoresPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 font-medium">
          Loading stores workspace...
        </div>
      }
    >
      <StoresPageContent />
    </React.Suspense>
  );
}
