"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/common/loading-state";
import { PackageIcon, AlertCircleIcon, CheckIcon } from "@/components/ui/icons";
import { formatCurrency, formatNumber } from "@/lib/format";
export interface InventorySummary {
  inventoryValue: number;
  totalUnits: number;
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface InventorySummaryCardProps {
  inventory?: InventorySummary;
  isLoading?: boolean;
}

export function InventorySummaryCard({
  inventory,
  isLoading = false
}: InventorySummaryCardProps) {
  if (isLoading || !inventory) {
    return (
      <Card>
        <CardHeader>
          <div className="h-4 w-36 bg-slate-200/80 rounded anim-pulse" />
          <div className="h-3 w-56 bg-slate-200/80 rounded anim-pulse mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" rounded="lg" />
          <Skeleton className="h-20 w-full" rounded="lg" />
        </CardContent>
      </Card>
    );
  }

  const isHealthy = inventory.lowStockCount === 0 && inventory.outOfStockCount === 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
            Inventory Health & Valuation
          </CardTitle>
          <CardDescription>
            Multi-store warehouse and retail shelf stock valuation.
          </CardDescription>
        </div>
        <Badge variant={isHealthy ? "success" : "warning"}>
          {isHealthy ? (
            <>
              <CheckIcon className="w-3 h-3 mr-1" /> Stock Healthy
            </>
          ) : (
            <>
              <AlertCircleIcon className="w-3 h-3 mr-1" /> Attention Needed
            </>
          )}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Valuation & Volume Highlight */}
        <div className="p-4 rounded-xl bg-surface-subtle border border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Stock Valuation (Cost)
            </span>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 tabular-nums mt-0.5">
              {formatCurrency(inventory.inventoryValue)}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Units On Hand
            </span>
            <div className="text-base sm:text-lg font-bold text-slate-800 tabular-nums mt-0.5">
              {formatNumber(inventory.totalUnits)} <span className="text-xs font-normal text-slate-500">units</span>
            </div>
          </div>
        </div>

        {/* Stock Status Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Active SKUs */}
          <div className="p-3 rounded-lg border border-border bg-surface">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <PackageIcon className="w-3.5 h-3.5 text-brand-primary" />
              <span>Catalog SKUs</span>
            </div>
            <div className="text-base font-bold text-slate-900 tabular-nums mt-1">
              {formatNumber(inventory.totalProducts)}
            </div>
          </div>

          {/* Low Stock Items */}
          <div className="p-3 rounded-lg border border-amber-200/80 bg-amber-50/40">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-semantic-warning" />
              <span>Low Stock</span>
            </div>
            <div className="text-base font-bold text-amber-900 tabular-nums mt-1">
              {formatNumber(inventory.lowStockCount)}
            </div>
          </div>

          {/* Out of Stock Items */}
          <div className="p-3 rounded-lg border border-rose-200/80 bg-rose-50/40 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-rose-800 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-semantic-danger" />
              <span>Out of Stock</span>
            </div>
            <div className="text-base font-bold text-rose-900 tabular-nums mt-1">
              {formatNumber(inventory.outOfStockCount)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
