"use client";

import * as React from "react";
import type { AccountDistributionItem } from "@/types/ledger";

interface TransactionsDonutChartProps {
  distribution?: AccountDistributionItem[];
  totalTransactions?: string;
  className?: string;
}

const DEFAULT_DISTRIBUTION: AccountDistributionItem[] = [
  { name: "Accounts Payable", percentage: 28, color: "#0071DC" },
  { name: "Accounts Receivable", percentage: 24, color: "#10B981" },
  { name: "Sales", percentage: 18, color: "#3B82F6" },
  { name: "Purchases", percentage: 12, color: "#F59E0B" },
  { name: "Expenses", percentage: 10, color: "#EF4444" },
  { name: "Others", percentage: 8, color: "#94A3B8" }
];

export function TransactionsDonutChart({
  distribution = DEFAULT_DISTRIBUTION,
  totalTransactions = "0",
  className = ""
}: TransactionsDonutChartProps) {
  const size = 170;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className={`rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Transactions by Account Type
          </h2>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            Distribution across account classifications
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 my-auto pt-4">
        {/* Donut SVG */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {distribution.map((item) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += item.percentage;

              return (
                <circle
                  key={item.name}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 hover:opacity-85"
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight leading-tight">
              {totalTransactions}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
              Transactions
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 space-y-2 w-full text-xs">
          {distribution.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-slate-700">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-slate-700">{item.name}</span>
              </div>
              <span className="font-bold text-slate-900 font-mono tabular-nums">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
