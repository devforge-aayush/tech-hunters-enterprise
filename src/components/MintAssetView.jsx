import React, { useState, useMemo } from 'react';
import {
  PlusCircle,
  Eye,
  Sparkles,
  Lock
} from 'lucide-react';
import DigitalIdCard from './DigitalIdCard';

export default function MintAssetView({
  onMintAsset,
  loading = false,
  account: _account = ''
}) {
  // Clean blank form state with zero pre-filled junk data
  const [formData, setFormData] = useState({
    recipient: '',
    name: '',
    type: 'Identity Document',
    uri: '',
    department: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.recipient.trim() || !formData.name.trim() || !formData.uri.trim()) return;
    onMintAsset(formData);
  };

  // Construct a preview asset object reflecting currently typed parameters
  const previewAsset = useMemo(() => ({
    tokenId: 'PREVIEW',
    name: formData.name || 'Sample Credential',
    assetType: formData.type || 'Identity Document',
    owner: formData.recipient || '0x0000000000000000000000000000000000000000',
    issuedBy: 'Tech Hunters Smart Contract',
    createdAt: 1730000000,
    isRevoked: false,
    uri: formData.uri || 'ipfs://...',
    details: {
      employeeId: 'TH-VERIFIED-ASSET',
      role: formData.type || 'Enterprise Asset',
      department: formData.department || 'Institutional Verification Core',
      clearanceLevel: 'Authorized',
      expiryDate: '2030-12-31',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    }
  }), [formData]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/40 via-gray-900/60 to-cyan-950/40 border border-indigo-900/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <PlusCircle className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                ERC-721 Institutional Minting
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Mint Enterprise Digital Asset
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
              Publish an immutable digital credential, institutional license, or cryptographic identity token directly onto the blockchain ledger.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" /> Authorized Authority
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Clean Minting Form */}
        <div className="lg:col-span-7 rounded-2xl bg-gray-900/60 border border-gray-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-1">Asset Parameters & On-Chain Metadata</h2>
          <p className="text-xs text-gray-400 mb-6">
            Enter the verified asset details below. Submitting will prompt your Web3 wallet to sign the minting transaction.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Recipient Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Recipient Wallet Address (0x...) *
              </label>
              <input
                type="text"
                placeholder="0x71b2B54E8972D7a4b8682F81BceC6e7118334b7D"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value.trim() })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-white placeholder-gray-600 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Asset Title & Classification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Asset Title / Credential Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Executive Credential Pass"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Asset Classification *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-white text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Identity Document">Identity Document</option>
                  <option value="Digital Credential">Digital Credential</option>
                  <option value="Institutional License">Institutional License</option>
                  <option value="Security Clearance">Security Clearance</option>
                  <option value="Executive Pass">Executive Pass</option>
                </select>
              </div>
            </div>

            {/* IPFS Decentralized Metadata URI */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Decentralized Metadata URI (ipfs://...) *
              </label>
              <input
                type="text"
                placeholder="ipfs://bafybeiczsscdsbs7ffqz55asqdf3efuylqabf3oclgtqy55fbzdik98a12/metadata.json"
                value={formData.uri}
                onChange={(e) => setFormData({ ...formData, uri: e.target.value.trim() })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-white placeholder-gray-600 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Department / Division
              </label>
              <input
                type="text"
                placeholder="e.g. Decentralized Infrastructure & Security"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs tracking-wider uppercase shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Broadcasting Transaction to Ethereum...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Mint Digital Asset On-Chain
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Holographic Preview */}
        <div className="lg:col-span-5 rounded-2xl bg-gray-900/60 border border-gray-800 p-6 backdrop-blur-xl shadow-2xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" /> Live Holographic Preview
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Realtime Sync
            </span>
          </div>

          <DigitalIdCard asset={previewAsset} />

          <p className="text-[11px] text-gray-400 text-center mt-5 px-4 leading-relaxed">
            This card previews the high-resolution verifiable identity pass that will be cryptographically anchored to the recipient's wallet upon transaction confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
