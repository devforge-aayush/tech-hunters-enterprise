import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Printer, Image as ImageIcon, CreditCard } from 'lucide-react';
import DigitalIdCard from './DigitalIdCard';

export default function FullscreenLightbox({ asset, onClose }) {
  const [scale, setScale] = useState(1);
  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'image'

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

  const handleZoomIn = () => setScale(prev => Math.min(Number((prev + 0.15).toFixed(2)), 2.5));
  const handleZoomOut = () => setScale(prev => Math.max(Number((prev - 0.15).toFixed(2)), 0.5));
  const handleResetZoom = () => setScale(1);

  const handlePrint = () => {
    window.print();
  };

  const artifactImageUrl = asset.details?.avatarUrl || asset.avatarUrl || asset.gatewayUrl || asset.image;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-2xl p-4 sm:p-6 animate-in fade-in duration-200 select-none overflow-hidden"
    >
      {/* Top Floating Controls */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-3 z-50 mb-2 shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-gray-900/90 border border-gray-700/60 shadow-xl flex items-center gap-2 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Deep-Dive Inspection:</span>
            <span className="text-xs font-mono font-bold truncate max-w-xs">{asset.name}</span>
          </div>

          {/* Toggle between Holographic ID Pass and Raw Artifact Image */}
          {artifactImageUrl && (
            <div className="flex items-center rounded-xl bg-gray-900/90 border border-gray-700/60 p-1 shadow-xl">
              <button
                type="button"
                onClick={() => { setActiveTab('card'); handleResetZoom(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                Holographic Pass
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('image'); handleResetZoom(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'image'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Document Artifact
              </button>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-900/90 border border-gray-700/60 shadow-xl text-gray-300">
            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-cyan-400 min-w-[50px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              title="Reset Zoom"
              className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            title="Print Credential"
            className="p-2.5 rounded-xl bg-gray-900/90 border border-gray-700/60 hover:text-white hover:bg-gray-800 text-gray-300 shadow-xl transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            title="Close Fullscreen View (Esc)"
            className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 hover:bg-rose-600 text-rose-300 hover:text-white shadow-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport Container with Proper Constraints */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full flex-1 flex items-center justify-center overflow-auto p-4 min-h-0 relative"
      >
        <div 
          className="transition-transform duration-150 ease-out flex items-center justify-center max-w-full max-h-full"
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          {activeTab === 'card' ? (
            <div className="w-full max-w-xl max-h-[75vh] flex items-center justify-center">
              <DigitalIdCard asset={asset} isFullscreen={true} />
            </div>
          ) : (
            <div className="flex items-center justify-center max-w-full max-h-[75vh] p-2 overflow-hidden">
              <img
                src={artifactImageUrl}
                alt={asset.name}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '72vh',
                  objectFit: 'contain'
                }}
                className="rounded-2xl shadow-2xl border border-indigo-500/30 bg-gray-950/60"
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="w-full flex justify-center py-1 z-50 shrink-0">
        <div className="text-xs text-gray-400 font-mono bg-black/60 px-4 py-1.5 rounded-full border border-white/10 pointer-events-none text-center truncate">
          Cryptographic Proof: SHA-256 Verifiable Credential • Immutable Institutional Ledger
        </div>
      </div>
    </div>
  );
}
