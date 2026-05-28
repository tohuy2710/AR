import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  Sofa,
  KeyRound,
  Mail,
  Lock,
  UserCheck,
  LayoutDashboard,
  UserPlus,
  Sparkles,
} from "lucide-react";

export default function Register() {
  const { registerUser } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "seller">("customer");

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser(name, email, role);
    alert(
      `Success! Registry committed as ${name} (${role === "seller" ? "Seller Studio" : "Customer"})`,
    );
    if (role === "seller") {
      navigate("/seller");
    } else {
      navigate("/customer");
    }
  };

  return (
    <div className="font-sans min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        {/* Left Side Info Panel */}
        <div className="bg-stone-900 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="absolute bottom-[20%] right-[10%] w-60 h-60 bg-amber-500/5 rounded-full blur-[80px]" />

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
              <span className="text-[9px] bg-stone-950 border border-stone-850 text-[#B39D69] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-md">
                Co-op Expansion System
              </span>
              <h2 className="text-3xl font-display font-light text-white leading-tight">
                Establish <br />
                Your <span className="italic text-[#c2ab77]">Registry</span>
              </h2>
              <p className="text-stone-400 text-xs font-light leading-relaxed">
                Join our decentralized luxury collective as an elite customer
                explorer or independent workspace designer.
              </p>
            </div>
          </div>

          <div className="relative z-10 p-5 rounded-2xl bg-stone-950/50 border border-stone-800 space-y-3.5 text-xs">
            <h4 className="font-mono text-[9px] tracking-widest text-[#B39D69] uppercase font-bold">
              Why Join Atelier?
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">✔</span>
                <span>
                  Verified certified materials with decadal warrant codes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">✔</span>
                <span>
                  Direct-from-workshop listings for maximum artisan royalty.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">✔</span>
                <span>Fully integrated 3D design workspace models.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side Registration Forms */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-display font-light text-stone-950 tracking-tight">
                Register
              </h1>
              <p className="text-stone-500 text-xs font-light">
                Fill in the blocks to generate your secure marketplace keys.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Switches */}
              <div className="bg-stone-50 border p-1 rounded-xl border-stone-200">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 block px-3 pt-2 text-left">
                  My Desired Workspace Role
                </span>
                <div className="flex mt-1">
                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                      role === "customer"
                        ? "bg-stone-950 text-white shadow-xs font-bold"
                        : "text-stone-500 hover:text-stone-950"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("seller")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                      role === "seller"
                        ? "bg-[#c2ab77] text-white shadow-xs font-bold"
                        : "text-stone-500 hover:text-[#B39D69]"
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Seller</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-stone-400 uppercase">
                  Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Adrian Sterling"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-950/20"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-stone-400 uppercase">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
                  <input
                    required
                    type="email"
                    placeholder="yours@domain.co"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-xl text-xs focus:outline-none"
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
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-xl text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-stone-950 hover:bg-stone-900 border border-black text-white text-xs font-mono font-bold tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer mt-2"
              >
                <span>Register</span>
                <UserPlus className="w-4 h-4 transition-transform group-hover:scale-105" />
              </button>
            </form>

            <div className="pt-4 border-t border-stone-50 text-center">
              <p className="text-xs text-stone-500">
                Already registered a co-op key?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-stone-950 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
