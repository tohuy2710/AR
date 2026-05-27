import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Sofa, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, Heart } from 'lucide-react';

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart, wishlist, toggleWishlist } = useApp();
  const navigate = useNavigate();

  // Price calculations
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 5000 ? 0 : 250; // Free delivery threshold
  const totalAmount = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="bg-stone-50 min-h-[80vh] flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="p-6 bg-white border border-stone-200 rounded-3xl space-y-5 max-w-sm">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
            <Sofa className="w-8 h-8 text-stone-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-display font-medium text-stone-950">Your Cart is Pristine</h2>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              You haven't dispatched any bespoke woodwork or custom light installations into your ledger yet.
            </p>
          </div>
          <Link 
            to="/customer/products" 
            className="block w-full py-3 bg-stone-950 hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all"
          >
            Explore Showroom
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-display font-light text-stone-950 tracking-tight">Your Dispatched Cart</h1>
          <p className="text-xs text-stone-500 font-mono mt-1">ORGANISING {cart.length} UNIQUE SPECIFICATIONS</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Block: Items list */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => {
              const isFav = wishlist.includes(item.product.id);
              
              return (
                <div 
                  key={`${item.product.id}-${item.selectedColor}-${idx}`}
                  className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-center sm:items-start text-left relative"
                >
                  {/* Photo representation */}
                  <div className="w-24 sm:w-28 aspect-square bg-stone-50 rounded-xl p-3 flex items-center justify-center shrink-0 border">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      className="max-h-full max-w-full object-contain drop-shadow" 
                    />
                  </div>

                  {/* Body Details */}
                  <div className="flex-1 space-y-3.5 w-full">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] text-[#B39D69] font-mono font-bold uppercase">{item.product.sellerId} studio</span>
                        <h3 className="font-display font-medium text-base text-stone-950 leading-tight">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-stone-400 font-mono mt-1 uppercase">Shade: {item.selectedColor}</p>
                      </div>

                      <span className="font-mono text-base font-semibold text-stone-950">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    {/* Adjusters row */}
                    <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-stone-100">
                      
                      {/* Increment decrement buttons */}
                      <div className="flex items-center bg-stone-50 border border-stone-200 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                          className="w-7 h-7 hover:bg-stone-200/50 rounded flex items-center justify-center text-stone-500"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs font-bold text-stone-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                          className="w-7 h-7 hover:bg-stone-200/50 rounded flex items-center justify-center text-stone-500"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Fast operations list */}
                      <div className="flex items-center gap-4 text-xs font-mono text-stone-400">
                        <button
                          type="button"
                          onClick={() => toggleWishlist(item.product.id)}
                          className="hover:text-rose-600 transition-colors flex items-center gap-1.5"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span>{isFav ? 'Wishlisted' : 'Move to Wish'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                          className="hover:text-stone-950 text-stone-400 font-bold transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-stone-400 hover:text-stone-950" />
                          <span>Remove</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Block: Receipt pricing summary card */}
          <div className="lg:col-span-1 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 text-left shadow-xs">
            
            <h3 className="font-display font-medium text-base text-stone-950">Ledger Summary</h3>
            
            <div className="space-y-3.5 text-xs font-mono border-b border-stone-150 pb-5">
              <div className="flex justify-between text-stone-500">
                <span>Items Subtotal</span>
                <span className="text-stone-950 font-sans">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Secure Freight Commission</span>
                <span className="text-stone-950 font-sans">
                  {deliveryFee === 0 ? 'FREE GIFT' : `$${deliveryFee}`}
                </span>
              </div>
              {subtotal > 5000 && (
                <div className="p-2 bg-emerald-50 text-emerald-700 border border-emerald-200/50 rounded text-[9px] font-mono leading-none">
                  ✔ COMPLIMENTARY ROYALTY SHIPMENT UNLOCKED
                </div>
              )}
            </div>

            {/* Total pricing */}
            <div className="flex justify-between items-center font-mono">
              <span className="text-xs font-bold uppercase text-stone-500">Grand Total</span>
              <span className="text-2xl font-semibold text-stone-950 font-sans">${totalAmount.toLocaleString()}</span>
            </div>

            {/* Proceed */}
            <button
              onClick={() => navigate('/customer/checkout')}
              className="w-full h-12 bg-stone-950 hover:bg-stone-900 text-white rounded-xl font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-md"
            >
              <span>Verify and Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Protection pledge */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 flex items-start gap-3 mt-4 text-[11px] leading-relaxed text-stone-500 font-light">
              <ShieldCheck className="w-6 h-6 text-[#c2ab77] shrink-0" />
              <span>
                <b>Atelier Shield:</b> Every timber purchase comes with official old-growth planting records and structural deflection insurances.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
