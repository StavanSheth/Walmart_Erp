"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "interactive" | "selected" | "glass";
}

export function Card({ className, variant = "default", ...props }: CardProps) {
  const variantStyles = {
    default: "bg-surface border-border shadow-xs",
    elevated: "bg-surface border-border shadow-md",
    outlined: "bg-surface border-border shadow-none",
    interactive:
      "bg-surface border-border shadow-xs hover:border-border-strong hover:shadow-sm cursor-pointer transition-all duration-150",
    selected:
      "bg-surface border-brand-primary shadow-xs ring-1 ring-brand-primary",
    glass:
      "glass text-slate-900 shadow-glass border-border/80"
  };

  return (
    <div
      className={cn(
        "rounded-lg sm:rounded-xl border text-slate-900 overflow-hidden",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-4 sm:p-5 pb-3", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-sm sm:text-base font-semibold leading-snug tracking-tight text-slate-900",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-slate-500 leading-relaxed", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 sm:p-5 pt-0", className)} {...props} />
  );
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center p-4 sm:p-5 pt-3 border-t border-border-subtle",
        className
      )}
      {...props}
    />
  );
}

/* ==========================================================================
   KPI / Stat Card Component
   ========================================================================== */

export interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  trendLabel?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  isLoading?: boolean;
  className?: string;
}

export function KPICard({
  title,
  value,
  change,
  isPositive,
  trendLabel,
  icon,
  iconBg = "bg-brand-sky text-brand-primary",
  isLoading = false,
  className
}: KPICardProps) {
  if (isLoading) {
    return (
      <div className={cn("p-5 rounded-xl border border-border bg-surface shadow-xs space-y-3", className)}>
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-slate-200/80 rounded anim-pulse" />
          <div className="h-7 w-7 bg-slate-200/80 rounded-md anim-pulse" />
        </div>
        <div className="h-8 w-36 bg-slate-200/80 rounded anim-pulse" />
        <div className="h-3 w-20 bg-slate-200/80 rounded anim-pulse" />
      </div>
    );
  }

  return (
    <Card className={cn("transition-all duration-150 hover:shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </CardTitle>
        {icon ? (
          <div className={cn("p-1.5 rounded-lg shrink-0 flex items-center justify-center", iconBg)}>
            {icon}
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="type-kpi">{value}</div>
        {(change || trendLabel) && (
          <div className="flex items-center gap-1.5 text-xs font-medium mt-1">
            {change && (
              <span
                className={cn(
                  "tabular-nums",
                  isPositive === true
                    ? "text-semantic-success"
                    : isPositive === false
                      ? "text-semantic-danger"
                      : "text-slate-500"
                )}
              >
                {change}
              </span>
            )}
            {trendLabel && (
              <span className="text-slate-400 font-normal">{trendLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const StatCard = KPICard;
