"use client";

import * as React from "react";
import Link from "next/link";
import { SparkIcon, ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export interface PartnersCommunityCardProps {
  className?: string;
}

export function PartnersCommunityCard({ className }: PartnersCommunityCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 select-none",
        "bg-gradient-to-br from-emerald-50 via-teal-50/70 to-emerald-100/50 border border-emerald-200/80 shadow-xs",
        className
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300/60">
          <SparkIcon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-emerald-950 tracking-tight leading-tight">
            Growing Together
          </h4>
          <p className="text-[11px] text-emerald-800/80 leading-tight mt-0.5 truncate">
            Reliable partners. Stronger communities.
          </p>
          <Link
            href="/reports"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 mt-1.5 transition"
          >
            <span>Learn More</span>
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
