// ============================================================
// INSECURE Routes
// ============================================================
// WARNING: These routes demonstrate security vulnerabilities.
// They trust client-provided headers without verification.
//
// DO NOT use patterns from this file in production code.
// ============================================================

const express = require("express");
const router = express.Router();
const { getListings } = require("../controllers/insecureController");

// GET /api/insecure/listings
// Uses X-Viewer-User-Id header to identify the user.
// ⚠️ This is INSECURE - the header is directly trusted.
router.get("/listings", getListings);

module.exports = router;
