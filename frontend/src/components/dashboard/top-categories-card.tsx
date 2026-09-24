"use client";

import * as React from "react";
import type { TopCategoryItem } from "@/types/dashboard";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";

export interface TopCategoriesCardProps {
  categories?: TopCategoryItem[];
  isLoading?: boolean;
}

const CATEGORY_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-600", bar: "bg-blue-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600", bar: "bg-emerald-500" },
  { bg: "bg-purple-100", text: "text-purple-600", bar: "bg-purple-500" },
  { bg: "bg-amber-100", text: "text-amber-600", bar: "bg-amber-500" },
  { bg: "bg-rose-100", text: "text-rose-600", bar: "bg-rose-500" },
];

export function TopCategoriesCard({ categories = [], isLoading = false }: TopCategoriesCardProps) {
  const topList = categories.slice(0, 5);

  return (
    <div className="glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-full overflow-hidden shadow-md">
      <div className="flex items-center justify-between mb-2 min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-baseline gap-1 min-w-0 truncate">
          <span className="truncate">Top Categories</span>
          <span className="text-[11px] font-normal text-slate-500 hidden sm:inline shrink-0">(By Stock Value)</span>
        </h3>
        <Link
          href="/inventory"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition shrink-0"
        >
          <span>View All</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3.5 py-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-200/70 shrink-0" />
              <div className="flex-1 h-3.5 bg-slate-200/70 rounded" />
              <div className="w-16 h-2 bg-slate-200/70 rounded-full shrink-0" />
              <div className="w-12 h-3.5 bg-slate-200/70 rounded shrink-0" />
            </div>
          ))}
        </div>
      ) : topList.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          No categories found
        </div>
      ) : (
        <div className="space-y-3 my-auto">
          {topList.map((cat, idx) => {
            const style = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            const pct = Math.round(cat.relativePercentage || 0);

            return (
              <div key={cat.categoryId || idx} className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                {/* Category Icon */}
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg ${style.bg} ${style.text} flex items-center justify-center shrink-0`}>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>

                {/* Category Name */}
                <div
                  className="min-w-0 flex-1 truncate text-xs sm:text-sm font-semibold text-slate-800"
                  title={cat.categoryName}
                >
                  {cat.categoryName}
                </div>

                {/* Relative progress bar */}
                <div className="w-12 sm:w-16 md:w-14 lg:w-12 xl:w-16 bg-slate-100 rounded-full h-2 overflow-hidden shrink-0">
                  <div
                    className={`${style.bar} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                  />
                </div>

                {/* Stock Value */}
                <div className="text-right text-xs sm:text-sm font-bold text-slate-800 tabular-nums shrink-0">
                  {formatCurrency(cat.stockValue)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
