import { env } from "../config/env";
import type { HealthResponse } from "@/types/api";
import type { DashboardOverviewResponse, DashboardQueryParams } from "@/types/dashboard";
import type {
  InventoryListResponse,
  InventoryQueryParams,
  InventoryDetailResponse
} from "@/types/inventory";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    const rawUrl = baseUrl || env.NEXT_PUBLIC_API_URL;
    this.baseUrl = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${formattedEndpoint}`;

    const headers: HeadersInit = {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    };

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      const rawMessage = error instanceof Error ? error.message : "Network error occurred";
      const message =
        rawMessage === "Failed to fetch"
          ? `Unable to connect to backend server at ${this.baseUrl}. Please check connection.`
          : rawMessage;
      throw new ApiError(message);
    }

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        try {
          errorData = await response.text();
        } catch {
          errorData = null;
        }
      }
      throw new ApiError(
        `Request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new ApiError("Failed to parse response JSON", response.status);
    }
  }

  /**
   * Phase 1 Health Endpoint verification
   */
  public async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health");
  }

  /**
   * Phase 5 Dashboard Overview data
   */
  public async getDashboardOverview(
    params?: DashboardQueryParams
  ): Promise<DashboardOverviewResponse> {
    const searchParams = new URLSearchParams();
    if (params?.storeId) searchParams.set("storeId", params.storeId);
    if (params?.period) searchParams.set("period", params.period);
    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/dashboard/overview?${queryString}`
      : "/dashboard/overview";
    return this.request<DashboardOverviewResponse>(endpoint);
  }

  /**
   * Phase 6 Inventory List with search, filters, pagination, and summary
   */
  public async getInventory(
    params?: InventoryQueryParams
  ): Promise<InventoryListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.regionId && params.regionId !== "ALL" && params.regionId !== "all") {
      searchParams.set("regionId", params.regionId);
    }
    if (params?.storeId && params.storeId !== "ALL" && params.storeId !== "all") {
      searchParams.set("storeId", params.storeId);
    }
    if (params?.categoryId && params.categoryId !== "ALL" && params.categoryId !== "all") {
      searchParams.set("categoryId", params.categoryId);
    }
    if (params?.tab && params.tab !== "all") {
      searchParams.set("tab", params.tab);
    }
    if (params?.status && params.status !== "ALL") {
      searchParams.set("status", params.status);
    }
    if (params?.search && params.search.trim().length > 0) {
      searchParams.set("search", params.search.trim());
    }
    if (params?.page) {
      searchParams.set("page", String(params.page));
    }
    if (params?.pageSize) {
      searchParams.set("pageSize", String(params.pageSize));
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/inventory?${queryString}` : "/inventory";
    return this.request<InventoryListResponse>(endpoint);
  }

  /**
   * Phase 6 Inventory Detail with recent movements
   */
  public async getInventoryDetail(id: string): Promise<InventoryDetailResponse> {
    return this.request<InventoryDetailResponse>(`/inventory/${encodeURIComponent(id)}`);
  }
}

export const apiClient = new ApiClient();
