"use client";

import * as React from "react";
import type { PartnersTab } from "@/types/partners";
import { cn } from "@/lib/cn";

export interface PartnersTabsProps {
  activeTab: PartnersTab;
  onTabChange: (tab: PartnersTab) => void;
  className?: string;
}

const TABS: { id: PartnersTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "wholesalers-retailers", label: "Wholesalers & Retailers" },
  { id: "suppliers", label: "Suppliers" },
  { id: "customers", label: "Customers" },
  { id: "performance", label: "Partner Performance" }
];

export function PartnersTabs({
  activeTab = "overview",
  onTabChange,
  className
}: PartnersTabsProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200/80 shadow-xs px-2 sm:px-4 py-1.5 flex items-center overflow-x-auto no-scrollbar",
        className
      )}
    >
      <div className="flex items-center gap-1 sm:gap-4 min-w-max">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative py-2 px-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none",
                isActive
                  ? "text-[#0071DC] font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#0071DC] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
