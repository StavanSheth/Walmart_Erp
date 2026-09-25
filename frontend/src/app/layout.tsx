import * as React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AppShell } from "@/components/layout/app-shell";
import { ASSETS } from "@/lib/assets";

export const metadata: Metadata = {
  title: "Walmart ERP — Enterprise Retail Operations",
  description: "Walmart India ERP Application Shell and Operations Platform",
  icons: {
    icon: ASSETS.brand.spark
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-surface-page text-slate-900" suppressHydrationWarning>
        <Providers>
          <AppShell>
            <React.Suspense fallback={null}>
              {children}
            </React.Suspense>
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
