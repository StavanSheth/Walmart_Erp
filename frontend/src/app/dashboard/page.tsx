import * as React from "react";
import Image from "next/image";
import { PageContainer } from "@/components/common/page-container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SparkIcon, ArrowUpDownIcon, StoreIcon, PackageIcon } from "@/components/ui/icons";

export default function DashboardPage() {
  return (
    <PageContainer
      title="Dashboard"
      description="Executive retail operations summary and key performance indicators."
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="spark" className="hidden sm:inline-flex">
            <SparkIcon className="w-3.5 h-3.5 mr-1" />
            Phase 4 Foundation
          </Badge>
          <Button variant="outline" size="sm">
            <ArrowUpDownIcon className="w-3.5 h-3.5 mr-1.5" />
            Export Summary
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Responsive Store Banner */}
        <div className="relative w-full h-40 sm:h-52 md:h-64 lg:h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
          <Image
            src="/images/banners/store-banner.webp"
            alt="Walmart India Retail Supercenter"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-walmart-navy-dark/90 via-walmart-navy-dark/40 to-transparent flex flex-col justify-end p-5 sm:p-7 text-white">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-walmart-yellow/20 text-walmart-yellow text-xs font-semibold backdrop-blur-xs w-fit mb-2">
              <SparkIcon className="w-3.5 h-3.5" />
              <span>Omnichannel Supercenter Network</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Walmart India Retail ERP
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
              Centralized retail operations management covering inventory replenishment, POS sales, multi-store logistics, and financial ledger.
            </p>
          </div>
        </div>

        {/* Responsive KPI Cards Shell */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-slate-500">Today&apos;s Gross Sales</CardTitle>
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">₹</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">₹4,82,500</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
                <span>↑ +12.4%</span>
                <span className="text-slate-400 font-normal">vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-slate-500">Active Outlets</CardTitle>
              <div className="p-1.5 rounded-lg bg-blue-50 text-walmart-blue">
                <StoreIcon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">8 / 8 Stores</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-normal mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span>All regions operational</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-slate-500">Tracked SKUs</CardTitle>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <PackageIcon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">90 Products</div>
              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium mt-1">
                <span>12 SKUs</span>
                <span className="text-slate-400 font-normal">below reorder point</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-slate-500">GST Compliance</CardTitle>
              <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 font-semibold text-xs">GST</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">100% Balanced</div>
              <div className="flex items-center gap-1.5 text-xs text-sky-600 font-medium mt-1">
                <span>Trial Balance:</span>
                <span className="text-slate-400 font-normal">DR == CR</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Phase 5 Notice Box */}
        <Card className="border-dashed border-slate-300 bg-slate-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Dashboard Implementation Scope
                </CardTitle>
                <CardDescription className="mt-1">
                  Dashboard charts, store performance rankings, and real-time sales feeds will be implemented in Phase 5.
                </CardDescription>
              </div>
              <Badge variant="outline">Phase 4 Foundation Ready</Badge>
            </div>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}
