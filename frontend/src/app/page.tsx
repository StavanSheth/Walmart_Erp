"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { env } from "@/lib/config/env";
import { Activity, CheckCircle2, XCircle, RefreshCw, Database, Server, Laptop } from "lucide-react";

export default function HomePage() {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["backend-health"],
    queryFn: () => apiClient.getHealth()
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mb-2">
              Phase 1 Foundation
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Walmart ERP MVP
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Production-ready infrastructure &amp; connectivity verification
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="Re-check backend health"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Architecture Flow */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-center mb-2 text-blue-600 dark:text-blue-400">
              <Laptop className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold">Frontend</div>
            <div className="text-xs text-slate-500">Next.js :3000</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-center mb-2 text-indigo-600 dark:text-indigo-400">
              <Server className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold">Backend</div>
            <div className="text-xs text-slate-500">Fastify :4000</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-center mb-2 text-emerald-600 dark:text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold">Database</div>
            <div className="text-xs text-slate-500">PostgreSQL + Prisma</div>
          </div>
        </div>

        {/* Live Connectivity Test */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Backend Health Check Status
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              GET {env.NEXT_PUBLIC_API_URL}/health
            </span>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
            {isLoading ? (
              <div className="flex items-center gap-3 text-slate-500">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
                <span className="text-sm">Connecting to Fastify backend...</span>
              </div>
            ) : data?.status === "ok" ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Backend connection successful!</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Service: <strong className="font-mono">{data.service}</strong> | Status: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{data.status}</strong>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium">
                  <XCircle className="w-5 h-5" />
                  <span>Backend connection unreachable</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {error instanceof Error ? error.message : "Ensure the backend server is running on port 4000."}
                </p>
              </div>
            )}

            {data && (
              <div className="pt-2">
                <div className="text-xs text-slate-400 mb-1">Raw Response:</div>
                <pre className="text-xs font-mono bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 overflow-x-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Phase 1 Completion Note */}
        <div className="text-xs text-slate-400 dark:text-slate-500 text-center">
          Phase 1 Foundation • Clean architecture • Zero business module leaks
        </div>
      </div>
    </main>
  );
}
