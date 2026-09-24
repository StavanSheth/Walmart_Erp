import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircleIcon, RefreshCwIcon } from "../ui/icons";
import { Button } from "../ui/button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Unable to load data",
  message = "An unexpected error occurred while fetching information from the server.",
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-rose-200 bg-rose-50/50",
        className
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-600 mb-3">
        <AlertCircleIcon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-rose-900">{title}</h3>
      <p className="mt-1 text-xs text-rose-700 max-w-sm">{message}</p>
      {onRetry ? (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-rose-300 text-rose-800 hover:bg-rose-100"
          >
            <RefreshCwIcon className="w-3.5 h-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
      ) : null}
    </div>
  );
}
