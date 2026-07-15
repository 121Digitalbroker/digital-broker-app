// ============================================================
// SECURE Controller
// ============================================================
// This controller uses req.auth.userId which is set by the
// authenticate() middleware after verifying the JWT.
//
// Security guarantees:
// 1. The userId comes from a VERIFIED JWT, not from headers
// 2. Any X-Viewer-User-Id header sent by the client is IGNORED
// 3. The JWT was stored in an HttpOnly cookie (XSS protection)
// 4. The JWT signature prevents tampering
//
// Attack scenario (prevented):
// 1. User A has userId=user1 in their JWT
// 2. User A sends X-Viewer-User-Id: admin ← IGNORED
// 3. Server reads req.auth.userId = user1 ← from JWT
// 4. User A only sees user1's data
// ============================================================

const { listings, users } = require("../models/data");

function getListings(req, res) {
  // ============================================================
  // SECURE: Read userId from verified JWT only
  // ============================================================
  // req.auth is set by authenticate() middleware after JWT verification.
  // We NEVER read req.headers["X-Viewer-User-Id"].
  const userId = req.auth.userId;

  // Check if the fake header was sent (for demo logging purposes)
  const fakeHeader = req.headers["x-viewer-user-id"];
  if (fakeHeader) {
    console.log(`[SECURE] Client sent fake X-Viewer-User-Id: "${fakeHeader}"`);
    console.log(`[SECURE] IGNORED fake header. Using verified userId: "${userId}"`);
  }

  // Verify user exists in our database
  const user = users[userId];

  if (!user) {
    return res.status(404).json({
      error: "User not found",
      // This shouldn't happen since JWT was issued for a valid user,
      // but we handle it gracefully.
    });
  }

  // Filter listings for this user
  const userListings = listings.filter((l) => l.sellerId === userId);

  const result = {
    authenticatedUserId: userId,
    username: user.username,
    authenticated: true,
    user: {
      name: user.name,
      phone: user.phone,
      email: user.email,
    },
    listings: userListings.length > 0 ? userListings : [],
    totalListings: userListings.length,
    // Show what happened with fake headers
    fakeHeaderDetected: fakeHeader || null,
    fakeHeaderIgnored: !!fakeHeader,
    securityNote:
      "SECURE: userId comes from verified JWT. Fake headers are ignored.",
  };

  res.json(result);
}

module.exports = { getListings };
