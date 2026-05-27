import React, { useState } from 'react';
import { Star, ArrowUpRight, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (id: string) => void;
  onAddToCart: (product: Product, color: string) => void;
  key?: string;
}

export default function ProductCard({ product, onViewDetails, onAddToCart }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedMessage, setAddedMessage] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, product.colors[0].name);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  return (
    <div 
      onClick={() => onViewDetails(product.id)}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer flex flex-col justify-between hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5"
    >
      
      {/* Product Image Panel */}
      <div 
        className="relative aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center p-4 border-b border-gray-50"
        onMouseEnter={() => product.images[1] && setCurrentImageIndex(1)}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        
        {/* Designer floating badge */}
        <span className="absolute top-4 left-4 z-10 text-[9px] font-mono tracking-widest text-gray-500 bg-white/95 border border-gray-100 px-3 py-1.5 rounded-lg uppercase shadow-xs">
          Studio: {product.sellerId.replace('-', ' ')}
        </span>

        {/* Category badge */}
        <span className="absolute top-4 right-4 z-10 text-[9px] font-mono tracking-widest text-[#B39D69] bg-stone-50 border border-stone-200/50 px-2.5 py-1 rounded-md uppercase">
          {product.category}
        </span>

        {/* Dynamic Image Wrapper */}
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="max-h-[92%] max-w-[92%] object-contain transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none drop-shadow-md"
        />

        {/* Elegant overlay panel */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Add overlay button */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10 flex gap-2">
          <button
            onClick={handleQuickAdd}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 ${
              addedMessage 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                : 'bg-black text-white hover:bg-gray-900 active:scale-95'
            }`}
          >
            {addedMessage ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Order</span>
              </>
            ) : (
              <span>Quick Commission</span>
            )}
          </button>
          <div className="p-3 bg-white hover:bg-gray-50 rounded-xl max-w-fit shadow-md border border-gray-200/60 transition-colors flex items-center justify-center">
            <ArrowUpRight className="w-4.5 h-4.5 text-black" />
          </div>
        </div>

      </div>

      {/* Information Panel */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-display font-medium text-base text-gray-900 tracking-tight leading-tight group-hover:text-amber-700 transition-colors">
              {product.name}
            </h3>
            <span className="font-mono text-base font-semibold text-gray-900 shrink-0">
              ${product.price.toLocaleString()}
            </span>
          </div>
          
          <p className="text-xs text-gray-500 font-sans mt-2 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Footer info: Materials indicator + Rating */}
        <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs font-mono">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-500 stroke-[1.5]" />
            <span className="font-bold text-gray-800">{product.rating.toFixed(1)}</span>
            <span className="text-gray-400">({product.reviewCount})</span>
          </div>

          <div className="text-gray-400 truncate max-w-[50%]">
            {product.materials[0]}
          </div>
        </div>

      </div>

    </div>
  );
}
