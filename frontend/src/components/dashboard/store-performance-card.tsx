"use client";

import * as React from "react";
import type { StorePerformanceItem } from "@/types/dashboard";

export interface StorePerformanceCardProps {
  stores?: StorePerformanceItem[];
  isLoading?: boolean;
}

export function StorePerformanceCard({ stores = [], isLoading = false }: StorePerformanceCardProps) {
  const topStores = stores.slice(0, 5);

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Store Performance
        </h3>
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white/70 hover:bg-white/90 border border-slate-200/70 rounded-lg shadow-sm transition"
          >
            <span>Top 5 Stores</span>
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4 py-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-200/70" />
              <div className="h-4 bg-slate-200/70 rounded w-1/3" />
              <div className="flex-1 h-2.5 bg-slate-200/70 rounded-full" />
              <div className="w-8 h-4 bg-slate-200/70 rounded" />
            </div>
          ))}
        </div>
      ) : topStores.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          No store performance data available
        </div>
      ) : (
        <div className="space-y-3.5 my-auto">
          {topStores.map((store, index) => {
            const rank = store.rank || index + 1;
            const pct = Math.round(store.relativePercentage || 0);

            return (
              <div key={store.storeId || index} className="flex items-center gap-3">
                {/* Rank badge */}
                <div className="w-6 h-6 rounded-full bg-blue-100/90 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {rank}
                </div>

                {/* Store Name */}
                <div className="w-32 sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 truncate" title={store.storeName}>
                  {store.storeName}
                </div>

                {/* Progress bar */}
                <div className="flex-1 bg-slate-100/80 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-linear-to-r from-blue-500 to-[#0071DC] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                  />
                </div>

                {/* Percentage */}
                <div className="w-9 text-right text-xs sm:text-sm font-bold text-slate-700 tabular-nums">
                  {pct}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
