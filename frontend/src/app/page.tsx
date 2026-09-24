"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api/client";
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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Walmart ERP</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Phase 1 Foundation Verification
          </p>
        </div>

        {/* Connectivity Status List */}
        <div className="space-y-3">
          {/* Frontend Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <span className="text-sm font-medium">Frontend</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              OK
            </span>
          </div>

          {/* Backend Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <span className="text-sm font-medium">Backend</span>
            {isLoading ? (
              <span className="text-xs text-slate-400 animate-pulse">Checking...</span>
            ) : isBackendRunning ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                OK
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                Unavailable
              </span>
            )}
          </div>

          {/* Database Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <span className="text-sm font-medium">Database</span>
            {isLoading ? (
              <span className="text-xs text-slate-400 animate-pulse">Checking...</span>
            ) : isDatabaseOk ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                OK
              </span>
            ) : isBackendRunning ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Unavailable
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                Unavailable
              </span>
            )}
          </div>
        </div>

        {/* State Alerts */}
        {isLoading && (
          <div className="text-center text-xs text-slate-500 py-2">
            Verifying service health...
          </div>
        )}

        {!isLoading && !isBackendRunning && error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
            <strong>Backend Unreachable:</strong> Ensure Fastify is running on port 4000.
          </div>
        )}

        {!isLoading && isBackendRunning && !isDatabaseOk && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
            <strong>Database Offline:</strong> Backend verified PostgreSQL is unreachable on port 5432. Start PostgreSQL to connect.
          </div>
        )}

        {!isLoading && isBackendRunning && isDatabaseOk && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-300">
            <strong>All Systems Operational:</strong> Frontend, Fastify, and PostgreSQL are connected.
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {isFetching ? "Checking..." : "Retry Connection"}
          </button>
        </div>
      </div>
    </main>
  );
}
