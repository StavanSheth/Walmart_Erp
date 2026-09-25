"use client";

import * as React from "react";
import { CalendarIcon, PackageIcon, RefreshCwIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export interface InventoryPageHeaderProps {
  onRefresh?: () => void;
  isFetching?: boolean;
}

export function InventoryPageHeader({
  onRefresh,
  isFetching = false
}: InventoryPageHeaderProps) {
  const [currentDateString, setCurrentDateString] = React.useState("Mon, 22 Sep 2026");
  const [currentTimeString, setCurrentTimeString] = React.useState("10:24 AM");

  React.useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const datePart = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
      }).format(now);
      const timePart = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }).format(now);
      setCurrentDateString(datePart);
      setCurrentTimeString(timePart);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* 1. Left: Inventory Title & Taglines */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-brand-primary flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
          <PackageIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none drop-shadow-md">
            Inventory
          </h1>
          <p className="text-xs sm:text-sm font-bold text-blue-100 mt-1 drop-shadow-xs">
            Track. Optimize. Never run out.
          </p>
          <p className="text-[11px] sm:text-xs text-blue-200/90 truncate mt-0.5 drop-shadow-xs">
            Real-time inventory across all stores and warehouses.
          </p>
        </div>
      </div>

      {/* 2. Right: Date & Time Card + Refresh */}
      <div className="flex items-center gap-2.5 sm:gap-3 self-end sm:self-auto shrink-0">
        {/* Date / Time Card */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white shadow-xs h-9">
          <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
            <CalendarIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex items-center gap-1.5 text-xs leading-none">
            <span className="font-bold text-white whitespace-nowrap">{currentDateString}</span>
            <span className="text-white/60 font-semibold">•</span>
            <span className="text-white/80 font-semibold whitespace-nowrap">{currentTimeString}</span>
          </div>
        </div>

        {/* Sync Refresh Button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetching}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white border border-white/25 flex items-center justify-center shadow-xs transition backdrop-blur-md disabled:opacity-50"
            title="Refresh Inventory Data"
            aria-label="Refresh Inventory Data"
          >
            <RefreshCwIcon className={cn("w-4 h-4", isFetching && "animate-spin")} />
          </button>
        )}
      </div>
    </div>
  );
}
