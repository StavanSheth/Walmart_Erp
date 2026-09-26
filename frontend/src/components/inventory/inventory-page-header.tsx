"use client";

import * as React from "react";
import { useShell } from "@/context/shell-context";
import { CalendarIcon, PackageIcon, RefreshCwIcon, FilterIcon, SearchIcon, StoreIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export interface InventoryPageHeaderProps {
  selectedStoreId?: string;
  onStoreChange?: (storeId: string) => void;
  onRefresh?: () => void;
  isFetching?: boolean;
  onOpenMobileFilters?: () => void;
  activeFilterCount?: number;
}

export function InventoryPageHeader({
  selectedStoreId,
  onStoreChange,
  onRefresh,
  isFetching = false,
  onOpenMobileFilters,
  activeFilterCount = 0
}: InventoryPageHeaderProps) {
  const { stores, setSearchOpen } = useShell();

  // Current formatted date consistent with Dashboard system standard
  const formattedDate = React.useMemo(() => {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(new Date());
  }, []);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Mobile Glass Search Bar (matches mobile dashboard) */}
      <div className="block md:hidden">
        <div
          onClick={() => setSearchOpen(true)}
          className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white cursor-pointer shadow-lg transition"
        >
          <div className="flex items-center gap-2.5 text-white/80 text-xs">
            <SearchIcon className="w-4 h-4 text-white/70" />
            <span className="truncate">Search products, inventory, SKUs...</span>
          </div>
          <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
      </div>

      {/* Main Hero Header Section */}
      <div className="relative py-2 sm:py-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        {/* 1. Left: Inventory Title, Subtitle, and Controls Pills */}
        <div className="space-y-2 max-w-2xl text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-md shadow-brand-primary/25 shrink-0">
              <PackageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight">
                Inventory
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 font-medium drop-shadow-xs">
                Real-time stock across all stores and warehouses.
              </p>
            </div>
          </div>

          {/* Controls Row: Date Badge + Mobile Filter Button + Refresh Button + Store Selector */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-2.5 pt-1">
            <div className="flex items-center gap-2">
              {/* Date Badge */}
              <div className="h-8 inline-flex items-center gap-1.5 px-3 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white shadow-xs leading-none shrink-0 whitespace-nowrap">
                <CalendarIcon className="w-3.5 h-3.5 text-white/80 shrink-0" />
                <span>{formattedDate}</span>
              </div>

              {/* Mobile Filters Toggle Button */}
              {onOpenMobileFilters && (
                <button
                  type="button"
                  onClick={onOpenMobileFilters}
                  className="md:hidden relative h-8 px-3 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white border border-white/25 flex items-center gap-1.5 shadow-xs transition backdrop-blur-md text-xs font-semibold"
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

              {/* Refresh trigger on mobile */}
              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={isFetching}
                  className="sm:hidden h-8 w-8 rounded-full border border-white/25 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white shadow-xs transition active:scale-95 shrink-0 flex items-center justify-center disabled:opacity-50"
                  title="Refresh Inventory Data"
                  aria-label="Refresh Inventory Data"
                >
                  <RefreshCwIcon className={cn("w-3.5 h-3.5", isFetching && "animate-spin text-blue-300")} />
                </button>
              )}
            </div>

            {/* Store Filter Selector (matching dashboard position & style) */}
            <div className="relative inline-flex items-center h-8 shrink-0">
              <StoreIcon className="w-3.5 h-3.5 rounded-full object-cover absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 shrink-0" />
              <select
                aria-label="Filter store"
                value={selectedStoreId || "ALL"}
                onChange={(e) => onStoreChange?.(e.target.value)}
                className="h-8 pl-8 pr-7 text-xs font-semibold rounded-full border border-white/25 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white focus:outline-none focus:ring-1 focus:ring-blue-400 appearance-none cursor-pointer shadow-xs transition leading-none whitespace-nowrap"
              >
                <option value="ALL" className="text-slate-900 bg-white">All Stores ({stores.length})</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id} className="text-slate-900 bg-white">
                    {s.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/80 text-[8px] flex items-center justify-center leading-none">
                ▼
              </span>
            </div>

            {/* Sync Refresh Button on desktop */}
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isFetching}
                className="hidden sm:inline-flex h-8 w-8 rounded-full border border-white/25 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white shadow-xs transition active:scale-95 shrink-0 items-center justify-center disabled:opacity-50"
                title="Refresh Inventory Data"
                aria-label="Refresh Inventory Data"
              >
                <RefreshCwIcon className={cn("w-3.5 h-3.5", isFetching && "animate-spin text-blue-300")} />
              </button>
            )}
          </div>
        </div>

        {/* 2. Right: Enterprise Slogan */}
        <div className="hidden lg:block text-right text-white select-none shrink-0 pb-1">
          <div className="text-sm lg:text-base font-bold tracking-tight text-white/95 leading-snug drop-shadow-sm">
            Track. Optimize.<br />Never Run Out.
          </div>
        </div>
      </div>
    </div>
  );
}
