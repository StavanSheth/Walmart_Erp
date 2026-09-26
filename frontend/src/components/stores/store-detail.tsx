"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { StoreStatusBadge } from "./store-status-badge";
import { Skeleton } from "@/components/common/loading-state";
import { useStoreDetail } from "@/hooks/use-stores";
import { formatCurrency, formatShortDate } from "@/lib/format";
import { StoreIcon, CheckIcon, MapPinIcon, PhoneIcon, MailIcon, UserIcon, AlertTriangleIcon } from "@/components/ui/icons";

interface StoreDetailModalProps {
  storeId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSwitchStore?: (store: {
    id: string;
    name: string;
    code: string;
    city: string;
    state: string;
    region: string;
    address?: string | null;
    phone?: string | null;
  }) => void;
  isCurrentStore?: boolean;
}

export function StoreDetailModal({
  storeId,
  isOpen,
  onClose,
  onSwitchStore,
  isCurrentStore = false
}: StoreDetailModalProps) {
  const { data, isLoading } = useStoreDetail(isOpen ? storeId : null);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Store Profile & Operations"
      description="Detailed telemetry, sales performance, and local inventory health."
    >
      {isLoading || !data ? (
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-5 w-48 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-36 rounded-xl" />
        </div>
      ) : (
        <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-sky text-brand-primary border border-blue-200 flex items-center justify-center shrink-0 overflow-hidden">
                <StoreIcon className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    {data.store.code}
                  </span>
                  <StoreStatusBadge status={data.store.status} size="sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {data.store.name}
                </h3>
              </div>
            </div>

            {onSwitchStore && (
              <Button
                variant={isCurrentStore ? "secondary" : "primary"}
                size="sm"
                className="self-start sm:self-center shrink-0 text-xs"
                onClick={() => {
                  onSwitchStore({
                    id: data.store.id,
                    name: data.store.name,
                    code: data.store.code,
                    city: data.store.city || "",
                    state: data.store.state || "",
                    region: data.store.region?.name || "General",
                    address: data.store.address,
                    phone: data.store.phone
                  });
                }}
              >
                {isCurrentStore ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 mr-1 text-brand-primary" /> Active Outlet
                  </>
                ) : (
                  <>
                    <StoreIcon className="w-3.5 h-3.5 mr-1" /> Switch to Store
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Contact & Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex items-start gap-2">
              <MapPinIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-slate-900 block">Address</span>
                <span>{data.store.address || "No address"}, {data.store.city}, {data.store.state} {data.store.pincode}</span>
                <span className="text-slate-400 block text-2xs mt-0.5">
                  GPS: {data.store.latitude != null && data.store.longitude != null ? `${data.store.latitude}, ${data.store.longitude}` : "Missing Coordinates"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong className="text-slate-900">Manager:</strong> {data.store.manager?.name || "Unassigned"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono">{data.store.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{data.store.email || "—"}</span>
              </div>
            </div>
          </div>

          {/* Metric Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xs text-slate-500 font-semibold block">Total Revenue</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                {formatCurrency(data.metrics.salesRevenue, true)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {data.metrics.completedOrders} completed orders
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xs text-slate-500 font-semibold block">Avg Order Value</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                {formatCurrency(data.metrics.averageOrderValue)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Per sales transaction</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xs text-slate-500 font-semibold block">Inventory Valuation</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                {formatCurrency(data.metrics.inventoryValuation, true)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {data.metrics.totalUnits} on-hand units
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xs text-slate-500 font-semibold block">Tracked SKUs</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                {data.metrics.totalSkus}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {data.metrics.lowStockCount > 0 ? (
                  <span className="text-amber-600 font-semibold">{data.metrics.lowStockCount} low stock</span>
                ) : (
                  "Optimal stock"
                )}
              </span>
            </div>
          </div>

          {/* Low Stock Items Section (if any) */}
          {data.lowStockItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <AlertTriangleIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>Low Stock Watchlist ({data.lowStockItems.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs">
                {data.lowStockItems.map((item) => (
                  <div key={item.id} className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/60 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block truncate">{item.productName}</span>
                      <span className="font-mono text-slate-500">{item.sku}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-rose-600 tabular-nums block">{item.onHand} {item.unit}</span>
                      <span className="text-slate-400">Reorder at {item.reorderLevel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900">Recent Completed Orders</h4>
            {data.recentOrders.length === 0 ? (
              <p className="text-2xs text-slate-400">No recent orders for this store.</p>
            ) : (
              <div className="rounded-xl border border-slate-200/80 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-2xs font-semibold">
                    <tr>
                      <th className="py-2 px-3">Order #</th>
                      <th className="py-2 px-3">Customer</th>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.recentOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/60">
                        <td className="py-2 px-3 font-mono font-bold text-slate-800">{o.orderNumber}</td>
                        <td className="py-2 px-3 text-slate-600 truncate">{o.customerName}</td>
                        <td className="py-2 px-3 text-slate-400 text-2xs">{formatShortDate(o.createdAt)}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900 tabular-nums">
                          {formatCurrency(o.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
