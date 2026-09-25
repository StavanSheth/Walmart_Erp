"use client";

import * as React from "react";
import { Skeleton } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { StatusBadge } from "@/components/ui/badge";
import { PackageIcon } from "@/components/ui/icons";
import { ProductImage } from "@/components/common/product-image";
import { Pagination } from "@/components/common/pagination";
import { MobileDataCard } from "@/components/common/mobile-data-card";
import { formatCurrency, formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { InventoryItem, InventoryTab, PaginationInfo } from "@/types/inventory";

export interface InventoryProductsProps {
  items?: InventoryItem[];
  pagination?: PaginationInfo;
  currentTab?: InventoryTab;
  onTabChange?: (tab: InventoryTab) => void;
  onPageChange?: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;
  onRowClick: (item: InventoryItem) => void;
  isLoading?: boolean;
}

export function InventoryProducts({
  items = [],
  pagination,
  currentTab = "all",
  onTabChange,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  isLoading = false
}: InventoryProductsProps) {
  const tabs: { id: InventoryTab; label: string }[] = [
    { id: "all", label: "All Items" },
    { id: "most-stocked", label: "Most Stocked" },
    { id: "low-stock", label: "Low Stock" },
    { id: "out-of-stock", label: "Out of Stock" }
  ];

  const currentPage = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? 25;
  const totalItems = pagination?.total ?? items.length;
  const totalPages = pagination?.totalPages ?? Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header with Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
            <PackageIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
              Catalog Inventory
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {totalItems} total products recorded
            </span>
          </div>
        </div>

        {/* Status / Sort Tabs */}
        <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200/60 overflow-x-auto max-w-full">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange && onTabChange(t.id)}
              className="cursor-pointer"
            >
              <span
                className={cn(
                  "px-2.5 py-1 text-[11px] font-bold rounded-lg transition whitespace-nowrap block",
                  currentTab === t.id
                    ? "bg-brand-primary text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="pt-2 flex-1 flex flex-col justify-between">
        {isLoading ? (
          <div className="space-y-3 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100">
                <Skeleton className="h-4 w-6 rounded" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-16 rounded ml-auto" />
                <Skeleton className="h-4 w-14 rounded" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No products found"
            description="No inventory records match the current criteria."
            className="py-10"
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto overflow-y-auto max-h-[340px] -mx-4 sm:-mx-5 px-4 sm:px-5">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-white z-10 shadow-2xs">
                  <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-white">
                    <th scope="col" className="py-2.5 pr-2 w-6 bg-white">#</th>
                    <th scope="col" className="py-2.5 px-2.5 min-w-[150px] bg-white">Product</th>
                    <th scope="col" className="py-2.5 px-2 bg-white">SKU</th>
                    <th scope="col" className="py-2.5 px-2 bg-white">Store</th>
                    <th scope="col" className="py-2.5 px-2 bg-white">Category</th>
                    <th scope="col" className="py-2.5 px-2 text-right bg-white">On Hand</th>
                    <th scope="col" className="py-2.5 px-2 text-right bg-white">Reserved</th>
                    <th scope="col" className="py-2.5 px-2 text-right bg-white">Available</th>
                    <th scope="col" className="py-2.5 px-2 text-right bg-white">Reorder</th>
                    <th scope="col" className="py-2.5 px-2 text-right bg-white">Cost</th>
                    <th scope="col" className="py-2.5 px-2 text-right bg-white">Value</th>
                    <th scope="col" className="py-2.5 px-2.5 text-center bg-white">Status</th>
                    <th scope="col" className="py-2.5 pl-2 text-right w-8 bg-white"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {items.map((item, index) => {
                    const rowNumber = (currentPage - 1) * pageSize + index + 1;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => onRowClick(item)}
                        className="hover:bg-slate-50/80 cursor-pointer transition group"
                      >
                        <td className="py-2.5 pr-2 text-slate-400 font-semibold">{rowNumber}</td>
                        <td className="py-2.5 px-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <ProductImage src={item.image} alt={item.productName} size="sm" />
                            <div className="min-w-0 flex flex-col">
                              <span className="font-bold text-slate-900 truncate group-hover:text-brand-primary transition">
                                {item.productName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-slate-500 font-mono text-[11px]">{item.sku}</td>
                        <td className="py-2.5 px-2 text-slate-600 truncate max-w-[120px]">{item.storeName || "—"}</td>
                        <td className="py-2.5 px-2 text-slate-600 truncate max-w-[110px]">{item.categoryName}</td>
                        <td className="py-2.5 px-2 text-right font-bold text-slate-900 tabular-nums">
                          {formatNumber(item.onHand)}
                        </td>
                        <td className="py-2.5 px-2 text-right text-slate-500 tabular-nums">
                          {formatNumber(item.reserved)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-bold text-emerald-600 tabular-nums">
                          {formatNumber(item.available)}
                        </td>
                        <td className="py-2.5 px-2 text-right text-slate-400 tabular-nums">
                          {formatNumber(item.reorderLevel)}
                        </td>
                        <td className="py-2.5 px-2 text-right text-slate-600 tabular-nums">
                          {formatCurrency(item.costPrice)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-bold text-slate-900 tabular-nums">
                          {formatCurrency(item.inventoryValue)}
                        </td>
                        <td className="py-2.5 px-2.5 text-center">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="py-2.5 pl-2 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRowClick(item);
                            }}
                            className="w-6 h-6 rounded-lg hover:bg-slate-200/60 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
                            title="View Details"
                            aria-label={`View details for ${item.productName}`}
                          >
                            •••
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Data Card List: Product, SKU, Store, Available, Inv. Value, Status */}
            <div className="md:hidden space-y-2.5 py-1 max-h-[380px] overflow-y-auto">
              {items.map((item) => (
                <MobileDataCard
                  key={item.id}
                  title={item.productName}
                  subtitle={item.sku}
                  thumbnail={<ProductImage src={item.image} alt={item.productName} size="sm" />}
                  badge={<StatusBadge status={item.status} />}
                  onClick={() => onRowClick(item)}
                  fields={[
                    { label: "Store", value: item.storeName || "All Stores" },
                    { label: "Available", value: formatNumber(item.available) },
                    { label: "Inv. Value", value: formatCurrency(item.inventoryValue) }
                  ]}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Centralized Pagination Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={(p) => onPageChange && onPageChange(p)}
          onPageSizeChange={(s) => onPageSizeChange && onPageSizeChange(s)}
        />
      </div>
    </div>
  );
}
