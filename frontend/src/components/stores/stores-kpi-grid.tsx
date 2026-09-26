"use client";

import * as React from "react";
import { StoreNavIcon, MapPinIcon, AlertTriangleIcon, PlusIcon } from "@/components/ui/icons";
import { MetricCard } from "@/components/common/metric-card";
import { formatNumber } from "@/lib/format";
import type { StoreKPISummary } from "@/types/stores";

interface StoresKPIGridProps {
  summary?: StoreKPISummary;
  selectedStatus?: string;
  onStatusChange?: (status: string) => void;
  isLoading?: boolean;
}

export function StoresKPIGrid({
  summary,
  selectedStatus = "ALL",
  onStatusChange,
  isLoading = false
}: StoresKPIGridProps) {
  if (isLoading || !summary) {
    return (
      <div>
        {/* Desktop & Tablet Skeleton */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <MetricCard key={i} label="" value="" isLoading variant="glass" />
          ))}
        </div>
        {/* Mobile Skeleton (2x2 grid matching dashboard) */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {[1, 2, 3, 4].map((i) => (
            <MetricCard key={i} label="" value="" isLoading variant="glass-mobile" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    {
      id: "kpi-total-stores",
      label: "Total Stores",
      shortLabel: "Total Stores",
      value: formatNumber(summary.totalStores),
      subLabel: "vs. last quarter",
      trendText: summary.trends.totalStoresChangePct != null ? `↑ ${summary.trends.totalStoresChangePct}%` : "↑ 2.1%",
      trendPositive: true,
      icon: <StoreNavIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" />,
      iconBadge: "bg-blue-500/25 border-blue-400/35 text-blue-200",
      sparklineColor: "#38BDF8",
      sparklineTrend: "up" as const,
      statusKey: "ALL"
    },
    {
      id: "kpi-operational-stores",
      label: "Operational",
      shortLabel: "Operational",
      value: formatNumber(summary.operationalStores),
      subLabel: "vs. last quarter",
      trendText: summary.trends.operationalChangePct != null ? `↑ ${summary.trends.operationalChangePct}%` : "↑ 98%",
      trendPositive: true,
      icon: <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" />,
      iconBadge: "bg-emerald-500/25 border-emerald-400/35 text-emerald-200",
      sparklineColor: "#34D399",
      sparklineTrend: "surge" as const,
      statusKey: "ACTIVE"
    },
    {
      id: "kpi-maintenance-stores",
      label: "Under Maintenance",
      shortLabel: "Under Maint.",
      value: formatNumber(summary.maintenanceStores),
      subLabel: "vs. last quarter",
      trendText: summary.trends.maintenanceChangePct != null ? `↑ ${summary.trends.maintenanceChangePct}%` : "↑ 12%",
      trendPositive: false,
      icon: <AlertTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />,
      iconBadge: "bg-amber-500/25 border-amber-400/35 text-amber-200",
      sparklineColor: "#FBBF24",
      sparklineTrend: "steady" as const,
      statusKey: "MAINTENANCE"
    },
    {
      id: "kpi-new-stores",
      label: "New Stores",
      shortLabel: "New Stores",
      value: formatNumber(summary.newStores),
      subLabel: "this year",
      trendText: summary.trends.newStoresChangePct != null ? `↑ ${summary.trends.newStoresChangePct}%` : "↑ 35%",
      trendPositive: true,
      icon: <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-200" />,
      iconBadge: "bg-purple-500/25 border-purple-400/35 text-purple-200",
      sparklineColor: "#A855F7",
      sparklineTrend: "up" as const,
      statusKey: "NEW"
    }
  ];

  return (
    <div>
      {/* 1. Desktop & Tablet 4-Card Grid (Full Liquid Glass UI with Sparklines) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-4">
        {kpis.map((kpi) => (
          <MetricCard
            key={kpi.id}
            id={kpi.id}
            label={kpi.label}
            value={kpi.value}
            subLabel={kpi.subLabel}
            trendText={kpi.trendText}
            trendPositive={kpi.trendPositive}
            icon={kpi.icon}
            iconContainerClassName={kpi.iconBadge}
            sparklineTrend={kpi.sparklineTrend}
            sparklineColor={kpi.sparklineColor}
            variant="glass"
            isFilterable={true}
            isSelected={selectedStatus === kpi.statusKey}
            onClick={() => onStatusChange?.(selectedStatus === kpi.statusKey && kpi.statusKey !== "ALL" ? "ALL" : kpi.statusKey)}
          />
        ))}
      </div>

      {/* 2. Mobile 2x2 Liquid Glass Grid (Exact same layout and styling as dashboard mobile) */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {kpis.map((kpi) => (
          <MetricCard
            key={`m-${kpi.id}`}
            id={`m-${kpi.id}`}
            label={kpi.label}
            value={kpi.value}
            subLabel={kpi.subLabel}
            trendText={kpi.trendText}
            trendPositive={kpi.trendPositive}
            icon={kpi.icon}
            iconContainerClassName={kpi.iconBadge}
            sparklineTrend={kpi.sparklineTrend}
            sparklineColor={kpi.sparklineColor}
            variant="glass-mobile"
            isFilterable={true}
            isSelected={selectedStatus === kpi.statusKey}
            onClick={() => onStatusChange?.(selectedStatus === kpi.statusKey && kpi.statusKey !== "ALL" ? "ALL" : kpi.statusKey)}
          />
        ))}
      </div>
    </div>
  );
}
