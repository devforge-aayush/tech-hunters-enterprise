import React, { useState, useMemo } from 'react';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  Eye,
  PlusCircle,
  FileText,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function AssetLedgerTable({
  assets = [],
  onSelectAsset,
  onRevokeAsset,
  onVerifyAsset,
  onOpenMintTab,
  canManage = false,
  userRole = 'admin',
  revokingTokenId = null
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const isStandardUser = userRole === 'user';

  // Filtered Assets list
  const filteredAssets = useMemo(() => {
    return assets.filter((item) => {
      // Search matching Token ID, Name, Owner, or Type
      const matchesSearch =
        searchQuery.trim() === '' ||
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.tokenId && item.tokenId.toString().includes(searchQuery.trim())) ||
        (item.owner && item.owner.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.assetType && item.assetType.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status matching
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && !item.isRevoked) ||
        (statusFilter === 'REVOKED' && item.isRevoked);

      // Type matching
      const matchesType =
        typeFilter === 'ALL' || item.assetType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [assets, searchQuery, statusFilter, typeFilter]);

  // Unique Asset Types for dropdown
  const uniqueTypes = useMemo(() => {
    const types = new Set(assets.map(a => a.assetType).filter(Boolean));
    return Array.from(types);
  }, [assets]);

  return (
    <div className="rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-xl shadow-2xl p-5 sm:p-7">
      {/* Table Header: Title, Search & Filter Bar, Mint Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {isStandardUser ? "My DigiLocker Documents" : "Registered Assets Ledger"}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
              {filteredAssets.length} {isStandardUser ? 'credential(s)' : 'registered'}
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isStandardUser
              ? "Strictly isolated cryptographic credentials and verifiable credentials minted to your connected wallet."
              : "Complete cryptographic ledger of institutional credentials & digital identities registered on-chain."}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {canManage && (
            <button
              onClick={onOpenMintTab}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs tracking-wide shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Mint Digital Asset
            </button>
          )}

          {isStandardUser && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>DigiLocker Enforced</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 my-5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isStandardUser ? "Search your documents..." : "Search by Asset Name, Token ID (e.g. 101), or Owner Address (0x...)"}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-gray-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="REVOKED">Revoked Only</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-gray-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Asset Types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Asset Table */}
      {filteredAssets.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-gray-800 rounded-2xl bg-gray-950/40">
          <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-300">
            {isStandardUser ? "No Credentials in Your DigiLocker" : "No Assets Recorded on Ledger"}
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No tokens match "${searchQuery}". Clear your search query.`
              : isStandardUser
              ? "You do not have any verifiable credentials issued to your connected wallet address yet. When an institution mints a document to you, it will appear here."
              : "The ledger is currently clear. Authorized administrators or managers can mint assets using the button above."}
          </p>
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); setTypeFilter('ALL'); }}
              className="mt-4 px-3 py-1.5 text-xs rounded-lg bg-gray-800 text-gray-300 hover:text-white"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800/80">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-950/80 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Token ID</th>
                <th className="py-3.5 px-4">Asset Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Owner Wallet</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50 text-xs">
              {filteredAssets.map((asset) => {
                const isThisRevoking = revokingTokenId === asset.tokenId;
                const truncatedOwner = asset.owner ? `${asset.owner.substring(0, 6)}...${asset.owner.substring(asset.owner.length - 4)}` : '0x0000...0000';

                return (
                  <tr
                    key={asset.tokenId}
                    onClick={() => onSelectAsset(asset)}
                    className="group hover:bg-indigo-950/20 transition-colors cursor-pointer"
                  >
                    {/* Token ID */}
                    <td className="py-4 px-4 font-mono font-bold text-indigo-400 whitespace-nowrap">
                      #{asset.tokenId}
                    </td>

                    {/* Name */}
                    <td className="py-4 px-4 font-semibold text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{asset.name}</span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-4 text-gray-400 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-300 text-[11px] font-medium border border-gray-700/60">
                        {asset.assetType}
                      </span>
                    </td>

                    {/* Owner */}
                    <td className="py-4 px-4 font-mono text-gray-400 whitespace-nowrap" title={asset.owner}>
                      {truncatedOwner}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {asset.isRevoked ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          <AlertTriangle className="w-3 h-3 text-rose-400" /> Revoked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {/* Verify Button (Restricted to Admin & Manager roles as per RBAC requirement) */}
                        {canManage && (
                          <button
                            onClick={() => onVerifyAsset(asset)}
                            title="Verify On-Chain Cryptography"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            Verify
                          </button>
                        )}

                        {/* Direct Revoke / Reactivate (Admin/Manager only) */}
                        {canManage && (
                          <button
                            onClick={() => onRevokeAsset(asset.tokenId, !asset.isRevoked)}
                            disabled={isThisRevoking}
                            title={asset.isRevoked ? "Reactivate Asset" : "Revoke Asset from Blockchain"}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
                              asset.isRevoked
                                ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
                            }`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {isThisRevoking
                              ? 'Broadcasting...'
                              : asset.isRevoked
                              ? 'Reactivate'
                              : 'Revoke'}
                          </button>
                        )}

                        {/* Inspect Details Button */}
                        <button
                          onClick={() => onSelectAsset(asset)}
                          title="View Full Metadata & ID Card"
                          className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
