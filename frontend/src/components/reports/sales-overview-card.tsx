"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import {
  ChevronDownIcon,
  TrendingUpIcon,
  RupeeCurrencyIcon,
  CartIcon,
  StoreNavIcon,
  InventoryIcon,
  BarChartIcon
} from "@/components/ui/icons";
import type { ReportOverviewKpis, SalesTrendSeries, SalesTrendDataPoint } from "@/types/reports";
import { formatCurrency } from "@/lib/format";

export interface SalesOverviewCardProps {
  kpis?: ReportOverviewKpis;
  salesTrend?: SalesTrendSeries;
  period?: string;
  onPeriodChange?: (period: string) => void;
  isLoading?: boolean;
}

export function SalesOverviewCard({
  kpis,
  salesTrend,
  period = "30d",
  onPeriodChange,
  isLoading
}: SalesOverviewCardProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  // SVG dimensions for trend chart
  const width = 640;
  const height = 140;
  const paddingLeft = 46;
  const paddingRight = 16;
  const paddingTop = 12;
  const paddingBottom = 24;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const dates = salesTrend?.dates || [];
  const points = salesTrend?.points || [];
  const yMax = salesTrend?.yAxisMax || 1;

  // Coordinate mapper
  const getX = (index: number) => {
    if (dates.length <= 1) return paddingLeft;
    return paddingLeft + (index / (dates.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(0, Math.min(val, yMax));
    return paddingTop + chartHeight - (clamped / yMax) * chartHeight;
  };

  // Build SVG path strings with cubic bezier curves
  const createSmoothPath = (values: number[]) => {
    if (!values || values.length === 0) return "";
    const pts = values.map((v, i) => ({ x: getX(i), y: getY(v) }));
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const createAreaPath = (values: number[]) => {
    if (!values || values.length === 0) return "";
    const linePath = createSmoothPath(values);
    if (!linePath) return "";
    const lastX = getX(values.length - 1);
    const firstX = getX(0);
    const bottomY = paddingTop + chartHeight;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const onlineValues = salesTrend?.onlineSales || [];
  const inStoreValues = salesTrend?.inStoreSales || [];
  const wholesaleValues = salesTrend?.wholesaleSales || [];

  const onlineLine = createSmoothPath(onlineValues);
  const onlineArea = createAreaPath(onlineValues);

  const inStoreLine = createSmoothPath(inStoreValues);
  const inStoreArea = createAreaPath(inStoreValues);

  const wholesaleLine = createSmoothPath(wholesaleValues);
  const wholesaleArea = createAreaPath(wholesaleValues);

  const hoveredPoint: SalesTrendDataPoint | undefined = hoveredIndex !== null ? points[hoveredIndex] : undefined;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-4 sm:p-5 flex flex-col justify-between space-y-4">
      {/* Header with Title and Period Dropdown */}
      <div className="flex items-center justify-between gap-3 pb-1 border-b border-slate-100/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0071DC] to-[#0050B3] flex items-center justify-center text-white shadow-sm shadow-blue-500/25">
            <BarChartIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
              Sales Overview Report
            </h2>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
              Omnichannel revenue performance & trends
            </p>
          </div>
        </div>

        {/* Period Selector Dropdown */}
        <div className="relative">
          <select
            value={period}
            onChange={(e) => onPeriodChange?.(e.target.value)}
            className="h-8 pl-3 pr-7 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0071DC] transition cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="ytd">Year to Date</option>
          </select>
          <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 5 KPI Mini Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
        {/* 1. Total Sales */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-blue-50/70 via-blue-50/30 to-white border border-blue-200/80 hover:border-blue-400 hover:shadow-md transition-all duration-200 group flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block leading-tight">
              Total Sales
            </span>
            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <RupeeCurrencyIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          {isLoading || !kpis ? (
            <div className="h-5 w-16 bg-blue-100/60 rounded animate-pulse my-0.5" />
          ) : (
            <div className="text-sm sm:text-base lg:text-[17px] font-extrabold text-slate-900 tracking-tight leading-tight">
              {kpis.totalSales.formattedValue}
            </div>
          )}
          <div className="flex items-center justify-between gap-1">
            {isLoading || !kpis ? (
              <div className="h-3 w-10 bg-slate-100 rounded animate-pulse" />
            ) : (
              <div className="inline-flex items-center gap-0.5 text-[9.5px] text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-full font-bold leading-none">
                <TrendingUpIcon className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                <span>+{kpis.totalSales.changePercent}%</span>
              </div>
            )}
            <span className="text-[8.5px] text-slate-400 font-medium leading-none">vs prev</span>
          </div>
        </div>

        {/* 2. Total Orders */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-emerald-50/70 via-emerald-50/30 to-white border border-emerald-200/80 hover:border-emerald-400 hover:shadow-md transition-all duration-200 group flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block leading-tight">
              Orders
            </span>
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <CartIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          {isLoading || !kpis ? (
            <div className="h-5 w-14 bg-emerald-100/60 rounded animate-pulse my-0.5" />
          ) : (
            <div className="text-sm sm:text-base lg:text-[17px] font-extrabold text-slate-900 tracking-tight leading-tight">
              {kpis.totalOrders.formattedValue}
            </div>
          )}
          <div className="flex items-center justify-between gap-1">
            {isLoading || !kpis ? (
              <div className="h-3 w-10 bg-slate-100 rounded animate-pulse" />
            ) : (
              <div className="inline-flex items-center gap-0.5 text-[9.5px] text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-full font-bold leading-none">
                <TrendingUpIcon className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                <span>+{kpis.totalOrders.changePercent}%</span>
              </div>
            )}
            <span className="text-[8.5px] text-slate-400 font-medium leading-none">volume</span>
          </div>
        </div>

        {/* 3. Avg. Order Value */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-purple-50/70 via-purple-50/30 to-white border border-purple-200/80 hover:border-purple-400 hover:shadow-md transition-all duration-200 group flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block leading-tight">
              Avg Order
            </span>
            <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <TrendingUpIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          {isLoading || !kpis ? (
            <div className="h-5 w-16 bg-purple-100/60 rounded animate-pulse my-0.5" />
          ) : (
            <div className="text-sm sm:text-base lg:text-[17px] font-extrabold text-slate-900 tracking-tight leading-tight">
              {kpis.avgOrderValue.formattedValue}
            </div>
          )}
          <div className="flex items-center justify-between gap-1">
            {isLoading || !kpis ? (
              <div className="h-3 w-10 bg-slate-100 rounded animate-pulse" />
            ) : (
              <div className="inline-flex items-center gap-0.5 text-[9.5px] text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-full font-bold leading-none">
                <TrendingUpIcon className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                <span>+{kpis.avgOrderValue.changePercent}%</span>
              </div>
            )}
            <span className="text-[8.5px] text-slate-400 font-medium leading-none">basket</span>
          </div>
        </div>

        {/* 4. Active Stores */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-cyan-50/70 via-cyan-50/30 to-white border border-cyan-200/80 hover:border-cyan-400 hover:shadow-md transition-all duration-200 group flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-cyan-900 uppercase tracking-wider block leading-tight">
              Stores
            </span>
            <div className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <StoreNavIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          {isLoading || !kpis ? (
            <div className="h-5 w-12 bg-cyan-100/60 rounded animate-pulse my-0.5" />
          ) : (
            <div className="text-sm sm:text-base lg:text-[17px] font-extrabold text-slate-900 tracking-tight leading-tight">
              {kpis.totalStores.formattedValue}
            </div>
          )}
          <div className="flex items-center justify-between gap-1">
            <div className="inline-flex items-center gap-1 text-[9.5px] text-cyan-800 bg-cyan-50 border border-cyan-200/60 px-1.5 py-0.5 rounded-full font-semibold leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span>Active</span>
            </div>
            <span className="text-[8.5px] text-slate-400 font-medium leading-none">network</span>
          </div>
        </div>

        {/* 5. Products Sold */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-amber-50/70 via-amber-50/30 to-white border border-amber-200/80 hover:border-amber-400 hover:shadow-md transition-all duration-200 group flex flex-col justify-between space-y-1.5 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block leading-tight">
              Units Sold
            </span>
            <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <InventoryIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          {isLoading || !kpis ? (
            <div className="h-5 w-16 bg-amber-100/60 rounded animate-pulse my-0.5" />
          ) : (
            <div className="text-sm sm:text-base lg:text-[17px] font-extrabold text-slate-900 tracking-tight leading-tight">
              {kpis.productsSold.formattedValue}
            </div>
          )}
          <div className="flex items-center justify-between gap-1">
            {isLoading || !kpis ? (
              <div className="h-3 w-10 bg-slate-100 rounded animate-pulse" />
            ) : (
              <div className="inline-flex items-center gap-0.5 text-[9.5px] text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-full font-bold leading-none">
                <TrendingUpIcon className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                <span>+{kpis.productsSold.changePercent}%</span>
              </div>
            )}
            <span className="text-[8.5px] text-slate-400 font-medium leading-none">units</span>
          </div>
        </div>
      </div>

      {/* Multi-line Area Chart Section */}
      <div className="space-y-2 pt-1">
        {/* Legend */}
        <div className="flex items-center justify-end gap-4 text-[11px] text-slate-600 font-medium pr-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0071DC]" />
            <span>Online Sales</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span>In-Store Sales</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
            <span>Wholesale Sales</span>
          </div>
        </div>

        {/* SVG Chart Container */}
        <div className="relative w-full h-[145px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="blueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0071DC" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#0071DC" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="greenAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.33, 0.66, 1].map((pct, i) => {
              const y = paddingTop + chartHeight * (1 - pct);
              const labelVal = pct === 0 ? "$0" : pct === 0.33 ? "$50K" : pct === 0.66 ? "$100K" : "$150K";
              return (
                <g key={i}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeDasharray={pct === 0 ? "none" : "3 3"}
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 6}
                    y={y + 3.5}
                    textAnchor="end"
                    className="text-[9px] fill-slate-400 font-mono"
                  >
                    {labelVal}
                  </text>
                </g>
              );
            })}

            {/* Areas */}
            <path d={onlineArea} fill="url(#blueAreaGrad)" />
            <path d={inStoreArea} fill="url(#greenAreaGrad)" />
            <path d={wholesaleArea} fill="url(#purpleAreaGrad)" />

            {/* Lines */}
            <path
              d={wholesaleLine}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={inStoreLine}
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={onlineLine}
              fill="none"
              stroke="#0071DC"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* X-axis labels and interaction points */}
            {dates.map((date, i) => {
              const x = getX(i);
              const isHovered = hoveredIndex === i;
              return (
                <g key={i}>
                  <text
                    x={x}
                    y={height - 6}
                    textAnchor="middle"
                    className={cn(
                      "text-[10px] font-medium transition-colors",
                      isHovered ? "fill-slate-900 font-bold" : "fill-slate-500"
                    )}
                  >
                    {date}
                  </text>

                  {/* Vertical hover guide */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={paddingTop}
                      x2={x}
                      y2={paddingTop + chartHeight}
                      stroke="#94A3B8"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                  )}

                  {/* Dots for online, in-store, wholesale */}
                  <circle
                    cx={x}
                    cy={getY(onlineValues[i] || 0)}
                    r={isHovered ? 4.5 : 2.5}
                    className="fill-white stroke-[#0071DC] stroke-[2] transition-all cursor-pointer"
                  />
                  <circle
                    cx={x}
                    cy={getY(inStoreValues[i] || 0)}
                    r={isHovered ? 4 : 2}
                    className="fill-white stroke-[#10B981] stroke-[2] transition-all cursor-pointer"
                  />
                  <circle
                    cx={x}
                    cy={getY(wholesaleValues[i] || 0)}
                    r={isHovered ? 4 : 2}
                    className="fill-white stroke-[#8B5CF6] stroke-[2] transition-all cursor-pointer"
                  />

                  {/* Invisible hit target for hover */}
                  <rect
                    x={x - 20}
                    y={0}
                    width={40}
                    height={height}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Floating Tooltip */}
          {hoveredPoint && hoveredIndex !== null && (
            <div
              className="absolute z-20 pointer-events-none p-2 rounded-lg bg-slate-900/90 text-white text-[10px] shadow-lg backdrop-blur-xs space-y-0.5"
              style={{
                left: `${Math.min(80, Math.max(15, (hoveredIndex / (dates.length - 1)) * 100))}%`,
                top: "10px",
                transform: "translateX(-50%)"
              }}
            >
              <div className="font-bold text-slate-200 border-b border-white/20 pb-0.5">
                {hoveredPoint.label}
              </div>
              <div className="text-blue-300">
                Online: {formatCurrency(hoveredPoint.onlineSales, true)}
              </div>
              <div className="text-emerald-300">
                In-Store: {formatCurrency(hoveredPoint.inStoreSales, true)}
              </div>
              <div className="text-purple-300">
                Wholesale: {formatCurrency(hoveredPoint.wholesaleSales, true)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
