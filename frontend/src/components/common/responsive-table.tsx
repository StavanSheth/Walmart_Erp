"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { EmptyState } from "./empty-state";
import { SkeletonTable } from "./loading-state";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  hideOnMobile?: boolean;
  isNumeric?: boolean;
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
  density?: "compact" | "normal";
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
  onRowClick,
  density = "normal"
}: ResponsiveTableProps<T>) {
  if (isLoading) {
    return <SkeletonTable cols={columns.length} rows={5} className={className} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} className={className} />;
  }

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  const paddingClasses = {
    compact: "px-3 py-2 text-xs",
    normal: "px-4 py-3 text-sm"
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
                "rounded-xl border border-border bg-surface p-4 shadow-xs",
                onRowClick && "cursor-pointer active:bg-surface-subtle transition-colors"
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
          "w-full overflow-hidden rounded-xl border border-border bg-surface shadow-xs",
          mobileView === "card" && renderMobileCard ? "hidden md:block" : "block"
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-700">
            <thead className="bg-surface-subtle border-b border-border type-table-header">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      "px-4 py-3 whitespace-nowrap font-semibold",
                      alignClasses[col.align || "left"],
                      col.hideOnMobile && "hidden sm:table-cell",
                      col.isNumeric && "tabular-nums",
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle type-table-body">
              {data.map((item, index) => (
                <tr
                  key={keyExtractor(item, index)}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "hover:bg-slate-50/80 transition-colors",
                    onRowClick && "cursor-pointer",
                    index % 2 === 1 && "bg-slate-50/30"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        paddingClasses[density],
                        "whitespace-nowrap",
                        alignClasses[col.align || "left"],
                        col.hideOnMobile && "hidden sm:table-cell",
                        col.isNumeric && "tabular-nums font-mono",
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

export const DataTable = ResponsiveTable;

export function TableToolbar({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
  className
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 bg-surface border-t border-border text-xs text-slate-500",
        className
      )}
    >
      <div>
        {totalItems !== undefined ? (
          <span>
            Showing{" "}
            <span className="font-semibold tabular-nums">
              {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
            </span>{" "}
            to{" "}
            <span className="font-semibold tabular-nums">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{" "}
            of <span className="font-semibold tabular-nums">{totalItems}</span> results
          </span>
        ) : (
          <span>
            Page <span className="font-semibold tabular-nums">{currentPage}</span> of{" "}
            <span className="font-semibold tabular-nums">{totalPages}</span>
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="xs"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="outline"
          size="xs"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
