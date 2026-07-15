// ============================================================
// INSECURE Controller
// ============================================================
// WARNING: This demonstrates a critical security vulnerability!
//
// The server directly trusts the X-Viewer-User-Id header sent
// by the client. Any user can claim to be any other user
// simply by changing this header.
//
// Attack scenario:
// 1. User A sends X-Viewer-User-Id: user1 → sees user1's data
// 2. User A changes to X-Viewer-User-Id: user2 → sees user2's data
// 3. User A changes to X-Viewer-User-Id: admin → sees admin data
//
// This is exactly what happens when you rely on client-side
// authentication without server-side verification.
// ============================================================

const { listings, users } = require("../models/data");

function getListings(req, res) {
  // ============================================================
  // VULNERABILITY: Trusting client-provided header
  // ============================================================
  // The client can set X-Viewer-User-Id to ANY value.
  // There is NO verification that this value is legitimate.
  const userId = req.headers["x-viewer-user-id"] || "anonymous";

  // Check if user exists
  const user = users[userId];

  console.log(`[INSECURE] X-Viewer-User-Id header value: "${userId}"`);
  console.log(`[INSECURE] Found user: ${user ? user.name : "UNKNOWN USER"}`);
  console.log(`[INSECURE] THE SERVER TRUSTS THIS HEADER WITHOUT VERIFICATION!`);

  // Filter listings for this user
  const userListings = listings.filter((l) => l.sellerId === userId);

  // Add user info to response
  const result = {
    // ⚠️ SECURITY ISSUE: We return the claimed userId without verification
    claimedUserId: userId,
    authenticated: false,
    user: user
      ? {
          name: user.name,
          phone: user.phone,
          email: user.email,
        }
      : null,
    listings: userListings.length > 0 ? userListings : [],
    // Include private notes in the response (another security issue)
    totalListings: userListings.length,
    // ⚠️ VULNERABILITY NOTE: The server has no way to know if this userId
    // is legitimate because it never verified the user's identity.
    securityWarning:
      "INSECURE: Server trusts X-Viewer-User-Id header without verification. Any user can impersonate anyone.",
  };

  res.json(result);
}

module.exports = { getListings };
