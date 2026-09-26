"use client";

import * as React from "react";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { DesktopSummary, MobileSummary } from "@/types/dashboard";
import { MetricCard } from "@/components/common/metric-card";

export interface DashboardKPIGridProps {
  summary?: DesktopSummary;
  mobileSummary?: MobileSummary;
  isLoading?: boolean;
}

export function DashboardKPIGrid({
  summary,
  mobileSummary,
  isLoading = false
}: DashboardKPIGridProps) {
  const showDesktopSkeleton = isLoading || !summary;
  const showMobileSkeleton = isLoading || !mobileSummary;

  return (
    <div>
      {/* Desktop: 5 Glass Metric Cards or Skeleton */}
      {showDesktopSkeleton ? (
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <MetricCard key={i} label="" value="" isLoading variant="glass" />
          ))}
        </div>
      ) : (
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3.5">

        {/* 1. Total Products */}
        <MetricCard
          id="products"
          label="Total Products"
          value={formatNumber(summary.totalProducts)}
          subLabel="vs. last month"
          trendText="↑ 5%"
          trendPositive={true}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          iconContainerClassName="bg-blue-500/25 border-blue-400/35 text-blue-200"
          sparklineTrend="up"
          sparklineColor="#38BDF8"
          variant="glass"
        />

        {/* 2. In Stock (Units) */}
        <MetricCard
          id="instock"
          label="In Stock (Units)"
          value={formatNumber(summary.inStockUnits)}
          subLabel="vs. last month"
          trendText="↑ 8%"
          trendPositive={true}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconContainerClassName="bg-emerald-500/25 border-emerald-400/35 text-emerald-200"
          sparklineTrend="surge"
          sparklineColor="#34D399"
          variant="glass"
        />

        {/* 3. Low Stock Items */}
        <MetricCard
          id="lowstock"
          label="Low Stock Items"
          value={formatNumber(summary.lowStockItems)}
          subLabel="vs. last month"
          trendText="↑ 12%"
          trendPositive={false}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          iconContainerClassName="bg-amber-500/25 border-amber-400/35 text-amber-200"
          sparklineTrend="steady"
          sparklineColor="#FBBF24"
          variant="glass"
        />

        {/* 4. Out of Stock */}
        <MetricCard
          id="outofstock"
          label="Out of Stock"
          value={formatNumber(summary.outOfStockItems)}
          subLabel="vs. last month"
          trendText="↓ 6%"
          trendPositive={true}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          }
          iconContainerClassName="bg-rose-500/25 border-rose-400/35 text-rose-200"
          sparklineTrend="down"
          sparklineColor="#FB7185"
          variant="glass"
        />

        {/* 5. Total Store Locations */}
        <MetricCard
          id="stores"
          label="Total Store Locations"
          value={formatNumber(summary.totalStores)}
          subLabel="new this month"
          trendText="+ 2"
          trendPositive={true}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          iconContainerClassName="bg-blue-600/25 border-blue-400/35 text-blue-200"
          sparklineTrend="up"
          sparklineColor="#38BDF8"
          variant="glass"
        />
        </div>
      )}

      {/* Mobile: 2 × 2 Glass Metric Cards or Skeleton */}
      {showMobileSkeleton ? (
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {[1, 2, 3, 4].map((i) => (
            <MetricCard key={i} label="" value="" isLoading variant="glass-mobile" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {/* 1. Total Sales (Today) */}
          <MetricCard
            id="m-sales"
            label="Total Sales (Today)"
            value={formatCurrency(mobileSummary.totalSalesToday)}
            subLabel=""
            trendText="↑ 12%"
            trendPositive={true}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            iconContainerClassName="bg-emerald-500/30 border-emerald-400/40 text-emerald-300 w-8 h-8 rounded-lg mb-2"
            sparklineTrend="surge"
            sparklineColor="#34D399"
            variant="glass-mobile"
          />

          {/* 2. Total Orders */}
          <MetricCard
            id="m-orders"
            label="Total Orders"
            value={formatNumber(mobileSummary.totalOrders)}
            subLabel=""
            trendText="↑ 8%"
            trendPositive={true}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            iconContainerClassName="bg-blue-500/30 border-blue-400/40 text-blue-300 w-8 h-8 rounded-lg mb-2"
            sparklineTrend="up"
            sparklineColor="#38BDF8"
            variant="glass-mobile"
          />

          {/* 3. Active Stores */}
          <MetricCard
            id="m-stores"
            label="Active Stores"
            value={formatNumber(mobileSummary.activeStores)}
            subLabel="100% operational"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            iconContainerClassName="bg-purple-500/30 border-purple-400/40 text-purple-300 w-8 h-8 rounded-lg mb-2"
            variant="glass-mobile"
          />

          {/* 4. Total Inventory Value */}
          <MetricCard
            id="m-val"
            label="Inventory Value"
            value={formatCurrency(mobileSummary.inventoryValue, true)}
            subLabel=""
            trendText="↓ 3%"
            trendPositive={false}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            iconContainerClassName="bg-rose-500/30 border-rose-400/40 text-rose-300 w-8 h-8 rounded-lg mb-2"
            sparklineTrend="down"
            sparklineColor="#FB7185"
            variant="glass-mobile"
          />
        </div>
      )}
    </div>
  );
}
