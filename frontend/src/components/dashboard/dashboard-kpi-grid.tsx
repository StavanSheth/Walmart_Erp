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
        <div className="bg-[#051A33]/25 hover:bg-[#051A33]/35 backdrop-blur-md border border-white/25 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all duration-200 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/25 border border-blue-400/35 flex items-center justify-center text-blue-200 shrink-0 backdrop-blur-md shadow-xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider truncate">
                Total Products
              </p>
              <h3 className="text-xl lg:text-2xl font-black text-white tabular-nums leading-tight drop-shadow-sm">
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
        <div className="bg-[#051A33]/25 hover:bg-[#051A33]/35 backdrop-blur-md border border-white/25 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all duration-200 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/25 border border-emerald-400/35 flex items-center justify-center text-emerald-200 shrink-0 backdrop-blur-md shadow-xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider truncate">
                In Stock (Units)
              </p>
              <h3 className="text-xl lg:text-2xl font-black text-white tabular-nums leading-tight drop-shadow-sm">
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
        <div className="bg-[#051A33]/25 hover:bg-[#051A33]/35 backdrop-blur-md border border-white/25 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all duration-200 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/25 border border-amber-400/35 flex items-center justify-center text-amber-200 shrink-0 backdrop-blur-md shadow-xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider truncate">
                Low Stock Items
              </p>
              <h3 className="text-xl lg:text-2xl font-black text-white tabular-nums leading-tight drop-shadow-sm">
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
        <div className="bg-[#051A33]/25 hover:bg-[#051A33]/35 backdrop-blur-md border border-white/25 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all duration-200 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/25 border border-rose-400/35 flex items-center justify-center text-rose-200 shrink-0 backdrop-blur-md shadow-xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider truncate">
                Out of Stock
              </p>
              <h3 className="text-xl lg:text-2xl font-black text-white tabular-nums leading-tight drop-shadow-sm">
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
        <div className="bg-[#051A33]/25 hover:bg-[#051A33]/35 backdrop-blur-md border border-white/25 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all duration-200 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/25 border border-blue-400/35 flex items-center justify-center text-blue-200 shrink-0 backdrop-blur-md shadow-xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider truncate">
                Total Store Locations
              </p>
              <h3 className="text-xl lg:text-2xl font-black text-white tabular-nums leading-tight drop-shadow-sm">
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
        <div className="bg-[#06182c]/85 backdrop-blur-xl border border-white/30 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg text-white transition-all">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 mb-2 backdrop-blur-md shadow-xs">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-blue-100 uppercase tracking-wide drop-shadow-xs">
              Total Sales (Today)
            </p>
            <h3 className="text-xl font-black text-white tabular-nums mt-1 drop-shadow-md tracking-tight">
              {formatCurrency(mobileSummary.totalSalesToday)}
            </h3>
          </div>
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/20 text-xs font-bold">
            <span className="text-emerald-400 drop-shadow-xs">↑ 12%</span>
            <StockSparkline trend="surge" color="#34D399" id="m-sales" className="w-14 h-5" />
          </div>
        </div>

        {/* 2. Total Orders */}
        <div className="bg-[#06182c]/85 backdrop-blur-xl border border-white/30 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg text-white transition-all">
          <div className="w-8 h-8 rounded-lg bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0 mb-2 backdrop-blur-md shadow-xs">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-blue-100 uppercase tracking-wide drop-shadow-xs">
              Total Orders
            </p>
            <h3 className="text-xl font-black text-white tabular-nums mt-1 drop-shadow-md tracking-tight">
              {formatNumber(mobileSummary.totalOrders)}
            </h3>
          </div>
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/20 text-xs font-bold">
            <span className="text-blue-300 drop-shadow-xs">↑ 8%</span>
            <StockSparkline trend="up" color="#38BDF8" id="m-orders" className="w-14 h-5" />
          </div>
        </div>

        {/* 3. Active Stores */}
        <div className="bg-[#06182c]/85 backdrop-blur-xl border border-white/30 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg text-white transition-all">
          <div className="w-8 h-8 rounded-lg bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 mb-2 backdrop-blur-md shadow-xs">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-blue-100 uppercase tracking-wide drop-shadow-xs">
              Active Stores
            </p>
            <h3 className="text-xl font-black text-white tabular-nums mt-1 drop-shadow-md tracking-tight">
              {formatNumber(mobileSummary.activeStores)}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-white/20 text-xs font-bold text-emerald-400 drop-shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs" />
            <span>100% operational</span>
          </div>
        </div>

        {/* 4. Total Inventory Value */}
        <div className="bg-[#06182c]/85 backdrop-blur-xl border border-white/30 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg text-white transition-all">
          <div className="w-8 h-8 rounded-lg bg-rose-500/30 border border-rose-400/40 flex items-center justify-center text-rose-300 shrink-0 mb-2 backdrop-blur-md shadow-xs">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-blue-100 uppercase tracking-wide drop-shadow-xs">
              Inventory Value
            </p>
            <h3 className="text-xl font-black text-white tabular-nums mt-1 drop-shadow-md tracking-tight">
              {formatCurrency(mobileSummary.inventoryValue, true)}
            </h3>
          </div>
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/20 text-xs font-bold">
            <span className="text-rose-400 drop-shadow-xs">↓ 3%</span>
            <StockSparkline trend="down" color="#FB7185" id="m-val" className="w-14 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
