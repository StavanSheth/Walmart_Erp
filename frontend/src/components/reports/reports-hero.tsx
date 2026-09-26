"use client";

import * as React from "react";
import { useShell } from "@/context/shell-context";
import { SparkIcon, BarChartIcon, SearchIcon, FilterIcon, RefreshCwIcon, ChevronDownIcon } from "@/components/ui/icons";

export interface ReportsHeroProps {
  isFiltersOpen?: boolean;
  onToggleFilters?: () => void;
  onRefresh?: () => void;
  isFetching?: boolean;
  activeFiltersCount?: number;
}

export function ReportsHero({
  isFiltersOpen = false,
  onToggleFilters,
  onRefresh,
  isFetching = false,
  activeFiltersCount = 0
}: ReportsHeroProps) {
  const { setSearchOpen } = useShell();

  // Current formatted date matching dashboard style: Mon, 22 Sep 2026
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
      {/* Mobile Glass Search Bar (matches mobile dashboard screenshot) */}
      <div className="block md:hidden">
        <div
          onClick={() => setSearchOpen(true)}
          className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white cursor-pointer shadow-lg transition"
        >
          <div className="flex items-center gap-2.5 text-white/80 text-xs">
            <SearchIcon className="w-4 h-4 text-white/70" />
            <span className="truncate">Search reports, filters, metrics...</span>
          </div>
          <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
      </div>

      {/* Main Hero Header Section */}
      <div className="relative py-2 sm:py-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4 select-none">
        {/* Left Section: Badge, Title, Subtitle & Liquid Glass Controls */}
        <div className="space-y-2 max-w-2xl text-white">
          {/* Label: Small icon + REPORTS */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/20 backdrop-blur-md border border-white/25 text-white shadow-xs">
            <BarChartIcon className="w-3.5 h-3.5 text-blue-200" />
            <span>REPORTS</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight">
            Insights for a Stronger Tomorrow
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-blue-100/95 font-medium drop-shadow-xs max-w-xl">
            Explore, analyze and generate reports across your Walmart ERP data.
          </p>

          {/* Controls Group: Date Badge + Filter Pop-in Trigger + Refresh */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-2.5 pt-1">
            {/* Date Badge */}
            <div className="h-8 inline-flex items-center gap-1.5 px-3 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white shadow-xs leading-none shrink-0 whitespace-nowrap">
              <svg className="w-3.5 h-3.5 text-white/80 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span suppressHydrationWarning>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Filter Pop-in / Pop-out Toggle Button */}
              {onToggleFilters && (
                <button
                  type="button"
                  onClick={onToggleFilters}
                  className="h-8 inline-flex items-center gap-2 px-3.5 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/25 text-white shadow-xs transition active:scale-95 cursor-pointer leading-none whitespace-nowrap"
                >
                  <FilterIcon className="w-3.5 h-3.5 text-white/90" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#0071DC] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                      {activeFiltersCount}
                    </span>
                  )}
                  <ChevronDownIcon
                    className={`w-3.5 h-3.5 text-white/80 transition-transform duration-200 ${
                      isFiltersOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}

              {/* Refresh Button */}
              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={isFetching}
                  aria-label="Refresh reports"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-white/25 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white shadow-xs transition active:scale-95 shrink-0"
                  title="Refresh metrics"
                >
                  <RefreshCwIcon
                    className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-300" : ""}`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Walmart spark & Slogan */}
        <div className="hidden lg:flex flex-col items-end text-right text-white shrink-0 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-bold tracking-tight text-white leading-none">Walmart</span>
            <SparkIcon className="w-4 h-4" variant="yellow" />
          </div>
          <div className="text-xs sm:text-sm font-semibold tracking-tight text-blue-100 leading-snug drop-shadow-sm">
            Better Data.<br />
            Smarter Decisions.<br />
            Brighter Communities.
          </div>
        </div>
      </div>
    </div>
  );
}
