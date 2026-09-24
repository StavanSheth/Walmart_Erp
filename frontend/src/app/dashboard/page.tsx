import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { Card, CardHeader, CardTitle, CardDescription, KPICard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SparkIcon, ArrowUpDownIcon, StoreIcon, PackageIcon } from "@/components/ui/icons";
import { BannerImage } from "@/components/common/responsive-image";

export default function DashboardPage() {
  return (
    <PageContainer
      title="Dashboard"
      description="Executive retail operations summary and key performance indicators."
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="spark" className="hidden sm:inline-flex">
            <SparkIcon className="w-3.5 h-3.5 mr-1" />
            Phase 4.5 Foundation
          </Badge>
          <Button variant="outline" size="sm">
            <ArrowUpDownIcon className="w-3.5 h-3.5 mr-1.5" />
            Export Summary
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Centralized Responsive Store Banner Component */}
        <BannerImage
          title="Walmart India Retail ERP"
          subtitle="Centralized retail operations management covering inventory replenishment, POS sales, multi-store logistics, and financial ledger."
          tag="Omnichannel Supercenter Network"
          priority
        />

        {/* Standardized Responsive KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Today's Gross Sales"
            value="₹4,82,500"
            change="↑ +12.4%"
            isPositive
            trendLabel="vs yesterday"
            icon={<span className="font-bold text-xs">₹</span>}
            iconBg="bg-emerald-50 text-semantic-success"
          />

          <KPICard
            title="Active Outlets"
            value="8 / 8 Stores"
            change="Operational"
            isPositive
            trendLabel="all regions"
            icon={<StoreIcon className="w-4 h-4" />}
            iconBg="bg-brand-sky text-brand-primary"
          />

          <KPICard
            title="Tracked SKUs"
            value="90 Products"
            change="12 SKUs"
            isPositive={false}
            trendLabel="below reorder level"
            icon={<PackageIcon className="w-4 h-4" />}
            iconBg="bg-amber-50 text-semantic-warning"
          />

          <KPICard
            title="GST Compliance"
            value="100% Balanced"
            change="DR == CR"
            isPositive
            trendLabel="trial balance"
            icon={<span className="font-bold text-[10px]">GST</span>}
            iconBg="bg-sky-50 text-semantic-info"
          />
        </div>

        {/* Phase 5 Scope Notice */}
        <Card className="border-dashed border-border bg-surface-subtle">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Dashboard Implementation Scope
                </CardTitle>
                <CardDescription className="mt-1">
                  Full analytics charts, store performance rankings, and real-time sales feeds will be connected in Phase 5.
                </CardDescription>
              </div>
              <Badge variant="outline" className="self-start sm:self-auto">
                Phase 4.5 Foundation Locked
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}
