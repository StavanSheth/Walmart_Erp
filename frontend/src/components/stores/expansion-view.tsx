"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StoreIcon, SparkIcon, AlertCircleIcon, MapPinIcon, CheckCircleIcon } from "@/components/ui/icons";
import type { StoreNetworkPoint, RegionOption, GeoQualitySummary } from "@/types/stores";

interface ExpansionViewProps {
  stores: StoreNetworkPoint[];
  regions: RegionOption[];
  geoQuality?: GeoQualitySummary;
  onSelectStore: (storeId: string) => void;
  onViewDetail: (storeId: string) => void;
}

export function ExpansionView({
  stores,
  regions,
  geoQuality,
  onSelectStore,
  onViewDetail
}: ExpansionViewProps) {
  const newStores = stores.filter((s) => s.isNewThisYear);
  const unmappedStores = stores.filter((s) => s.latitude == null || s.longitude == null);
  const totalStores = stores.length || 1;
  const coveragePct = geoQuality ? Math.round((geoQuality.mappedStores / Math.max(1, geoQuality.totalStores)) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* New Stores This Year */}
        <Card className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-50/20 to-white border border-purple-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold text-purple-800 uppercase tracking-wide">New Stores This Year</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-300/40 flex items-center justify-center shrink-0">
              <SparkIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {newStores.length}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-2xs text-purple-700 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span>Active outlets opened in 2026</span>
          </div>
        </Card>

        {/* Regional Footprint */}
        <Card className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-50/20 to-white border border-blue-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold text-blue-800 uppercase tracking-wide">Regional Footprint</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-300/40 flex items-center justify-center text-[#0071DC] shrink-0">
              <MapPinIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {regions.length} Regions
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-2xs text-blue-700 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0071DC]" />
            <span>Total geographic zones covered</span>
          </div>
        </Card>

        {/* GPS Coordinate Coverage */}
        <Card className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-50/20 to-white border border-emerald-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold text-emerald-800 uppercase tracking-wide">GPS Coverage</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-300/40 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {geoQuality ? `${geoQuality.mappedStores} / ${geoQuality.totalStores}` : `${stores.length} / ${stores.length}`}
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${coveragePct}%` }}
            />
          </div>
          <span className="text-2xs text-emerald-700 font-medium mt-1 block">
            {coveragePct}% mapped with coordinates
          </span>
        </Card>
      </div>

      {/* Regional Footprint Distribution */}
      <Card className="rounded-2xl border-slate-200/80 shadow-2xs overflow-hidden">
        <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-[#0071DC]" />
              <span>Regional Store Distribution</span>
            </CardTitle>
            <p className="text-xs text-slate-500 font-medium">
              Active store density and geographic allocation by administrative territory
            </p>
          </div>
          <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#0071DC] border border-blue-200/60">
            {regions.length} Zones
          </span>
        </CardHeader>

        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {regions.map((reg) => {
              const regPct = Math.round((reg.storeCount / totalStores) * 100);

              return (
                <div
                  key={reg.id}
                  className="p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 shadow-2xs space-y-2 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {reg.code}
                    </span>
                    <span className="text-xs font-bold text-slate-900 tabular-nums">
                      {reg.storeCount} {reg.storeCount === 1 ? "store" : "stores"}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800">{reg.name}</h4>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#0071DC] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(12, regPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Unmapped Stores Audit (Actionable data-quality signal) */}
      {unmappedStores.length > 0 && (
        <Card className="rounded-2xl border-amber-200 bg-gradient-to-br from-amber-50/30 to-white shadow-2xs overflow-hidden">
          <CardHeader className="p-4 pb-2 border-b border-amber-100 flex flex-row items-center gap-2 text-amber-900">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-700">
              <AlertCircleIcon className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base font-bold text-amber-950">
                Geographic Coverage Gaps ({unmappedStores.length})
              </CardTitle>
              <p className="text-2xs text-amber-800 font-medium">
                Stores registered in database without latitude/longitude coordinates
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-4 divide-y divide-amber-100/80">
            {unmappedStores.map((store) => (
              <div
                key={store.id}
                onClick={() => {
                  onSelectStore(store.id);
                  onViewDetail(store.id);
                }}
                className="py-2.5 flex items-center justify-between hover:bg-amber-100/40 rounded-xl px-2.5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/80 flex items-center justify-center shrink-0 overflow-hidden">
                    <StoreIcon className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 group-hover:text-amber-900 transition-colors">
                      {store.name}
                    </h5>
                    <p className="text-2xs text-slate-500 font-mono">
                      {store.code} • {store.city}, {store.state}
                    </p>
                  </div>
                </div>
                <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300/60">
                  Missing GPS
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
