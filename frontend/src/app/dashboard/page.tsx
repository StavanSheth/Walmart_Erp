"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { ErrorState } from "@/components/common/error-state";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardKPIGrid } from "@/components/dashboard/dashboard-kpi-grid";
import { SalesOverviewChart } from "@/components/dashboard/sales-overview-chart";
import { StorePerformanceCard } from "@/components/dashboard/store-performance-card";
import { InventorySummaryCard } from "@/components/dashboard/inventory-summary-card";
import { RecentSalesTable } from "@/components/dashboard/recent-sales-table";
import { useDashboardOverview } from "@/hooks/use-dashboard";
import type { DashboardQueryParams } from "@/types/dashboard";

export default function DashboardPage() {
  const [selectedStoreId, setSelectedStoreId] = React.useState<string | undefined>(undefined);
  const [selectedDateRange, setSelectedDateRange] = React.useState<string>("all");

  const queryParams = React.useMemo<DashboardQueryParams>(() => {
    const params: DashboardQueryParams = {};
    if (selectedStoreId) {
      params.storeId = selectedStoreId;
    }
    if (selectedDateRange === "30d") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      params.from = d.toISOString();
    } else if (selectedDateRange === "90d") {
      const d = new Date();
      d.setDate(d.getDate() - 90);
      params.from = d.toISOString();
    }
    return params;
  }, [selectedStoreId, selectedDateRange]);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useDashboardOverview(queryParams);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Dashboard Header with filter bar and responsive banner */}
        <DashboardHeader
          selectedStoreId={selectedStoreId}
          onStoreChange={setSelectedStoreId}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={setSelectedDateRange}
          onRefresh={() => refetch()}
          isFetching={isFetching}
        />

        {/* Global Error Banner with Retry */}
        {isError && (
          <ErrorState
            title="Failed to load Dashboard data"
            message={
              error instanceof Error
                ? error.message
                : "An unexpected error occurred while fetching information from the server."
            }
            onRetry={() => refetch()}
          />
        )}

        {/* Key Performance Indicators Grid */}
        <DashboardKPIGrid summary={data?.summary} isLoading={isLoading} />

        {/* Analytics & Performance Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: Sales Trend & Recent Sales */}
          <div className="lg:col-span-2 space-y-6">
            <SalesOverviewChart
              salesTrend={data?.salesTrend}
              isLoading={isLoading}
            />
            <RecentSalesTable
              sales={data?.recentSales}
              isLoading={isLoading}
            />
          </div>

          {/* Secondary Column: Inventory Health & Store Breakdown */}
          <div className="space-y-6">
            <InventorySummaryCard
              inventory={data?.inventorySummary}
              isLoading={isLoading}
            />
            <StorePerformanceCard
              stores={data?.storePerformance}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
