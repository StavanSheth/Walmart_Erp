"use client";

import * as React from "react";
import type { PartnerListItem } from "@/types/partners";
import { PartnerAvatar } from "./partner-avatar";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreVerticalIcon,
  ChevronRightIcon as ArrowRight
} from "@/components/ui/icons";
import { Skeleton } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { cn } from "@/lib/cn";

export interface PartnerListProps {
  items: PartnerListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSelectPartner: (id: string) => void;
  className?: string;
}

export function PartnerList({
  items = [],
  pagination,
  isLoading = false,
  onPageChange,
  onPageSizeChange,
  onSelectPartner,
  className
}: PartnerListProps) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(items.map((item) => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startRow = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const endRow = Math.min(pagination.page * pagination.pageSize, pagination.total);

  if (isLoading) {
    return (
      <div className={cn("bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32 rounded" />
          <Skeleton className="h-4 w-44 rounded" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 w-full bg-slate-50/80 rounded-xl flex items-center px-4 gap-4">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="w-9 h-9 rounded-xl" />
              <Skeleton className="w-36 h-4 rounded" />
              <Skeleton className="w-20 h-4 rounded" />
              <Skeleton className="w-24 h-4 rounded" />
              <Skeleton className="w-28 h-4 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between",
        className
      )}
    >
      {/* Table Header Section */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Partner List
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Showing {startRow}–{endRow} of {pagination.total.toLocaleString()} partners
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No partners found"
          description="Try modifying your search or filter criteria to find partners."
          className="py-12"
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      aria-label="Select all partners"
                      checked={items.length > 0 && selectedIds.size === items.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-slate-300 text-[#0071DC] focus:ring-[#0071DC] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Region</th>
                  <th className="py-3 px-3">Contact Person</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Last Order</th>
                  <th className="py-3 px-3 text-right">Total Value</th>
                  <th className="py-3 px-4 text-center w-12">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {items.map((item) => {
                  const isChecked = selectedIds.has(item.id);
                  const isRetailer = item.type === "Retailer";
                  const isSupplier = item.type === "Supplier";

                  return (
                    <tr
                      key={item.id}
                      className={cn(
                        "hover:bg-blue-50/40 transition-colors group cursor-pointer",
                        isChecked && "bg-blue-50/50"
                      )}
                      onClick={() => onSelectPartner(item.id)}
                    >
                      {/* Checkbox */}
                      <td
                        className="py-3.5 px-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelect(item.id);
                        }}
                      >
                        <input
                          type="checkbox"
                          aria-label={`Select ${item.name}`}
                          checked={isChecked}
                          onChange={() => handleToggleSelect(item.id)}
                          className="rounded border-slate-300 text-[#0071DC] focus:ring-[#0071DC] cursor-pointer"
                        />
                      </td>

                      {/* Name with Avatar */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5 min-w-max">
                          <PartnerAvatar name={item.name} size="md" />
                          <span className="font-semibold text-slate-900 group-hover:text-[#0071DC] transition-colors">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      {/* Type Pill */}
                      <td className="py-3.5 px-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap",
                            isRetailer
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : isSupplier
                              ? "bg-purple-50 text-purple-700 border border-purple-200/60"
                              : "bg-blue-50 text-blue-700 border border-blue-200/60"
                          )}
                        >
                          {item.type}
                        </span>
                      </td>

                      {/* Region */}
                      <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap">
                        {item.region}
                      </td>

                      {/* Contact Person */}
                      <td className="py-3.5 px-3 text-slate-800 font-medium whitespace-nowrap">
                        {item.contactPerson || "—"}
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px] truncate max-w-[160px]">
                        {item.email || "—"}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold",
                            item.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                              : "bg-rose-50 text-rose-700 border border-rose-200/80"
                          )}
                        >
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              item.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"
                            )}
                          />
                          <span>{item.status === "ACTIVE" ? "Active" : "Inactive"}</span>
                        </span>
                      </td>

                      {/* Last Order */}
                      <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap text-[11px]">
                        {item.lastOrderDate ? formatDate(item.lastOrderDate) : "—"}
                      </td>

                      {/* Total Sales / Value */}
                      <td className="py-3.5 px-3 text-right font-bold text-slate-900 whitespace-nowrap tabular-nums">
                        {item.totalValue > 0 ? formatCurrency(item.totalValue) : "—"}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPartner(item.id);
                        }}
                      >
                        <button
                          type="button"
                          aria-label={`View details for ${item.name}`}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        >
                          <MoreVerticalIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Cards */}
          <div className="block md:hidden divide-y divide-slate-100">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectPartner(item.id)}
                className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <PartnerAvatar name={item.name} size="md" />
                  <div className="min-w-0 space-y-0.5">
                    <div className="font-bold text-slate-900 text-sm truncate">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-blue-600">{item.type}</span>
                      <span>•</span>
                      <span>{item.region}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 tabular-nums">
                      {item.totalValue > 0 ? formatCurrency(item.totalValue) : "No orders yet"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      item.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"
                    )}
                  />
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination Footer */}
      <div className="px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            aria-label="Rows per page"
            value={pagination.pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 pl-2 pr-6 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer shadow-2xs"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Page Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            aria-label="Previous page"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeftIcon className="w-4 h-4 text-slate-600" />
          </button>

          <span className="px-3 font-medium text-slate-700">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            aria-label="Next page"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRightIcon className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
