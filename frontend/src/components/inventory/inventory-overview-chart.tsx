"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { Skeleton } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { formatCurrency, formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ReportsIcon } from "@/components/ui/icons";
import type { InventoryTrendPoint } from "@/types/inventory";

export interface InventoryOverviewChartProps {
  trendData?: InventoryTrendPoint[];
  isLoading?: boolean;
}

type MetricType = "value" | "units" | "skus";
type PeriodType = "6m" | "1y";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload: InventoryTrendPoint;
  }>;
  label?: string;
  metricType: MetricType;
}

function CustomTooltip({ active, payload, label, metricType }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const raw = payload[0].payload;
    let headline = "";
    if (metricType === "value") {
      headline = formatCurrency(raw.inventoryValue, true);
    } else if (metricType === "units") {
      headline = `${formatNumber(raw.units)} units`;
    } else {
      headline = `${formatNumber(raw.skuCount)} SKUs`;
    }

    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/95 text-white p-2.5 shadow-xl text-xs space-y-1.5 z-50 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1">
          <span className="font-semibold text-slate-300">{label}</span>
          <span className="font-black text-amber-400 text-xs">{headline}</span>
        </div>
        <div className="space-y-1 pt-0.5 text-[11px]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400">Inventory Valuation:</span>
            <span className="font-semibold text-white tabular-nums">
              {formatCurrency(raw.inventoryValue, true)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400">Physical Volume:</span>
            <span className="font-semibold text-white tabular-nums">
              {formatNumber(raw.units)} units
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400">Catalog SKUs:</span>
            <span className="font-semibold text-white tabular-nums">
              {formatNumber(raw.skuCount)} items
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function InventoryOverviewChart({
  trendData = [],
  isLoading = false
}: InventoryOverviewChartProps) {
  const [metric, setMetric] = React.useState<MetricType>("value");
  const [period, setPeriod] = React.useState<PeriodType>("6m");

  const chartData = React.useMemo(() => {
    if (!trendData || trendData.length === 0) return [];
    const count = period === "1y" ? 12 : 6;
    return trendData.slice(-count);
  }, [trendData, period]);

  const summaryStats = React.useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return { average: 0, peak: 0, current: 0 };
    }
    const values = chartData.map((d) =>
      metric === "value" ? d.inventoryValue : metric === "units" ? d.units : d.skuCount
    );
    const sum = values.reduce((a, b) => a + b, 0);
    const average = Math.round(sum / values.length);
    const peak = Math.max(...values);
    const current = values[values.length - 1] ?? 0;
    return { average, peak, current };
  }, [chartData, metric]);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 h-full min-h-[310px]">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-36 rounded" />
          <Skeleton className="h-8 w-44 rounded-full" />
        </div>
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>
    );
  }

  if (!trendData || trendData.length === 0) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between h-full min-h-[310px]">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Inventory Overview
          </h3>
        </div>
        <EmptyState
          title="No inventory trend"
          description="Insufficient historical movement data available."
          className="py-12"
        />
      </div>
    );
  }

  const formatYAxis = (val: number) => {
    if (metric === "value") {
      return formatCurrency(val, true);
    }
    if (metric === "units") {
      if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
      return `${val}`;
    }
    return `${val}`;
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between h-full min-h-[310px]">
      {/* Chart Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
              <ReportsIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
              Inventory Overview
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Historical Movement & Volume</span>
        </div>

        {/* Controls: Metric pills & Period buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Metric Selector Pills */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200/60">
            <button
              type="button"
              onClick={() => setMetric("value")}
              className={cn(
                "px-2 py-0.5 text-[10px] font-bold rounded-md transition",
                metric === "value"
                  ? "bg-brand-primary text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Valuation
            </button>
            <button
              type="button"
              onClick={() => setMetric("units")}
              className={cn(
                "px-2 py-0.5 text-[10px] font-bold rounded-md transition",
                metric === "units"
                  ? "bg-brand-primary text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Units
            </button>
            <button
              type="button"
              onClick={() => setMetric("skus")}
              className={cn(
                "px-2 py-0.5 text-[10px] font-bold rounded-md transition",
                metric === "skus"
                  ? "bg-brand-primary text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              SKUs
            </button>
          </div>

          {/* Period Range Toggle */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200/60">
            <button
              type="button"
              onClick={() => setPeriod("6m")}
              className={cn(
                "px-2 py-0.5 text-[10px] font-bold rounded-md transition",
                period === "6m"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              6M
            </button>
            <button
              type="button"
              onClick={() => setPeriod("1y")}
              className={cn(
                "px-2 py-0.5 text-[10px] font-bold rounded-md transition",
                period === "1y"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              1Y
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="h-[180px] sm:h-[195px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            barSize={period === "1y" ? 14 : 26}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748B", fontWeight: 600 }}
              dy={4}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748B", fontWeight: 500 }}
              tickFormatter={formatYAxis}
              dx={-4}
            />
            <Tooltip
              content={<CustomTooltip metricType={metric} />}
              cursor={{ fill: "#F8FAFC" }}
            />
            <Bar
              dataKey={
                metric === "value"
                  ? "inventoryValue"
                  : metric === "units"
                  ? "units"
                  : "skuCount"
              }
              fill="#0071DC"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Micro Metrics Strip */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-100 text-center">
        <div className="p-1 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-[10px] font-semibold text-slate-400 block leading-tight">
            Current
          </span>
          <span className="text-xs font-bold text-slate-800 tabular-nums">
            {metric === "value"
              ? formatCurrency(summaryStats.current, true)
              : metric === "units"
              ? formatNumber(summaryStats.current)
              : `${summaryStats.current} SKUs`}
          </span>
        </div>
        <div className="p-1 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-[10px] font-semibold text-slate-400 block leading-tight">
            Average
          </span>
          <span className="text-xs font-bold text-slate-800 tabular-nums">
            {metric === "value"
              ? formatCurrency(summaryStats.average, true)
              : metric === "units"
              ? formatNumber(summaryStats.average)
              : `${summaryStats.average} SKUs`}
          </span>
        </div>
        <div className="p-1 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-[10px] font-semibold text-slate-400 block leading-tight">
            Peak
          </span>
          <span className="text-xs font-bold text-emerald-600 tabular-nums">
            {metric === "value"
              ? formatCurrency(summaryStats.peak, true)
              : metric === "units"
              ? formatNumber(summaryStats.peak)
              : `${summaryStats.peak} SKUs`}
          </span>
        </div>
      </div>
    </div>
  );
}
