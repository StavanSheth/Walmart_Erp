"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StoreStatusBadge } from "./store-status-badge";
import { StoresAlerts } from "./stores-alerts";
import { StoreIcon, StoreNavIcon, AlertTriangleIcon, CheckCircleIcon } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/format";
import type { StoreNetworkPoint, StoreAlertItem } from "@/types/stores";

interface OperationsViewProps {
  stores: StoreNetworkPoint[];
  alerts: StoreAlertItem[];
  onSelectStore: (storeId: string) => void;
  onViewDetail: (storeId: string) => void;
}

export function OperationsView({
  stores,
  alerts,
  onSelectStore,
  onViewDetail
}: OperationsViewProps) {
  const operationalStores = stores.filter((s) => s.status === "ACTIVE");
  const maintenanceStores = stores.filter((s) => s.status === "MAINTENANCE");
  const networkUptime = Math.round((operationalStores.length / Math.max(1, stores.length)) * 100);

  return (
    <div className="space-y-5">
      {/* Network Operational Health Quick Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-50/20 to-white border border-emerald-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-300/40 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircleIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-slate-900 tabular-nums">{networkUptime}%</span>
              <span className="text-2xs font-semibold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                Optimal
              </span>
            </div>
            <p className="text-2xs text-slate-500 font-medium">Store Network Availability</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-50/20 to-white border border-blue-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-300/40 flex items-center justify-center text-[#0071DC] shrink-0">
            <StoreNavIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-slate-900 tabular-nums">{operationalStores.length}</span>
              <span className="text-2xs font-semibold px-1.5 py-0.5 rounded-md bg-blue-100 text-[#0071DC]">
                Serving
              </span>
            </div>
            <p className="text-2xs text-slate-500 font-medium">Active Operating Outlets</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-50/20 to-white border border-amber-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-300/40 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangleIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-slate-900 tabular-nums">{maintenanceStores.length}</span>
              <span className="text-2xs font-semibold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                In Review
              </span>
            </div>
            <p className="text-2xs text-slate-500 font-medium">Under Facility Maintenance</p>
          </div>
        </div>
      </div>

      {/* Maintenance Watchlist (if any) */}
      {maintenanceStores.length > 0 && (
        <Card className="rounded-2xl border-amber-300 bg-gradient-to-br from-amber-50/40 to-white shadow-2xs overflow-hidden">
          <CardHeader className="p-4 pb-2 border-b border-amber-200/70 flex flex-row items-center justify-between text-amber-900">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-700">
                <AlertTriangleIcon className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-amber-950 flex items-center gap-2">
                  <span>Facility Maintenance Queue ({maintenanceStores.length})</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                </CardTitle>
                <p className="text-2xs text-amber-800 font-medium">
                  Active equipment overhaul, HVAC maintenance, or POS infrastructure audits
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {maintenanceStores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => {
                    onSelectStore(store.id);
                    onViewDetail(store.id);
                  }}
                  className="p-3.5 rounded-xl bg-white border border-amber-200/90 shadow-2xs hover:shadow-xs hover:border-amber-300 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                      <StoreIcon className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-amber-900 transition-colors">
                        {store.name}
                      </h4>
                      <p className="text-2xs text-slate-500 font-mono mt-0.5">
                        {store.code} • {store.city}, {store.state}
                      </p>
                    </div>
                  </div>

                  <StoreStatusBadge status="MAINTENANCE" size="sm" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid: Operational Outlets vs Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Operational Outlets */}
        <Card className="rounded-2xl border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
          <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                <CheckCircleIcon className="w-3.5 h-3.5" />
              </div>
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900">
                Operational Outlets ({operationalStores.length})
              </CardTitle>
            </div>
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              All Green
            </span>
          </CardHeader>

          <CardContent className="p-3 divide-y divide-slate-100 max-h-[300px] sm:max-h-[320px] overflow-y-auto pr-1.5 [scrollbar-width:thin] [scrollbar-color:#94a3b8_#f1f5f9] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-400/80 hover:[&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-thumb]:rounded-full">
            {operationalStores.map((store) => (
              <div
                key={store.id}
                onClick={() => {
                  onSelectStore(store.id);
                  onViewDetail(store.id);
                }}
                className="py-2.5 px-2.5 flex items-center justify-between hover:bg-blue-50/40 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100/60 transition-colors flex items-center justify-center shrink-0 overflow-hidden">
                    <StoreIcon className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 group-hover:text-brand-primary transition-colors">
                      {store.name}
                    </h5>
                    <p className="text-2xs text-slate-400 font-mono">
                      {store.code} • {store.city} {store.region ? `• ${store.region.name}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {store.salesRevenue > 0 && (
                    <span className="hidden sm:inline-block font-mono text-2xs font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md">
                      {formatCurrency(store.salesRevenue, true)}
                    </span>
                  )}
                  <StoreStatusBadge status="ACTIVE" size="sm" isNewThisYear={store.isNewThisYear} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Operational Alerts */}
        <div className="flex flex-col">
          <StoresAlerts
            alerts={alerts}
            onSelectStore={onSelectStore}
            onViewDetail={onViewDetail}
          />
        </div>
      </div>
    </div>
  );
}
