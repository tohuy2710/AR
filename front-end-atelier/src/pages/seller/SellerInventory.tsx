import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sofa, Tag, ShieldCheck, RefreshCw, Layers, Sliders, Box } from 'lucide-react';

export default function SellerInventory() {
  const { products, updateProduct } = useApp();

  // Price & Inventory states - local mock triggers to write changes immediately
  const handleUpdatePrice = (id: string, newPrice: number) => {
    const p = products.find(item => item.id === id);
    if (p) {
      updateProduct({ ...p, price: newPrice });
      alert(`Success! Standard commission price updated to $${newPrice.toLocaleString()} for ${p.name}`);
    }
  };

  const handleUpdateMockStock = (id: string, dir: 'inc' | 'dec') => {
    // We can simulate reviewCount or custom details parameter to show stock adjustments
    const p = products.find(item => item.id === id);
    if (p) {
      const currentReviewCount = p.reviewCount;
      const nextReviewCount = dir === 'inc' ? currentReviewCount + 1 : Math.max(0, currentReviewCount - 1);
      updateProduct({ ...p, reviewCount: nextReviewCount });
    }
  };

  return (
    <div className="font-sans text-stone-900 text-left space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-light text-stone-950 tracking-tight">Stock & Commission Leveling</h1>
        <p className="text-xs text-stone-400 mt-1">
          Edit pricing values or increment material stock quantities. Updates synchronize immediately.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs">
        {products.length === 0 ? (
          <div className="text-center py-20 text-stone-400 font-mono text-xs">
            No listings present to adjust.
          </div>
        ) : (
          <>
          <div className="md:hidden divide-y divide-stone-100">
            {products.map(p => (
              <article key={p.id} className="p-4 space-y-4">
                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-stone-50 border rounded-xl p-1 flex items-center justify-center shrink-0">
                    <img src={p.images[0]} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-stone-950 font-semibold leading-tight break-words">{p.name}</p>
                    <p className="text-[10px] text-stone-450 font-mono font-normal uppercase mt-1">ID: {p.id}</p>
                    <span className="inline-flex mt-2 bg-stone-100/90 text-stone-700 border border-stone-200/50 px-2.5 py-1 rounded font-mono text-[9px] uppercase">
                      {p.category}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <label className="rounded-xl bg-stone-50 border border-stone-100 p-3">
                    <span className="block text-[9px] font-mono uppercase font-bold text-stone-400 mb-2">
                      Commission Price
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-stone-400 font-semibold">$</span>
                      <input
                        type="number"
                        value={p.price}
                        onChange={(e) => handleUpdatePrice(p.id, Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg font-mono text-stone-900 font-semibold text-xs focus:outline-none focus:border-stone-400"
                      />
                    </div>
                  </label>

                  <div className="rounded-xl bg-stone-50 border border-stone-100 p-3">
                    <p className="text-[9px] font-mono uppercase font-bold text-stone-400 mb-2">
                      Simulated Stock Units
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleUpdateMockStock(p.id, 'dec')}
                        className="w-10 h-10 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg flex items-center justify-center text-stone-600 font-bold"
                      >
                        -
                      </button>
                      <span className="text-center font-mono text-sm font-semibold text-stone-900">
                        {p.reviewCount} units
                      </span>
                      <button
                        onClick={() => handleUpdateMockStock(p.id, 'inc')}
                        className="w-10 h-10 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg flex items-center justify-center text-stone-600 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <span className="text-center text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-2.5 py-2 rounded-lg uppercase font-bold font-mono">
                    VERIFIED GRADE
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs text-left text-stone-500 font-sans min-w-[650px]">
              <thead className="text-[10px] font-mono uppercase text-stone-400 bg-stone-50 border-b border-stone-150">
                <tr>
                  <th scope="col" className="px-6 py-4">Showroom Blueprint</th>
                  <th scope="col" className="px-6 py-4">Department</th>
                  <th scope="col" className="px-6 py-4">Commission Price ($)</th>
                  <th scope="col" className="px-6 py-4">Simulated Stock Units</th>
                  <th scope="col" className="px-6 py-4">Chamber Audits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                    
                    {/* Picture info info */}
                    <td className="px-6 py-4.5 flex items-center gap-4 text-stone-900 font-semibold font-sans">
                      <div className="w-11 h-11 bg-stone-50 border rounded-xl p-1 flex items-center justify-center shrink-0">
                        <img src={p.images[0]} alt="" className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-stone-950 truncate max-w-[200px]">{p.name}</p>
                        <p className="text-[10px] text-stone-450 font-mono font-normal uppercase">ID: {p.id}</p>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4.5">
                      <span className="bg-stone-100/90 text-stone-700 border border-stone-200/50 px-2.5 py-1 rounded font-mono text-[9px] uppercase">
                        {p.category}
                      </span>
                    </td>

                    {/* Price Editor input */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-stone-400 font-semibold">$</span>
                        <input 
                          type="number"
                          value={p.price}
                          onChange={(e) => handleUpdatePrice(p.id, Number(e.target.value))}
                          className="w-24 px-2 py-1 bg-stone-55 border rounded font-mono text-stone-900 font-semibold text-xs focus:outline-none focus:border-stone-400"
                        />
                      </div>
                    </td>

                    {/* Stock adjusters row */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateMockStock(p.id, 'dec')}
                          className="w-7 h-7 bg-stone-100 hover:bg-stone-200 rounded flex items-center justify-center text-stone-600 font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono text-xs font-semibold text-stone-900">
                          {p.reviewCount} units
                        </span>
                        <button
                          onClick={() => handleUpdateMockStock(p.id, 'inc')}
                          className="w-7 h-7 bg-stone-100 hover:bg-stone-200 rounded flex items-center justify-center text-stone-600 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4.5 font-mono text-stone-400">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-2.5 py-1 rounded uppercase font-bold">
                        VERIFIED GRADE
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>

    </div>
  );
}
