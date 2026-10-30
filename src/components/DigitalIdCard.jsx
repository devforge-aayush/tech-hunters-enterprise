import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, AlertOctagon, Cpu, QrCode, Lock, Fingerprint } from 'lucide-react';
import { CONTRACT_ADDRESS } from '../constants/contract';
import { resolveIPFSUrl, fetchIPFSMetadata } from '../services/ipfsService';

export default function DigitalIdCard({ asset, isFullscreen = false }) {
  if (!asset) return null;

  const isRevoked = asset.isRevoked;
  const rawDetails = asset.details || {};

  // Extract initial candidate if available (excluding any legacy unsplash URLs)
  const initialImageCandidate = 
    (asset.image && !asset.image.includes('unsplash') ? asset.image : null) ||
    (asset.gatewayUrl && !asset.gatewayUrl.includes('unsplash') ? asset.gatewayUrl : null) ||
    (asset.avatarUrl && !asset.avatarUrl.includes('unsplash') ? asset.avatarUrl : null) ||
    (rawDetails.avatarUrl && !rawDetails.avatarUrl.includes('unsplash') ? rawDetails.avatarUrl : null) ||
    (rawDetails.image && !rawDetails.image.includes('unsplash') ? rawDetails.image : null) ||
    '';

  const [imageUrl, setImageUrl] = useState(() => resolveIPFSUrl(initialImageCandidate));
  const [hasImageError, setHasImageError] = useState(false);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [metadataDetails, setMetadataDetails] = useState({});

  useEffect(() => {
    let isMounted = true;
    setHasImageError(false);

    // 1. Direct candidate from props
    const directCandidate = 
      (asset.image && !asset.image.includes('unsplash') ? asset.image : null) ||
      (asset.gatewayUrl && !asset.gatewayUrl.includes('unsplash') ? asset.gatewayUrl : null) ||
      (asset.avatarUrl && !asset.avatarUrl.includes('unsplash') ? asset.avatarUrl : null) ||
      (rawDetails.avatarUrl && !rawDetails.avatarUrl.includes('unsplash') ? rawDetails.avatarUrl : null) ||
      (rawDetails.image && !rawDetails.image.includes('unsplash') ? rawDetails.image : null);

    if (directCandidate) {
      setImageUrl(resolveIPFSUrl(directCandidate));
      return;
    }

    // 2. Dynamically fetch and decode actual uploaded asset image from IPFS metadata
    if (asset.uri && (asset.uri.startsWith('ipfs://') || asset.uri.startsWith('http'))) {
      setIsLoadingMetadata(true);
      fetchIPFSMetadata(asset.uri)
        .then(metadata => {
          if (!isMounted || !metadata) return;

          const ipfsImage = metadata.image || metadata.gatewayUrl || metadata.document_uri;
          if (ipfsImage) {
            setImageUrl(resolveIPFSUrl(ipfsImage));
          }

          if (metadata.attributes && Array.isArray(metadata.attributes)) {
            const extra = {};
            metadata.attributes.forEach(attr => {
              if (attr.trait_type === 'Department') extra.department = attr.value;
              if (attr.trait_type === 'Valid Thru') extra.expiryDate = attr.value;
              if (attr.trait_type === 'Asset Type') extra.role = attr.value;
            });
            setMetadataDetails(extra);
          }
        })
        .catch(err => {
          console.warn("DigitalIdCard IPFS metadata resolution note:", err);
        })
        .finally(() => {
          if (isMounted) setIsLoadingMetadata(false);
        });
    } else {
      setImageUrl('');
    }

    return () => { isMounted = false; };
  }, [asset.uri, asset.image, asset.gatewayUrl, asset.avatarUrl, rawDetails.avatarUrl, rawDetails.image]);

  const details = {
    employeeId: rawDetails.employeeId || `TH-ASSET-${asset.tokenId}`,
    role: metadataDetails.role || rawDetails.role || asset.assetType,
    department: metadataDetails.department || rawDetails.department || "Enterprise Verification Core",
    clearanceLevel: rawDetails.clearanceLevel || "Authorized",
    expiryDate: metadataDetails.expiryDate || rawDetails.expiryDate || asset.expiryDate || "Permanent"
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
          {/* Avatar / Portrait with Holographic Border - Dynamically renders uploaded IPFS image */}
          <div className="relative shrink-0">
            <div className="w-24 h-28 rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-inner bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center relative">
              {imageUrl && !hasImageError ? (
                <img
                  src={imageUrl}
                  alt={asset.name}
                  className={`w-full h-full object-cover transition-all duration-300 ${isRevoked ? 'grayscale contrast-125' : ''}`}
                  onError={() => setHasImageError(true)}
                />
              ) : isLoadingMetadata ? (
                <div className="flex flex-col items-center justify-center p-2 text-center">
                  <div className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mb-1.5" />
                  <span className="text-[9px] font-mono text-cyan-300">Resolving IPFS...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-2 text-center text-indigo-300/80">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-1 text-cyan-400 shadow-md">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-cyan-400/90 truncate max-w-[80px]">
                    {asset.assetType || 'Pass'}
                  </span>
                </div>
              )}
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
