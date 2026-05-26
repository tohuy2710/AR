import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, ArrowLeft, Sofa } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, selectedColor: string, newQty: number) => void;
  onRemoveItem: (productId: string, selectedColor: string) => void;
  onNavigateToCatalog: () => void;
  onProceedToCheckout: () => void;
}

export default function Cart({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onNavigateToCatalog,
  onProceedToCheckout
}: CartProps) {
  
  // Calculate pricing numbers
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  
  // Surcharges: if any item requires White-Glove, let's auto apply a flat handling surcharge
  const handlingSurcharge = subtotal > 0 ? 150 : 0;
  const totalAmount = subtotal + handlingSurcharge;

  return (
    <div className="font-sans text-stone-900 bg-white min-h-[80vh] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="border-b border-stone-100 pb-6.5 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <span className="text-[10px] bg-stone-50 border border-stone-200 text-stone-500 font-mono font-bold tracking-widest uppercase px-3 py-1.5 rounded-md">Procurement Deck</span>
            <h1 className="text-4xl font-display font-light text-stone-950 tracking-tight leading-none">Your Shopping Cart</h1>
            <p className="text-stone-500 text-sm">Review your active structural commissions and finish adjustments before signing the purchase ledger.</p>
          </div>
          
          <button
            onClick={onNavigateToCatalog}
            className="group flex items-center gap-2 text-xs font-mono text-stone-500 hover:text-stone-950 uppercase tracking-widest transition-colors py-1.5"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Continue Selecting</span>
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-5.5 bg-stone-50 border border-stone-100 rounded-3xl p-6">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 border border-stone-200">
              <ShoppingBag className="w-6.5 h-6.5 stroke-[1.5]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-display font-medium text-stone-900">Your basket is clear</h3>
              <p className="text-sm text-stone-400 max-w-xs leading-relaxed font-light">
                No architectural pieces are currently commissioned on this device. Explore our catalogs to initiate your collection.
              </p>
            </div>

            <button
              onClick={onNavigateToCatalog}
              className="px-8 py-4 bg-stone-950 text-white rounded-xl text-xs font-mono font-semibold uppercase tracking-widest hover:bg-stone-850 active:scale-95 transition-all shadow-md"
            >
              Examine Showrooms
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Items Column (8 parts) */}
            <div className="lg:col-span-8 space-y-5">
              {cart.map((item) => (
                <div 
                  key={`${item.product.id}-${item.selectedColor}`}
                  className="p-5.5 bg-[#FAF9F6] border border-stone-200/50 rounded-2xl flex flex-col sm:flex-row gap-5.5 items-center justify-between hover:border-stone-450 transition-colors hover:shadow-xs group"
                >
                  
                  {/* Thumbnail Row */}
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className="w-22 h-22 rounded-xl bg-white border border-stone-250/20 p-2 flex items-center justify-center shrink-0 shadow-inner">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="max-h-[95%] max-w-[95%] object-contain"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono tracking-widest text-[#B39D69] uppercase font-bold">Studio: {item.product.sellerId.toUpperCase()}</span>
                      <h4 className="font-display font-medium text-base text-stone-950 group-hover:text-amber-700 transition-colors pr-4">{item.product.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-stone-400">Finish:</span>
                        <span className="text-xs text-stone-700 font-medium font-sans capitalize">{item.selectedColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action Toggles */}
                  <div className="flex justify-between items-center w-full sm:w-auto gap-8 border-t sm:border-t-0 border-stone-200/50 pt-4 sm:pt-0">
                    
                    {/* Quantity controllers */}
                    <div className="flex items-center bg-white border border-stone-200 rounded-xl overflow-hidden h-11 w-24 shadow-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                        className="w-8 h-full hover:bg-stone-50 flex items-center justify-center font-mono font-bold text-stone-500 text-xs"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-mono text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                        className="w-8 h-full hover:bg-stone-50 flex items-center justify-center font-mono font-bold text-stone-500 text-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Cost */}
                    <div className="text-right w-24">
                      <p className="text-[10px] font-mono text-stone-400">Total</p>
                      <p className="font-mono text-sm font-semibold text-stone-950 mt-0.5">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    {/* Delete Icon */}
                    <button
                      onClick={() => onRemoveItem(item.product.id, item.selectedColor)}
                      className="p-3 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              ))}
            </div>

            {/* Right Invoice Panel (4 parts) */}
            <div className="lg:col-span-4 p-6.5 bg-stone-50 border border-stone-100 rounded-2xl space-y-6">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#B39D69] uppercase pb-3 border-b border-stone-250/30">
                Order Invoice Summary
              </h3>

              <div className="space-y-3.5 text-xs font-mono text-stone-500 py-2">
                <div className="flex justify-between">
                  <span>Showroom Subtotal</span>
                  <span className="text-stone-900 font-bold">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span>Specialist Handling Fee</span>
                    <span className="block text-[9px] text-stone-400 font-sans tracking-normal font-light">White-glove placement delivery</span>
                  </div>
                  <span className="text-stone-900 font-bold">${handlingSurcharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Carbon-Offset Surcharge</span>
                  <span className="text-emerald-600 font-bold">COMPLIMENTARY</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="border-t border-stone-250/30 pt-4.5 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Total Settle Price</p>
                  <p className="font-mono text-2xl font-bold text-stone-950 mt-1">${totalAmount.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 px-2 py-1 rounded text-[9px] text-emerald-800 font-mono font-medium tracking-wide">
                  SECURED SSL
                </div>
              </div>

              {/* Proceed Action Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full h-13 shadow-md hover:shadow-lg bg-stone-950 hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 group transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Accompanying security indicators */}
              <div className="pt-4 border-t border-stone-200/40 space-y-3 text-[10px] font-mono text-stone-400 uppercase">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B39D69] shrink-0" />
                  <span>Verified 256-Bit SSL Encryption Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#B39D69] shrink-0" />
                  <span>Pre-Contact Scheduling before transport dispatch</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
