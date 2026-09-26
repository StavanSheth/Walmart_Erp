"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { StoreIcon, ChevronLeftIcon, SearchIcon, MapPinIcon, CalendarIcon } from "@/components/ui/icons";
import type { RegionOption } from "@/types/stores";

interface StoresHeaderProps {
  regions: RegionOption[];
  selectedRegion: string;
  onSelectRegion: (regionId: string) => void;
  searchValue: string;
  onSearchChange: (search: string) => void;
}

export function StoresHeader({
  regions,
  selectedRegion,
  onSelectRegion,
  searchValue,
  onSearchChange
}: StoresHeaderProps) {
  const router = useRouter();
  const [localSearch, setLocalSearch] = React.useState(searchValue);

  const formattedDate = React.useMemo(() => {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(new Date());
  }, []);

  React.useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchValue) {
        onSearchChange(localSearch);
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [localSearch, searchValue, onSearchChange]);

  const totalStoreCount = React.useMemo(() => {
    return regions.reduce((acc, r) => acc + (r.storeCount || 0), 0);
  }, [regions]);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Mobile Search Bar (matches dashboard mobile search layout) */}
      <div className="block md:hidden">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/70">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search stores, locations, or manager..."
            className="w-full bg-white/20 hover:bg-white/25 focus:bg-white/30 border border-white/30 focus:border-white/50 focus:ring-1 focus:ring-white/40 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-white/70 font-medium transition-all backdrop-blur-md outline-none shadow-md"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch("");
                onSearchChange("");
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <span className="text-xs font-bold">✕</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Hero Header Section */}
      <div className="relative py-2 sm:py-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        {/* Left Side: Back button, Store Icon, Title, Subtitle, and Controls Pills */}
        <div className="space-y-2 max-w-2xl text-white">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md flex items-center justify-center text-white transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
              aria-label="Go back"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center shrink-0 text-white shadow-xs overflow-hidden">
              <StoreIcon className="w-full h-full object-cover" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight">
                Stores
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 font-medium drop-shadow-xs">
                Manage all Walmart stores across regions.
              </p>
            </div>
          </div>

          {/* Controls Row: Date Badge + Region Selector Pill */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
            {/* Date Badge */}
            <div className="h-8 inline-flex items-center gap-1.5 px-3 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white shadow-xs leading-none shrink-0 whitespace-nowrap">
              <CalendarIcon className="w-3.5 h-3.5 text-white/80 shrink-0" />
              <span>{formattedDate}</span>
            </div>

            {/* Region Selector Pill */}
            <div className="relative inline-flex items-center h-8 shrink-0">
              <MapPinIcon className="w-3.5 h-3.5 text-blue-200 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 shrink-0" />
              <select
                value={selectedRegion}
                onChange={(e) => onSelectRegion(e.target.value)}
                className="h-8 pl-8 pr-7 text-xs font-semibold rounded-full border border-white/25 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white focus:outline-none appearance-none cursor-pointer shadow-xs transition leading-none whitespace-nowrap"
                aria-label="Select Region"
              >
                <option value="ALL" className="text-slate-900 bg-white">
                  All Regions ({totalStoreCount})
                </option>
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id} className="text-slate-900 bg-white">
                    {reg.name} ({reg.storeCount})
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/80 text-[8px] flex items-center justify-center leading-none">
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Desktop Search Input Pill */}
        <div className="hidden md:block w-72 lg:w-80 pb-1">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/70">
              <SearchIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search stores, locations..."
              className="w-full h-8 pl-9 pr-8 text-xs font-semibold rounded-full border border-white/25 bg-white/20 hover:bg-white/30 focus:bg-white/35 backdrop-blur-md text-white placeholder-white/70 focus:outline-none shadow-xs transition"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  onSearchChange("");
                }}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-white/70 hover:text-white transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <span className="text-[11px] font-bold">✕</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
