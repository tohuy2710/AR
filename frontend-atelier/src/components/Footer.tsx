import { Sofa, Mail, ArrowRight, Instagram, Linkedin, Globe, PhoneCall } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  return (
    <footer className="bg-stone-950 text-stone-100 font-sans border-t border-stone-900 mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 border-b border-stone-800 pb-16">
          
          {/* Brand Col */}
          <div className="md:col-span-1.5 space-y-6">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="w-9 h-9 rounded-lg bg-white text-black flex items-center justify-center">
                <Sofa className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <span className="font-display font-medium text-lg tracking-widest text-white">ATELIER</span>
                <span className="block text-[7px] tracking-[0.3em] uppercase text-stone-400 font-mono font-medium leading-none mt-0.5">Architectural Lab</span>
              </div>
            </div>
            
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Crafting monolithic interiors, sustainable seating platforms, and luxury spatial masterworks that bridge old-world carpentry with clean technical modernism.
            </p>

            <div className="flex items-center gap-4 text-stone-400">
              <a href="#" className="hover:text-gold-500 transition-colors" aria-label="Atelier on Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-gold-500 transition-colors" aria-label="Atelier on LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-gold-500 transition-colors" aria-label="Global Showrooms">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Showroom Locations Col */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-stone-300">Showrooms</h4>
            <ul className="mt-6 space-y-4 text-xs font-light text-stone-400">
              <li>
                <p className="font-medium text-stone-200">Milano Duomo</p>
                <p className="mt-0.5">Via della Spiga, 14, 20121 Milano MI, Italy</p>
              </li>
              <li>
                <p className="font-medium text-stone-200">Chicago River North</p>
                <p className="mt-0.5">310 W Huron Street, Chicago, IL 60654</p>
              </li>
              <li>
                <p className="font-medium text-stone-200">Copenhagen Nordhavn</p>
                <p className="mt-0.5">Klubiensvej 7, 2150 København, Denmark</p>
              </li>
            </ul>
          </div>

          {/* Core Navigation Options */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-stone-300">Curated Portfolios</h4>
            <ul className="mt-6 space-y-3.5 text-xs font-light text-stone-400">
              <li>
                <button onClick={() => setCurrentPage('catalog')} className="hover:text-white transition-colors text-left">
                  Living Room Collections
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('catalog')} className="hover:text-white transition-colors text-left">
                  Bespoke Boardroom & Dining
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('catalog')} className="hover:text-white transition-colors text-left">
                  Architectural Lighting
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('catalog')} className="hover:text-white transition-colors text-left">
                  Minimalist Desk Credenzas
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors block">
                  Sustainability Blueprint 2026
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-stone-300">Studio Dispatch</h4>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Subscribe to receive exclusive access to early prototype catalogs, designer interviews, and seasonal collection openings.
            </p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Atelier updates.'); }} className="mt-4 flex items-center bg-stone-900 border border-stone-800 rounded-lg overflow-hidden focus-within:border-gold-500 transition-colors">
              <input 
                type="email" 
                placeholder="yours@address.co" 
                className="bg-transparent border-0 flex-1 px-3.5 py-2 text-xs text-white focus:ring-0 placeholder-stone-600 focus:outline-none"
                required
              />
              <button 
                type="submit" 
                className="p-2.5 bg-white text-stone-950 hover:bg-stone-100 transition-colors"
                aria-label="Submit subscriber email"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center text-[11px] text-stone-500 font-mono">
          <p>© 2026 Atelier Furniture Ltd. All architecture assets fully protected.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-stone-300 transition-colors">Certifications</a>
            <a href="#" className="hover:text-stone-300 transition-colors">FSC Registry</a>
            <a href="#" className="hover:text-stone-300 transition-colors">Digital Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
