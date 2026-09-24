async function verify() {
  console.log("=== SERVER VERIFICATION REPORT ===");

  // 1. Backend check
  try {
    const backendRes = await fetch("http://localhost:4000/api/health", {
      headers: { Origin: "http://localhost:3000" }
    });
    console.log("1. Backend on Port 4000:");
    console.log("   - HTTP Status:", backendRes.status);
    console.log("   - CORS Origin Header:", backendRes.headers.get("access-control-allow-origin"));
    const backendData = await backendRes.json();
    console.log("   - Response Body:", JSON.stringify(backendData));
    const isCorrectBackend =
      backendData.service === "walmart-erp-backend" && backendData.status === "ok";
    console.log("   - Verified Walmart ERP Backend:", isCorrectBackend ? "PASS" : "FAIL");
  } catch (err) {
    console.error("Backend verification failed:", err);
  }

  // 2. Frontend check
  try {
    const frontendRes = await fetch("http://localhost:3000");
    console.log("\n2. Frontend on Port 3000:");
    console.log("   - HTTP Status:", frontendRes.status);
    const html = await frontendRes.text();
    const hasWalmartERP = html.includes("Walmart ERP");
    const hasPhase1 = html.includes("Phase 1 Foundation");
    console.log("   - Found 'Walmart ERP' branding in DOM:", hasWalmartERP ? "PASS" : "FAIL");
    console.log("   - Found 'Phase 1 Foundation' in DOM:", hasPhase1 ? "PASS" : "FAIL");
    console.log(
      "   - Verified Walmart ERP Frontend:",
      hasWalmartERP && hasPhase1 ? "PASS" : "FAIL"
    );
  } catch (err) {
    console.error("Frontend verification failed:", err);
  }
}

verify();
