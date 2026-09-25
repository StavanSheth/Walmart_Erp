"use client";

import * as React from "react";
import { useShell } from "@/context/shell-context";
import { SearchIcon, StoreIcon, FilterIcon, RefreshCwIcon } from "@/components/ui/icons";

export interface DashboardHeaderProps {
  selectedStoreId?: string;
  onStoreChange: (storeId: string | undefined) => void;
  selectedDateRange: string;
  onDateRangeChange: (range: string) => void;
  onRefresh: () => void;
  isFetching?: boolean;
}

export function DashboardHeader({
  selectedStoreId,
  onStoreChange,
  selectedDateRange,
  onDateRangeChange,
  onRefresh,
  isFetching = false
}: DashboardHeaderProps) {
  const { stores, setSearchOpen } = useShell();

  // Current formatted date matching screenshot style: Mon, 22 Sep 2026
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
      {/* Mobile Glass Search Bar (matches mobile screenshot) */}
      <div className="block md:hidden">
        <div
          onClick={() => setSearchOpen(true)}
          className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white cursor-pointer shadow-lg transition"
        >
          <div className="flex items-center gap-2.5 text-white/80 text-xs">
            <SearchIcon className="w-4 h-4 text-white/70" />
            <span className="truncate">Search products, stores, reports...</span>
          </div>
          <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
      </div>

      {/* Main Hero Header Section */}
      <div className="relative py-2 sm:py-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        {/* Left Greeting & Date */}
        <div className="space-y-2 max-w-2xl text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">👋</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
              Good Morning, Stavan!
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-blue-100 font-medium drop-shadow-xs">
            Here&apos;s what&apos;s happening across your Walmart ERP today.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {/* Date Badge */}
            <div className="h-8 inline-flex items-center gap-1.5 px-3 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white shadow-xs leading-none shrink-0 whitespace-nowrap">
              <svg className="w-3.5 h-3.5 text-white/80 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formattedDate}</span>
            </div>

            {/* Store Filter Control */}
            <div className="relative inline-flex items-center h-8 shrink-0">
              <StoreIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/80 pointer-events-none z-10 shrink-0" />
              <select
                aria-label="Filter store"
                value={selectedStoreId || ""}
                onChange={(e) => onStoreChange(e.target.value || undefined)}
                className="h-8 pl-8 pr-7 text-xs font-semibold rounded-full border border-white/25 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white focus:outline-none focus:ring-1 focus:ring-blue-400 appearance-none cursor-pointer shadow-xs transition leading-none whitespace-nowrap"
              >
                <option value="" className="text-slate-900 bg-white">All Stores ({stores.length})</option>
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

            {/* Date Range Selector */}
            <div className="relative inline-flex items-center h-8 shrink-0">
              <FilterIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/80 pointer-events-none z-10 shrink-0" />
              <select
                aria-label="Filter range"
                value={selectedDateRange}
                onChange={(e) => onDateRangeChange(e.target.value)}
                className="h-8 pl-8 pr-7 text-xs font-semibold rounded-full border border-white/25 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white focus:outline-none focus:ring-1 focus:ring-blue-400 appearance-none cursor-pointer shadow-xs transition leading-none whitespace-nowrap"
              >
                <option value="30d" className="text-slate-900 bg-white">Last 30 Days</option>
                <option value="90d" className="text-slate-900 bg-white">Last 90 Days</option>
                <option value="all" className="text-slate-900 bg-white">All Period</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/80 text-[8px] flex items-center justify-center leading-none">
                ▼
              </span>
            </div>

            {/* Refresh trigger */}
            <button
              type="button"
              onClick={onRefresh}
              disabled={isFetching}
              aria-label="Refresh metrics"
              className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-white/25 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white shadow-xs transition active:scale-95 shrink-0"
              title="Refresh metrics"
            >
              <RefreshCwIcon
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-300" : ""}`}
              />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
