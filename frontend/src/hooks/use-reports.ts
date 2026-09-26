"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  ReportsQueryParams,
  ReportsOverviewData,
  GenerateReportInput,
  GeneratedReportRecord,
  ScheduledReportItem
} from "@/types/reports";

export function useReportsOverview(params?: ReportsQueryParams) {
  return useQuery<ReportsOverviewData>({
    queryKey: [
      "reports",
      "overview",
      params?.reportType || "SALES",
      params?.period || "30d",
      params?.regionId || "ALL",
      params?.storeId || "ALL",
      params?.categoryId || "ALL",
      params?.productId || "ALL",
      params?.partnerType || "ALL",
      params?.partnerId || "ALL",
      params?.status || "ALL",
      params?.search || "",
      params?.page || 1,
      params?.pageSize || 10
    ],
    queryFn: async () => {
      const response = await apiClient.getReportsOverview(params);
      return response.data;
    },
    staleTime: 30 * 1000,
    retry: 2
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; data: GeneratedReportRecord }, Error, GenerateReportInput>({
    mutationFn: async (payload: GenerateReportInput) => {
      return apiClient.generateReport(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  });
}

export function useToggleScheduledReport() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; data: ScheduledReportItem }, Error, { id: string; enabled?: boolean }>({
    mutationFn: async ({ id, enabled }) => {
      return apiClient.toggleScheduledReport(id, enabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  });
}
