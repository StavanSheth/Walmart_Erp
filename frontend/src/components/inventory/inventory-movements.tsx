"use client";

import * as React from "react";
import { RefreshCwIcon } from "@/components/ui/icons";
import { InventoryMovementTable } from "./inventory-movement-table";
import type { InventoryMovement } from "@/types/inventory";

export interface InventoryMovementsProps {
  movements?: InventoryMovement[];
  isLoading?: boolean;
}

export function InventoryMovements({
  movements = [],
  isLoading = false
}: InventoryMovementsProps) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
            <RefreshCwIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
              Recent Inventory Movements
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Live audit ledger of stock receipts, transfers, and sales
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-500 tabular-nums">
          {movements.length} logged
        </span>
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
