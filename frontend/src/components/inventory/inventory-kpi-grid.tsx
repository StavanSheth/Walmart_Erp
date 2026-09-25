"use client";

import * as React from "react";
import { formatNumber } from "@/lib/format";
import { Skeleton } from "@/components/common/loading-state";
import { cn } from "@/lib/cn";
import type { InventorySummary, StockStatus } from "@/types/inventory";

export interface InventoryKPIGridProps {
  summary?: InventorySummary;
  isLoading?: boolean;
  selectedStatus?: StockStatus;
  onStatusClick?: (status: StockStatus) => void;
}

interface StockSparklineProps {
  trend?: "up" | "down" | "surge" | "steady";
  color?: string;
  id?: string;
  className?: string;
}

/**
 * Stock-style ticker sparkline with gradient area fill underneath and live price point
 * Reused exactly from Dashboard KPI cards for 100% design fidelity.
 */
function StockSparkline({
  trend = "up",
  color = "#0071DC",
  id,
  className = "w-16 sm:w-20 h-7"
}: StockSparklineProps) {
  const reactId = React.useId().replace(/:/g, "");
  const gradId = `spark-inv-${reactId}-${id || ""}`;

  let linePath = "M 2 18 C 14 16, 20 22, 32 12 C 42 4, 52 14, 62 4";
  let areaPath = "M 2 18 C 14 16, 20 22, 32 12 C 42 4, 52 14, 62 4 L 62 26 L 2 26 Z";
  let endX = 62;
  let endY = 4;

  if (trend === "down") {
    linePath = "M 2 6 C 14 8, 22 4, 34 14 C 44 22, 54 16, 62 20";
    areaPath = "M 2 6 C 14 8, 22 4, 34 14 C 44 22, 54 16, 62 20 L 62 26 L 2 26 Z";
    endX = 62;
    endY = 20;
  } else if (trend === "surge") {
    linePath = "M 2 20 C 14 18, 24 16, 34 10 C 44 8, 52 6, 62 3";
    areaPath = "M 2 20 C 14 18, 24 16, 34 10 C 44 8, 52 6, 62 3 L 62 26 L 2 26 Z";
    endX = 62;
    endY = 3;
  } else if (trend === "steady") {
    linePath = "M 2 14 C 14 18, 24 8, 34 16 C 44 10, 52 16, 62 12";
    areaPath = "M 2 14 C 14 18, 24 8, 34 16 C 44 10, 52 16, 62 12 L 62 26 L 2 26 Z";
    endX = 62;
    endY = 12;
  }

  return (
    <svg className={`${className} shrink-0 overflow-visible`} viewBox="0 0 64 26" fill="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="70%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={endX} cy={endY} r="2" fill={color} />
    </svg>
  );
}

function formatInventoryValue(val: number): string {
  if (isNaN(val) || val === 0) return "$0.00M";
  if (val >= 1000000) {
    return `$${(val / 1000000).toFixed(2)}M`;
  }
  if (val >= 1000) {
    return `$${(val / 1000).toFixed(1)}K`;
  }
  return `$${formatNumber(val)}`;
}

