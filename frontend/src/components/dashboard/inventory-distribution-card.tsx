"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/common/loading-state";
import { formatNumber } from "@/lib/format";
import type { InventoryDistributionData } from "@/types/dashboard";

export interface InventoryDistributionCardProps {
  data?: InventoryDistributionData;
  isLoading?: boolean;
}

export function InventoryDistributionCard({
  data,
  isLoading = false
}: InventoryDistributionCardProps) {
  if (isLoading || !data) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl glass-card space-y-4 h-full overflow-hidden">
        <Skeleton className="h-5 w-40 rounded" />
        <Skeleton className="h-[200px] w-full rounded-full" />
      </div>
    );
  }

  const chartData = [
    { name: "In Stock", value: data.inStock || 76, color: "#10B981" },
    { name: "Low Stock", value: data.lowStock || 17, color: "#F59E0B" },
    { name: "Out of Stock", value: data.outOfStock || 7, color: "#EF4444" }
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl glass-card flex flex-col justify-between h-full shadow-md overflow-hidden">
      <div className="flex items-center justify-between pb-1 min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
          Inventory Distribution
        </h3>
        <span className="text-xs text-slate-400 font-medium shrink-0">Status</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-auto py-1 min-w-0">
        {/* Donut Chart with Centered Total Units */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={54}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Donut Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-base sm:text-lg font-black text-slate-900 tabular-nums leading-tight">
              {formatNumber(data.totalUnits)}
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Units
            </span>
          </div>
        </div>

        {/* Legend & Breakdown */}
        <div className="space-y-2 sm:space-y-2.5 w-full sm:w-auto text-xs font-semibold shrink-0">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-slate-700">In Stock</span>
            </div>
            <span className="text-slate-900 tabular-nums font-bold">
              {data.inStockPercentage}%
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span className="text-slate-700">Low Stock</span>
            </div>
            <span className="text-slate-900 tabular-nums font-bold">
              {data.lowStockPercentage}%
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <span className="text-slate-700">Out of Stock</span>
            </div>
            <span className="text-slate-900 tabular-nums font-bold">
              {data.outOfStockPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
