"use client";

import * as React from "react";
import { RefreshCwIcon } from "@/components/ui/icons";
import { InventoryMovementTable } from "./inventory-movement-table";
import type { InventoryMovement } from "@/types/inventory";

export interface InventoryMovementsProps {
  movements?: InventoryMovement[];
  isLoading?: boolean;
  onViewAll?: () => void;
}

export function InventoryMovements({
  movements = [],
  isLoading = false,
  onViewAll
}: InventoryMovementsProps) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
            <RefreshCwIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
            Recent Inventory Movements
          </h3>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-bold text-brand-primary hover:text-blue-700 transition inline-flex items-center gap-0.5 whitespace-nowrap"
        >
          View All →
        </button>
      </div>

      {/* Movements Table using unified reusable component */}
      <div className="pt-2 flex-1 flex flex-col justify-between -mx-4 sm:-mx-5 px-4 sm:px-5">
        <InventoryMovementTable
          movements={movements}
          isLoading={isLoading}
          maxHeight="max-h-[310px]"
        />
      </div>
    </div>
  );
}
