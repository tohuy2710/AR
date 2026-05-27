import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, Sliders, ChevronDown, Heart, Star, ShoppingBag, Eye, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Collections' },
  { id: 'living-room', label: 'Living Room' },
  { id: 'dining', label: 'Dining & Cabinetry' },
  { id: 'bedroom', label: 'Bedroom Cozy' },
  { id: 'office', label: 'Workspace / Office' },
  { id: 'lighting', label: 'Architectural Lighting' }
];

export default function ProductListing() {
  const { products, wishlist, toggleWishlist, addToCart } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(6000);
  const [sortBy, setSortBy] = useState('featured');

  // Sync category filter with search query params (if accessing from quick departments)
  useEffect(() => {
    const pCat = searchParams.get('category');
    if (pCat) {
      setSelectedCategory(pCat);
    }
  }, [searchParams]);

  // Derived filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.materials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category
      const matchCategory =
        selectedCategory === 'all' ||
        p.category === selectedCategory ||
        (selectedCategory === 'dining' && p.category === 'dining-room');

      // Price limit
      const matchPrice = p.price <= maxPrice;

      return matchSearch && matchCategory && matchPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, searchQuery, selectedCategory, maxPrice, sortBy]);

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Department Page Header */}
        <div className="text-left mb-8 space-y-2">
          <span className="text-[10px] bg-amber-50 border border-amber-250/60 text-amber-700 font-mono font-bold tracking-widest uppercase px-3 py-1.5 rounded-md">
            Interactive Catalog
          </span>
          <h1 className="text-3xl font-display font-light text-stone-950 tracking-tight">Showroom Collections</h1>
          <p className="text-xs text-stone-500">Examine handcrafted pieces made by local workshops. Click any design to rotate the model and view AR specs.</p>
        </div>

        {/* Filters and List view layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Block Filters Sideboard */}
          <div className="lg:col-span-1 bg-white p-6 border border-stone-200 rounded-2xl space-y-6 text-left h-fit">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <span className="font-mono text-xs font-bold uppercase tracking-wider">Adjustment Console</span>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setMaxPrice(6000);
                  setSortBy('featured');
                }}
                className="text-[10px] text-stone-400 hover:text-stone-950 font-mono uppercase"
              >
                Reset
              </button>
            </div>

            {/* Queries Search */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-stone-500 uppercase">Search Keywords</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                <input 
                  type="text"
                  placeholder="Timber, Oak, Brass..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-400"
                />
              </div>
            </div>

            {/* Department Categories */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-stone-500 uppercase">Artisan Categories</label>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left py-2 px-3 rounded-lg text-xs font-sans transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id 
                        ? 'bg-stone-950 text-white font-medium' 
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Filter */}
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-mono text-stone-500">
                <span className="uppercase">Maximum Pricing</span>
                <span className="font-sans font-bold text-stone-950">${maxPrice.toLocaleString()}</span>
              </div>
              <input 
                type="range"
                min="500"
                max="10000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-stone-150 rounded-lg appearance-none cursor-pointer accent-stone-950"
              />
              <div className="flex justify-between font-mono text-[9px] text-stone-400">
                <span>$500</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Sorting */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#B39D69] uppercase font-bold">Sort Listings</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
              >
                <option value="featured">Featured Showroom</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating Priority</option>
              </select>
            </div>
          </div>

          {/* Right Product Grid Column */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Quick Count Stats */}
            <div className="flex justify-between items-center text-xs font-mono text-stone-500 bg-white p-4 border border-stone-200 rounded-xl">
              <span>Filing results: <b className="text-stone-900">{filteredProducts.length} masterpieces</b> discovered</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-250 px-2 py-0.5 rounded uppercase">ALL SHIPMENTS INSURED</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-dashed rounded-3xl text-stone-400 space-y-3">
                <p className="text-sm">No items match your exact configuration.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setMaxPrice(6000);
                  }}
                  className="px-4 py-2 bg-stone-950 text-white text-[10px] font-mono uppercase tracking-widest rounded-lg"
                >
                  Clear Adjustments
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(p => {
                  const isFav = wishlist.includes(p.id);
                  return (
                    <div 
                      key={p.id}
                      className="bg-white rounded-2xl border border-stone-200/85 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                    >
                      {/* Interactive visual anchor */}
                      <div 
                        onClick={() => navigate(`/customer/products/${p.id}`)}
                        className="relative aspect-square w-full bg-stone-50 p-5 flex items-center justify-center cursor-pointer"
                      >
                        <img 
                          src={p.images[0]} 
                          alt={p.name} 
                          referrerPolicy="no-referrer"
                          className="max-h-[85%] max-w-[85%] object-contain drop-shadow-sm group-hover:scale-105 duration-300 transition-transform pointer-events-none"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                          className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md text-stone-400 hover:text-rose-600 transition-colors cursor-pointer border border-stone-100"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Info Area */}
                      <div className="p-5 text-left space-y-3">
                        <div>
                          <span className="text-[9px] text-[#B39D69] font-mono font-bold uppercase tracking-wider">{p.sellerId.toUpperCase()} studio</span>
                          <h3 
                            onClick={() => navigate(`/customer/products/${p.id}`)}
                            className="font-display font-medium text-sm text-stone-950 truncate hover:text-[#B39D69] transition-colors cursor-pointer"
                          >
                            {p.name}
                          </h3>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-mono text-sm font-semibold text-stone-950">${p.price.toLocaleString()}</span>
                          <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-mono leading-none">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span className="text-stone-950 font-bold font-sans">{p.rating}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                          <button
                            onClick={() => navigate(`/customer/products/${p.id}`)}
                            className="w-full py-2 border border-stone-200 hover:border-stone-950 text-stone-700 hover:text-stone-950 font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all"
                          >
                            Examine 3D
                          </button>
                          <button
                            onClick={() => {
                              addToCart(p, p.colors[0].name, 1);
                              alert(`${p.name} added to coordinate cart!`);
                            }}
                            className="w-full py-2 bg-stone-950 hover:bg-stone-900 text-white font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all"
                          >
                            Add Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
          </div>

        </div>

      </div>
    </div>
  );
}
