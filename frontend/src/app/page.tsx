"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api/client";
import { env } from "@/lib/config/env";
import type { HealthResponse } from "@/types/api";

export default function HomePage() {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["health-check"],
    queryFn: () => apiClient.getHealth(),
    retry: 1
  });

  // Extract health info from successful 200 response or 503 degraded error response
  let healthInfo: HealthResponse | null = data ?? null;
  if (!healthInfo && error instanceof ApiError && error.data && typeof error.data === "object") {
    const errorBody = error.data as Partial<HealthResponse>;
    if (errorBody.service === "walmart-erp-backend") {
      healthInfo = errorBody as HealthResponse;
    }
  }

  const isBackendRunning = Boolean(healthInfo?.service === "walmart-erp-backend");
  const isDatabaseOk = healthInfo?.database === "ok";

  const backendStatus = isLoading
    ? "Checking"
    : isBackendRunning
      ? "Connected"
      : "Unavailable";

  const databaseStatus = isLoading
    ? "Checking"
    : isDatabaseOk
      ? "Connected"
      : "Unavailable";

  const renderBadge = (status: "Connected" | "Checking" | "Unavailable") => {
    switch (status) {
      case "Connected":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Connected
          </span>
        );
      case "Checking":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 animate-pulse">
            Checking
          </span>
        );
      case "Unavailable":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            Unavailable
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-xl font-bold tracking-tight">Walmart ERP</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Phase 1 Foundation Verification
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <span className="font-medium">Frontend</span>
            {renderBadge("Connected")}
          </div>

          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <span className="font-medium">Backend</span>
            {renderBadge(backendStatus)}
          </div>

          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <span className="font-medium">Database</span>
            {renderBadge(databaseStatus)}
          </div>
        </div>

        {/* State Information */}
        {isLoading && (
          <p className="text-center text-xs text-slate-500 animate-pulse">
            Checking services...
          </p>
        )}

        {!isLoading && !isBackendRunning && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300">
            Backend is unavailable at <span className="font-mono">{env.NEXT_PUBLIC_API_URL}</span>.
          </div>
        )}

        {!isLoading && isBackendRunning && !isDatabaseOk && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-xs text-amber-800 dark:text-amber-300">
            Backend is running, but database connection is unavailable.
          </div>
        )}

        {!isLoading && isBackendRunning && isDatabaseOk && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-800 dark:text-emerald-300">
            All foundation services are operational.
          </div>
        )}

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          {isFetching ? "Checking..." : "Retry Connection"}
        </button>
      </div>
    </main>
  );
}
