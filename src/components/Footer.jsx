import React from 'react';
import { Shield, ExternalLink, Lock } from 'lucide-react';
import { CONTRACT_ADDRESS } from '../constants/contract';

export default function Footer({ onBrandClick }) {
  return (
    <footer className="w-full bg-[#030712] border-t border-gray-800/80 text-gray-400 text-xs mt-auto relative z-20">
      <div className="max-w-7xl mx-auto px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand & Mission */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBrandClick}
              className="flex items-center gap-2.5 text-white font-extrabold text-xs tracking-wider uppercase hover:text-cyan-400 transition-colors cursor-pointer text-left"
              title="Tech Hunters Core"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <span className="font-black text-white">Tech Hunters</span>
            </button>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <span className="text-gray-400 text-[11px] hidden sm:inline">
              Web3 Enterprise Asset & Credential Ledger
            </span>
          </div>

          {/* Smart Contract Proof Link */}
          <div className="flex items-center gap-4">
            <a
              href={`https://etherscan.io/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-950/80 border border-gray-800 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/40 font-mono text-[11px] transition-all"
              title="Inspect Verified Smart Contract on Etherscan"
            >
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Contract Proof</span>
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </a>

            <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>EVM Verified</span>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-4 pt-4 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-gray-500">
          <p>© 2026 Tech Hunters Enterprise Web3 Ledger. All rights reserved.</p>
          <p className="font-mono text-gray-500">ERC-721 Cryptographic Consensus</p>
        </div>
      </div>
    </footer>
  );
}
