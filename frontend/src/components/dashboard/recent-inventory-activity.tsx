"use client";

import * as React from "react";
import type { RecentInventoryActivityItem } from "@/types/dashboard";
import Link from "next/link";

export interface RecentInventoryActivityProps {
  activities?: RecentInventoryActivityItem[];
  isLoading?: boolean;
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
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Recent Inventory Activity
        </h3>
        <Link
          href="/inventory"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
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
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-slate-200/70" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-slate-200/70 rounded w-1/2" />
                <div className="h-2.5 bg-slate-200/70 rounded w-1/4" />
              </div>
              <div className="h-3 bg-slate-200/70 rounded w-20" />
            </div>
          ))}
        </div>
      ) : displayActivities.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          No recent inventory activity recorded
        </div>
      ) : (
        <div className="divide-y divide-slate-100/70">
          {displayActivities.map((act) => (
            <div
              key={act.id}
              className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
            >
              {/* Product info with subtle icon */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-lg bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold text-[10px]">
                  {act.productName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate" title={act.productName}>
                    {act.productName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {act.storeName}
                  </p>
                </div>
              </div>

              {/* Activity Label with dot indicator */}
              <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-white/60 border border-slate-100/80">
                <span className={`w-2 h-2 rounded-full ${getDotColor(act.statusColor)}`} />
                <span className="font-medium text-slate-700 text-[11px]">
                  {act.activityLabel}
                </span>
              </div>

              {/* Time */}
              <div className="text-right text-[11px] font-medium text-slate-400 tabular-nums shrink-0 w-16">
                {act.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
