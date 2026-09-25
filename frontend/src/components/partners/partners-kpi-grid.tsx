"use client";

import * as React from "react";
import type { PartnersSummary, SparklinePoint } from "@/types/partners";
import { UsersIcon, ShoppingCartIcon, TruckIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/common/loading-state";
import { PartnerPromoCard } from "./partner-promo-card";
import { cn } from "@/lib/cn";

export interface PartnersKPIGridProps {
  summary?: PartnersSummary;
  isLoading?: boolean;
  className?: string;
  onCardClick?: (type: string) => void;
  onAddPartner?: () => void;
}

// Mini SVG Sparkline Component matching Dashboard luminous styling
function MiniSparkline({
  data,
  color = "#38BDF8",
  width = 90,
  height = 36
}: {
  data: SparklinePoint[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (!data || data.length < 2) {
    return <div className="w-[90px] h-[36px]" />;
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 4;
  const usableHeight = height - padding * 2;
  const stepX = width / (data.length - 1);

  const points = values.map((val, idx) => {
    const x = idx * stepX;
    const y = height - padding - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  // Build SVG path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx1 = prev.x + (curr.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (curr.x - prev.x) / 2;
    const cy2 = curr.y;
    pathD += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
  }

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
      <div className={cn("grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-4 xl:gap-5", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 rounded-2xl bg-[#051A33]/25 backdrop-blur-md border border-white/20 shadow-lg space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="w-10 h-10 rounded-xl bg-white/20" />
              <Skeleton className="w-16 h-7 rounded bg-white/20" />
            </div>
            <Skeleton className="w-20 h-4 rounded bg-white/20" />
            <Skeleton className="w-28 h-7 rounded bg-white/20" />
            <Skeleton className="w-32 h-3.5 rounded bg-white/20" />
          </div>
        ))}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1 xl:col-span-1 p-4 sm:p-5 rounded-2xl bg-[#051A33]/30 backdrop-blur-md border border-white/20 shadow-lg space-y-3">
          <Skeleton className="h-6 w-32 bg-white/20 rounded" />
          <Skeleton className="h-4 w-24 bg-white/20 rounded" />
          <Skeleton className="h-8 w-28 bg-[#0071DC] rounded-lg mt-4" />
        </div>
      </div>
    );
  }

  const cards = [
    {
      key: "totalPartners",
      label: "Total Partners",
      value: summary.totalPartners,
      trend: summary.trends.totalPartners.changePercent,
      sparkline: summary.trends.totalPartners.sparkline,
      filterType: "ALL",
      color: "#38BDF8",
      bgIcon: "bg-blue-500/25 border border-blue-400/35 text-blue-200",
      icon: UsersIcon
    },
    {
      key: "retailers",
      label: "Retailers",
      value: summary.retailers,
      trend: summary.trends.retailers.changePercent,
      sparkline: summary.trends.retailers.sparkline,
      filterType: "RETAILER",
      color: "#34D399",
      bgIcon: "bg-emerald-500/25 border border-emerald-400/35 text-emerald-200",
      icon: ShoppingCartIcon
    },
    {
      key: "suppliers",
      label: "Suppliers",
      value: summary.suppliers,
      trend: summary.trends.suppliers.changePercent,
      sparkline: summary.trends.suppliers.sparkline,
      filterType: "SUPPLIER",
      color: "#A78BFA",
      bgIcon: "bg-purple-500/25 border border-purple-400/35 text-purple-200",
      icon: TruckIcon
    },
    {
      key: "endCustomers",
      label: "End Customers",
      value: summary.endCustomers,
      trend: summary.trends.endCustomers.changePercent,
      sparkline: summary.trends.endCustomers.sparkline,
      filterType: "CUSTOMER",
      color: "#FBBF24",
      bgIcon: "bg-amber-500/25 border border-amber-400/35 text-amber-200",
      icon: UsersIcon
    }
  ];

  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-4 xl:gap-5", className)}>
      {cards.map((card) => {
        const Icon = card.icon;
        const trendVal = card.trend;
        const hasPositiveTrend = trendVal !== null && trendVal >= 0;

        return (
          <div
            key={card.key}
            onClick={() => onCardClick?.(card.filterType)}
            className={cn(
              "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 select-none flex flex-col justify-between",
              "bg-[#051A33]/25 hover:bg-[#051A33]/35 backdrop-blur-md border border-white/25 text-white shadow-lg hover:shadow-xl cursor-pointer group",
              "hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            {/* Top row: Icon on left */}
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition group-hover:scale-105 shadow-xs",
                  card.bgIcon
                )}
              >
                <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </div>
            </div>

            {/* Middle: Label & Metric Value */}
            <div className="mt-3">
              <span className="text-xs sm:text-sm font-medium text-white/80">
                {card.label}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-0.5 drop-shadow-xs">
                {card.value.toLocaleString()}
              </div>
            </div>

            {/* Bottom row: Trend indicator & Sparkline */}
            <div className="mt-2.5 flex items-end justify-between gap-2">
              <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                {trendVal !== null ? (
                  <span
                    className={cn(
                      "font-semibold flex items-center gap-0.5",
                      hasPositiveTrend ? "text-emerald-300" : "text-rose-300"
                    )}
                  >
                    <span>{hasPositiveTrend ? "↑" : "↓"}</span>
                    <span>{Math.abs(trendVal)}%</span>
                  </span>
                ) : (
                  <span className="text-white/50 font-medium">—</span>
                )}
                <span className="text-white/60 font-normal">vs prev 30d</span>
              </div>

              {/* Sparkline */}
              <div className="shrink-0 group-hover:scale-105 transition-transform duration-200 drop-shadow-xs">
                <MiniSparkline data={card.sparkline} color={card.color} />
              </div>
            </div>
          </div>
        );
      })}

      {/* 5th Card: Promo Card matching liquid glass opacity and styling */}
      <div className="col-span-2 sm:col-span-1 lg:col-span-1 xl:col-span-1">
        <PartnerPromoCard onAddPartner={onAddPartner} />
      </div>
    </div>
  );
}
