import React, { useState, useMemo, useRef } from 'react';
import {
  PlusCircle,
  Eye,
  Sparkles,
  Lock,
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';
import DigitalIdCard from './DigitalIdCard';
import { uploadAssetPipeline } from '../services/ipfsService';

export default function MintAssetView({
  onMintAsset,
  loading = false,
  account: _account = '',
  userRole = 'admin'
}) {
  // Clean blank form state
  const [formData, setFormData] = useState({
    recipient: '',
    name: '',
    type: 'Identity Document',
    department: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isUploadingIPFS, setIsUploadingIPFS] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [pinnedMetadataUri, setPinnedMetadataUri] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    setErrorMsg('');
    setPinnedMetadataUri('');

    // Check size limit: 25MB
    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File size exceeds 25MB limit. Please upload a smaller credential artifact.');
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setPinnedMetadataUri('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.recipient.trim() || !formData.name.trim()) {
      setErrorMsg('Recipient wallet address and credential title are required.');
      return;
    }

    if (!selectedFile && !pinnedMetadataUri) {
      setErrorMsg('Please upload a credential document or ID artifact to pin to IPFS.');
      return;
    }

    try {
      let metadataUri = pinnedMetadataUri;
      let gatewayUrl = '';

      if (!metadataUri && selectedFile) {
        setIsUploadingIPFS(true);
        setUploadStatus('Hashing & uploading document to Pinata IPFS...');

        const pipelineResult = await uploadAssetPipeline(selectedFile, {
          name: formData.name.trim(),
          type: formData.type,
          department: formData.department.trim(),
          recipient: formData.recipient.trim()
        });

        metadataUri = pipelineResult.metadataUri;
        gatewayUrl = pipelineResult.gatewayUrl;
        setPinnedMetadataUri(metadataUri);
        setUploadStatus('IPFS pinning complete! Initiating blockchain transaction...');
      }

      onMintAsset({
        ...formData,
        uri: metadataUri,
        gatewayUrl: gatewayUrl || filePreview,
        avatarUrl: filePreview
      });
    } catch (err) {
      console.error('IPFS upload pipeline error:', err);
      setErrorMsg(err.message || 'Failed to pin credential artifact to Pinata IPFS.');
    } finally {
      setIsUploadingIPFS(false);
    }
  };

  // Construct a preview asset object reflecting currently typed parameters and uploaded image
  const previewAsset = useMemo(() => ({
    tokenId: 'PREVIEW',
    name: formData.name || 'Sample Credential',
    assetType: formData.type || 'Identity Document',
    owner: formData.recipient || '0x0000000000000000000000000000000000000000',
    issuedBy: 'Tech Hunters Smart Contract',
    createdAt: Math.floor(Date.now() / 1000),
    isRevoked: false,
    uri: pinnedMetadataUri || (selectedFile ? `ipfs://pending-cid-${selectedFile.name}` : 'ipfs://...'),
    details: {
      employeeId: 'TH-VERIFIED-ASSET',
      role: formData.type || 'Enterprise Asset',
      department: formData.department || 'Institutional Verification Core',
      clearanceLevel: 'Authorized',
      expiryDate: '2030-12-31',
      avatarUrl: filePreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    }
  }), [formData, selectedFile, filePreview, pinnedMetadataUri]);

  // Strict role isolation: Standard users cannot mint assets
  if (userRole !== 'admin' && userRole !== 'manager') {
    return (
      <div className="py-20 text-center rounded-2xl bg-gray-900/60 border border-gray-800 p-8 backdrop-blur-xl">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Access Denied: Authorized Minter Authority Required</h2>
        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
          Asset minting and on-chain credential publishing are restricted to accounts holding Admin or Manager roles.
        </p>
      </div>
    );
  }

  const isFormBusy = loading || isUploadingIPFS;

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
            Upload the verified credential artifact and enter the asset details. Submitting will pin metadata to IPFS and prompt your Web3 wallet for transaction signature.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Recipient Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Recipient Wallet Address (0x...) *
              </label>
              <input
                type="text"
                placeholder="0xB7c3A398e8e9eD1Bd1aFC6832f02b1A11c2d4677"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value.trim() })}
                disabled={isFormBusy}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-white placeholder-gray-600 text-xs font-mono focus:outline-none focus:border-indigo-500 disabled:opacity-50"
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
                  disabled={isFormBusy}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Asset Classification *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  disabled={isFormBusy}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-white text-xs focus:outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
                >
                  <option value="Identity Document">Identity Document</option>
                  <option value="Digital Credential">Digital Credential</option>
                  <option value="Institutional License">Institutional License</option>
                  <option value="Security Clearance">Security Clearance</option>
                  <option value="Executive Pass">Executive Pass</option>
                </select>
              </div>
            </div>

            {/* Automated Document Attachment & IPFS Pinning Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
                <span>Credential Document / Identity Artifact *</span>
                <span className="text-[10px] font-mono text-cyan-400">Automated Pinata IPFS Pinning</span>
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
                accept="image/*,application/pdf"
                className="hidden"
                id="document-upload"
              />

              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !isFormBusy && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all text-center ${
                    isDragging
                      ? 'border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-500/10'
                      : 'border-gray-800 hover:border-indigo-500/60 bg-gray-950/50 hover:bg-gray-950/80'
                  } ${isFormBusy ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
                    <UploadCloud className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      Click to upload or drag & drop credential document
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Supports PDF credentials, institutional badges, PNG, JPG, or SVG (Max 25MB)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      Decentralized IPFS Pinning
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      CIDv1 SHA-256
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gray-950/80 border border-indigo-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5 overflow-hidden">
                      {filePreview ? (
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="w-12 h-12 rounded-xl object-cover border border-indigo-500/40 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate max-w-[280px]">
                          {selectedFile.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-mono text-gray-400">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </span>
                          <span className="text-gray-600">•</span>
                          <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Ready for IPFS
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      disabled={isFormBusy}
                      className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {pinnedMetadataUri && (
                    <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-gray-400">Pinned Metadata URI:</span>
                      <span className="text-cyan-400 truncate max-w-[320px] font-bold">
                        {pinnedMetadataUri}
                      </span>
                    </div>
                  )}
                </div>
              )}
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
                disabled={isFormBusy}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              />
            </div>

            {/* Realtime Upload / Error Feedback */}
            {isUploadingIPFS && (
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/50 flex items-center gap-2.5 text-xs text-cyan-300">
                <div className="w-3.5 h-3.5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin shrink-0" />
                <span>{uploadStatus}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-center gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isFormBusy}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs tracking-wider uppercase shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isUploadingIPFS ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Pinning Document & Metadata to IPFS...
                  </>
                ) : loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Broadcasting Transaction to Ethereum...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Pin to IPFS & Mint Digital Asset
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
