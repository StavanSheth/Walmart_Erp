"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import {
  CalendarIcon,
  InventoryIcon,
  StoreNavIcon,
  RupeeCurrencyIcon
} from "@/components/ui/icons";
import type { ScheduledReportItem as ScheduledReportItemType } from "@/types/reports";

export interface ScheduledReportRowProps {
  item: ScheduledReportItemType;
  onToggle?: (id: string, newEnabled: boolean) => void;
  compact?: boolean;
}

export function ScheduledReportItemRow({
  item,
  onToggle,
  compact = false
}: ScheduledReportRowProps) {
  const [enabled, setEnabled] = React.useState(item.enabled);

  React.useEffect(() => {
    setEnabled(item.enabled);
  }, [item.enabled]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextVal = !enabled;
    setEnabled(nextVal);
    onToggle?.(item.id, nextVal);
  };

  const renderIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "sales":
        return <CalendarIcon className="w-4 h-4 text-blue-600" />;
      case "inventory":
        return <InventoryIcon className="w-4 h-4 text-purple-600" />;
      case "financial":
        return <RupeeCurrencyIcon className="w-4 h-4 text-emerald-600" />;
      case "store":
        return <StoreNavIcon className="w-4 h-4 text-teal-600" />;
      default:
        return <CalendarIcon className="w-4 h-4 text-blue-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type.toLowerCase()) {
      case "sales": return "bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200/80 text-blue-600 shadow-blue-500/10";
      case "inventory": return "bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200/80 text-purple-600 shadow-purple-500/10";
      case "financial": return "bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-200/80 text-emerald-600 shadow-emerald-500/10";
      case "store": return "bg-gradient-to-br from-teal-100 to-teal-50 border-teal-200/80 text-teal-600 shadow-teal-500/10";
      default: return "bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200/80 text-blue-600 shadow-blue-500/10";
    }
  };

  return (
    <div className={cn(
      "flex items-center justify-between transition-all duration-150 rounded-xl border",
      compact ? "px-2.5 py-2" : "px-3 py-2.5",
      enabled
        ? "bg-slate-50/60 hover:bg-blue-50/40 border-slate-100/90 hover:border-blue-200/80"
        : "bg-slate-50/30 border-transparent opacity-75 hover:opacity-100"
    )}>
      {/* Icon + Title + Schedule subtitle */}
      <div className="flex items-center gap-2.5 truncate min-w-0">
        <div className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 shadow-xs",
          getIconBg(item.type)
        )}>
          {renderIcon(item.type)}
        </div>
        <div className="truncate min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-800 truncate block leading-tight">
              {item.name}
            </span>
            {enabled ? (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-full leading-tight shrink-0">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active</span>
              </span>
            ) : (
              <span className="text-[9px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-full leading-tight shrink-0">
                Paused
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-medium truncate block leading-tight mt-0.5">
            🗓️ {item.schedule}
          </span>
        </div>
      </div>

      {/* iOS-style Toggle Switch */}
      <div className="shrink-0 ml-2">
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={handleToggle}
          aria-label={`Toggle ${item.name}`}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0071DC]",
            enabled ? "bg-[#0071DC] shadow-sm shadow-blue-500/30" : "bg-slate-300"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
              enabled ? "translate-x-4" : "translate-x-0"
            )}
          />
        </button>
      </div>
    </div>
  );
}

export interface ScheduledReportsPanelProps {
  items?: ScheduledReportItemType[];
  onToggleReport?: (id: string, newEnabled: boolean) => void;
  onViewAll?: () => void;
  compact?: boolean;
  isLoading?: boolean;
}

export function ScheduledReportsPanel({
  items,
  onToggleReport,
  onViewAll,
  compact = false,
  isLoading
}: ScheduledReportsPanelProps) {
  const scheduled = items || [];

  return (
    <div className={cn(
      "bg-white/95 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] space-y-3",
      compact ? "p-3.5 sm:p-4" : "p-4 sm:p-5"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/25">
            <CalendarIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
              Scheduled Reports
            </h3>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
              Automated periodic exports
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-[#0071DC] hover:text-blue-700 flex items-center gap-1 cursor-pointer transition hover:underline"
        >
          <span>View All</span>
          <span>→</span>
        </button>
      </div>

      {/* Rows */}
      <div className="space-y-1">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-2.5 py-2 animate-pulse">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100" />
                <div className="space-y-1">
                  <div className="h-3 w-28 bg-slate-100 rounded" />
                  <div className="h-2.5 w-20 bg-slate-50 rounded" />
                </div>
              </div>
              <div className="w-8 h-4 rounded-full bg-slate-200" />
            </div>
          ))
        ) : (
          scheduled.map((item) => (
            <ScheduledReportItemRow
              key={item.id}
              item={item}
              onToggle={onToggleReport}
              compact={compact}
            />
          ))
        )}
      </div>
    </div>
  );
}
