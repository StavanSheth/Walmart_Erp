"use client";

import * as React from "react";
import Link from "next/link";
import type { TopPartnerItem } from "@/types/partners";
import { PartnerAvatar } from "./partner-avatar";
import { formatCurrency } from "@/lib/format";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/common/loading-state";
import { cn } from "@/lib/cn";

export interface TopPartnersCardProps {
  topPartners?: TopPartnerItem[];
  isLoading?: boolean;
  onSelectPartner?: (id: string) => void;
  className?: string;
}

export function TopPartnersCard({
  topPartners = [],
  isLoading = false,
  onSelectPartner,
  className
}: TopPartnersCardProps) {
  if (isLoading) {
    return (
      <div className={cn("p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <div className="space-y-3 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <Skeleton className="w-6 h-6 rounded-full shrink-0" />
              <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
              <Skeleton className="h-4 w-32 rounded flex-1" />
              <Skeleton className="h-4 w-20 rounded shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          Top Partners (By Sales)
        </h3>
        <Link
          href="/partners?tab=performance"
          className="text-xs font-semibold text-[#0071DC] hover:text-[#005bb5] flex items-center gap-1 transition"
        >
          <span>View All</span>
          <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>

      {/* 5 Rows */}
      <div className="divide-y divide-slate-100 pt-1">
        {topPartners.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectPartner?.(item.id)}
            className="py-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-50 px-1 rounded-xl transition cursor-pointer group"
          >
            {/* Rank badge & Avatar & Name */}
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0071DC] text-[11px] font-bold flex items-center justify-center shrink-0">
                {item.rank}
              </span>
              <PartnerAvatar name={item.name} size="sm" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 truncate group-hover:text-[#0071DC] transition-colors">
                  {item.name}
                </div>
                <div className="text-[10px] text-slate-400 font-medium truncate">
                  {item.type}
                </div>
              </div>
            </div>

            {/* Total Sales Value */}
            <div className="text-xs font-bold text-slate-800 tabular-nums shrink-0">
              {formatCurrency(item.totalValue, true)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
