// ============================================================
// Request Logger Middleware
// ============================================================
// Logs every incoming request with headers, cookies, and decision info.
// This helps visualize what the server is trusting.
// ============================================================

function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;

  console.log("\n" + "=".repeat(70));
  console.log(`[${timestamp}] Incoming Request: ${method} ${url}`);
  console.log("-".repeat(70));

  // Log headers (redact sensitive ones in production)
  console.log("Headers:");
  const relevantHeaders = {
    "X-Viewer-User-Id": req.headers["x-viewer-user-id"] || "(not sent)",
    "Content-Type": req.headers["content-type"] || "(not sent)",
    Cookie: req.headers["cookie"]
      ? "(present - " +
        req.headers["cookie"]
          .split(";")
          .map((c) => c.trim().split("=")[0])
          .join(", ") +
        ")"
      : "(none)",
  };

  for (const [key, value] of Object.entries(relevantHeaders)) {
    console.log(`  ${key}: ${value}`);
  }

  // Log cookie if present
  if (req.cookies && req.cookies.db_liquid_session) {
    console.log("  [COOKIE] db_liquid_session: (present - HttpOnly JWT)");
  }

  // Log authenticated user if set by middleware
  if (req.auth) {
    console.log(`Authenticated User: ${req.auth.userId} (${req.auth.username})`);
  } else {
    console.log("Authenticated User: (not authenticated)");
  }

  console.log(`Requested Resource: ${method} ${url}`);

  // Capture the response to log the decision
  const originalSend = res.send;
  res.send = function (body) {
    const decision = res.statusCode >= 200 && res.statusCode < 300 ? "ALLOWED" : "DENIED";
    console.log(`Decision: ${decision} (Status: ${res.statusCode})`);
    console.log("=".repeat(70) + "\n");
    originalSend.call(this, body);
  };

  next();
}

module.exports = { requestLogger };
