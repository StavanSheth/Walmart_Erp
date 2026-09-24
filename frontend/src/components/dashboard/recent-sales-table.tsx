"use client";

import * as React from "react";
import { ResponsiveTable, type Column } from "@/components/common/responsive-table";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { RecentTransactionItem } from "@/types/dashboard";
import Link from "next/link";

export interface RecentSalesTableProps {
  transactions?: RecentTransactionItem[];
  isLoading?: boolean;
}

export function RecentSalesTable({ transactions = [], isLoading = false }: RecentSalesTableProps) {
  const displayItems = transactions.slice(0, 5);

  const columns: Column<RecentTransactionItem>[] = [
    {
      key: "productName",
      header: "Product / Order",
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50/80 border border-blue-100/70 flex items-center justify-center shrink-0 text-blue-600 font-bold text-[10px]">
            {item.productName ? item.productName.slice(0, 2).toUpperCase() : "PO"}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-xs sm:text-sm">
              {item.productName || item.orderNumber}
            </p>
            <p className="font-mono text-[10px] text-slate-400">
              {item.orderNumber}
            </p>
          </div>
        </div>
      )
    },
    {
      key: "storeName",
      header: "Store",
      render: (item) => (
        <span className="text-xs text-slate-700 font-medium">
          {item.storeName}
        </span>
      )
    },
    {
      key: "customerName",
      header: "Customer",
      render: (item) => (
        <span className="text-xs text-slate-600 truncate max-w-[130px] inline-block">
          {item.customerName}
        </span>
      )
    },
    {
      key: "total",
      header: "Amount",
      align: "right",
      isNumeric: true,
      render: (item) => (
        <span className="font-bold text-slate-900 tabular-nums text-xs sm:text-sm">
          {formatCurrency(item.total)}
        </span>
      )
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (item) => (
        <StatusBadge status={item.status} size="sm" />
      )
    },
    {
      key: "createdAt",
      header: "Date",
      align: "right",
      render: (item) => (
        <span className="text-xs text-slate-500 tabular-nums">
          {formatDate(item.createdAt)}
        </span>
      )
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Recent Transactions
        </h3>
        <Link
          href="/sales"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
        >
          <span>View All</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      <ResponsiveTable
        data={displayItems}
        columns={columns}
        keyExtractor={(item) => item.id || item.orderNumber}
        isLoading={isLoading}
        mobileView="card"
        density="compact"
        emptyTitle="No recent transactions"
        emptyDescription="There are no recorded sales orders matching this filter."
        renderMobileCard={(item) => (
          <div className="flex items-center justify-between gap-3 py-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0 text-blue-700 font-bold text-xs">
                {item.productName ? item.productName.slice(0, 2).toUpperCase() : "TX"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                  {item.productName || item.orderNumber}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {item.storeName}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-[10px] text-slate-400 tabular-nums mb-1">
                {formatDate(item.createdAt)}
              </p>
              <div className="flex items-center justify-end gap-2">
                <span className="font-bold text-slate-900 text-xs sm:text-sm tabular-nums">
                  {formatCurrency(item.total)}
                </span>
                <StatusBadge status={item.status} size="sm" />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
