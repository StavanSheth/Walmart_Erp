"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import {
  BarChartIcon,
  InventoryIcon,
  StoreNavIcon,
  UsersIcon,
  SettingsIcon,
  PlusIcon,
  RupeeCurrencyIcon
} from "@/components/ui/icons";
import type { ReportCategoryItem } from "@/types/reports";

export interface ReportCategoryCardProps {
  id: string;
  name: string;
  description: string;
  countLabel: string;
  isAction?: boolean;
  actionText?: string;
  icon: "sales" | "inventory" | "store" | "partner" | "financial" | "operational" | "custom";
  isSelected?: boolean;
  onClick?: () => void;
}

export const REPORT_CATEGORIES_CONFIG = [
  {
    id: "SALES",
    name: "Sales Reports",
    description: "Revenue, orders, product performance",
    countLabel: "12 Reports",
    icon: "sales" as const,
    colorTheme: "blue"
  },
  {
    id: "INVENTORY",
    name: "Inventory Reports",
    description: "Stock levels, movement, aging",
    countLabel: "10 Reports",
    icon: "inventory" as const,
    colorTheme: "green"
  },
  {
    id: "STORE",
    name: "Store Reports",
    description: "Store performance, footfall, operations",
    countLabel: "8 Reports",
    icon: "store" as const,
    colorTheme: "teal"
  },
  {
    id: "PARTNER",
    name: "Partner Reports",
    description: "Wholesalers, retailers, suppliers",
    countLabel: "9 Reports",
    icon: "partner" as const,
    colorTheme: "purple"
  },
  {
    id: "FINANCIAL",
    name: "Financial Reports",
    description: "P&L, balance sheet, transactions",
    countLabel: "11 Reports",
    icon: "financial" as const,
    colorTheme: "cyan"
  },
  {
    id: "OPERATIONAL",
    name: "Operational Reports",
    description: "Fulfillment, logistics, maintenance",
    countLabel: "8 Reports",
    icon: "operational" as const,
    colorTheme: "indigo"
  },
  {
    id: "CUSTOM",
    name: "Custom Reports",
    description: "Create your own report",
    countLabel: "Build Report",
    isAction: true,
    actionText: "Build Report",
    icon: "custom" as const,
    colorTheme: "blue"
  }
];

interface CategoryThemeConfig {
  activeContainer: string;
  inactiveContainer: string;
  iconGradient: string;
  iconColor: string;
  pillBg: string;
  glowColor: string;
}

