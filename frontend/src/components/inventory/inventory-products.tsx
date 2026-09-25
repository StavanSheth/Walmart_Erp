"use client";

import * as React from "react";
import { Skeleton } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { StatusBadge } from "@/components/ui/badge";
import { PackageIcon } from "@/components/ui/icons";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { InventoryItem, InventoryTab, PaginationInfo } from "@/types/inventory";

export interface InventoryProductsProps {
  items?: InventoryItem[];
  pagination?: PaginationInfo;
  currentTab?: InventoryTab;
  onTabChange?: (tab: InventoryTab) => void;
  onPageChange?: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;
  onRowClick: (item: InventoryItem) => void;
  isLoading?: boolean;
}

export function InventoryProducts({
  items = [],
  pagination: _pagination,
  currentTab = "most-stocked",
  onTabChange,
  onPageChange: _onPageChange,
  onPageSizeChange: _onPageSizeChange,
  onRowClick,
  isLoading = false
}: InventoryProductsProps) {
  const tabs: { id: InventoryTab; label: string }[] = [
    { id: "most-stocked", label: "Most Stocked" },
    { id: "low-stock", label: "Low Stock" },
    { id: "out-of-stock", label: "Out of Stock" }
  ];

  const getProductThumbnail = (name: string, category?: string) => {
    const lower = `${name} ${category || ""}`.toLowerCase();
    if (lower.includes("milk") || lower.includes("dairy")) {
      return (
        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center shrink-0 text-blue-600 shadow-2xs">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 2h10v3H7V2zm-1 5h12v15H6V7zm2 2v11h8V9H8z" />
          </svg>
        </div>
      );
    }
    if (lower.includes("tv") || lower.includes("screen") || lower.includes("electronics")) {
      return (
        <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-white shadow-2xs">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      );
    }
    if (lower.includes("shirt") || lower.includes("apparel") || lower.includes("jean")) {
      return (
        <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center shrink-0 text-indigo-600 shadow-2xs">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
      );
    }
    if (lower.includes("detergent") || lower.includes("tide") || lower.includes("household")) {
      return (
        <div className="w-7 h-7 rounded-lg bg-amber-500 border border-amber-600 flex items-center justify-center shrink-0 text-white shadow-2xs">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a4 4 0 00-4 4v2H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V10a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-2 4a2 2 0 114 0v2h-4V6z" />
          </svg>
        </div>
      );
    }
    if (lower.includes("toothpaste") || lower.includes("colgate") || lower.includes("personal")) {
      return (
        <div className="w-7 h-7 rounded-lg bg-rose-600 border border-rose-700 flex items-center justify-center shrink-0 text-white shadow-2xs">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-brand-primary flex items-center justify-center shrink-0 font-bold text-[10px]">
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header with Title, Tabs & View All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
            <PackageIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
            Top Products
          </h3>
        </div>

        {/* Tabs & View All link */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200/60 overflow-x-auto max-w-full">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onTabChange && onTabChange(t.id)}
                className={cn(
                  "px-2 sm:px-2.5 py-1 text-[11px] font-bold rounded-lg transition whitespace-nowrap",
                  currentTab === t.id
                    ? "bg-brand-primary text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onTabChange && onTabChange("all")}
            className="text-xs font-bold text-brand-primary hover:text-blue-700 transition hidden sm:inline whitespace-nowrap"
          >
            View All →
          </button>
        </div>
      </div>

      {/* Table Content with Custom Scrollbar */}
      <div className="pt-1.5 flex-1 flex flex-col justify-between">
        {isLoading ? (
          <div className="space-y-3 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100">
                <Skeleton className="h-4 w-6 rounded" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-16 rounded ml-auto" />
                <Skeleton className="h-4 w-14 rounded" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No products found"
            description="No inventory records match the current criteria."
            className="py-10"
          />
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[310px] -mx-4 sm:-mx-5 px-4 sm:px-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-white z-10 shadow-2xs">
                <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-white">
                  <th className="py-2 pr-2 w-6 bg-white">#</th>
                  <th className="py-2 px-2.5 min-w-[150px] bg-white">Product</th>
                  <th className="py-2 px-2.5 bg-white">SKU</th>
                  <th className="py-2 px-2.5 bg-white">Category</th>
                  <th className="py-2 px-2.5 text-right bg-white">Total Stock</th>
                  <th className="py-2 px-2.5 text-center bg-white">Status</th>
                  <th className="py-2 px-2.5 min-w-[110px] bg-white">Store Coverage</th>
                  <th className="py-2 pl-2 text-right w-8 bg-white"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => onRowClick(item)}
                    className="hover:bg-slate-50/80 cursor-pointer transition group"
                  >
                    <td className="py-2.5 pr-2 text-slate-400 font-semibold">{index + 1}</td>
                    <td className="py-2.5 px-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {getProductThumbnail(item.productName, item.categoryName)}
                        <div className="min-w-0 flex flex-col">
                          <span className="font-bold text-slate-900 truncate group-hover:text-brand-primary transition">
                            {item.productName}
                          </span>
                          {item.storeName && (
                            <span className="text-[10px] text-slate-400 font-medium truncate">
                              {item.storeName}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2.5 text-slate-500 font-mono text-[11px]">{item.sku}</td>
                    <td className="py-2.5 px-2.5 text-slate-600">{item.categoryName}</td>
                    <td className="py-2.5 px-2.5 text-right font-bold text-slate-900 tabular-nums">
                      {formatNumber(item.onHand)}
                    </td>
                    <td className="py-2.5 px-2.5 text-center">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-2.5 px-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden min-w-[45px]">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${item.storeCoverage}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 tabular-nums shrink-0">
                          {item.storeCoverage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 pl-2 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick(item);
                        }}
                        className="w-6 h-6 rounded-lg hover:bg-slate-200/60 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
                        title="View Details"
                      >
                        •••
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
