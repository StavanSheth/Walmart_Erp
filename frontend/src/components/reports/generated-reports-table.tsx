"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import {
  SearchIcon,
  DownloadIcon,
  MoreVerticalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  BarChartIcon,
  InventoryIcon,
  StoreNavIcon,
  UsersIcon,
  RupeeCurrencyIcon,
  SettingsIcon
} from "@/components/ui/icons";
import type { GeneratedReportRecord } from "@/types/reports";

export interface GeneratedReportsTableProps {
  reports?: GeneratedReportRecord[];
  totalReports?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSearchChange?: (q: string) => void;
  onDownloadReports?: (selectedIds?: string[]) => void;
  onDownloadSingleReport?: (report: GeneratedReportRecord) => void;
  isLoading?: boolean;
}

export function GeneratedReportsTable({
  reports = [],
  totalReports = 0,
  page = 1,
  pageSize = 10,
  totalPages = 1,
  onPageChange,
  onSearchChange,
  onDownloadReports,
  onDownloadSingleReport,
  isLoading
}: GeneratedReportsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearchChange?.(val);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === reports.length && reports.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(reports.map((r) => r.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const renderTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "sales":
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md leading-none">
            <BarChartIcon className="w-3 h-3 text-blue-600" />
            <span>Sales</span>
          </span>
        );
      case "inventory":
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md leading-none">
            <InventoryIcon className="w-3 h-3 text-emerald-600" />
            <span>Inventory</span>
          </span>
        );
      case "store":
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-teal-700 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md leading-none">
            <StoreNavIcon className="w-3 h-3 text-teal-600" />
            <span>Store</span>
          </span>
        );
      case "partner":
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-purple-700 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded-md leading-none">
            <UsersIcon className="w-3 h-3 text-purple-600" />
            <span>Partner</span>
          </span>
        );
      case "financial":
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md leading-none">
            <RupeeCurrencyIcon className="w-3 h-3 text-amber-600" />
            <span>Financial</span>
          </span>
        );
      case "operational":
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md leading-none">
            <SettingsIcon className="w-3 h-3 text-indigo-600" />
            <span>Operational</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md leading-none">
            <FileTextIcon className="w-3 h-3 text-slate-500" />
            <span>{type}</span>
          </span>
        );
    }
  };

  const renderStatusBadge = (status: GeneratedReportRecord["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Completed</span>
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Processing</span>
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const handleDownload = () => {
    const ids = selectedIds.size > 0 ? Array.from(selectedIds) : undefined;
    onDownloadReports?.(ids);
  };

  const startIdx = (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, totalReports);

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-4 sm:p-5 space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0071DC] to-[#0050B3] flex items-center justify-center text-white shadow-sm shadow-blue-500/25">
            <FileTextIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
                Generated Reports
              </h2>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {totalReports} Total
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
              Showing {startIdx}–{endIdx} of {totalReports} reports
            </p>
          </div>
        </div>

        {/* Right Controls: Search & Download */}
        <div className="flex items-center gap-2.5">
          {/* Search Input */}
          <div className="relative w-48 sm:w-60">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0071DC] transition"
            />
            <SearchIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition active:scale-95 cursor-pointer shadow-xs shrink-0"
          >
            <DownloadIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Download</span>
            {selectedIds.size > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#0071DC] text-white">
                {selectedIds.size}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Table Container with scrollbar & sticky header */}
      <div className="overflow-x-auto overflow-y-auto max-h-[460px] -mx-4 sm:mx-0 border border-slate-100 rounded-xl erp-scrollbar scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-xs z-10 shadow-2xs">
            <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-3 w-8">
                <input
                  type="checkbox"
                  checked={reports.length > 0 && selectedIds.size === reports.length}
                  onChange={toggleSelectAll}
                  aria-label="Select all reports"
                  className="rounded border-slate-300 text-[#0071DC] focus:ring-[#0071DC] cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-2 w-10 text-center">#</th>
              <th className="py-2.5 px-3">Report Name</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Date Range</th>
              <th className="py-2.5 px-3">Generated On</th>
              <th className="py-2.5 px-3">Generated By</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  Loading reports...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  No reports found matching your criteria.
                </td>
              </tr>
            ) : (
              reports.map((row) => {
                const isSelected = selectedIds.has(row.id);
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      "hover:bg-blue-50/40 transition-colors",
                      isSelected && "bg-blue-50/60"
                    )}
                  >
                    <td className="py-2.5 px-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(row.id)}
                        aria-label={`Select ${row.name}`}
                        className="rounded border-slate-300 text-[#0071DC] focus:ring-[#0071DC] cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-[11px] text-slate-400">
                      {row.reportNumber}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2 max-w-[240px]">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center shrink-0">
                          <FileTextIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-slate-900 truncate" title={row.name}>
                          {row.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {renderTypeBadge(row.type)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      {row.dateRange}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {row.generatedOn}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">
                      {row.generatedBy}
                    </td>
                    <td className="py-2.5 px-3">
                      {renderStatusBadge(row.status)}
                    </td>
                    <td className="py-2.5 px-3 text-right relative">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        aria-label="Actions"
                      >
                        <MoreVerticalIcon className="w-4 h-4" />
                      </button>

                      {/* Row Action Dropdown Menu */}
                      {activeMenuId === row.id && (
                        <div
                          className="absolute right-3 top-8 z-30 w-36 rounded-xl bg-white border border-slate-200 shadow-xl py-1 text-left text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
                          onMouseLeave={() => setActiveMenuId(null)}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onDownloadSingleReport?.(row);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
                          >
                            <DownloadIcon className="w-3.5 h-3.5 text-slate-400" />
                            <span>Download CSV</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>
            Page <strong className="text-slate-800 font-bold">{page}</strong> of <strong className="text-slate-800 font-bold">{totalPages}</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span>
            Showing {reports.length > 0 ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, totalReports)} of {totalReports} reports
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Previous Button */}
          <button
            type="button"
            disabled={page <= 1}
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) {
                onPageChange?.(page - 1);
              }
            }}
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 select-none",
              page <= 1
                ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50/50"
                : "border-slate-200 text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 cursor-pointer shadow-xs active:scale-95"
            )}
            aria-label="Previous Page"
          >
            <ChevronLeftIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Numbered Page Buttons */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              // Show up to 5 surrounding pages
              if (
                totalPages > 7 &&
                pageNum !== 1 &&
                pageNum !== totalPages &&
                Math.abs(pageNum - page) > 1
              ) {
                if (pageNum === 2 && page > 3) {
                  return (
                    <span key={pageNum} className="px-1 text-slate-400 select-none">
                      …
                    </span>
                  );
                }
                if (pageNum === totalPages - 1 && page < totalPages - 2) {
                  return (
                    <span key={pageNum} className="px-1 text-slate-400 select-none">
                      …
                    </span>
                  );
                }
                return null;
              }

              const isActive = pageNum === page;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange?.(pageNum);
                  }}
                  className={cn(
                    "min-w-[30px] h-[30px] px-2 rounded-lg text-xs font-bold transition-all duration-150 select-none cursor-pointer flex items-center justify-center",
                    isActive
                      ? "bg-[#0071DC] text-white shadow-sm shadow-blue-500/25 border border-transparent"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 active:scale-95"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) {
                onPageChange?.(page + 1);
              }
            }}
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 select-none",
              page >= totalPages
                ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50/50"
                : "border-slate-200 text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 cursor-pointer shadow-xs active:scale-95"
            )}
            aria-label="Next Page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
