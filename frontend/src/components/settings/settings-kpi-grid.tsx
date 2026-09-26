"use client";

import * as React from "react";
import {
  UsersGroupIcon,
  ShieldIcon,
  IntegrationNodesIcon,
  SettingsIcon,
  ChevronRightIcon
} from "@/components/ui/icons";
import type { SettingsKpiItem } from "@/types/settings";

interface SettingsKpiGridProps {
  kpis?: SettingsKpiItem[];
  onSelectKpi?: (id: string) => void;
  isLoading?: boolean;
}

export function SettingsKpiGrid({ kpis, onSelectKpi, isLoading }: SettingsKpiGridProps) {
  const defaultKpis: SettingsKpiItem[] = [
    {
      id: "kpi-users",
      title: "Users",
      value: "248",
      subtitle: "Active Users",
      icon: "users"
    },
    {
      id: "kpi-roles",
      title: "Roles & Permissions",
      value: "12",
      subtitle: "User Roles",
      icon: "shield"
    },
    {
      id: "kpi-integrations",
      title: "Integrations",
      value: "8",
      subtitle: "Connected Systems",
      icon: "nodes"
    },
    {
      id: "kpi-system-status",
      title: "System Status",
      value: "Healthy",
      subtitle: "All services operational",
      icon: "gear",
      statusColor: "emerald"
    }
  ];

  const items = kpis && kpis.length > 0 ? kpis : defaultKpis;

  const cardThemes: Record<string, { iconBg: string; glow: string }> = {
    users: {
      iconBg: "bg-blue-500/25 border-blue-400/40 text-blue-200 shadow-blue-500/30",
      glow: "bg-blue-500/25"
    },
    shield: {
      iconBg: "bg-indigo-500/25 border-indigo-400/40 text-indigo-200 shadow-indigo-500/30",
      glow: "bg-indigo-500/25"
    },
    nodes: {
      iconBg: "bg-teal-500/25 border-teal-400/40 text-teal-200 shadow-teal-500/30",
      glow: "bg-teal-500/25"
    },
    gear: {
      iconBg: "bg-emerald-500/25 border-emerald-400/40 text-emerald-200 shadow-emerald-500/30",
      glow: "bg-emerald-500/25"
    }
  };

  const renderIcon = (type: SettingsKpiItem["icon"]) => {
    switch (type) {
      case "users":
        return <UsersGroupIcon className="w-5 h-5 text-blue-200" />;
      case "shield":
        return <ShieldIcon className="w-5 h-5 text-indigo-200" />;
      case "nodes":
        return <IntegrationNodesIcon className="w-5 h-5 text-teal-200" />;
      case "gear":
      default:
        return <SettingsIcon className="w-5 h-5 text-emerald-200" />;
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map((kpi) => {
        const theme = cardThemes[kpi.icon] || cardThemes.users;

        return (
          <div
            key={kpi.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectKpi?.(kpi.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectKpi?.(kpi.id);
              }
            }}
            className="group relative min-h-[96px] sm:min-h-[105px] rounded-2xl bg-[#06182c]/85 hover:bg-[#06182c]/95 lg:bg-[#051A33]/30 lg:hover:bg-[#051A33]/45 backdrop-blur-xl lg:backdrop-blur-md p-3.5 sm:p-4 border border-white/25 lg:border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between text-white cursor-pointer select-none overflow-hidden"
          >
            {/* Dynamic ambient color glow in corner */}
            <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-xl pointer-events-none transition-opacity duration-300 opacity-25 group-hover:opacity-60 ${theme.glow}`} />

            {/* Specular liquid glass top sheen */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 via-transparent to-transparent pointer-events-none" />

            {/* Left: Icon container & Data */}
            <div className="relative z-10 flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 border backdrop-blur-md shadow-md transition-transform group-hover:scale-105 ${theme.iconBg}`}
              >
                {renderIcon(kpi.icon)}
              </div>

              <div className="min-w-0">
                {isLoading ? (
                  <div className="space-y-1.5 animate-pulse">
                    <div className="h-5 w-12 bg-white/20 rounded" />
                    <div className="h-3 w-20 bg-white/10 rounded" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 leading-tight">
                      {kpi.icon === "gear" && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      )}
                      <span className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm tabular-nums">
                        {kpi.value.startsWith("●") ? kpi.value.replace("●", "").trim() : kpi.value}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs font-semibold text-blue-100/80 truncate mt-0.5">
                      {kpi.subtitle}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Right: Action arrow (visible on sm+ screens) */}
            <div className="relative z-10 w-7 h-7 rounded-xl bg-white/10 group-hover:bg-white/20 text-white/70 group-hover:text-white hidden sm:flex items-center justify-center shrink-0 transition-colors">
              <ChevronRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