export function InventoryKPIGrid({
  summary,
  isLoading = false,
  selectedStatus = "ALL",
  onStatusClick
}: InventoryKPIGridProps) {
  if (isLoading || !summary) {
    return (
      <div>
        {/* Desktop Skeleton */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 rounded-2xl glass-card space-y-3 bg-[#051A33]/25 backdrop-blur-md border border-white/20">
              <Skeleton className="w-10 h-10 rounded-xl bg-white/20" />
              <Skeleton className="w-24 h-3.5 rounded bg-white/20" />
              <Skeleton className="w-32 h-7 rounded bg-white/20" />
            </div>
          ))}
        </div>
        {/* Mobile Skeleton */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={cn(
                "p-3.5 rounded-2xl glass-card space-y-2 bg-[#06182c]/85 backdrop-blur-xl border border-white/30",
                i === 5 && "col-span-2"
              )}
            >
              <Skeleton className="w-8 h-8 rounded-lg bg-white/20" />
              <Skeleton className="w-20 h-3 rounded bg-white/20" />
              <Skeleton className="w-24 h-5 rounded bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      id: "total-products",
      label: "Total Products",
      value: formatNumber(summary.totalProducts),
      status: "ALL" as StockStatus,
      iconContainer: "bg-blue-500/25 border-blue-400/35 text-blue-200",
      mobileIconContainer: "bg-blue-500/30 border-blue-400/40 text-blue-300",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      trendText: "↑ 6.8%",
      trendSub: "vs. last month",
      trendColor: "text-emerald-400",
      sparkColor: "#38BDF8",
      sparkTrend: "up" as const
    },
    {
      id: "low-stock",
      label: "Low Stock Items",
      value: formatNumber(summary.lowStockItems),
      status: "LOW_STOCK" as StockStatus,
      iconContainer: "bg-amber-500/25 border-amber-400/35 text-amber-200",
      mobileIconContainer: "bg-amber-500/30 border-amber-400/40 text-amber-300",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      trendText: "↑ 12%",
      trendSub: "vs. last month",
      trendColor: "text-amber-400",
      sparkColor: "#FBBF24",
      sparkTrend: "steady" as const
    },
    {
      id: "out-of-stock",
      label: "Out of Stock",
      value: formatNumber(summary.outOfStockItems),
      status: "OUT_OF_STOCK" as StockStatus,
      iconContainer: "bg-rose-500/25 border-rose-400/35 text-rose-200",
      mobileIconContainer: "bg-rose-500/30 border-rose-400/40 text-rose-300",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      trendText: "↓ 18%",
      trendSub: "vs. last month",
      trendColor: "text-rose-400",
      sparkColor: "#FB7185",
      sparkTrend: "down" as const
    },
    {
      id: "in-transit",
      label: "In Transit",
      value: formatNumber(summary.inTransitItems),
      status: "ALL" as StockStatus,
      iconContainer: "bg-purple-500/25 border-purple-400/35 text-purple-200",
      mobileIconContainer: "bg-purple-500/30 border-purple-400/40 text-purple-300",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 18H9" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14v10Z" />
          <circle cx="17" cy="18" r="2" strokeWidth={1.8} />
          <circle cx="7" cy="18" r="2" strokeWidth={1.8} />
        </svg>
      ),
      trendText: "↑ 9%",
      trendSub: "vs. last month",
      trendColor: "text-purple-300",
      sparkColor: "#C084FC",
      sparkTrend: "up" as const
    },
    {
      id: "inventory-value",
      label: "Inventory Value",
      value: formatInventoryValue(summary.inventoryValue),
      status: "ALL" as StockStatus,
      iconContainer: "bg-emerald-500/25 border-emerald-400/35 text-emerald-200",
      mobileIconContainer: "bg-emerald-500/30 border-emerald-400/40 text-emerald-300",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      trendText: "↑ 4.6%",
      trendSub: "vs. last month",
      trendColor: "text-emerald-400",
      sparkColor: "#34D399",
      sparkTrend: "surge" as const
    }
  ];

  return (
    <div>
      {/* =========================================================================
          DESKTOP: 5 Glass KPI Cards (Matching Dashboard Grid Rules)
          ========================================================================= */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {cards.map((card) => {
          const isFilterable = card.status !== "ALL" || (card.id === "total-products" && selectedStatus !== "ALL");
          const isSelected = selectedStatus === card.status && card.status !== "ALL";

          return (
            <div
              key={card.id}
              onClick={() => {
                if (onStatusClick) {
                  if (card.id === "total-products") {
                    onStatusClick("ALL");
                  } else if (card.status !== "ALL") {
                    onStatusClick(isSelected ? "ALL" : card.status);
                  }
                }
              }}
              className={cn(
                "bg-[#051A33]/25 hover:bg-[#051A33]/35 backdrop-blur-md border border-white/25 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all duration-200 text-white select-none",
                isFilterable && "cursor-pointer hover:scale-[1.01] active:scale-[0.99]",
                isSelected && "ring-2 ring-white/80 bg-[#051A33]/45 shadow-xl border-white/40"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 backdrop-blur-md shadow-xs",
                    card.iconContainer
                  )}
                >
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider truncate">
                    {card.label}
                  </p>
                  <h3 className="text-xl lg:text-2xl font-black text-white tabular-nums leading-tight drop-shadow-sm mt-0.5">
                    {card.value}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/15">
                <div className="text-[11px]">
                  <span className={cn("font-bold", card.trendColor)}>{card.trendText}</span>
                  <span className="text-blue-100/80 ml-1">{card.trendSub}</span>
                </div>
                <StockSparkline trend={card.sparkTrend} color={card.sparkColor} id={card.id} />
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          MOBILE: 2-Column Glass KPI Cards (Matching Dashboard Grid Rules)
          ========================================================================= */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {cards.map((card, idx) => {
          const isFilterable = card.status !== "ALL" || (card.id === "total-products" && selectedStatus !== "ALL");
          const isSelected = selectedStatus === card.status && card.status !== "ALL";

          return (
            <div
              key={`m-${card.id}`}
              onClick={() => {
                if (onStatusClick) {
                  if (card.id === "total-products") {
                    onStatusClick("ALL");
                  } else if (card.status !== "ALL") {
                    onStatusClick(isSelected ? "ALL" : card.status);
                  }
                }
              }}
              className={cn(
                "bg-[#06182c]/85 backdrop-blur-xl border border-white/30 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg text-white transition-all select-none",
                idx === 4 && "col-span-2",
                isFilterable && "cursor-pointer active:scale-95",
                isSelected && "ring-2 ring-white/80 bg-[#06182c]/95 shadow-xl border-white/50"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mb-2 backdrop-blur-md shadow-xs",
                  card.mobileIconContainer
                )}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-blue-100 uppercase tracking-wide drop-shadow-xs truncate">
                  {card.label}
                </p>
                <h3 className="text-xl font-black text-white tabular-nums mt-1 drop-shadow-md tracking-tight">
                  {card.value}
                </h3>
              </div>
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/20 text-xs font-bold">
                <span className={cn("drop-shadow-xs", card.trendColor)}>{card.trendText}</span>
                <StockSparkline
                  trend={card.sparkTrend}
                  color={card.sparkColor}
                  id={`m-${card.id}`}
                  className="w-14 h-5"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
