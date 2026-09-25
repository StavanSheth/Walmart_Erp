"use client";

import * as React from "react";
import { CalendarIcon, PackageIcon, RefreshCwIcon, FilterIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export interface InventoryPageHeaderProps {
  onRefresh?: () => void;
  isFetching?: boolean;
  onOpenMobileFilters?: () => void;
  activeFilterCount?: number;
}

export function InventoryPageHeader({
  onRefresh,
  isFetching = false,
  onOpenMobileFilters,
  activeFilterCount = 0
}: InventoryPageHeaderProps) {
  // Current formatted date consistent with Dashboard system standard: Mon, 22 Sep 2026
  const formattedDate = React.useMemo(() => {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(new Date());
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* 1. Left: Inventory Title & Taglines */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-md shadow-brand-primary/25 shrink-0">
          <PackageIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none drop-shadow-md">
            Inventory
          </h1>
          <p className="text-xs sm:text-sm font-bold text-blue-100 mt-1 drop-shadow-xs">
            Track. Optimize. Never run out.
          </p>
          <p className="text-[11px] sm:text-xs text-blue-200/90 truncate mt-0.5 drop-shadow-xs">
            Real-time inventory across all stores and warehouses.
          </p>
        </div>
      </div>

      {/* 2. Right: Date Card + Mobile Filter Trigger + Refresh */}
      <div className="flex items-center gap-2.5 sm:gap-3 self-end sm:self-auto shrink-0">
        {/* Date Card */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white shadow-xs h-9">
          <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
            <CalendarIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-xs text-white whitespace-nowrap">{formattedDate}</span>
        </div>

        {/* Mobile Filters Toggle Button */}
        {onOpenMobileFilters && (
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="md:hidden relative h-9 px-3 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white border border-white/25 flex items-center gap-1.5 shadow-xs transition backdrop-blur-md text-xs font-bold"
            title="Open Filters"
            aria-label="Open Inventory Filters"
          >
            <FilterIcon className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-brand-yellow text-brand-navy text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {/* Sync Refresh Button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetching}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white border border-white/25 flex items-center justify-center shadow-xs transition backdrop-blur-md disabled:opacity-50"
            title="Refresh Inventory Data"
            aria-label="Refresh Inventory Data"
          >
            <RefreshCwIcon className={cn("w-4 h-4", isFetching && "animate-spin")} />
          </button>
        )}
      </div>
    </div>
  );
}
