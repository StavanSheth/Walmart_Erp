"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "neutral"
    | "primary"
    | "brand"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "outline"
    | "spark"
    | "default";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  ...props
}: BadgeProps) {
  const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200/80",
    default: "bg-slate-100 text-slate-700 border-slate-200/80",
    primary: "bg-brand-sky text-brand-primary border-blue-200 font-semibold",
    brand: "bg-brand-sky text-brand-primary border-blue-200 font-semibold",
    spark: "bg-brand-yellow-light text-amber-900 border-amber-300/70 font-semibold",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    info: "bg-sky-50 text-sky-800 border-sky-200",
    outline: "bg-transparent text-slate-700 border-border-strong"
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-0.5 text-[11px] gap-1.5"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill font-medium border leading-tight select-none shrink-0 tracking-tight",
        variantStyles[variant] || variantStyles.neutral,
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}

/* ==========================================================================
   Domain Status Badge
   ========================================================================== */

export type DomainStatus =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "DELIVERED"
  | "RECEIVED"
  | "CANCELLED"
  | "COMPLETED"
  | "BALANCED"
  | string;

export interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: DomainStatus;
  label?: string;
}

export function StatusBadge({ status, label, ...props }: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase();

  let variant: BadgeProps["variant"] = "neutral";
  let displayLabel = label || status;

  switch (normalized) {
    case "IN_STOCK":
    case "DELIVERED":
    case "RECEIVED":
    case "ACTIVE":
    case "COMPLETED":
    case "BALANCED":
      variant = "success";
      if (!label) {
        displayLabel =
          normalized === "IN_STOCK"
            ? "In Stock"
            : normalized === "ACTIVE"
              ? "Active"
              : normalized === "BALANCED"
                ? "Balanced"
                : normalized === "DELIVERED"
                  ? "Delivered"
                  : "Received";
      }
      break;

    case "LOW_STOCK":
    case "PENDING":
    case "REORDER":
      variant = "warning";
      if (!label) {
        displayLabel = normalized === "LOW_STOCK" ? "Low Stock" : "Pending";
      }
      break;

    case "OUT_OF_STOCK":
    case "CANCELLED":
    case "FAILED":
    case "INACTIVE":
      variant = "danger";
      if (!label) {
        displayLabel =
          normalized === "OUT_OF_STOCK"
            ? "Out of Stock"
            : normalized === "CANCELLED"
              ? "Cancelled"
              : "Inactive";
      }
      break;

    default:
      variant = "neutral";
      break;
  }

  return (
    <Badge variant={variant} {...props}>
      {displayLabel}
    </Badge>
  );
}
