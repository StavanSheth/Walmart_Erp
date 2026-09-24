import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ApiClient, ApiError } from "../src/lib/api/client";

describe("Frontend API Client & Error Unit Tests", () => {
  // 1. URL normalization
  test("1. URL normalization: strips trailing slash from base URL and handles slash prefix in endpoints", () => {
    const client = new ApiClient("http://custom-url:4000/api/");
    assert.ok(client instanceof ApiClient);
    assert.equal((client as unknown as { baseUrl: string }).baseUrl, "http://custom-url:4000/api");

    const defaultClient = new ApiClient();
    assert.ok(defaultClient instanceof ApiClient);
    assert.ok((defaultClient as unknown as { baseUrl: string }).baseUrl.startsWith("http"));
  });

  // 2. Successful request
  test("2. Successful request: parses and returns typed JSON payload", async () => {
    const originalFetch = globalThis.fetch;
    try {
      globalThis.fetch = async (input: RequestInfo | URL, _init?: RequestInit) => {
        assert.ok(String(input).endsWith("/api/health"));
        return new Response(
          JSON.stringify({
            success: true,
            service: "walmart-erp-backend",
            status: "ok",
            database: "ok",
            timestamp: "2026-09-24T08:00:00.000Z"
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      };

      const client = new ApiClient("http://localhost:4000/api");
      const result = await client.getHealth();
      assert.equal(result.success, true);
      assert.equal(result.service, "walmart-erp-backend");
      assert.equal(result.database, "ok");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  // 3. HTTP error
  test("3. HTTP error: throws ApiError with response status and parsed error data", async () => {
    const originalFetch = globalThis.fetch;
    try {
      globalThis.fetch = async () =>
        new Response(
          JSON.stringify({
            success: false,
            error: { message: "Resource unavailable", statusCode: 503, code: "SERVICE_UNAVAILABLE" }
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" }
          }
        );

      const client = new ApiClient("http://localhost:4000/api");
      await assert.rejects(
        async () => client.request("/health"),
        (err: unknown) => {
          assert.ok(err instanceof ApiError);
          assert.equal(err.statusCode, 503);
          assert.ok(err.data && typeof err.data === "object");
          assert.equal((err.data as { success: boolean }).success, false);
          return true;
        }
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  // 4. Network error
  test("4. Network error: cleanly catches connection failure and wraps in ApiError", async () => {
    const originalFetch = globalThis.fetch;
    try {
      globalThis.fetch = async () => {
        throw new Error("fetch failed: ECONNREFUSED");
      };

      const client = new ApiClient("http://localhost:4000/api");
      await assert.rejects(
        async () => client.request("/health"),
        (err: unknown) => {
          assert.ok(err instanceof ApiError);
          assert.equal(err.message, "fetch failed: ECONNREFUSED");
          assert.equal(err.statusCode, undefined);
          return true;
        }
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  // 5. ApiError behavior
  test("5. ApiError behavior: preserves message, name, statusCode, and data structure", () => {
    const errWithData = new ApiError("Failed operation", 400, { field: "email", error: "invalid" });
    assert.equal(errWithData.message, "Failed operation");
    assert.equal(errWithData.name, "ApiError");
    assert.equal(errWithData.statusCode, 400);
    assert.deepEqual(errWithData.data, { field: "email", error: "invalid" });
    assert.ok(errWithData instanceof Error);
    assert.ok(errWithData instanceof ApiError);

    const simpleErr = new ApiError("Simple error message");
    assert.equal(simpleErr.message, "Simple error message");
    assert.equal(simpleErr.statusCode, undefined);
    assert.equal(simpleErr.data, undefined);
  });

  // 6. Non-JSON response handling
  test("6. Non-JSON response: converts JSON parse failure to ApiError without crashing", async () => {
    const originalFetch = globalThis.fetch;
    try {
      globalThis.fetch = async () =>
        new Response("Not valid json", {
          status: 200,
          headers: { "Content-Type": "text/plain" }
        });

      const client = new ApiClient("http://localhost:4000/api");
      await assert.rejects(
        async () => client.request("/invalid-json"),
        (err: unknown) => {
          assert.ok(err instanceof ApiError);
          assert.equal(err.message, "Failed to parse response JSON");
          assert.equal(err.statusCode, 200);
          return true;
        }
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
