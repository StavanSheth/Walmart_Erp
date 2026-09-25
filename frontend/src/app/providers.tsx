"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1
          }
        }
      })
  );

  useEffect(() => {
    // 1. Auto-reload when chunk hashes are invalidated (e.g. after a rebuild or dev server restart)
    const handleError = (event: ErrorEvent) => {
      const message = event.message || "";
      if (
        message.includes("ChunkLoadError") ||
        message.includes("Loading chunk") ||
        message.includes("Failed to fetch dynamically imported module")
      ) {
        event.preventDefault();
        console.warn("ChunkLoadError detected, refreshing page for updated assets...");
        window.location.reload();
      }
    };

    // 2. Intercept and swallow unhandled rejections caused by DOM Event objects or chunk load failures
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason?.name === "ChunkLoadError" ||
        (typeof event.reason?.message === "string" &&
          (event.reason.message.includes("ChunkLoadError") ||
            event.reason.message.includes("Loading chunk") ||
            event.reason.message.includes("Failed to fetch dynamically imported module")))
      ) {
        event.preventDefault();
        console.warn("ChunkLoadError detected in promise rejection, refreshing page...");
        window.location.reload();
        return;
      }

      if (
        event.reason instanceof Event ||
        (event.reason && typeof event.reason === "object" && !(event.reason instanceof Error))
      ) {
        event.preventDefault();
        console.warn("Prevented unhandled Event rejection overlay:", event.reason);
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
