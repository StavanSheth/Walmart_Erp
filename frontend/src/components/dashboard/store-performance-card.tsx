"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveTable, type Column } from "@/components/common/responsive-table";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { StorePerformance } from "@/types/dashboard";

export interface StorePerformanceCardProps {
  stores?: StorePerformance[];
  isLoading?: boolean;
}

export function StorePerformanceCard({ stores = [], isLoading = false }: StorePerformanceCardProps) {
  const columns: Column<StorePerformance>[] = [
    {
      key: "storeName",
      header: "Store Outlet",
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-900 text-xs sm:text-sm">
            {item.storeName}
          </span>
        </div>
      )
    },
    {
      key: "sales",
      header: "Net Revenue",
      align: "right",
      isNumeric: true,
      render: (item) => (
        <span className="font-bold text-slate-900 tabular-nums text-xs sm:text-sm">
          {formatCurrency(item.sales)}
        </span>
      )
    },
    {
      key: "orders",
      header: "Orders",
      align: "right",
      isNumeric: true,
      render: (item) => (
        <span className="tabular-nums text-slate-600 text-xs sm:text-sm font-medium">
          {formatNumber(item.orders)}
        </span>
      )
    },
    {
      key: "averageOrderValue",
      header: "Avg Order Value",
      align: "right",
      isNumeric: true,
      render: (item) => (
        <span className="tabular-nums text-slate-600 text-xs sm:text-sm">
          {formatCurrency(item.averageOrderValue)}
        </span>
      )
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
          Store Performance Breakdown
        </CardTitle>
        <CardDescription>
          Sales volume and ticket sizes ranked across operational outlets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveTable
          data={stores}
          columns={columns}
          keyExtractor={(item) => item.storeId}
          isLoading={isLoading}
          mobileView="card"
          density="compact"
          emptyTitle="No store sales found"
          emptyDescription="There are no completed sales recorded for stores under this filter."
          renderMobileCard={(item) => (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                  {item.storeName}
                </p>
                <p className="text-[11px] text-slate-500">
                  {formatNumber(item.orders)} orders • AOV {formatCurrency(item.averageOrderValue)}
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 text-xs sm:text-sm tabular-nums">
                  {formatCurrency(item.sales)}
                </span>
              </div>
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}
