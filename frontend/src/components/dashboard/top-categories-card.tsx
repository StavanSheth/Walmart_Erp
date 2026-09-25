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

function getCategoryIcon(name: string) {
  const n = name.toLowerCase();

  // 1. Groceries / Food / Snacks / Pantry / Produce
  if (n.includes("grocer") || n.includes("food") || n.includes("snack") || n.includes("pantry")) {
    return (
      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    );
  }

  // 2. Dairy / Milk / Cheese / Butter / Yogurt
  if (n.includes("dairy") || n.includes("milk") || n.includes("cheese") || n.includes("butter")) {
    return (
      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 2h8m-6 3h4m-5 4v11a2 2 0 002 2h4a2 2 0 002-2V9l-1-4H10L9 9zm2 4h2" />
      </svg>
    );
  }

  // 3. Home Appliances / Appliances / Kitchen / Home
  if (n.includes("appliance") || n.includes("home") || n.includes("kitchen")) {
    return (
      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="4" y="2" width="16" height="20" rx="2" strokeWidth={2} />
        <line x1="4" y1="10" x2="20" y2="10" strokeWidth={2} strokeLinecap="round" />
        <line x1="8" y1="6" x2="8" y2="7" strokeWidth={2} strokeLinecap="round" />
        <line x1="8" y1="14" x2="8" y2="16" strokeWidth={2} strokeLinecap="round" />
      </svg>
    );
  }

  // 4. Personal Care / Beauty / Cosmetics / Hygiene
  if (n.includes("personal") || n.includes("care") || n.includes("beauty") || n.includes("hygiene")) {
    return (
      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4h-4V2h4v2zm-2 0v4m-4 3h8a2 2 0 012 2v7a2 2 0 01-2 2H8a2 2 0 01-2-2v-7a2 2 0 012-2zm4 4v3" />
      </svg>
    );
  }

  // 5. Audio / Music / Headphones / Speakers / Sound
  if (n.includes("audio") || n.includes("sound") || n.includes("music") || n.includes("headphone") || n.includes("speaker")) {
    return (
      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 18v-6a9 9 0 0118 0v6M3 18a3 3 0 003 3h1a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v1zm18 0a3 3 0 01-3 3h-1a1 1 0 01-1-1v-4a1 1 0 011-1h3a1 1 0 011 1v1z" />
      </svg>
    );
  }

  // 6. Electronics / Mobile / Computing / Tech
  if (n.includes("electron") || n.includes("tech") || n.includes("comput") || n.includes("mobile")) {
    return (
      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8m-4-4v4" />
      </svg>
    );
  }

  // 7. Clothing / Apparel / Fashion
  if (n.includes("cloth") || n.includes("apparel") || n.includes("fashion") || n.includes("wear")) {
    return (
      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4l4 4-2 3-3-2v11H9V9L6 11 4 8l4-4h2a2 2 0 004 0h2z" />
      </svg>
    );
  }

  // 8. Beverages / Drinks
  if (n.includes("beverag") || n.includes("drink") || n.includes("juice") || n.includes("water")) {
    return (
      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20m-7-9h14M7 5l1 8h8l1-8H7z" />
      </svg>
    );
  }

  // Fallback: Package Box
  return (
    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

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
                  {getCategoryIcon(cat.categoryName)}
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
