"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface PartnerAvatarProps {
  name: string;
  type?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Curated deterministic background colors
const AVATAR_PALETTE = [
  "bg-blue-100 text-[#0071DC] border-blue-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-teal-100 text-teal-700 border-teal-200"
];

function getInitials(name: string): string {
  if (!name) return "PT";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getPaletteIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % AVATAR_PALETTE.length;
}

export function PartnerAvatar({
  name,
  size = "md",
  className
}: PartnerAvatarProps) {
  const initials = getInitials(name);
  const colorClass = AVATAR_PALETTE[getPaletteIndex(name)];

  const sizeClasses = {
    sm: "w-7 h-7 text-[10px] rounded-lg border",
    md: "w-8 h-8 sm:w-9 sm:h-9 text-xs font-bold rounded-xl border",
    lg: "w-11 h-11 text-sm font-bold rounded-2xl border"
  }[size];

  return (
    <div
      className={cn(
        "flex items-center justify-center shrink-0 select-none font-semibold",
        sizeClasses,
        colorClass,
        className
      )}
      title={name}
    >
      <span>{initials}</span>
    </div>
  );
}
