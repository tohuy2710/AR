import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Sofa, ShieldCheck, CheckCircle2, ChevronRight, Truck, Package, Clock } from 'lucide-react';

export default function OrderHistory() {
  const { orders, user } = useApp();
  const navigate = useNavigate();

  // Filter current authenticated customer's orders
  const myOrders = orders.filter(
    ord => ord.buyerEmail?.toLowerCase() === user?.email?.toLowerCase() || ord.buyerName?.toLowerCase() === user?.name?.toLowerCase()
  );

  if (myOrders.length === 0) {
    return (
      <div className="bg-stone-50 min-h-[80vh] flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="p-6 bg-white border border-stone-200 rounded-3xl space-y-5 max-w-sm">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 text-stone-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-display font-medium text-stone-950">No Orders Registered</h2>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              You haven't authorized any bespoke designer commissions from our workshops yet.
            </p>
          </div>
          <Link 
            to="/customer/products" 
            className="block w-full py-3 bg-stone-950 hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all"
          >
            Sponsor First Design
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Page title */}
        <div className="mb-8 space-y-1">
          <h1 className="text-3xl font-display font-light text-stone-950 tracking-tight">Your Orders Ledger</h1>
          <p className="text-xs text-stone-500">Track and monitor your historical architectural cooperative commissions.</p>
        </div>

        {/* Orders list */}
        <div className="space-y-8">
          {myOrders.map(ord => (
            <div 
              key={ord.id}
              className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all"
            >
              
              {/* Card Title Header banner */}
              <div className="bg-stone-50 border-b border-stone-150 p-5 sm:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs font-mono">
                <div className="flex flex-wrap gap-5">
                  <div>
                    <p className="text-stone-400">COMMISSION ID</p>
                    <p className="font-bold text-stone-950">{ord.id}</p>
                  </div>
                  <div className="border-l border-stone-200 pl-5">
                    <p className="text-stone-400">AUTHORIZED ON</p>
                    <p className="font-bold text-stone-950">{new Date(ord.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="border-l border-stone-200 pl-5">
                    <p className="text-stone-400">TOTAL AMOUNT</p>
                    <p className="font-bold text-stone-950">${ord.totalAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 mr-2 uppercase">Logistics Method:</span>
                  <span className="bg-stone-950 text-white font-bold rounded-md px-2.5 py-1 uppercase text-[10px]">
                    {ord.deliveryMethod}
                  </span>
                </div>
              </div>

              {/* Progress step bar tracker */}
              <div className="p-6 border-b border-stone-100 bg-stone-50/20">
                <div className="max-w-xl mx-auto">
                  <div className="flex justify-between items-center text-xs font-mono relative">
                    
                    {/* Linear progress connectors */}
                    <div className="absolute left-[8%] right-[8%] top-1/2 -translate-y-1/2 h-0.5 bg-stone-200 z-0">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{
                          width:
                            ord.status === 'delivered' ? '100%' :
                            ord.status === 'shipped' ? '50%' : '0%'
                        }}
                      />
                    </div>

                    {/* Step 1: Authorized (always done) */}
                    <div className="flex flex-col items-center gap-2 relative z-10 w-24">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-stone-900 group">AUTHORIZED</span>
                    </div>

                    {/* Step 2: Shipped */}
                    <div className="flex flex-col items-center gap-2 relative z-10 w-24">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        ord.status === 'shipped' || ord.status === 'delivered'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-stone-200 text-stone-400'
                      }`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold ${
                        ord.status === 'shipped' || ord.status === 'delivered' ? 'text-stone-900' : 'text-stone-400'
                      }`}>SHIPPED</span>
                    </div>

                    {/* Step 3: Delivered */}
                    <div className="flex flex-col items-center gap-2 relative z-10 w-24">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-stone-200 text-stone-400'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold ${
                        ord.status === 'delivered' ? 'text-stone-900' : 'text-stone-400'
                      }`}>DELIVERED</span>
                    </div>

                  </div>
                </div>
              </div>

              {/* Items in order block layouts */}
              <div className="p-6 space-y-4">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 bg-stone-50 border rounded-xl p-1 flex items-center justify-center shrink-0">
                        <img src={item.image} alt={item.productName} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-display font-medium text-sm text-stone-950">{item.productName}</h4>
                        <p className="text-[10px] text-stone-400 font-mono uppercase mt-0.5">Shade: {item.selectedColor}</p>
                      </div>
                    </div>

                    <div className="flex font-mono text-xs text-stone-500 gap-8">
                      <div>
                        <p className="text-[9px] text-stone-400">QUANTITY</p>
                        <p className="font-bold text-stone-950">{item.quantity}x</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-stone-400">UNIT PRICE</p>
                        <p className="font-bold text-stone-950">${item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Destination address footer */}
              <div className="bg-stone-50/50 p-5 border-t border-stone-100 flex flex-col sm:flex-row justify-between gap-4 text-xs text-stone-500">
                <div>
                  <span className="font-mono text-[9px] text-stone-400 uppercase font-bold tracking-wider mr-2">SHIPPING ADDRESS:</span>
                  <span className="text-stone-700">
                    {ord.deliveryAddress.street}, {ord.deliveryAddress.city}, {ord.deliveryAddress.postalCode}, {ord.deliveryAddress.country}
                  </span>
                </div>

                <div className="font-mono text-[9px] text-emerald-600 font-bold bg-emerald-50 rounded px-2.5 py-1 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>TRANSMISSION SECURED WITH SHA-256</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
