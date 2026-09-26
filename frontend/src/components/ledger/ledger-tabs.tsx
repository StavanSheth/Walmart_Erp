"use client";

import * as React from "react";

export type LedgerTabType = "transactions" | "accounts" | "reconciliation" | "journal";

interface LedgerTabsProps {
  activeTab: LedgerTabType;
  onTabChange: (tab: LedgerTabType) => void;
  className?: string;
}

export function LedgerTabs({ activeTab, onTabChange, className = "" }: LedgerTabsProps) {
  const tabs: Array<{ id: LedgerTabType; label: string }> = [
    { id: "transactions", label: "Transactions" },
    { id: "accounts", label: "Accounts" },
    { id: "reconciliation", label: "Reconciliation" },
    { id: "journal", label: "Journal Entries" }
  ];

  return (
    <div className={`rounded-2xl bg-white border border-slate-200/80 shadow-xs px-2 sm:px-4 ${className}`}>
      <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-6 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative py-3 sm:py-3.5 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold transition-colors duration-150 whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? "text-[#0071DC] font-bold"
                  : "text-slate-600 hover:text-slate-900 font-medium"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0071DC] rounded-full shadow-xs" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
