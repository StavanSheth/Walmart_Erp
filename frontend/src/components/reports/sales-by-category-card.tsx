"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import type { CategoryDistributionItem } from "@/types/reports";

export interface SalesByCategoryCardProps {
  items?: CategoryDistributionItem[];
  totalSalesFormatted?: string;
  isLoading?: boolean;
  className?: string;
}

export function SalesByCategoryCard({
  items,
  totalSalesFormatted,
  isLoading,
  className
}: SalesByCategoryCardProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const categories = items || [];

  // Donut chart calculations
  const size = 150;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedPercentage = 0;

  return (
    <div className={cn("bg-white/90 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-4 sm:p-5 flex flex-col h-auto min-h-[385px] xl:h-[385px] overflow-hidden", className)}>
      {/* Title */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100/80 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-purple-500/25">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
              Sales by Category
            </h2>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
              Revenue distribution share
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-2">
          <div className="flex flex-row items-center justify-between gap-4 w-full animate-pulse">
            <div className="w-[150px] h-[150px] rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <div className="w-[102px] h-[102px] rounded-full bg-white" />
            </div>
            <div className="flex-1 w-full space-y-2.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-3 w-20 bg-slate-100 rounded" />
                  <div className="h-3 w-8 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center my-auto py-1">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-3 sm:gap-4 w-full">
            {/* SVG Donut */}
            <div className="relative w-[130px] h-[130px] sm:w-[145px] sm:h-[145px] shrink-0 flex items-center justify-center my-1">
              <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg] max-w-[145px] max-h-[145px]">
                {/* Background track */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="#F1F5F9"
                  strokeWidth={strokeWidth}
                />

                {/* Segments */}
                {categories.map((cat, i) => {
                  const dashLength = (cat.percentage / 100) * circumference;
                  const dashOffset = -((accumulatedPercentage / 100) * circumference);
                  accumulatedPercentage += cat.percentage;
                  const isHovered = hoveredIndex === i;

                  return (
                    <circle
                      key={cat.categoryId}
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="transparent"
                      stroke={cat.color}
                      strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-200 cursor-pointer drop-shadow-xs"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  );
                })}
              </svg>

              {/* Center Text with subtle glow backdrop */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-slate-50/90 flex flex-col items-center justify-center border border-slate-100 shadow-inner">
                  <span className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate px-1">
                    {isLoading ? "—" : totalSalesFormatted}
                  </span>
                  <span className="text-[8.5px] sm:text-[9px] text-slate-400 font-bold leading-tight tracking-wider uppercase mt-0.5">
                    Total
                  </span>
                </div>
              </div>
            </div>

            {/* Legend List with mini progress bars (2-col grid on mobile/tablet, 1-col on xl) */}
            <div className="flex-1 w-full grid grid-cols-2 xl:grid-cols-1 gap-1.5 min-w-[130px]">
              {categories.map((cat, i) => {
                const isHovered = hoveredIndex === i;
                return (
                  <div
                    key={cat.categoryId}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={cn(
                      "group p-1 sm:p-1.5 rounded-xl transition-all duration-150 cursor-pointer border",
                      isHovered
                        ? "bg-slate-100/90 border-slate-300/80 shadow-xs"
                        : "hover:bg-slate-50/80 border-transparent hover:border-slate-200/60"
                    )}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="truncate text-slate-700 text-[11px] sm:text-xs font-semibold">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-900 ml-1.5 font-mono shrink-0">
                        {cat.percentage}%
                      </span>
                    </div>
                    {/* Mini proportional bar */}
                    <div className="w-full bg-slate-100 h-1 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
