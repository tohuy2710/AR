import React, { useState, useMemo, useEffect } from 'react';
import { Star, Shield, ArrowLeft, ShoppingBag, Check, Award, Truck, ThumbsUp, Sparkles, AlertCircle } from 'lucide-react';
import { Product, Review, CartItem } from '../types';
import Viewer3D from '../components/Viewer3D';
import BentoSpecs from '../components/BentoSpecs';

interface ProductDetailProps {
  productId: string;
  products: Product[];
  reviewsMap: Record<string, Review[]>;
  onAddToCart: (product: Product, color: string, quantity: number) => void;
  onNavigateBack: () => void;
  onNavigateToCatalog: () => void;
  onViewProduct: (id: string) => void;
}

export default function ProductDetail({
  productId,
  products,
  reviewsMap,
  onAddToCart,
  onNavigateBack,
  onNavigateToCatalog,
  onViewProduct
}: ProductDetailProps) {
  
  // Find current product
  const product = useMemo(() => {
    return products.find(p => p.id === productId) || products[0];
  }, [products, productId]);

  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [successBanner, setSuccessBanner] = useState(false);
  const [userReviewText, setUserReviewText] = useState('');
  const [userReviewRating, setUserReviewRating] = useState(5);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  // Update selected color when product changes
  useEffect(() => {
    setSelectedColor(product.colors[0].name);
    setQuantity(1);
    setSuccessBanner(false);
    setUserReviewText('');
    setLocalReviews([]);
  }, [product]);

  // Combine default mockup reviews with local additions
  const reviews = useMemo(() => {
    const staticReviews = reviewsMap[product.id] || [];
    return [...localReviews, ...staticReviews];
  }, [reviewsMap, product.id, localReviews]);

  // Calculate average rating dynamically
  const computedRating = useMemo(() => {
    if (reviews.length === 0) return product.rating;
    const sum = reviews.reduce((total, rev) => total + rev.rating, 0);
    return sum / reviews.length;
  }, [reviews, product.rating]);

  // Related products (from same category, excluding current product)
  const relatedProducts = useMemo(() => {
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
  }, [products, product]);

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedColor, quantity);
    setSuccessBanner(true);
    setTimeout(() => {
      setSuccessBanner(false);
    }, 4000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userReviewText.trim()) return;

    const newRev: Review = {
      id: `rev-local-${Date.now()}`,
      userName: 'Collector Patron',
      userAvatar: 'CP',
      rating: userReviewRating,
      date: 'Today',
      comment: userReviewText
    };

    setLocalReviews(prev => [newRev, ...prev]);
    setUserReviewText('');
    alert('Thank you. Your evaluation code has been logged to our ethical register.');
  };

  return (
    <div className="font-sans text-stone-900 bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb back controls */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onNavigateBack}
            className="group flex items-center gap-2 text-xs font-mono text-stone-500 hover:text-stone-950 uppercase tracking-wider py-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Collection</span>
          </button>

          <span className="text-[10px] text-stone-400 font-mono tracking-widest uppercase">
            Product Registry Code: {product.id.toUpperCase()}-2026
          </span>
        </div>

        {/* Success confirmation banner overlay */}
        {successBanner && (
          <div className="bg-emerald-50 border border-emerald-250 p-4.5 rounded-2xl mb-8 flex justify-between items-center text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-mono uppercase font-bold tracking-wider">Commission Logged Successfully</p>
                <p className="text-xs font-light mt-0.5">Added {quantity}x {product.name} ({selectedColor}) to your custom cart order.</p>
              </div>
            </div>
            <button 
              onClick={() => setSuccessBanner(false)}
              className="text-xs font-mono font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Primary Row: Left 3D Viewer Image | Right Ordering Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: 100% interactive 360 Spin View */}
          <div className="space-y-6">
            <Viewer3D 
              images={product.images}
              threeSixtyImages={product.threeSixtyImages}
              productName={product.name}
            />

            {/* Static layout text highlights */}
            <div className="p-4.5 border border-stone-100 rounded-xl bg-stone-50/50 flex gap-4 items-start text-xs text-stone-500 leading-relaxed font-light">
              <Award className="w-5 h-5 text-[#B39D69] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-800">10-Year Co-Op Structural Guarantee</p>
                <p className="mt-0.5">Deflections and glue failure are completely covered under standard residential commissions.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Informational Panel & Form Buttons */}
          <div className="space-y-8">
            
            {/* Title Block */}
            <div className="space-y-3.5">
              <div className="flex gap-2 items-center">
                <span className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-700 font-mono font-bold rounded-md uppercase">
                  Studio Edition
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#FAF9F6] border border-stone-200 text-[#B39D69] font-mono font-bold rounded-md uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#B39D69]" />
                  <span>Carbon-Restricted</span>
                </span>
              </div>

              <h1 className="text-4xl font-display font-light text-stone-950 tracking-tight leading-none">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500 stroke-[1.5]" />
                  <span className="font-bold text-stone-900">{computedRating.toFixed(1)}</span>
                </div>
                <span className="text-stone-300">|</span>
                <span className="text-stone-400 hover:underline cursor-pointer">{reviews.length} Collector Evaluations</span>
                <span className="text-stone-300">|</span>
                <span className="text-[#B39D69] uppercase font-bold">In Stock (Made to Order)</span>
              </div>
            </div>

            {/* Pricing Section split */}
            <div className="p-5.5 rounded-2xl bg-stone-50 border border-stone-100/80 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Base Commission Value</p>
                <p className="text-3xl font-mono font-semibold text-stone-950 mt-1">${product.price.toLocaleString()}</p>
              </div>
              <div className="text-right text-[10px] font-mono text-stone-500">
                <p>Tax Included on Receipt</p>
                <p className="mt-0.5">Free standard white-glove transport</p>
              </div>
            </div>

            {/* Product description short block */}
            <p className="text-sm text-stone-600 font-sans leading-relaxed">
              {product.description}
            </p>

            {/* Premium Interactive Controls */}
            <div className="space-y-6 pt-4 border-t border-stone-100">
              
              {/* Color Swatch Selector */}
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#B39D69] uppercase block mb-3.5">
                  1. Timber Finish & Finish Option: <span className="text-stone-900 font-bold font-sans tracking-normal ml-1 capitalize">{selectedColor}</span>
                </span>
                
                <div className="flex gap-4">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`p-1.5 rounded-xl border flex items-center gap-2.5 transition-all text-xs font-medium cursor-pointer ${
                        selectedColor === color.name
                          ? 'border-stone-950 bg-stone-950 text-white shadow-md'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      <span 
                        className="w-5.5 h-5.5 rounded-lg border border-stone-300 block"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="pr-1.5">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Select options & Add to commissions */}
              <div className="flex gap-4 items-end pt-2">
                
                {/* Quantity */}
                <div className="w-24">
                  <span className="text-[10px] font-mono tracking-widest text-[#B39D69] uppercase block mb-3.5">
                    Quantity
                  </span>
                  <div className="flex items-center bg-white border border-stone-200 rounded-xl overflow-hidden h-14">
                    <button
                      onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                      className="w-8 h-full hover:bg-stone-50 flex items-center justify-center font-mono font-bold text-stone-500"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-mono text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="w-8 h-full hover:bg-stone-50 flex items-center justify-center font-mono font-bold text-stone-500"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add To Cart Core Action Button */}
                <button
                  onClick={handleAddToCartClick}
                  className="flex-1 h-14 bg-stone-950 hover:bg-stone-900 text-white text-xs font-mono font-semibold tracking-widest uppercase rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-3.5 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                  <span>Execute Order Commission • ${(product.price * quantity).toLocaleString()}</span>
                </button>

              </div>

            </div>

            {/* Guarantees micro-box elements */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-100 font-mono text-[10px] text-stone-400 uppercase">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4.5 h-4.5 text-[#B39D69]" />
                <div>
                  <p className="font-bold text-stone-850">Complimentary White Glove Delivery</p>
                  <p className="font-sans text-[9px] lowercase text-stone-500 mt-0.5 font-light">Assembling and placement included</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Shield className="w-4.5 h-4.5 text-[#B39D69]" />
                <div>
                  <p className="font-bold text-stone-850">Fully Tracked Craft Registers</p>
                  <p className="font-sans text-[9px] lowercase text-stone-500 mt-0.5 font-light">A unique signed timber code is laser burnt</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Immersive Bento Specification Grid */}
        <div className="mt-20 border-t border-stone-100 pt-16">
          <div className="max-w-2xl text-left space-y-2 mb-10">
            <span className="text-[10px] bg-stone-50 border border-stone-200 text-stone-500 font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-md">Blueprint Analysis</span>
            <h2 className="text-2xl sm:text-3xl font-display font-light text-stone-900 tracking-tight">
              Materials & <span className="font-normal italic">Structural Integrity</span>
            </h2>
            <p className="text-stone-500 text-sm">
              We log raw load deflection thresholds, thermal expands, and chemical wood gradings of every collector piece.
            </p>
          </div>

          <BentoSpecs product={product} />
        </div>

        {/* Customer Review Evaluation Registries */}
        <div className="mt-24 border-t border-stone-100 pt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Reviews Rating Breakdown Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] bg-amber-50 border border-amber-200/50 text-amber-700 font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-md">Patron Ledger</span>
              <h3 className="text-2xl font-display font-light text-stone-950 tracking-tight">Evaluations</h3>
              <p className="text-stone-500 text-xs font-light leading-relaxed">
                We maintain an unedited registry of collector evaluations. Authenticity is verified through timber ownership tracking codes.
              </p>
            </div>

            <div className="p-6.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-5.5">
              <div className="flex gap-4 items-center">
                <p className="text-5xl font-mono font-bold text-stone-900">{computedRating.toFixed(1)}</p>
                <div>
                  <div className="flex gap-0.5 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-stone-200" />
                  </div>
                  <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider mt-1">{reviews.length} active ratings</p>
                </div>
              </div>

              {/* Evaluation stars bars mockup */}
              <div className="space-y-2.5 text-xs font-mono text-stone-500 pt-3 border-t border-stone-200/40">
                <div className="flex items-center gap-3">
                  <span className="w-10">5 Star</span>
                  <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#B39D69] w-[88%]" />
                  </div>
                  <span className="w-6 text-right">88%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-10">4 Star</span>
                  <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#B39D69] w-[12%]" />
                  </div>
                  <span className="w-6 text-right">12%</span>
                </div>
                <div className="flex items-center gap-3 text-stone-300">
                  <span className="w-10">3 Star</span>
                  <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#B39D69] w-0" />
                  </div>
                  <span className="w-6 text-right">0%</span>
                </div>
              </div>
            </div>

            {/* Settle Review Form */}
            <form onSubmit={handleAddReview} className="p-6 border border-stone-100 rounded-2xl space-y-4 bg-white/70">
              <h4 className="text-xs font-mono font-bold uppercase text-stone-800">Add Collector Review</h4>
              
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-stone-400 block uppercase">Review Scale</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setUserReviewRating(star)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        userReviewRating >= star 
                          ? 'bg-amber-50 border-amber-300 text-amber-500' 
                          : 'bg-white border-stone-200 text-stone-300'
                      }`}
                    >
                      <Star className="w-4.5 h-4.5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-stone-400 block uppercase">Your Evaluation Statement</label>
                <textarea
                  required
                  rows={3}
                  value={userReviewText}
                  onChange={(e) => setUserReviewText(e.target.value)}
                  placeholder="Share details regarding joint tolerances, timber grains qualities, and transport assembly posture..."
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs placeholder-stone-400 focus:outline-none focus:bg-white transition-all focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-950 hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-colors"
              >
                Log Registry Entry
              </button>
            </form>

          </div>

          {/* Actual reviews scrolling ledger list */}
          <div className="lg:col-span-2 space-y-6 max-h-[85vh] overflow-y-auto no-scrollbar pr-1">
            {reviews.length === 0 ? (
              <div className="text-center py-16 text-stone-400 space-y-2 border border-dashed rounded-2xl">
                <AlertCircle className="w-7 h-7 mx-auto text-stone-300" />
                <p className="text-sm font-medium">No official logs filed</p>
                <p className="text-xs">Be the first authenticated customer to file an evaluation.</p>
              </div>
            ) : (
              reviews.map(rev => (
                <div key={rev.id} className="p-6 bg-stone-50/50 border border-stone-100 rounded-2xl space-y-4 hover:bg-stone-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#B39D69] text-white flex items-center justify-center font-display font-medium text-xs shadow-inner">
                        {rev.userAvatar || rev.userName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-sans text-xs font-semibold text-stone-900">{rev.userName}</h4>
                        <p className="text-[9px] font-mono text-stone-400 mt-0.5">PURCHASE ACCREDITED • {rev.date}</p>
                      </div>
                    </div>

                    <div className="flex gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-stone-200'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 font-sans leading-relaxed">
                    {rev.comment}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] font-mono text-stone-400">
                    <button className="flex items-center gap-1 hover:text-stone-950 transition-colors">
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful (3)</span>
                    </button>
                    <span>•</span>
                    <button className="hover:text-stone-950 transition-colors">Report Discrepancy</button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Related/Recommend Items section */}
        {relatedProducts.length > 0 && (
          <div className="mt-28 border-t border-stone-100 pt-16">
            <h3 className="text-xs font-mono font-bold tracking-widest text-[#B39D69] uppercase mb-8">
              Alternative Blueprint Alignments
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map(p => (
                <div 
                  key={p.id}
                  onClick={() => onViewProduct(p.id)}
                  className="group cursor-pointer space-y-4"
                >
                  <div className="relative aspect-square w-full rounded-2xl bg-stone-50/50 p-6 flex items-center justify-center border border-stone-100 overflow-hidden group-hover:border-stone-300 hover:shadow-lg transition-all duration-300">
                    <img 
                      src={p.images[0]} 
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 duration-300 transition-transform pointer-events-none"
                    />
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-display font-medium text-sm text-stone-900 group-hover:text-amber-700 transition-colors">{p.name}</h4>
                      <p className="text-[10px] font-mono text-stone-400 mt-1 uppercase">BY SITE: {p.sellerId.toUpperCase()}</p>
                    </div>
                    <span className="font-mono text-sm text-stone-800 font-medium">${p.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
