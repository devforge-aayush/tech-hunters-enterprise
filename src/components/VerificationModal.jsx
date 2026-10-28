import React from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CONTRACT_ADDRESS } from '../constants/contract';

export default function VerificationModal({ asset, onClose }) {
  if (!asset) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-[#090e1a] border border-emerald-500/30 shadow-2xl overflow-hidden p-6 sm:p-8"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cryptographic Verification Passed</h3>
              <p className="text-[11px] font-mono text-emerald-400">STATUS: ON-CHAIN INTEGRITY CONFIRMED</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-3.5">
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs">
            <p className="font-semibold text-emerald-200 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verifiable Credential Intact
            </p>
            <p className="text-emerald-300/80 leading-relaxed text-[11px]">
              This token was verified directly against the Tech Hunters smart contract and content-addressed decentralized IPFS metadata hash.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800 flex justify-between">
              <span className="text-gray-400">Token ID</span>
              <span className="font-mono font-bold text-indigo-400">#{asset.tokenId}</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800 flex justify-between">
              <span className="text-gray-400">Asset Title</span>
              <span className="font-semibold text-white">{asset.name}</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800 flex justify-between">
              <span className="text-gray-400">Classification</span>
              <span className="text-cyan-300">{asset.assetType}</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800">
              <span className="block text-gray-400 mb-1">Decentralized IPFS Fingerprint</span>
              <span className="font-mono text-[11px] text-cyan-300 break-all select-all">{asset.uri}</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800">
              <span className="block text-gray-400 mb-1">Smart Contract</span>
              <span className="font-mono text-[11px] text-gray-300 break-all">{CONTRACT_ADDRESS}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30"
          >
            Dismiss Verification
          </button>
        </div>
      </div>
    </div>
  );
}
