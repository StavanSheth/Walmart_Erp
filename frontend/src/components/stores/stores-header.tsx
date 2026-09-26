"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { StoreIcon, ChevronLeftIcon, ChevronDownIcon, SearchIcon, MapPinIcon } from "@/components/ui/icons";
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

  return (
    <div className="relative space-y-3 sm:space-y-4 pt-1 sm:pt-2">
      {/* Main Header / Hero Section over Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          {/* Back Action with Liquid Glass Styling */}
          <button
            type="button"
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md flex items-center justify-center text-white transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
            aria-label="Go back"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          {/* Store Icon Badge */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center shrink-0 text-white shadow-xs overflow-hidden">
            <StoreIcon className="w-full h-full object-cover" />
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight">
              Stores
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-medium drop-shadow-xs mt-0.5">
              Manage all Walmart stores across regions.
            </p>
          </div>
        </div>

        {/* Region Selector Pill Dropdown with Liquid Glass Styling */}
        <div className="relative self-start sm:self-center">
          <div className="flex items-center gap-1.5 bg-white/20 hover:bg-white/25 border border-white/30 backdrop-blur-md rounded-xl pl-3 pr-8 py-2 transition-all shadow-md cursor-pointer">
            <MapPinIcon className="w-3.5 h-3.5 text-blue-200 shrink-0" />
            <select
              value={selectedRegion}
              onChange={(e) => onSelectRegion(e.target.value)}
              className="appearance-none bg-transparent text-white text-xs sm:text-sm font-semibold cursor-pointer outline-none border-none pr-1"
              aria-label="Select Region"
            >
              <option value="ALL" className="text-slate-900 bg-white">
                All Regions
              </option>
              {regions.map((reg) => (
                <option key={reg.id} value={reg.id} className="text-slate-900 bg-white">
                  {reg.name} ({reg.storeCount})
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-3.5 h-3.5 text-white/80 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Search Input Row (Liquid Glass Input over banner) */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/70">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search stores, locations, or manager..."
            className="w-full bg-white/20 hover:bg-white/25 focus:bg-white/30 border border-white/30 focus:border-white/50 focus:ring-2 focus:ring-white/25 rounded-2xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-white/70 font-medium transition-all backdrop-blur-md outline-none shadow-md"
          />
          {localSearch ? (
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
          ) : (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-white/60">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <path d="M14 14h3v3h-3z" />
                <path d="M20 14v3h-3" />
                <path d="M14 20h3v-3" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
