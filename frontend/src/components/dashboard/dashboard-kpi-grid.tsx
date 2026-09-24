"use client";

import * as React from "react";
import { KPICard } from "@/components/ui/card";
import { StoreIcon, PackageIcon, ArrowUpDownIcon } from "@/components/ui/icons";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { DashboardSummary } from "@/types/dashboard";

export interface DashboardKPIGridProps {
  summary?: DashboardSummary;
  isLoading?: boolean;
}

export function DashboardKPIGrid({ summary, isLoading = false }: DashboardKPIGridProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <KPICard key={i} title="Loading..." value="---" isLoading />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Net & Gross Sales */}
      <KPICard
        title="Net Sales Revenue"
        value={formatCurrency(summary.netSales)}
        change={`Gross: ${formatCurrency(summary.grossSales)}`}
        isPositive
        trendLabel="completed"
        icon={<span className="font-bold text-xs">₹</span>}
        iconBg="bg-emerald-50 text-semantic-success"
      />

      {/* 2. Completed Orders & AOV */}
      <KPICard
        title="Completed Orders"
        value={formatNumber(summary.orders)}
        change={summary.orders > 0 ? `${formatCurrency(summary.averageOrderValue)}` : "₹0"}
        isPositive
        trendLabel="average order value"
        icon={<ArrowUpDownIcon className="w-4 h-4" />}
        iconBg="bg-brand-sky text-brand-primary"
      />

      {/* 3. Active Stores */}
      <KPICard
        title="Active Outlets"
        value={`${summary.activeStores} Stores`}
        change="Operational"
        isPositive
        trendLabel="live network"
        icon={<StoreIcon className="w-4 h-4" />}
        iconBg="bg-sky-50 text-semantic-info"
      />

      {/* 4. Tracked SKUs & Low Stock */}
      <KPICard
        title="Tracked Catalog"
        value={`${formatNumber(summary.totalSkus)} SKUs`}
        change={
          summary.lowStockSkus > 0
            ? `${summary.lowStockSkus} SKUs Low Stock`
            : "Stock Healthy"
        }
        isPositive={summary.lowStockSkus === 0}
        trendLabel="inventory status"
        icon={<PackageIcon className="w-4 h-4" />}
        iconBg="bg-amber-50 text-semantic-warning"
      />
    </div>
  );
}
