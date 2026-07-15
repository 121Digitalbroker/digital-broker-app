// ============================================================
// SECURE Routes
// ============================================================
// These routes use JWT authentication middleware.
// The user identity is verified through HttpOnly cookie JWT.
// Any fake headers sent by the client are ignored.
// ============================================================

const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authenticate");
const { getListings } = require("../controllers/secureController");

// All routes in this file require authentication
router.use(authenticate);

// GET /api/secure/listings
// Uses req.auth.userId (set by authenticate middleware from JWT).
// ✅ This is SECURE - the userId comes from the verified token.
router.get("/listings", getListings);

module.exports = router;
