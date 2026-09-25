"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { ErrorState } from "@/components/common/error-state";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardKPIGrid } from "@/components/dashboard/dashboard-kpi-grid";
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";
import { SalesOverviewChart } from "@/components/dashboard/sales-overview-chart";
import { InventoryDistributionCard } from "@/components/dashboard/inventory-distribution-card";
import { StorePerformanceCard } from "@/components/dashboard/store-performance-card";
import { RecentInventoryActivity } from "@/components/dashboard/recent-inventory-activity";
import { TopCategoriesCard } from "@/components/dashboard/top-categories-card";
import { DashboardAlerts } from "@/components/dashboard/dashboard-alerts";
import { DashboardPromoBanner } from "@/components/dashboard/dashboard-promo-banner";
import { useDashboardOverview } from "@/hooks/use-dashboard";
import type { DashboardQueryParams } from "@/types/dashboard";

export default function DashboardPage() {
  const [selectedStoreId, setSelectedStoreId] = React.useState<string | undefined>(undefined);
  const [selectedPeriod, setSelectedPeriod] = React.useState<"today" | "7d" | "30d">("30d");

  const queryParams = React.useMemo<DashboardQueryParams>(() => {
    const params: DashboardQueryParams = {
      period: selectedPeriod
    };
    if (selectedStoreId) {
      params.storeId = selectedStoreId;
    }
    return params;
  }, [selectedStoreId, selectedPeriod]);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useDashboardOverview(queryParams);

  return (
    <PageContainer>
      <div className="space-y-5 pb-20 md:pb-6">
        {/* 1. Dashboard Header / Hero with store & period filters */}
        <DashboardHeader
          selectedStoreId={selectedStoreId}
          onStoreChange={setSelectedStoreId}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
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
        <div className="pt-24 sm:pt-36 lg:pt-48 xl:pt-56">
          <DashboardKPIGrid
            summary={data?.summary}
            mobileSummary={data?.mobileSummary}
            isLoading={isLoading}
          />
        </div>

        {/* 3. Mobile Quick Actions Row */}
        <div className="md:hidden">
          <DashboardQuickActions />
        </div>

        {/* ======================================================== */}
        {/* DESKTOP LAYOUT (md:block) */}
        {/* ======================================================== */}
        <div className="hidden md:block space-y-4 sm:space-y-5">
          {/* Row 2: Sales Overview (4/10) + Inventory Distribution (3/10) + Store Performance (3/10) */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-5 items-stretch">
            <div className="lg:col-span-4 h-full min-h-[290px] sm:min-h-[305px]">
              <SalesOverviewChart
                salesOverview={data?.salesOverview}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-3 h-full min-h-[290px] sm:min-h-[305px]">
              <InventoryDistributionCard
                data={data?.inventoryDistribution}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-3 h-full min-h-[290px] sm:min-h-[305px]">
              <StorePerformanceCard
                stores={data?.storePerformance}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Row 3: Recent Inventory Activity (4/10) + Top Categories (3/10) + Alerts & Notifications (3/10) */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-5 items-stretch">
            <div className="lg:col-span-4 h-full min-h-[290px] sm:min-h-[305px]">
              <RecentInventoryActivity
                activities={data?.recentActivity}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-3 h-full min-h-[290px] sm:min-h-[305px]">
              <TopCategoriesCard
                categories={data?.topCategories}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-3 h-full min-h-[290px] sm:min-h-[305px]">
              <DashboardAlerts
                alerts={data?.inventoryAlerts}
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
          {/* 1. Sales Overview Mobile Chart */}
          <SalesOverviewChart
            salesOverview={data?.salesOverview}
            isLoading={isLoading}
          />

          {/* 2. Inventory Distribution Card */}
          <InventoryDistributionCard
            data={data?.inventoryDistribution}
            isLoading={isLoading}
          />

          {/* 3. Store Performance Card */}
          <StorePerformanceCard
            stores={data?.storePerformance}
            isLoading={isLoading}
          />

          {/* 4. Recent Inventory Activity */}
          <RecentInventoryActivity
            activities={data?.recentActivity}
            isLoading={isLoading}
          />

          {/* 5. Top Categories Card */}
          <TopCategoriesCard
            categories={data?.topCategories}
            isLoading={isLoading}
          />

          {/* 6. Alerts & Notifications */}
          <DashboardAlerts
            alerts={data?.inventoryAlerts}
            isLoading={isLoading}
          />

          {/* 7. Promotional Glass Banner */}
          <DashboardPromoBanner />
        </div>
      </div>
    </PageContainer>
  );
}
