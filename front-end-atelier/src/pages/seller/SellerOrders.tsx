import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sofa, ShieldCheck, Mail, Landmark, Compass, Package, ChevronRight, Clock } from 'lucide-react';

export default function SellerOrders() {
  const { orders, updateOrderStatus } = useApp();

  const handleUpdateStatus = (id: string, nextStatus: 'pending' | 'shipped' | 'delivered') => {
    updateOrderStatus(id, nextStatus);
    alert(`Success! Tracking status updated to [${nextStatus.toUpperCase()}] for Order ${id}`);
  };

  return (
    <div className="font-sans text-stone-900 text-left space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-light text-stone-950 tracking-tight">Showroom Order Operations</h1>
        <p className="text-xs text-stone-400 mt-1">
          Review buyer payment SWIFTs, coordinate shipping priorities, or flag packages as shipped.
        </p>
      </div>

      {/* Orders ledger */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed rounded-3xl text-stone-400 font-mono text-xs">
            No incoming client orders detected in sandbox registry.
          </div>
        ) : (
          orders.map((ord) => (
            <div 
              key={ord.id}
              className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs hover:border-stone-300 transition-all text-xs"
            >
              {/* Header info bar */}
              <div className="bg-stone-50 border-b border-stone-150 p-5 sm:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 font-mono">
                <div className="flex flex-wrap gap-5">
                  <div>
                    <span className="text-stone-400">ORDER COMMISSION</span>
                    <p className="font-bold text-stone-950 text-sm mt-0.5">{ord.id}</p>
                  </div>
                  <div className="border-l border-stone-200 pl-5">
                    <span className="text-stone-400">CLIENT</span>
                    <p className="font-bold text-stone-950 mt-0.5">{ord.buyerName}</p>
                  </div>
                  <div className="border-l border-stone-200 pl-5 text-left">
                    <span className="text-stone-400">AUTHORIZED ON</span>
                    <p className="font-bold text-stone-950 mt-0.5">{new Date(ord.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 text-[10px] items-center">
                  <span className="text-stone-400">STATUS:</span>
                  <span className={`px-2.5 py-1 rounded-full font-bold uppercase ${
                    ord.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-250/50' :
                    ord.status === 'shipped' ? 'bg-blue-50 text-blue-700 border border-blue-250/50' :
                    'bg-amber-50 text-amber-700 border border-amber-250/50'
                  }`}>
                    {ord.status}
                  </span>
                </div>
              </div>

              {/* Items grid info */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Columns 1 & 2: Products and delivery */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-[10px] font-mono text-[#B39D69] uppercase font-bold tracking-wider">Item Configurations</h4>
                  
                  <div className="space-y-3">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-stone-50 border rounded-xl p-1 flex items-center justify-center shrink-0">
                          <img src={item.image} alt="" className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="text-left min-w-0">
                          <p className="font-display font-medium text-stone-950 truncate max-w-[200px]">{item.productName}</p>
                          <p className="text-[10px] text-stone-400 font-mono">Shade: {item.selectedColor} • Quantity: {item.quantity}x</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-5 text-stone-500 font-sans">
                    <div>
                      <span className="font-mono text-[9px] text-stone-400 uppercase font-bold">Client Email:</span>
                      <p className="text-stone-800 text-xs mt-0.5 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-stone-400" />
                        {ord.buyerEmail}
                      </p>
                    </div>

                    <div className="border-l border-stone-200 pl-5">
                      <span className="font-mono text-[9px] text-stone-400 uppercase font-bold">Delivery Location:</span>
                      <p className="text-stone-800 text-xs mt-0.5">
                        {ord.deliveryAddress.street}, {ord.deliveryAddress.city}, {ord.deliveryAddress.postalCode}, {ord.deliveryAddress.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 3: Status controls & Action Buttons */}
                <div className="md:col-span-1 bg-stone-50/50 border border-stone-150 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                  <div className="space-y-2 text-left">
                    <span className="text-[10px] font-mono text-stone-400 uppercase">Dispatch Actions</span>
                    <p className="text-stone-600 font-light text-[11px] leading-relaxed">
                      Toggle shipping states. Flagging orders sends tracking codes into the client's historical billing account.
                    </p>
                    <div className="font-mono font-bold text-stone-950 text-sm">
                      Total: ${ord.totalAmount.toLocaleString()}
                    </div>
                  </div>

                  {/* Actions selections */}
                  <div className="space-y-2">
                    {ord.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'shipped')}
                        className="w-full py-2 bg-stone-950 hover:bg-stone-900 text-white font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all"
                      >
                        Set as Shipped
                      </button>
                    )}

                    {ord.status === 'shipped' && (
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'delivered')}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all"
                      >
                        Set as Delivered
                      </button>
                    )}

                    {ord.status === 'delivered' && (
                      <div className="text-center p-2 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>DELIVERED & CLOSED</span>
                      </div>
                    )}

                    {ord.status !== 'delivered' && (
                      <button
                        onClick={() => {
                          const statusList: ('pending' | 'shipped' | 'delivered')[] = ['pending', 'shipped', 'delivered'];
                          const curIndex = statusList.indexOf(ord.status);
                          const next = statusList[curIndex + 1];
                          if (next) handleUpdateStatus(ord.id, next);
                        }}
                        className="w-full py-2 border border-stone-200 hover:border-stone-950 text-stone-700 font-mono text-[9px] uppercase tracking-wider rounded-lg transition-all block text-center bg-white"
                      >
                        Fast Forward Status
                      </button>
                    )}
                  </div>
                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
