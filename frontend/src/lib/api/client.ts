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
  private customBaseUrl?: string;

  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.customBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    }
  }

  public getBaseUrl(): string {
    if (this.customBaseUrl) return this.customBaseUrl;
    if (typeof window !== "undefined") {
      return "/api";
    }
    return process.env.INTERNAL_API_URL || "http://127.0.0.1:4000/api";
  }

  public get baseUrl(): string {
    return this.getBaseUrl();
  }


  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const base = this.getBaseUrl();
    let formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    if (base.endsWith("/api") && formattedEndpoint.startsWith("/api/")) {
      formattedEndpoint = formattedEndpoint.slice(4);
    }
    const url = `${base}${formattedEndpoint}`;

    const headers: HeadersInit = {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    };

    let response: Response;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      response = await fetch(url, {
        ...options,
        signal: options.signal || controller.signal,
        headers
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      const rawMessage = error instanceof Error ? error.message : "Network error occurred";
      const message =
        rawMessage === "Failed to fetch"
          ? `Unable to connect to backend server at ${base}. Please check connection.`
          : rawMessage;
      throw new ApiError(message);
    } finally {
      clearTimeout(timeoutId);
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

  public async get<T>(
    endpoint: string,
    options?: { params?: Record<string, string | number | undefined> }
  ): Promise<{ success: boolean; data: T }> {
    let url = endpoint;
    if (options?.params) {
      const sp = new URLSearchParams();
      Object.entries(options.params).forEach(([k, v]) => {
        if (v !== undefined) sp.set(k, String(v));
      });
      const qs = sp.toString();
      if (qs) {
        url += url.includes("?") ? `&${qs}` : `?${qs}`;
      }
    }
    return this.request<{ success: boolean; data: T }>(url, { method: "GET" });
  }

  public async post<T>(
    endpoint: string,
    body?: unknown
  ): Promise<{ success: boolean; data: T }> {
    return this.request<{ success: boolean; data: T }>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined
    });
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
    if (params?.storeId && params.storeId !== "ALL" && params.storeId !== "all") {
      searchParams.set("storeId", params.storeId);
    }
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
  public async getInventoryDetail(id: string, storeId?: string): Promise<InventoryDetailResponse> {
    const qs = storeId ? `?storeId=${encodeURIComponent(storeId)}` : "";
    return this.request<InventoryDetailResponse>(`/inventory/${encodeURIComponent(id)}${qs}`);
  }

  /**
   * Phase 7 Partners Overview Dashboard API
   */
  public async getPartnersOverview(
    params?: import("@/types/partners").PartnersQueryParams
  ): Promise<{ success: boolean; data: import("@/types/partners").PartnersOverviewData }> {
    const searchParams = new URLSearchParams();
    if (params?.tab && params.tab !== "overview") {
      searchParams.set("tab", params.tab);
    }
    if (params?.search && params.search.trim().length > 0) {
      searchParams.set("search", params.search.trim());
    }
    if (params?.type && params.type !== "ALL" && params.type !== "All Types") {
      searchParams.set("type", params.type);
    }
    if (params?.regionId && params.regionId !== "ALL" && params.regionId !== "all") {
      searchParams.set("regionId", params.regionId);
    }
    if (params?.status && params.status !== "ALL") {
      searchParams.set("status", params.status);
    }
    if (params?.page) {
      searchParams.set("page", String(params.page));
    }
    if (params?.pageSize) {
      searchParams.set("pageSize", String(params.pageSize));
    }
    if (params?.period) {
      searchParams.set("period", params.period);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/partners/overview?${queryString}` : "/partners/overview";
    return this.request<{ success: boolean; data: import("@/types/partners").PartnersOverviewData }>(endpoint);
  }

  /**
   * Phase 7 Partner / Customer Detail
   */
  public async getPartnerDetail(
    id: string
  ): Promise<{ success: boolean; data: import("@/types/partners").PartnerDetailData }> {
    return this.request<{ success: boolean; data: import("@/types/partners").PartnerDetailData }>(
      `/partners/${encodeURIComponent(id)}`
    );
  }

  /**
   * Phase 7 Create Partner Persistence
   */
  public async createPartner(
    payload: import("@/types/partners").CreatePartnerInput
  ): Promise<{ success: boolean; data: unknown }> {
    return this.request<{ success: boolean; data: unknown }>("/partners", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  /**
   * Phase 7 CSV Export (full filtered dataset)
   */
  public async exportPartnersCsv(
    params?: import("@/types/partners").PartnersQueryParams
  ): Promise<string> {
    const searchParams = new URLSearchParams();
    if (params?.tab && params.tab !== "overview") {
      searchParams.set("tab", params.tab);
    }
    if (params?.search && params.search.trim().length > 0) {
      searchParams.set("search", params.search.trim());
    }
    if (params?.type && params.type !== "ALL" && params.type !== "All Types") {
      searchParams.set("type", params.type);
    }
    if (params?.regionId && params.regionId !== "ALL" && params.regionId !== "all") {
      searchParams.set("regionId", params.regionId);
    }
    if (params?.status && params.status !== "ALL") {
      searchParams.set("status", params.status);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/partners/export?${queryString}` : "/partners/export";

    const base = this.getBaseUrl();
    let formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    if (base.endsWith("/api") && formattedEndpoint.startsWith("/api/")) {
      formattedEndpoint = formattedEndpoint.slice(4);
    }
    const url = `${base}${formattedEndpoint}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new ApiError(`Export failed with status ${response.status}`, response.status);
    }
    return response.text();
  }

  /**
   * Phase 8 Stores Overview API
   */
  public async getStoresOverview(
    params?: import("@/types/stores").StoresQueryParams
  ): Promise<{ success: boolean; data: import("@/types/stores").StoresOverviewData }> {
    const searchParams = new URLSearchParams();
    if (params?.search && params.search.trim().length > 0) {
      searchParams.set("search", params.search.trim());
    }
    if (params?.regionId && params.regionId !== "ALL" && params.regionId !== "all") {
      searchParams.set("regionId", params.regionId);
    }
    if (params?.status && params.status !== "ALL") {
      searchParams.set("status", params.status);
    }
    if (params?.period) {
      searchParams.set("period", params.period);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/stores/overview?${queryString}` : "/stores/overview";
    return this.request<{ success: boolean; data: import("@/types/stores").StoresOverviewData }>(endpoint);
  }

  /**
   * Phase 8 Stores Network Points API for Interactive Map
   */
  public async getStoresNetwork(
    params?: import("@/types/stores").StoresQueryParams
  ): Promise<{ success: boolean; data: { stores: import("@/types/stores").StoreNetworkPoint[] } }> {
    const searchParams = new URLSearchParams();
    if (params?.search && params.search.trim().length > 0) {
      searchParams.set("search", params.search.trim());
    }
    if (params?.regionId && params.regionId !== "ALL" && params.regionId !== "all") {
      searchParams.set("regionId", params.regionId);
    }
    if (params?.status && params.status !== "ALL") {
      searchParams.set("status", params.status);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/stores/network?${queryString}` : "/stores/network";
    return this.request<{ success: boolean; data: { stores: import("@/types/stores").StoreNetworkPoint[] } }>(endpoint);
  }

  /**
   * Phase 8 Stores List API with pagination
   */
  public async getStores(
    params?: import("@/types/stores").StoresQueryParams
  ): Promise<{
    success: boolean;
    data: import("@/types/stores").StoreSummary[];
    meta: { total: number; page: number; pageSize: number; totalPages: number };
  }> {
    const searchParams = new URLSearchParams();
    if (params?.search && params.search.trim().length > 0) {
      searchParams.set("search", params.search.trim());
    }
    if (params?.regionId && params.regionId !== "ALL" && params.regionId !== "all") {
      searchParams.set("regionId", params.regionId);
    }
    if (params?.status && params.status !== "ALL") {
      searchParams.set("status", params.status);
    }
    if (params?.page) {
      searchParams.set("page", String(params.page));
    }
    if (params?.pageSize) {
      searchParams.set("pageSize", String(params.pageSize));
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/stores?${queryString}` : "/stores";
    return this.request<{
      success: boolean;
      data: import("@/types/stores").StoreSummary[];
      meta: { total: number; page: number; pageSize: number; totalPages: number };
    }>(endpoint);
  }

  /**
   * Phase 8 Store Detail API
   */
  public async getStoreDetail(
    id: string
  ): Promise<{ success: boolean; data: import("@/types/stores").StoreDetailData }> {
    return this.request<{ success: boolean; data: import("@/types/stores").StoreDetailData }>(
      `/stores/${encodeURIComponent(id)}`
    );
  }
}

export const apiClient = new ApiClient();
