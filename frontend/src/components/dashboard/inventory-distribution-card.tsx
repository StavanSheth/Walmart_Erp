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
        <Skeleton className="h-[180px] w-[180px] mx-auto rounded-full" />
      </div>
    );
  }

  const chartData = [
    { name: "In Stock", value: data.inStock || 76, color: "#10B981" },
    { name: "Low Stock", value: data.lowStock || 17, color: "#F59E0B" },
    { name: "Out of Stock", value: data.outOfStock || 7, color: "#EF4444" }
  ];

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl glass-card flex flex-col justify-between h-full shadow-md overflow-hidden">
      <div className="flex items-center justify-between pb-1 min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
          Inventory Distribution
        </h3>
        <span className="text-xs text-slate-400 font-medium shrink-0">Status</span>
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-5 lg:gap-6 my-auto py-1 min-w-0 w-full">
        {/* Donut Chart with Centered Total Units - Seamless joint ring, sized to balance with legend */}
        <div className="relative w-[165px] h-[165px] sm:w-[175px] sm:h-[175px] lg:w-[170px] lg:h-[170px] xl:w-[185px] xl:h-[185px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={84}
                paddingAngle={0}
                dataKey="value"
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Donut Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tabular-nums leading-tight tracking-tight">
              {formatNumber(data.totalUnits)}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Total Units
            </span>
          </div>
        </div>

        {/* Legend & Breakdown - Clean tabular alignment preventing overflow */}
        <div className="space-y-2 sm:space-y-2.5 w-auto min-w-[125px] sm:min-w-[135px] text-xs sm:text-sm font-semibold shrink-0">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-2xs" />
              <span className="text-slate-700 whitespace-nowrap">In Stock</span>
            </div>
            <span className="w-9 sm:w-10 text-right text-slate-900 tabular-nums font-bold shrink-0">
              {data.inStockPercentage}%
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 shadow-2xs" />
              <span className="text-slate-700 whitespace-nowrap">Low Stock</span>
            </div>
            <span className="w-9 sm:w-10 text-right text-slate-900 tabular-nums font-bold shrink-0">
              {data.lowStockPercentage}%
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 shadow-2xs" />
              <span className="text-slate-700 whitespace-nowrap">Out of Stock</span>
            </div>
            <span className="w-9 sm:w-10 text-right text-slate-900 tabular-nums font-bold shrink-0">
              {data.outOfStockPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
