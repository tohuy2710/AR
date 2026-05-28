import { Milestone, Shield, Leaf, HeartHandshake } from "lucide-react";
import { Product } from "../types";

interface BentoSpecsProps {
  product: Product;
}

export default function BentoSpecs({ product }: BentoSpecsProps) {
  const { details } = product;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans mt-12">
      {/* Box 1: Core Material Composition */}
      <div className="p-7 bg-stone-50 border border-stone-100/80 rounded-2xl flex flex-col justify-between group hover:border-amber-500/20 hover:bg-stone-50/80 transition-all duration-300">
        <div>
          <div className="w-10 h-10 rounded-xl bg-stone-200/50 flex items-center justify-center text-stone-700 mb-5 group-hover:scale-110 duration-300 transition-all">
            <Leaf className="w-5 h-5 stroke-[1.8]" />
          </div>
          <h4 className="text-[11px] font-mono font-bold tracking-widest text-[#B39D69] uppercase">
            Composition
          </h4>
          <h3 className="text-lg font-display font-medium text-stone-900 mt-1">
            Material Integrity
          </h3>
          <p className="text-sm text-stone-600 mt-3.5 leading-relaxed">
            {details.material}
          </p>
        </div>
        <div className="border-t border-stone-200/50 pt-4 mt-6">
          <p className="text-[10px] font-mono text-stone-400 font-medium">
            WOOD GRADING & GRADE
          </p>
          <p className="text-xs font-mono font-bold text-stone-800 mt-0.5 uppercase">
            {details.woodGrade || "Museum Grade / Structural Class I"}
          </p>
        </div>
      </div>

      {/* Box 2: Craftsmanship & Designer */}
      <div className="p-7 bg-stone-50 border border-stone-100/80 rounded-2xl flex flex-col justify-between group hover:border-amber-500/20 hover:bg-stone-50/80 transition-all duration-300">
        <div>
          <div className="w-10 h-10 rounded-xl bg-stone-200/50 flex items-center justify-center text-stone-700 mb-5 group-hover:scale-110 duration-300 transition-all">
            <HeartHandshake className="w-5 h-5 stroke-[1.8]" />
          </div>
          <h4 className="text-[11px] font-mono font-bold tracking-widest text-[#B39D69] uppercase">
            Provenance & Origin
          </h4>
          <h3 className="text-lg font-display font-medium text-stone-900 mt-1">
            Heritage Design
          </h3>
          <p className="text-sm text-stone-600 mt-3.5 leading-relaxed">
            Designed by{" "}
            <span className="font-medium text-stone-900">
              {details.designer}
            </span>
            . Fashioned in limited yearly runs to prevent surplus and guarantee
            exclusivity.
          </p>
        </div>
        <div className="border-t border-stone-200/50 pt-4 mt-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-mono text-stone-400 font-medium">
              ORIGIN
            </p>
            <p className="text-xs font-mono font-bold text-stone-800 mt-0.5 uppercase">
              {details.origin}
            </p>
          </div>
          {/* <div className="bg-white/80 border border-stone-200/60 rounded px-2 py-1 text-[9px] font-mono text-stone-500">
            CHAMBER CODE: 48-DK
          </div> */}
        </div>
      </div>

      {/* Box 3: Technical Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 md:gap-4">
        {/* Sub-bento: Physical Tolerances */}
        <div className="p-5 bg-stone-950 text-white rounded-2xl flex flex-col justify-between hover:bg-stone-900 transition-colors duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-28 h-28 bg-[#c1aa75]/5 rounded-full blur-2xl group-hover:bg-[#c1aa75]/10 duration-500"></div>
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono tracking-widest text-gold-500 uppercase">
                Load Limits
              </span>
              <Shield className="w-4 h-4 text-gold-500 stroke-[1.8]" />
            </div>
            <p className="text-2xl font-display font-medium mt-3 text-white">
              {details.weightLimit || "Standard Tested"}
            </p>
          </div>
          <p className="text-[10px] font-mono text-stone-400 mt-5 uppercase">
            Deflection Tolerance certified below 0.4%
          </p>
        </div>

        {/* Sub-bento: Dimensions & Care */}
        <div className="p-5 bg-[#FAF9F6] border border-stone-100 rounded-2xl flex flex-col justify-between hover:bg-[#F5F2EA] transition-colors duration-300">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-amber-800 uppercase">
                Dimensions
              </span>
              <p className="text-sm font-display font-medium text-stone-900 mt-1">
                {details.dimensions}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
              <Milestone className="w-4.5 h-4.5 stroke-[1.5]" />
            </div>
          </div>
          <div className="border-t border-stone-200/50 pt-3.5 mt-4">
            <span className="text-[9px] font-mono tracking-widest text-[#B39D69] uppercase block mb-1">
              Maintenance
            </span>
            <p className="text-[11px] text-stone-500 leading-normal truncate group-hover:text-clip">
              {details.careInstructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
