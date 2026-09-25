"use client";

import * as React from "react";

export interface StockSparklineProps {
  trend?: "up" | "down" | "surge" | "steady";
  color?: string;
  id?: string;
  className?: string;
}

/**
 * Shared stock-style ticker sparkline with gradient area fill underneath and live price point.
 * Used across Dashboard and Inventory KPI cards for consistent visual language.
 */
export function StockSparkline({
  trend = "up",
  color = "#0071DC",
  id,
  className = "w-16 sm:w-20 h-7"
}: StockSparklineProps) {
  const reactId = React.useId().replace(/:/g, "");
  const gradId = `spark-${reactId}-${id || ""}`;

  let linePath = "M 2 18 C 14 16, 20 22, 32 12 C 42 4, 52 14, 62 4";
  let areaPath = "M 2 18 C 14 16, 20 22, 32 12 C 42 4, 52 14, 62 4 L 62 26 L 2 26 Z";
  let endX = 62;
  let endY = 4;

  if (trend === "down") {
    linePath = "M 2 6 C 14 8, 22 4, 34 14 C 44 22, 54 16, 62 20";
    areaPath = "M 2 6 C 14 8, 22 4, 34 14 C 44 22, 54 16, 62 20 L 62 26 L 2 26 Z";
    endX = 62;
    endY = 20;
  } else if (trend === "surge") {
    linePath = "M 2 20 C 14 18, 24 16, 34 10 C 44 8, 52 6, 62 3";
    areaPath = "M 2 20 C 14 18, 24 16, 34 10 C 44 8, 52 6, 62 3 L 62 26 L 2 26 Z";
    endX = 62;
    endY = 3;
  } else if (trend === "steady") {
    linePath = "M 2 14 C 14 18, 24 8, 34 16 C 44 10, 52 16, 62 12";
    areaPath = "M 2 14 C 14 18, 24 8, 34 16 C 44 10, 52 16, 62 12 L 62 26 L 2 26 Z";
    endX = 62;
    endY = 12;
  }

  return (
    <svg className={`${className} shrink-0 overflow-visible`} viewBox="0 0 64 26" fill="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="70%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {/* Stock Gradient Area */}
      <path d={areaPath} fill={`url(#${gradId})`} />
      {/* Stock Line Stroke */}
      <path
        d={linePath}
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End Ticker Point */}
      <circle cx={endX} cy={endY} r="2" fill={color} />
    </svg>
  );
}
