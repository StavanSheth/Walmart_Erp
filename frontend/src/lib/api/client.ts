import { env } from "../config/env";
import type { HealthResponse } from "@/types/api";

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
    this.baseUrl = baseUrl || env.NEXT_PUBLIC_API_URL;
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        throw new ApiError(
          `Request failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : "Network error occurred"
      );
    }
  }

  /**
   * Phase 1 Health Endpoint verification
   */
  public async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health");
  }
}

export const apiClient = new ApiClient();
