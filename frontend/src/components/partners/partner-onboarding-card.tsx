"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/common/loading-state";
import type { PartnerOnboardingMetric } from "@/types/partners";
import { cn } from "@/lib/cn";

export interface PartnerOnboardingCardProps {
  onboarding?: PartnerOnboardingMetric;
  isLoading?: boolean;
  className?: string;
}

export function PartnerOnboardingCard({
  onboarding,
  isLoading = false,
  className
}: PartnerOnboardingCardProps) {
  if (isLoading || !onboarding) {
    return (
      <div className={cn("p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <div className="flex items-center gap-4 py-2">
          <Skeleton className="w-16 h-16 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-28 rounded" />
            <Skeleton className="h-3.5 w-32 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const { onboarded, eligible, percentage } = onboarding;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn(
        "p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Partner Onboarding
        </h3>
        <Link
          href="/reports"
          className="text-xs font-semibold text-[#0071DC] hover:text-[#005bb5] flex items-center gap-1 transition"
        >
          <span>View Details</span>
          <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>

      {/* Circular Progress & Metric Row */}
      <div className="flex items-center gap-4 sm:gap-5 py-3 my-auto">
        {/* Circular SVG Ring */}
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
            {/* Background ring */}
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="#E2E8F0"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Active Progress Ring */}
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="#10B981"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute text-xs sm:text-sm font-extrabold text-slate-900 select-none">
            {percentage}%
          </span>
        </div>

        {/* Text Details */}
        <div className="min-w-0">
          <div className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
            {onboarded.toLocaleString()} / {eligible.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 font-medium leading-tight mt-1">
            Onboarded This Year
          </div>
        </div>
      </div>
    </div>
  );
}
