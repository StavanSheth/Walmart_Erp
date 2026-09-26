"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDownIcon, CartIcon, TagIcon, PackageIcon, StarIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/common/loading-state";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { StorePerformanceSummary, StorePeriod } from "@/types/stores";

interface StorePerformancePanelProps {
  performance?: StorePerformanceSummary;
  selectedPeriod: StorePeriod;
  onPeriodChange: (period: StorePeriod) => void;
  isLoading?: boolean;
}

export function StorePerformancePanel({
  performance,
  selectedPeriod = "30d",
  onPeriodChange,
  isLoading = false
}: StorePerformancePanelProps) {
  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between h-full bg-white">
      <CardHeader className="p-2.5 sm:p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
        <CardTitle className="text-xs sm:text-sm lg:text-base font-bold text-slate-900 truncate">
          Store Performance
        </CardTitle>

        {/* Period Selector */}
        <div className="relative shrink-0">
          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg px-1.5 sm:px-2.5 py-1 cursor-pointer shadow-2xs">
            <select
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(e.target.value as StorePeriod)}
              className="appearance-none bg-transparent cursor-pointer outline-none border-none pr-3 text-[10px] sm:text-xs font-semibold text-slate-700"
              aria-label="Select Period"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="ytd">Year to Date</option>
            </select>
            <ChevronDownIcon className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-2.5 sm:p-4 flex-1 flex flex-col justify-around space-y-1.5 sm:space-y-2.5">
        {isLoading || !performance ? (
          <div className="space-y-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-3.5 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-2.5">
            {/* 1. Sales Revenue */}
            <div className="flex items-center justify-between py-0.5 sm:py-1">
              <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 pr-1">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-100/70 text-[#0071DC] flex items-center justify-center shrink-0">
                  <CartIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-slate-700 truncate">
                  Sales Revenue
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-auto">
                <span className="text-[11px] sm:text-xs font-bold text-slate-900 tabular-nums">
                  {formatCurrency(performance.salesRevenue, true)}
                </span>
                {performance.salesRevenueChangePct != null ? (
                  <span
                    className={cn(
                      "text-[9px] sm:text-2xs font-bold tabular-nums",
                      performance.salesRevenueChangePct >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {performance.salesRevenueChangePct >= 0
                      ? `↑${performance.salesRevenueChangePct}%`
                      : `↓${Math.abs(performance.salesRevenueChangePct)}%`}
                  </span>
                ) : null}
              </div>
            </div>

            {/* 2. Units Sold */}
            <div className="flex items-center justify-between py-0.5 sm:py-1">
              <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 pr-1">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-100/70 text-[#0071DC] flex items-center justify-center shrink-0">
                  <TagIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-slate-700 truncate">
                  Units Sold
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-auto">
                <span className="text-[11px] sm:text-xs font-bold text-slate-900 tabular-nums">
                  {formatNumber(performance.unitsSold)}
                </span>
                {performance.unitsSoldChangePct != null ? (
                  <span
                    className={cn(
                      "text-[9px] sm:text-2xs font-bold tabular-nums",
                      performance.unitsSoldChangePct >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {performance.unitsSoldChangePct >= 0
                      ? `↑${performance.unitsSoldChangePct}%`
                      : `↓${Math.abs(performance.unitsSoldChangePct)}%`}
                  </span>
                ) : null}
              </div>
            </div>

            {/* 3. Inventory Fill Rate */}
            <div className="flex items-center justify-between py-0.5 sm:py-1">
              <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 pr-1">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-100/70 text-[#0071DC] flex items-center justify-center shrink-0">
                  <PackageIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-slate-700 truncate">
                  Fill Rate
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-auto">
                <span className="text-[11px] sm:text-xs font-bold text-slate-900 tabular-nums">
                  {formatPercentage(performance.inventoryFillRate)}
                </span>
                <span className="text-[9px] sm:text-2xs font-bold text-emerald-600 tabular-nums">
                  ↑1.4%
                </span>
              </div>
            </div>

            {/* 4. Customer Rating / Store Operational Score */}
            <div className="flex items-center justify-between py-0.5 sm:py-1">
              <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 pr-1">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-100/70 text-amber-500 flex items-center justify-center shrink-0">
                  <StarIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-slate-700 truncate">
                  Rating
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-auto">
                <span className="text-[11px] sm:text-xs font-bold text-slate-900 tabular-nums">
                  4.8 / 5
                </span>
                <span className="text-[9px] sm:text-2xs font-bold text-amber-500 flex items-center">
                  ★0.3
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
