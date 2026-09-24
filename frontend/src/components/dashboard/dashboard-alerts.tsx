"use client";

import * as React from "react";
import type { DashboardAlertItem } from "@/types/dashboard";
import Link from "next/link";

export interface DashboardAlertsProps {
  alerts?: DashboardAlertItem[];
  isLoading?: boolean;
}

export function DashboardAlerts({ alerts = [], isLoading = false }: DashboardAlertsProps) {
  const displayAlerts = alerts.slice(0, 5);

  const renderIcon = (type: DashboardAlertItem["type"]) => {
    switch (type) {
      case "danger":
        return (
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case "warning":
        return (
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case "success":
        return (
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      default: // info
        return (
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-full overflow-hidden shadow-md">
      <div className="flex items-center justify-between mb-3 min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
          Alerts & Notifications
        </h3>
        <Link
          href="/reports"
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
            <div key={i} className="animate-pulse flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-slate-200/70 shrink-0" />
              <div className="flex-1 h-3.5 bg-slate-200/70 rounded" />
              <div className="w-12 h-3 bg-slate-200/70 rounded shrink-0" />
            </div>
          ))}
        </div>
      ) : displayAlerts.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          No active alerts or operational warnings
        </div>
      ) : (
        <div className="divide-y divide-slate-100/70 my-auto">
          {displayAlerts.map((alert) => (
            <div
              key={alert.id}
              className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2 sm:gap-2.5 text-xs min-w-0"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {renderIcon(alert.type)}
                <span className="font-medium text-slate-800 truncate" title={alert.title}>
                  {alert.title}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 tabular-nums shrink-0">
                {alert.timestamp}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
