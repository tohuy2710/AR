import React, { useState, useMemo } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, Ticket, CreditCard, ChevronRight, HelpCircle, Truck, Package, Calendar } from 'lucide-react';
import { CartItem, Product, Order } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  onCompleteCheckout: (orderData: Partial<Order>) => string; // Returns new order ID
  onNavigateToCatalog: () => void;
}

export default function Checkout({ cart, onCompleteCheckout, onNavigateToCatalog }: CheckoutProps) {
  const [shippingName, setShippingName] = useState('');
  const [shippingEmail, setShippingEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [country, setCountry] = useState('United States');
  
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'white-glove'>('standard');
  
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // Subtotal details
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  const deliveryCost = useMemo(() => {
    if (deliveryMethod === 'express') return 120;
    if (deliveryMethod === 'white-glove') return 250;
    return 0; // standard is free
  }, [deliveryMethod]);

  const totalAmount = subtotal + deliveryCost;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shippingName || !shippingEmail || !street || !city || !postal || !cardHolder || !cardNumber) {
      alert('Please fill out all required fields.');
      return;
    }

    // Capture standard payload format
    const newOrderData: Partial<Order> = {
      buyerName: shippingName,
      buyerEmail: shippingEmail,
      deliveryAddress: {
        street,
        city,
        postalCode: postal,
        country
      },
      deliveryMethod,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        image: item.product.images[0]
      })),
      totalAmount,
      status: 'pending' as const
    };

    const orderId = onCompleteCheckout(newOrderData);
    setCreatedOrderId(orderId);
  };

  // If purchase completed, show glorious success board
  if (createdOrderId) {
    return (
      <div className="font-sans text-stone-900 bg-white py-16">
        <div className="max-w-xl mx-auto px-4 text-center space-y-7">
          
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
          </div>

          <div className="space-y-2.5">
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold tracking-widest uppercase px-3 py-1.5 rounded-md">Commission Ledger Signed</span>
            <h1 className="text-3xl font-display font-medium tracking-tight">Your Order is Confirmed</h1>
            <p className="text-stone-500 font-light text-sm max-w-sm mx-auto">
              We have generated your signature code. The collaborating workshop has allocated the raw timber blocks for your commission.
            </p>
          </div>

          {/* Core Info Slip */}
          <div className="p-6 bg-[#FAF9F6] border border-stone-200/50 rounded-2xl text-left space-y-4">
            <div className="flex justify-between text-xs font-mono border-b border-stone-200/50 pb-3">
              <span className="text-stone-400">SIGNATURE ID:</span>
              <span className="font-bold text-stone-850">{createdOrderId}</span>
            </div>
            
            <div className="text-xs font-mono text-stone-500 space-y-2.5">
              <div className="flex justify-between">
                <span>Account Client:</span>
                <span className="text-stone-800 font-medium">{shippingName}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Hub:</span>
                <span className="text-stone-800 font-medium truncate max-w-[200px]">{street}, {city}</span>
              </div>
              <div className="flex justify-between">
                <span>Method Secured:</span>
                <span className="text-stone-800 font-medium capitalize">{deliveryMethod} Transport</span>
              </div>
              <div className="flex justify-between border-t border-stone-200/30 pt-3 text-sm">
                <span className="text-stone-900 font-bold">Total Settled:</span>
                <span className="text-stone-950 font-extrabold">${totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Horizontal tracking milestones */}
          <div className="space-y-4 pt-4 text-left">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Order Progression Pipeline</h4>
            
            <div className="relative flex justify-between items-start text-[10px] font-mono mt-6">
              <div className="absolute top-2.5 left-0 right-0 h-0.5 bg-stone-200 z-0"></div>
              <div className="absolute top-2.5 left-0 w-[15%] h-0.5 bg-stone-950 z-0"></div>
              
              <div className="flex flex-col items-center text-center relative z-10 w-20">
                <div className="w-5.5 h-5.5 rounded-full bg-stone-950 text-white flex items-center justify-center font-bold text-[9px] border-4 border-white shadow-xs">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <span className="text-stone-900 font-bold mt-2 font-display">Allocated</span>
                <span className="text-[8px] text-stone-400 mt-0.5">Today</span>
              </div>

              <div className="flex flex-col items-center text-center relative z-10 w-20">
                <div className="w-5.5 h-5.5 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold text-[9px] border-4 border-white shadow-xs">
                  2
                </div>
                <span className="text-stone-500 mt-2">Seasoning</span>
                <span className="text-[8px] text-stone-400 mt-0.5">Est. 3 Days</span>
              </div>

              <div className="flex flex-col items-center text-center relative z-10 w-20">
                <div className="w-5.5 h-5.5 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold text-[9px] border-4 border-white shadow-xs">
                  3
                </div>
                <span className="text-stone-500 mt-2">Shaped & Oil</span>
                <span className="text-[8px] text-stone-400 mt-0.5">Est. 7 Days</span>
              </div>

              <div className="flex flex-col items-center text-center relative z-10 w-20">
                <div className="w-5.5 h-5.5 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold text-[9px] border-4 border-white shadow-xs">
                  4
                </div>
                <span className="text-stone-500 mt-2">Dispatched</span>
                <span className="text-[8px] text-stone-400 mt-0.5">Est. 12 Days</span>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToCatalog}
            className="w-full py-4.5 bg-stone-950 hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer"
          >
            Review Other blueprints
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="font-sans text-stone-900 bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="border-b border-stone-100 pb-6 ml-1 mb-10">
          <span className="text-[10px] bg-stone-50 border border-stone-200 text-stone-500 font-mono font-bold tracking-widest uppercase px-3 py-1.5 rounded-md">Pipeline</span>
          <h1 className="text-3xl font-display font-light text-stone-950 tracking-tight mt-2.5">Checkout Pipeline</h1>
        </div>

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Form: Shipping Details (7 parts) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Part 1: Client Metadata */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#B39D69] uppercase pb-2 border-b border-stone-100">
                1. Client Contact Records
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-stone-500 uppercase">Legal Full Name</label>
                  <input
                    required
                    type="text"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="E.g., Alexander Mercer"
                    className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-stone-500 uppercase">Secure Email Dispatch</label>
                  <input
                    required
                    type="email"
                    value={shippingEmail}
                    onChange={(e) => setShippingEmail(e.target.value)}
                    placeholder="E.g., alex@mercerstudio.co"
                    className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Part 2: Address */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#B39D69] uppercase pb-2 border-b border-stone-100">
                2. Siting & Shipping Destination
              </h3>

              <div className="space-y-4 text-xs font-sans">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-stone-500 uppercase">Street Address / Floor / Suite</label>
                  <input
                    required
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="E.g., 142 Mercer Street, Penthouse B"
                    className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-3 gap-5">
                  <div className="col-span-1 space-y-2">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">City</label>
                    <input
                      required
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="E.g., New York"
                      className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div className="col-span-1 space-y-2">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Postal Code</label>
                    <input
                      required
                      type="text"
                      value={postal}
                      onChange={(e) => setPostal(e.target.value)}
                      placeholder="E.g., 10012"
                      className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div className="col-span-1 space-y-2">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800"
                    >
                      <option>United States</option>
                      <option>Germany</option>
                      <option>Italy</option>
                      <option>Denmark</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Part 3: Transport Method */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#B39D69] uppercase pb-2 border-b border-stone-100">
                3. Transport & Deflection Surcharges
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                <label className={`p-4.5 border rounded-2xl cursor-pointer flex flex-col justify-between h-36 select-none transition-all ${
                  deliveryMethod === 'standard' 
                    ? 'border-stone-950 bg-stone-50 shadow-sm' 
                    : 'border-stone-200 bg-white hover:border-stone-400'
                }`}>
                  <input 
                    type="radio" 
                    name="delivery" 
                    checked={deliveryMethod === 'standard'}
                    onChange={() => setDeliveryMethod('standard')}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-center">
                    <Truck className="w-5 h-5 text-stone-700" />
                    <span className="text-[11px] font-mono text-emerald-600 font-bold uppercase">FREE</span>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-bold text-stone-850">Standard Freight</p>
                    <p className="text-[10px] text-stone-400 mt-1 font-light leading-snug">Kerbside drop within 10-14 days.</p>
                  </div>
                </label>

                <label className={`p-4.5 border rounded-2xl cursor-pointer flex flex-col justify-between h-36 select-none transition-all ${
                  deliveryMethod === 'express' 
                    ? 'border-stone-950 bg-stone-50 shadow-sm' 
                    : 'border-stone-200 bg-white hover:border-stone-400'
                }`}>
                  <input 
                    type="radio" 
                    name="delivery" 
                    checked={deliveryMethod === 'express'}
                    onChange={() => setDeliveryMethod('express')}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-center">
                    <Package className="w-5 h-5 text-stone-700" />
                    <span className="text-[11px] font-mono text-stone-800 font-bold uppercase">+$120</span>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-bold text-stone-850">Accredited Express</p>
                    <p className="text-[10px] text-stone-400 mt-1 font-light leading-snug">Sovereign express dispatch inside 5-7 days.</p>
                  </div>
                </label>

                <label className={`p-4.5 border rounded-2xl cursor-pointer flex flex-col justify-between h-36 select-none transition-all ${
                  deliveryMethod === 'white-glove' 
                    ? 'border-stone-950 bg-stone-50 shadow-sm' 
                    : 'border-stone-200 bg-white hover:border-stone-400'
                }`}>
                  <input 
                    type="radio" 
                    name="delivery" 
                    checked={deliveryMethod === 'white-glove'}
                    onChange={() => setDeliveryMethod('white-glove')}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-center">
                    <Calendar className="w-5 h-5 text-stone-700" />
                    <span className="text-[11px] font-mono text-stone-800 font-bold uppercase">+$250</span>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-bold text-stone-850">White-Glove Placement</p>
                    <p className="text-[10px] text-stone-400 mt-1 font-light leading-snug">Room placement, unpacking, full assembly.</p>
                  </div>
                </label>

              </div>
            </div>

            {/* Part 4: Secure payment slips */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#B39D69] uppercase pb-2 border-b border-stone-100">
                4. Sovereign Ledger Ledger settlement
              </h3>

              <div className="bg-stone-50 border border-stone-200/50 p-6 rounded-2xl space-y-5">
                
                <div className="flex justify-between items-center pb-2 border-b border-stone-200/40">
                  <div className="flex items-center gap-2.5 text-xs font-mono">
                    <CreditCard className="w-4.5 h-4.5 text-stone-700" />
                    <span className="font-bold text-stone-850">CREDIT CARD TRANSFERS</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-400 font-mono text-[9px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>ENCRYPTED SECURE TUNNEL</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Card Holder Name</label>
                    <input
                      required
                      type="text"
                      className="w-full p-3.5 bg-white border border-stone-200 rounded-xl"
                      placeholder="E.g., Alexander Mercer"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Card Account Number</label>
                    <input
                      required
                      type="text"
                      className="w-full p-3.5 bg-white border border-stone-200 rounded-xl font-mono tracking-widest"
                      placeholder="•••• •••• •••• 5342"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Expiry Coordinates</label>
                    <input
                      required
                      type="text"
                      className="w-full p-3.5 bg-white border border-stone-200 rounded-xl font-mono text-center"
                      placeholder="MM / YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">CVV Security Code</label>
                    <input
                      required
                      type="password"
                      maxLength={4}
                      className="w-full p-3.5 bg-white border border-stone-200 rounded-xl font-mono text-center"
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Summary Invoice Panel (5 parts) */}
          <div className="lg:col-span-5 p-7 bg-stone-50 border border-stone-100 rounded-2xl space-y-6">
            <h3 className="text-xs font-mono font-bold tracking-widest text-[#B39D69] uppercase pb-3 border-b border-stone-200/40">
              Purchases Breakdown
            </h3>

            {/* List mini cart items */}
            <div className="space-y-4 max-h-[40vh] overflow-y-auto no-scrollbar py-1">
              {cart.map((item) => (
                <div 
                  key={`${item.product.id}-${item.selectedColor}`}
                  className="flex items-center gap-4 justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-13 h-13 rounded-lg overflow-hidden bg-white border border-stone-200 p-1 flex items-center justify-center shrink-0">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-stone-900 leading-tight">{item.product.name}</p>
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5 capitalize">Finish: {item.selectedColor}</p>
                      <p className="text-[9px] font-mono font-bold text-[#B39D69] mt-0.5">QTY: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-stone-850">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-3 border-t border-stone-200/40 text-xs font-mono text-stone-500">
              <div className="flex justify-between">
                <span>Shop Subtotal</span>
                <span className="font-bold text-stone-800">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Selected Transport ({deliveryMethod})</span>
                <span className="font-bold text-stone-800">${deliveryCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-stone-250/40 pt-4.5 flex justify-between items-center text-sm font-mono">
              <div>
                <p className="text-[9px] font-mono text-stone-400 uppercase">Sovereign Grand Sum</p>
                <p className="text-2xl font-bold text-stone-950 mt-1">${totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white/80 border border-stone-200 px-2 py-1 rounded text-[10px] font-bold text-stone-700 shadow-xs">
                USD REGISTER
              </div>
            </div>

            {/* Execute Button */}
            <button
              type="submit"
              className="w-full h-14 bg-[#c2ab77] hover:bg-[#aa935c] text-white text-xs font-mono font-semibold tracking-widest uppercase rounded-xl transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Authorize & Sign Commission Ledger</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Extra assurance bullet */}
            <p className="text-[9px] text-stone-400 font-mono leading-normal text-center bg-white/50 border border-stone-150 p-2.5 rounded-lg uppercase">
              By authorizing, you agree that timber blocks are assigned immediately. Cancelations inside 24 hours incur no fee.
            </p>

          </div>

        </form>

      </div>
    </div>
  );
}
