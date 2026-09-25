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
    // Intercept and swallow unhandled rejections caused by DOM Event objects (e.g. failed image/script/network load)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason instanceof Event ||
        (event.reason && typeof event.reason === "object" && !(event.reason instanceof Error))
      ) {
        event.preventDefault();
        console.warn("Prevented unhandled Event rejection overlay:", event.reason);
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
