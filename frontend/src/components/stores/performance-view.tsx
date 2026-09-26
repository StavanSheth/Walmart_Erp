"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StoreStatusBadge } from "./store-status-badge";
import { formatCurrency, formatNumber } from "@/lib/format";
import { StoreIcon, StoreNavIcon, ChevronRightIcon, TrendingUpIcon, CartIcon, CheckCircleIcon, SparkIcon } from "@/components/ui/icons";
import type { StoreNetworkPoint, StorePerformanceSummary, StorePeriod } from "@/types/stores";

interface PerformanceViewProps {
  stores: StoreNetworkPoint[];
  performance: StorePerformanceSummary;
  selectedPeriod: StorePeriod;
  onPeriodChange: (period: StorePeriod) => void;
  onSelectStore: (storeId: string) => void;
  onViewDetail: (storeId: string) => void;
}

export function PerformanceView({
  stores,
  performance,
  selectedPeriod,
  onPeriodChange,
  onSelectStore,
  onViewDetail
}: PerformanceViewProps) {
  // Sort stores by sales revenue descending
  const sortedStores = React.useMemo(() => {
    return [...stores].sort((a, b) => b.salesRevenue - a.salesRevenue);
  }, [stores]);

  const maxRevenue = React.useMemo(() => {
    return Math.max(...sortedStores.map((s) => s.salesRevenue), 1);
  }, [sortedStores]);

  return (
    <div className="space-y-4">
      {/* Top Banner with Performance Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Period Sales */}
        <Card className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-50/20 to-white border border-emerald-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold text-emerald-800 uppercase tracking-wide">Period Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-300/40 flex items-center justify-center text-emerald-600 shrink-0">
              <TrendingUpIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {formatCurrency(performance.salesRevenue, true)}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-2xs text-emerald-700 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Completed orders realized</span>
          </div>
        </Card>

        {/* Units Sold */}
        <Card className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-50/20 to-white border border-purple-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold text-purple-800 uppercase tracking-wide">Units Sold</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-300/40 flex items-center justify-center text-purple-600 shrink-0">
              <CartIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {formatNumber(performance.unitsSold)}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-2xs text-purple-700 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span>Total line item volume</span>
          </div>
        </Card>

        {/* Fill Rate */}
        <Card className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-50/20 to-white border border-blue-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold text-blue-800 uppercase tracking-wide">Fill Rate</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-300/40 flex items-center justify-center text-[#0071DC] shrink-0">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {performance.inventoryFillRate}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#0071DC] to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, performance.inventoryFillRate)}%` }}
            />
          </div>
          <span className="text-2xs text-blue-700 font-medium mt-1 block">Active SKU availability</span>
        </Card>

        {/* Active Outlets */}
        <Card className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-50/20 to-white border border-amber-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold text-amber-800 uppercase tracking-wide">Active Outlets</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-300/40 flex items-center justify-center text-amber-600 shrink-0">
              <StoreNavIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {performance.activeStoresCount}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-2xs text-amber-700 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Stores generating orders</span>
          </div>
        </Card>
      </div>

      {/* Store Leaderboard Table */}
      <Card className="rounded-2xl border-slate-200/80 shadow-2xs overflow-hidden">
        <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Store Sales Performance Leaderboard</span>
              <SparkIcon className="w-4 h-4" />
            </CardTitle>
            <p className="text-xs text-slate-500 font-medium">
              Ranked breakdown of store sales and localized inventory valuation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(e.target.value as StorePeriod)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="ytd">Year to Date (YTD)</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-2xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Rank & Store</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Sales Revenue</th>
                  <th className="py-3 px-4 text-right">Inventory Valuation</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedStores.map((store, idx) => {
                  const rank = idx + 1;
                  const rankBadgeClass =
                    rank === 1
                      ? "bg-amber-100 text-amber-800 border border-amber-300 font-extrabold shadow-2xs"
                      : rank === 2
                      ? "bg-slate-200 text-slate-700 border border-slate-300 font-bold"
                      : rank === 3
                      ? "bg-orange-100 text-orange-800 border border-orange-300 font-bold"
                      : "bg-slate-50 text-slate-400 font-medium";

                  const revenuePct = Math.round((store.salesRevenue / maxRevenue) * 100);

                  return (
                    <tr
                      key={store.id}
                      onClick={() => {
                        onSelectStore(store.id);
                        onViewDetail(store.id);
                      }}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-2xs tabular-nums shrink-0 ${rankBadgeClass}`}
                          >
                            {rank}
                          </span>
                          <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100/60 transition-colors flex items-center justify-center shrink-0 overflow-hidden">
                            <StoreIcon className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block group-hover:text-brand-primary transition-colors">
                              {store.name}
                            </span>
                            <span className="font-mono text-2xs text-slate-400">
                              {store.code} • {store.city}, {store.state}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium bg-blue-50 text-[#0071DC] border border-blue-100/80">
                          {store.region?.name || "General"}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <StoreStatusBadge status={store.status} size="sm" isNewThisYear={store.isNewThisYear} />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-slate-900 tabular-nums block">
                          {formatCurrency(store.salesRevenue)}
                        </span>
                        <div className="w-20 ml-auto bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${revenuePct}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right text-slate-700 tabular-nums font-medium">
                        {formatCurrency(store.inventoryValue)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetail(store.id);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:text-brand-primary/80 group-hover:translate-x-0.5 transition-transform"
                        >
                          <span>Details</span>
                          <ChevronRightIcon className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
