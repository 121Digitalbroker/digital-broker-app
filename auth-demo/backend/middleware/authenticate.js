// ============================================================
// JWT Authentication Middleware
// ============================================================
// SECURITY: This middleware reads the JWT from an HttpOnly cookie,
// verifies the signature, and extracts the userId.
//
// Why this is secure:
// 1. HttpOnly cookies cannot be read by JavaScript (XSS protection)
// 2. JWT signature prevents tampering
// 3. The server NEVER reads X-Viewer-User-Id header
// 4. The userId comes ONLY from the verified token
// ============================================================

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "demo-jwt-secret-key-do-not-use-in-production";

function authenticate(req, res, next) {
  // -----------------------------------------
  // Read JWT from HttpOnly Cookie
  // -----------------------------------------
  // The cookie named "db_liquid_session" is set by the server on login.
  // It is HttpOnly, so JavaScript in the browser cannot read it.
  const token = req.cookies && req.cookies.db_liquid_session;

  if (!token) {
    return res.status(401).json({
      error: "Authentication required. Please login first.",
      solution: "POST /api/auth/login with { username, password }",
    });
  }

  try {
    // -----------------------------------------
    // Verify JWT Signature
    // -----------------------------------------
    // jwt.verify() ensures the token:
    // - Was issued by our server (valid signature)
    // - Has not expired
    // - Has not been tampered with
    const decoded = jwt.verify(token, JWT_SECRET);

    // -----------------------------------------
    // Attach User to Request
    // -----------------------------------------
    // The userId comes ONLY from the verified JWT.
    // We NEVER read req.headers["X-Viewer-User-Id"].
    req.auth = {
      userId: decoded.userId,
      username: decoded.username,
    };

    console.log(`[AUTH] Authenticated user: ${req.auth.userId} (${req.auth.username})`);

    next();
  } catch (err) {
    // Token is invalid, expired, or tampered with
    return res.status(401).json({
      error: "Invalid or expired token. Please login again.",
      detail: err.message,
    });
  }
}

module.exports = { authenticate, JWT_SECRET };
