import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Heart, Star, ShoppingBag, Eye, Trash2, Milestone } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, products, toggleWishlist, addToCart } = useApp();
  const navigate = useNavigate();

  // Filter products in wishlist
  const myWishlistItems = products.filter(p => wishlist.includes(p.id));

  if (myWishlistItems.length === 0) {
    return (
      <div className="bg-stone-50 min-h-[80vh] flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="p-6 bg-white border border-stone-200 rounded-3xl space-y-5 max-w-sm">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-stone-300" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-display font-medium text-stone-950">Your Wishlist is Empty</h2>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              You haven't highlighted any boutique creations to track in your personal showroom.
            </p>
          </div>
          <Link 
            to="/customer/products" 
            className="block w-full py-3 bg-stone-950 hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all"
          >
            Sift Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-left mb-8 space-y-1">
          <h1 className="text-3xl font-display font-light text-stone-950 tracking-tight">Your Showroom Wishlist</h1>
          <p className="text-xs text-stone-500">Curate and monitor your selected intergenerational architectural monuments.</p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {myWishlistItems.map(p => (
            <div 
              key={p.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div 
                onClick={() => navigate(`/customer/products/${p.id}`)}
                className="relative aspect-square w-full bg-stone-50 p-6 flex items-center justify-center cursor-pointer border-b border-stone-100"
              >
                <img 
                  src={p.images[0]} 
                  alt={p.name} 
                  className="max-h-[90%] max-w-[90%] object-contain drop-shadow transition-transform duration-300 group-hover:scale-105" 
                />

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                  className="absolute bottom-4 right-4 p-2 bg-rose-50 rounded-full text-rose-600 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer shadow-sm"
                  title="Remove from wishlist"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </button>
              </div>

              {/* Specs and Details */}
              <div className="p-6 text-left space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-display font-medium text-base text-stone-900 truncate flex-1 leading-tight">
                      {p.name}
                    </h3>
                    <span className="font-mono text-base font-semibold text-stone-900 leading-none">
                      ${p.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-stone-500 text-xs leading-relaxed font-light line-clamp-2">
                    {p.shortDescription}
                  </p>
                </div>

                {/* Bottom interactive keys */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-stone-100">
                  <button
                    onClick={() => navigate(`/customer/products/${p.id}`)}
                    className="w-full py-2.5 border border-stone-200 hover:border-stone-950 text-stone-700 hover:text-stone-950 font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    Launch 3D specs
                  </button>
                  <button
                    onClick={() => {
                      addToCart(p, p.colors[0].name, 1);
                      alert(`${p.name} dispatched to cart!`);
                    }}
                    className="w-full py-2.5 bg-stone-950 hover:bg-stone-900 text-white font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    Quick Cart
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
