"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api/client";
import type {
  SettingsOverviewResponse,
  CompanyInformation,
  RegionalSettings,
  AppearancePreferences
} from "@/types/settings";

export function useSettingsOverview(simulatedRole?: string) {
  return useQuery({
    queryKey: ["settings", "overview", simulatedRole],
    queryFn: async () => {
      const url = simulatedRole ? `/api/settings/overview?role=${encodeURIComponent(simulatedRole)}` : "/api/settings/overview";
      const res = await apiClient.get<SettingsOverviewResponse>(url);
      return res.data;
    },
    staleTime: 30000
  });
}

export function useUpdateCompanySettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload, simulatedRole }: { payload: Partial<CompanyInformation>; simulatedRole?: string }) => {
      const url = simulatedRole ? `/api/settings/company?role=${encodeURIComponent(simulatedRole)}` : "/api/settings/company";
      return await apiClient.request<{ success: boolean; message: string; data: CompanyInformation }>(url, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "overview"] });
    }
  });
}

export function useUpdateRegionalSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload, simulatedRole }: { payload: Partial<RegionalSettings>; simulatedRole?: string }) => {
      const url = simulatedRole ? `/api/settings/regional?role=${encodeURIComponent(simulatedRole)}` : "/api/settings/regional";
      return await apiClient.request<{ success: boolean; message: string; data: RegionalSettings }>(url, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "overview"] });
    }
  });
}

export function useUpdateAppearancePreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<AppearancePreferences>) => {
      return await apiClient.request<{ success: boolean; message: string; data: AppearancePreferences }>("/api/settings/appearance", {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "overview"] });
    }
  });
}

export { ApiError };
