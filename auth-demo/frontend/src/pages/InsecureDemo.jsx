import { useState } from "react";
import api from "../api/axios";

const USERS = [
  { id: "user1", name: "Alice (user1)" },
  { id: "user2", name: "Bob (user2)" },
  { id: "admin", name: "Admin (admin)" },
];

export default function InsecureDemo() {
  const [selectedUser, setSelectedUser] = useState("user1");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/insecure/listings", {
        headers: {
          "X-Viewer-User-Id": selectedUser,
        },
      });
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
          <span className="text-2xl">❌</span>
          <h2 className="text-2xl font-bold text-red-400">Insecure Authentication Demo</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300 border border-red-700/50">VULNERABLE</span>
        </div>
        <p className="text-gray-400">
          This demo shows how trusting client-controlled headers (like <code className="text-red-400">X-Viewer-User-Id</code>) allows
          anyone to impersonate any user.
        </p>
      </div>

      {/* Security Warning Card */}
      <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-6 mb-8 border-2 border-red-500/50">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-1">⚠️</span>
          <div>
            <h3 className="font-bold text-red-400 mb-1">Security Vulnerability</h3>
            <p className="text-red-300/80 text-sm">
              The server reads <code className="text-red-300 bg-red-950 px-1 rounded">X-Viewer-User-Id</code> from the request headers
              and trusts it <strong>without any verification</strong>. Simply change this header to impersonate any user.
              This is equivalent to leaving your front door unlocked with a sign that says "just tell us who you are."
            </p>
          </div>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">How It Works (Insecure)</h3>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 font-mono text-xs leading-relaxed text-gray-300">
          <pre>{`Browser                          Server
  │                                │
  │── X-Viewer-User-Id: user1 ────>│
  │                                │  "Oh, you say you're user1?
  │                                │   Here's all their private data!"
  │<── Private Data ───────────────│
  │                                │
  │── X-Viewer-User-Id: admin ────>│
  │                                │  "Sure thing, Mr. Admin!"
  │<── Admin Private Data ─────────│
  │                                │
  ═══ NO VERIFICATION AT ALL ═══`}</pre>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Controls</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                X-Viewer-User-Id Header Value
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
              >
                {USERS.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Try changing this to "user2" or "admin" to see their private data.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Request will be:</p>
              <code className="text-sm text-cyan-400">
                GET /api/insecure/listings
              </code>
              <br />
              <code className="text-sm text-yellow-400">
                X-Viewer-User-Id: {selectedUser}
              </code>
            </div>

            <button
              onClick={fetchListings}
              disabled={loading}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-500 text-white w-full"
            >
              {loading ? "Fetching..." : "🚨 Fetch Listings (Insecure)"}
            </button>
          </div>
        </div>

        {/* Response Display */}
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300 border border-red-700/50">
                  Claimed: {response.claimedUserId}
                </span>
                {response.user && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300 border border-yellow-700/50">
                    Got data for: {response.user.name}
                  </span>
                )}
                {!response.user && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300 border border-red-700/50">User not found!</span>
                )}
              </div>

              {response.securityWarning && (
                <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-3 mb-3 text-xs text-red-300/80">
                  ⚠️ {response.securityWarning}
                </div>
              )}

              <pre className="bg-gray-950 rounded-lg p-4 font-mono text-sm overflow-x-auto text-gray-300">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          {!response && !error && (
            <div className="text-center py-12 text-gray-600">
              <p className="text-4xl mb-3">👆</p>
              <p>Select a user and click "Fetch Listings"</p>
              <p className="text-sm mt-1">Then change the user and fetch again</p>
            </div>
          )}
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 border-red-800/50">
        <h3 className="font-bold text-red-400 mb-3">Why This Is Insecure</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">✗</span>
            <span>The server blindly trusts the <code className="text-red-400">X-Viewer-User-Id</code> header without any verification.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">✗</span>
            <span>Anyone can send <code className="text-red-400">X-Viewer-User-Id: admin</code> and get admin-level access.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">✗</span>
            <span>There is no signature, no encryption, and no verification mechanism.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">✗</span>
            <span>Headers are trivial to modify using browser DevTools, curl, or any HTTP client.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">✗</span>
            <span><strong>Private data</strong> like phone numbers, emails, and private notes are exposed to unauthorized users.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
