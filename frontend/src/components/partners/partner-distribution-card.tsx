"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import type { PartnerDistributionItem } from "@/types/partners";
import { cn } from "@/lib/cn";

export interface PartnerDistributionCardProps {
  distribution?: PartnerDistributionItem[];
  totalPartners?: number;
  isLoading?: boolean;
  onSelectCategory?: (categoryName: string) => void;
  className?: string;
}

export function PartnerDistributionCard({
  distribution = [],
  totalPartners = 0,
  isLoading = false,
  onSelectCategory,
  className
}: PartnerDistributionCardProps) {
  if (isLoading) {
    return (
      <div className={cn("p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs h-full flex flex-col justify-between", className)}>
        <Skeleton className="h-5 w-36 rounded mb-4" />
        <div className="flex items-center justify-between gap-4 my-auto">
          <Skeleton className="w-32 h-32 sm:w-36 sm:h-36 rounded-full shrink-0" />
          <div className="space-y-2.5 flex-1">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const total = distribution.reduce((sum, item) => sum + item.value, 0) || totalPartners;

  if (distribution.length === 0 || total === 0) {
    return (
      <div className={cn("p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs h-full flex flex-col", className)}>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Partner Distribution
        </h3>
        <EmptyState
          title="No distribution data"
          description="Partner records will appear here once registered."
          className="my-auto py-6"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs h-full flex flex-col justify-between overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Partner Distribution
        </h3>
      </div>

      <div className="flex items-center justify-between gap-3 sm:gap-5 my-auto py-2">
        {/* Left Side: Donut Chart with Centered Number */}
        <div className="relative w-[130px] h-[130px] sm:w-[145px] sm:h-[145px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="92%"
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {distribution.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onClick={() => onSelectCategory?.(entry.name)}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-tight">
              {total.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
              Total Partners
            </span>
          </div>
        </div>

        {/* Right Side: Legend with Percentages */}
        <div className="flex-1 space-y-2 min-w-0">
          {distribution.map((item) => (
            <div
              key={item.name}
              onClick={() => onSelectCategory?.(item.name)}
              className="flex items-center justify-between text-xs group cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 font-medium truncate group-hover:text-slate-900">
                  {item.name}
                </span>
              </div>
              <span className="font-bold text-slate-800 ml-2 shrink-0">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
