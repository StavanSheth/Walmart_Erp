import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReportsIcon, ArrowUpDownIcon } from "@/components/ui/icons";

export default function ReportsPage() {
  const reports = [
    { title: "GST GSTR-1 Sales Return", description: "Outward supplies summary categorized by HSN and tax slabs (0%, 5%, 12%, 18%, 28%).", freq: "Monthly", type: "Tax Compliance" },
    { title: "Inventory Aging & Stock Valuation", description: "Weighted average stock value, slow-moving items, and stock-out projections.", freq: "Weekly", type: "Operations" },
    { title: "Store Sales & Margin Breakdown", description: "Gross margin, net revenue, basket size, and tender type distributions.", freq: "Daily", type: "Financial" },
    { title: "System Audit & Security Logs", description: "User login events, inventory adjustments, and administrative overrides.", freq: "Real-time", type: "Security" }
  ];

  return (
    <PageContainer
      title="Reports & Analytics"
      description="Standardized retail reports, GST compliance exports, and system audit logs."
      actions={
        <Button variant="outline" size="sm">
          <ArrowUpDownIcon className="w-3.5 h-3.5 mr-1" />
          Schedule Report
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="default">{rep.type}</Badge>
                  <span className="text-[11px] font-medium text-slate-400">{rep.freq}</span>
                </div>
                <CardTitle className="text-sm font-semibold mt-2">{rep.title}</CardTitle>
                <CardDescription>{rep.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <ReportsIcon className="w-3.5 h-3.5 mr-1.5" />
                  Generate Report Shell
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-dashed border-slate-300 bg-slate-50/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Reports Module Scope
            </CardTitle>
            <CardDescription className="mt-1">
              Automated PDF generation, Excel exports, custom date range filtering, and drill-down analytics will be implemented in future phases.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}
