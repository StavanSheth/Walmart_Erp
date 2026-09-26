"use client";

import * as React from "react";
import { InfoIcon, CheckCircleIcon } from "@/components/ui/icons";
import type { SystemInformation, SystemStatusData } from "@/types/settings";

interface SystemInfoStatusProps {
  systemInfo?: SystemInformation;
  systemStatus?: SystemStatusData;
  onViewStatus?: () => void;
  isLoading?: boolean;
}

export function SystemInfoStatus({
  systemInfo,
  systemStatus,
  onViewStatus,
  isLoading: _isLoading
}: SystemInfoStatusProps) {
  const info = systemInfo || {
    version: "2.6.0",
    lastUpdated: "Sep 22, 2026",
    uptime: "99.98%"
  };

  const status = systemStatus || {
    status: "Operational",
    title: "All Systems Operational",
    message: "Your Walmart ERP is running smoothly.",
    actionText: "View System Status →"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 select-none">
      {/* Left: System Information (~70px height) */}
      <div className="md:col-span-5 lg:col-span-4 h-[72px] bg-white rounded-2xl border border-slate-200/80 shadow-xs px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/70 text-blue-600 flex items-center justify-center shrink-0">
            <InfoIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 leading-tight">
              System Information
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
              <span>Version {info.version}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>Uptime {info.uptime}</span>
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400 shrink-0 hidden sm:inline">
          {info.lastUpdated}
        </span>
      </div>

      {/* Right: System Status Green Panel (~70px height) */}
      <div className="md:col-span-7 lg:col-span-8 h-[72px] bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl border border-emerald-500/30 shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 shadow-2xs backdrop-blur-xs">
            <CheckCircleIcon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-extrabold text-white tracking-tight leading-tight truncate">
              {status.title}
            </h4>
            <p className="text-[11px] text-emerald-100/90 font-medium truncate mt-0.5">
              {status.message}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewStatus}
          className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-emerald-100 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-xl border border-white/25 transition-all cursor-pointer shrink-0 ml-3 shadow-xs"
        >
          <span>{status.actionText}</span>
        </button>
      </div>
    </div>
  );
}
