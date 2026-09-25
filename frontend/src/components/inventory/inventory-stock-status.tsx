"use client";

import * as React from "react";
import { Skeleton } from "@/components/common/loading-state";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { StockStatusSummary, StockStatus } from "@/types/inventory";

export interface InventoryStockStatusProps {
  stockStatus?: StockStatusSummary;
  isLoading?: boolean;
  onStatusClick?: (status: StockStatus) => void;
}

export function InventoryStockStatus({
  stockStatus,
  isLoading = false,
  onStatusClick
}: InventoryStockStatusProps) {
  if (isLoading || !stockStatus) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs h-full min-h-[310px] space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-28 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <div className="space-y-2.5 pt-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
    );
  }

  const { statuses, healthScore, healthRating } = stockStatus;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return (
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "LOW_STOCK":
        return (
          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01" />
            </svg>
          </div>
        );
      case "OUT_OF_STOCK":
        return (
          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case "IN_TRANSIT":
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m0 0l3 3v6a1 1 0 01-1 1h-1m-10 0H6a1 1 0 01-1-1V7a1 1 0 011-1h8m-9 13a2 2 0 104 0m8 0a2 2 0 104 0" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between h-full min-h-[310px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
            Stock Status
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Distribution</span>
      </div>


      {/* 4 Status Rows */}
      <div className="space-y-1.5 pt-2 flex-1">
        {statuses.map((item) => {
          const isFilterable = item.status !== "IN_TRANSIT";
          return (
            <div
              key={item.status}
              onClick={() => {
                if (isFilterable && onStatusClick) {
                  onStatusClick(item.status as StockStatus);
                }
              }}
              className={cn(
                "flex items-center justify-between py-1.5 px-2 rounded-xl transition",
                isFilterable ? "cursor-pointer hover:bg-slate-50" : ""
              )}
            >
              <div className="flex items-center gap-2.5">
                {getStatusIcon(item.status)}
                <span className="text-xs font-bold text-slate-800">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-extrabold text-slate-900 tabular-nums">
                  {formatNumber(item.count)}
                </span>
                <span className="text-slate-400 font-semibold">({item.percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom: Inventory Health Score Box */}
      <div className="mt-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100/90">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-700">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-1.428-1.127-2.31a10.96 10.96 0 01-.428-1.187z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-[11px] font-bold text-emerald-950">Inventory Health Score</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-200/70 text-emerald-800">
            {healthRating}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
            {healthScore}%
          </span>
          <div className="flex-1 h-2 rounded-full bg-emerald-200/50 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
