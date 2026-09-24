"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { Skeleton } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { formatCurrency, formatShortDate } from "@/lib/format";
import type { SalesOverviewData } from "@/types/dashboard";

export interface SalesOverviewChartProps {
  data?: SalesOverviewData;
  salesOverview?: SalesOverviewData;
  isLoading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/80 bg-white/95 p-2.5 shadow-lg text-xs space-y-1 z-50 backdrop-blur-md">
        <p className="font-bold text-slate-800">{formatShortDate(label || "")}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-slate-600 capitalize">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-bold text-slate-900 tabular-nums">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function SalesOverviewChart({ data, salesOverview, isLoading = false }: SalesOverviewChartProps) {
  const chartData = salesOverview || data;
  const [selectedRange, setSelectedRange] = React.useState("30d");

  if (isLoading || !chartData) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl glass-card space-y-3 h-full overflow-hidden">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <Skeleton className="h-8 w-44 rounded" />
        <Skeleton className="h-[220px] w-full rounded-xl" />
      </div>
    );
  }

  // Combine sales and purchases into one chart series
  const allPoints = chartData.sales.map((sPoint) => {
    const pPoint = chartData.purchases.find((p) => p.date === sPoint.date);
    return {
      date: sPoint.date,
      sales: sPoint.amount,
      purchases: pPoint?.amount ?? 0
    };
  });

  // Filter points based on selectedRange to prevent crowding
  const combinedPoints =
    selectedRange === "7d"
      ? allPoints.slice(-7)
      : selectedRange === "30d"
        ? allPoints.slice(-30)
        : allPoints;

  const hasData = combinedPoints.length > 0;

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl glass-card flex flex-col justify-between h-full shadow-md overflow-hidden">
      {/* Header with Title & Selector */}
      <div className="flex items-center justify-between pb-1 min-w-0">
        <div className="flex items-center min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
            Sales Overview
          </h3>
        </div>

        <div className="relative inline-flex items-center shrink-0">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="pl-3 pr-6 py-1 text-xs font-semibold rounded-full border border-slate-200/80 bg-white/80 text-slate-700 hover:border-slate-300 focus:outline-none appearance-none cursor-pointer shadow-xs"
          >
            <option value="30d">Last 30 Days</option>
            <option value="7d">Last 7 Days</option>
            <option value="all">All Period</option>
          </select>
          <span className="absolute right-2 pointer-events-none text-slate-400 text-[9px]">▼</span>
        </div>
      </div>

      {/* Main Headline Metric & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 my-1.5 min-w-0">
        <div className="flex items-baseline gap-2.5 min-w-0">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums tracking-tight truncate">
            {formatCurrency(chartData.totalSales)}
          </span>
          <div className="inline-flex items-center gap-1 text-xs shrink-0">
            <span className="font-bold text-emerald-600">↑ {chartData.changePercent}%</span>
            <span className="text-slate-500 font-medium hidden xs:inline">vs. previous period</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0071DC]" />
            <span className="text-slate-700">Sales</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00C4FF]" />
            <span className="text-slate-700">Purchases</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Visualization */}
      {!hasData ? (
        <EmptyState
          title="No sales recorded"
          description="No completed orders found for this timeframe."
          className="py-10"
        />
      ) : (
        <div className="w-full min-w-0 h-[185px] sm:h-[195px] mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combinedPoints} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0071DC" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0071DC" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="purchasesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C4FF" stopOpacity={0.20} />
                  <stop offset="95%" stopColor="#00C4FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(val) => formatShortDate(val)}
                stroke="#94A3B8"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "#E2E8F0" }}
                interval="preserveStartEnd"
                minTickGap={25}
              />
              <YAxis
                tickFormatter={(val) => formatCurrency(val, true)}
                stroke="#94A3B8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Sales Plot (Dark Blue) */}
              <Area
                type="monotone"
                dataKey="sales"
                name="Sales"
                stroke="#0071DC"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#salesGrad)"
                dot={{ r: 2.5, fill: "#0071DC", stroke: "#FFF", strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: "#0071DC", stroke: "#FFF", strokeWidth: 2 }}
              />
              {/* Purchases Plot (Cyan / Turquoise) */}
              <Area
                type="monotone"
                dataKey="purchases"
                name="Purchases"
                stroke="#00C4FF"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#purchasesGrad)"
                dot={{ r: 2.5, fill: "#00C4FF", stroke: "#FFF", strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: "#00C4FF", stroke: "#FFF", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
