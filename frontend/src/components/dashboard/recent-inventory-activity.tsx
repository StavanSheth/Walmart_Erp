"use client";

import * as React from "react";
import type { RecentInventoryActivityItem } from "@/types/dashboard";
import Link from "next/link";

export interface RecentInventoryActivityProps {
  activities?: RecentInventoryActivityItem[];
  isLoading?: boolean;
}

function ProductIcon() {
  return (
    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100/80 flex items-center justify-center shrink-0 shadow-2xs">
      <svg className="w-4 h-4 text-[#0071DC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    </div>
  );
}

export function RecentInventoryActivity({
  activities = [],
  isLoading = false
}: RecentInventoryActivityProps) {
  const displayActivities = activities.slice(0, 5);

  const getDotColor = (color: RecentInventoryActivityItem["statusColor"]) => {
    switch (color) {
      case "success":
        return "bg-emerald-500";
      case "danger":
        return "bg-rose-500";
      case "warning":
        return "bg-amber-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-full overflow-hidden shadow-md">
      <div className="flex items-center justify-between mb-2 min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
          Recent Inventory Activity
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
        <div className="space-y-3 py-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-200/70 shrink-0" />
              <div className="flex-1 space-y-1 min-w-0">
                <div className="h-3 bg-slate-200/70 rounded w-1/2" />
                <div className="h-2.5 bg-slate-200/70 rounded w-1/4" />
              </div>
              <div className="h-3 bg-slate-200/70 rounded w-16 shrink-0" />
            </div>
          ))}
        </div>
      ) : displayActivities.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          No recent inventory activity recorded
        </div>
      ) : (
        <div className="divide-y divide-slate-100/70 my-auto">
          {displayActivities.map((act) => (
            <div
              key={act.id}
              className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-2 sm:gap-3 text-xs min-w-0"
            >
              {/* Product info with generic product icon */}
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                <ProductIcon />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 truncate" title={act.productName}>
                    {act.productName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {act.storeName}
                  </p>
                </div>
              </div>

              {/* Activity Label with dot indicator */}
              <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-white/70 border border-slate-100 text-[10px] sm:text-[11px] max-w-[130px] sm:max-w-[160px] truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 ${getDotColor(act.statusColor)}`} />
                <span className="font-medium text-slate-700 truncate">
                  {act.activityLabel}
                </span>
              </div>

              {/* Time */}
              <div className="text-right text-[10px] sm:text-[11px] font-medium text-slate-400 tabular-nums shrink-0">
                {act.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
