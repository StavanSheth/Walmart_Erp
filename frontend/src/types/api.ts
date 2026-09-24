export interface HealthResponse {
  success: boolean;
  service: string;
  status: "ok" | "degraded";
  database: "ok" | "error";
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
    code?: string;
  };
}
