import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sofa, Shield, Award, Landmark, Mail, Lock, User, Key, CheckCircle, Smartphone } from 'lucide-react';

export default function CustomerProfile() {
  const { user, cart, wishlist, orders } = useApp();

  const [shippingStreet, setShippingStreet] = useState('142 Mercer St, Loft 4B');
  const [shippingCity, setShippingCity] = useState('New York');
  const [shippingZip, setShippingZip] = useState('10012');
  const [phone, setPhone] = useState('+1 (555) 390-2101');
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSaveDefaults = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Provenance shipping defaults committed to secure sandbox context!');
  };

  const myOrdersCount = orders.filter(
    ord => ord.buyerEmail?.toLowerCase() === user?.email?.toLowerCase() || ord.buyerName?.toLowerCase() === user?.name?.toLowerCase()
  ).length;

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Title */}
        <div className="mb-8 space-y-1">
          <h1 className="text-3xl font-display font-light text-stone-950 tracking-tight">Customer Profile Space</h1>
          <p className="text-xs text-stone-500">Manage security settings, address defaults, and authenticated registry tiers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Block: Account Summary Card (1/3 cols) */}
          <div className="lg:col-span-1 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6">
            
            {/* Visual Header */}
            <div className="text-center space-y-4">
              <div className="w-18 h-18 bg-stone-950 text-white rounded-full flex items-center justify-center mx-auto text-xl font-mono font-bold font-sans shadow-lg">
                {user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-display font-medium text-stone-950">{user?.name}</h3>
                <span className="inline-block bg-[#c2ab77]/20 text-[#a28a55] border border-[#c2ab77]/30 font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase">
                  ⭐ ATELIER PLATINUM PATRON
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 border-y border-stone-100 py-5 text-center font-mono">
              <div>
                <p className="text-lg font-bold text-stone-950 font-sans">{wishlist.length}</p>
                <p className="text-[9px] text-stone-400 uppercase">Wishes</p>
              </div>
              <div className="border-x border-stone-100">
                <p className="text-lg font-bold text-stone-950 font-sans">{cart.length}</p>
                <p className="text-[9px] text-stone-400 uppercase">Cart</p>
              </div>
              <div>
                <p className="text-lg font-bold text-stone-950 font-sans">{myOrdersCount}</p>
                <p className="text-[9px] text-stone-400 uppercase">Orders</p>
              </div>
            </div>

            {/* Registered details */}
            <div className="space-y-3.5 text-xs text-stone-600 font-sans">
              <div className="flex gap-3 items-center">
                <Mail className="w-4.5 h-4.5 text-stone-400" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex gap-3 items-center">
                <Shield className="w-4.5 h-4.5 text-stone-400" />
                <span>Verification ID: <code className="font-mono text-[10px] bg-stone-100 px-1 py-0.5 rounded">#{user?.id}</code></span>
              </div>
              <div className="flex gap-3 items-center">
                <Award className="w-4.5 h-4.5 text-[#B39D69]" />
                <span>Since: <span className="font-mono font-bold text-stone-800">MAY 2026</span></span>
              </div>
            </div>

          </div>

          {/* Right Block: Shipping Defaults & Security (2/3 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Form defaults */}
            <form onSubmit={handleSaveDefaults} className="bg-white p-8 border border-stone-200 rounded-3xl space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-base font-display font-medium text-stone-950">Shipping Defaults</h3>
                <p className="text-xs text-stone-400 font-light">Set default destination addresses to accelerate interactive showroom buying checkouts.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-stone-500 uppercase">Default Street Coordinates</label>
                  <input 
                    type="text"
                    value={shippingStreet}
                    onChange={(e) => setShippingStreet(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Default City</label>
                    <input 
                      type="text"
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Default Postal/ZIP Code</label>
                    <input 
                      type="text"
                      value={shippingZip}
                      onChange={(e) => setShippingZip(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-stone-500 uppercase">Secure Phone Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                    <input 
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-stone-950 hover:bg-stone-900 text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded-lg transition-all shadow-sm"
              >
                Save Defaults
              </button>
            </form>

            {/* Sandbox notifications configuration */}
            <div className="bg-white p-8 border border-stone-200 rounded-3xl space-y-4">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-base font-display font-medium text-stone-950">Security & Ledger Permissions</h3>
                <p className="text-xs text-stone-400 font-light">Set cryptographic options or adjust email notification updates.</p>
              </div>

              <div className="space-y-4 text-xs">
                
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-stone-950">Timber Verification Emails</p>
                    <p className="text-stone-500 font-light">Receive detailed planting data and forestry codes instantly on purchase.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={emailAlerts}
                    onChange={() => setEmailAlerts(!emailAlerts)}
                    className="w-4 h-4 rounded text-stone-950 bg-stone-200 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="space-y-0.5 text-left">
                    <p className="font-semibold text-stone-950">Decoupled Payment Keys</p>
                    <p className="text-stone-500 font-light text-left">Log payments directly inside localized sandboxes without writing real bank accounts.</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 rounded px-2.5 py-1">ENFORCED</span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
