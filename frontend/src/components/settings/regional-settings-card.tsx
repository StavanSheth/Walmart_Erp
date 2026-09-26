"use client";

import * as React from "react";
import {
  GlobeIcon,
  ClockIcon,
  DollarCurrencyIcon,
  CalendarIcon,
  LanguageIcon,
  LockIcon,
  ChevronDownIcon
} from "@/components/ui/icons";
import type { RegionalSettings } from "@/types/settings";

interface RegionalSettingsCardProps {
  regional?: RegionalSettings;
  canEdit?: boolean;
  onAttemptChange?: (settingKey: string) => void;
  isLoading?: boolean;
}

export function RegionalSettingsCard({
  regional,
  canEdit = true,
  onAttemptChange,
  isLoading: _isLoading
}: RegionalSettingsCardProps) {
  const data = regional || {
    defaultRegion: "United States",
    timezone: "(UTC-05:00) America/New_York (EST)",
    currency: "USD - US Dollar ($)",
    dateFormat: "MM/DD/YYYY",
    language: "English (US)"
  };

  const handleSelectClick = (field: string) => {
    if (!canEdit) {
      onAttemptChange?.(field);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between min-h-[285px] h-full sm:h-[285px]">
      {/* Header: Title, Subtitle, and Protected Badge */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
            Regional Settings
          </h3>
          <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
            Configure region, timezone and currency
          </p>
        </div>
        {!canEdit && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[10px] font-bold text-amber-700 shadow-2xs">
            <LockIcon className="w-2.5 h-2.5 text-amber-600" />
            <span>Protected</span>
          </div>
        )}
      </div>

      {/* 5 Dropdown Settings Rows */}
      <div className="space-y-1.5 text-xs py-1">
        {/* Row 1: Default Region */}
        <div
          onClick={() => handleSelectClick("Default Region")}
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-slate-100 transition-colors select-none ${
            canEdit ? "bg-slate-50/60 hover:bg-slate-100/70 cursor-pointer" : "bg-slate-50/40 cursor-not-allowed opacity-90"
          }`}
        >
          <div className="flex items-center gap-2">
            <GlobeIcon className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700 text-xs">Default Region</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <span>{data.defaultRegion}</span>
            <ChevronDownIcon className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* Row 2: Timezone */}
        <div
          onClick={() => handleSelectClick("Timezone")}
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-slate-100 transition-colors select-none ${
            canEdit ? "bg-slate-50/60 hover:bg-slate-100/70 cursor-pointer" : "bg-slate-50/40 cursor-not-allowed opacity-90"
          }`}
        >
          <div className="flex items-center gap-2">
            <ClockIcon className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700 text-xs">Timezone</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 truncate max-w-[170px]">
            <span className="truncate">{data.timezone}</span>
            <ChevronDownIcon className="w-3 h-3 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* Row 3: Currency */}
        <div
          onClick={() => handleSelectClick("Currency")}
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-slate-100 transition-colors select-none ${
            canEdit ? "bg-slate-50/60 hover:bg-slate-100/70 cursor-pointer" : "bg-slate-50/40 cursor-not-allowed opacity-90"
          }`}
        >
          <div className="flex items-center gap-2">
            <DollarCurrencyIcon className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700 text-xs">Currency</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <span>{data.currency}</span>
            <ChevronDownIcon className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* Row 4: Date Format */}
        <div
          onClick={() => handleSelectClick("Date Format")}
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-slate-100 transition-colors select-none ${
            canEdit ? "bg-slate-50/60 hover:bg-slate-100/70 cursor-pointer" : "bg-slate-50/40 cursor-not-allowed opacity-90"
          }`}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700 text-xs">Date Format</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-mono">
            <span>{data.dateFormat}</span>
            <ChevronDownIcon className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* Row 5: Language */}
        <div
          onClick={() => handleSelectClick("Language")}
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-slate-100 transition-colors select-none ${
            canEdit ? "bg-slate-50/60 hover:bg-slate-100/70 cursor-pointer" : "bg-slate-50/40 cursor-not-allowed opacity-90"
          }`}
        >
          <div className="flex items-center gap-2">
            <LanguageIcon className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700 text-xs">Language</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <span>{data.language}</span>
            <ChevronDownIcon className="w-3 h-3 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
