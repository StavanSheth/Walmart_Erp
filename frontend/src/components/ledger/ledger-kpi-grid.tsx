"use client";

import * as React from "react";
import type { KpiCardData } from "@/types/ledger";
import {
  DatabaseIcon,
  WalletIcon,
  BankIcon
} from "@/components/ui/icons";

interface LedgerKpiGridProps {
  kpis?: KpiCardData[];
  isLoading?: boolean;
}

const DEFAULT_KPIS: KpiCardData[] = [
  {
    id: "kpi-total-transactions",
    title: "Total Transactions",
    value: "0",
    rawValue: 0,
    trend: "0%",
    trendDirection: "up",
    period: "",
    icon: "database",
    sparkline: [0, 0, 0, 0, 0, 0]
  },
  {
    id: "kpi-total-debits",
    title: "Total Debits",
    value: "$0.00",
    rawValue: 0,
    trend: "0%",
    trendDirection: "up",
    period: "",
    icon: "debit",
    sparkline: [0, 0, 0, 0, 0, 0]
  },
  {
    id: "kpi-total-credits",
    title: "Total Credits",
    value: "$0.00",
    rawValue: 0,
    trend: "0%",
    trendDirection: "up",
    period: "",
    icon: "credit",
    sparkline: [0, 0, 0, 0, 0, 0]
  },
  {
    id: "kpi-account-balance",
    title: "Account Balance",
    value: "$0.00",
    rawValue: 0,
    trend: "0%",
    trendDirection: "up",
    period: "",
    icon: "balance",
    sparkline: [0, 0, 0, 0, 0, 0]
  }
];

function MiniSparkline({
  points,
  color,
  gradientId
}: {
  points: number[];
  color: string;
  gradientId: string;
}) {
  const width = 110;
  const height = 44;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * (width - 10) + 5;
    const y = height - 6 - ((val - min) / range) * (height - 14);
    return { x, y };
  });

  // Build smooth Bezier path
  let pathD = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp1y = curr.y;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    const cp2y = next.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  const fillD = `${pathD} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#${gradientId})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LedgerKpiGrid({ kpis = DEFAULT_KPIS, isLoading = false }: LedgerKpiGridProps) {
  const displayKpis = kpis && kpis.length === 4 ? kpis : DEFAULT_KPIS;

  const cardConfig = [
    {
      bgIcon: "bg-blue-500/25 border-blue-400/35 text-blue-200",
      strokeColor: "#38BDF8",
      gradientId: "spark-blue"
    },
    {
      bgIcon: "bg-emerald-500/25 border-emerald-400/35 text-emerald-200",
      strokeColor: "#34D399",
      gradientId: "spark-green"
    },
    {
      bgIcon: "bg-rose-500/25 border-rose-400/35 text-rose-200",
      strokeColor: "#FB7185",
      gradientId: "spark-rose"
    },
    {
      bgIcon: "bg-purple-500/25 border-purple-400/35 text-purple-200",
      strokeColor: "#C084FC",
      gradientId: "spark-purple"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {displayKpis.map((kpi, idx) => {
        const cfg = cardConfig[idx % cardConfig.length];

        return (
          <div
            key={kpi.id || idx}
            className="group relative rounded-2xl bg-[#06182c]/85 hover:bg-[#06182c]/95 lg:bg-[#051A33]/25 lg:hover:bg-[#051A33]/35 backdrop-blur-xl lg:backdrop-blur-md p-3.5 sm:p-4 border border-white/30 lg:border-white/25 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between text-white min-h-[105px] sm:min-h-[110px]"
          >
            {/* Top row: Category Icon & Mini Trend Chart */}
            <div className="flex items-start justify-between gap-2">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border backdrop-blur-md shadow-xs transition-transform group-hover:scale-105 shrink-0 ${cfg.bgIcon}`}
              >
                {kpi.icon === "database" && <DatabaseIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
                {kpi.icon === "debit" && <WalletIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
                {kpi.icon === "credit" && <WalletIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
                {kpi.icon === "balance" && <BankIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
              </div>

              {/* Sparkline chart */}
              <div className="shrink-0 flex items-center justify-end">
                <MiniSparkline
                  points={kpi.sparkline || [20, 30, 45, 60, 75]}
                  color={cfg.strokeColor}
                  gradientId={cfg.gradientId}
                />
              </div>
            </div>

            {/* Bottom: Title & Value */}
            <div className="mt-2">
              <p className="text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-wider text-blue-100/80 truncate">
                {kpi.title}
              </p>
              <p className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5 tabular-nums drop-shadow-sm leading-tight">
                {isLoading ? (
                  <span className="inline-block w-24 h-7 bg-white/20 animate-pulse rounded" />
                ) : (
                  kpi.value
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
