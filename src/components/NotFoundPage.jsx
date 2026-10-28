import React from 'react';
import { ShieldAlert, Home, Database } from 'lucide-react';

export default function NotFoundPage({ onReturnHome, onReturnDashboard, isConnected = false }) {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 shadow-2xl">
          <ShieldAlert className="w-10 h-10 text-cyan-400" />
        </div>

        <span className="font-mono text-sm px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest font-bold">
          Error 404 • Block Not Found
        </span>

        <h1 className="text-4xl sm:text-5xl font-black text-white mt-4 tracking-tight">
          Cryptographic Orphan
        </h1>

        <p className="text-sm text-gray-400 mt-3 leading-relaxed">
          The requested route, contract state, or institutional document ledger could not be verified on this consensus chain.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {isConnected && (
            <button
              onClick={onReturnDashboard}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Database className="w-4 h-4" />
              Return to Dashboard
            </button>
          )}

          <button
            onClick={onReturnHome}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs uppercase tracking-wider border border-gray-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
