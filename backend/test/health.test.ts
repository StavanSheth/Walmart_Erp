import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";

describe("Backend Health Endpoint Unit & Behavior Tests", () => {
  // 1. GET /api/health → database healthy
  test("1. GET /api/health returns 200 and healthy response when database is connected", async () => {
    const app = buildApp({
      checkDb: async () => true
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/health"
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.payload);
    assert.equal(body.success, true);
    assert.equal(body.service, "walmart-erp-backend");
    assert.equal(body.status, "ok");
    assert.equal(body.database, "ok");
    assert.ok(typeof body.timestamp === "string");
    assert.ok(!isNaN(Date.parse(body.timestamp)), "Timestamp must be a valid ISO date");

    await app.close();
  });

  // 2. GET /api/health → database unavailable
  test("2. GET /api/health returns 503 and degraded response when database is disconnected", async () => {
    const app = buildApp({
      checkDb: async () => false
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/health"
    });

    assert.equal(response.statusCode, 503);

    const body = JSON.parse(response.payload);
    assert.equal(body.success, false);
    assert.equal(body.service, "walmart-erp-backend");
    assert.equal(body.status, "degraded");
    assert.equal(body.database, "error");
    assert.ok(typeof body.timestamp === "string");
    assert.ok(!isNaN(Date.parse(body.timestamp)), "Timestamp must be a valid ISO date");

    await app.close();
  });

  // 3. 404 response
  test("3. GET /api/nonexistent returns standardized 404 error response", async () => {
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
    assert.equal(body.error.message, "Endpoint not found");

    await app.close();
  });

  // 4. authorized CORS
  test("4. Authorized CORS origin receives Access-Control-Allow-Origin header", async () => {
    const app = buildApp({ checkDb: async () => true });

    const authorizedRes = await app.inject({
      method: "GET",
      url: "/api/health",
      headers: { origin: "http://localhost:3000" }
    });
    assert.equal(authorizedRes.headers["access-control-allow-origin"], "http://localhost:3000");

    await app.close();
  });

  // 5. unauthorized CORS
  test("5. Unauthorized CORS origin does not receive Access-Control-Allow-Origin header", async () => {
    const app = buildApp({ checkDb: async () => true });

    const unauthorizedRes = await app.inject({
      method: "GET",
      url: "/api/health",
      headers: { origin: "http://unauthorized-domain.com" }
    });
    assert.equal(unauthorizedRes.headers["access-control-allow-origin"], undefined);

    await app.close();
  });
});
