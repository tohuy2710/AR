import { ArrowRight, Sparkles, Star, Sofa, ArrowUpRight, ShieldCheck, HeartHandshake, Trees } from 'lucide-react';
import { Product } from '../types';

interface HomeProps {
  setCurrentPage: (page: string) => void;
  setSelectedProductId: (id: string) => void;
  featuredProducts: Product[];
}

export default function Home({ setCurrentPage, setSelectedProductId, featuredProducts }: HomeProps) {
  
  const handleViewProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentPage('detail');
  };

  return (
    <div className="font-sans text-gray-900 bg-white">
      
      {/* 1. Monolithic Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-stone-950 px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Subtle mesh background accent */}
        <div className="absolute inset-0 opacity-15 overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-[35rem] h-[35rem] rounded-full bg-amber-500/10 blur-[130px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[45rem] h-[45rem] rounded-full bg-stone-300/10 blur-[150px]" />
          
          {/* Subtle architect grids background overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Hero Text Column */}
          <div className="space-y-8 text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 border border-stone-800 text-stone-300 text-xs font-mono tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gold-500 fill-gold-500 animate-pulse" />
              <span>THE SPECIALIST ARCHITECTURAL EDITION 2026</span>
            </div>

            <h1 className="font-display font-light text-5xl sm:text-6xl lg:text-[4.25rem] leading-[1.1] tracking-tight text-white">
              Sovereign Craft. <br />
              <span className="font-normal text-gold-500">Uncompromising</span> <br />
              Interiors.
            </h1>

            <p className="text-stone-300 text-base sm:text-lg font-light leading-relaxed">
              Atelier is a selective architectural cooperative where master cabinetmakers, glassblowers, and architects sell intergenerational furniture masterpieces directly. No intermediaries. Just pure craft.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => setCurrentPage('catalog')}
                className="px-10 py-5 bg-[#c2ab77] hover:bg-[#aa935c] text-white text-xs font-mono font-semibold tracking-widest uppercase rounded-lg transition-all hover:shadow-xl hover:shadow-amber-950/20 active:scale-98 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore Showcase</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={() => {
                  setSelectedProductId('nordic-oak-table');
                  setCurrentPage('detail');
                }}
                className="px-8 py-5 bg-stone-900 hover:bg-stone-850 text-white border border-stone-800 text-xs font-mono font-semibold tracking-widest uppercase rounded-lg transition-all hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>360° Studio Tour</span>
                <span className="text-[10px] text-amber-500 font-bold">LIVE</span>
              </button>
            </div>

            {/* Micro stats banner */}
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-stone-900 font-mono text-stone-400 text-xs">
              <div>
                <p className="text-white text-xl font-display font-medium">100%</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-stone-500">FSC CERTIFIED TIMBER</p>
              </div>
              <div>
                <p className="text-white text-xl font-display font-medium">0.02%</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-stone-500">ZERO CARBON WASTAGE</p>
              </div>
              <div>
                <p className="text-white text-xl font-display font-medium">EST.</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-stone-500">INDIVIDUAL COMMISSION CODE</p>
              </div>
            </div>

          </div>

          {/* Right Hero Image Column (Sleek minimalist layout overlapping shadow cards) */}
          <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-stone-900/40 rounded-2xl border border-stone-800 overflow-hidden flex items-center justify-center p-8 group">
            {/* Background Image of some high-end furniture showroom with subtle overlay */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center mix-blend-luminosity brightness-[0.35] group-hover:scale-105 transition-transform duration-1000"></div>
            
            {/* Immersive Front Floating Mockup Product */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center text-center space-y-4">
              <img
                src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80"
                alt="Jeanneret Easy Armchair"
                referrerPolicy="no-referrer"
                className="h-64 sm:h-80 w-auto object-contain drop-shadow-2xl hover:scale-110 duration-700 transition-transform pointer-events-none"
              />
              
              <div className="bg-blur-backdrop bg-stone-950/70 border border-stone-800/80 p-5 rounded-xl max-w-sm text-left shadow-2xl">
                <span className="text-[9px] font-mono tracking-widest text-[#B39D69] uppercase">SEASON HEIRLOOM FEATURE</span>
                <h3 className="font-display font-medium text-lg text-white mt-1">Jeanneret Easy Chair</h3>
                <p className="text-stone-300 text-xs mt-1.5 font-light leading-relaxed">
                  The legendary mid-century lounge sculpture, hand-woven from reclaimed teak logs.
                </p>
                <div className="mt-3.5 flex justify-between items-center">
                  <span className="text-white font-mono text-xs font-bold">$2,400</span>
                  <button 
                    onClick={() => handleViewProduct('jeanneret-easy-chair')}
                    className="text-[10px] font-mono text-[#c2ab77] hover:text-white uppercase tracking-wider flex items-center gap-1 group/btn"
                  >
                    <span>View Blueprint</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. Philosophy & Value Proposition Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] bg-stone-100 text-stone-700 font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-md">Our Manifesto</span>
          <h2 className="text-3xl sm:text-4xl font-display font-light text-stone-900 tracking-tight leading-none">
            Built on <span className="font-normal italic text-[#4e4331]">Ethical Monoliths</span>
          </h2>
          <p className="text-stone-500 text-sm leading-relaxed">
            Atelier products aren't produced on assembly lines. They are individually engineered to order by accredited European workshops using materials built to survive historical eras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          
          <div className="p-8 bg-stone-50/50 border border-stone-100 rounded-2xl flex flex-col justify-between group hover:border-gray-300 transition-all duration-300">
            <div className="space-y-5">
              <div className="w-11 h-11 bg-stone-100/80 rounded-xl flex items-center justify-center text-stone-800">
                <Trees className="w-5.5 h-5.5 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-display font-medium text-stone-900">Old-Growth Sustainability</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                All timber matches rigorous Grade-FSC certification regulations. Every tree felled triggers double re-plantings across sustainable Scandinavian plantations.
              </p>
            </div>
            <span className="block border-t border-stone-200/50 pt-5 mt-6 font-mono text-[9px] text-stone-400 uppercase">RESTRICTED EXTRACTION SCHEME</span>
          </div>

          <div className="p-8 bg-stone-50/50 border border-stone-100 rounded-2xl flex flex-col justify-between group hover:border-gray-300 transition-all duration-300">
            <div className="space-y-5">
              <div className="w-11 h-11 bg-stone-100/80 rounded-xl flex items-center justify-center text-stone-800">
                <HeartHandshake className="w-5.5 h-5.5 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-display font-medium text-stone-800">Direct-From-Workshop</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                We remove middle brokers, designer agencies, and retail gallery markups. Sellers maintain 94% of profit share, investing back directly into sourcing high-end components.
              </p>
            </div>
            <span className="block border-t border-stone-200/50 pt-5 mt-6 font-mono text-[9px] text-stone-400 uppercase">FAIR ARTISAN COMMISSION PATTERN</span>
          </div>

          <div className="p-8 bg-stone-50/50 border border-stone-100 rounded-2xl flex flex-col justify-between group hover:border-gray-300 transition-all duration-300">
            <div className="space-y-5">
              <div className="w-11 h-11 bg-stone-100/80 rounded-xl flex items-center justify-center text-stone-800">
                <ShieldCheck className="w-5.5 h-5.5 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-display font-medium text-stone-800">Decadal Warranties</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                The joints, pins, and structural load deflectors inside every sideboard and table come backed by an unconditional 10-year workshop replacement guarantee.
              </p>
            </div>
            <span className="block border-t border-stone-200/50 pt-5 mt-6 font-mono text-[9px] text-stone-400 uppercase">FRACTURE DEFLECTION PROOFED</span>
          </div>

        </div>
      </section>

      {/* 3. Immersive Featured Masterpieces Carousel/Grid */}
      <section className="bg-stone-50/30 py-24 border-y border-stone-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="space-y-3">
              <span className="text-[10px] bg-stone-100 text-stone-600 font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-md">Atelier Catalog</span>
              <h2 className="text-3xl sm:text-4xl font-display font-light text-stone-900 tracking-tight">
                Featured <span className="font-normal italic">Architectural Masterpieces</span>
              </h2>
              <p className="text-stone-500 text-sm max-w-xl">
                Sourced from accredited design studios across Florence, Aarhus, and Portland.
              </p>
            </div>
            
            <button
              onClick={() => setCurrentPage('catalog')}
              className="px-5 py-3 border border-stone-200 hover:border-stone-900 rounded-lg text-xs font-mono font-medium tracking-wider uppercase transition-all flex items-center gap-2 group cursor-pointer bg-white"
            >
              <span>See Entire Collection</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((p) => (
              <div 
                key={p.id}
                onClick={() => handleViewProduct(p.id)}
                className="group bg-white rounded-2xl border border-stone-100 overflow-hidden cursor-pointer shadow-xs hover:shadow-xl hover:border-stone-300 transition-all duration-500 flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative aspect-square w-full bg-stone-50/50 p-6 flex items-center justify-center border-b border-stone-50">
                  <span className="absolute top-4 left-4 text-[9px] font-mono text-stone-400 uppercase tracking-widest">
                    DESIGNER CO-OP: {p.sellerId.toUpperCase()}
                  </span>
                  
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="max-h-[90%] max-w-[90%] object-contain drop-shadow-md group-hover:scale-105 duration-500 transition-transform pointer-events-none"
                  />

                  {/* Hotspots */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-opacity duration-300" />
                  
                  <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="w-full text-center bg-stone-950 text-white text-[10px] font-mono font-bold tracking-widest uppercase block py-3 rounded-lg shadow-lg">
                      Examine 360° Specs
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-display font-medium text-base text-stone-900 group-hover:text-amber-700 transition-colors">
                        {p.name}
                      </h3>
                      <span className="font-mono text-base font-semibold text-stone-900">
                        ${p.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-stone-500 text-xs font-light leading-relaxed">
                      {p.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex justify-between items-center text-xs font-mono">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500 stroke-[1.5]" />
                      <span className="font-bold text-stone-900">{p.rating.toFixed(1)}</span>
                      <span className="text-stone-400">({p.reviewCount})</span>
                    </div>
                    <span className="text-stone-400 truncate max-w-[50%]">
                      {p.materials[0]}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
