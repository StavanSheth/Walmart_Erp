"use client";

import * as React from "react";
import type { SettingsTabId } from "@/types/settings";

interface SettingsTabsProps {
  activeTab: SettingsTabId;
  onTabChange: (tab: SettingsTabId) => void;
}

const TABS: { id: SettingsTabId; label: string }[] = [
  { id: "general", label: "General" },
  { id: "users", label: "Users & Access" },
  { id: "organization", label: "Organization" },
  { id: "integrations", label: "Integrations" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
  { id: "data", label: "Data Management" },
  { id: "system", label: "System" }
];

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="w-full h-[50px] border-b border-slate-200/90 flex items-end overflow-x-auto erp-scrollbar select-none">
      <div className="flex items-center gap-1 sm:gap-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative px-3 sm:px-4 py-3 text-xs sm:text-[13px] font-bold tracking-tight whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "text-[#0071DC]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0071DC] rounded-t-full shadow-xs" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
