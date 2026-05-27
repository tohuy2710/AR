import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, Sparkles, Star, Sofa, ArrowRight, Eye, Gift, ShieldCheck, 
  Flame, Clock, ChevronRight, CheckCircle2, Heart 
} from 'lucide-react';

export default function CustomerHome() {
  const { products, toggleWishlist, wishlist, addToCart } = useApp();
  const navigate = useNavigate();

  // Flash sale countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 32, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { id: 'living-room', label: 'Living Room', icon: '🛋️', count: products.filter(p => p.category === 'living-room').length },
    { id: 'dining', label: 'Dining & Kitchen', icon: '🍽️', count: products.filter(p => p.category === 'dining').length },
    { id: 'bedroom', label: 'Bedroom Cozy', icon: '🛏️', count: products.filter(p => p.category === 'bedroom').length },
    { id: 'office', label: 'Workspace', icon: '💻', count: products.filter(p => p.category === 'office').length },
    { id: 'lighting', label: 'Lighting Art', icon: '💡', count: products.filter(p => p.category === 'lighting').length },
  ];

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 font-sans">
      
      {/* 1. Hot Deals & Flash Sale Banner */}
      <div className="bg-amber-500 text-stone-950 font-mono text-center py-2.5 px-4 text-xs font-bold tracking-wider flex items-center justify-center gap-3">
        <span className="flex items-center gap-1 bg-stone-950 text-white px-2 py-0.5 rounded text-[10px]">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-bounce" /> FLASH COMMISSIONS
        </span>
        <span>Atelier Core season designs up to 15% off for next:</span>
        <span className="bg-stone-950 text-white px-2 py-0.5 rounded font-mono font-bold text-[11px]">
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>

      {/* 2. Public / Live Marketplace Hero Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white overflow-hidden p-8 sm:p-12 lg:p-16 shadow-xl border border-stone-850">
          <div className="absolute top-0 right-0 w-[50%] h-full opacity-20 pointer-events-none md:block hidden">
            <div className="absolute inset-x-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute -top-[10%] -right-[10%] w-[35rem] h-[35rem] rounded-full bg-amber-500/20 blur-[120px]" />
          </div>

          <div className="max-w-xl relative z-10 space-y-5 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#c2ab77]/20 border border-[#c2ab77]/30 text-[#e4cfa1] rounded-full text-[10px] font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#B39D69]" /> Atelier Sovereign Gold Club
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-light leading-tight tracking-tight">
              Curate Your Home’s <br />
              <span className="font-normal italic text-[#c2ab77]">Architectural Signature</span>
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
              Unlock Direct-from-Workshop Pricing with verified Timber Warrant Certificates and integrated 360-degree interactive CAD rotation.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/customer/products" 
                className="px-6 py-3.5 bg-[#c2ab77] hover:bg-[#b09966] text-stone-950 text-xs font-mono font-bold tracking-widest uppercase rounded-xl transition-all shadow-md flex items-center gap-2 group cursor-pointer"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <div className="flex items-center gap-2 text-stone-400 font-mono text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>48 Verified Artisans Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Category Quick Grid (Shopee style rounded rounders) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h3 className="text-xs font-mono uppercase font-bold tracking-widest text-[#B39D69] text-left mb-5">
          Artisan Department Catalog
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => navigate(`/customer/products?category=${cat.id}`)}
              className="bg-white hover:bg-stone-100 border border-stone-150 p-5 rounded-2xl cursor-pointer text-center transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 space-y-3 flex flex-col items-center"
            >
              <span className="text-3xl" role="img" aria-label={cat.label}>{cat.icon}</span>
              <div className="space-y-0.5">
                <p className="font-display font-medium text-xs text-stone-950">{cat.label}</p>
                <p className="text-[10px] text-stone-400 font-mono">{cat.count} listings ready</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Shopee/Lazada Style Prominent Flash Sale Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-rose-50 rounded-xl">
                <Flame className="w-6 h-6 text-rose-500 fill-rose-500" />
              </span>
              <div className="text-left">
                <h2 className="text-xl font-display font-medium text-stone-950 flex items-center gap-2">
                  Atelier Lightning Deals <span className="text-xs text-rose-500 font-mono font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">HOT BUY</span>
                </h2>
                <p className="text-xs text-stone-400">Accredited masterpieces available at pre-commission introductory rates.</p>
              </div>
            </div>
            
            <Link 
              to="/customer/products" 
              className="text-xs font-mono font-bold tracking-wide text-[#B39D69] hover:text-stone-950 uppercase flex items-center gap-1 transition-colors"
            >
              <span>Examine All Deals</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Flash Deal Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.slice(0, 3).map((p) => {
              const discountPrice = Math.floor(p.price * 0.9);
              const isFav = wishlist.includes(p.id);
              
              return (
                <div 
                  key={p.id}
                  className="bg-stone-50/50 rounded-2xl border border-stone-200/60 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  {/* Photo area with badges */}
                  <div 
                    onClick={() => navigate(`/customer/products/${p.id}`)}
                    className="relative aspect-square w-full bg-stone-100/40 p-5 flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    <span className="absolute top-3 left-3 bg-rose-500 text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-md uppercase">
                      Save 10%
                    </span>
                    <span className="absolute top-3 right-3 bg-stone-900/80 text-white text-[8px] font-mono px-2 py-0.5 rounded uppercase">
                      3D & AR Ready
                    </span>

                    <img 
                      src={p.images[0]} 
                      alt={p.name} 
                      referrerPolicy="no-referrer"
                      className="max-h-[85%] max-w-[85%] object-contain drop-shadow-md group-hover:scale-105 duration-300 transition-transform pointer-events-none"
                    />

                    {/* Quick Add to Wishlist overlay */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                      className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 text-left space-y-3">
                    <div>
                      <span className="text-[10px] text-[#B39D69] font-mono font-bold uppercase tracking-wider">{p.sellerId} Studio</span>
                      <h4 
                        onClick={() => navigate(`/customer/products/${p.id}`)}
                        className="font-display font-medium text-sm text-stone-950 truncate hover:text-amber-700 cursor-pointer transition-colors"
                      >
                        {p.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-rose-600">${discountPrice.toLocaleString()}</span>
                      <span className="font-mono text-xs text-stone-400 line-through">${p.price.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono border-t border-stone-100 pt-3">
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span className="text-stone-950">{p.rating}</span>
                      </div>
                      <span className="text-stone-400 uppercase tracking-wide truncate max-w-[120px]">{p.materials[0]}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => navigate(`/customer/products/${p.id}`)}
                        className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-950 font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all"
                      >
                        View 360D
                      </button>
                      <button
                        onClick={() => {
                          addToCart(p, p.colors[0].name, 1);
                          alert(`${p.name} added to coordinate cart!`);
                        }}
                        className="w-full py-2 bg-stone-950 hover:bg-stone-900 text-white font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all"
                      >
                        Add Cart
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}
