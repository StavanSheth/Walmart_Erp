"use client";

import * as React from "react";
import { SearchIcon, DownloadIcon, XIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export interface PartnerFiltersProps {
  search: string;
  type: string;
  regionId: string;
  status: string;
  types: string[];
  regions: Array<{ id: string; name: string }>;
  statuses: string[];
  onSearchChange: (search: string) => void;
  onTypeChange: (type: string) => void;
  onRegionChange: (regionId: string) => void;
  onStatusChange: (status: string) => void;
  onExport: () => void;
  onReset?: () => void;
  className?: string;
}

export function PartnerFilters({
  search,
  type,
  regionId,
  status,
  types = [],
  regions = [],
  statuses = [],
  onSearchChange,
  onTypeChange,
  onRegionChange,
  onStatusChange,
  onExport,
  onReset,
  className
}: PartnerFiltersProps) {
  const [localSearch, setLocalSearch] = React.useState(search);

  React.useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search update
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, search, onSearchChange]);

  const hasActiveFilters =
    Boolean(search) ||
    (type && type !== "ALL" && type !== "All Types") ||
    (regionId && regionId !== "ALL") ||
    (status && status !== "ALL" && status !== "All Status");

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3",
        className
      )}
    >
      {/* Left: Search input */}
      <div className="relative flex-1 max-w-md">
        <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search partners by name, email, or ID..."
          className="w-full h-10 pl-9 pr-8 text-xs sm:text-sm rounded-xl border border-slate-200/90 bg-white placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0071DC]/30 focus:border-[#0071DC] transition shadow-xs"
        />
        {localSearch && (
          <button
            type="button"
            onClick={() => {
              setLocalSearch("");
              onSearchChange("");
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
          >
            <XIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right: Filters & Export Button */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Type Selector */}
        <div className="relative inline-flex items-center">
          <select
            aria-label="Filter by type"
            value={type || "ALL"}
            onChange={(e) => onTypeChange(e.target.value)}
            className="h-10 pl-3 pr-7 text-xs font-semibold rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0071DC]/30 focus:border-[#0071DC] appearance-none cursor-pointer transition shadow-xs"
          >
            <option value="ALL">All Types</option>
            {types
              .filter((t) => t !== "All Types")
              .map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
          </select>
          <span className="absolute right-2.5 pointer-events-none text-slate-400 text-[9px]">
            ▼
          </span>
        </div>

        {/* Region Selector */}
        <div className="relative inline-flex items-center">
          <select
            aria-label="Filter by region"
            value={regionId || "ALL"}
            onChange={(e) => onRegionChange(e.target.value)}
            className="h-10 pl-3 pr-7 text-xs font-semibold rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0071DC]/30 focus:border-[#0071DC] appearance-none cursor-pointer transition shadow-xs"
          >
            <option value="ALL">All Regions</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <span className="absolute right-2.5 pointer-events-none text-slate-400 text-[9px]">
            ▼
          </span>
        </div>

        {/* Status Selector */}
        <div className="relative inline-flex items-center">
          <select
            aria-label="Filter by status"
            value={status || "ALL"}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-10 pl-3 pr-7 text-xs font-semibold rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0071DC]/30 focus:border-[#0071DC] appearance-none cursor-pointer transition shadow-xs"
          >
            <option value="ALL">All Status</option>
            {statuses.length > 0
              ? statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))
              : (
                  <>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </>
                )}
          </select>
          <span className="absolute right-2.5 pointer-events-none text-slate-400 text-[9px]">
            ▼
          </span>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="h-10 px-3 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            Reset
          </button>
        )}

        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          className="h-10 px-3.5 inline-flex items-center gap-1.5 text-xs font-semibold rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition active:scale-95 cursor-pointer ml-auto sm:ml-0"
        >
          <DownloadIcon className="w-3.5 h-3.5 text-slate-500" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
