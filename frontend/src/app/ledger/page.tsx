"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { ResponsiveTable, type Column } from "@/components/common/responsive-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";

interface DemoAccountItem {
  code: string;
  name: string;
  type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
  balance: string;
}

const DEMO_ACCOUNTS: DemoAccountItem[] = [
  { code: "1010", name: "HDFC Operating Bank Account", type: "ASSET", balance: "₹45,20,000.00" },
  { code: "1020", name: "Cash on Hand / POS Till", type: "ASSET", balance: "₹1,85,400.00" },
  { code: "1030", name: "Accounts Receivable", type: "ASSET", balance: "₹12,40,000.00" },
  { code: "1040", name: "Merchandise Inventory", type: "ASSET", balance: "₹88,50,000.00" },
  { code: "2010", name: "Accounts Payable (Trade Vendors)", type: "LIABILITY", balance: "₹34,10,000.00" },
  { code: "2020", name: "GST Output Tax Payable", type: "LIABILITY", balance: "₹8,45,200.00" },
  { code: "4010", name: "Retail Merchandise Sales Revenue", type: "REVENUE", balance: "₹1,42,80,000.00" },
  { code: "5010", name: "Cost of Goods Sold (COGS)", type: "EXPENSE", balance: "₹92,30,000.00" }
];

export default function LedgerPage() {
  const columns: Column<DemoAccountItem>[] = [
    {
      key: "code",
      header: "Account Code",
      render: (item) => <span className="font-mono text-xs font-semibold">{item.code}</span>
    },
    {
      key: "name",
      header: "Account Title",
      render: (item) => <span className="font-medium text-slate-900">{item.name}</span>
    },
    {
      key: "type",
      header: "Classification",
      render: (item) => (
        <Badge
          variant={
            item.type === "ASSET" || item.type === "REVENUE"
              ? "success"
              : item.type === "LIABILITY"
                ? "warning"
                : "default"
          }
        >
          {item.type}
        </Badge>
      )
    },
    {
      key: "balance",
      header: "Current Balance",
      align: "right",
      render: (item) => <span className="font-semibold text-slate-900 font-mono">{item.balance}</span>
    }
  ];

  return (
    <PageContainer
      title="General Ledger"
      description="Double-entry Chart of Accounts, balanced journal entries, and financial statements."
      actions={
        <Button size="sm">
          <PlusIcon className="w-3.5 h-3.5 mr-1" />
          New Journal Entry
        </Button>
      }
    >
      <div className="space-y-6">
        <ResponsiveTable
          data={DEMO_ACCOUNTS}
          columns={columns}
          keyExtractor={(item) => item.code}
          mobileView="card"
          renderMobileCard={(item) => (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400">{item.code}</span>
                <Badge variant={item.type === "ASSET" ? "success" : "default"}>
                  {item.type}
                </Badge>
              </div>
              <p className="font-semibold text-sm text-slate-900">{item.name}</p>
              <p className="text-sm font-mono font-bold text-slate-800 text-right pt-2 border-t border-slate-100">
                {item.balance}
              </p>
            </div>
          )}
        />

        <Card className="border-dashed border-slate-300 bg-slate-50/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">
              General Ledger Module Scope
            </CardTitle>
            <CardDescription className="mt-1">
              Financial journal posting, trial balance reconciliation, P&L reporting, and balance sheet generation will be implemented in future phases.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}
