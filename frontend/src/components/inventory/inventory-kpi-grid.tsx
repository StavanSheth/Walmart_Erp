"use client";

import * as React from "react";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  PackageIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  TruckIcon,
  LedgerIcon
} from "@/components/ui/icons";
import type { InventorySummary, StockStatus } from "@/types/inventory";
import { MetricCard } from "@/components/common/metric-card";

export interface InventoryKPIGridProps {
  summary?: InventorySummary;
  isLoading?: boolean;
  selectedStatus?: StockStatus;
  onStatusClick?: (status: StockStatus) => void;
}

export function InventoryKPIGrid({
  summary,
  isLoading = false,
  selectedStatus = "ALL",
  onStatusClick
}: InventoryKPIGridProps) {
  if (isLoading || !summary) {
    return (
      <div>
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <MetricCard key={i} label="" value="" isLoading variant="glass" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <MetricCard
              key={i}
              label=""
              value=""
              isLoading
              variant="glass-mobile"
              className={i === 5 ? "col-span-2" : undefined}
            />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      id: "total-products",
      label: "Total Products",
      value: formatNumber(summary.totalProducts),
      status: "ALL" as StockStatus,
      iconContainer: "bg-blue-500/25 border-blue-400/35 text-blue-200",
      mobileIconContainer: "bg-blue-500/30 border-blue-400/40 text-blue-300",
      icon: <PackageIcon className="w-5 h-5" />,
      subLabel: "Active catalog items"
    },
    {
      id: "low-stock",
      label: "Low Stock Items",
      value: formatNumber(summary.lowStockItems),
      status: "LOW_STOCK" as StockStatus,
      iconContainer: "bg-amber-500/25 border-amber-400/35 text-amber-200",
      mobileIconContainer: "bg-amber-500/30 border-amber-400/40 text-amber-300",
      icon: <AlertTriangleIcon className="w-5 h-5" />,
      subLabel: "Requires reorder"
    },
    {
      id: "out-of-stock",
      label: "Out of Stock",
      value: formatNumber(summary.outOfStockItems),
      status: "OUT_OF_STOCK" as StockStatus,
      iconContainer: "bg-rose-500/25 border-rose-400/35 text-rose-200",
      mobileIconContainer: "bg-rose-500/30 border-rose-400/40 text-rose-300",
      icon: <AlertCircleIcon className="w-5 h-5" />,
      subLabel: "Immediate attention"
    },
    {
      id: "in-transit",
      label: "Incoming Stock",
      value: formatNumber(summary.inTransitItems),
      status: "ALL" as StockStatus,
      iconContainer: "bg-purple-500/25 border-purple-400/35 text-purple-200",
      mobileIconContainer: "bg-purple-500/30 border-purple-400/40 text-purple-300",
      icon: <TruckIcon className="w-5 h-5" />,
      subLabel: "Ordered purchase orders"
    },
    {
      id: "inventory-value",
      label: "Inventory Value",
      value: formatCurrency(summary.inventoryValue, true),
      status: "ALL" as StockStatus,
      iconContainer: "bg-emerald-500/25 border-emerald-400/35 text-emerald-200",
      mobileIconContainer: "bg-emerald-500/30 border-emerald-400/40 text-emerald-300",
      icon: <LedgerIcon className="w-5 h-5" />,
      subLabel: "Total valuation"
    }
  ];

  const handleCardClick = (card: (typeof cards)[number]) => {
    if (!onStatusClick) return;
    if (card.id === "total-products") {
      onStatusClick("ALL");
    } else if (card.status !== "ALL") {
      onStatusClick(selectedStatus === card.status ? "ALL" : card.status);
    }
  };

  return (
    <div>
      {/* Desktop: 5 Glass Metric Cards */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {cards.map((card) => {
          const isFilterable =
            card.status !== "ALL" || (card.id === "total-products" && selectedStatus !== "ALL");
          const isSelected = selectedStatus === card.status && card.status !== "ALL";

          return (
            <MetricCard
              key={card.id}
              id={card.id}
              label={card.label}
              value={card.value}
              subLabel={card.subLabel}
              icon={card.icon}
              iconContainerClassName={card.iconContainer}
              isSelected={isSelected}
              isFilterable={isFilterable}
              onClick={() => handleCardClick(card)}
              variant="glass"
            />
          );
        })}
      </div>

      {/* Mobile: 2-Column Glass Metric Cards */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {cards.map((card, idx) => {
          const isFilterable =
            card.status !== "ALL" || (card.id === "total-products" && selectedStatus !== "ALL");
          const isSelected = selectedStatus === card.status && card.status !== "ALL";

          return (
            <MetricCard
              key={`m-${card.id}`}
              id={`m-${card.id}`}
              label={card.label}
              value={card.value}
              subLabel={card.subLabel}
              icon={card.icon}
              iconContainerClassName={card.mobileIconContainer}
              isSelected={isSelected}
              isFilterable={isFilterable}
              onClick={() => handleCardClick(card)}
              variant="glass-mobile"
              className={idx === 4 ? "col-span-2" : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
