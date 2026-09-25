import * as React from "react";
import { Skeleton } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { StatusBadge } from "@/components/ui/badge";
import { formatNumber, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { InventoryMovement } from "@/types/inventory";

export interface InventoryMovementTableProps {
  movements?: InventoryMovement[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  maxHeight?: string;
  mode?: "standard" | "detail";
}

export function getMovementTypeBadge(type: string, label: string) {
  switch (type) {
    case "PURCHASE":
    case "OPENING":
    case "RETURN":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 whitespace-nowrap">
          {label}
        </span>
      );
    case "SALE":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60 whitespace-nowrap">
          {label}
        </span>
      );
    case "TRANSFER_IN":
    case "TRANSFER_OUT":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 whitespace-nowrap">
          {label}
        </span>
      );
    case "ADJUSTMENT":
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
          {label}
        </span>
      );
  }
}

export function formatMovementDateTime(dateStr: string) {
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
}

export function InventoryMovementTable({
  movements = [],
  isLoading = false,
  emptyTitle = "No movements recorded",
  emptyDescription = "Recent inventory audit transactions will appear here.",
  maxHeight = "max-h-[310px]",
  mode = "standard"
}: InventoryMovementTableProps) {
  if (isLoading) {
    return (
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
    );
  }

  if (movements.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        className="py-8"
      />
    );
  }

  if (mode === "detail") {
    return (
      <div className={cn("overflow-x-auto overflow-y-auto rounded-lg border border-border", maxHeight)}>
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 bg-surface-subtle border-b border-border text-slate-500 font-semibold text-[11px] z-10 shadow-2xs">
            <tr>
              <th className="px-3 py-2 bg-surface-subtle">Date</th>
              <th className="px-3 py-2 bg-surface-subtle text-center">Type</th>
              <th className="px-3 py-2 bg-surface-subtle text-right">Qty</th>
              <th className="px-3 py-2 bg-surface-subtle">Store</th>
              <th className="px-3 py-2 bg-surface-subtle">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle font-medium text-slate-700">
            {movements.map((m) => {
              const isPositive = m.quantity > 0;
              const isNegative = m.quantity < 0;
              return (
                <tr key={m.id} className="hover:bg-surface-subtle transition">
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    {formatMovementDateTime(m.createdAt)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {getMovementTypeBadge(m.type, m.typeLabel || m.type)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-bold tabular-nums">
                    <span
                      className={cn(
                        isPositive && "text-emerald-600",
                        isNegative && "text-rose-600",
                        !isPositive && !isNegative && "text-slate-700"
                      )}
                    >
                      {isPositive ? `+${formatNumber(m.quantity)}` : formatNumber(m.quantity)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-600 truncate max-w-[120px]" title={m.storeName}>
                    {m.storeCode || m.storeName}
                  </td>
                  <td className="px-3 py-2 text-slate-500 truncate max-w-[130px]" title={m.notes || m.referenceType || ""}>
                    {m.notes || m.referenceType || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto overflow-y-auto", maxHeight)}>
      <table className="w-full text-left border-collapse text-xs">
        <thead className="sticky top-0 bg-white z-10 shadow-2xs">
          <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-white">
            <th className="py-2 pr-2.5 bg-white">ID</th>
            <th className="py-2 px-2.5 min-w-[105px] bg-white">Date & Time</th>
            <th className="py-2 px-2.5 min-w-[140px] bg-white">Product</th>
            <th className="py-2 px-2.5 text-center bg-white">Type</th>
            <th className="py-2 px-2.5 text-right bg-white">Qty</th>
            <th className="py-2 px-2.5 min-w-[125px] bg-white">Store / Location</th>
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
                  {formatMovementDateTime(mov.createdAt)}
                </td>
                <td className="py-2.5 px-2.5">
                  <span className="font-bold text-slate-900 block truncate max-w-[140px]" title={mov.productName}>
                    {mov.productName}
                  </span>
                </td>
                <td className="py-2.5 px-2.5 text-center">
                  {getMovementTypeBadge(mov.type, mov.typeLabel)}
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
                  <StatusBadge status={mov.status || "COMPLETED"} size="sm" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
