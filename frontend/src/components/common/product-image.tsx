"use client";

import * as React from "react";
import { PackageIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export interface ProductImageProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProductImage({
  src,
  alt,
  size = "sm",
  className
}: ProductImageProps) {
  const [imgError, setImgError] = React.useState(false);

  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg text-[11px]",
    md: "w-10 h-10 rounded-xl text-xs",
    lg: "w-14 h-14 rounded-2xl text-sm"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7"
  };

  // If a real image URL is provided and has not failed to load
  if (src && !imgError) {
    return (
      <div
        className={cn(
          "overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 relative shadow-2xs",
          sizeClasses[size],
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback: Generate initials or fallback to package icon
  const initials = alt
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "bg-blue-50 border border-blue-200/80 text-brand-primary flex items-center justify-center shrink-0 font-bold shadow-2xs select-none",
        sizeClasses[size],
        className
      )}
      title={alt}
      aria-label={alt}
    >
      {initials ? initials : <PackageIcon className={iconSizes[size]} />}
    </div>
  );
}
