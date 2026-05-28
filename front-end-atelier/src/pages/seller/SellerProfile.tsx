import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sofa, ShieldCheck, Mail, Phone, MapPin, Award, Store, Edit3 } from 'lucide-react';

export default function SellerProfile() {
  const { user } = useApp();

  // Local state for dynamic mock profiling updates
  const [studioName, setStudioName] = useState('Studio Nord Collaborative');
  const [description, setDescription] = useState('An elite architectural woodturning and joinery collective based in Aarhus. Sourcing 100% sustainable Grade-A European Oak timber and sand-cast brass anchors.');
  const [location, setLocation] = useState('Aarhus, Denmark');
  const [contactPhone, setContactPhone] = useState('+45 8292-1029');
  const [swiftCode, setSwiftCode] = useState('NORDDK20AXX');

  const handleSaveWorkspaceProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Success! Studio Nord workspace configuration parameters saved into sandbox registry.`);
  };

  return (
    <div className="font-sans text-stone-900 text-left space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-light text-stone-950 tracking-tight">Studio Settings Space</h1>
        <p className="text-xs text-stone-400 mt-1">
          Edit workshop profiles, swift payment escrow coordinates, or contact locations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* Left Column Profile Status Card */}
        <div className="lg:col-span-1 bg-white border border-stone-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-6 text-center min-w-0">
          
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-stone-950 text-white flex items-center justify-center mx-auto shadow-lg relative group">
              <Store className="w-10 h-10 text-[#c2ab77]" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-display font-medium text-lg leading-tight text-stone-950 break-words">{studioName}</h3>
              <p className="text-[10px] text-stone-400 font-mono break-words">OWNED BY: {user?.name.toUpperCase()}</p>
              <span className="inline-block bg-[#c2ab77]/20 border border-[#c2ab77]/35 text-[#ab945a] px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase mt-2">
                🏆 ACCREDITED DESIGNER CO-OP
              </span>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-5 text-xs text-stone-500 font-sans space-y-3">
            <div className="flex gap-2.5 items-center min-w-0">
              <MapPin className="w-4.5 h-4.5 text-stone-400 shrink-0" />
              <span className="break-words min-w-0">{location}</span>
            </div>
            <div className="flex gap-2.5 items-center min-w-0">
              <Phone className="w-4.5 h-4.5 text-stone-400 shrink-0" />
              <span className="break-words min-w-0">{contactPhone}</span>
            </div>
            <div className="flex gap-2.5 items-center min-w-0">
              <Mail className="w-4.5 h-4.5 text-stone-400 shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
          </div>

        </div>

        {/* Right Column Form parameters */}
        <div className="lg:col-span-2 min-w-0">
          <form onSubmit={handleSaveWorkspaceProfile} className="bg-white p-5 sm:p-8 border border-stone-200 rounded-2xl sm:rounded-3xl space-y-6">
            
            <div className="border-b border-stone-100 pb-4">
              <h3 className="font-display font-medium text-base text-stone-950">Chamber Registry Details</h3>
              <p className="text-xs text-stone-400">Update workspace descriptions seen by customer explorers in the public marketplace.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-stone-500 uppercase">Artisan Studio Brand Name</label>
                <input 
                  type="text"
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-950"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-stone-500 uppercase">Studio Manifesto / Description</label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-50 p-4 border border-stone-200 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-stone-500 uppercase">Studio Location Coordinate</label>
                  <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-stone-500 uppercase">Contact phone logs</label>
                  <input 
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#B39D69] uppercase font-bold">Showroom SWIFT Escrow code</label>
                <input 
                  type="text"
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none font-mono font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-stone-950 hover:bg-stone-900 border border-black text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Commit Showroom Changes</span>
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}
