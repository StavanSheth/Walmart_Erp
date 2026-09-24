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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { formatCurrency, formatShortDate, formatNumber } from "@/lib/format";
import type { SalesTrendPoint } from "@/types/dashboard";

export interface SalesOverviewChartProps {
  salesTrend?: SalesTrendPoint[];
  isLoading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: SalesTrendPoint;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-border bg-surface p-3 shadow-md text-xs space-y-1 z-50">
        <p className="font-semibold text-slate-800">{formatShortDate(label || data.date)}</p>
        <p className="text-brand-primary font-medium">
          Sales: <span className="font-bold tabular-nums">{formatCurrency(data.sales)}</span>
        </p>
        <p className="text-slate-500">
          Orders: <span className="tabular-nums font-medium">{formatNumber(data.orders)}</span>
        </p>
      </div>
    );
  }
  return null;
}

export function SalesOverviewChart({ salesTrend, isLoading = false }: SalesOverviewChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-4 w-40 bg-slate-200/80 rounded anim-pulse" />
          <div className="h-3 w-64 bg-slate-200/80 rounded anim-pulse mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full" rounded="lg" />
        </CardContent>
      </Card>
    );
  }

  const hasData = salesTrend && salesTrend.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
            Sales Revenue Trend
          </CardTitle>
          <CardDescription>
            Daily completed sales and order volume over time.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <EmptyState
            title="No sales recorded"
            description="No completed orders found for the selected store or date range."
            className="py-12"
          />
        ) : (
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesTrend}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0071DC" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0071DC" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => formatShortDate(val)}
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#E2E8F0" }}
                />
                <YAxis
                  tickFormatter={(val) => formatCurrency(val, true)}
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={55}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#0071DC"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#salesGradient)"
                  activeDot={{ r: 5, fill: "#0071DC", stroke: "#FFFFFF", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
