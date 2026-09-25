"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  className
}: PaginationProps) {
  const currentPage = Math.max(1, page);
  const safeTotalPages = Math.max(1, totalPages);
  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate visible page numbers
  const pageNumbers = React.useMemo(() => {
    if (safeTotalPages <= 5) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }
    if (currentPage >= safeTotalPages - 2) {
      return [
        safeTotalPages - 4,
        safeTotalPages - 3,
        safeTotalPages - 2,
        safeTotalPages - 1,
        safeTotalPages
      ];
    }
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2
    ];
  }, [currentPage, safeTotalPages]);

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500",
        className
      )}
    >
      {/* Left: Record Range & Page Size Selector */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <span>
          Showing <strong className="text-slate-800 tabular-nums">{startItem}</strong> to{" "}
          <strong className="text-slate-800 tabular-nums">{endItem}</strong> of{" "}
          <strong className="text-slate-800 tabular-nums">{totalItems}</strong> items
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Per page:</span>
            <select
              aria-label="Items per page"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-6 px-1.5 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer shadow-2xs"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Page Navigation Controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-7 px-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-1 text-xs font-medium shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          aria-label="Go to previous page"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <div className="flex items-center gap-1 px-1">
          {pageNumbers.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={currentPage === p ? "page" : undefined}
              aria-label={`Go to page ${p}`}
              className={cn(
                "w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
                currentPage === p
                  ? "bg-brand-primary text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={currentPage >= safeTotalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-7 px-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-1 text-xs font-medium shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
}
