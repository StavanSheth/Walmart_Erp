"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { ChevronRightIcon, StoreIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/common/loading-state";
import type { StoreNetworkPoint, GeoQualitySummary } from "@/types/stores";

const StoreNetworkMapInner = dynamic(
  () => import("./store-network-map-inner"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[260px] flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl gap-2 text-white">
        <StoreIcon className="w-10 h-10 rounded-xl object-cover animate-pulse shadow-md" />
        <p className="text-xs font-semibold text-slate-300">Loading interactive store network map...</p>
        <Skeleton className="w-48 h-2.5 rounded-full bg-slate-800" />
      </div>
    )
  }
);

interface StoreNetworkMapProps {
  stores: StoreNetworkPoint[];
  geoQuality?: GeoQualitySummary;
  selectedStoreId: string | null;
  onSelectStore: (storeId: string) => void;
  onViewDetail: (storeId: string) => void;
  onViewAll?: () => void;
  onSwitchStore?: (store: {
    id: string;
    name: string;
    code: string;
    city: string;
    state: string;
    region: string;
  }) => void;
  isLoading?: boolean;
}

export function StoreNetworkMap({
  stores,
  geoQuality: _geoQuality,
  selectedStoreId,
  onSelectStore,
  onViewDetail,
  onViewAll,
  onSwitchStore,
  isLoading = false
}: StoreNetworkMapProps) {
  return (
    <div className="space-y-2">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-900">
          Store Locations
        </h3>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-[#0071DC] hover:text-blue-700 flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Map Card */}
      <div className="h-[280px] sm:h-[340px] lg:h-[440px] xl:h-[480px] w-full relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs bg-[#061325]">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 text-white bg-slate-900">
            <StoreIcon className="w-10 h-10 rounded-xl object-cover animate-pulse shadow-md" />
            <p className="text-xs font-semibold text-slate-300">Loading store network...</p>
          </div>
        ) : (
          <StoreNetworkMapInner
            stores={stores}
            selectedStoreId={selectedStoreId}
            onSelectStore={onSelectStore}
            onViewDetail={onViewDetail}
            onSwitchStore={onSwitchStore}
          />
        )}
      </div>
    </div>
  );
}
