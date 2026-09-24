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
    const rawUrl = baseUrl || env.NEXT_PUBLIC_API_URL;
    this.baseUrl = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${formattedEndpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
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
      throw new ApiError(
        error instanceof Error ? error.message : "Network error occurred"
      );
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
}

export const apiClient = new ApiClient();
