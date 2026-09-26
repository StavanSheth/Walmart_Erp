"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { DashboardQueryParams, DashboardOverviewData } from "@/types/dashboard";

export function useDashboardOverview(params?: DashboardQueryParams) {
  return useQuery<DashboardOverviewData>({
    queryKey: ["dashboard", "overview", params?.storeId || "ALL", params?.period || "30d"],
    queryFn: async () => {
      const response = await apiClient.getDashboardOverview(params);
      const raw = response as any;
      const data = raw?.data?.summary
        ? raw.data
        : raw?.summary
        ? raw
        : raw?.data;
      return data as DashboardOverviewData;
    },
    staleTime: 60 * 1000,
    retry: 2
  });
}

