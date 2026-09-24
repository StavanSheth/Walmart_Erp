"use client";

import * as React from "react";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { DesktopSummary, MobileSummary } from "@/types/dashboard";
import { Skeleton } from "@/components/common/loading-state";

export interface DashboardKPIGridProps {
  summary?: DesktopSummary;
  mobileSummary?: MobileSummary;
  isLoading?: boolean;
}

interface StockSparklineProps {
  trend?: "up" | "down" | "surge" | "steady";
  color?: string;
  id?: string;
  className?: string;
}

/**
 * Stock-style ticker sparkline with gradient area fill underneath and live price point
 */
function StockSparkline({
  trend = "up",
  color = "#0071DC",
  id,
  className = "w-16 sm:w-20 h-7"
}: StockSparklineProps) {
  const reactId = React.useId().replace(/:/g, "");
  const gradId = `spark-${reactId}-${id || ""}`;

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
      {/* Stock Gradient Area */}
      <path d={areaPath} fill={`url(#${gradId})`} />
      {/* Stock Line Stroke */}
      <path
        d={linePath}
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End Ticker Point */}
      <circle cx={endX} cy={endY} r="2" fill={color} />
    </svg>
  );
}

export function DashboardKPIGrid({
  summary,
  mobileSummary,
  isLoading = false
}: DashboardKPIGridProps) {
  if (isLoading || !summary || !mobileSummary) {
    return (
      <div>
        {/* Desktop Skeleton */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 rounded-2xl glass-card space-y-3">
              <Skeleton className="w-8 h-8 rounded-xl" />
              <Skeleton className="w-24 h-4 rounded" />
              <Skeleton className="w-32 h-7 rounded" />
            </div>
          ))}
        </div>
        {/* Mobile Skeleton */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-3.5 rounded-2xl glass-card space-y-2">
              <Skeleton className="w-7 h-7 rounded-lg" />
              <Skeleton className="w-20 h-3 rounded" />
              <Skeleton className="w-24 h-5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* =========================================================================
          DESKTOP: 5 Glass KPI Cards
          ========================================================================= */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1. Total Products */}
        <div className="bg-[#072242]/70 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between shadow-xl hover:bg-[#072242]/80 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/25 border border-blue-400/30 flex items-center justify-center text-blue-200 text-lg shrink-0">
              📦
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider truncate">
                Total Products
              </p>
              <h3 className="text-xl lg:text-2xl font-black text-white tabular-nums leading-tight">
                {formatNumber(summary.totalProducts)}
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/15">
            <div className="text-[11px]">
              <span className="font-bold text-emerald-400">↑ 5%</span>
              <span className="text-blue-100/80 ml-1">vs. last month</span>
            </div>
            <StockSparkline trend="up" color="#38BDF8" id="products" />
          </div>
        </div>

        {/* 2. In Stock (Units) */}
        <div className="bg-[#072242]/70 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between shadow-xl hover:bg-[#072242]/80 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/25 border border-emerald-400/30 flex items-center justify-center text-emerald-200 text-lg shrink-0">
              🟢
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider truncate">
                In Stock (Units)
              </p>
              <h3 className="text-xl lg:text-2xl font-black text-white tabular-nums leading-tight">
                {formatNumber(summary.inStockUnits)}
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/15">
            <div className="text-[11px]">
              <span className="font-bold text-emerald-400">↑ 8%</span>
              <span className="text-blue-100/80 ml-1">vs. last month</span>
            </div>
            <StockSparkline trend="surge" color="#34D399" id="instock" />
          </div>
        </div>

        {/* 3. Low Stock Items */}
        <div className="bg-[#072242]/70 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between shadow-xl hover:bg-[#072242]/80 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/25 border border-amber-400/30 flex items-center justify-center text-amber-200 text-lg shrink-0">
              ⚠️
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider truncate">
                Low Stock Items
              </p>
              <h3 className="text-xl lg:text-2xl font-black text-white tabular-nums leading-tight">
                {formatNumber(summary.lowStockItems)}
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/15">
            <div className="text-[11px]">
              <span className="font-bold text-amber-400">↑ 12%</span>
              <span className="text-blue-100/80 ml-1">vs. last month</span>
            </div>
            <StockSparkline trend="steady" color="#FBBF24" id="lowstock" />
          </div>
        </div>

        {/* 4. Out of Stock */}
        <div className="bg-[#072242]/70 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between shadow-xl hover:bg-[#072242]/80 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/25 border border-rose-400/30 flex items-center justify-center text-rose-200 text-lg shrink-0">
              🚫
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider truncate">
                Out of Stock
              </p>
              <h3 className="text-xl lg:text-2xl font-black text-white tabular-nums leading-tight">
                {formatNumber(summary.outOfStockItems)}
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/15">
            <div className="text-[11px]">
              <span className="font-bold text-rose-400">↓ 6%</span>
              <span className="text-blue-100/80 ml-1">vs. last month</span>
            </div>
            <StockSparkline trend="down" color="#FB7185" id="outofstock" />
          </div>
        </div>

        {/* 5. Total Store Locations */}
        <div className="bg-[#072242]/70 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between shadow-xl hover:bg-[#072242]/80 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/25 border border-blue-400/30 flex items-center justify-center text-blue-200 text-lg shrink-0">
              🏪
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider truncate">
                Total Store Locations
              </p>
              <h3 className="text-xl lg:text-2xl font-black text-white tabular-nums leading-tight">
                {formatNumber(summary.totalStores)}
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/15">
            <div className="text-[11px]">
              <span className="font-bold text-emerald-400">+ 2</span>
              <span className="text-blue-100/80 ml-1">new this month</span>
            </div>
            <StockSparkline trend="up" color="#38BDF8" id="stores" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE: 2 × 2 Glass KPI Cards
          ========================================================================= */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {/* 1. Total Sales (Today) */}
        <div className="bg-[#072242]/75 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg text-white">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/25 border border-emerald-400/30 flex items-center justify-center text-emerald-200 text-sm mb-2">
            🛒
          </div>
          <div>
            <p className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider">
              Total Sales (Today)
            </p>
            <h3 className="text-lg font-black text-white tabular-nums mt-0.5">
              {formatCurrency(mobileSummary.totalSalesToday)}
            </h3>
          </div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/15 text-[10px]">
            <span className="font-bold text-emerald-400">↑ 12%</span>
            <StockSparkline trend="surge" color="#34D399" id="m-sales" className="w-14 h-5" />
          </div>
        </div>

        {/* 2. Total Orders */}
        <div className="bg-[#072242]/75 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg text-white">
          <div className="w-8 h-8 rounded-lg bg-blue-500/25 border border-blue-400/30 flex items-center justify-center text-blue-200 text-sm mb-2">
            📄
          </div>
          <div>
            <p className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider">
              Total Orders
            </p>
            <h3 className="text-lg font-black text-white tabular-nums mt-0.5">
              {formatNumber(mobileSummary.totalOrders)}
            </h3>
          </div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/15 text-[10px]">
            <span className="font-bold text-blue-400">↑ 8%</span>
            <StockSparkline trend="up" color="#38BDF8" id="m-orders" className="w-14 h-5" />
          </div>
        </div>

        {/* 3. Active Stores */}
        <div className="bg-[#072242]/75 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg text-white">
          <div className="w-8 h-8 rounded-lg bg-purple-500/25 border border-purple-400/30 flex items-center justify-center text-purple-200 text-sm mb-2">
            🏬
          </div>
          <div>
            <p className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider">
              Active Stores
            </p>
            <h3 className="text-lg font-black text-white tabular-nums mt-0.5">
              {formatNumber(mobileSummary.activeStores)}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 mt-2 pt-1 border-t border-white/15 text-[10px] text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>100% operational</span>
          </div>
        </div>

        {/* 4. Total Inventory Value */}
        <div className="bg-[#072242]/75 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg text-white">
          <div className="w-8 h-8 rounded-lg bg-rose-500/25 border border-rose-400/30 flex items-center justify-center text-rose-200 text-sm mb-2">
            📦
          </div>
          <div>
            <p className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider">
              Inventory Value
            </p>
            <h3 className="text-lg font-black text-white tabular-nums mt-0.5">
              {formatCurrency(mobileSummary.inventoryValue, true)}
            </h3>
          </div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/15 text-[10px]">
            <span className="font-bold text-rose-400">↓ 3%</span>
            <StockSparkline trend="down" color="#FB7185" id="m-val" className="w-14 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
