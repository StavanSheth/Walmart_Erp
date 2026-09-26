"use client";

import * as React from "react";
import {
  CalendarIcon,
  RefreshCwIcon,
  ChevronDownIcon,
  FilterIcon,
  PlusIcon
} from "@/components/ui/icons";
import type { ReportsFilterOptions, ReportsQueryParams } from "@/types/reports";

export interface ReportFilterBarProps {
  filters: ReportsQueryParams;
  filterOptions?: ReportsFilterOptions;
  onChangeFilter: (key: keyof ReportsQueryParams, value: string) => void;
  onResetFilters: () => void;
  onGenerateReportClick: () => void;
  onSaveFilterSet?: () => void;
  isOpen?: boolean;
  onToggleOpen?: () => void;
}

export function BookmarkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

export function ReportFilterBar({
  filters,
  filterOptions,
  onChangeFilter,
  onResetFilters,
  onGenerateReportClick,
  onSaveFilterSet,
  isOpen = false,
  onToggleOpen
}: ReportFilterBarProps) {
  const [filterSavedToast, setFilterSavedToast] = React.useState(false);

  const handleSaveFilterSet = () => {
    if (onSaveFilterSet) {
      onSaveFilterSet();
    }
    setFilterSavedToast(true);
    setTimeout(() => setFilterSavedToast(false), 3000);
  };

  // Check if any non-default filter is currently active
  const hasActiveFilters =
    (filters.reportType && filters.reportType !== "SALES") ||
    (filters.period && filters.period !== "30d") ||
    (filters.regionId && filters.regionId !== "ALL") ||
    (filters.storeId && filters.storeId !== "ALL") ||
    (filters.categoryId && filters.categoryId !== "ALL") ||
    (filters.productId && filters.productId !== "ALL") ||
    (filters.partnerType && filters.partnerType !== "ALL") ||
    (filters.partnerId && filters.partnerId !== "ALL") ||
    (filters.status && filters.status !== "ALL");

  if (!isOpen) {
    return null;
  }

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_12px_36px_0_rgba(0,113,220,0.12)] p-4 sm:p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
      {/* Filter Header and Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleOpen}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
            title="Collapse filters"
          >
            <ChevronDownIcon className="w-4 h-4 rotate-180" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0071DC] shrink-0">
            <FilterIcon className="w-4 h-4 text-[#0071DC]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
              Report Filters
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Customize your report with filters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {filterSavedToast && (
            <span className="text-xs font-semibold text-emerald-600 animate-fade-in">
              ✓ Filter set saved
            </span>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200/80 transition cursor-pointer"
            >
              Reset Filters
            </button>
          )}

          {/* Hide Filters Button */}
          <button
            type="button"
            onClick={onToggleOpen}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            <span>Hide Filters</span>
            <span className="text-[10px]">▴</span>
          </button>

          {/* Save Filter Set Button */}
          <button
            type="button"
            onClick={handleSaveFilterSet}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition active:scale-95 cursor-pointer shadow-xs"
          >
            <BookmarkIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Save Filter Set</span>
          </button>

          {/* Generate Report Button */}
          <button
            type="button"
            onClick={onGenerateReportClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0071DC] hover:bg-[#005bb5] transition active:scale-95 cursor-pointer shadow-sm shadow-blue-500/20"
          >
            <PlusIcon className="w-3.5 h-3.5 text-white" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Filter Grid: Row 1 & Row 2 */}
      <div className="space-y-3">
        {/* Row 1: Report Type, Date Range, Region, Store, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {/* 1. Report Type */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">
              Report Type
            </label>
            <div className="relative">
              <select
                value={filters.reportType || "SALES"}
                onChange={(e) => onChangeFilter("reportType", e.target.value)}
                className="w-full h-9 pl-3 pr-8 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0071DC] transition cursor-pointer"
              >
                <option value="SALES">Sales Report</option>
                <option value="INVENTORY">Inventory Report</option>
                <option value="STORE">Store Report</option>
                <option value="PARTNER">Partner Report</option>
                <option value="FINANCIAL">Financial Report</option>
                <option value="OPERATIONAL">Operational Report</option>
                <option value="CUSTOM">Custom Report</option>
              </select>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Date Range */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">
              Date Range
            </label>
            <div className="relative">
              <select
                value={filters.period || "30d"}
                onChange={(e) => onChangeFilter("period", e.target.value)}
                className="w-full h-9 pl-8 pr-8 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0071DC] transition cursor-pointer"
              >
                <option value="today">Today (Sep 22, 2026)</option>
                <option value="7d">Last 7 Days (Sep 15 - Sep 22, 2026)</option>
                <option value="30d">Sep 1, 2026 - Sep 22, 2026</option>
                <option value="90d">Last 90 Days (Q3 2026)</option>
                <option value="ytd">Year to Date (2026)</option>
              </select>
              <CalendarIcon className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3. Region */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">
              Region
            </label>
            <div className="relative">
              <select
                value={filters.regionId || "ALL"}
                onChange={(e) => onChangeFilter("regionId", e.target.value)}
                className="w-full h-9 pl-3 pr-8 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0071DC] transition cursor-pointer"
              >
                <option value="ALL">All Regions</option>
                {filterOptions?.regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 4. Store */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">
              Store
            </label>
            <div className="relative">
              <select
                value={filters.storeId || "ALL"}
                onChange={(e) => onChangeFilter("storeId", e.target.value)}
                className="w-full h-9 pl-3 pr-8 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0071DC] transition cursor-pointer"
              >
                <option value="ALL">All Stores</option>
                {filterOptions?.stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 5. Category */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">
              Category
            </label>
            <div className="relative">
              <select
                value={filters.categoryId || "ALL"}
                onChange={(e) => onChangeFilter("categoryId", e.target.value)}
                className="w-full h-9 pl-3 pr-8 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0071DC] transition cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {filterOptions?.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2: Product, Partner Type, Partner, Status, Reset */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3 items-end">
          {/* 6. Product */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">
              Product
            </label>
            <div className="relative">
              <select
                value={filters.productId || "ALL"}
                onChange={(e) => onChangeFilter("productId", e.target.value)}
                className="w-full h-9 pl-3 pr-8 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0071DC] transition cursor-pointer"
              >
                <option value="ALL">All Products</option>
                {filterOptions?.products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 7. Partner Type */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">
              Partner Type
            </label>
            <div className="relative">
              <select
                value={filters.partnerType || "ALL"}
                onChange={(e) => onChangeFilter("partnerType", e.target.value)}
                className="w-full h-9 pl-3 pr-8 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0071DC] transition cursor-pointer"
              >
                <option value="ALL">All</option>
                {filterOptions?.partnerTypes.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 8. Partner */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">
              Partner
            </label>
            <div className="relative">
              <select
                value={filters.partnerId || "ALL"}
                onChange={(e) => onChangeFilter("partnerId", e.target.value)}
                className="w-full h-9 pl-3 pr-8 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0071DC] transition cursor-pointer"
              >
                <option value="ALL">All Partners</option>
                {filterOptions?.partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 9. Status */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">
              Status
            </label>
            <div className="relative">
              <select
                value={filters.status || "ALL"}
                onChange={(e) => onChangeFilter("status", e.target.value)}
                className="w-full h-9 pl-3 pr-8 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0071DC] transition cursor-pointer"
              >
                <option value="ALL">All</option>
                {filterOptions?.orderStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 10. Reset Filters Button */}
          <div className="pt-0">
            <button
              type="button"
              onClick={onResetFilters}
              className="w-full h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition active:scale-95 cursor-pointer shadow-xs"
            >
              <RefreshCwIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
