"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  PartnersQueryParams,
  PartnersOverviewData,
  PartnerDetailData,
  CreatePartnerInput
} from "@/types/partners";

export function usePartners(params?: PartnersQueryParams) {
  return useQuery<PartnersOverviewData>({
    queryKey: [
      "partners",
      "overview",
      params?.tab || "overview",
      params?.search || "",
      params?.type || "ALL",
      params?.regionId || "ALL",
      params?.status || "ALL",
      params?.page || 1,
      params?.pageSize || 10,
      params?.period || "6m"
    ],
    queryFn: async () => {
      const response = await apiClient.getPartnersOverview(params);
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    retry: 2
  });
}

export function usePartnerDetail(id: string | null) {
  return useQuery<PartnerDetailData>({
    queryKey: ["partners", "detail", id],
    queryFn: async () => {
      if (!id) throw new Error("Partner or Customer ID is required");
      const response = await apiClient.getPartnerDetail(id);
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
    retry: 1
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePartnerInput) => {
      return await apiClient.createPartner(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners", "overview"] });
    }
  });
}
