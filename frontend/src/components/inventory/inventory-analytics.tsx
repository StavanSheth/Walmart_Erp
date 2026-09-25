import * as React from "react";
import { InventoryOverviewChart } from "./inventory-overview-chart";
import { InventoryCategoryChart } from "./inventory-category-chart";
import { InventoryStockStatus } from "./inventory-stock-status";
import type { InventoryAnalytics, StockStatus } from "@/types/inventory";

export interface InventoryAnalyticsSectionProps {
  analytics?: InventoryAnalytics;
  totalProducts?: number;
  isLoading?: boolean;
  onStatusClick?: (status: StockStatus) => void;
  onCategorySelect?: (categoryId: string) => void;
}

export function InventoryAnalyticsSection({
  analytics,
  totalProducts = 0,
  isLoading = false,
  onStatusClick,
  onCategorySelect
}: InventoryAnalyticsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
      {/* 1. Left Card: Inventory Overview (stacked bar chart) */}
      <div className="lg:col-span-5 flex flex-col h-full min-h-[330px]">
        <InventoryOverviewChart
          trendData={analytics?.inventoryTrend}
          isLoading={isLoading}
        />
      </div>

      {/* 2. Middle Card: Inventory by Category (donut chart + category list) */}
      <div className="lg:col-span-4 flex flex-col h-full min-h-[330px]">
        <InventoryCategoryChart
          categories={analytics?.categoryDistribution}
          totalProducts={totalProducts}
          isLoading={isLoading}
          onCategorySelect={onCategorySelect}
        />
      </div>

      {/* 3. Right Card: Stock Status Breakdown + Health Score */}
      <div className="lg:col-span-3 flex flex-col h-full min-h-[330px]">
        <InventoryStockStatus
          stockStatus={analytics?.stockStatus}
          isLoading={isLoading}
          onStatusClick={onStatusClick}
        />
      </div>
    </div>
  );
}
