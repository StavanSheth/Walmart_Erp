"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface MobileDataCardField {
  label: string;
  value: React.ReactNode;
}

export interface MobileDataCardProps {
  title: string;
  subtitle?: string;
  thumbnail?: React.ReactNode;
  badge?: React.ReactNode;
  fields: MobileDataCardField[];
  onClick?: () => void;
  className?: string;
}

export function MobileDataCard({
  title,
  subtitle,
  thumbnail,
  badge,
  fields,
  onClick,
  className
}: MobileDataCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 transition text-slate-900 select-none",
        onClick && "hover:border-slate-300 hover:shadow-xs active:scale-[0.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        className
      )}
    >
      {/* Header Row: Thumbnail + Title/Subtitle + Badge */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {thumbnail}
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">
              {title}
            </h4>
            {subtitle && (
              <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
        {fields.map((f, i) => (
          <div key={i} className="space-y-0.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              {f.label}
            </span>
            <div className="font-bold text-slate-800 tabular-nums">
              {f.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
