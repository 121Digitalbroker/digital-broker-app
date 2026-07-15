import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import InsecureDemo from "./pages/InsecureDemo";
import SecureDemo from "./pages/SecureDemo";
import AttackSimulator from "./pages/AttackSimulator";

export default function App() {
  const [authUser, setAuthUser] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <h1 className="text-lg font-bold">
                Auth Security Demo
              </h1>
            </div>
            <nav className="flex items-center gap-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-4 py-3 font-medium text-sm transition-colors duration-200 border-b-2 ${
                    isActive
                      ? "text-blue-400 border-blue-400"
                      : "text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-600"
                  }`
                }
              >
                ❌ Insecure Demo
              </NavLink>
              <NavLink
                to="/secure"
                className={({ isActive }) =>
                  `px-4 py-3 font-medium text-sm transition-colors duration-200 border-b-2 ${
                    isActive
                      ? "text-blue-400 border-blue-400"
                      : "text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-600"
                  }`
                }
              >
                ✅ Secure Demo
              </NavLink>
              <NavLink
                to="/attack"
                className={({ isActive }) =>
                  `px-4 py-3 font-medium text-sm transition-colors duration-200 border-b-2 ${
                    isActive
                      ? "text-blue-400 border-blue-400"
                      : "text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-600"
                  }`
                }
              >
                🛡️ Attack Simulator
              </NavLink>
            </nav>
            {authUser && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  Logged in as: <strong className="text-green-400">{authUser.name}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<InsecureDemo />} />
          <Route path="/secure" element={<SecureDemo authUser={authUser} setAuthUser={setAuthUser} />} />
          <Route path="/attack" element={<AttackSimulator authUser={authUser} />} />
        </Routes>
      </main>
    </div>
  );
}
