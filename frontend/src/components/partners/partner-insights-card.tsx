"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShoppingCartIcon,
  TruckIcon,
  UsersIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from "@/components/ui/icons";
import { Skeleton } from "@/components/common/loading-state";
import type { PartnerInsights } from "@/types/partners";
import { cn } from "@/lib/cn";

export interface PartnerInsightsCardProps {
  insights?: PartnerInsights;
  isLoading?: boolean;
  className?: string;
}

export function PartnerInsightsCard({
  insights,
  isLoading = false,
  className
}: PartnerInsightsCardProps) {
  if (isLoading || !insights) {
    return (
      <div className={cn("p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs h-full flex flex-col justify-between", className)}>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <div className="space-y-4 my-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-3 w-28 rounded" />
              </div>
              <Skeleton className="h-4 w-12 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const rows = [
    {
      key: "retailers",
      icon: ShoppingCartIcon,
      bg: "bg-blue-50 text-[#0071DC]",
      value: insights.activeRetailers.toLocaleString(),
      label: "Active Retailers",
      trend: insights.retailersTrend
    },
    {
      key: "suppliers",
      icon: TruckIcon,
      bg: "bg-purple-50 text-purple-600",
      value: insights.activeSuppliers.toLocaleString(),
      label: "Active Suppliers",
      trend: insights.suppliersTrend
    },
    {
      key: "newPartners",
      icon: UsersIcon,
      bg: "bg-blue-50 text-[#0071DC]",
      value: insights.newPartnersYtd.toLocaleString(),
      label: "New Partners (YTD)",
      trend: insights.newPartnersTrend
    },
    {
      key: "satisfaction",
      icon: CheckCircleIcon,
      bg: "bg-amber-50 text-amber-600",
      value: `${insights.satisfactionScore}%`,
      label: "Partner Satisfaction",
      trend: insights.satisfactionTrend
    }
  ];

  return (
    <div
      className={cn(
        "p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs h-full flex flex-col justify-between overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Partner Insights
        </h3>
        <Link
          href="/reports"
          className="text-xs font-semibold text-[#0071DC] hover:text-[#005bb5] flex items-center gap-1 transition"
        >
          <span>View Reports</span>
          <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>

      {/* 4 Metric Rows */}
      <div className="space-y-3.5 my-auto py-2">
        {rows.map((row) => {
          const Icon = row.icon;
          const hasPositiveTrend = row.trend !== null && row.trend >= 0;

          return (
            <div
              key={row.key}
              className="flex items-center justify-between gap-3 p-1 rounded-xl hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
                    row.bg
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                    {row.value}
                  </div>
                  <div className="text-xs text-slate-500 font-medium truncate leading-tight mt-0.5">
                    {row.label}
                  </div>
                </div>
              </div>

              {/* Trend Pill */}
              <div className="shrink-0 text-right">
                {row.trend !== null ? (
                  <span
                    className={cn(
                      "text-xs font-semibold inline-flex items-center gap-0.5",
                      hasPositiveTrend ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    <span>{hasPositiveTrend ? "↑" : "↓"}</span>
                    <span>{Math.abs(row.trend)}%</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
