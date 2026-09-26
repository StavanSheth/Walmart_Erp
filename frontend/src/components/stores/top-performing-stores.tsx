"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronRightIcon, HeartIcon } from "@/components/ui/icons";
import { StoreStatusBadge } from "./store-status-badge";
import { Skeleton } from "@/components/common/loading-state";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { TopPerformerStore } from "@/types/stores";

interface TopPerformingStoresProps {
  stores: TopPerformerStore[];
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
  currentStoreCode?: string;
  isLoading?: boolean;
}

export function TopPerformingStores({
  stores,
  selectedStoreId,
  onSelectStore,
  onViewDetail,
  onViewAll,
  isLoading = false
}: TopPerformingStoresProps) {
  const [favorites, setFavorites] = React.useState<Record<string, boolean>>({});

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-2">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-900">
          Top Performing Stores
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

      {/* Cards List: Horizontal scroll on mobile, 3-column grid on desktop */}
      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-[240px] sm:w-auto shrink-0 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5"
            >
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-4 w-full rounded" />
            </div>
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="p-6 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200/80">
          No store sales data recorded.
        </div>
      ) : (
        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 no-scrollbar snap-x">
          {stores.map((store) => {
            const isSelected = store.id === selectedStoreId;
            const isFav = Boolean(favorites[store.id]);

            return (
              <StoreCardItem
                key={store.id}
                store={store}
                isSelected={isSelected}
                isFav={isFav}
                onSelectStore={onSelectStore}
                onViewDetail={onViewDetail}
                onToggleFavorite={toggleFavorite}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function StoreCardItem({
  store,
  isSelected,
  isFav,
  onSelectStore,
  onViewDetail,
  onToggleFavorite
}: {
  store: TopPerformerStore;
  isSelected: boolean;
  isFav: boolean;
  onSelectStore: (id: string) => void;
  onViewDetail: (id: string) => void;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
}) {
  const [imgError, setImgError] = React.useState(false);
  const imageSrc =
    !imgError && store.image
      ? store.image
      : "/images/banners/walmart-supercenter-twilight.png";

  return (
    <div
      onClick={() => {
        onSelectStore(store.id);
        onViewDetail(store.id);
      }}
      className={cn(
        "w-[210px] sm:w-auto shrink-0 p-2 sm:p-2.5 rounded-2xl bg-white border transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between snap-start",
        isSelected
          ? "border-[#0071DC] ring-2 ring-[#0071DC]/20 shadow-sm"
          : "border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-sm"
      )}
    >
      {/* Store Image with Heart Favorite Button */}
      <div className="h-24 sm:h-28 w-full rounded-xl relative overflow-hidden bg-slate-100 shrink-0">
        <Image
          src={imageSrc}
          alt={store.name}
          fill
          onError={() => setImgError(true)}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 210px, 33vw"
          unoptimized
        />
        {/* Heart Favorite Button */}
        <button
          type="button"
          onClick={(e) => onToggleFavorite(e, store.id)}
          className={cn(
            "absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs transition-colors cursor-pointer",
            isFav ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
          )}
          aria-label="Favorite store"
        >
          <HeartIcon className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      {/* Name & Code */}
      <div className="mt-2">
        <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate group-hover:text-[#0071DC] transition-colors leading-tight">
          {store.name}
        </h4>
        <span className="font-mono text-[10px] sm:text-2xs text-slate-400 font-medium block mt-0.5">
          #{store.code}
        </span>
      </div>

      {/* Bottom line: Financial metric + trend + status badge */}
      <div className="mt-2 flex items-center justify-between gap-1 pt-1.5 border-t border-slate-100">
        <div className="flex items-baseline gap-1">
          <span className="font-black text-xs sm:text-sm text-slate-900 tabular-nums">
            {formatCurrency(store.salesRevenue, true)}
          </span>
          {store.salesChangePct != null ? (
            <span
              className={cn(
                "text-[10px] sm:text-2xs font-bold tabular-nums",
                store.salesChangePct >= 0 ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {store.salesChangePct >= 0 ? `↑ ${store.salesChangePct}%` : `↓ ${Math.abs(store.salesChangePct)}%`}
            </span>
          ) : null}
        </div>

        <StoreStatusBadge status={store.status} size="sm" />
      </div>
    </div>
  );
}
