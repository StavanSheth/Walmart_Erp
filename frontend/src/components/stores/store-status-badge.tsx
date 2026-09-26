"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import type { StoreStatus } from "@/types/stores";

interface StoreStatusBadgeProps {
  status: StoreStatus;
  isNewThisYear?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function StoreStatusBadge({
  status,
  isNewThisYear,
  className,
  size = "md"
}: StoreStatusBadgeProps) {
  let label = "Operational";
  let variant: "success" | "warning" | "neutral" = "success";

  switch (status) {
    case "ACTIVE":
      label = isNewThisYear ? "Operational • New" : "Operational";
      variant = "success";
      break;
    case "MAINTENANCE":
      label = "Under Maintenance";
      variant = "warning";
      break;
    case "INACTIVE":
      label = "Inactive";
      variant = "neutral";
      break;
    default:
      label = status;
      variant = "neutral";
  }

  return (
    <Badge variant={variant} size={size} className={className}>
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1 ${
          variant === "success"
            ? "bg-emerald-500"
            : variant === "warning"
              ? "bg-amber-500 animate-pulse"
              : "bg-slate-400"
        }`}
      />
      {label}
    </Badge>
  );
}
