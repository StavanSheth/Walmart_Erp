"use client";

import * as React from "react";
import { Skeleton } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { formatNumber, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { InventoryMovement } from "@/types/inventory";

export interface InventoryMovementsProps {
  movements?: InventoryMovement[];
  isLoading?: boolean;
  onViewAll?: () => void;
}

export function InventoryMovements({
  movements = [],
  isLoading = false,
  onViewAll
}: InventoryMovementsProps) {
  const getTypeBadge = (type: string, label: string) => {
    switch (type) {
      case "PURCHASE":
      case "OPENING":
      case "RETURN":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            {label}
          </span>
        );
      case "SALE":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
            {label}
          </span>
        );
      case "TRANSFER_IN":
      case "TRANSFER_OUT":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
            {label}
          </span>
        );
      case "ADJUSTMENT":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {label}
          </span>
        );
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }).format(d);
    } catch {
      return formatShortDate(dateStr);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
            Recent Inventory Movements
          </h3>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-bold text-brand-primary hover:text-blue-700 transition inline-flex items-center gap-0.5 whitespace-nowrap"
        >
          View All →
        </button>
      </div>

      {/* Movements Table with Custom Scrollbar */}
      <div className="pt-2 flex-1 flex flex-col justify-between">
        {isLoading ? (
          <div className="space-y-3 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100">
                <Skeleton className="h-4 w-16 rounded font-mono" />
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-14 rounded" />
                <Skeleton className="h-4 w-12 rounded ml-auto" />
              </div>
            ))}
          </div>
        ) : movements.length === 0 ? (
          <EmptyState
            title="No movements recorded"
            description="Recent inventory audit transactions will appear here."
            className="py-10"
          />
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[310px] -mx-4 sm:-mx-5 px-4 sm:px-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-white z-10 shadow-2xs">
                <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-white">
                  <th className="py-2 pr-2.5 bg-white">ID</th>
                  <th className="py-2 px-2.5 min-w-[105px] bg-white">Date & Time</th>
                  <th className="py-2 px-2.5 min-w-[140px] bg-white">Product</th>
                  <th className="py-2 px-2.5 text-center bg-white">Type</th>
                  <th className="py-2 px-2.5 text-right bg-white">Qty</th>
                  <th className="py-2 px-2.5 min-w-[125px] bg-white">Store / Partner</th>
                  <th className="py-2 pl-2.5 text-center bg-white">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {movements.map((mov) => {
                  const isPositive = mov.quantity > 0;
                  const isNegative = mov.quantity < 0;
                  return (
                    <tr key={mov.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 pr-2.5 font-mono text-[11px] font-semibold text-slate-500">
                        {mov.code}
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-500 text-[11px] whitespace-nowrap">
                        {formatDateTime(mov.createdAt)}
                      </td>
                      <td className="py-2.5 px-2.5">
                        <span className="font-bold text-slate-900 block truncate max-w-[140px]" title={mov.productName}>
                          {mov.productName}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 text-center">
                        {getTypeBadge(mov.type, mov.typeLabel)}
                      </td>
                      <td className="py-2.5 px-2.5 text-right tabular-nums font-bold">
                        <span
                          className={cn(
                            isPositive && "text-emerald-600",
                            isNegative && "text-rose-600",
                            !isPositive && !isNegative && "text-slate-700"
                          )}
                        >
                          {isPositive ? `+${formatNumber(mov.quantity)}` : formatNumber(mov.quantity)}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-600 truncate max-w-[130px]" title={mov.storeName}>
                        {mov.storeName}
                      </td>
                      <td className="py-2.5 pl-2.5 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          {mov.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
