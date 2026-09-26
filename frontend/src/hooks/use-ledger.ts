"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  LedgerOverviewData,
  TransactionRow,
  AccountItem,
  CreateJournalEntryInput,
  ReconcileResult
} from "@/types/ledger";

export function useLedgerOverview() {
  return useQuery<LedgerOverviewData>({
    queryKey: ["ledger", "overview"],
    queryFn: async () => {
      const res = await apiClient.getLedgerOverview();
      return res.data;
    },
    staleTime: 10 * 1000,
    retry: 2
  });
}

export function useLedgerTransactions(params?: {
  q?: string;
  account?: string;
  type?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery<{
    transactions: TransactionRow[];
    total: number;
    limit: number;
    offset: number;
  }>({
    queryKey: [
      "ledger",
      "transactions",
      params?.q || "",
      params?.account || "ALL",
      params?.type || "ALL",
      params?.status || "ALL",
      params?.limit || 20,
      params?.offset || 0
    ],
    queryFn: async () => {
      const res = await apiClient.getLedgerTransactions(params);
      return res.data;
    },
    staleTime: 10 * 1000,
    retry: 2
  });
}

export function useLedgerAccounts() {
  return useQuery<AccountItem[]>({
    queryKey: ["ledger", "accounts"],
    queryFn: async () => {
      const res = await apiClient.getLedgerAccounts();
      return res.data;
    },
    staleTime: 30 * 1000,
    retry: 2
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateJournalEntryInput) => {
      const res = await apiClient.createJournalEntry(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ledger", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["ledger", "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["ledger", "accounts"] });
    }
  });
}

export function useUploadTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entries: CreateJournalEntryInput[]) => {
      return await apiClient.uploadTransactions(entries);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ledger", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["ledger", "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["ledger", "accounts"] });
    }
  });
}

export function useReconcileLedger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload?: { accountId?: string }) => {
      const res = await apiClient.reconcileLedger(payload);
      return res.data as ReconcileResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ledger", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["ledger", "transactions"] });
    }
  });
}
