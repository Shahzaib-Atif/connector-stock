import React, { useState } from "react";
import { Lock, User } from "lucide-react";
import { useAppDispatch } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { login, setUsersList } from "../store/slices/authSlice";
import { loginApi, fetchUsersApi } from "../api/authApi";
import { ROUTES } from "./AppRoutes";

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const data = await loginApi(username, password);
      dispatch(
        login({
          user: data.user.username,
          role: data.user.role,
          token: data.access_token,
        })
      );

      // Fetch users list after login
      const users = await fetchUsersApi();
      dispatch(setUsersList(users));

      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl transition-all placeholder-slate-600";
  const inputClassFocus =
    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-slate-800 w-full max-w-md p-8 rounded-2xl shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Warehouse Login</h1>
          <p className="text-slate-400 mt-2">Please sign in to manage stock</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wide">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={username}
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
                className={`${inputClass} ${inputClassFocus}`}
                placeholder="Enter username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} ${inputClassFocus}`}
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 btn-primary font-bold rounded-xl transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "SIGNING IN..." : "SIGN IN"}
          </button>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate(ROUTES.HOME)}
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2 mx-auto"
            >
              <span>Continue to Homepage</span>
              <span className="text-lg">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
