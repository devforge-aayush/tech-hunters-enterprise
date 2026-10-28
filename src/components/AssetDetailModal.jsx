import React, { useState } from 'react';
import {
  X,
  Maximize2,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Hash,
  Database
} from 'lucide-react';
import DigitalIdCard from './DigitalIdCard';
import { formatIST } from '../utils/dateUtils';

export default function AssetDetailModal({
  asset,
  onClose,
  onRevoke,
  onVerify,
  onOpenFullscreen,
  canRevoke = false,
  isRevoking = false
}) {
  const [copiedField, setCopiedField] = useState(null);

  if (!asset) return null;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formattedDate = formatIST(asset.createdAt || 1793000000);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-3xl bg-[#090e1a] border border-gray-800 shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between bg-gray-900/40">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
              Token #{asset.tokenId}
            </span>
            <h2 className="text-lg font-bold text-white truncate max-w-md">
              {asset.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFullscreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold border border-gray-700 transition-all cursor-pointer"
              title="Open Fullscreen Lightbox"
            >
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              Fullscreen View
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Left Column: Digital ID Preview Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <DigitalIdCard asset={asset} />
            <div className="mt-4 flex gap-2 w-full max-w-md">
              <button
                onClick={onOpenFullscreen}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Inspect Holographic Card
              </button>
              {canRevoke && onVerify && (
                <button
                  onClick={() => onVerify(asset)}
                  className="py-2 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verify
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Metadata Deep Dive */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Cryptographic Ledger Metadata
              </h3>

              {/* Status Row */}
              <div className="p-3.5 rounded-2xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-400">Current Blockchain State:</span>
                {asset.isRevoked ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Revoked / Deactivated
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Active & Verified
                  </span>
                )}
              </div>

              {/* Metadata Fields */}
              <div className="space-y-2.5">
                {/* IPFS URI */}
                <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-cyan-400" /> Decentralized Metadata (IPFS)
                    </span>
                    <button
                      onClick={() => handleCopy(asset.uri, 'uri')}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy IPFS URI"
                    >
                      {copiedField === 'uri' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="font-mono text-xs text-cyan-300 break-all select-all">{asset.uri}</p>
                </div>

                {/* Creation Tx Hash */}
                <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-indigo-400" /> Creation Transaction Hash
                    </span>
                    <button
                      onClick={() => handleCopy(asset.txHash || "0x0000000000000000000000000000000000000000", 'txHash')}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy Tx Hash"
                    >
                      {copiedField === 'txHash' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="font-mono text-xs text-gray-300 break-all select-all">
                    {asset.txHash || "0x0000000000000000000000000000000000000000"}
                  </p>
                </div>

                {/* Issuer & Current Owner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Issued By (Contract / Admin)</span>
                      <button
                        onClick={() => handleCopy(asset.issuedBy, 'issuedBy')}
                        className="text-gray-400 hover:text-white cursor-pointer"
                      >
                        {copiedField === 'issuedBy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <p className="font-mono text-xs text-gray-300 truncate">{asset.issuedBy}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Current Owner Address</span>
                      <button
                        onClick={() => handleCopy(asset.owner, 'owner')}
                        className="text-gray-400 hover:text-white cursor-pointer"
                      >
                        {copiedField === 'owner' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <p className="font-mono text-xs text-gray-300 truncate">{asset.owner}</p>
                  </div>
                </div>

                {/* Timestamp (IST) */}
                <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-500" /> Timestamp Registered (IST)
                  </span>
                  <span className="font-mono text-xs text-gray-200">{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-gray-800 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Close Deep-Dive
              </button>

              {canRevoke && (
                <button
                  onClick={() => onRevoke(asset.tokenId, !asset.isRevoked)}
                  disabled={isRevoking}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
                    asset.isRevoked
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  {isRevoking
                    ? 'Broadcasting to Chain...'
                    : asset.isRevoked
                    ? 'Reactivate Credential'
                    : 'Revoke Digital Asset'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
