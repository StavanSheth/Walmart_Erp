"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { Skeleton } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import type { PartnerGrowthPoint } from "@/types/partners";
import { cn } from "@/lib/cn";

export interface PartnerGrowthChartProps {
  growth?: PartnerGrowthPoint[];
  period: "6m" | "12m";
  onPeriodChange: (period: "6m" | "12m") => void;
  isLoading?: boolean;
  className?: string;
}

const LINE_CONFIGS = [
  { key: "Retailers", label: "Retailers", color: "#0071DC" },
  { key: "Wholesalers", label: "Wholesalers", color: "#10B981" },
  { key: "Suppliers", label: "Suppliers", color: "#8B5CF6" },
  { key: "Customers", label: "Customers", color: "#F59E0B" }
];

export function PartnerGrowthChart({
  growth = [],
  period = "6m",
  onPeriodChange,
  isLoading = false,
  className
}: PartnerGrowthChartProps) {
  if (isLoading) {
    return (
      <div className={cn("p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs h-full flex flex-col justify-between", className)}>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-7 w-28 rounded-lg" />
        </div>
        <Skeleton className="h-[180px] w-full rounded-xl my-auto" />
        <div className="flex items-center justify-center gap-4 mt-3">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      </div>
    );
  }

  if (growth.length === 0) {
    return (
      <div className={cn("p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs h-full flex flex-col", className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Partner Growth
          </h3>
        </div>
        <EmptyState
          title="No growth history"
          description="Historical trends will be plotted as activity increases."
          className="my-auto py-8"
        />
      </div>
    );
  }

  const formatYAxis = (val: number) => {
    if (val >= 1000) {
      return `${Math.round(val / 1000)}K`;
    }
    return String(val);
  };

  return (
    <div
      className={cn(
        "p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs h-full flex flex-col justify-between overflow-hidden",
        className
      )}
    >
      {/* Header with Title and Period Dropdown */}
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Partner Growth
        </h3>

        {/* Period Selector matching screenshot */}
        <div className="relative inline-flex items-center">
          <select
            aria-label="Growth period"
            value={period}
            onChange={(e) => onPeriodChange(e.target.value as "6m" | "12m")}
            className="h-7 pl-2.5 pr-6 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer transition shadow-2xs"
          >
            <option value="6m">Last 6 Months</option>
            <option value="12m">Last 12 Months</option>
          </select>
          <span className="absolute right-2 pointer-events-none text-slate-400 text-[9px]">
            ▼
          </span>
        </div>
      </div>

      {/* Chart Canvas & Legend */}
      <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 my-auto">
        <div className="h-[175px] sm:h-[185px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: "#E2E8F0" }}
                tick={{ fontSize: 11, fill: "#64748B" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxis}
                tick={{ fontSize: 11, fill: "#64748B" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  border: "none",
                  borderRadius: "10px",
                  color: "#F8FAFC",
                  fontSize: "11px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)"
                }}
                itemStyle={{ color: "#F8FAFC" }}
              />
              {LINE_CONFIGS.map((config) => (
                <Line
                  key={config.key}
                  type="monotone"
                  dataKey={config.key}
                  name={config.label}
                  stroke={config.color}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: config.color, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 1, stroke: "#FFF" }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend on right */}
        <div className="flex sm:flex-col items-center sm:items-start justify-center flex-wrap gap-2.5 sm:pl-1 shrink-0">
          {LINE_CONFIGS.map((config) => (
            <div key={config.key} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-slate-600 font-medium">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
