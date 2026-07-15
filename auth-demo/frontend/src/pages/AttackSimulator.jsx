import { useState } from "react";
import api from "../api/axios";

const USERS = [
  { id: "user1", name: "Alice (user1)" },
  { id: "user2", name: "Bob (user2)" },
  { id: "admin", name: "Admin (admin)" },
];

export default function AttackSimulator({ authUser }) {
  const [selectedHeader, setSelectedHeader] = useState("user1");
  const [insecureResponse, setInsecureResponse] = useState(null);
  const [secureResponse, setSecureResponse] = useState(null);
  const [loading, setLoading] = useState({ insecure: false, secure: false });
  const [error, setError] = useState({ insecure: null, secure: null });
  const [activeTab, setActiveTab] = useState("both");

  const fetchInsecure = async () => {
    setLoading((prev) => ({ ...prev, insecure: true }));
    setError((prev) => ({ ...prev, insecure: null }));
    try {
      const res = await api.get("/api/insecure/listings", {
        headers: { "X-Viewer-User-Id": selectedHeader },
      });
      setInsecureResponse(res.data);
    } catch (err) {
      setError((prev) => ({ ...prev, insecure: err.response?.data || { error: err.message } }));
      setInsecureResponse(null);
    } finally {
      setLoading((prev) => ({ ...prev, insecure: false }));
    }
  };

  const fetchSecure = async () => {
    setLoading((prev) => ({ ...prev, secure: true }));
    setError((prev) => ({ ...prev, secure: null }));
    try {
      // Send BOTH the real JWT cookie AND a fake header
      const res = await api.get("/api/secure/listings", {
        headers: { "X-Viewer-User-Id": selectedHeader },
      });
      setSecureResponse(res.data);
    } catch (err) {
      setError((prev) => ({ ...prev, secure: err.response?.data || { error: err.message } }));
      setSecureResponse(null);
    } finally {
      setLoading((prev) => ({ ...prev, secure: false }));
    }
  };

  const fetchBoth = async () => {
    await Promise.all([fetchInsecure(), fetchSecure()]);
  };

  const getCookieValue = () => {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const jwtCookie = cookies.find((c) => c.startsWith("db_liquid_session="));
    if (jwtCookie) {
      return jwtCookie.split("=")[1].substring(0, 50) + "...";
    }
    return "(no JWT cookie - login first)";
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🛡️</span>
          <h2 className="text-2xl font-bold text-yellow-400">Attack Simulator</h2>
        </div>
        <p className="text-gray-400">
          See the difference side-by-side. Send the same fake header to both APIs and compare the results.
        </p>
      </div>

      {/* What's happening visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-6">
          <h3 className="font-bold text-red-400 mb-2 text-lg">❌ Insecure API</h3>
          <p className="text-xs text-red-300/70 mb-3">What the attacker sees:</p>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 font-mono text-xs leading-relaxed text-red-300/80 bg-red-950/50">
            <pre>{`Browser (Attacker)
  │
  │  Sets header:
  │  X-Viewer-User-Id: ${selectedHeader}
  │
  ▼
Server
  │
  │  Reads header
  │  TRUSTS IT blindly  ← VULNERABLE
  │
  ▼
Returns ${selectedHeader}'s private data!
  (phone, email, notes)
`}</pre>
          </div>
        </div>

        <div className="bg-green-950/30 border border-green-800/50 rounded-xl p-6">
          <h3 className="font-bold text-green-400 mb-2 text-lg">✅ Secure API</h3>
          <p className="text-xs text-green-300/70 mb-3">What the server trusts:</p>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 font-mono text-xs leading-relaxed text-green-300/80 bg-green-950/50">
            <pre>{`Browser (Attacker)
  │
  │  Sets header:
  │  X-Viewer-User-Id: ${selectedHeader}
  │                           ─┐
  │  Sends Cookie:             │
  │  db_liquid_session (JWT) ──┤
  │                            │
  ▼                            │
Server                         │
  │                            │
  │  Reads JWT from cookie     │
  │  Verifies signature  ✓     │
  │  Extracts userId from JWT  │
  │                            │
  │  IGNORES fake header  ←───┘
  │
  ▼
Returns only JWT owner's data
`}</pre>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h3 className="font-semibold mb-4">Attack Controls</h3>
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <span className="text-sm text-gray-400">Impersonate as:</span>
          {USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedHeader(user.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedHeader === user.id
                  ? "bg-yellow-600 text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {user.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchBoth}
            disabled={loading.insecure || loading.secure}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 text-white"
          >
            🚀 Fetch Both APIs
          </button>
          <button
            onClick={fetchInsecure}
            disabled={loading.insecure}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-500 text-white"
          >
            ❌ Fetch Insecure Only
          </button>
          <button
            onClick={fetchSecure}
            disabled={loading.secure}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-500 text-white"
          >
            ✅ Fetch Secure Only
          </button>
        </div>
      </div>

      {/* Request Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h3 className="font-semibold mb-3">Request Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Request Headers</p>
            <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm overflow-x-auto text-xs">
              <p><span className="text-cyan-400">GET</span> <span className="text-gray-300">/api/insecure/listings</span></p>
              <p><span className="text-yellow-400">X-Viewer-User-Id</span>: <span className="text-red-400">{selectedHeader}</span></p>
              <p className="text-gray-600 mt-2">---</p>
              <p><span className="text-cyan-400">GET</span> <span className="text-gray-300">/api/secure/listings</span></p>
              <p><span className="text-yellow-400">X-Viewer-User-Id</span>: <span className="text-red-400">{selectedHeader}</span> ← FAKE</p>
              <p><span className="text-green-400">Cookie</span>: <span className="text-gray-400">db_liquid_session=***JWT***</span> ← REAL</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Cookie Status</p>
            <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm overflow-x-auto text-xs">
              <p><span className="text-gray-400">{getCookieValue()}</span></p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">What the server trusts</p>
            <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm overflow-x-auto text-xs">
              <p className="text-red-400">❌ Insecure: <span className="text-yellow-400">X-Viewer-User-Id</span> header <strong>directly</strong></p>
              <p className="text-green-400">✅ Secure: <span className="text-green-400">req.auth.userId</span> from verified JWT</p>
              <p className="text-gray-500 mt-1">Fake header: <span className="text-red-400">IGNORED</span> ✅</p>
            </div>
          </div>
        </div>
      </div>

      {/* Side by Side Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Insecure Result */}
        <div>
          <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-red-400">❌ Insecure API Response</h3>
              {insecureResponse && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300 border border-red-700/50">
                  Got: {insecureResponse.claimedUserId}
                </span>
              )}
            </div>

            {loading.insecure && (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin text-2xl mb-2">⏳</div>
                <p>Fetching...</p>
              </div>
            )}

            {error.insecure && (
              <div className="bg-red-950/50 border border-red-800 rounded-lg p-3 text-xs text-red-300/80">
                {JSON.stringify(error.insecure, null, 2)}
              </div>
            )}

            {insecureResponse && (
              <div>
                <div className="bg-red-950/50 border border-red-800/50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-red-300">
                    <strong>Result:</strong> Successfully retrieved data for <strong>{insecureResponse.claimedUserId}</strong>
                    {insecureResponse.user && <> — {insecureResponse.user.name}</>}
                  </p>
                  {insecureResponse.listings?.length > 0 && (
                    <p className="text-xs text-red-300/70 mt-1">
                      <strong>Private data exposed:</strong> phone, email, private notes
                    </p>
                  )}
                </div>
                <pre className="bg-gray-950 rounded-lg p-4 font-mono text-sm overflow-x-auto text-xs text-gray-300 max-h-80 overflow-y-auto">
                  {JSON.stringify(insecureResponse, null, 2)}
                </pre>
              </div>
            )}

            {!insecureResponse && !loading.insecure && !error.insecure && (
              <div className="text-center py-8 text-gray-600 text-sm">
                Click "Fetch Both APIs" to see the insecure result
              </div>
            )}
          </div>

          {insecureResponse && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 border-red-800/50">
              <h4 className="text-sm font-semibold text-red-400 mb-2">⚠️ Vulnerability Confirmed</h4>
              <p className="text-xs text-gray-400">
                The insecure API returned <strong className="text-red-400">{insecureResponse.claimedUserId}'s</strong> private data
                (phone: {insecureResponse.user?.phone || "N/A"}, email: {insecureResponse.user?.email || "N/A"})
                just because we sent <code className="text-yellow-400">X-Viewer-User-Id: {selectedHeader}</code>.
                No authentication was required.
              </p>
            </div>
          )}
        </div>

        {/* Secure Result */}
        <div>
          <div className="bg-green-950/30 border border-green-800/50 rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-green-400">✅ Secure API Response</h3>
              {secureResponse && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300 border border-green-700/50">
                  Auth: {secureResponse.authenticatedUserId}
                </span>
              )}
            </div>

            {loading.secure && (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin text-2xl mb-2">⏳</div>
                <p>Fetching...</p>
              </div>
            )}

            {error.secure && (
              <div className="bg-red-950/50 border border-red-800 rounded-lg p-3 text-xs text-red-300/80">
                {JSON.stringify(error.secure, null, 2)}
                {error.secure.error?.includes("Authentication") && (
                  <p className="text-yellow-400 mt-2">
                    ℹ️ You need to login first (go to Secure Demo tab) before the secure API will work.
                  </p>
                )}
              </div>
            )}

            {secureResponse && (
              <div>
                <div className="bg-green-950/50 border border-green-800/50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-green-300">
                    <strong>Result:</strong> Authenticated as <strong>{secureResponse.authenticatedUserId}</strong>
                    {secureResponse.user && <> — {secureResponse.user.name}</>}
                  </p>
                  {secureResponse.fakeHeaderIgnored && (
                    <p className="text-xs text-yellow-300/80 mt-1">
                      🛡️ Fake header <code className="text-yellow-400">X-Viewer-User-Id: {selectedHeader}</code> was <strong>ignored</strong>!
                    </p>
                  )}
                  {!secureResponse.fakeHeaderIgnored && authUser && (
                    <p className="text-xs text-green-300/70 mt-1">
                      ✅ Only my data returned. Fake header would have been ignored too.
                    </p>
                  )}
                </div>
                <pre className="bg-gray-950 rounded-lg p-4 font-mono text-sm overflow-x-auto text-xs text-gray-300 max-h-80 overflow-y-auto">
                  {JSON.stringify(secureResponse, null, 2)}
                </pre>
              </div>
            )}

            {!secureResponse && !loading.secure && !error.secure && (
              <div className="text-center py-8 text-gray-600 text-sm">
                Click "Fetch Both APIs" to see the secure result
              </div>
            )}
          </div>

          {secureResponse && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 border-green-800/50">
              <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Security Confirmed</h4>
              <p className="text-xs text-gray-400">
                The secure API returned <strong className="text-green-400">{secureResponse.authenticatedUserId}'s</strong> data (the JWT owner),
                even though we sent <code className="text-yellow-400">X-Viewer-User-Id: {selectedHeader}</code>.
                The fake header was <strong className="text-green-400">completely ignored</strong>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Table */}
      {(insecureResponse || secureResponse) && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-8">
          <h3 className="font-semibold mb-4">Attack Results Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Metric</th>
                  <th className="text-left py-2 px-3 text-red-400 font-medium">❌ Insecure</th>
                  <th className="text-left py-2 px-3 text-green-400 font-medium">✅ Secure</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800/50">
                  <td className="py-2 px-3 text-gray-300">Fake header sent</td>
                  <td className="py-2 px-3 text-red-400">X-Viewer-User-Id: {selectedHeader}</td>
                  <td className="py-2 px-3 text-green-400">X-Viewer-User-Id: {selectedHeader} (IGNORED)</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-2 px-3 text-gray-300">Data returned for</td>
                  <td className="py-2 px-3 text-red-400">{insecureResponse?.claimedUserId || "N/A"}</td>
                  <td className="py-2 px-3 text-green-400">{secureResponse?.authenticatedUserId || "N/A"}</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-2 px-3 text-gray-300">Authentication required?</td>
                  <td className="py-2 px-3 text-red-400">No ❌</td>
                  <td className="py-2 px-3 text-green-400">Yes (JWT) ✅</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-gray-300">Vulnerable to attack?</td>
                  <td className="py-2 px-3 text-red-400 font-bold">YES 🚨</td>
                  <td className="py-2 px-3 text-green-400 font-bold">NO 🛡️</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
