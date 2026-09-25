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
      if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
      return `$${val}`;
    }
    if (metric === "units") {
      if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
      return `${val}`;
    }
    return `${val}`;
  };

  const getMetricColor = () => {
    switch (metric) {
      case "value":
        return "#0071CE"; // Walmart True Blue
      case "units":
        return "#10B981"; // Emerald
      case "skus":
        return "#6366F1"; // Indigo
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between h-full min-h-[310px]">
      {/* Header with Title, Metric Switcher & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
              Inventory Overview
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {metric === "value"
                ? "Monthly inventory valuation in USD"
                : metric === "units"
                ? "Physical stock volume distribution"
                : "Active catalog SKU counts"}
            </p>
          </div>
        </div>

        {/* Controls: Metric Switcher Pills + Period Selector */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200/60">
            <button
              type="button"
              onClick={() => setMetric("value")}
              className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-md transition-all",
                metric === "value"
                  ? "bg-brand-primary text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Stock Value
            </button>
            <button
              type="button"
              onClick={() => setMetric("units")}
              className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-md transition-all",
                metric === "units"
                  ? "bg-brand-primary text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Units
            </button>
            <button
              type="button"
              onClick={() => setMetric("skus")}
              className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-md transition-all",
                metric === "skus"
                  ? "bg-brand-primary text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              SKU Count
            </button>
          </div>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodType)}
            className="h-7 px-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer"
          >
            <option value="6m">6 Months</option>
            <option value="1y">1 Year</option>
          </select>
        </div>
      </div>

      {/* Main Content: Bar Chart on left + Clean Metrics Summary on right */}
      <div className="pt-2 flex-1 flex flex-col sm:flex-row items-center justify-between gap-3 relative">
        <div className="h-[210px] w-full flex-1 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={210}>
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
              barSize={period === "1y" ? 18 : 26}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 500 }}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                content={<CustomTooltip metricType={metric} />}
                cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
              />
              <Bar
                dataKey={metric === "value" ? "inventoryValue" : metric === "units" ? "units" : "skuCount"}
                name={metric === "value" ? "Stock Value" : metric === "units" ? "Units" : "SKU Count"}
                fill={getMetricColor()}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Metric Statistics Sidebar */}
        <div className="flex sm:flex-col justify-center gap-3 sm:gap-3.5 shrink-0 sm:border-l sm:border-slate-100 sm:pl-4 text-xs font-semibold text-slate-700 min-w-[130px] w-full sm:w-auto">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex-1 sm:flex-initial">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Current
            </span>
            <span className="text-sm font-black text-slate-900 tabular-nums">
              {metric === "value"
                ? formatCurrency(summaryStats.current, true)
                : metric === "units"
                ? `${formatNumber(summaryStats.current)}`
                : `${summaryStats.current} SKUs`}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex-1 sm:flex-initial">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Average
            </span>
            <span className="text-sm font-black text-slate-900 tabular-nums">
              {metric === "value"
                ? formatCurrency(summaryStats.average, true)
                : metric === "units"
                ? `${formatNumber(summaryStats.average)}`
                : `${summaryStats.average} SKUs`}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex-1 sm:flex-initial">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Peak
            </span>
            <span className="text-sm font-black text-slate-900 tabular-nums">
              {metric === "value"
                ? formatCurrency(summaryStats.peak, true)
                : metric === "units"
                ? `${formatNumber(summaryStats.peak)}`
                : `${summaryStats.peak} SKUs`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
