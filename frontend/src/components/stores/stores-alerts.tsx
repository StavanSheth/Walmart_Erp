"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronRightIcon, AlertTriangleIcon, AlertCircleIcon, InfoIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/common/loading-state";
import { formatShortDate } from "@/lib/format";
import type { StoreAlertItem, StoreAlertSeverity } from "@/types/stores";

interface StoresAlertsProps {
  alerts: StoreAlertItem[];
  onSelectStore?: (storeId: string) => void;
  onViewDetail?: (storeId: string) => void;
  onViewAll?: () => void;
  isLoading?: boolean;
}

function getAlertIcon(severity: StoreAlertSeverity) {
  switch (severity) {
    case "CRITICAL":
      return (
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
          <AlertCircleIcon className="w-3.5 h-3.5" />
        </div>
      );
    case "WARNING":
      return (
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <AlertTriangleIcon className="w-3.5 h-3.5" />
        </div>
      );
    case "INFO":
    default:
      return (
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-50 text-[#0071DC] flex items-center justify-center shrink-0">
          <InfoIcon className="w-3.5 h-3.5" />
        </div>
      );
  }
}

export function StoresAlerts({
  alerts,
  onSelectStore,
  onViewDetail,
  onViewAll,
  isLoading = false
}: StoresAlertsProps) {
  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between h-full bg-white">
      <CardHeader className="p-2.5 sm:p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
        <CardTitle className="text-xs sm:text-sm lg:text-base font-bold text-slate-900 truncate">
          Recent Alerts
        </CardTitle>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-[10px] sm:text-xs font-semibold text-[#0071DC] hover:text-blue-700 flex items-center gap-0.5 transition-colors cursor-pointer shrink-0"
          >
            <span>View All</span>
            <ChevronRightIcon className="w-3 h-3" />
          </button>
        )}
      </CardHeader>

      <CardContent className="p-2.5 sm:p-4 flex-1 flex flex-col justify-around space-y-1.5 sm:space-y-2.5">
        {isLoading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-6 h-6 rounded-lg" />
                  <Skeleton className="h-3.5 w-24 rounded" />
                </div>
                <Skeleton className="h-3 w-12 rounded" />
              </div>
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-4 text-center text-slate-400 text-xs">
            No active operational alerts.
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-2.5">
            {alerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                onClick={() => {
                  if (onSelectStore) onSelectStore(alert.storeId);
                  if (onViewDetail) onViewDetail(alert.storeId);
                }}
                className="flex items-center justify-between py-0.5 sm:py-1 hover:bg-slate-50 rounded-lg px-1 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-1">
                  {getAlertIcon(alert.severity)}
                  <h5 className="font-semibold text-[11px] sm:text-xs text-slate-800 truncate group-hover:text-[#0071DC] transition-colors leading-tight">
                    {alert.title}
                  </h5>
                </div>

                <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium shrink-0 ml-auto pl-1">
                  {formatShortDate(alert.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
