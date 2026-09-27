"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { LedgerHeroHeader } from "@/components/ledger/ledger-hero-header";
import { LedgerSearchBar } from "@/components/ledger/ledger-search-bar";
import { LedgerKpiGrid } from "@/components/ledger/ledger-kpi-grid";
import { LedgerTabs, type LedgerTabType } from "@/components/ledger/ledger-tabs";
import { TransactionTrendsChart } from "@/components/ledger/transaction-trends-chart";
import { RecentTransactionsSection } from "@/components/ledger/recent-transactions-section";
import { AccountSummaryCard } from "@/components/ledger/account-summary-card";
import { TransactionsDonutChart } from "@/components/ledger/transactions-donut-chart";
import { QuickActionsCard } from "@/components/ledger/quick-actions-card";
import { NewJournalEntryModal } from "@/components/ledger/new-journal-entry-modal";
import { UploadTransactionsModal } from "@/components/ledger/upload-transactions-modal";
import { ReconcileModal } from "@/components/ledger/reconcile-modal";
import { GenerateReportModal } from "@/components/ledger/generate-report-modal";
import { QrScannerModal } from "@/components/ledger/qr-scanner-modal";
import { AccountsTableTab } from "@/components/ledger/accounts-table-tab";
import { ReconciliationTab } from "@/components/ledger/reconciliation-tab";
import { JournalEntriesTab } from "@/components/ledger/journal-entries-tab";
import {
  useLedgerOverview,
  useLedgerAccounts,
  useCreateJournalEntry,
  useUploadTransactions,
  useReconcileLedger
} from "@/hooks/use-ledger";
import type { TransactionRow, CreateJournalEntryInput } from "@/types/ledger";

