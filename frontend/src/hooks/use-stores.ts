"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  StoresQueryParams,
  StoresOverviewData,
  StoreDetailData,
  StoreNetworkPoint,
  StoreSummary
} from "@/types/stores";

export function useStoresOverview(params?: StoresQueryParams) {
  return useQuery<StoresOverviewData>({
    queryKey: [
      "stores",
      "overview",
      params?.search || "",
      params?.regionId || "ALL",
      params?.status || "ALL",
      params?.period || "30d"
    ],
    queryFn: async () => {
      const response = await apiClient.getStoresOverview(params);
      const raw = response as any;
      return (raw?.data?.summary ? raw.data : raw?.summary ? raw : raw?.data) as StoresOverviewData;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    retry: 2
  });
}

export function useStoresNetwork(params?: StoresQueryParams) {
  return useQuery<StoreNetworkPoint[]>({
    queryKey: [
      "stores",
      "network",
      params?.search || "",
      params?.regionId || "ALL",
      params?.status || "ALL"
    ],
    queryFn: async () => {
      const response = await apiClient.getStoresNetwork(params);
      const raw = response as any;
      const list = raw?.data?.stores || raw?.stores || (Array.isArray(raw?.data) ? raw.data : []);
      return Array.isArray(list) ? list : [];
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    retry: 2
  });
}

export function useStoresList(params?: StoresQueryParams) {
  return useQuery<{ stores: StoreSummary[]; total: number; page: number; pageSize: number; totalPages: number }>({
    queryKey: [
      "stores",
      "list",
      params?.search || "",
      params?.regionId || "ALL",
      params?.status || "ALL",
      params?.page || 1,
      params?.pageSize || 20
    ],
    queryFn: async () => {
      const response = await apiClient.getStores(params);
      const raw = response as any;
      const stores = Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.data?.data)
        ? raw.data.data
        : Array.isArray(raw?.stores)
        ? raw.stores
        : [];
      const meta = raw?.meta || raw?.data?.meta || {
        total: stores.length,
        page: Number(params?.page || 1),
        pageSize: Number(params?.pageSize || 20),
        totalPages: 1
      };
      return {
        stores,
        ...meta
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    retry: 2
  });
}

export function useStoreDetail(id: string | null) {
  return useQuery<StoreDetailData>({
    queryKey: ["stores", "detail", id],
    queryFn: async () => {
      if (!id) throw new Error("Store ID is required");
      const response = await apiClient.getStoreDetail(id);
      const raw = response as any;
      return (raw?.data?.store ? raw.data : raw?.store ? raw : raw?.data) as StoreDetailData;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
    retry: 1
  });
}

