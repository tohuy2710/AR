import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  Sofa,
  KeyRound,
  Mail,
  Lock,
  Sparkles,
  UserCheck,
  LayoutDashboard,
  LogIn,
  ShieldAlert,
} from "lucide-react";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Get potential redirection route or default to home/flows
  const from = location.state?.from?.pathname || "/";

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = login(email, password);
    if (res.success) {
      // Successful login, let's redirect to where they wanted or their flow
      if (from === "/") {
        if (res.role === "seller") {
          navigate("/seller");
        } else {
          navigate("/customer");
        }
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(res.message);
    }
  };

  const handleQuickLogin = (role: "customer" | "seller") => {
    setError("");
    const testEmail =
      role === "customer" ? "customer@example.com" : "seller@example.com";
    const testPassword = role === "customer" ? "customer123" : "seller123";

    const res = login(testEmail, testPassword);
    if (res.success) {
      if (from === "/") {
        if (role === "seller") {
          navigate("/seller");
        } else {
          navigate("/customer");
        }
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="font-sans min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Mock Credentials Desk */}
        <div className="bg-stone-950 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decoration grids underlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="absolute top-[20%] left-[10%] w-60 h-60 bg-[#B39D69]/10 rounded-full blur-[90px]" />

          <div className="relative z-10 space-y-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#c2ab77] text-white flex items-center justify-center">
                <Sofa className="w-4 h-4" />
              </div>
              <span className="font-display font-medium text-lg tracking-widest uppercase">
                ATELIER
              </span>
            </Link>

            <div className="space-y-2 pt-6">
              <span className="text-[9px] bg-stone-900 border border-stone-800 text-[#B39D69] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-md">
                Co-op Sandbox Portal
              </span>
              <h2 className="text-3xl font-display font-light text-white leading-tight">
                Enter your <br />
                <span className="italic text-[#c2ab77]">Exclusive Flow</span>
              </h2>
              <p className="text-stone-400 text-xs font-light leading-relaxed">
                Log in and gain access to custom designed showrooms, material
                seasoning pipelines, or premium orders dispatch ledger.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Standard Login Form */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-display font-light text-stone-950 tracking-tight">
                Sign In
              </h1>
              <p className="text-stone-500 text-xs font-light">
                Sign in using your coordinates to start exploring collections.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-stone-400 uppercase">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
                  <input
                    required
                    type="email"
                    placeholder="customer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-950/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-stone-400 uppercase">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-950/20 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-stone-950 hover:bg-stone-900 border border-black text-white text-xs font-mono font-bold tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer mt-2"
              >
                <span>Login</span>
                <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            <div className="pt-4 border-t border-stone-50 text-center">
              <p className="text-xs text-stone-500">
                Are you a new artisan collaborator?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-stone-950 hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
