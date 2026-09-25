"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, RefreshCwIcon } from "@/components/ui/icons";

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Next.js App Router caught runtime error:", error);
  }, [error]);

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null
      ? (error as { message?: string }).message || "An unexpected application event occurred"
      : String(error);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-white border border-rose-200 shadow-md text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircleIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Application Notice</h2>
          <p className="text-xs text-slate-500 mt-1">{errorMessage}</p>
        </div>
        <div className="pt-2">
          <Button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-brand-primary hover:bg-blue-600 text-white font-bold text-xs px-5 py-2 inline-flex items-center gap-2"
          >
            <RefreshCwIcon className="w-3.5 h-3.5" />
            <span>Reload View</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
