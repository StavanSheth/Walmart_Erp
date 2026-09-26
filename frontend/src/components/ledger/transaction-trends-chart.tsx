"use client";

import * as React from "react";
import type { MonthlyTrendData } from "@/types/ledger";
import { ChevronDownIcon } from "@/components/ui/icons";

export type TrendPeriod =
  | "Last 30 Days"
  | "Last 3 Months"
  | "Last 6 Months"
  | "Last 12 Months"
  | "Year to Date"
  | "September 2026"
  | "August 2026"
  | "July 2026"
  | "June 2026"
  | "May 2026"
  | "April 2026";

interface TransactionTrendsChartProps {
  trends?: MonthlyTrendData[];
  className?: string;
  onPeriodChange?: (period: TrendPeriod) => void;
}

const PERIOD_DATA: Record<TrendPeriod, { maxY: number; yTicks: { value: number; label: string }[]; data: MonthlyTrendData[] }> = {
  "Last 6 Months": {
    maxY: 400,
    yTicks: [
      { value: 400, label: "$400M" },
      { value: 300, label: "$300M" },
      { value: 200, label: "$200M" },
      { value: 100, label: "$100M" },
      { value: 0, label: "0" }
    ],
    data: [
      { month: "April 2026", shortMonth: "Apr", debits: 120, credits: 90, debitsFormatted: "$120M", creditsFormatted: "$90M" },
      { month: "May 2026", shortMonth: "May", debits: 210, credits: 140, debitsFormatted: "$210M", creditsFormatted: "$140M" },
      { month: "June 2026", shortMonth: "Jun", debits: 190, credits: 135, debitsFormatted: "$190M", creditsFormatted: "$135M" },
      { month: "July 2026", shortMonth: "Jul", debits: 280, credits: 210, debitsFormatted: "$280M", creditsFormatted: "$210M" },
      { month: "August 2026", shortMonth: "Aug", debits: 350, credits: 270, debitsFormatted: "$350M", creditsFormatted: "$270M" },
      { month: "September 2026", shortMonth: "Sep", debits: 390, credits: 310, debitsFormatted: "$390M", creditsFormatted: "$310M" }
    ]
  },
  "Last 30 Days": {
    maxY: 150,
    yTicks: [
      { value: 150, label: "$150M" },
      { value: 100, label: "$100M" },
      { value: 50, label: "$50M" },
      { value: 0, label: "0" }
    ],
    data: [
      { month: "Sep 1 - Sep 7", shortMonth: "Sep 1-7", debits: 82, credits: 68, debitsFormatted: "$82M", creditsFormatted: "$68M" },
      { month: "Sep 8 - Sep 14", shortMonth: "Sep 8-14", debits: 95, credits: 78, debitsFormatted: "$95M", creditsFormatted: "$78M" },
      { month: "Sep 15 - Sep 21", shortMonth: "Sep 15-21", debits: 112, credits: 94, debitsFormatted: "$112M", creditsFormatted: "$94M" },
      { month: "Sep 22 - Sep 28", shortMonth: "Sep 22-28", debits: 101, credits: 70, debitsFormatted: "$101M", creditsFormatted: "$70M" }
    ]
  },
  "Last 3 Months": {
    maxY: 400,
    yTicks: [
      { value: 400, label: "$400M" },
      { value: 300, label: "$300M" },
      { value: 200, label: "$200M" },
      { value: 100, label: "$100M" },
      { value: 0, label: "0" }
    ],
    data: [
      { month: "July 2026", shortMonth: "Jul", debits: 280, credits: 210, debitsFormatted: "$280M", creditsFormatted: "$210M" },
      { month: "August 2026", shortMonth: "Aug", debits: 350, credits: 270, debitsFormatted: "$350M", creditsFormatted: "$270M" },
      { month: "September 2026", shortMonth: "Sep", debits: 390, credits: 310, debitsFormatted: "$390M", creditsFormatted: "$310M" }
    ]
  },
  "Last 12 Months": {
    maxY: 400,
    yTicks: [
      { value: 400, label: "$400M" },
      { value: 300, label: "$300M" },
      { value: 200, label: "$200M" },
      { value: 100, label: "$100M" },
      { value: 0, label: "0" }
    ],
    data: [
      { month: "October 2025", shortMonth: "Oct", debits: 140, credits: 110, debitsFormatted: "$140M", creditsFormatted: "$110M" },
      { month: "November 2025", shortMonth: "Nov", debits: 180, credits: 150, debitsFormatted: "$180M", creditsFormatted: "$150M" },
      { month: "December 2025", shortMonth: "Dec", debits: 290, credits: 260, debitsFormatted: "$290M", creditsFormatted: "$260M" },
      { month: "January 2026", shortMonth: "Jan", debits: 160, credits: 120, debitsFormatted: "$160M", creditsFormatted: "$120M" },
      { month: "February 2026", shortMonth: "Feb", debits: 175, credits: 130, debitsFormatted: "$175M", creditsFormatted: "$130M" },
      { month: "March 2026", shortMonth: "Mar", debits: 195, credits: 155, debitsFormatted: "$195M", creditsFormatted: "$155M" },
      { month: "April 2026", shortMonth: "Apr", debits: 120, credits: 90, debitsFormatted: "$120M", creditsFormatted: "$90M" },
      { month: "May 2026", shortMonth: "May", debits: 210, credits: 140, debitsFormatted: "$210M", creditsFormatted: "$140M" },
      { month: "June 2026", shortMonth: "Jun", debits: 190, credits: 135, debitsFormatted: "$190M", creditsFormatted: "$135M" },
      { month: "July 2026", shortMonth: "Jul", debits: 280, credits: 210, debitsFormatted: "$280M", creditsFormatted: "$210M" },
      { month: "August 2026", shortMonth: "Aug", debits: 350, credits: 270, debitsFormatted: "$350M", creditsFormatted: "$270M" },
      { month: "September 2026", shortMonth: "Sep", debits: 390, credits: 310, debitsFormatted: "$390M", creditsFormatted: "$310M" }
    ]
  },
  "Year to Date": {
    maxY: 400,
    yTicks: [
      { value: 400, label: "$400M" },
      { value: 300, label: "$300M" },
      { value: 200, label: "$200M" },
      { value: 100, label: "$100M" },
      { value: 0, label: "0" }
    ],
    data: [
      { month: "January 2026", shortMonth: "Jan", debits: 160, credits: 120, debitsFormatted: "$160M", creditsFormatted: "$120M" },
      { month: "February 2026", shortMonth: "Feb", debits: 175, credits: 130, debitsFormatted: "$175M", creditsFormatted: "$130M" },
      { month: "March 2026", shortMonth: "Mar", debits: 195, credits: 155, debitsFormatted: "$195M", creditsFormatted: "$155M" },
      { month: "April 2026", shortMonth: "Apr", debits: 120, credits: 90, debitsFormatted: "$120M", creditsFormatted: "$90M" },
      { month: "May 2026", shortMonth: "May", debits: 210, credits: 140, debitsFormatted: "$210M", creditsFormatted: "$140M" },
      { month: "June 2026", shortMonth: "Jun", debits: 190, credits: 135, debitsFormatted: "$190M", creditsFormatted: "$135M" },
      { month: "July 2026", shortMonth: "Jul", debits: 280, credits: 210, debitsFormatted: "$280M", creditsFormatted: "$210M" },
      { month: "August 2026", shortMonth: "Aug", debits: 350, credits: 270, debitsFormatted: "$350M", creditsFormatted: "$270M" },
      { month: "September 2026", shortMonth: "Sep", debits: 390, credits: 310, debitsFormatted: "$390M", creditsFormatted: "$310M" }
    ]
  },
  "September 2026": {
    maxY: 150,
    yTicks: [
      { value: 150, label: "$150M" },
      { value: 100, label: "$100M" },
      { value: 50, label: "$50M" },
      { value: 0, label: "0" }
    ],
    data: [
      { month: "Sep 1 - Sep 7", shortMonth: "Wk 1", debits: 82, credits: 68, debitsFormatted: "$82M", creditsFormatted: "$68M" },
      { month: "Sep 8 - Sep 14", shortMonth: "Wk 2", debits: 95, credits: 78, debitsFormatted: "$95M", creditsFormatted: "$78M" },
      { month: "Sep 15 - Sep 21", shortMonth: "Wk 3", debits: 112, credits: 94, debitsFormatted: "$112M", creditsFormatted: "$94M" },
      { month: "Sep 22 - Sep 28", shortMonth: "Wk 4", debits: 101, credits: 70, debitsFormatted: "$101M", creditsFormatted: "$70M" }
    ]
  },
  "August 2026": {
    maxY: 150,
    yTicks: [
      { value: 150, label: "$150M" },
      { value: 100, label: "$100M" },
      { value: 50, label: "$50M" },
      { value: 0, label: "0" }
    ],
    data: [
      { month: "Aug 1 - Aug 7", shortMonth: "Wk 1", debits: 75, credits: 60, debitsFormatted: "$75M", creditsFormatted: "$60M" },
      { month: "Aug 8 - Aug 14", shortMonth: "Wk 2", debits: 88, credits: 72, debitsFormatted: "$88M", creditsFormatted: "$72M" },
      { month: "Aug 15 - Aug 21", shortMonth: "Wk 3", debits: 94, credits: 80, debitsFormatted: "$94M", creditsFormatted: "$80M" },
      { month: "Aug 22 - Aug 28", shortMonth: "Wk 4", debits: 93, credits: 58, debitsFormatted: "$93M", creditsFormatted: "$58M" }
    ]
  },
  "July 2026": {
    maxY: 150,
    yTicks: [
      { value: 150, label: "$150M" },
      { value: 100, label: "$100M" },
      { value: 50, label: "$50M" },
      { value: 0, label: "0" }
    ],
    data: [
      { month: "Jul 1 - Jul 7", shortMonth: "Wk 1", debits: 62, credits: 45, debitsFormatted: "$62M", creditsFormatted: "$45M" },
      { month: "Jul 8 - Jul 14", shortMonth: "Wk 2", debits: 70, credits: 55, debitsFormatted: "$70M", creditsFormatted: "$55M" },
      { month: "Jul 15 - Jul 21", shortMonth: "Wk 3", debits: 78, credits: 60, debitsFormatted: "$78M", creditsFormatted: "$60M" },
      { month: "Jul 22 - Jul 28", shortMonth: "Wk 4", debits: 70, credits: 50, debitsFormatted: "$70M", creditsFormatted: "$50M" }
    ]
  },
  "June 2026": {
    maxY: 100,
    yTicks: [
      { value: 100, label: "$100M" },
      { value: 75, label: "$75M" },
      { value: 50, label: "$50M" },
      { value: 25, label: "$25M" },
      { value: 0, label: "0" }
    ],
    data: [
      { month: "Jun 1 - Jun 7", shortMonth: "Wk 1", debits: 45, credits: 32, debitsFormatted: "$45M", creditsFormatted: "$32M" },
      { month: "Jun 8 - Jun 14", shortMonth: "Wk 2", debits: 48, credits: 35, debitsFormatted: "$48M", creditsFormatted: "$35M" },
      { month: "Jun 15 - Jun 21", shortMonth: "Wk 3", debits: 52, credits: 38, debitsFormatted: "$52M", creditsFormatted: "$38M" },
      { month: "Jun 22 - Jun 28", shortMonth: "Wk 4", debits: 45, credits: 30, debitsFormatted: "$45M", creditsFormatted: "$30M" }
    ]
  },
  "May 2026": {
    maxY: 100,
    yTicks: [
      { value: 100, label: "$100M" },
      { value: 75, label: "$75M" },
      { value: 50, label: "$50M" },
      { value: 25, label: "$25M" },
      { value: 0, label: "0" }
    ],
    data: [
      { month: "May 1 - May 7", shortMonth: "Wk 1", debits: 50, credits: 35, debitsFormatted: "$50M", creditsFormatted: "$35M" },
      { month: "May 8 - May 14", shortMonth: "Wk 2", debits: 55, credits: 38, debitsFormatted: "$55M", creditsFormatted: "$38M" },
      { month: "May 15 - May 21", shortMonth: "Wk 3", debits: 58, credits: 40, debitsFormatted: "$58M", creditsFormatted: "$40M" },
      { month: "May 22 - May 28", shortMonth: "Wk 4", debits: 47, credits: 27, debitsFormatted: "$47M", creditsFormatted: "$27M" }
    ]
  },
  "April 2026": {
    maxY: 100,
    yTicks: [
      { value: 100, label: "$100M" },
      { value: 75, label: "$75M" },
      { value: 50, label: "$50M" },
      { value: 25, label: "$25M" },
      { value: 0, label: "0" }
    ],
    data: [
      { month: "Apr 1 - Apr 7", shortMonth: "Wk 1", debits: 28, credits: 20, debitsFormatted: "$28M", creditsFormatted: "$20M" },
      { month: "Apr 8 - Apr 14", shortMonth: "Wk 2", debits: 32, credits: 25, debitsFormatted: "$32M", creditsFormatted: "$25M" },
      { month: "Apr 15 - Apr 21", shortMonth: "Wk 3", debits: 35, credits: 26, debitsFormatted: "$35M", creditsFormatted: "$26M" },
      { month: "Apr 22 - Apr 28", shortMonth: "Wk 4", debits: 25, credits: 19, debitsFormatted: "$25M", creditsFormatted: "$19M" }
    ]
  }
};

