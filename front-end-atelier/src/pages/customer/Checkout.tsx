import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Sofa, ShieldCheck, HelpCircle, Landmark, CreditCard, ChevronLeft } from 'lucide-react';
import { Order } from '../../types';

export default function Checkout() {
  const { cart, user, addOrder, clearCart } = useApp();
  const navigate = useNavigate();

  // Redirect to products if checkout is opened with an empty cart
  if (cart.length === 0) {
    navigate('/customer/products');
  }

  // State
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'white-glove'>('standard');
  const [paymentType, setPaymentType] = useState<'card' | 'wire'>('card');

  // Input validation state
  const [isFinishing, setIsFinishing] = useState(false);

  // Calculations
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  
  const getDeliveryCost = () => {
    if (deliveryMethod === 'white-glove') return 250;
    if (deliveryMethod === 'express') return 120;
    return subtotal > 5000 ? 0 : 80; // Free standard shipping above $5000
  };

  const deliveryCost = getDeliveryCost();
  const grandTotal = subtotal + deliveryCost;

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !postalCode) {
      alert('Please fill out all address parameters.');
      return;
    }

    setIsFinishing(true);

    const generatedOrder: Order = {
      id: `ATL-${Math.floor(1000 + Math.random() * 9000)}`,
      buyerName: user?.name || 'Explorer Guest',
      buyerEmail: user?.email || 'guest@domain.co',
      deliveryAddress: { street, city, postalCode, country },
      deliveryMethod,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        image: item.product.images[0]
      })),
      totalAmount: grandTotal,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      addOrder(generatedOrder);
      clearCart();
      setIsFinishing(false);
      alert(`Success! Order ${generatedOrder.id} authorized. Directing to your logs.`);
      navigate('/customer/orders');
    }, 1200);
  };

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back */}
        <button 
          onClick={() => navigate('/customer/cart')}
          className="inline-flex items-center gap-2 text-xs font-mono text-stone-500 hover:text-stone-950 mb-8 uppercase cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Cart Ledger</span>
        </button>

        {/* Master layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          {/* Left Block form (3/5 cols) */}
          <form onSubmit={handlePlaceOrderSubmit} className="lg:col-span-3 bg-white p-8 sm:p-10 border border-stone-200 rounded-3xl space-y-8 text-left">
            <div>
              <h1 className="text-2xl font-display font-light text-stone-950 tracking-tight">Authorize Order Commissions</h1>
              <p className="text-xs text-stone-400 mt-1">Provide your delivery location coordinates to log physical shipping insurance.</p>
            </div>

            {/* Delivery Form */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono text-[#B39D69] uppercase font-bold tracking-wider">Showroom Shipping Destination</h3>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-stone-500 uppercase">Street Address</label>
                <input 
                  required
                  type="text" 
                  placeholder="E.g., 205 Milanese Arch Dr, Room 2B"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-stone-500 uppercase">City</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Milan / New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-950"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-stone-500 uppercase">Postal/ZIP Code</label>
                  <input 
                    required
                    type="text" 
                    placeholder="10012 / 20121"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-950"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-stone-500 uppercase">Country</label>
                <select 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-950"
                >
                  <option value="United States">United States</option>
                  <option value="Italy">Italy</option>
                  <option value="Germany">Germany</option>
                  <option value="Denmark">Denmark</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>

            {/* Logistics Type select */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h3 className="text-xs font-mono text-[#B39D69] uppercase font-bold tracking-wider text-left">Freight Logistics Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                
                {/* Standard option */}
                <div 
                  onClick={() => setDeliveryMethod('standard')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === 'standard'
                      ? 'border-stone-950 bg-stone-950/5'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <p className="font-mono text-[10px] font-bold text-stone-800">STANDARD FREIGHT</p>
                  <p className="text-xs font-bold text-stone-950 mt-1">
                    {subtotal > 5000 ? 'FREE' : '$80'}
                  </p>
                  <p className="text-[10px] text-stone-500 mt-1 font-light">Roadside delivery. Leaves workshop in 7-10 days.</p>
                </div>

                {/* Express option */}
                <div 
                  onClick={() => setDeliveryMethod('express')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === 'express'
                      ? 'border-stone-950 bg-stone-950/5'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <p className="font-mono text-[10px] font-bold text-stone-800">EXPRESS AIRLINE</p>
                  <p className="text-xs font-bold text-stone-950 mt-1">$120</p>
                  <p className="text-[10px] text-stone-500 mt-1 font-light">Insured priority freight. Ships inside 3 days.</p>
                </div>

                {/* White Glove option */}
                <div 
                  onClick={() => setDeliveryMethod('white-glove')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === 'white-glove'
                      ? 'border-stone-950 bg-[#c2ab77]/10'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <p className="font-mono text-[10px] font-bold text-stone-800">⭐ WHITE-GLOVE</p>
                  <p className="text-xs font-bold text-stone-950 mt-1">$250</p>
                  <p className="text-[10px] text-stone-500 mt-1 font-light">Includes home assembly, tuning alignment, & box removal.</p>
                </div>

              </div>
            </div>

            {/* Payment type mock */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h3 className="text-xs font-mono text-[#B39D69] uppercase font-bold tracking-wider text-left">Payment Channel</h3>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentType('card')}
                  className={`p-4 border rounded-xl cursor-pointer flex gap-3.5 items-center ${
                    paymentType === 'card' ? 'border-stone-950 bg-stone-950/5 font-semibold' : 'border-stone-200 text-stone-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-stone-600" />
                  <div className="text-left">
                    <p className="text-xs text-stone-900">Online Credit Card</p>
                    <p className="text-[10px] text-stone-400 font-mono">VISA, MASTERCARD, AMEX</p>
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentType('wire')}
                  className={`p-4 border rounded-xl cursor-pointer flex gap-3.5 items-center ${
                    paymentType === 'wire' ? 'border-stone-950 bg-stone-950/5 font-semibold' : 'border-stone-200 text-stone-600'
                  }`}
                >
                  <Landmark className="w-5 h-5 text-stone-600" />
                  <div className="text-left">
                    <p className="text-xs text-stone-900">Showroom Wire</p>
                    <p className="text-[10px] text-stone-400 font-mono">SWIFT SECURE ESCROW</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isFinishing}
              className={`w-full py-4 text-white rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                isFinishing ? 'bg-stone-500 cursor-not-allowed' : 'bg-stone-950 hover:bg-stone-900'
              }`}
            >
              <span>{isFinishing ? 'Transmitting credentials...' : 'Confirm Ledger Order'}</span>
              <ShieldCheck className="w-4 h-4" />
            </button>

          </form>

          {/* Right Block Item breakdown list (2/5 cols) */}
          <div className="lg:col-span-2 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 text-left shadow-xs">
            <h3 className="font-display font-medium text-base text-stone-950">Draft Specs Invoice</h3>
            
            {/* Miniature items summary */}
            <div className="space-y-3.5 border-b border-stone-100 pb-5">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="w-11 h-11 bg-stone-50 border rounded p-1 flex items-center justify-center shrink-0">
                    <img src={item.product.images[0]} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-900 truncate">{item.product.name}</p>
                    <p className="text-[10px] text-stone-400 font-mono truncate">{item.quantity}x • {item.selectedColor}</p>
                  </div>
                  <span className="font-mono text-xs text-stone-950">${(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Calculations summaries */}
            <div className="space-y-3 font-mono text-xs text-stone-500 border-b border-stone-100 pb-5">
              <div className="flex justify-between">
                <span>Items total</span>
                <span className="text-stone-950 font-sans">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping weight commission</span>
                <span className="text-stone-950 font-sans">
                  {deliveryCost === 0 ? 'FREE GIFT' : `$${deliveryCost}`}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center font-mono">
              <span className="text-xs font-bold text-stone-400 uppercase">Grand Sum Total</span>
              <span className="text-2xl font-semibold text-stone-950 font-sans">${grandTotal.toLocaleString()}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
