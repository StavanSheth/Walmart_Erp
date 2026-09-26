"use client";

import * as React from "react";
import type { PartnersSummary } from "@/types/partners";
import { UsersIcon, ShoppingCartIcon, TruckIcon } from "@/components/ui/icons";
import { MetricCard } from "@/components/common/metric-card";
import { formatNumber } from "@/lib/format";
import { PartnerPromoCard } from "./partner-promo-card";
import { cn } from "@/lib/cn";

export interface PartnersKPIGridProps {
  summary?: PartnersSummary;
  isLoading?: boolean;
  className?: string;
  onCardClick?: (type: string) => void;
  onAddPartner?: () => void;
}

export function PartnersKPIGrid({
  summary,
  isLoading = false,
  className,
  onCardClick,
  onAddPartner
}: PartnersKPIGridProps) {
  if (isLoading || !summary) {
    return (
      <div className={className}>
        {/* Desktop Skeleton: 5 Glass Cards */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <MetricCard key={i} label="" value="" isLoading variant="glass" />
          ))}
        </div>
        {/* Mobile Skeleton: 4 Glass-Mobile Cards + 1 Col-Span-2 Card */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {[1, 2, 3, 4].map((i) => (
            <MetricCard key={i} label="" value="" isLoading variant="glass-mobile" />
          ))}
          <MetricCard label="" value="" isLoading variant="glass-mobile" className="col-span-2 min-h-[110px]" />
        </div>
      </div>
    );
  }

  const cards = [
    {
      id: "kpi-total-partners",
      label: "Total Partners",
      value: formatNumber(summary.totalPartners),
      subLabel: "vs prev 30d",
      trendText:
        summary.trends.totalPartners.changePercent != null
          ? `${summary.trends.totalPartners.changePercent >= 0 ? "↑" : "↓"} ${Math.abs(summary.trends.totalPartners.changePercent)}%`
          : undefined,
      trendPositive:
        summary.trends.totalPartners.changePercent != null
          ? summary.trends.totalPartners.changePercent >= 0
          : true,
      filterType: "ALL",
      sparklineTrend: "up" as const,
      sparklineColor: "#38BDF8",
      icon: <UsersIcon className="w-5 h-5 text-blue-200" />,
      mobileIcon: <UsersIcon className="w-4 h-4 text-blue-200" />,
      iconBadge: "bg-blue-500/25 border-blue-400/35 text-blue-200",
      mobileIconBadge: "bg-blue-500/30 border-blue-400/40 text-blue-300 w-8 h-8 rounded-lg mb-2"
    },
    {
      id: "kpi-retailers",
      label: "Retailers",
      value: formatNumber(summary.retailers),
      subLabel: "vs prev 30d",
      trendText:
        summary.trends.retailers.changePercent != null
          ? `${summary.trends.retailers.changePercent >= 0 ? "↑" : "↓"} ${Math.abs(summary.trends.retailers.changePercent)}%`
          : undefined,
      trendPositive:
        summary.trends.retailers.changePercent != null
          ? summary.trends.retailers.changePercent >= 0
          : true,
      filterType: "RETAILER",
      sparklineTrend: "surge" as const,
      sparklineColor: "#34D399",
      icon: <ShoppingCartIcon className="w-5 h-5 text-emerald-200" />,
      mobileIcon: <ShoppingCartIcon className="w-4 h-4 text-emerald-200" />,
      iconBadge: "bg-emerald-500/25 border-emerald-400/35 text-emerald-200",
      mobileIconBadge: "bg-emerald-500/30 border-emerald-400/40 text-emerald-300 w-8 h-8 rounded-lg mb-2"
    },
    {
      id: "kpi-suppliers",
      label: "Suppliers",
      value: formatNumber(summary.suppliers),
      subLabel: "vs prev 30d",
      trendText:
        summary.trends.suppliers.changePercent != null
          ? `${summary.trends.suppliers.changePercent >= 0 ? "↑" : "↓"} ${Math.abs(summary.trends.suppliers.changePercent)}%`
          : undefined,
      trendPositive:
        summary.trends.suppliers.changePercent != null
          ? summary.trends.suppliers.changePercent >= 0
          : true,
      filterType: "SUPPLIER",
      sparklineTrend: "up" as const,
      sparklineColor: "#A78BFA",
      icon: <TruckIcon className="w-5 h-5 text-purple-200" />,
      mobileIcon: <TruckIcon className="w-4 h-4 text-purple-200" />,
      iconBadge: "bg-purple-500/25 border-purple-400/35 text-purple-200",
      mobileIconBadge: "bg-purple-500/30 border-purple-400/40 text-purple-300 w-8 h-8 rounded-lg mb-2"
    },
    {
      id: "kpi-end-customers",
      label: "End Customers",
      value: formatNumber(summary.endCustomers),
      subLabel: "vs prev 30d",
      trendText:
        summary.trends.endCustomers.changePercent != null
          ? `${summary.trends.endCustomers.changePercent >= 0 ? "↑" : "↓"} ${Math.abs(summary.trends.endCustomers.changePercent)}%`
          : undefined,
      trendPositive:
        summary.trends.endCustomers.changePercent != null
          ? summary.trends.endCustomers.changePercent >= 0
          : true,
      filterType: "CUSTOMER",
      sparklineTrend: "steady" as const,
      sparklineColor: "#FBBF24",
      icon: <UsersIcon className="w-5 h-5 text-amber-200" />,
      mobileIcon: <UsersIcon className="w-4 h-4 text-amber-200" />,
      iconBadge: "bg-amber-500/25 border-amber-400/35 text-amber-200",
      mobileIconBadge: "bg-amber-500/30 border-amber-400/40 text-amber-300 w-8 h-8 rounded-lg mb-2"
    }
  ];

  return (
    <div className={cn("space-y-3.5", className)}>
      {/* 1. Desktop: 5 Glass Metric Cards (4 KPI Cards + 1 Promo Card) */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {cards.map((card) => (
          <MetricCard
            key={card.id}
            id={card.id}
            label={card.label}
            value={card.value}
            subLabel={card.subLabel}
            trendText={card.trendText}
            trendPositive={card.trendPositive}
            icon={card.icon}
            iconContainerClassName={card.iconBadge}
            sparklineTrend={card.sparklineTrend}
            sparklineColor={card.sparklineColor}
            variant="glass"
            isFilterable={true}
            onClick={() => onCardClick?.(card.filterType)}
          />
        ))}
        <PartnerPromoCard onAddPartner={onAddPartner} />
      </div>

      {/* 2. Mobile: 2x2 Glass Metric Cards + Promo Card */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {cards.map((card) => (
          <MetricCard
            key={`m-${card.id}`}
            id={`m-${card.id}`}
            label={card.label}
            value={card.value}
            subLabel={card.subLabel}
            trendText={card.trendText}
            trendPositive={card.trendPositive}
            icon={card.mobileIcon}
            iconContainerClassName={card.mobileIconBadge}
            sparklineTrend={card.sparklineTrend}
            sparklineColor={card.sparklineColor}
            variant="glass-mobile"
            isFilterable={true}
            onClick={() => onCardClick?.(card.filterType)}
          />
        ))}
        <PartnerPromoCard
          className="col-span-2 min-h-[110px] p-3.5 bg-[#06182c]/85 hover:bg-[#06182c]/95 border-white/30"
          onAddPartner={onAddPartner}
        />
      </div>
    </div>
  );
}
