import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ApiClient, ApiError } from "../src/lib/api/client";

describe("Frontend API Client", () => {
  test("ApiClient initializes with configured base URL", () => {
    const client = new ApiClient("http://custom-url:4000/api");
    assert.ok(client instanceof ApiClient);
  });

  test("ApiError stores status code and error details", () => {
    const err = new ApiError("Failed request", 503, { code: "SERVICE_UNAVAILABLE" });
    assert.equal(err.message, "Failed request");
    assert.equal(err.statusCode, 503);
    assert.deepEqual(err.data, { code: "SERVICE_UNAVAILABLE" });
    assert.equal(err.name, "ApiError");
  });
});
