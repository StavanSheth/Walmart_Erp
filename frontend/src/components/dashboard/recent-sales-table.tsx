"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveTable, type Column } from "@/components/common/responsive-table";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { RecentSale } from "@/types/dashboard";

export interface RecentSalesTableProps {
  sales?: RecentSale[];
  isLoading?: boolean;
}

export function RecentSalesTable({ sales = [], isLoading = false }: RecentSalesTableProps) {
  const columns: Column<RecentSale>[] = [
    {
      key: "orderNumber",
      header: "Order #",
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-brand-navy">
          {item.orderNumber}
        </span>
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
        <span className="text-xs text-slate-600 truncate max-w-[140px] inline-block">
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
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
          Recent POS & Omnichannel Sales
        </CardTitle>
        <CardDescription>
          Latest sales transactions recorded across the retail network.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveTable
          data={sales}
          columns={columns}
          keyExtractor={(item) => item.orderId}
          isLoading={isLoading}
          mobileView="card"
          density="compact"
          emptyTitle="No recent sales"
          emptyDescription="There are no recorded sales orders matching this filter."
          renderMobileCard={(item) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-brand-navy">
                  {item.orderNumber}
                </span>
                <StatusBadge status={item.status} size="sm" />
              </div>
              <div className="text-xs text-slate-600">
                <p className="font-medium text-slate-800">{item.customerName}</p>
                <p className="text-slate-400 text-[11px]">{item.storeName}</p>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
                <span className="text-[11px] text-slate-400 tabular-nums">
                  {formatDate(item.createdAt)}
                </span>
                <span className="font-bold text-slate-900 tabular-nums text-sm">
                  {formatCurrency(item.total)}
                </span>
              </div>
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}
