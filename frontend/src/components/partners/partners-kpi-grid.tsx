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

// Mini SVG Sparkline Component
function MiniSparkline({
  data,
  color = "#0071DC",
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
            className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="w-16 h-7 rounded" />
            </div>
            <Skeleton className="w-20 h-4 rounded" />
            <Skeleton className="w-28 h-7 rounded" />
            <Skeleton className="w-32 h-3.5 rounded" />
          </div>
        ))}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1 xl:col-span-1 p-4 sm:p-5 rounded-2xl bg-[#0A2540] border border-white/20 shadow-sm space-y-3">
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
      color: "#0071DC",
      bgIcon: "bg-blue-50 text-[#0071DC]",
      icon: UsersIcon
    },
    {
      key: "retailers",
      label: "Retailers",
      value: summary.retailers,
      trend: summary.trends.retailers.changePercent,
      sparkline: summary.trends.retailers.sparkline,
      filterType: "RETAILER",
      color: "#10B981",
      bgIcon: "bg-emerald-50 text-emerald-600",
      icon: ShoppingCartIcon
    },
    {
      key: "suppliers",
      label: "Suppliers",
      value: summary.suppliers,
      trend: summary.trends.suppliers.changePercent,
      sparkline: summary.trends.suppliers.sparkline,
      filterType: "SUPPLIER",
      color: "#8B5CF6",
      bgIcon: "bg-purple-50 text-purple-600",
      icon: TruckIcon
    },
    {
      key: "endCustomers",
      label: "End Customers",
      value: summary.endCustomers,
      trend: summary.trends.endCustomers.changePercent,
      sparkline: summary.trends.endCustomers.sparkline,
      filterType: "CUSTOMER",
      color: "#F59E0B",
      bgIcon: "bg-amber-50 text-amber-600",
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
              "bg-white/80 hover:bg-white/95 backdrop-blur-md border border-white/70 shadow-sm hover:shadow-md cursor-pointer group"
            )}
          >
            {/* Top row: Icon on left */}
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition group-hover:scale-105",
                  card.bgIcon
                )}
              >
                <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </div>
            </div>

            {/* Middle: Label & Metric Value */}
            <div className="mt-3">
              <span className="text-xs sm:text-sm font-medium text-slate-500">
                {card.label}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-0.5">
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
                      hasPositiveTrend ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    <span>{hasPositiveTrend ? "↑" : "↓"}</span>
                    <span>{Math.abs(trendVal)}%</span>
                  </span>
                ) : (
                  <span className="text-slate-400 font-medium">—</span>
                )}
                <span className="text-slate-400 font-normal">vs. last month</span>
              </div>

              {/* Sparkline */}
              <div className="shrink-0 group-hover:scale-105 transition-transform duration-200">
                <MiniSparkline data={card.sparkline} color={card.color} />
              </div>
            </div>
          </div>
        );
      })}

      {/* 5th Card: Promo Card matching reference image desktop top row */}
      <div className="col-span-2 sm:col-span-1 lg:col-span-1 xl:col-span-1">
        <PartnerPromoCard onAddPartner={onAddPartner} />
      </div>
    </div>
  );
}
