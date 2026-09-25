"use client";

import * as React from "react";
import { Skeleton } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { StoreInventorySummary, FilterOption } from "@/types/inventory";

export interface InventoryStoreSummaryProps {
  stores?: StoreInventorySummary[];
  regions?: FilterOption[];
  selectedRegionId?: string;
  onRegionChange?: (regionId: string) => void;
  isLoading?: boolean;
}

export function InventoryStoreSummary({
  stores = [],
  regions = [],
  selectedRegionId = "ALL",
  onRegionChange,
  isLoading = false
}: InventoryStoreSummaryProps) {
  const displayedStores = React.useMemo(() => {
    if (!selectedRegionId || selectedRegionId === "ALL") {
      return stores;
    }
    return stores.filter((s) => s.regionId === selectedRegionId);
  }, [stores, selectedRegionId]);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header with Title & Region Selector */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
            Store-wise Inventory
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onRegionChange && onRegionChange("ALL")}
            className="text-xs font-bold text-brand-primary hover:text-blue-700 transition inline-flex items-center gap-0.5 whitespace-nowrap"
          >
            View All →
          </button>

          {regions.length > 0 && (
            <select
              value={selectedRegionId}
              onChange={(e) => onRegionChange && onRegionChange(e.target.value)}
              className="h-7 px-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer"
            >
              <option value="ALL">All Regions</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Table Content with Custom Scrollbar */}
      <div className="pt-2 flex-1 flex flex-col justify-between">
        {isLoading ? (
          <div className="space-y-3 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100">
                <Skeleton className="h-7 w-7 rounded-lg" />
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-16 rounded ml-auto" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
            ))}
          </div>
        ) : displayedStores.length === 0 ? (
          <EmptyState
            title="No store inventory"
            description="No stores found matching the selected region."
            className="py-10"
          />
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[310px] -mx-4 sm:-mx-5 px-4 sm:px-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-white z-10 shadow-2xs">
                <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-white">
                  <th className="py-2 pr-2 min-w-[120px] bg-white">Store</th>
                  <th className="py-2 px-2 text-right bg-white">Stock</th>
                  <th className="py-2 px-2 text-right bg-white">Low</th>
                  <th className="py-2 px-2 text-right bg-white">OOS</th>
                  <th className="py-2 pl-2 text-center bg-white">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {displayedStores.map((store) => (
                  <tr key={store.storeId} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 pr-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200/80 text-brand-primary flex items-center justify-center font-bold text-[9px] shrink-0 font-mono shadow-2xs">
                          {store.storeCode ? store.storeCode.replace("WAL-", "").slice(0, 3) : "STR"}
                        </div>
                        <span className="font-bold text-slate-900 truncate" title={store.storeName}>
                          {store.storeName}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-slate-900 tabular-nums">
                      {formatNumber(store.totalStock)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-rose-600 tabular-nums">
                      {formatNumber(store.lowStock)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-rose-600 tabular-nums">
                      {formatNumber(store.outOfStock)}
                    </td>
                    <td className="py-2.5 pl-2 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold",
                          store.status === "Healthy"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-amber-50 text-amber-700 border border-amber-200/60"
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            store.status === "Healthy" ? "bg-emerald-500" : "bg-amber-500"
                          )}
                        />
                        {store.status}
                      </span>
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
