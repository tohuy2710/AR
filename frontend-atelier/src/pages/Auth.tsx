import React, { useState } from 'react';
import { User, LogIn, ArrowRight, ShieldCheck, Mail, Lock, UserCheck, LayoutDashboard } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthProps {
  setUser: (user: UserType) => void;
  setCurrentPage: (page: string) => void;
}

export default function Auth({ setUser, setCurrentPage }: AuthProps) {
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new mockup user session
    const userSession: UserType = {
      id: `usr-${Date.now()}`,
      name: name || (role === 'seller' ? 'Alexander Mercer' : 'Adrian Sterling'),
      email: email || (role === 'seller' ? 'alex@mercer.com' : 'adrian@sterling.com'),
      role
    };

    setUser(userSession);
    
    // Friendly alert
    alert(`Success! Logged in as ${userSession.name} (${userSession.role.toUpperCase()})`);

    // Redirect based on role
    if (role === 'seller') {
      setCurrentPage('seller-overview');
    } else {
      setCurrentPage('catalog');
    }
  };

  return (
    <div className="font-sans min-h-[85vh] bg-white grid grid-cols-1 lg:grid-cols-12 items-stretch py-8">
      
      {/* Left visual column - pure luxury aesthetic editorial spacing */}
      <div className="hidden lg:flex lg:col-span-5 bg-stone-950 p-12 text-white flex-col justify-between relative overflow-hidden rounded-3xl m-4">
        
        {/* Underlay decoration dots */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="absolute top-[30%] left-[20%] w-72 h-72 bg-[#B39D69]/10 rounded-full blur-[100px]" />

        <div className="relative z-10">
          <span className="text-[10px] bg-stone-900 border border-stone-800 text-stone-300 font-mono font-bold tracking-widest uppercase px-3 py-1.5 rounded-md">Atelier Guild</span>
          <h2 className="text-4xl font-display font-light text-white tracking-tight mt-6 leading-tight">
            Crafting the <br />Future of <span className="text-gold-500 font-normal italic">Interiors</span>
          </h2>
          <p className="text-stone-400 text-sm mt-4 font-light leading-relaxed max-w-xs">
            Authenticate your credentials to register commissions, track live timber seasoning nodes, or list your local workshop design blueprints.
          </p>
        </div>

        {/* Dynamic Image Placement of furniture */}
        <div className="relative z-10 py-6">
          <img 
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80" 
            alt="Atelier Sofa mockup" 
            referrerPolicy="no-referrer"
            className="w-full max-h-56 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
          />
        </div>

        <div className="relative z-10 border-t border-stone-900 pt-6 flex items-center gap-3.5 text-[10px] font-mono text-stone-500 uppercase">
          <ShieldCheck className="w-5 h-5 text-gold-500 stroke-[1.5]" />
          <span>Sovereign Authentication Protocol Verified</span>
        </div>

      </div>

      {/* Right Column: Clean, high-contrast forms fields (7 parts) */}
      <div className="lg:col-span-7 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8 text-left">
          
          {/* Tabs switchers */}
          <div className="flex border-b border-stone-100">
            <button
              onClick={() => { setAuthTab('signin'); }}
              className={`flex-1 pb-4 text-sm font-mono uppercase tracking-widest text-center transition-all border-b-2 ${
                authTab === 'signin' 
                  ? 'border-stone-950 text-stone-950 font-bold' 
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthTab('signup'); }}
              className={`flex-1 pb-4 text-sm font-mono uppercase tracking-widest text-center transition-all border-b-2 ${
                authTab === 'signup' 
                  ? 'border-stone-950 text-stone-950 font-bold' 
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Join Atelier
            </button>
          </div>

          <div className="space-y-2.5">
            <h1 className="text-3xl font-display font-light text-stone-950 tracking-tight">
              {authTab === 'signin' ? 'Welcome Back' : 'Create Co-op Account'}
            </h1>
            <p className="text-stone-500 text-xs">
              {authTab === 'signin' 
                ? 'Sign in to access your custom timber commissions and historical purchase ledgers.' 
                : 'Join our collective as either an elite furniture explorer or creative designer.'}
            </p>
          </div>

          {/* Core Submit Forms */}
          <form onSubmit={handleAuthSubmit} className="space-y-6">
            
            {/* Dynamic Role tab select (visible inside sign up, or sign in) */}
            <div className="bg-stone-50 border p-1 rounded-xl border-stone-200">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 block px-3.5 pt-2">Select Intended Co-op Role</span>
              <div className="flex mt-1">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                    role === 'customer' 
                      ? 'bg-stone-950 text-white shadow-xs font-bold' 
                      : 'text-stone-500 hover:text-stone-950'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Customer Explorer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                    role === 'seller' 
                      ? 'bg-[#c2ab77] text-white shadow-xs font-bold' 
                      : 'text-stone-500 hover:text-[#B39D69]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Seller Studio Designer</span>
                </button>
              </div>
            </div>

            {/* Inputs lists */}
            <div className="space-y-4 text-xs font-sans">
              
              {authTab === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-stone-400 uppercase">Legal Signature Name</label>
                  <div className="relative">
                    <UserCheck className="absolute left-4 top-3.5 w-4.5 h-4.5 text-stone-400" />
                    <input 
                      required
                      type="text"
                      placeholder="E.g., Alexander Mercer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5 font-sans">
                <label className="text-[10px] font-mono text-stone-400 uppercase">Secure Email Coordinates</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-stone-400" />
                  <input 
                    required
                    type="email"
                    placeholder="yours@address.co"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-[10px] font-mono text-stone-400 uppercase">Secure Password Lock</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-stone-400" />
                  <input 
                    required
                    type="password"
                    placeholder="••••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
              </div>

            </div>

            {/* Form actions items */}
            {authTab === 'signin' && (
              <div className="flex justify-between items-center text-xs font-mono text-stone-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="w-4 h-4 rounded border-stone-200 checked:bg-stone-950 focus:ring-0" />
                  <span>Remember Session</span>
                </label>
                <a href="#" className="hover:text-stone-950 hover:underline">Forgot Key Coordinates?</a>
              </div>
            )}

            {/* Authorization actions */}
            <button
              type="submit"
              className="w-full py-4.5 bg-stone-950 hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 group transition-all"
            >
              <span>{authTab === 'signin' ? 'Verify Credentials' : 'Commit Ledger Agreement'}</span>
              <LogIn className="w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5" />
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}
