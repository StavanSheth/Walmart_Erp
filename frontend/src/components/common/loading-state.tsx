import * as React from "react";
import { cn } from "@/lib/cn";

export interface LoadingStateProps {
  message?: string;
  variant?: "spinner" | "skeleton" | "card" | "table";
  className?: string;
}

export function LoadingState({
  message = "Loading data...",
  variant = "spinner",
  className
}: LoadingStateProps) {
  if (variant === "skeleton" || variant === "table") {
    return <SkeletonTable className={className} />;
  }

  if (variant === "card") {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonKPI key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-3 border-brand-primary/20 border-t-brand-primary animate-spin" />
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500 anim-pulse">{message}</p>
    </div>
  );
}

/* ==========================================================================
   Skeleton Components
   ========================================================================== */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "sm" | "md" | "lg" | "xl" | "pill" | "full";
}

export function Skeleton({
  className,
  rounded = "md",
  ...props
}: SkeletonProps) {
  const roundedStyles = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    pill: "rounded-pill",
    full: "rounded-full"
  };

  return (
    <div
      className={cn(
        "bg-slate-200/80 anim-pulse select-none",
        roundedStyles[rounded],
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SkeletonText({
  lines = 2,
  className
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2 w-full", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 && lines > 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonKPI({ className }: { className?: string }) {
  return (
    <div className={cn("p-5 rounded-xl border border-border bg-surface shadow-xs space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-7 w-7" rounded="md" />
      </div>
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("p-5 rounded-xl border border-border bg-surface shadow-xs space-y-4", className)}>
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-64" />
      </div>
      <Skeleton className="h-24 w-full" rounded="lg" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20" rounded="md" />
      </div>
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  cols = 4,
  className
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full rounded-xl border border-border bg-surface overflow-hidden shadow-xs", className)}>
      {/* Table Header */}
      <div className="p-4 border-b border-border bg-surface-subtle flex items-center gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Table Rows */}
      <div className="divide-y divide-border-subtle p-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-3 flex items-center gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonImage({
  aspectRatio = "aspect-video",
  className
}: {
  aspectRatio?: string;
  className?: string;
}) {
  return (
    <Skeleton
      className={cn("w-full relative overflow-hidden", aspectRatio, className)}
      rounded="xl"
    />
  );
}
