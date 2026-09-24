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
    <div className="p-3.5 sm:p-4 rounded-2xl glass-card flex flex-col justify-between h-full shadow-md overflow-hidden">
      <div className="flex items-center justify-between pb-1 min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
          Inventory Distribution
        </h3>
        <span className="text-xs text-slate-400 font-medium shrink-0">Status</span>
      </div>

      <div className="flex items-center justify-around gap-4 sm:gap-8 my-auto py-2 min-w-0 w-full">
        {/* Donut Chart with Centered Total Units - Seamless joint ring (paddingAngle=0), widespread to fit card */}
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 md:w-44 md:h-44 lg:w-48 lg:h-48 xl:w-52 xl:h-52 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={80}
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

        {/* Legend & Breakdown */}
        <div className="space-y-3 sm:space-y-3.5 w-auto text-xs sm:text-sm font-semibold shrink-0 pr-1">
          <div className="flex items-center justify-between gap-5 sm:gap-8">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 shadow-2xs" />
              <span className="text-slate-700">In Stock</span>
            </div>
            <span className="text-slate-900 tabular-nums font-bold">
              {data.inStockPercentage}%
            </span>
          </div>

          <div className="flex items-center justify-between gap-5 sm:gap-8">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0 shadow-2xs" />
              <span className="text-slate-700">Low Stock</span>
            </div>
            <span className="text-slate-900 tabular-nums font-bold">
              {data.lowStockPercentage}%
            </span>
          </div>

          <div className="flex items-center justify-between gap-5 sm:gap-8">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0 shadow-2xs" />
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
