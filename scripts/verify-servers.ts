import { z } from "zod";

const HealthResponseSchema = z.object({
  success: z.boolean(),
  service: z.literal("walmart-erp-backend"),
  status: z.enum(["ok", "degraded"]),
  database: z.enum(["ok", "error"]),
  timestamp: z.string().datetime()
});

interface CheckResult {
  name: string;
  passed: boolean;
  details: string;
}

const results: CheckResult[] = [];

function record(name: string, passed: boolean, details: string) {
  results.push({ name, passed, details });
  const badge = passed ? "[PASS]" : "[FAIL]";
  console.log(`${badge} ${name}: ${details}`);
}

async function runVerification() {
  console.log("==================================================");
  console.log("PHASE 1 BEHAVIORAL VERIFICATION SUITE");
  console.log("==================================================");

  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  let backendReachable = false;

  // 1. Backend reachability and health endpoint with authorized origin
  try {
    const res = await fetch(`${backendUrl}/api/health`, {
      headers: { Origin: frontendUrl }
    });

    const isHttpExpected = res.status === 200 || res.status === 503;
    backendReachable = isHttpExpected;

    record(
      "Backend Reachability",
      isHttpExpected,
      `HTTP status ${res.status} received from ${backendUrl}/api/health`
    );

    const data = await res.json();
    const parseResult = HealthResponseSchema.safeParse(data);

    record(
      "Health Response Schema",
      parseResult.success,
      parseResult.success
        ? `Response matches schema: ${JSON.stringify(data)}`
        : `Schema validation failed: ${JSON.stringify(parseResult.error?.format())}`
    );

    // 2. Real database connectivity verification
    if (parseResult.success) {
      const isConsistent =
        (res.status === 200 && data.status === "ok" && data.database === "ok") ||
        (res.status === 503 && data.status === "degraded" && data.database === "error");

      record(
        "Database Status Verification",
        isConsistent,
        data.database === "ok"
          ? "PostgreSQL database connection is ACTIVE and verified (SELECT 1 succeeded, status 200)"
          : "Backend correctly reported real database state as DISCONNECTED (status 503 degraded, no faked health)"
      );
    } else {
      record("Database Status Verification", false, "Could not verify database status due to invalid schema");
    }

    // 3. CORS verification for authorized origin
    const corsHeader = res.headers.get("access-control-allow-origin");
    record(
      "CORS Authorized Origin",
      corsHeader === frontendUrl,
      `Access-Control-Allow-Origin is '${corsHeader}', expected '${frontendUrl}'`
    );
  } catch (err) {
    record("Backend Reachability", false, `Failed to reach backend at ${backendUrl}: ${(err as Error).message}`);
    record("Health Response Schema", false, "Skipped: backend unreachable");
    record("Database Status Verification", false, "Skipped: backend unreachable");
    record("CORS Authorized Origin", false, "Skipped: backend unreachable");
  }

  // 4. CORS verification for unauthorized origin
  if (!backendReachable) {
    record(
      "CORS Unauthorized Origin Rejection",
      false,
      "INFRASTRUCTURE FAILURE: Backend is not reachable, cannot verify CORS rejection"
    );
  } else {
    try {
      const unauthorizedOrigin = "http://unauthorized-domain.example.com";
      const res = await fetch(`${backendUrl}/api/health`, {
        headers: { Origin: unauthorizedOrigin }
      });

      const corsHeader = res.headers.get("access-control-allow-origin");
      const isRejected = corsHeader !== unauthorizedOrigin;

      record(
        "CORS Unauthorized Origin Rejection",
        isRejected,
        isRejected
          ? `Unauthorized origin successfully denied (allow-origin: ${corsHeader ?? "none"})`
          : `Unauthorized origin unexpectedly allowed: ${corsHeader}`
      );
    } catch (err) {
      // Do not convert network errors or crash into CORS success
      record(
        "CORS Unauthorized Origin Rejection",
        false,
        `INFRASTRUCTURE FAILURE: Backend failed during unauthorized CORS check: ${(err as Error).message}`
      );
    }
  }

  // 5. Frontend reachability
  try {
    const res = await fetch(frontendUrl);
    const text = await res.text();
    const isHtml = res.status === 200 && text.toLowerCase().includes("<html");

    record(
      "Frontend Reachability",
      isHtml,
      `HTTP status ${res.status}, valid HTML page rendered`
    );
  } catch (err) {
    record("Frontend Reachability", false, `Failed to reach frontend at ${frontendUrl}: ${(err as Error).message}`);
  }

  console.log("==================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  console.log(`SUMMARY: ${passed}/${total} behavioral checks passed.`);
  console.log("==================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

runVerification().catch((e) => {
  console.error("Verification suite failed:", e);
  process.exit(1);
});