export function TransactionTrendsChart({
  trends,
  className = "",
  onPeriodChange
}: TransactionTrendsChartProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState<TrendPeriod>("Last 6 Months");
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const periodConfig = PERIOD_DATA[selectedPeriod] || PERIOD_DATA["Last 6 Months"];
  const isDynamicTrends =
    (selectedPeriod === "Last 6 Months" || selectedPeriod === "Last 12 Months") &&
    Array.isArray(trends) &&
    trends.length >= 6;

  const displayTrends = isDynamicTrends
    ? selectedPeriod === "Last 6 Months"
      ? trends.slice(-6)
      : trends
    : periodConfig.data;

  const maxDataVal = Math.max(
    ...displayTrends.map((d) => Math.max(Number(d.debits) || 0, Number(d.credits) || 0)),
    10
  );
  const maxY = isDynamicTrends ? Math.ceil(maxDataVal * 1.15) : periodConfig.maxY;

  const formatTickLabel = (val: number) => {
    if (val === 0) return "0";
    if (val >= 10_000_000) return `$${(val / 10_000_000).toFixed(1)} Cr`;
    if (val >= 100_000) return `$${(val / 100_000).toFixed(0)} L`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)} K`;
    return `$${Math.round(val)}`;
  };

  const yTicks = isDynamicTrends
    ? [
        { value: maxY, label: formatTickLabel(maxY) },
        { value: Math.round(maxY * 0.75), label: formatTickLabel(maxY * 0.75) },
        { value: Math.round(maxY * 0.5), label: formatTickLabel(maxY * 0.5) },
        { value: Math.round(maxY * 0.25), label: formatTickLabel(maxY * 0.25) },
        { value: 0, label: "0" }
      ]
    : periodConfig.yTicks;

  // Chart dimensions & scales
  const chartHeight = 220;
  const chartWidth = 600;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const denom = displayTrends.length > 1 ? displayTrends.length - 1 : 1;
  const points = displayTrends.map((d, i) => {
    const x = paddingLeft + (i / denom) * innerWidth;
    const yDebit = paddingTop + innerHeight - (d.debits / maxY) * innerHeight;
    const yCredit = paddingTop + innerHeight - (d.credits / maxY) * innerHeight;
    return { x, yDebit, yCredit, ...d };
  });

  // Build smooth cubic Bezier paths
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const debitPath = buildSmoothPath(points.map((p) => ({ x: p.x, y: p.yDebit })));
  const creditPath = buildSmoothPath(points.map((p) => ({ x: p.x, y: p.yCredit })));

  const debitArea = `${debitPath} L ${points[points.length - 1].x} ${paddingTop + innerHeight} L ${points[0].x} ${paddingTop + innerHeight} Z`;
  const creditArea = `${creditPath} L ${points[points.length - 1].x} ${paddingTop + innerHeight} L ${points[0].x} ${paddingTop + innerHeight} Z`;

  const handleSelectPeriod = (period: TrendPeriod) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  return (
    <div className={`rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-xs ${className}`}>
      {/* Header with Title, Legend & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Transaction Trends
          </h2>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            Comparative analysis of financial flows ({selectedPeriod})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0071DC] inline-block shadow-xs" />
              <span className="text-slate-600">Debits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block shadow-xs" />
              <span className="text-slate-600">Credits</span>
            </div>
          </div>

          {/* Functional Period & Month selector dropdown */}
          <div className="relative inline-flex items-center h-8 shrink-0">
            <select
              aria-label="Filter transaction trends period"
              value={selectedPeriod}
              onChange={(e) => handleSelectPeriod(e.target.value as TrendPeriod)}
              className="h-8 pl-3 pr-8 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0071DC] appearance-none cursor-pointer shadow-2xs transition leading-none whitespace-nowrap"
            >
              <optgroup label="Presets">
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="Last 12 Months">Last 12 Months</option>
                <option value="Year to Date">Year to Date (2026)</option>
              </optgroup>
              <optgroup label="Monthly Breakdown">
                <option value="September 2026">September 2026</option>
                <option value="August 2026">August 2026</option>
                <option value="July 2026">July 2026</option>
                <option value="June 2026">June 2026</option>
                <option value="May 2026">May 2026</option>
                <option value="April 2026">April 2026</option>
              </optgroup>
            </select>
            <ChevronDownIcon className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative mt-3 w-full overflow-x-auto no-scrollbar">
        <div className="min-w-[480px]">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              <linearGradient id="debitAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0071DC" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#0071DC" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="creditAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines & Y-axis labels */}
            {yTicks.map((tick) => {
              const y = paddingTop + innerHeight - (tick.value / maxY) * innerHeight;
              return (
                <g key={tick.value}>
                  <text
                    x={paddingLeft - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono font-medium"
                  >
                    {tick.label}
                  </text>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={chartWidth - paddingRight}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    strokeDasharray={tick.value === 0 ? "none" : "3 3"}
                  />
                </g>
              );
            })}

            {/* Gradient Filled Areas */}
            <path d={debitArea} fill="url(#debitAreaGrad)" />
            <path d={creditArea} fill="url(#creditAreaGrad)" />

            {/* Solid Smooth Curves */}
            <path
              d={debitPath}
              fill="none"
              stroke="#0071DC"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={creditPath}
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points and X-Axis Labels */}
            {points.map((p, idx) => {
              const isHovered = hoveredIndex === idx;

              return (
                <g key={p.shortMonth}>
                  {/* Vertical guide line on hover */}
                  {isHovered && (
                    <line
                      x1={p.x}
                      y1={paddingTop}
                      x2={p.x}
                      y2={paddingTop + innerHeight}
                      stroke="#94A3B8"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Debit Circle */}
                  <circle
                    cx={p.x}
                    cy={p.yDebit}
                    r={isHovered ? 5.5 : 3.5}
                    fill="#0071DC"
                    stroke="#FFFFFF"
                    strokeWidth={isHovered ? 2.5 : 2}
                    className="transition-all cursor-pointer"
                  />

                  {/* Credit Circle */}
                  <circle
                    cx={p.x}
                    cy={p.yCredit}
                    r={isHovered ? 5.5 : 3.5}
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth={isHovered ? 2.5 : 2}
                    className="transition-all cursor-pointer"
                  />

                  {/* Month Label */}
                  <text
                    x={p.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    className={`text-[11px] font-medium transition-colors ${
                      isHovered ? "fill-[#0071DC] font-bold" : "fill-slate-500"
                    }`}
                  >
                    {p.shortMonth}
                  </text>

                  {/* Transparent hover hit area */}
                  <rect
                    x={p.x - 20}
                    y={paddingTop}
                    width={40}
                    height={innerHeight}
                    fill="transparent"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="cursor-pointer"
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Tooltip */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <div
              className="absolute pointer-events-none transform -translate-x-1/2 rounded-xl bg-slate-900/90 text-white p-2.5 text-xs shadow-xl backdrop-blur-md z-10 space-y-1 transition-all"
              style={{
                left: `${(points[hoveredIndex].x / chartWidth) * 100}%`,
                top: "10px"
              }}
            >
              <p className="font-bold text-slate-200 border-b border-white/15 pb-1">
                {points[hoveredIndex].month}
              </p>
              <div className="flex items-center justify-between gap-3 text-blue-300">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#0071DC]" />
                  Debits:
                </span>
                <span className="font-mono font-bold">{points[hoveredIndex].debitsFormatted}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-emerald-300">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  Credits:
                </span>
                <span className="font-mono font-bold">{points[hoveredIndex].creditsFormatted}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
