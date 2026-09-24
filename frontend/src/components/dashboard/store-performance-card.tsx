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
    <div className="glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-full overflow-hidden shadow-md">
      <div className="flex items-center justify-between mb-2 min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
          Store Performance
        </h3>
        <div className="relative shrink-0">
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-slate-700 bg-white/70 hover:bg-white/90 border border-slate-200/70 rounded-lg shadow-xs transition"
          >
            <span>Top 5 Stores</span>
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 py-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-200/70 shrink-0" />
              <div className="h-3.5 bg-slate-200/70 rounded flex-1" />
              <div className="w-16 h-2.5 bg-slate-200/70 rounded-full shrink-0" />
              <div className="w-7 h-3.5 bg-slate-200/70 rounded shrink-0" />
            </div>
          ))}
        </div>
      ) : topStores.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          No store performance data available
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-2.5 my-auto">
          {topStores.map((store, index) => {
            const rank = store.rank || index + 1;
            const pct = Math.round(store.relativePercentage || 0);

            return (
              <div key={store.storeId || index} className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                {/* Rank badge */}
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 text-[#0071DC] font-bold text-[10px] sm:text-xs flex items-center justify-center shrink-0">
                  {rank}
                </div>

                {/* Store Name */}
                <div
                  className="min-w-0 flex-1 truncate text-xs sm:text-sm font-semibold text-slate-800"
                  title={store.storeName}
                >
                  {store.storeName}
                </div>

                {/* Progress bar with exact Walmart blue styling */}
                <div className="w-16 sm:w-24 md:w-20 lg:w-16 xl:w-24 bg-slate-100 rounded-full h-2.5 sm:h-3 overflow-hidden shrink-0">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, pct))}%`,
                      backgroundColor: "#0071DC"
                    }}
                  />
                </div>

                {/* Percentage */}
                <div className="w-8 sm:w-9 text-right text-xs sm:text-sm font-bold text-slate-700 tabular-nums shrink-0">
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
