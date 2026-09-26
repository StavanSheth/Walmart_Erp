"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type StoresTab = "network" | "performance" | "operations" | "expansion";

export interface StoresTabsProps {
  activeTab: StoresTab;
  onTabChange: (tab: StoresTab) => void;
  className?: string;
}

const TABS: { id: StoresTab; label: string }[] = [
  { id: "network", label: "Store Network" },
  { id: "performance", label: "Performance" },
  { id: "operations", label: "Operations" },
  { id: "expansion", label: "Expansion" }
];

export function StoresTabs({
  activeTab = "network",
  onTabChange,
  className
}: StoresTabsProps) {
  return (
    <div
      className={cn(
        "border-b border-slate-200/80 px-1 flex items-center overflow-x-auto no-scrollbar",
        className
      )}
    >
      <div className="flex items-center gap-4 sm:gap-8 min-w-max">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative py-2.5 px-1 text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none",
                isActive
                  ? "text-[#0071DC]"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0071DC] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
