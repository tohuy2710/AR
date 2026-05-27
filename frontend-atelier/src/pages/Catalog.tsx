import React, { useState, useMemo } from 'react';
import { Search, Sliders, ChevronDown, RefreshCw, X, Star } from 'lucide-react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface CatalogProps {
  products: Product[];
  onViewDetails: (id: string) => void;
  onAddToCart: (product: Product, color: string) => void;
}

const ALL_CATEGORIES = [
  { id: 'all', label: 'All Collections' },
  { id: 'living-room', label: 'Living Room' },
  { id: 'dining', label: 'Dining & Kitchen' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'office', label: 'Workspace / Cabinet' },
  { id: 'lighting', label: 'Architectural Lighting' }
];

const ALL_MATERIALS = [
  'Solid European Oak',
  'High-texture Italian Bouclé (35% Wool, 65% Cotton)',
  'American Black Walnut Veneer',
  'Honed Carrara Marble',
  'Cast Raw Brass',
  'Recovered Solitary Teak Wood'
];

export default function Catalog({ products, onViewDetails, onAddToCart }: CatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(6000);
  const [sortBy, setSortBy] = useState('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [paginationPage, setPaginationPage] = useState(1);

  // Toggle Materials Filter
  const handleMaterialToggle = (material: string) => {
    setSelectedMaterials(prev => 
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
    setPaginationPage(1);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedMaterials([]);
    setMaxPrice(6000);
    setSortBy('featured');
    setPaginationPage(1);
  };

  // Calculated filtered and sorted items
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Search filter
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.materials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Category filter
        const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;

        // Price filter
        const matchPrice = p.price <= maxPrice;

        // Materials filter
        const matchMaterials = selectedMaterials.length === 0 || 
                               selectedMaterials.some(m => p.materials.some(pm => pm.includes(m) || m.includes(pm)));

        return matchSearch && matchCategory && matchPrice && matchMaterials;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default 'featured'
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, searchQuery, selectedCategory, selectedMaterials, maxPrice, sortBy]);

  // Paginated products (6 per page)
  const itemsPerPage = 6;
  const paginatedProducts = useMemo(() => {
    const startIndex = (paginationPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, paginationPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  return (
    <div className="font-sans text-stone-900 bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Intro */}
        <div className="border-b border-stone-100 pb-8 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2.5">
            <span className="text-[10px] bg-stone-50 border border-stone-250/20 text-stone-500 font-mono font-bold tracking-widest uppercase px-3 py-1.5 rounded-md">Atelier Archives</span>
            <h1 className="text-4xl font-display font-light text-stone-950 tracking-tight leading-none">
              Living Room & <span className="font-normal italic">Architectural Collections</span>
            </h1>
            <p className="text-stone-500 text-sm">
              Discover unique collector pieces built by master workshops. Click any piece to trigger a real 360° technical review.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="font-mono text-xs text-stone-400 bg-stone-50 border border-stone-100 p-3 rounded-lg flex gap-5">
            <div>
              <p className="text-stone-700 font-bold">{filteredProducts.length}</p>
              <p className="text-[9px]">AVAILABLE DESIGNS</p>
            </div>
            <div className="border-l border-stone-200 pl-5">
              <p className="text-stone-700 font-bold">100%</p>
              <p className="text-[9px]">HANDCRAFTED GUARANTEE</p>
            </div>
          </div>
        </div>

        {/* Search, Filter Toggles, and Sort bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 py-4 px-5 bg-stone-50 border border-stone-100 rounded-2xl mb-8 items-center">
          
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-stone-400 stroke-[1.8]" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPaginationPage(1); }}
              placeholder="Search wood, timber, designers..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 hover:border-stone-300 rounded-xl text-xs placeholder-stone-400 focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 p-0.5 text-stone-400 hover:text-stone-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex w-full md:w-auto gap-3.5 justify-end">
            
            {/* Mobile filters toggle */}
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden flex items-center justify-center gap-2 p-3 bg-white border border-stone-200 hover:border-stone-300 rounded-xl text-xs font-mono tracking-wide uppercase transition-all"
            >
              <Sliders className="w-4 h-4 text-stone-500" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center bg-white border border-stone-200 hover:border-stone-300 rounded-xl px-4 py-3 text-xs font-mono">
              <span className="text-stone-400 mr-2">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPaginationPage(1); }}
                className="bg-transparent border-0 p-0 text-stone-800 font-semibold focus:ring-0 focus:outline-none cursor-pointer pr-1"
              >
                <option value="featured">Co-op Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Reset All */}
            {(selectedCategory !== 'all' || selectedMaterials.length > 0 || searchQuery !== '' || maxPrice < 6000) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-3 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-mono font-medium tracking-wide uppercase transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset ({selectedMaterials.length + (selectedCategory !== 'all' ? 1 : 0) + (searchQuery !== '' ? 1 : 0) + (maxPrice < 6000 ? 1 : 0)})</span>
              </button>
            )}

          </div>
        </div>

        {/* Main Grid Layout containing Sidebar and Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Sidebar Filter Panel (Desktop View and Slide-in Mobile) */}
          <aside className={`lg:block ${showFiltersMobile ? 'block' : 'hidden md:hidden'} col-span-1 space-y-8 p-1`}>
            
            {/* 1. Category list with numbers */}
            <div>
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#B39D69] uppercase pb-3 border-b border-stone-100">
                Collections & Roles
              </h3>
              <ul className="mt-4 space-y-2">
                {ALL_CATEGORIES.map(cat => {
                  const count = products.filter(p => cat.id === 'all' || p.category === cat.id).length;
                  return (
                    <li key={cat.id}>
                      <button
                        onClick={() => { setSelectedCategory(cat.id); setPaginationPage(1); }}
                        className={`w-full flex justify-between items-center text-xs py-2 px-3 rounded-lg text-left transition-colors font-sans ${
                          selectedCategory === cat.id 
                            ? 'bg-stone-50 font-bold text-stone-950 border-l-2 border-stone-950' 
                            : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50/55'
                        }`}
                      >
                        <span className="capitalize">{cat.label}</span>
                        <span className="text-[10px] font-mono text-stone-400 bg-white border border-stone-100 px-2 py-0.5 rounded">
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 2. Price Range Slider */}
            <div className="pt-2">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#B39D69] uppercase pb-3 border-b border-stone-100 flex justify-between items-center">
                <span>Maximum Value</span>
                <span className="font-mono text-stone-800 font-bold">${maxPrice.toLocaleString()}</span>
              </h3>
              <div className="mt-5 space-y-4">
                <input 
                  type="range"
                  min="1000"
                  max="6000"
                  step="250"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(Number(e.target.value)); setPaginationPage(1); }}
                  className="w-full h-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-950"
                />
                <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
                  <span>Min: $1,000</span>
                  <span>Max: $6,000+</span>
                </div>
              </div>
            </div>

            {/* 3. Noble Materials checkboxes */}
            <div className="pt-2">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#B39D69] uppercase pb-3 border-b border-stone-100">
                Architectural Materials
              </h3>
              <ul className="mt-4 space-y-3">
                {ALL_MATERIALS.map(mat => {
                  const count = products.filter(p => p.materials.some(pm => pm.includes(mat) || mat.includes(pm))).length;
                  return (
                    <li key={mat} className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedMaterials.includes(mat)}
                          onChange={() => handleMaterialToggle(mat)}
                          className="w-4.5 h-4.5 rounded border-stone-300 text-stone-950 focus:ring-stone-500 checked:bg-stone-950"
                        />
                        <div className="text-xs text-stone-600 font-sans hover:text-stone-900 pr-5 leading-normal">
                          {mat.split(' (')[0]} <span className="text-[10px] text-stone-400">({count})</span>
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Certifications Banner inside sidebar */}
            <div className="p-5 rounded-2xl bg-[#EAE5D9]/40 border border-[#EAE5D9] relative overflow-hidden text-stone-800">
              <h4 className="text-[10px] font-mono font-bold tracking-widest uppercase">Certified Sustainability</h4>
              <p className="text-xs font-light mt-2 leading-relaxed">
                All timber harvested under sovereign registry oversight. We ban clear-cutting entirely.
              </p>
            </div>

          </aside>

          {/* Product Grid Panel */}
          <main className="col-span-1 lg:col-span-3 space-y-10">
            
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-stone-50 rounded-2xl border border-stone-100 px-5">
                <Sliders className="w-10 h-10 text-stone-300 stroke-[1.5]" />
                <h3 className="text-xl font-display font-medium text-stone-900">No matching blueprints found</h3>
                <p className="text-sm text-stone-500 max-w-sm">
                  We could not find any collector pieces fitting your combination of filters. Try raising the maximum price boundary or clearing categories.
                </p>
                <button 
                  onClick={handleResetFilters}
                  className="px-6 py-3 bg-stone-950 text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div>
                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                  {paginatedProducts.map(product => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onViewDetails={onViewDetails}
                      onAddToCart={onAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center pt-10 border-t border-stone-100 mt-12 font-mono text-xs">
                    <button
                      onClick={() => setPaginationPage(prev => Math.max(prev - 1, 1))}
                      disabled={paginationPage === 1}
                      className={`px-5 py-3 rounded-lg border transition-all uppercase tracking-wide font-bold ${
                        paginationPage === 1
                          ? 'border-stone-100 text-stone-300 cursor-not-allowed bg-transparent'
                          : 'border-stone-200 text-stone-800 hover:border-stone-950 hover:bg-stone-50 bg-white'
                      }`}
                    >
                      Previous
                    </button>

                    <span className="text-stone-500">
                      Page <span className="font-bold text-stone-950">{paginationPage}</span> of <span className="font-bold text-stone-950">{totalPages}</span>
                    </span>

                    <button
                      onClick={() => setPaginationPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={paginationPage === totalPages}
                      className={`px-5 py-3 rounded-lg border transition-all uppercase tracking-wide font-bold ${
                        paginationPage === totalPages
                          ? 'border-stone-100 text-stone-300 cursor-not-allowed bg-transparent'
                          : 'border-stone-200 text-stone-800 hover:border-stone-950 hover:bg-stone-50 bg-white'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
