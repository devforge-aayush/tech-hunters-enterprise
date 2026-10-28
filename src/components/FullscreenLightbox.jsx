import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Printer } from 'lucide-react';
import DigitalIdCard from './DigitalIdCard';

export default function FullscreenLightbox({ asset, onClose }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!asset) return null;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.6));
  const handleResetZoom = () => setScale(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-8 animate-in fade-in duration-200"
    >
      {/* Top Floating Controls */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute top-6 left-6 right-6 flex items-center justify-between z-50"
      >
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-gray-900/90 border border-gray-700/60 shadow-xl flex items-center gap-2 text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Deep-Dive Inspection:</span>
            <span className="text-xs font-mono font-bold truncate max-w-xs">{asset.name}</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-900/90 border border-gray-700/60 shadow-xl text-gray-300">
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2">{Math.round(scale * 100)}%</span>
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset Zoom"
              className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors ml-1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            title="Print Credential"
            className="p-2.5 rounded-xl bg-gray-900/90 border border-gray-700/60 hover:text-white hover:bg-gray-800 text-gray-300 shadow-xl transition-all"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            title="Close Fullscreen View (Esc)"
            className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 hover:bg-rose-600 text-rose-300 hover:text-white shadow-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="overflow-auto max-h-full max-w-full flex items-center justify-center p-8 transition-transform duration-150"
        style={{ transform: `scale(${scale})` }}
      >
        <DigitalIdCard asset={asset} isFullscreen={true} />
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 font-mono bg-black/60 px-4 py-1.5 rounded-full border border-white/10 pointer-events-none">
        Cryptographic Proof: SHA-256 Verifiable Credential • Immutable Institutional Ledger
      </div>
    </div>
  );
}
