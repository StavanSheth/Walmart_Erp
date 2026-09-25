"use client";

import * as React from "react";
import type { StorePerformanceItem } from "@/types/dashboard";
import { formatCurrency } from "@/lib/format";

export interface StorePerformanceCardProps {
  stores?: StorePerformanceItem[];
  isLoading?: boolean;
}

export function StorePerformanceCard({ stores = [], isLoading = false }: StorePerformanceCardProps) {
  const displayStores = stores.slice(0, 5);
  const maxSales = Math.max(...displayStores.map((s) => s.sales), 1);

  return (
    <div className="glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-full overflow-hidden shadow-md">
      <div className="flex items-center justify-between mb-2 min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
          Store Performance
        </h3>
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white/80 border border-slate-200/80 rounded-xl shadow-2xs">
          <span>Top 5 Stores</span>
          <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 py-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-slate-200/70 shrink-0" />
              <div className="h-3.5 bg-slate-200/70 rounded flex-1" />
              <div className="w-20 h-2.5 bg-slate-200/70 rounded-full shrink-0" />
              <div className="w-14 h-3.5 bg-slate-200/70 rounded shrink-0" />
            </div>
          ))}
        </div>
      ) : displayStores.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          No store performance data available
        </div>
      ) : (
        <div className="space-y-2.5 sm:space-y-3 my-auto">
          {displayStores.map((store, index) => {
            const rank = index + 1;
            const pct = maxSales > 0 ? Math.round((store.sales / maxSales) * 100) : 0;

            return (
              <div key={store.storeId || index} className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                {/* Circular rank number badge */}
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {rank}
                </div>

                {/* Store Name */}
                <div
                  className="min-w-0 flex-1 truncate text-xs sm:text-sm font-semibold text-slate-800"
                  title={store.storeName}
                >
                  {store.storeName}
                </div>

                {/* Horizontal bar chart fill */}
                <div className="w-16 sm:w-20 md:w-16 lg:w-16 xl:w-24 bg-slate-100/90 rounded-full h-2.5 sm:h-3 overflow-hidden shrink-0">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#0071DC] to-[#2563EB]"
                    style={{
                      width: `${Math.min(100, Math.max(store.sales > 0 ? 8 : 0, pct))}%`
                    }}
                  />
                </div>

                {/* Amount instead of percentage */}
                <div className="w-16 sm:w-20 text-right text-xs sm:text-sm font-bold text-slate-800 tabular-nums shrink-0">
                  {formatCurrency(store.sales)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
