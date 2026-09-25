"use client";

import * as React from "react";
import { Skeleton } from "./loading-state";
import { StockSparkline } from "@/components/ui/sparkline";
import { cn } from "@/lib/cn";

export interface MetricCardProps {
  id?: string;
  label: string;
  value: React.ReactNode;
  subLabel?: React.ReactNode;
  icon?: React.ReactNode;
  iconContainerClassName?: string;
  sparklineTrend?: "up" | "down" | "steady" | "surge";
  sparklineColor?: string;
  trendText?: string;
  trendPositive?: boolean;
  isSelected?: boolean;
  isFilterable?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
  variant?: "glass" | "glass-mobile" | "surface";
  className?: string;
}

export function MetricCard({
  id,
  label,
  value,
  subLabel,
  icon,
  iconContainerClassName,
  sparklineTrend,
  sparklineColor,
  trendText,
  trendPositive,
  isSelected = false,
  isFilterable = false,
  onClick,
  isLoading = false,
  variant = "glass",
  className
}: MetricCardProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "p-4 rounded-2xl space-y-3 min-h-[136px]",
          variant === "glass" && "bg-[#051A33]/25 backdrop-blur-md border border-white/20",
          variant === "glass-mobile" && "bg-[#06182c]/85 backdrop-blur-xl border border-white/30 p-3.5",
          variant === "surface" && "bg-white border border-slate-200/80 shadow-xs",
          className
        )}
      >
        <Skeleton className="w-10 h-10 rounded-xl bg-white/20" />
        <Skeleton className="w-24 h-3.5 rounded bg-white/20" />
        <Skeleton className="w-32 h-7 rounded bg-white/20" />
      </div>
    );
  }

  const variantStyles = {
    glass:
      "bg-[#051A33]/25 hover:bg-[#051A33]/35 backdrop-blur-md border border-white/25 text-white shadow-lg min-h-[136px] p-4",
    "glass-mobile":
      "bg-[#06182c]/85 hover:bg-[#06182c]/95 backdrop-blur-xl border border-white/30 text-white shadow-lg p-3.5",
    surface:
      "bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-900 shadow-xs p-4 min-h-[136px]"
  };

  const isClickable = Boolean(onClick || isFilterable);

  return (
    <div
      id={id}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable && onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "rounded-2xl flex flex-col justify-between transition-all duration-200 select-none",
        variantStyles[variant],
        isClickable && "cursor-pointer hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        isSelected && "ring-2 ring-white/80 bg-[#051A33]/45 shadow-xl border-white/40",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div
            className={cn(
              "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 backdrop-blur-md shadow-xs",
              iconContainerClassName || "bg-blue-500/25 border-blue-400/35 text-blue-200"
            )}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p
            className={cn(
              "text-[11px] font-semibold uppercase tracking-wider truncate",
              variant === "surface" ? "text-slate-500" : "text-blue-100"
            )}
          >
            {label}
          </p>
          <h3 className="text-xl lg:text-2xl font-black tabular-nums leading-tight drop-shadow-sm mt-0.5">
            {value}
          </h3>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center justify-between mt-3 pt-2 border-t",
          variant === "surface" ? "border-slate-100" : "border-white/15"
        )}
      >
        <div className="text-[11px] truncate font-medium">
          {trendText ? (
            <span
              className={cn(
                "font-bold mr-1",
                trendPositive ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {trendText}
            </span>
          ) : null}
          <span className={variant === "surface" ? "text-slate-400" : "text-blue-100/90"}>
            {subLabel}
          </span>
        </div>

        {sparklineTrend && sparklineColor && (
          <StockSparkline
            trend={sparklineTrend}
            color={sparklineColor}
            id={id || label.toLowerCase().replace(/\s+/g, "-")}
          />
        )}
      </div>
    </div>
  );
}
