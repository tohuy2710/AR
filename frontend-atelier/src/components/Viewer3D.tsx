import { useState, useRef, useEffect } from 'react';
import { Rotate3d, Play, Pause, Milestone, HelpCircle } from 'lucide-react';

interface Viewer3DProps {
  images: string[];
  threeSixtyImages: string[];
  productName: string;
}

export default function Viewer3D({ images, threeSixtyImages, productName }: Viewer3DProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showMetadata, setShowMetadata] = useState(true);
  
  const totalFrames = threeSixtyImages.length || 8;
  const startXRef = useRef(0);
  const startFrameIndexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Auto rotation
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % totalFrames);
      }, 150);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalFrames]);

  // Touch and Mouse control handlers for dragging the 360 view
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setIsPlaying(false);
    startXRef.current = clientX;
    startFrameIndexRef.current = frameIndex;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startXRef.current;
    
    // Sensitivity: 1 frame change for every 15px dragged
    const sensitivity = 15;
    const offsetFrames = Math.floor(deltaX / sensitivity);
    
    // Calculate new frame with modular math
    let newFrame = (startFrameIndexRef.current - offsetFrames) % totalFrames;
    if (newFrame < 0) {
      newFrame += totalFrames;
    }
    setFrameIndex(newFrame);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Attach event listeners to window when dragging to allow smooth sliding off-element
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleWindowMouseUp = () => {
      handleEnd();
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="relative w-full aspect-square bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden flex flex-col justify-between p-6">
      
      {/* Top Controls Overlay */}
      <div className="flex justify-between items-center z-10">
        <div>
          <span className="text-[10px] bg-black text-white font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-md">Atelier 360° View</span>
          <p className="text-[11px] text-gray-400 font-mono mt-1">DRAG HORIZONTALLY TO SPIN MODEL</p>
        </div>
        
        <button
          onClick={() => setShowMetadata(!showMetadata)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
            showMetadata ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Milestone className="w-3.5 h-3.5" />
          <span>Architectural Blueprints</span>
        </button>
      </div>

      {/* Main Spinning View Area */}
      <div 
        ref={containerRef}
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => {
          if (e.touches[0]) handleStart(e.touches[0].clientX);
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) handleMove(e.touches[0].clientX);
        }}
        onTouchEnd={handleEnd}
        className="flex-1 relative flex items-center justify-center cursor-ew-resize select-none h-4/5 touch-none"
      >
        <img
          src={threeSixtyImages[frameIndex] || images[0]}
          alt={`${productName} rotation perspective ${frameIndex + 1}`}
          referrerPolicy="no-referrer"
          className="max-h-[92%] max-w-[92%] object-contain pointer-events-none drop-shadow-xl select-none transition-all duration-100"
        />

        {/* CAD/Architecture Specs markers overlays */}
        {showMetadata && (
          <div className="absolute inset-0 pointer-events-none w-full h-full font-mono">
            
            {/* Horizontal Width Line */}
            <div className="absolute left-[15%] right-[15%] bottom-[12%] border-b border-dashed border-gold-500/50 flex justify-between items-end">
              <span className="text-[9px] text-gold-600 bg-white/80 px-1 py-0.5 rounded border border-gold-100/50 -ml-2 -mb-2">A1</span>
              <span className="text-[9px] text-gold-600 bg-white/90 px-2 py-0.5 rounded border border-gold-200 -mb-2">Span Width: 240cm</span>
              <span className="text-[9px] text-gold-600 bg-white/80 px-1 py-0.5 rounded border border-gold-100/50 -mr-2 -mb-2">A2</span>
            </div>

            {/* Vertical Height Line */}
            <div className="absolute right-[12%] top-[15%] bottom-[15%] border-r border-dashed border-gold-500/50 flex flex-col justify-between items-start">
              <span className="text-[9px] text-gold-600 bg-white/80 px-1 py-0.5 rounded border border-gold-100/50 -mt-2 -mr-2">H1</span>
              <span className="text-[9px] text-gold-600 bg-white/90 px-2 py-0.5 rounded border border-gold-200 rotate-90 origin-left translate-x-2">Clearance: 75cm</span>
              <span className="text-[9px] text-gold-600 bg-white/80 px-1 py-0.5 rounded border border-gold-100/50 -mb-2 -mr-2">H2</span>
            </div>

            {/* Interactive joints focal points */}
            <div className="absolute top-[38%] left-[45%] group pointer-events-auto cursor-help">
              <div className="w-4 h-4 rounded-full bg-gold-500/20 border border-gold-500 flex items-center justify-center animate-ping absolute"></div>
              <div className="w-4 h-4 rounded-full bg-gold-500 border-2 border-white flex items-center justify-center relative z-10 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
              <div className="absolute left-6 -top-2 bg-black/95 text-white p-2.5 rounded-lg text-[9px] leading-relaxed w-44 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 duration-200 origin-left transition-all shadow-xl z-50">
                <p className="font-bold border-b border-white/10 pb-0.5 mb-1 text-[10px] text-gold-100">DOUBLE MORTISE JOINERY</p>
                Hand-cut slots coupled with high-density polyurethane locks prevent structure sag completely.
              </div>
            </div>

            {/* Pivot Point */}
            <div className="absolute bottom-[20%] left-[55%] group pointer-events-auto cursor-help">
              <div className="w-4 h-4 rounded-full bg-gold-500/20 border border-gold-500 flex items-center justify-center animate-ping absolute"></div>
              <div className="w-4 h-4 rounded-full bg-gold-500 border-2 border-white flex items-center justify-center relative z-10 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
              <div className="absolute left-6 -top-2 bg-black/95 text-white p-2.5 rounded-lg text-[9px] leading-relaxed w-44 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 duration-200 origin-left transition-all shadow-xl z-50">
                <p className="font-bold border-b border-white/10 pb-0.5 mb-1 text-[10px] text-gold-100">SCANDINAVIAN GRAIN MATCH</p>
                Each timber core is cataloged so growth patterns loop seamlessly across structural legs.
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Bottom Carousel Spin Sync Control / Drag Status */}
      <div className="flex flex-col gap-3.5 z-10 mt-auto">
        <div className="w-full h-1 bg-gray-200 rounded-full relative">
          <div 
            className="absolute h-full bg-black rounded-full transition-all duration-100"
            style={{ width: `${((frameIndex + 1) / totalFrames) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs font-mono text-gray-500">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 text-black flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-xs"
              aria-label={isPlaying ? 'Pause auto-rotation' : 'Play auto-rotation'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-black stroke-black" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-black stroke-black" />
              )}
            </button>
            <span className="text-[10px] text-gray-400 font-mono">PERSPECTIVE: {frameIndex + 1} / {totalFrames}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] tracking-wide uppercase text-gray-400">
            <Rotate3d className="w-4 h-4 text-gray-500 stroke-[1.8] animate-spin" style={{ animationDuration: isPlaying ? '14s' : '0s' }} />
            <span>Interactive 3D Turntable</span>
          </div>
        </div>
      </div>

    </div>
  );
}
