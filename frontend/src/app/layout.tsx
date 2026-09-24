import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Walmart ERP — Enterprise Retail Operations",
  description: "Walmart India ERP Application Shell and Operations Platform",
  icons: {
    icon: "/brand/walmart-spark.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-walmart-surface text-slate-900">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