const CATEGORY_THEMES: Record<string, CategoryThemeConfig> = {
  sales: {
    activeContainer: "bg-gradient-to-br from-blue-600/40 via-blue-900/50 to-[#041326]/85 border-blue-400 ring-4 ring-blue-500/30 shadow-[0_12px_32px_rgba(0,113,220,0.35)] -translate-y-1 z-10",
    inactiveContainer: "bg-[#051A33]/35 hover:bg-[#07244a]/60 border-blue-500/25 hover:border-blue-400/50 shadow-md hover:shadow-xl hover:-translate-y-0.5",
    iconGradient: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/30 border-blue-300/40",
    iconColor: "text-white",
    pillBg: "bg-blue-500/20 text-blue-200 border-blue-400/30",
    glowColor: "bg-blue-500/20"
  },
  inventory: {
    activeContainer: "bg-gradient-to-br from-emerald-600/40 via-emerald-950/50 to-[#041326]/85 border-emerald-400 ring-4 ring-emerald-500/30 shadow-[0_12px_32px_rgba(16,185,129,0.35)] -translate-y-1 z-10",
    inactiveContainer: "bg-[#051A33]/35 hover:bg-[#062a20]/60 border-emerald-500/25 hover:border-emerald-400/50 shadow-md hover:shadow-xl hover:-translate-y-0.5",
    iconGradient: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30 border-emerald-300/40",
    iconColor: "text-white",
    pillBg: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
    glowColor: "bg-emerald-500/20"
  },
  store: {
    activeContainer: "bg-gradient-to-br from-cyan-600/40 via-cyan-950/50 to-[#041326]/85 border-cyan-400 ring-4 ring-cyan-500/30 shadow-[0_12px_32px_rgba(6,182,212,0.35)] -translate-y-1 z-10",
    inactiveContainer: "bg-[#051A33]/35 hover:bg-[#072938]/60 border-cyan-500/25 hover:border-cyan-400/50 shadow-md hover:shadow-xl hover:-translate-y-0.5",
    iconGradient: "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-500/30 border-cyan-300/40",
    iconColor: "text-white",
    pillBg: "bg-cyan-500/20 text-cyan-200 border-cyan-400/30",
    glowColor: "bg-cyan-500/20"
  },
  partner: {
    activeContainer: "bg-gradient-to-br from-purple-600/40 via-purple-950/50 to-[#041326]/85 border-purple-400 ring-4 ring-purple-500/30 shadow-[0_12px_32px_rgba(168,85,247,0.35)] -translate-y-1 z-10",
    inactiveContainer: "bg-[#051A33]/35 hover:bg-[#20103b]/60 border-purple-500/25 hover:border-purple-400/50 shadow-md hover:shadow-xl hover:-translate-y-0.5",
    iconGradient: "bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-purple-500/30 border-purple-300/40",
    iconColor: "text-white",
    pillBg: "bg-purple-500/20 text-purple-200 border-purple-400/30",
    glowColor: "bg-purple-500/20"
  },
  financial: {
    activeContainer: "bg-gradient-to-br from-amber-600/40 via-amber-950/50 to-[#041326]/85 border-amber-400 ring-4 ring-amber-500/30 shadow-[0_12px_32px_rgba(245,158,11,0.35)] -translate-y-1 z-10",
    inactiveContainer: "bg-[#051A33]/35 hover:bg-[#2d1c05]/60 border-amber-500/25 hover:border-amber-400/50 shadow-md hover:shadow-xl hover:-translate-y-0.5",
    iconGradient: "bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-amber-500/30 border-amber-300/40",
    iconColor: "text-white",
    pillBg: "bg-amber-500/20 text-amber-200 border-amber-400/30",
    glowColor: "bg-amber-500/20"
  },
  operational: {
    activeContainer: "bg-gradient-to-br from-indigo-600/40 via-indigo-950/50 to-[#041326]/85 border-indigo-400 ring-4 ring-indigo-500/30 shadow-[0_12px_32px_rgba(99,102,241,0.35)] -translate-y-1 z-10",
    inactiveContainer: "bg-[#051A33]/35 hover:bg-[#12163b]/60 border-indigo-500/25 hover:border-indigo-400/50 shadow-md hover:shadow-xl hover:-translate-y-0.5",
    iconGradient: "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/30 border-indigo-300/40",
    iconColor: "text-white",
    pillBg: "bg-indigo-500/20 text-indigo-200 border-indigo-400/30",
    glowColor: "bg-indigo-500/20"
  },
  custom: {
    activeContainer: "bg-gradient-to-br from-amber-500/45 via-[#FFC220]/25 to-[#041326]/90 border-yellow-400 ring-4 ring-yellow-400/35 shadow-[0_12px_32px_rgba(255,194,32,0.4)] -translate-y-1 z-10",
    inactiveContainer: "bg-gradient-to-br from-[#FFC220]/15 via-[#051A33]/45 to-[#051A33]/35 hover:bg-[#2b2005]/70 border-yellow-400/35 hover:border-yellow-300/60 shadow-md hover:shadow-xl hover:-translate-y-0.5",
    iconGradient: "bg-gradient-to-br from-[#FFC220] to-amber-500 text-slate-900 shadow-yellow-400/40 border-yellow-200/60",
    iconColor: "text-slate-900",
    pillBg: "bg-yellow-400/25 text-yellow-200 border-yellow-400/40 font-bold",
    glowColor: "bg-yellow-400/25"
  }
};

