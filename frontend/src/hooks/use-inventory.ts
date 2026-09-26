"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  InventoryQueryParams,
  InventoryListData,
  InventoryDetailData
} from "@/types/inventory";

export function useInventory(params?: InventoryQueryParams) {
  return useQuery<InventoryListData>({
    queryKey: [
      "inventory",
      "list",
      params?.regionId || "ALL",
      params?.storeId || "ALL",
      params?.categoryId || "ALL",
      params?.status || "ALL",
      params?.tab || "all",
      params?.search || "",
      params?.page || 1,
      params?.pageSize || 25
    ],
    queryFn: async () => {
      const response = await apiClient.getInventory(params);
      const raw = response as any;
      return (raw?.data?.summary ? raw.data : raw?.summary ? raw : raw?.data) as InventoryListData;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    retry: 2
  });
}

export function useInventoryDetail(id: string | null, storeId?: string) {
  return useQuery<InventoryDetailData>({
    queryKey: ["inventory", "detail", id, storeId || "ALL"],
    queryFn: async () => {
      if (!id) throw new Error("Inventory ID is required");
      const response = await apiClient.getInventoryDetail(id, storeId);
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
    retry: 1
  });
}
