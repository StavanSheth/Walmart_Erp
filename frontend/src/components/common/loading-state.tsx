import * as React from "react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  message?: string;
  variant?: "spinner" | "skeleton" | "card";
  className?: string;
}

export function LoadingState({
  message = "Loading data...",
  variant = "spinner",
  className
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className={cn("w-full space-y-3 p-4", className)}>
        <div className="h-6 w-1/3 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
        <div className="space-y-2 pt-2">
          <div className="h-10 w-full bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-10 w-full bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-10 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl border border-slate-200 bg-white p-5 space-y-3 animate-pulse">
            <div className="h-4 w-1/2 bg-slate-200 rounded" />
            <div className="h-7 w-3/4 bg-slate-100 rounded" />
          </div>
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
        <div className="w-8 h-8 rounded-full border-3 border-walmart-blue/20 border-t-walmart-blue animate-spin" />
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500 animate-pulse">{message}</p>
    </div>
  );
}
