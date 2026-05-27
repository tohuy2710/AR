import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, User, LogOut, LayoutDashboard, Sofa, Heart, History, UserCheck
} from 'lucide-react';

export default function Navbar() {
  const { user, cart, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const sellerEntryLabel = user?.role === 'seller' ? 'Seller Studio' : 'Flash Deal';

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/85 border-b border-stone-150 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-stone-950 text-white flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
              <Sofa className="w-5.5 h-5.5 stroke-[1.5]" />
            </div>
            <div className="text-left">
              <span className="font-display font-medium text-xl tracking-widest text-stone-950">ATELIER</span>
              <span className="block text-[8px] tracking-[0.3em] uppercase text-stone-400 font-mono font-medium leading-none mt-0.5">Architectural Lab</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-8 lg:gap-11">
            <Link
              to="/"
              className={`font-sans text-sm font-medium tracking-wide transition-colors relative py-1.5 ${
                location.pathname === '/' ? 'text-stone-950 font-semibold' : 'text-stone-500 hover:text-stone-950'
              }`}
            >
              Home
              {location.pathname === '/' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-950 rounded-full" />
              )}
            </Link>

            {user?.role !== 'seller' && (
              <Link
                to="/customer/products"
                className={`font-sans text-sm font-medium tracking-wide transition-colors relative py-1.5 ${
                  location.pathname.startsWith('/customer/products') ? 'text-stone-950 font-semibold' : 'text-stone-500 hover:text-stone-950'
                }`}
              >
                The Collections
                {location.pathname.startsWith('/customer/products') && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-950 rounded-full" />
                )}
              </Link>
            )}

            <Link
              to="/seller"
              className={`font-sans text-sm font-medium tracking-wide transition-colors relative py-1.5 flex items-center gap-1.5 ${
                location.pathname.startsWith('/seller') ? 'text-stone-950 font-semibold' : 'text-stone-500 hover:text-stone-950'
              }`}
            >
              <span>{sellerEntryLabel}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/50 font-mono uppercase font-bold">STUDIO</span>
              {location.pathname.startsWith('/seller') && (
                <span className="absolute bottom-4 left-0 right-14 h-0.5 bg-stone-950 rounded-full" />
              )}
            </Link>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            
            {/* Direct Status indicator for premium UX */}
            <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-stone-400 font-mono px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-155">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>EST. CHICAGO & CPH SHOWROOMS</span>
            </div>

            {/* Shopping Cart Button */}
            <Link
              to="/customer/cart"
              className={`p-2.5 rounded-full hover:bg-stone-50 text-stone-900 border transition-all relative ${
                location.pathname === '/customer/cart' ? 'bg-stone-50 border-stone-950' : 'border-transparent'
              }`}
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-stone-950 text-white text-[10px] items-center justify-center font-display font-bold w-5 h-5 rounded-full flex border-2 border-white shadow-sm scale-110">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth Toggle */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 pr-2.5 rounded-full border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all cursor-pointer bg-white"
                  >
                    <span className="font-sans text-[11px] font-bold tracking-wide text-stone-700 uppercase">
                      {user.role}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-semibold flex items-center justify-center shadow-inner">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white border border-stone-200 shadow-xl py-2 z-50 text-left">
                      <div className="px-4 py-2.5 border-b border-stone-100">
                        <p className="font-sans text-[9px] text-[#B39D69] font-mono font-bold uppercase">AUTHENTICATED AS</p>
                        <p className="font-sans text-sm font-semibold text-stone-900 truncate">{user.name}</p>
                        <p className="font-sans text-xs text-stone-500 truncate">{user.email}</p>
                      </div>
                      
                      <div className="p-1 space-y-0.5">
                        
                        {/* If Seller, show dashboard control */}
                        {user.role === 'seller' ? (
                          <Link
                            to="/seller"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-stone-400" />
                            <span>Seller Dashboard</span>
                          </Link>
                        ) : (
                          <>
                            {/* Profile options */}
                            <Link
                              to="/customer/profile"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                            >
                              <UserCheck className="w-4 h-4 text-stone-400" />
                              <span>Personal Profile</span>
                            </Link>

                            <Link
                              to="/customer/wishlist"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                            >
                              <Heart className="w-4 h-4 text-stone-400" />
                              <span>Showroom Wishlist</span>
                            </Link>

                            <Link
                              to="/customer/orders"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                            >
                              <History className="w-4 h-4 text-stone-400" />
                              <span>My Orders Ledger</span>
                            </Link>
                          </>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left font-semibold cursor-pointer"
                        >
                          <LogOut className="w-4.5 h-4.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2.5 bg-stone-950 text-white rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-stone-900 active:scale-98 transition-all hover:shadow-lg"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Enter Atelier</span>
                </Link>
              )}
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
}
