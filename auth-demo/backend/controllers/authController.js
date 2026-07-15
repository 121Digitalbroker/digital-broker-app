// ============================================================
// Authentication Controller
// ============================================================
// Handles login by verifying credentials and issuing a JWT.
// The JWT is stored in an HttpOnly cookie for security.
// ============================================================

const jwt = require("jsonwebtoken");
const { users } = require("../models/data");
const { JWT_SECRET } = require("../middleware/authenticate");

function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required",
      demoCredentials: {
        alice: "password123",
        bob: "password456",
        admin: "admin123",
      },
    });
  }

  // Find user by username
  const userEntry = Object.values(users).find((u) => u.username === username);

  if (!userEntry) {
    return res.status(401).json({
      error: "Invalid username or password",
    });
  }

  // In production, use bcrypt.compare() for password verification
  if (userEntry.password !== password) {
    return res.status(401).json({
      error: "Invalid username or password",
    });
  }

  // ============================================================
  // Generate JWT Token
  // ============================================================
  // The token contains:
  // - userId: unique user identifier
  // - username: for display purposes
  // - iat: issued at timestamp
  //
  // The token is SIGNED with JWT_SECRET, so it cannot be tampered with.
  const token = jwt.sign(
    {
      userId: userEntry.id,
      username: userEntry.username,
    },
    JWT_SECRET,
    {
      expiresIn: "1h", // Token expires in 1 hour
    }
  );

  // ============================================================
  // Store JWT in HttpOnly Cookie
  // ============================================================
  // HttpOnly: JavaScript cannot read this cookie (prevents XSS attacks)
  // SameSite: Lax prevents CSRF for state-changing requests
  // Secure: only sent over HTTPS (disabled in development)
  // MaxAge: 1 hour (matches token expiration)
  res.cookie("db_liquid_session", token, {
    httpOnly: true, // ❗ JavaScript cannot read this cookie
    sameSite: "lax", // CSRF protection
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    maxAge: 60 * 60 * 1000, // 1 hour
    path: "/",
  });

  console.log(`[AUTH] Login successful: ${userEntry.id} (${userEntry.username})`);
  console.log(`[AUTH] JWT stored in HttpOnly cookie: db_liquid_session`);

  res.json({
    message: "Login successful",
    user: {
      id: userEntry.id,
      username: userEntry.username,
      name: userEntry.name,
    },
    // NOTE: The token is in the cookie, NOT returned in the response body.
    // This prevents XSS from stealing the token.
    tokenInfo: {
      type: "HttpOnly Cookie",
      name: "db_liquid_session",
      httpOnly: true,
      sameSite: "lax",
    },
  });
}

function logout(req, res) {
  // Clear the cookie by setting it with an expired date
  res.clearCookie("db_liquid_session", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  console.log(`[AUTH] Logout successful`);

  res.json({
    message: "Logged out successfully",
  });
}

function me(req, res) {
  // Return the currently authenticated user's info
  // This route is protected by authenticate() middleware
  const userId = req.auth.userId;
  const user = users[userId];

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      phone: user.phone,
      email: user.email,
    },
    authMethod: "JWT (HttpOnly Cookie)",
    authSource: "req.auth.userId (set by authenticate middleware)",
  });
}

module.exports = { login, logout, me };
