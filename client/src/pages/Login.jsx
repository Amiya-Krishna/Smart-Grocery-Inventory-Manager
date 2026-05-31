import { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const login = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => e.key === "Enter" && login();

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-700 px-4">
      <div className="w-full max-w-sm flex flex-col gap-5">
        {/* Box */}
       <div className="flex flex-col gap-6 p-6 bg-gray-900 rounded-lg"> 

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-sm flex-shrink-0">
            🧺
          </div>
          <span className="text-sm text-gray-400 font-medium">Smart Grocery</span>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-xl font-semibold text-white">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Fields */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400">Email</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500 text-sm">✉</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKey}
                className="w-full h-9 pl-8 pr-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500 transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400">Password</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500 text-sm">🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKey}
                className="w-full h-9 pl-8 pr-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={login}
          disabled={loading}
          className="w-full h-10 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          No account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Create one
          </Link>
        </p>

      </div>
    </div>
    </div>
  );
}