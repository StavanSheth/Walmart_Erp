"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useInventoryDetail } from "@/hooks/use-inventory";
import { Skeleton } from "@/components/common/loading-state";
import { InventoryMovementTable } from "./inventory-movement-table";

export interface InventoryDetailModalProps {
  inventoryId: string | null;
  onClose: () => void;
}

export function InventoryDetailModal({
  inventoryId,
  onClose
}: InventoryDetailModalProps) {
  const { data, isLoading, isError, error } = useInventoryDetail(inventoryId);

  const item = data?.item;
  const recentMovements = data?.recentMovements || [];

  return (
    <Modal
      isOpen={Boolean(inventoryId)}
      onClose={onClose}
      title={item ? item.productName : "Inventory Details"}
      description={item ? `SKU: ${item.sku} • Store: ${item.storeName}` : undefined}
      size="lg"
    >
      {isLoading ? (
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-3 rounded-lg border border-border bg-surface-subtle">
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-border-subtle">
            <Skeleton className="h-4 w-36 mb-3" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      ) : isError ? (
        <div className="p-4 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 text-xs">
          Failed to load inventory details: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      ) : item ? (
        <div className="space-y-5">
          {/* Status and Top summary */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-surface-subtle border border-border-subtle">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              <StatusBadge status={item.status} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Unit:</span>
              <span className="text-xs font-medium text-slate-800 uppercase px-2 py-0.5 rounded bg-surface border border-border">
                {item.unit}
              </span>
            </div>
          </div>

          {/* Product & Store Identifiers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Product & Location
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg border border-border bg-surface">
                <span className="text-slate-400 block text-[10px]">SKU</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">{item.sku}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-surface">
                <span className="text-slate-400 block text-[10px]">Barcode</span>
                <span className="font-mono font-medium text-slate-800 tabular-nums">
                  {item.barcode || "N/A"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-surface">
                <span className="text-slate-400 block text-[10px]">Category</span>
                <span className="font-medium text-slate-900">{item.categoryName}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-surface col-span-2 sm:col-span-2">
                <span className="text-slate-400 block text-[10px]">Store Outlet</span>
                <span className="font-medium text-slate-900">{item.storeName} ({item.storeCode})</span>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-surface">
                <span className="text-slate-400 block text-[10px]">Store Coverage</span>
                <span className="font-bold text-emerald-700">{item.storeCoverage}%</span>
              </div>
            </div>
          </div>

          {/* Stock Levels */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Stock Levels
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg border border-border bg-surface">
                <span className="text-slate-400 block text-[10px]">On Hand</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatNumber(item.onHand)}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-surface">
                <span className="text-slate-400 block text-[10px]">Reserved</span>
                <span className="font-medium text-slate-600 tabular-nums">{formatNumber(item.reserved)}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/40">
                <span className="text-brand-primary block text-[10px] font-semibold">Available Stock</span>
                <span className="font-bold text-slate-900 text-sm tabular-nums">
                  {formatNumber(item.available ?? (item.onHand - item.reserved))}
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-surface">
                <span className="text-slate-400 block text-[10px]">Reorder Level</span>
                <span className="font-semibold text-amber-700 tabular-nums">{item.reorderLevel}</span>
              </div>
            </div>
          </div>

          {/* Valuation & Pricing */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Pricing & Valuation
            </h4>
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg border border-border bg-surface">
                <span className="text-slate-400 block text-[10px]">Cost Price</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatCurrency(item.costPrice)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-surface">
                <span className="text-slate-400 block text-[10px]">Selling Price</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatCurrency(item.sellingPrice)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/40">
                <span className="text-emerald-800 block text-[10px] font-semibold">Inventory Value</span>
                <span className="font-bold text-emerald-950 text-sm tabular-nums">
                  {formatCurrency(item.inventoryValue)}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Movement History (latest 10) */}
          <div className="pt-2 border-t border-border-subtle">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Recent Movements ({recentMovements.length})
              </h4>
              <span className="text-[10px] text-slate-400">Latest activity records</span>
            </div>

            <InventoryMovementTable
              movements={recentMovements}
              mode="detail"
              emptyTitle="No recent movements"
              emptyDescription="No recent movements recorded for this inventory item."
            />
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
