"use client";

import * as React from "react";
import { ResponsiveTable, type Column } from "@/components/common/responsive-table";
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

  // Consolidated table column specifications using shared ResponsiveTable
  const columns: Column<InventoryItem>[] = [
    {
      key: "index",
      header: "#",
      className: "w-6 pr-2 text-slate-400 font-semibold",
      render: (_item, index) => (
        <span>{(currentPage - 1) * pageSize + index + 1}</span>
      )
    },
    {
      key: "product",
      header: "Product",
      className: "min-w-[150px] px-2.5",
      render: (item) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <ProductImage src={item.image} alt={item.productName} size="sm" />
          <span className="font-bold text-slate-900 truncate group-hover:text-brand-primary transition">
            {item.productName}
          </span>
        </div>
      )
    },
    {
      key: "sku",
      header: "SKU",
      className: "px-2 font-mono text-[11px] text-slate-500",
      render: (item) => item.sku
    },
    {
      key: "store",
      header: "Store",
      className: "px-2 text-slate-600 truncate max-w-[120px]",
      render: (item) => item.storeName || "—"
    },
    {
      key: "category",
      header: "Category",
      className: "px-2 text-slate-600 truncate max-w-[110px]",
      render: (item) => item.categoryName
    },
    {
      key: "onHand",
      header: "On Hand",
      align: "right",
      isNumeric: true,
      className: "px-2 font-bold text-slate-900 tabular-nums",
      render: (item) => formatNumber(item.onHand)
    },
    {
      key: "reserved",
      header: "Reserved",
      align: "right",
      isNumeric: true,
      className: "px-2 text-slate-500 tabular-nums",
      render: (item) => formatNumber(item.reserved)
    },
    {
      key: "available",
      header: "Available",
      align: "right",
      isNumeric: true,
      className: "px-2 font-bold text-emerald-600 tabular-nums",
      render: (item) => formatNumber(item.available)
    },
    {
      key: "reorderLevel",
      header: "Reorder",
      align: "right",
      isNumeric: true,
      className: "px-2 text-slate-400 tabular-nums",
      render: (item) => formatNumber(item.reorderLevel)
    },
    {
      key: "costPrice",
      header: "Cost",
      align: "right",
      isNumeric: true,
      className: "px-2 text-slate-600 tabular-nums",
      render: (item) => formatCurrency(item.costPrice)
    },
    {
      key: "inventoryValue",
      header: "Value",
      align: "right",
      isNumeric: true,
      className: "px-2 font-bold text-slate-900 tabular-nums",
      render: (item) => formatCurrency(item.inventoryValue)
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      className: "px-2.5",
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: "actions",
      header: "",
      align: "right",
      className: "w-8 pl-2",
      render: (item) => (
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
      )
    }
  ];

  // Mobile card presentation using MobileDataCard
  const renderMobileCard = (item: InventoryItem) => (
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
  );

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

      {/* Content Area using Shared ResponsiveTable with Vertical Scroll Bar */}
      <div className="pt-2 flex-1 flex flex-col justify-between">
        <ResponsiveTable<InventoryItem>
          data={items}
          columns={columns}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          onRowClick={onRowClick}
          density="compact"
          mobileView="card"
          renderMobileCard={renderMobileCard}
          maxHeight="max-h-[355px]"
          emptyTitle="No products found"
          emptyDescription="No inventory records match the current criteria."
        />
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
