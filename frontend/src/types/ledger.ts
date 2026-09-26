export type TransactionStatus = "Posted" | "Pending";
export type TransactionFlow = "Debit" | "Credit";
export type TransactionIconType = "document" | "cart" | "bank" | "truck" | "chart";

export interface TransactionRow {
  transactionId: string;
  transactionType: string;
  title: string;
  reference: string;
  account: string;
  category: string;
  debitOrCredit: TransactionFlow;
  amount: number;
  formattedAmount: string;
  debitAmount: number | null;
  creditAmount: number | null;
  transactionDate: string;
  transactionTime: string;
  status: TransactionStatus;
  icon: TransactionIconType;
}

export interface KpiCardData {
  id: string;
  title: string;
  value: string;
  rawValue: number;
  trend: string;
  trendDirection: "up" | "down";
  period: string;
  icon: "database" | "debit" | "credit" | "balance";
  sparkline: number[];
}

export interface AccountSummaryItem {
  id: string;
  code: string;
  name: string;
  balance: string;
  rawBalance: number;
  trend: string;
  trendDirection: "up" | "down";
  icon: "wallet" | "bank" | "box" | "trend";
}

export interface MonthlyTrendData {
  month: string;
  shortMonth: string;
  debits: number;
  credits: number;
  debitsFormatted: string;
  creditsFormatted: string;
}

export interface AccountDistributionItem {
  name: string;
  percentage: number;
  color: string;
}

export interface LedgerOverviewData {
  kpis: KpiCardData[];
  trends: MonthlyTrendData[];
  recentTransactions: TransactionRow[];
  accountSummary: AccountSummaryItem[];
  accountDistribution: AccountDistributionItem[];
}

export interface AccountItem {
  id: string;
  code: string;
  name: string;
  type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
  currency: string;
  totalDebit: number;
  totalCredit: number;
  balance: number;
  formattedBalance: string;
  transactionCount: number;
  status: string;
}

export interface CreateJournalLineInput {
  accountId: string;
  debit: number;
  credit: number;
}

export interface CreateJournalEntryInput {
  description: string;
  referenceNumber?: string;
  referenceType?: string;
  referenceId?: string;
  entryDate?: string;
  lines: CreateJournalLineInput[];
}

export interface ReconcileResult {
  success: boolean;
  reconciliationStatus: "RECONCILED" | "DISCREPANCY_DETECTED";
  totalDebits: number;
  totalCredits: number;
  discrepancy: number;
  isBalanced: boolean;
  pendingItemsCount: number;
  auditedAt: string;
  message: string;
}
