"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { usePartnerDetail } from "@/hooks/use-partners";
import { PartnerAvatar } from "./partner-avatar";
import { formatCurrency, formatDate } from "@/lib/format";
import { Skeleton } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { StatusBadge } from "@/components/ui/badge";

export interface PartnerDetailProps {
  partnerId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PartnerDetailModal({
  partnerId,
  isOpen,
  onClose
}: PartnerDetailProps) {
  const { data, isLoading, isError, error, refetch } = usePartnerDetail(
    isOpen ? partnerId : null
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Partner & Customer Dossier"
      description="Live synchronized records, transaction ledger, and procurement details."
    >
      {isLoading ? (
        <div className="space-y-5 py-2">
          <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
          <Skeleton className="h-40 rounded-xl" />
        </div>
      ) : isError ? (
        <ErrorState
          title="Failed to load dossier"
          message={error instanceof Error ? error.message : "Unable to retrieve records."}
          onRetry={() => refetch()}
          className="my-4"
        />
      ) : !data ? null : (
        <div className="space-y-5 py-1 text-slate-800">
          {/* Identity Header */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3.5 min-w-0">
              <PartnerAvatar name={data.name} size="lg" />
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                  {data.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#0071DC]/10 text-[#0071DC]">
                    {data.type}
                  </span>
                  <StatusBadge status={data.status} label={data.status === "ACTIVE" ? "Active Record" : "Inactive"} />
                  {data.region && (
                    <span className="text-xs text-slate-500 font-medium">
                      • {data.region}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4 Financial Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">
                {data.entity === "partner" ? "Total Purchase" : "Total Sales"}
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                {data.totalValue > 0 ? formatCurrency(data.totalValue) : "₹0"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">
                Order Count
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                {data.orderCount} orders
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">
                Avg Order Value
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                {data.averageOrderValue > 0 ? formatCurrency(data.averageOrderValue) : "₹0"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">
                Credit Limit
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                {data.creditLimit > 0 ? formatCurrency(data.creditLimit) : "₹0"}
              </span>
            </div>
          </div>

          {/* Contact & Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-100 bg-white space-y-2">
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                Contact Details
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact Person:</span>
                  <span className="font-medium text-slate-800">{data.contactPerson || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-mono text-slate-700">{data.email || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-mono text-slate-700">{data.phone || "—"}</span>
                </div>
                {data.taxId && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">GSTIN / Tax ID:</span>
                    <span className="font-mono font-semibold text-slate-800">{data.taxId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-white space-y-2">
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                Location & Logistics
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Address:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[180px]">{data.address || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Operating Region:</span>
                  <span className="font-medium text-slate-800">{data.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Latest Store:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[180px]">{data.latestStoreName || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Activity:</span>
                  <span className="font-medium text-slate-800">{data.lastOrderDate ? formatDate(data.lastOrderDate) : "—"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders List */}
          <div className="space-y-2 pt-1">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              Recent Transactions (Latest 5)
            </h4>

            {data.recentOrders.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                No transaction orders recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Order Number</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Store</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-mono font-medium text-slate-900">{ord.orderNumber}</td>
                        <td className="py-2 px-3 text-slate-500">{formatDate(ord.date)}</td>
                        <td className="py-2 px-3 text-slate-700 truncate max-w-[140px]">{ord.storeName}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">{formatCurrency(ord.total)}</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