export default function LedgerPage() {
  const [activeTab, setActiveTab] = React.useState<LedgerTabType>("transactions");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modals state
  const [isNewEntryOpen, setIsNewEntryOpen] = React.useState(false);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [isReconcileOpen, setIsReconcileOpen] = React.useState(false);
  const [isReportOpen, setIsReportOpen] = React.useState(false);
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);
  const [selectedTx, setSelectedTx] = React.useState<TransactionRow | null>(null);

  // Live Database Queries & Mutations
  const { data: overview, isLoading: isOverviewLoading } = useLedgerOverview();
  const { data: accounts = [], isLoading: isAccountsLoading } = useLedgerAccounts();
  const createJournalEntryMutation = useCreateJournalEntry();
  const uploadTransactionsMutation = useUploadTransactions();
  const reconcileLedgerMutation = useReconcileLedger();

  // Filter transactions based on search query (Transactions, Accounts, Reference numbers)
  const filteredTransactions = React.useMemo(() => {
    const list = overview?.recentTransactions || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (tx) =>
        tx.title.toLowerCase().includes(q) ||
        tx.account.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        tx.reference.toLowerCase().includes(q) ||
        tx.transactionId.toLowerCase().includes(q)
    );
  }, [overview?.recentTransactions, searchQuery]);

  // Handlers for quick actions
  const handleCreateEntry = async (entry: CreateJournalEntryInput) => {
    await createJournalEntryMutation.mutateAsync(entry);
  };

  const handleUploadEntries = async (entries: CreateJournalEntryInput[]) => {
    await uploadTransactionsMutation.mutateAsync(entries);
  };

  const handleRunReconciliation = async () => {
    return await reconcileLedgerMutation.mutateAsync();
  };

  return (
    <PageContainer>
      <div className="space-y-4 sm:space-y-5 pb-20 md:pb-8">
        {/* 1. Header / Navigation: Back arrow, Document icon, Title, Subtitle, over Walmart banner */}
        <LedgerHeroHeader />

        {/* 2. Search Field: Search transactions, accounts, or reference... with QR/scanner icon */}
        <div className="pt-1 pb-2">
          <LedgerSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        </div>

        {/* 3. KPI Cards — 4: Total Transactions, Total Debits, Total Credits, Account Balance with Sparklines */}
        {/* Horizon spacing matching Dashboard layout */}
        <div className="pt-2 sm:pt-3">
          <LedgerKpiGrid
            kpis={overview?.kpis}
            isLoading={isOverviewLoading}
          />
        </div>

        {/* Horizon spacing to content canvas */}
        <div className="pt-2 sm:pt-4 space-y-4 sm:space-y-5">
          {/* 4. Ledger Navigation Tabs: Transactions (active), Accounts, Reconciliation, Journal Entries, More ▼ */}
          <LedgerTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab Content Display */}
          {activeTab === "transactions" && (
            <div className="space-y-4 sm:space-y-5">
              {/* Top Row: Transaction Trends (Half) + Donut/Pie Chart (Half) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">
                <div className="h-full">
                  <TransactionTrendsChart trends={overview?.trends} className="h-full" />
                </div>
                <div className="h-full">
                  <TransactionsDonutChart
                    distribution={overview?.accountDistribution}
                    totalTransactions={overview?.kpis?.[0]?.value || (overview?.recentTransactions ? String(overview.recentTransactions.length) : "0")}
                    className="h-full"
                  />
                </div>
              </div>

              {/* Two-Column Responsive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
                {/* 6. Recent Transactions List (8 cols on desktop) */}
                <div className="lg:col-span-8">
                  <RecentTransactionsSection
                    transactions={filteredTransactions}
                    onViewAll={() => setActiveTab("journal")}
                    onSelectTransaction={(tx) => setSelectedTx(tx)}
                  />
                </div>

                {/* Right Column: Account Summary & Quick Actions (4 cols on desktop) */}
                <div className="lg:col-span-4 space-y-4 sm:space-y-5">
                  {/* 8. Account Summary: Accounts Receivable, Accounts Payable, Cash & Bank, Inventory */}
                  <AccountSummaryCard
                    accounts={overview?.accountSummary}
                    onViewAll={() => setActiveTab("accounts")}
                  />

                  {/* 9. Quick Actions: New Journal Entry, Upload Transactions, Reconcile Account, Generate Report */}
                  <QuickActionsCard
                    onNewJournalEntry={() => setIsNewEntryOpen(true)}
                    onUploadTransactions={() => setIsUploadOpen(true)}
                    onReconcileAccount={() => setIsReconcileOpen(true)}
                    onGenerateReport={() => setIsReportOpen(true)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "accounts" && (
            <AccountsTableTab
              accounts={accounts}
              isLoading={isAccountsLoading}
            />
          )}

          {activeTab === "reconciliation" && (
            <ReconciliationTab
              accounts={accounts}
              onOpenReconcileModal={() => setIsReconcileOpen(true)}
            />
          )}

          {activeTab === "journal" && (
            <JournalEntriesTab
              transactions={filteredTransactions}
              onNewEntry={() => setIsNewEntryOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Functional Action Modals */}
      <NewJournalEntryModal
        isOpen={isNewEntryOpen}
        onClose={() => setIsNewEntryOpen(false)}
        accounts={accounts}
        onSubmit={handleCreateEntry}
      />

      <UploadTransactionsModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadEntries}
      />

      <ReconcileModal
        isOpen={isReconcileOpen}
        onClose={() => setIsReconcileOpen(false)}
        onReconcile={handleRunReconciliation}
      />

      <GenerateReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        accounts={accounts}
      />

      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanResult={(code) => setSearchQuery(code)}
      />

      {/* Transaction Details Modal if a transaction is clicked */}
      {selectedTx && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Transaction Voucher</span>
                <h3 className="text-base font-bold text-slate-900">{selectedTx.title}</h3>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  selectedTx.status === "Posted"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {selectedTx.status}
              </span>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Reference:</span>
                <span className="font-mono font-bold text-slate-800">{selectedTx.reference}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Account Category:</span>
                <span className="font-semibold text-slate-900">{selectedTx.account}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Accounting Flow:</span>
                <span className={`font-bold ${selectedTx.debitOrCredit === "Credit" ? "text-emerald-600" : "text-rose-600"}`}>
                  {selectedTx.debitOrCredit}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Amount:</span>
                <span className="font-mono font-black text-slate-900 text-sm">{selectedTx.formattedAmount}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Posted Timestamp:</span>
                <span className="text-slate-700">{selectedTx.transactionTime}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
