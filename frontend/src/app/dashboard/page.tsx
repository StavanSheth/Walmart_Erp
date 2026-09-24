"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { ErrorState } from "@/components/common/error-state";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardKPIGrid } from "@/components/dashboard/dashboard-kpi-grid";
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";
import { SalesOverviewChart } from "@/components/dashboard/sales-overview-chart";
import { InventoryDistributionCard } from "@/components/dashboard/inventory-distribution-card";
import { OrderFulfillmentCard } from "@/components/dashboard/order-fulfillment-card";
import { StorePerformanceCard } from "@/components/dashboard/store-performance-card";
import { RecentInventoryActivity } from "@/components/dashboard/recent-inventory-activity";
import { TopCategoriesCard } from "@/components/dashboard/top-categories-card";
import { DashboardAlerts } from "@/components/dashboard/dashboard-alerts";
import { RecentSalesTable } from "@/components/dashboard/recent-sales-table";
import { DashboardPromoBanner } from "@/components/dashboard/dashboard-promo-banner";
import { useDashboardOverview } from "@/hooks/use-dashboard";
import type { DashboardQueryParams } from "@/types/dashboard";

export default function DashboardPage() {
  const [selectedStoreId, setSelectedStoreId] = React.useState<string | undefined>(undefined);
  const [selectedDateRange, setSelectedDateRange] = React.useState<string>("30d");

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
      <div className="space-y-5 pb-20 md:pb-6">
        {/* 1. Dashboard Header / Hero with filters & greeting */}
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

        {/* 2. KPI Grid (5 liquid glass cards on Desktop, 2x2 cards on Mobile) */}
        <div className="pt-10 sm:pt-16 lg:pt-24">
          <DashboardKPIGrid
            summary={data?.summary}
            mobileSummary={data?.mobileSummary}
            isLoading={isLoading}
          />
        </div>

        {/* 3. Mobile Quick Actions Row (Inventory, Stores, Partners, Reports) */}
        <div className="md:hidden">
          <DashboardQuickActions />
        </div>

        {/* ======================================================== */}
        {/* DESKTOP LAYOUT (md:block) */}
        {/* ======================================================== */}
        <div className="hidden md:block space-y-4 sm:space-y-5">
          {/* Row 2: Sales Overview (5/12) + Inventory Distribution (4/12) + Store Performance (3/12) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
            <div className="lg:col-span-5 xl:col-span-5 h-full min-h-[290px] sm:min-h-[305px]">
              <SalesOverviewChart
                salesOverview={data?.salesOverview}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-4 xl:col-span-4 h-full min-h-[290px] sm:min-h-[305px]">
              <InventoryDistributionCard
                data={data?.inventoryDistribution}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-3 xl:col-span-3 h-full min-h-[290px] sm:min-h-[305px]">
              <StorePerformanceCard
                stores={data?.storePerformance}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Row 3: Recent Inventory Activity (5/12) + Top Categories (4/12) + Alerts & Notifications (3/12) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
            <div className="lg:col-span-5 xl:col-span-5 h-full min-h-[290px] sm:min-h-[305px]">
              <RecentInventoryActivity
                activities={data?.recentInventoryActivity}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-4 xl:col-span-4 h-full min-h-[290px] sm:min-h-[305px]">
              <TopCategoriesCard
                categories={data?.topCategories}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-3 xl:col-span-3 h-full min-h-[290px] sm:min-h-[305px]">
              <DashboardAlerts
                alerts={data?.alerts}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Row 4: Promotional Glass Banner */}
          <DashboardPromoBanner />
        </div>

        {/* ======================================================== */}
        {/* MOBILE LAYOUT (md:hidden) */}
        {/* ======================================================== */}
        <div className="md:hidden space-y-4">
          {/* Sales Overview Mobile Chart */}
          <SalesOverviewChart
            salesOverview={data?.salesOverview}
            isLoading={isLoading}
          />

          {/* Inventory Status & Order Fulfillment in 2 cols or 1 col on small mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InventoryDistributionCard
              data={data?.inventoryDistribution}
              isLoading={isLoading}
            />
            <OrderFulfillmentCard
              data={data?.orderFulfillment}
              isLoading={isLoading}
            />
          </div>

          {/* Recent Transactions List Card */}
          <RecentSalesTable
            transactions={data?.recentTransactions}
            isLoading={isLoading}
          />
        </div>
      </div>
    </PageContainer>
  );
}
