// ============================================================
// Auth Security Demo - Server Entry Point
// ============================================================
// This Express server demonstrates two authentication approaches:
//
// 1. INSECURE: Trusting X-Viewer-User-Id header (client-controlled)
// 2. SECURE: JWT verification via HttpOnly cookie
//
// Run with: node server.js
// Server starts on: http://localhost:4000
// ============================================================

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { requestLogger } = require("./middleware/logger");

// Import route modules
const insecureRoutes = require("./routes/insecure");
const secureRoutes = require("./routes/secure");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 4000;

// ============================================================
// Middleware Setup
// ============================================================

// CORS - allow frontend (Vite dev server) to make requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // Allow cookies to be sent
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Request logger - logs every request for educational visualization
app.use(requestLogger);

// ============================================================
// Routes
// ============================================================

// Authentication routes (login, logout, me)
app.use("/api/auth", authRoutes);

// ⚠️ INSECURE routes - DO NOT use this pattern in production
// These routes trust the X-Viewer-User-Id header directly
app.use("/api/insecure", insecureRoutes);

// ✅ SECURE routes - Uses JWT verification via HttpOnly cookie
// These routes ignore any fake headers
app.use("/api/secure", secureRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    message: "Auth Security Demo Server is running",
  });
});

// Demo users endpoint (for UI to show available users)
app.get("/api/users", (req, res) => {
  const { users } = require("./models/data");
  const safeUsers = Object.entries(users).map(([id, user]) => ({
    id: user.id,
    username: user.username,
    name: user.name,
  }));
  res.json({ users: safeUsers });
});

// ============================================================
// Error Handling
// ============================================================

app.use((err, req, res, next) => {
  console.error("[ERROR]", err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// ============================================================
// Start Server
// ============================================================

app.listen(PORT, () => {
  console.log("\n" + "=".repeat(70));
  console.log("  Auth Security Demo Server");
  console.log("=".repeat(70));
  console.log(`  Server running on: http://localhost:${PORT}`);
  console.log(`  Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  console.log("\n  Endpoints:");
  console.log(`  ❌ INSECURE: GET  http://localhost:${PORT}/api/insecure/listings`);
  console.log(`     → Trusts X-Viewer-User-Id header`);
  console.log(`  ✅ SECURE:   GET  http://localhost:${PORT}/api/secure/listings`);
  console.log(`     → Requires JWT in HttpOnly cookie`);
  console.log(`  🔐 AUTH:     POST http://localhost:${PORT}/api/auth/login`);
  console.log(`     → Returns JWT in HttpOnly cookie`);
  console.log(`  🔐 AUTH:     POST http://localhost:${PORT}/api/auth/logout`);
  console.log(`  🔐 AUTH:     GET  http://localhost:${PORT}/api/auth/me`);
  console.log(`  ℹ️  USERS:    GET  http://localhost:${PORT}/api/users`);
  console.log(`  ℹ️  HEALTH:   GET  http://localhost:${PORT}/api/health`);
  console.log("\n  Demo Credentials:");
  console.log("     alice / password123");
  console.log("     bob   / password456");
  console.log("     admin / admin123");
  console.log("=".repeat(70) + "\n");
});
