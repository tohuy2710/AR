import { useState } from 'react';
import { ShoppingBag, Star, User, Sliders, Play, LogOut, PackageOpen, LayoutDashboard, PlusCircle, Sofa } from 'lucide-react';
import { CartItem, User as UserType } from '../types';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  cart: CartItem[];
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

export default function Navbar({ currentPage, setCurrentPage, cart, user, setUser }: NavbarProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setProfileDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 border-b border-gray-100/60 blur-backdrop transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setCurrentPage('home')}
          >
            <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
              <Sofa className="w-5.5 h-5.5 stroke-[1.5]" />
            </div>
            <div>
              <span className="font-display font-medium text-xl tracking-widest text-black">ATELIER</span>
              <span className="block text-[8px] tracking-[0.3em] uppercase text-gray-400 font-mono font-medium leading-none mt-0.5">Architectural Lab</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-8 lg:gap-11">
            <button
              onClick={() => setCurrentPage('home')}
              className={`font-sans text-sm font-medium tracking-wide transition-colors relative py-1.5 ${
                currentPage === 'home' ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Home
              {currentPage === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
              )}
            </button>
            <button
              onClick={() => setCurrentPage('catalog')}
              className={`font-sans text-sm font-medium tracking-wide transition-colors relative py-1.5 ${
                currentPage === 'catalog' || currentPage === 'detail' ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              The Collections
              {(currentPage === 'catalog' || currentPage === 'detail') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
              )}
            </button>

            {/* Seller Studio options visible to all for demonstration, or only if logged in as Seller */}
            <div className="relative group">
              <button
                onClick={() => {
                  if (user?.role === 'seller') {
                    setCurrentPage('seller-overview');
                  } else {
                    // Pre-login as seller for demonstration to make it highly friendly
                    setUser({ id: 'seller-demo', name: 'Alexander Mercer', email: 'alex@mercer.com', role: 'seller' });
                    setCurrentPage('seller-overview');
                  }
                }}
                className={`font-sans text-sm font-medium tracking-wide transition-colors relative py-1.5 flex items-center gap-1.5 ${
                  currentPage.startsWith('seller-') ? 'text-black' : 'text-gray-500 hover:text-black'
                }`}
              >
                <span>Seller Studio</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/50 font-mono uppercase scale-90">STUDIO</span>
                {currentPage.startsWith('seller-') && (
                  <span className="absolute bottom-0 left-0 right-14 h-0.5 bg-black rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            
            {/* Direct Status indicator for premium UX */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-400 font-mono px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>EST. SHOWROOMS CHICAGO & MILAN</span>
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setCurrentPage('cart')}
              className={`p-2.5 rounded-full hover:bg-gray-50 text-black border transition-all relative ${
                currentPage === 'cart' ? 'bg-gray-50 border-black' : 'border-transparent'
              }`}
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] items-center justify-center font-display font-bold w-5.5 h-5.5 rounded-full flex border-2 border-white shadow-sm scale-110">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Toggle */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 pr-2.5 rounded-full border border-gray-200/80 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer bg-white"
                  >
                    <span className="font-sans text-[11px] font-medium tracking-wide text-gray-700 uppercase">
                      {user.role}
                    </span>
                    <div className="w-7 a h-7 rounded-full bg-black text-white text-xs font-semibold flex items-center justify-center shadow-inner">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white border border-gray-100/80 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2.5 border-b border-gray-50">
                        <p className="font-sans text-xs text-gray-400 font-mono uppercase">AUTHENTICATED AS</p>
                        <p className="font-sans text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="font-sans text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      <div className="p-1">
                        <button
                          onClick={() => {
                            setCurrentPage(user.role === 'seller' ? 'seller-overview' : 'catalog');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          {user.role === 'seller' ? (
                            <LayoutDashboard className="w-4.5 h-4.5 text-gray-400 stroke-[1.8]" />
                          ) : (
                            <PlusCircle className="w-4.5 h-4.5 text-gray-400 stroke-[1.8]" />
                          )}
                          <span>{user.role === 'seller' ? 'Seller Workspace' : 'Browse Atelier'}</span>
                        </button>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
                        >
                          <LogOut className="w-4.5 h-4.5 stroke-[1.8]" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setCurrentPage('auth')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg text-xs font-medium tracking-widest uppercase hover:bg-gray-900 active:scale-98 transition-all hover:shadow-lg"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Enter Atelier</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
}
