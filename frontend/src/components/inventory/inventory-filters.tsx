"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { SearchIcon, RefreshCwIcon, XIcon } from "@/components/ui/icons";
import type { FilterOption, StockStatus } from "@/types/inventory";

export interface InventoryFiltersProps {
  search: string;
  regionId: string;
  storeId: string;
  categoryId: string;
  status: StockStatus;
  regions: FilterOption[];
  stores: FilterOption[];
  categories: FilterOption[];
  onSearchChange: (search: string) => void;
  onRegionChange: (regionId: string) => void;
  onStoreChange: (storeId: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onStatusChange: (status: StockStatus) => void;
  onResetFilters: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function InventoryFilters({
  search,
  regionId,
  storeId,
  categoryId,
  status,
  regions,
  stores,
  categories,
  onSearchChange,
  onRegionChange,
  onStoreChange,
  onCategoryChange,
  onStatusChange,
  onResetFilters,
  isMobileOpen = false,
  onMobileClose
}: InventoryFiltersProps) {
  // Filter stores according to selected region
  const filteredStores = React.useMemo(() => {
    if (!regionId || regionId === "ALL") {
      return stores;
    }
    return stores.filter((s) => s.regionId === regionId);
  }, [stores, regionId]);

  const hasActiveFilters = Boolean(
    search.trim() ||
      regionId !== "ALL" ||
      storeId !== "ALL" ||
      categoryId !== "ALL" ||
      status !== "ALL"
  );

  const activeFilterCount = [
    Boolean(search.trim()),
    regionId !== "ALL",
    storeId !== "ALL",
    categoryId !== "ALL",
    status !== "ALL"
  ].filter(Boolean).length;

  const filterForm = (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 sm:gap-3 w-full">
      {/* Search Input */}
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search by product name, SKU, or barcode..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          startIcon={<SearchIcon className="w-4 h-4 text-slate-400" />}
          endIcon={
            search ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label="Clear search"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            ) : null
          }
          sizeVariant="sm"
          className="bg-white/90 text-xs"
        />
      </div>

      {/* Region Select */}
      <div className="w-full md:w-40">
        <Select
          id="inventory-region-select"
          value={regionId}
          onChange={(e) => {
            onRegionChange(e.target.value);
            // If changing region invalidates current store, reset store
            if (storeId !== "ALL" && e.target.value !== "ALL") {
              const matches = stores.some(
                (s) => s.id === storeId && s.regionId === e.target.value
              );
              if (!matches) onStoreChange("ALL");
            }
          }}
          sizeVariant="sm"
          className="bg-white/90 text-xs"
          aria-label="Filter by region"
        >
          <option value="ALL">All Regions</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Store Select */}
      <div className="w-full md:w-44">
        <Select
          id="inventory-store-select"
          value={storeId}
          onChange={(e) => onStoreChange(e.target.value)}
          sizeVariant="sm"
          className="bg-white/90 text-xs"
          aria-label="Filter by store"
        >
          <option value="ALL">All Stores</option>
          {filteredStores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Category Select */}
      <div className="w-full md:w-40">
        <Select
          id="inventory-category-select"
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          sizeVariant="sm"
          className="bg-white/90 text-xs"
          aria-label="Filter by category"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Status Select */}
      <div className="w-full md:w-36">
        <Select
          id="inventory-status-select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StockStatus)}
          sizeVariant="sm"
          className="bg-white/90 text-xs"
          aria-label="Filter by stock status"
        >
          <option value="ALL">All Status</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </Select>
      </div>

      {/* Reset Filters Button */}
      {hasActiveFilters && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="whitespace-nowrap h-8 px-2.5 text-xs text-slate-600 hover:text-slate-900 border-slate-300"
          title="Reset all filters"
        >
          <RefreshCwIcon className="w-3.5 h-3.5 mr-1" />
          Reset ({activeFilterCount})
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet Filters Bar */}
      <div className="hidden md:block p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-xs">
        {filterForm}
      </div>

      {/* Mobile Drawer (reusing Sheet with the exact same filter controls) */}
      {onMobileClose && (
        <Sheet
          isOpen={isMobileOpen}
          onClose={onMobileClose}
          title={`Inventory Filters ${activeFilterCount > 0 ? `(${activeFilterCount})` : ""}`}
          side="bottom"
          className="max-h-[80vh]"
        >
          <div className="space-y-4 pt-1">
            {filterForm}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onResetFilters();
                    onMobileClose();
                  }}
                >
                  Clear All
                </Button>
              )}
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onMobileClose}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </Sheet>
      )}
    </>
  );
}
