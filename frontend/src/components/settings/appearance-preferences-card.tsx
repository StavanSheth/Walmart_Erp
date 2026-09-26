"use client";

import * as React from "react";
import {
  SunIcon,
  MonitorIcon
} from "@/components/ui/icons";
import type { AppearancePreferences } from "@/types/settings";

interface AppearancePreferencesCardProps {
  appearance?: AppearancePreferences;
  onChangeTheme?: (theme: "light" | "system") => void;
  isLoading?: boolean;
}

export function AppearancePreferencesCard({
  appearance,
  onChangeTheme,
  isLoading: _isLoading
}: AppearancePreferencesCardProps) {
  const [selectedTheme, setSelectedTheme] = React.useState<"light" | "system">(
    appearance?.theme === "dark" ? "light" : (appearance?.theme as "light" | "system") || "light"
  );

  React.useEffect(() => {
    if (appearance?.theme) {
      setSelectedTheme(appearance.theme === "dark" ? "light" : (appearance.theme as "light" | "system"));
    }
  }, [appearance?.theme]);

  const handleThemeClick = (theme: "light" | "system") => {
    setSelectedTheme(theme);
    onChangeTheme?.(theme);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between min-h-[285px] h-full sm:h-[285px]">
      {/* Header */}
      <div>
        <div className="pb-2 border-b border-slate-100">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
            Appearance & Preferences
          </h3>
          <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
            Customize your ERP experience
          </p>
        </div>

        {/* Theme Selector: Light, System (Darkmode removed) */}
        <div className="grid grid-cols-2 gap-2 mt-3 select-none">
          {/* Light */}
          <button
            type="button"
            onClick={() => handleThemeClick("light")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all cursor-pointer ${
              selectedTheme === "light"
                ? "bg-blue-50 border-[#0071DC] text-[#0071DC] shadow-xs"
                : "bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <SunIcon className="w-4 h-4 mb-1" />
            <span className="text-[11px] font-bold">Light</span>
          </button>

          {/* System */}
          <button
            type="button"
            onClick={() => handleThemeClick("system")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all cursor-pointer ${
              selectedTheme === "system"
                ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs"
                : "bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <MonitorIcon className="w-4 h-4 mb-1" />
            <span className="text-[11px] font-bold">System</span>
          </button>
        </div>
      </div>

      {/* 4 Other Setting Dropdowns: Primary Color, Accent Color, Density, Sidebar */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
        {/* Primary Color */}
        <div className="flex items-center justify-between p-1.5 px-2 rounded-xl bg-slate-50/70 border border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0071DC] shrink-0" />
            <span className="text-[11px] font-semibold text-slate-700 truncate">Primary</span>
          </div>
          <span className="text-[11px] font-bold text-slate-900 shrink-0">Blue</span>
        </div>

        {/* Accent Color */}
        <div className="flex items-center justify-between p-1.5 px-2 rounded-xl bg-slate-50/70 border border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFC220] shrink-0" />
            <span className="text-[11px] font-semibold text-slate-700 truncate">Accent</span>
          </div>
          <span className="text-[11px] font-bold text-slate-900 shrink-0">Yellow</span>
        </div>

        {/* Density */}
        <div className="flex items-center justify-between p-1.5 px-2 rounded-xl bg-slate-50/70 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-700 truncate">Density</span>
          <span className="text-[11px] font-bold text-slate-900 shrink-0">Comfortable</span>
        </div>

        {/* Sidebar */}
        <div className="flex items-center justify-between p-1.5 px-2 rounded-xl bg-slate-50/70 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-700 truncate">Sidebar</span>
          <span className="text-[11px] font-bold text-slate-900 shrink-0">Expanded</span>
        </div>
      </div>
    </div>
  );
}
