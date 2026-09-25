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

interface TransformedTrendPoint extends InventoryTrendPoint {
  inStockVal: number;
  lowStockVal: number;
  inTransitVal: number;
  inStockUnits: number;
  lowStockUnits: number;
  inTransitUnits: number;
  inStockSkus: number;
  lowStockSkus: number;
  outOfStockSkus: number;
  inTransitSkus: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload: TransformedTrendPoint;
  }>;
  label?: string;
  metricType: MetricType;
}

function CustomTooltip({ active, payload, label, metricType }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const raw = payload[0].payload;
    let totalDisplay = "";
    if (metricType === "value") {
      totalDisplay = formatCurrency(raw.inventoryValue, true);
    } else if (metricType === "units") {
      totalDisplay = `${formatNumber(raw.units)} units`;
    } else {
      totalDisplay = `${formatNumber(raw.skuCount)} SKUs`;
    }

    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/95 text-white p-2.5 shadow-xl text-xs space-y-1 z-50 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1">
          <span className="font-semibold text-slate-300">{label}</span>
          <span className="font-black text-amber-400 text-xs">{totalDisplay}</span>
        </div>
        <div className="space-y-0.5 pt-0.5 text-[11px]">
          {metricType === "value" && (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  In Stock Value
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {formatCurrency(raw.inStockVal, true)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Low Stock Value
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {formatCurrency(raw.lowStockVal, true)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  In Transit Value
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {formatCurrency(raw.inTransitVal, true)}
                </span>
              </div>
            </>
          )}

          {metricType === "units" && (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  In Stock Units
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {formatNumber(raw.inStockUnits)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Low Stock Units
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {formatNumber(raw.lowStockUnits)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  In Transit Units
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {formatNumber(raw.inTransitUnits)}
                </span>
              </div>
            </>
          )}

          {metricType === "skus" && (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  In Stock SKUs
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {formatNumber(raw.inStockSkus)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Low Stock SKUs
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {formatNumber(raw.lowStockSkus)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Out of Stock SKUs
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {formatNumber(raw.outOfStockSkus)}
                </span>
              </div>
              {raw.inTransitSkus > 0 && (
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    In Transit SKUs
                  </span>
                  <span className="font-semibold text-white tabular-nums">
                    {formatNumber(raw.inTransitSkus)}
                  </span>
                </div>
              )}
            </>
          )}
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

  const chartData = React.useMemo<TransformedTrendPoint[]>(() => {
    if (!trendData || trendData.length === 0) return [];
    const count = period === "1y" ? 12 : 6;
    const sliced = trendData.slice(-count);

    return sliced.map((p) => {
      const totalEval = Math.max(1, p.inStock + p.lowStock + p.outOfStock);
      const inStockRatio = p.inStock / totalEval;
      const lowStockRatio = p.lowStock / totalEval;

      // Stock Value breakdown
      const inStockVal = Math.round(p.inventoryValue * inStockRatio);
      const lowStockVal = Math.round(p.inventoryValue * lowStockRatio);
      const inTransitVal = Math.round((p.inTransit * (p.inventoryValue / Math.max(1, p.units))) || 0);

      // Units breakdown
      const inStockUnits = Math.round(p.units * inStockRatio);
      const lowStockUnits = Math.round(p.units * lowStockRatio);
      const inTransitUnits = p.inTransit;

      // SKUs
      const inStockSkus = p.inStock;
      const lowStockSkus = p.lowStock;
      const outOfStockSkus = p.outOfStock;
      const inTransitSkus = Math.min(15, Math.round(p.inTransit / 60));

      return {
        ...p,
        inStockVal,
        lowStockVal,
        inTransitVal,
        inStockUnits,
        lowStockUnits,
        inTransitUnits,
        inStockSkus,
        lowStockSkus,
        outOfStockSkus,
        inTransitSkus
      };
    });
  }, [trendData, period]);

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
                : "Active catalog SKU status counts"}
            </p>
          </div>
        </div>

        {/* Controls: Metric Pills + Period Dropdown */}
        <div className="flex items-center gap-2">
          {/* Metric Toggle Pills */}
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

          {/* Period Selector: 6 Months & 1 Year ONLY */}
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

      {/* Main Content: Chart on left + Vertical Legend on right */}
      <div className="pt-2 flex-1 flex flex-col sm:flex-row items-center justify-between gap-3 relative">
        {/* Chart Canvas */}
        <div className="h-[210px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
              barSize={period === "1y" ? 16 : 24}
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

              {/* Dynamic Stacked bars responding to active metric */}
              {metric === "value" && (
                <>
                  <Bar dataKey="inStockVal" name="In Stock Value" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="lowStockVal" name="Low Stock Value" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="inTransitVal" name="In Transit Value" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </>
              )}

              {metric === "units" && (
                <>
                  <Bar dataKey="inStockUnits" name="In Stock Units" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="lowStockUnits" name="Low Stock Units" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="inTransitUnits" name="In Transit Units" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </>
              )}

              {metric === "skus" && (
                <>
                  <Bar dataKey="inStockSkus" name="In Stock SKUs" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="lowStockSkus" name="Low Stock SKUs" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="outOfStockSkus" name="Out of Stock SKUs" stackId="a" fill="#EF4444" />
                  <Bar dataKey="inTransitSkus" name="In Transit SKUs" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Vertical Legend on the right side */}
        <div className="flex sm:flex-col justify-center gap-2 sm:gap-2.5 shrink-0 sm:border-l sm:border-slate-100 sm:pl-4 text-xs font-semibold text-slate-700 min-w-[125px]">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            {metric === "value" ? "In Stock Value" : metric === "units" ? "In Stock Units" : "In Stock SKUs"}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            {metric === "value" ? "Low Stock Value" : metric === "units" ? "Low Stock Units" : "Low Stock SKUs"}
          </span>
          {metric === "skus" && (
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              Out of Stock
            </span>
          )}
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
            {metric === "value" ? "In Transit Value" : metric === "units" ? "In Transit Units" : "In Transit"}
          </span>
        </div>
      </div>
    </div>
  );
}
