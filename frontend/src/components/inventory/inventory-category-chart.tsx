"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { CategoryDistribution } from "@/types/inventory";

export interface InventoryCategoryChartProps {
  categories?: CategoryDistribution[];
  totalProducts?: number;
  isLoading?: boolean;
  onCategorySelect?: (categoryId: string) => void;
}

const CATEGORY_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#6366F1", // Indigo
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#8B5CF6", // Purple
  "#64748B"  // Slate
];

export function InventoryCategoryChart({
  categories = [],
  totalProducts = 0,
  isLoading = false,
  onCategorySelect
}: InventoryCategoryChartProps) {
  if (isLoading) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs h-full min-h-[310px] space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-36 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="w-[140px] h-[140px] rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-4/5 rounded" />
            <Skeleton className="h-3 w-3/4 rounded" />
            <Skeleton className="h-3 w-2/3 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between h-full min-h-[310px]">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Inventory by Category
          </h3>
        </div>
        <EmptyState
          title="No categories found"
          description="Category distribution data is currently unavailable."
          className="py-12"
        />
      </div>
    );
  }

  const chartData = categories.map((cat, idx) => ({
    name: cat.categoryName,
    value: cat.value,
    percentage: cat.percentage,
    itemCount: cat.itemCount,
    categoryId: cat.categoryId,
    color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
  }));

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between h-full min-h-[310px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
            Inventory by Category
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onCategorySelect && onCategorySelect("ALL")}
          className="text-xs font-bold text-brand-primary hover:text-blue-700 transition"
        >
          View All →
        </button>
      </div>

      {/* Donut Chart & Legend Container */}
      <div className="flex items-center justify-between gap-3 pt-2 flex-1">
        {/* Left: Donut Chart with Center Label */}
        <div className="relative w-[115px] h-[115px] sm:w-[130px] sm:h-[130px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(val) => [formatCurrency(Number(val ?? 0), true), "Value"]}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="92%"
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Donut Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums leading-tight">
              {formatNumber(totalProducts)}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Products
            </span>
          </div>
        </div>

        {/* Right: Category Legend Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-2 gap-y-0.5 flex-1 w-full overflow-hidden">
          {chartData.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onCategorySelect && onCategorySelect(cat.categoryId)}
              className="flex items-center justify-between text-xs py-0.5 px-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-700 font-semibold truncate text-[11px]" title={cat.name}>
                  {cat.name}
                </span>
              </div>
              <span className="text-slate-900 font-bold tabular-nums shrink-0 ml-1.5 text-xs">
                {cat.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
