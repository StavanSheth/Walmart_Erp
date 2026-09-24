import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ApiClient, ApiError } from "../src/lib/api/client";

describe("Frontend API Client & Error Unit Tests", () => {
  test("ApiClient initializes with configured base URL and strips trailing slash", () => {
    const client = new ApiClient("http://custom-url:4000/api/");
    assert.ok(client instanceof ApiClient);
    assert.equal((client as unknown as { baseUrl: string }).baseUrl, "http://custom-url:4000/api");
  });

  test("ApiClient initializes with default base URL when none provided", () => {
    const client = new ApiClient();
    assert.ok(client instanceof ApiClient);
    assert.ok((client as unknown as { baseUrl: string }).baseUrl.startsWith("http"));
  });

  test("ApiError stores status code, message, name, and error details", () => {
    const err = new ApiError("Service Unavailable", 503, { code: "DATABASE_UNAVAILABLE" });
    assert.equal(err.message, "Service Unavailable");
    assert.equal(err.statusCode, 503);
    assert.deepEqual(err.data, { code: "DATABASE_UNAVAILABLE" });
    assert.equal(err.name, "ApiError");
    assert.ok(err instanceof Error);
    assert.ok(err instanceof ApiError);
  });

  test("ApiError handles missing status code and data gracefully", () => {
    const err = new ApiError("Network error occurred");
    assert.equal(err.message, "Network error occurred");
    assert.equal(err.statusCode, undefined);
    assert.equal(err.data, undefined);
    assert.equal(err.name, "ApiError");
  });
});
