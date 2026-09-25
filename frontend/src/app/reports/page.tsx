"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReportsIcon, ArrowUpDownIcon } from "@/components/ui/icons";
import { useDashboardOverview } from "@/hooks/use-dashboard";
import { Skeleton } from "@/components/common/loading-state";

export default function ReportsPage() {
  const { data, isLoading } = useDashboardOverview({ period: "30d" });

  const totalSales = data?.salesOverview?.totalSales ?? 0;
  const inventoryValue = data?.mobileSummary?.inventoryValue ?? 0;
  const orderCount = data?.mobileSummary?.totalOrders ?? 0;

  const reports = [
    {
      title: "GST GSTR-1 Sales Return",
      description: "Outward supplies summary categorized by HSN and tax slabs (0%, 5%, 12%, 18%, 28%).",
      freq: "Monthly",
      type: "Tax Compliance",
      liveMetric: totalSales ? `$${totalSales.toLocaleString()} Net Outward Supplies` : null
    },
    {
      title: "Inventory Aging & Stock Valuation",
      description: "Weighted average stock value, slow-moving items, and stock-out projections.",
      freq: "Weekly",
      type: "Operations",
      liveMetric: inventoryValue ? `$${inventoryValue.toLocaleString()} Current Stock Value` : null
    },
    {
      title: "Store Sales & Margin Breakdown",
      description: "Gross margin, net revenue, basket size, and tender type distributions.",
      freq: "Daily",
      type: "Financial",
      liveMetric: orderCount ? `${orderCount} Completed Sales Transactions` : null
    },
    {
      title: "System Audit & Security Logs",
      description: "User login events, inventory adjustments, and administrative overrides.",
      freq: "Real-time",
      type: "Security",
      liveMetric: data?.recentActivity ? `${data.recentActivity.length} Recent Ledger Events` : null
    }
  ];

  return (
    <PageContainer
      title="Reports & Analytics"
      description="Standardized retail reports, GST compliance exports, and system audit logs synchronized live from the database."
      actions={
        <Button variant="outline" size="sm">
          <ArrowUpDownIcon className="w-3.5 h-3.5 mr-1" />
          Schedule Report
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Live Database Snapshot Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-white">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              30-Day Database Revenue
            </span>
            {isLoading ? (
              <Skeleton className="h-8 w-32 mt-1 rounded" />
            ) : (
              <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
                ${totalSales.toLocaleString()}
              </p>
            )}
            <span className="text-[11px] text-emerald-600 font-medium">PostgreSQL Live Record</span>
          </Card>

          <Card className="p-4 bg-white">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Total Inventory Valuation
            </span>
            {isLoading ? (
              <Skeleton className="h-8 w-32 mt-1 rounded" />
            ) : (
              <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
                ${inventoryValue.toLocaleString()}
              </p>
            )}
            <span className="text-[11px] text-emerald-600 font-medium">PostgreSQL Live Valuation</span>
          </Card>

          <Card className="p-4 bg-white">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Audited Order Count
            </span>
            {isLoading ? (
              <Skeleton className="h-8 w-32 mt-1 rounded" />
            ) : (
              <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
                {orderCount} Orders
              </p>
            )}
            <span className="text-[11px] text-emerald-600 font-medium">PostgreSQL Live Ledger</span>
          </Card>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="neutral">{rep.type}</Badge>
                  <span className="text-[11px] font-medium text-slate-400">{rep.freq}</span>
                </div>
                <CardTitle className="mt-2">{rep.title}</CardTitle>
                <CardDescription>{rep.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 space-y-3">
                {rep.liveMetric && (
                  <div className="p-2.5 rounded-lg bg-surface-subtle border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Live Database Value:</span>
                    <span className="font-mono font-semibold text-slate-900">{rep.liveMetric}</span>
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <ReportsIcon className="w-3.5 h-3.5 mr-1.5" />
                  Export Report (Live DB)
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-dashed border-border bg-surface-subtle">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Reports & Compliance Live Data Status
            </CardTitle>
            <CardDescription className="mt-1">
              All financial summaries, outward GST transactions, stock valuation, and audit trail metrics are computed directly from the PostgreSQL database in real time.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}
