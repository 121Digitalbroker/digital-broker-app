// ============================================================
// Authentication Routes
// ============================================================

const express = require("express");
const router = express.Router();
const { login, logout, me } = require("../controllers/authController");
const { authenticate } = require("../middleware/authenticate");

// POST /api/auth/login
// Verify credentials and set JWT HttpOnly cookie
router.post("/login", login);

// POST /api/auth/logout
// Clear the JWT cookie
router.post("/logout", logout);

// GET /api/auth/me
// Return current authenticated user info (requires auth)
router.get("/me", authenticate, me);

module.exports = router;
