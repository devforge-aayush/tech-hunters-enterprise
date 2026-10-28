import React from 'react';
import { Shield, CheckCircle2, AlertOctagon, Cpu, QrCode, Lock, Fingerprint } from 'lucide-react';
import { CONTRACT_ADDRESS } from '../constants/contract';

export default function DigitalIdCard({ asset, isFullscreen = false }) {
  if (!asset) return null;

  const isRevoked = asset.isRevoked;
  const details = asset.details || {
    employeeId: `TH-ASSET-${asset.tokenId}`,
    role: asset.assetType,
    department: "Enterprise Verification Core",
    clearanceLevel: "Authorized",
    expiryDate: "2030-12-31",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
  };

  return (
    <div
      className={`relative mx-auto rounded-3xl overflow-hidden transition-all duration-300 shadow-2xl ${
        isFullscreen ? 'w-full max-w-xl' : 'w-full max-w-md'
      }`}
      style={{
        background: 'linear-gradient(135deg, #090e1a 0%, #111827 50%, #080d1a 100%)',
        border: isRevoked ? '1.5px solid rgba(244, 63, 94, 0.4)' : '1.5px solid rgba(99, 102, 241, 0.3)',
        boxShadow: isRevoked
          ? '0 25px 50px -12px rgba(225, 29, 72, 0.25)'
          : '0 25px 50px -12px rgba(79, 70, 229, 0.3)'
      }}
    >
      {/* Holographic Shimmer Effect */}
      {!isRevoked && <div className="hologram-shimmer" />}

      {/* Revoked Watermark Stamp */}
      {isRevoked && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          <div className="transform -rotate-12 border-4 border-rose-500/80 bg-rose-950/80 text-rose-300 px-8 py-3 rounded-2xl font-black text-2xl tracking-[0.25em] uppercase shadow-2xl backdrop-blur-md flex items-center gap-2">
            <AlertOctagon className="w-8 h-8 text-rose-500" />
            REVOKED / VOID
          </div>
        </div>
      )}

      {/* Card Header */}
      <div className="relative px-6 pt-6 pb-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-sm tracking-widest text-white uppercase">
              Tech Hunters
            </h4>
            <p className="text-[10px] font-mono text-cyan-400 tracking-wider">
              INSTITUTIONAL CREDENTIAL
            </p>
          </div>
        </div>

        {/* Smart Chip Icon */}
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-mono font-bold text-amber-300">NFC / CHIP</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-gray-400 font-mono">TOKEN ID</span>
            <span className="block font-mono text-xs font-bold text-indigo-400">#{asset.tokenId}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="relative p-6">
        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
          {/* Avatar / Portrait with Holographic Border */}
          <div className="relative shrink-0">
            <div className="w-24 h-28 rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-inner bg-gray-900">
              <img
                src={details.avatarUrl}
                alt={asset.name}
                className={`w-full h-full object-cover ${isRevoked ? 'grayscale contrast-125' : ''}`}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";
                }}
              />
            </div>
            {/* Status Dot */}
            <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 shadow-md"
              style={{
                backgroundColor: isRevoked ? '#4c0519' : '#064e3b',
                color: isRevoked ? '#fda4af' : '#6ee7b7',
                borderColor: isRevoked ? '#f43f5e' : '#10b981'
              }}
            >
              {isRevoked ? (
                <>
                  <AlertOctagon className="w-2.5 h-2.5" /> REVOKED
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
                </>
              )}
            </div>
          </div>

          {/* Identity & Metadata Details */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{asset.name}</h3>
            <p className="text-xs font-semibold text-cyan-400 mt-0.5">{details.role}</p>

            <div className="grid grid-cols-2 gap-2 mt-4 text-left">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Credential ID</span>
                <span className="block text-xs font-mono font-bold text-gray-200">{details.employeeId}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Security Clearance</span>
                <span className="block text-xs font-mono font-medium text-indigo-300">{details.clearanceLevel || "Authorized"}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Department</span>
                <span className="block text-xs font-medium text-gray-300 truncate">{details.department}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Valid Thru</span>
                <span className="block text-xs font-mono font-medium text-emerald-400">{details.expiryDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cryptographic Proof Footer Row */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] uppercase font-mono text-gray-500">Owner Wallet</span>
            <span className="block font-mono text-xs text-gray-300 truncate">{asset.owner}</span>
            <span className="block text-[10px] uppercase font-mono text-gray-500 mt-1">Smart Contract</span>
            <span className="block font-mono text-[11px] text-gray-400 truncate">{CONTRACT_ADDRESS}</span>
          </div>

          {/* QR Code Graphic */}
          <div className="shrink-0 p-2 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <QrCode className="w-12 h-12 text-gray-900" />
          </div>
        </div>
      </div>

      {/* Bottom Bar: Security Holographic Strip */}
      <div className="px-6 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-cyan-400" /> ON-CHAIN IMMUTABLE ASSET
        </span>
        <span className="flex items-center gap-1">
          <Fingerprint className="w-3.5 h-3.5 text-indigo-400" /> SHA-256 VERIFIED
        </span>
      </div>
    </div>
  );
}
