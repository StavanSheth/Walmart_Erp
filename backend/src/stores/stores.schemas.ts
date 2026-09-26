import { z } from "zod";

export const StoreStatusFilterEnum = z.enum(["ALL", "ACTIVE", "MAINTENANCE", "INACTIVE"]);
export type StoreStatusFilter = z.infer<typeof StoreStatusFilterEnum>;

export const StorePeriodEnum = z.enum(["7d", "30d", "90d", "ytd"]);
export type StorePeriod = z.infer<typeof StorePeriodEnum>;

export const StoresQueryParamsSchema = z.object({
  search: z.string().optional(),
  regionId: z.string().optional(),
  status: StoreStatusFilterEnum.optional().default("ALL"),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20)
});
export type StoresQueryParams = z.infer<typeof StoresQueryParamsSchema>;

export const StoresOverviewQueryParamsSchema = z.object({
  search: z.string().optional(),
  regionId: z.string().optional(),
  status: StoreStatusFilterEnum.optional().default("ALL"),
  period: StorePeriodEnum.optional().default("30d")
});
export type StoresOverviewQueryParams = z.infer<typeof StoresOverviewQueryParamsSchema>;

export const StoresNetworkQueryParamsSchema = z.object({
  search: z.string().optional(),
  regionId: z.string().optional(),
  status: StoreStatusFilterEnum.optional().default("ALL")
});
export type StoresNetworkQueryParams = z.infer<typeof StoresNetworkQueryParamsSchema>;

export const StoreDetailParamsSchema = z.object({
  id: z.string().min(1, "Store ID is required")
});
export type StoreDetailParams = z.infer<typeof StoreDetailParamsSchema>;
