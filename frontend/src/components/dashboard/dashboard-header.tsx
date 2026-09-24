"use client";

import * as React from "react";
import { BannerImage } from "@/components/common/responsive-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCwIcon, StoreIcon, FilterIcon, SparkIcon } from "@/components/ui/icons";
import { useShell } from "@/context/shell-context";

export interface DashboardHeaderProps {
  selectedStoreId?: string;
  onStoreChange: (storeId: string | undefined) => void;
  selectedDateRange: string;
  onDateRangeChange: (range: string) => void;
  onRefresh: () => void;
  isFetching?: boolean;
}

export function DashboardHeader({
  selectedStoreId,
  onStoreChange,
  selectedDateRange,
  onDateRangeChange,
  onRefresh,
  isFetching = false
}: DashboardHeaderProps) {
  const { stores } = useShell();

  return (
    <div className="space-y-4">
      {/* Title & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <Badge variant="spark" className="hidden sm:inline-flex">
              <SparkIcon className="w-3 h-3 mr-1" />
              Live DB Slice
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Executive retail operations summary and key performance indicators.
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Store Selector Filter */}
          <div className="relative inline-flex items-center">
            <StoreIcon className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
            <select
              aria-label="Filter by store"
              value={selectedStoreId || ""}
              onChange={(e) => onStoreChange(e.target.value || undefined)}
              className="pl-8 pr-7 py-1.5 text-xs font-medium rounded-md border border-border bg-surface text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-primary appearance-none cursor-pointer shadow-xs transition-colors"
            >
              <option value="">All Stores ({stores.length})</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <span className="absolute right-2 pointer-events-none text-slate-400 text-[10px]">▼</span>
          </div>

          {/* Date Range Filter */}
          <div className="relative inline-flex items-center">
            <FilterIcon className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
            <select
              aria-label="Filter by date range"
              value={selectedDateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="pl-8 pr-7 py-1.5 text-xs font-medium rounded-md border border-border bg-surface text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-primary appearance-none cursor-pointer shadow-xs transition-colors"
            >
              <option value="all">All Available Period</option>
              <option value="90d">Last 90 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <span className="absolute right-2 pointer-events-none text-slate-400 text-[10px]">▼</span>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="text-xs h-8 px-2.5"
            title="Refresh dashboard metrics"
          >
            <RefreshCwIcon
              className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? "animate-spin text-brand-primary" : ""}`}
            />
            <span className="hidden xs:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Centralized Responsive Store Banner Component */}
      <BannerImage
        title="Walmart India Retail ERP"
        subtitle="Centralized retail operations management covering inventory replenishment, POS sales, multi-store logistics, and financial ledger."
        tag="Omnichannel Supercenter Network"
        priority
      />
    </div>
  );
}
