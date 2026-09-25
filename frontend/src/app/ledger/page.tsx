"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { ResponsiveTable, type Column } from "@/components/common/responsive-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import { apiClient } from "@/lib/api/client";
import { formatCurrency } from "@/lib/format";

interface AccountItem {
  id: string;
  code: string;
  name: string;
  type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
  currency: string;
  balance: number;
  status: string;
}

export default function LedgerPage() {
  const [accounts, setAccounts] = React.useState<AccountItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadAccounts() {
      try {
        const res = await apiClient.get<AccountItem[]>("/api/ledger/accounts");
        if (res.data) {
          setAccounts(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch ledger accounts from database", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAccounts();
  }, []);

  const columns: Column<AccountItem>[] = [
    {
      key: "code",
      header: "Account Code",
      render: (item) => <span className="font-mono text-xs font-semibold tabular-nums">{item.code}</span>
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
                : "neutral"
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
      isNumeric: true,
      render: (item) => (
        <span className="font-semibold text-slate-900 font-mono tabular-nums">
          {formatCurrency(item.balance, true)}
        </span>
      )
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
          data={accounts}
          columns={columns}
          keyExtractor={(item) => item.code}
          isLoading={isLoading}
          mobileView="card"
          renderMobileCard={(item) => (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400 tabular-nums">{item.code}</span>
                <Badge variant={item.type === "ASSET" ? "success" : "neutral"}>
                  {item.type}
                </Badge>
              </div>
              <p className="font-semibold text-sm text-slate-900">{item.name}</p>
              <p className="text-sm font-mono font-bold text-slate-800 text-right pt-2 border-t border-border-subtle tabular-nums">
                {formatCurrency(item.balance, true)}
              </p>
            </div>
          )}
        />

        <Card className="border-dashed border-border bg-surface-subtle">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">
              General Ledger Chart of Accounts
            </CardTitle>
            <CardDescription className="mt-1">
              All accounts and live opening balances are retrieved in real-time from the PostgreSQL database ledger.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}
