import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";

describe("Backend Health Endpoint (/api/health)", () => {
  test("GET /api/health returns standardized health check response shape", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "GET",
      url: "/api/health"
    });

    // When DB is available -> 200, when DB is unavailable -> 503
    assert.ok(
      response.statusCode === 200 || response.statusCode === 503,
      `Expected status 200 or 503, got ${response.statusCode}`
    );

    const body = JSON.parse(response.payload);

    assert.equal(body.service, "walmart-erp-backend");
    assert.ok(
      body.status === "ok" || body.status === "degraded",
      `Expected status 'ok' or 'degraded', got ${body.status}`
    );
    assert.ok(
      body.database === "ok" || body.database === "error",
      `Expected database 'ok' or 'error', got ${body.database}`
    );
    assert.ok(typeof body.timestamp === "string", "Expected timestamp to be string");

    if (body.database === "ok") {
      assert.equal(body.success, true);
      assert.equal(body.status, "ok");
    } else {
      assert.equal(body.success, false);
      assert.equal(body.status, "degraded");
    }

    await app.close();
  });

  test("GET /api/nonexistent returns standardized 404 error response", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "GET",
      url: "/api/nonexistent"
    });

    assert.equal(response.statusCode, 404);
    const body = JSON.parse(response.payload);

    assert.equal(body.success, false);
    assert.equal(body.error.statusCode, 404);
    assert.equal(body.error.code, "NOT_FOUND");

    await app.close();
  });
});
