"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { EmptyState } from "./empty-state";
import { LoadingState } from "./loading-state";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  hideOnMobile?: boolean;
}

export interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  mobileView?: "scroll" | "card";
  renderMobileCard?: (item: T, index: number) => React.ReactNode;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  onRowClick?: (item: T) => void;
}

export function ResponsiveTable<T>({
  data,
  columns,
  keyExtractor,
  mobileView = "scroll",
  renderMobileCard,
  isLoading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no records to display at this time.",
  className,
  onRowClick
}: ResponsiveTableProps<T>) {
  if (isLoading) {
    return <LoadingState variant="skeleton" />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Mobile Card View (if enabled and card renderer provided) */}
      {mobileView === "card" && renderMobileCard ? (
        <div className="block md:hidden space-y-3">
          {data.map((item, index) => (
            <div
              key={keyExtractor(item, index)}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "rounded-xl border border-slate-200 bg-white p-4 shadow-xs",
                onRowClick && "cursor-pointer active:bg-slate-50 transition-colors"
              )}
            >
              {renderMobileCard(item, index)}
            </div>
          ))}
        </div>
      ) : null}

      {/* Desktop / Horizontally Scrollable Table */}
      <div
        className={cn(
          "w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs",
          mobileView === "card" && renderMobileCard ? "hidden md:block" : "block"
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      "px-4 py-3 whitespace-nowrap",
                      alignClasses[col.align || "left"],
                      col.hideOnMobile && "hidden sm:table-cell",
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item, index) => (
                <tr
                  key={keyExtractor(item, index)}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "hover:bg-slate-50/70 transition-colors",
                    onRowClick && "cursor-pointer",
                    index % 2 === 1 && "bg-slate-50/20"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 whitespace-nowrap text-slate-700",
                        alignClasses[col.align || "left"],
                        col.hideOnMobile && "hidden sm:table-cell",
                        col.className
                      )}
                    >
                      {col.render
                        ? col.render(item, index)
                        : (item as Record<string, unknown>)[col.key] !== undefined
                          ? String((item as Record<string, unknown>)[col.key])
                          : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
