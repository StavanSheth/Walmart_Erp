"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { DashboardQueryParams, DashboardOverviewData } from "@/types/dashboard";

export function useDashboardOverview(params?: DashboardQueryParams) {
  return useQuery<DashboardOverviewData>({
    queryKey: ["dashboard", "overview", params?.storeId, params?.period],
    queryFn: async () => {
      const response = await apiClient.getDashboardOverview(params);
      return response.data;
    },
    staleTime: 60 * 1000,
    retry: 2
  });
}
