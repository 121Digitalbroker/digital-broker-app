import { useState } from "react";
import api from "../api/axios";

const DEMO_USERS = [
  { username: "alice", password: "password123", name: "Alice Johnson" },
  { username: "bob", password: "password456", name: "Bob Smith" },
  { username: "admin", password: "admin123", name: "Admin User" },
];

export default function SecureDemo({ authUser, setAuthUser }) {
  const [username, setUsername] = useState("alice");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [fakeHeader, setFakeHeader] = useState("");
  const [devMode, setDevMode] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/api/auth/login", { username, password });
      setAuthUser(res.data.user);
      setResponse(null);
    } catch (err) {
      setError(err.response?.data || { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (e) {
      // ignore
    }
    setAuthUser(null);
    setResponse(null);
    setError(null);
  };

  const fetchSecureListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = {};
      if (devMode && fakeHeader) {
        headers["X-Viewer-User-Id"] = fakeHeader;
      }
      const res = await api.get("/api/secure/listings", { headers });
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data || { error: err.message });
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMe = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/auth/me");
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data || { error: err.message });
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">✅</span>
          <h2 className="text-2xl font-bold text-green-400">Secure JWT Authentication Demo</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300 border border-green-700/50">SECURE</span>
        </div>
        <p className="text-gray-400">
          This demo shows how JWT authentication with HttpOnly cookies protects against header manipulation attacks.
        </p>
      </div>

      {/* Flow Diagram */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">How It Works (Secure)</h3>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 font-mono text-xs leading-relaxed text-gray-300">
          <pre>{`Browser                          Server
  │                                │
  │── POST /login ────────────────>│
  │   { username, password }       │  Verify credentials
  │                                │  Sign JWT
  │<── Set-Cookie: db_liquid_session│
  │    (HttpOnly, SameSite=Lax)    │
  │                                │
  │── GET /secure/listings ───────>│
  │   Cookie: db_liquid_session    │  authenticate() middleware
  │   X-Viewer-User-Id: admin ─┐  │  ↓ JWT signature verified
  │                            │   │  ↓ Fake header IGNORED
  │                            │   │  ↓ req.auth.userId from JWT
  │<── Only user's data ───────┘──│
  │                                │
  ═══ JWT + HttpOnly Cookie ═══`}</pre>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Login / User Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            {!authUser ? (
              <>
                <h3 className="font-semibold mb-4">Login</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                    <select
                      value={username}
                      onChange={(e) => {
                        const user = DEMO_USERS.find((u) => u.username === e.target.value);
                        setUsername(e.target.value);
                        if (user) setPassword(user.password);
                      }}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    >
                      {DEMO_USERS.map((user) => (
                        <option key={user.username} value={user.username}>
                          {user.name} (@{user.username})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />
                  </div>
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-500 text-white w-full"
                  >
                    {loading ? "Logging in..." : "🔐 Login"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold mb-4">Logged In</h3>
                <div className="bg-green-950/30 border border-green-800/50 rounded-lg p-4 mb-4">
                  <p className="text-green-400 font-medium">{authUser.name}</p>
                  <p className="text-sm text-gray-400">@{authUser.username}</p>
                  <p className="text-xs text-gray-500 mt-1">ID: {authUser.id}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleLogout} className="px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-800 hover:bg-gray-700 text-gray-300 flex-1">
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Secure API Controls */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Secure API Calls</h3>
            <div className="space-y-3">
              <button
                onClick={fetchSecureListings}
                disabled={loading || !authUser}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-500 text-white w-full"
              >
                {loading ? "Loading..." : "📋 Fetch My Listings (Secure)"}
              </button>
              <button
                onClick={fetchMe}
                disabled={loading || !authUser}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-800 hover:bg-gray-700 text-gray-300 w-full"
              >
                {loading ? "Loading..." : "👤 Get My Profile (/api/auth/me)"}
              </button>
            </div>
          </div>

          {/* Dev Mode: Fake Header Injection */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 border-yellow-800/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-yellow-400">Dev Mode</h3>
              <button
                onClick={() => setDevMode(!devMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  devMode ? "bg-yellow-600" : "bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    devMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Toggle to send a fake <code className="text-yellow-400">X-Viewer-User-Id</code> header and see
              that the server ignores it.
            </p>
            {devMode && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Fake X-Viewer-User-Id
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fakeHeader}
                    onChange={(e) => setFakeHeader(e.target.value)}
                    placeholder="e.g., admin"
                    className="flex-1 bg-gray-800 border border-yellow-700 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  />
                  <button
                    onClick={() => setFakeHeader("admin")}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-600 hover:bg-yellow-500 text-black text-xs"
                  >
                    admin
                  </button>
                  <button
                    onClick={() => setFakeHeader("user2")}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-600 hover:bg-yellow-500 text-black text-xs"
                  >
                    user2
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  The server will <strong className="text-green-400">ignore</strong> this fake header
                  and use the verified userId from your JWT.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Response */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Server Response</h3>

          {error && (
            <div className="bg-red-950/50 border border-red-800 rounded-lg p-4 mb-4">
              <p className="text-red-400 font-medium">Error</p>
              <pre className="text-sm text-red-300/80 mt-1">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          )}

          {response && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                {response.authenticated && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300 border border-green-700/50">
                    Authenticated as: {response.authenticatedUserId}
                  </span>
                )}
                {response.fakeHeaderDetected && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300 border border-yellow-700/50">
                    Fake header sent: {response.fakeHeaderDetected} (IGNORED)
                  </span>
                )}
              </div>

              {response.fakeHeaderIgnored && (
                <div className="bg-green-950/30 border border-green-800/50 rounded-lg p-3 mb-3 text-xs text-green-300/80">
                  ✅ Fake header <code className="text-yellow-400">X-Viewer-User-Id: {response.fakeHeaderDetected}</code> was
                  detected and <strong>ignored</strong>. Server used verified userId: <code className="text-green-400">{response.authenticatedUserId}</code>
                </div>
              )}

              <pre className="bg-gray-950 rounded-lg p-4 font-mono text-sm overflow-x-auto text-gray-300">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          {!response && !error && (
            <div className="text-center py-12 text-gray-600">
              <p className="text-4xl mb-3">
                {authUser ? "🔐" : "👆"}
              </p>
              <p>{authUser ? 'Click "Fetch My Listings" to see your data' : "Login first, then fetch listings"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Security Explanation */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 border-green-800/50">
        <h3 className="font-bold text-green-400 mb-3">Why This Is Secure</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>The JWT is stored in an <strong>HttpOnly cookie</strong> — JavaScript cannot read it, preventing XSS token theft.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>The JWT is <strong>cryptographically signed</strong> — the server verifies the signature on every request.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>The <code className="text-yellow-400">X-Viewer-User-Id</code> header is <strong>completely ignored</strong>. The userId comes from the verified JWT only.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Even if an attacker sends a fake header, the server uses <code className="text-green-400">req.auth.userId</code> from the middleware.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span><strong>SameSite=Lax</strong> provides CSRF protection for state-changing requests.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
