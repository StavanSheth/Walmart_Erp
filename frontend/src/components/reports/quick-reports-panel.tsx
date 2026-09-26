"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import {
  ChevronRightIcon,
  FileTextIcon,
  InventoryIcon,
  CartIcon,
  StoreNavIcon,
  UsersIcon,
  PlusIcon,
  RupeeCurrencyIcon
} from "@/components/ui/icons";
import type { QuickReportItem } from "@/types/reports";

export interface QuickReportsPanelProps {
  items?: QuickReportItem[];
  onSelectQuickReport?: (item: QuickReportItem) => void;
  onViewAll?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function QuickReportsPanel({
  items,
  onSelectQuickReport,
  onViewAll,
  isLoading,
  className
}: QuickReportsPanelProps) {
  const quickReports = items || [];

  const renderIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileTextIcon className="w-4 h-4 text-blue-600" />;
      case "inventory":
        return <InventoryIcon className="w-4 h-4 text-emerald-600" />;
      case "bag":
        return <CartIcon className="w-4 h-4 text-sky-600" />;
      case "store":
        return <StoreNavIcon className="w-4 h-4 text-teal-600" />;
      case "users":
        return <UsersIcon className="w-4 h-4 text-purple-600" />;
      case "cube":
        return <InventoryIcon className="w-4 h-4 text-indigo-600" />;
      case "currency":
        return <RupeeCurrencyIcon className="w-4 h-4 text-amber-600" />;
      case "plus":
        return <PlusIcon className="w-4 h-4 text-orange-600" />;
      default:
        return <FileTextIcon className="w-4 h-4 text-blue-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "document": return "bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200/80 text-blue-600 shadow-blue-500/10";
      case "inventory": return "bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-200/80 text-emerald-600 shadow-emerald-500/10";
      case "bag": return "bg-gradient-to-br from-sky-100 to-sky-50 border-sky-200/80 text-sky-600 shadow-sky-500/10";
      case "store": return "bg-gradient-to-br from-teal-100 to-teal-50 border-teal-200/80 text-teal-600 shadow-teal-500/10";
      case "users": return "bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200/80 text-purple-600 shadow-purple-500/10";
      case "cube": return "bg-gradient-to-br from-indigo-100 to-indigo-50 border-indigo-200/80 text-indigo-600 shadow-indigo-500/10";
      case "currency": return "bg-gradient-to-br from-amber-100 to-amber-50 border-amber-200/80 text-amber-600 shadow-amber-500/10";
      case "plus": return "bg-gradient-to-br from-orange-100 to-amber-50 border-orange-200/80 text-orange-600 shadow-orange-500/10";
      default: return "bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200/80 text-blue-600 shadow-blue-500/10";
    }
  };

  const getCategoryTagStyle = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "sales": return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "inventory": return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "store": return "bg-teal-50 text-teal-700 border-teal-200/60";
      case "partner": return "bg-purple-50 text-purple-700 border-purple-200/60";
      case "financial": return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "custom": return "bg-orange-50 text-orange-700 border-orange-200/60";
      default: return "bg-slate-50 text-slate-600 border-slate-200/60";
    }
  };

  return (
    <div className={cn("bg-white/95 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-4 sm:p-5 flex flex-col h-auto min-h-[385px] xl:h-[385px] overflow-hidden", className)}>
      {/* Title & View All */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/25">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
              Quick Reports
            </h3>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
              Instant 1-click generators
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

      {/* Quick Report Items List with custom scrollbar */}
      <div className="flex-1 min-h-0 space-y-1.5 overflow-y-auto pr-1 mt-2 erp-scrollbar scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-2.5 py-2.5 animate-pulse">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100" />
                <div className="h-3 w-32 bg-slate-100 rounded" />
              </div>
              <div className="h-3 w-12 bg-slate-100 rounded" />
            </div>
          ))
        ) : (
          quickReports.map((item) => (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectQuickReport?.(item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectQuickReport?.(item);
              }
            }}
            className={cn(
              "flex items-center justify-between px-2.5 py-2 rounded-xl transition-all duration-150 cursor-pointer select-none group border",
              "bg-slate-50/50 hover:bg-blue-50/50 border-slate-100/80 hover:border-blue-200/80 hover:shadow-xs"
            )}
          >
            {/* Left: Icon container + Name + Category */}
            <div className="flex items-center gap-2.5 truncate min-w-0">
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 shadow-xs",
                getIconBg(item.icon)
              )}>
                {renderIcon(item.icon)}
              </div>
              <div className="truncate min-w-0">
                <span className="text-xs font-semibold text-slate-800 truncate block leading-tight group-hover:text-blue-700 transition-colors">
                  {item.name}
                </span>
                <span className={cn(
                  "inline-block text-[9.5px] font-semibold px-1.5 py-0.2 rounded border mt-0.5 leading-tight",
                  getCategoryTagStyle(item.category)
                )}>
                  {item.category}
                </span>
              </div>
            </div>

            {/* Right: Frequency Pill + Chevron */}
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <span className="text-[10px] font-medium text-slate-600 bg-white border border-slate-200/80 px-2 py-0.5 rounded-full shadow-2xs">
                {item.periodLabel}
              </span>
              <ChevronRightIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}
