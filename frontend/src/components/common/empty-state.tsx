import * as React from "react";
import { cn } from "@/lib/cn";
import { InfoIcon } from "../ui/icons";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "No data found",
  description = "There are no records matching your current filter criteria.",
  icon,
  action,
  className
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-border-strong bg-surface-subtle/60",
        className
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-muted text-slate-400 mb-3">
        {icon || <InfoIcon className="w-6 h-6" />}
      </div>
      <h3 className="type-card-title text-slate-900">{title}</h3>
      <p className="type-body-secondary mt-1 max-w-sm">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
