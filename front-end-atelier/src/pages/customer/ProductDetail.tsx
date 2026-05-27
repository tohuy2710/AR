import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Viewer3D from '../../components/Viewer3D';
import BentoSpecs from '../../components/BentoSpecs';
import { 
  Heart, Star, ArrowLeft, Plus, Minus, ShoppingBag, 
  Sparkles, ShieldCheck, Truck, PackageCheck, Send, Smartphone
} from 'lucide-react';
import { Review } from '../../types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, wishlist, toggleWishlist, addToCart, reviews, addReview } = useApp();

  const product = products.find(p => p.id === id);

  // If product not found
  if (!product) {
    return (
      <div className="text-center py-24 space-y-4">
        <p className="text-sm font-mono text-stone-500">The requested design code could not be verified.</p>
        <button onClick={() => navigate('/customer/products')} className="px-5 py-2.5 bg-stone-950 text-white rounded-xl text-xs font-mono uppercase">
          Return to Showroom
        </button>
      </div>
    );
  }

  // State
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [arOpen, setArOpen] = useState(false);
  const [arCameraLive, setArCameraLive] = useState(false);

  // Form review state
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');

  const isFavorite = wishlist.includes(product.id);
  const productReviews = reviews[product.id] || [];

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revComment) return;

    const r: Review = {
      id: `rev-${Date.now()}`,
      userName: revName,
      userAvatar: revName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      rating: revRating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      comment: revComment
    };

    addReview(product.id, r);
    setRevName('');
    setRevComment('');
    alert('Thank you! Review committed successfully.');
  };

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back */}
        <button 
          onClick={() => navigate('/customer/products')}
          className="inline-flex items-center gap-2 text-xs font-mono text-stone-500 hover:text-stone-950 mb-8 uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collections</span>
        </button>

        {/* Master Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start text-left">
          
          {/* Left Block: 3D rotational perspective container */}
          <div className="space-y-6">
            <Viewer3D 
              images={product.images}
              threeSixtyImages={product.threeSixtyImages}
              productName={product.name}
            />

            {/* Immersive AR Button */}
            <div className="p-6 bg-stone-950 text-white rounded-3xl space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[9px] text-[#c2ab77] font-mono font-bold uppercase tracking-widest">Atelier Holographic Engine</span>
                  <h3 className="text-base font-display font-light">AR Living Room Projection</h3>
                  <p className="text-xs text-stone-400 font-light leading-relaxed">Simulate placing this table inside your room with smartphone depth sensors.</p>
                </div>
                <Smartphone className="w-8 h-8 text-[#c2ab77] translate-y-1 animate-bounce" />
              </div>

              <button
                type="button"
                onClick={() => {
                  setArOpen(true);
                  setArCameraLive(false);
                }}
                className="w-full py-3 bg-[#c2ab77] hover:bg-[#b09966] text-stone-950 rounded-xl font-mono text-xs font-bold uppercase tracking-widest transition-all"
              >
                Launch Augmented Reality
              </button>
            </div>
          </div>

          {/* Right Block: Content specs and purchasing console */}
          <div className="space-y-8 bg-white p-8 sm:p-10 border border-stone-200 rounded-3xl">
            
            {/* Title Block */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-stone-100 text-stone-600 font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-md">
                  Studio code: {product.sellerId}
                </span>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                    isFavorite 
                      ? 'bg-rose-50 border-rose-300 text-rose-600' 
                      : 'border-stone-200 hover:bg-stone-50 text-stone-400'
                  }`}
                >
                  <Heart className={`w-4.5 h-4.5 ${isFavorite ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              <h1 className="text-3xl font-display font-normal text-stone-950 leading-tight">
                {product.name}
              </h1>

              {/* Star review summaries */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-bold text-stone-950">{product.rating}</span>
                </div>
                <span className="text-stone-400">|</span>
                <span className="text-stone-500">{productReviews.length} authenticated reviews</span>
              </div>
            </div>

            {/* Price block */}
            <div className="pb-6 border-b border-stone-100">
              <p className="text-[11px] font-mono text-stone-400 uppercase">MOCK COMMISSION ROYALTY</p>
              <p className="text-3xl font-mono font-semibold text-stone-950 mt-1">
                ${(product.price * quantity).toLocaleString()}
              </p>
            </div>

            {/* Product description */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono text-stone-400 uppercase">Artisan Commentary</h4>
              <p className="text-sm text-stone-600 leading-relaxed font-light">{product.description}</p>
            </div>

            {/* Colors Selectors */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono text-stone-400 uppercase">Timber Seasoning Shade</h4>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map(col => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-sans border transition-all flex items-center gap-2 cursor-pointer ${
                      selectedColor === col.name
                        ? 'border-stone-950 bg-stone-950 text-white shadow-md'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: col.hex }} />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Controls & Action */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-100">
              
              {/* Quantity selectors */}
              <div className="sm:col-span-1 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between p-1.5 h-13">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-lg hover:bg-stone-200/50 flex items-center justify-center text-stone-600 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-xs font-bold text-stone-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-10 rounded-lg hover:bg-stone-200/50 flex items-center justify-center text-stone-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={() => {
                  addToCart(product, selectedColor, quantity);
                  alert(`Success! (${quantity}x) ${product.name} in [${selectedColor}] shade committed to cart.`);
                }}
                className="sm:col-span-3 h-13 bg-stone-950 hover:bg-stone-900 text-white rounded-xl font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Dispatch to Cart</span>
              </button>

            </div>

            {/* Value metrics checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs text-stone-500 font-mono">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#c2ab77]" />
                <span>Insured Freight</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c2ab77]" />
                <span>10 Yr Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-[#c2ab77]" />
                <span>Carbon Neutral</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bento specifications */}
        <BentoSpecs product={product} />

        {/* Reviews Section */}
        <div className="mt-16 bg-white p-8 sm:p-12 border border-stone-200 rounded-3xl space-y-10 text-left">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-6">
            <div className="space-y-1">
              <h2 className="text-xl font-display font-medium text-stone-950">Atelier Co-Op Ledger</h2>
              <p className="text-xs text-stone-500">Every comment and rating is cryptographically locked with individual receipt IDs.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-3xl font-mono font-bold text-stone-950">{product.rating}</span>
              <div className="space-y-0.5">
                <div className="flex text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                </div>
                <p className="text-[10px] text-stone-400 font-mono font-semibold uppercase">{productReviews.length} VERIFIED OPINIONS</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Left Col: Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {productReviews.length === 0 ? (
                <div className="text-center py-10 bg-stone-50 rounded-2xl text-stone-400 font-mono text-xs">
                  No verified comments logged yet. Be the first to publish below!
                </div>
              ) : (
                <div className="space-y-6">
                  {productReviews.map(rev => (
                    <div key={rev.id} className="p-6 bg-stone-50 rounded-2xl border border-stone-100/80 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-stone-950 text-white text-xs font-bold font-mono flex items-center justify-center">
                            {rev.userAvatar || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-stone-950">{rev.userName}</p>
                            <p className="text-[10px] text-stone-400 font-mono mt-0.5">{rev.date}</p>
                          </div>
                        </div>

                        <div className="flex text-amber-500 gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                      </div>

                      <p className="text-stone-600 text-xs font-light leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Col: Publish Review Form */}
            <div className="lg:col-span-1 bg-stone-50 border border-stone-200/70 p-6 rounded-2xl space-y-4">
              <h3 className="font-display font-medium text-sm text-stone-950">Publish Verification</h3>
              <p className="text-[11px] text-stone-500 font-light leading-normal">
                Submit raw critique regarding woodwork alignment, delivery white-glove speed, and timber sheen.
              </p>

              <form onSubmit={handleCreateReview} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-stone-500 uppercase block text-left">Signature Name</label>
                  <input
                    required
                    type="text"
                    placeholder="E.g., Charlotte Cole"
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    className="w-full bg-white px-3.5 py-2 rounded-xl text-xs border border-stone-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-stone-500 uppercase block text-left">Quality rating</label>
                  <select
                    value={revRating}
                    onChange={(e) => setRevRating(Number(e.target.value))}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl text-xs border border-stone-200 focus:outline-none"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ Excellent (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ Satisfactory (4 Stars)</option>
                    <option value="3">⭐⭐⭐ Neutral (3 Stars)</option>
                    <option value="2">⭐⭐ Fair (2 Stars)</option>
                    <option value="1">⭐ Poor (1 Star)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-stone-500 uppercase block text-left">Observations</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Specify physical feedback here..."
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    className="w-full bg-white p-3.5 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-950"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-stone-950 hover:bg-stone-900 border border-black text-white text-[10px] font-mono font-bold tracking-widest uppercase rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Submit Opinion</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>

      {/* Augmented Reality Simulation Modal */}
      {arOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full border border-stone-200 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="bg-stone-950 text-white p-6 flex justify-between items-center text-left">
              <div>
                <span className="text-[9px] text-[#c2ab77] font-mono font-bold uppercase tracking-widest">Augmented Projection</span>
                <h3 className="text-lg font-display font-light">Interactive AR Showcase</h3>
              </div>
              <button 
                onClick={() => { setArOpen(false); setArCameraLive(false); }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center text-xs font-mono"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-left space-y-6">
              
              {!arCameraLive ? (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="p-5 bg-stone-100 rounded-3xl border border-dashed border-stone-300 w-44 aspect-square flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Simulated QR block layout */}
                      <div className="w-32 h-32 bg-[url('https://images.unsplash.com/photo-1510519138101-570d1dca3d66?auto=format&fit=crop&w=150&q=80')] bg-cover mix-blend-multiply opacity-80" />
                      <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                        <Smartphone className="w-8 h-8 text-stone-900" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 max-w-sm mx-auto">
                    <h4 className="font-display font-semibold text-sm text-stone-950">Option 1: Scan QR Code with Phone</h4>
                    <p className="text-xs text-stone-500 font-light leading-relaxed">
                      Scan the code with your iOS or Android camera to instantly launch the immersive USDC/GLTF interactive model in physical space.
                    </p>
                  </div>

                  <div className="border-t border-stone-100 pt-5 space-y-4">
                    <p className="text-[9px] font-mono text-stone-400 uppercase tracking-widest font-bold">OR SIMULATE MOBILE WEB-AR CAPABILITY</p>
                    <button
                      type="button"
                      onClick={() => setArCameraLive(true)}
                      className="px-6 py-3 bg-stone-950 hover:bg-stone-900 text-white rounded-xl text-xs font-mono uppercase tracking-wider font-bold"
                    >
                      Open Simulator Web-AR Screen
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Web Video Simul Backdrop area with furniture superimposed */}
                  <div className="relative rounded-2xl aspect-[4/3] bg-stone-900 text-white overflow-hidden flex items-center justify-center border">
                    {/* Simulated Camera live screen background */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center brightness-[0.7] opacity-90 transition-all" />
                    
                    {/* Floating superimposed furniture asset */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 p-12 select-none animate-pulse">
                      <img 
                        src={product.images[0]} 
                        alt="SUPERIMPOSED AR ITEM" 
                        className="max-h-[80%] max-w-[80%] object-contain drop-shadow-2xl brightness-[1.05]"
                      />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 bg-black/75 p-3 rounded-lg flex justify-between items-center text-[10px] font-mono z-20">
                      <div className="flex items-center gap-1 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>DEPTH CORRECTION ACTIVE</span>
                      </div>
                      <span className="text-stone-300">SCALE: 100% ORIGINAL SIZES</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-display font-semibold text-xs text-stone-950">Surface Detection Anchor Locked</h4>
                    <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                      Drag holding the chair with your finger to rotate physical rotation coordinates. Touch the ground layout to displace its coordinate focus.
                    </p>
                  </div>

                  <div className="flex gap-3.5 pt-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setArCameraLive(false)}
                      className="flex-1 py-2.5 bg-stone-150 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-mono uppercase font-bold"
                    >
                      Go Back
                    </button>
                    <button
                      type="button"
                      onClick={() => alert('Simulated asset coordinates exported to local room layout!')}
                      className="flex-1 py-2.5 bg-[#c2ab77] hover:bg-[#b59d64] text-stone-950 rounded-xl text-xs font-mono uppercase font-bold"
                    >
                      Lock Location
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