export function ReportCategoryCard({
  name,
  description,
  countLabel,
  isAction,
  icon,
  isSelected,
  onClick
}: ReportCategoryCardProps) {
  const theme = CATEGORY_THEMES[icon] || CATEGORY_THEMES.sales;

  const renderIcon = () => {
    switch (icon) {
      case "sales":
        return <BarChartIcon className="w-5 h-5 text-white" />;
      case "inventory":
        return <InventoryIcon className="w-5 h-5 text-white" />;
      case "store":
        return <StoreNavIcon className="w-5 h-5 text-white" />;
      case "partner":
        return <UsersIcon className="w-5 h-5 text-white" />;
      case "financial":
        return <RupeeCurrencyIcon className="w-5 h-5 text-white" />;
      case "operational":
        return <SettingsIcon className="w-5 h-5 text-white" />;
      case "custom":
        return <PlusIcon className="w-5 h-5 text-slate-900" />;
      default:
        return <BarChartIcon className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        "relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl backdrop-blur-md transition-all duration-200 select-none cursor-pointer text-left overflow-hidden group snap-start border",
        "w-[155px] lg:w-full h-[142px] shrink-0 text-white",
        isSelected ? theme.activeContainer : theme.inactiveContainer
      )}
    >
      {/* Dynamic ambient color glow in corner */}
      <div className={cn(
        "absolute -top-10 -right-10 w-24 h-24 rounded-full blur-xl pointer-events-none transition-opacity duration-300",
        theme.glowColor,
        isSelected ? "opacity-80" : "opacity-30 group-hover:opacity-60"
      )} />

      {/* Specular liquid glass top sheen */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />

      {/* Icon Container with glowing gradient tile */}
      <div className={cn(
        "relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md border",
        theme.iconGradient,
        isSelected ? "scale-105 shadow-lg" : "group-hover:scale-105"
      )}>
        {renderIcon()}
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-0.5">
        <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-tight leading-tight group-hover:text-blue-50 transition-colors">
          {name}
        </h3>
        <p className="text-[10px] text-blue-100/75 font-normal leading-tight line-clamp-2">
          {description}
        </p>
      </div>

      {/* Footer / Count or CTA pill */}
      <div className="relative z-10 pt-0.5">
        <span className={cn(
          "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border leading-tight transition-all duration-200",
          theme.pillBg,
          isAction && "group-hover:bg-[#FFC220] group-hover:text-slate-900 group-hover:border-transparent group-hover:shadow-sm"
        )}>
          {isAction && <span className="text-xs leading-none">✨</span>}
          <span>{countLabel}</span>
          {isAction && <span>→</span>}
        </span>
      </div>
    </div>
  );
}

export interface ReportCategoryCardsBarProps {
  items?: ReportCategoryItem[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onBuildReportClick?: () => void;
  isLoading?: boolean;
}

export function ReportCategoryCardsBar({
  items,
  selectedCategory,
  onSelectCategory,
  onBuildReportClick,
  isLoading
}: ReportCategoryCardsBarProps) {
  const cards = items && items.length > 0 ? items : REPORT_CATEGORIES_CONFIG;

  return (
    <div className="w-full overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-white/30 hover:scrollbar-thumb-white/50 select-none">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-max lg:min-w-0 lg:grid lg:grid-cols-7">
        {isLoading ? (
          Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-[155px] lg:w-full h-[142px] rounded-2xl bg-[#051A33]/25 backdrop-blur-md border border-white/20 p-3.5 sm:p-4 flex flex-col justify-between animate-pulse"
            >
              <div className="w-9 h-9 rounded-xl bg-white/20" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-24 bg-white/20 rounded" />
                <div className="h-2.5 w-32 bg-white/15 rounded" />
              </div>
              <div className="h-3 w-16 bg-white/20 rounded" />
            </div>
          ))
        ) : (
          cards.map((cat) => (
            <ReportCategoryCard
              key={cat.id}
              id={cat.id}
              name={cat.name}
              description={cat.description}
              countLabel={cat.countLabel}
              isAction={cat.isAction}
              icon={cat.icon}
              isSelected={selectedCategory === cat.id}
              onClick={() => {
                if (cat.id === "CUSTOM" && onBuildReportClick) {
                  onBuildReportClick();
                }
                onSelectCategory(cat.id);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
