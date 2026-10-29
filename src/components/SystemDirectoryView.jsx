import React, { useState, useMemo } from 'react';
import {
  ContactRound,
  Crown,
  ShieldCheck,
  UserCheck,
  Search,
  Copy,
  Check,
  ExternalLink,
  Lock,
  ArrowRight,
  ShieldAlert,
  Users,
  X,
  FileCheck2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatIST } from '../utils/dateUtils';

export default function SystemDirectoryView({
  adminAddress = '',
  managers = [],
  users = [],
  assets = [],
  auditLogs = [],
  currentAccount = '',
  userRole = 'admin',
  onNavigateToRoles,
  onNavigateToMint
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'admin' | 'managers' | 'users'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'revoked'
  const [copiedId, setCopiedId] = useState(null);
  const [managersPage, setManagersPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const itemsPerPage = 9;

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Truncate address helper
  const truncate = (addr) => {
    if (!addr) return '0x0000...0000';
    if (addr.length <= 13) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Pre-calculate user asset statistics
  const userAssetStats = useMemo(() => {
    const stats = {};
    assets.forEach(asset => {
      if (!asset.owner) return;
      const ownerLower = asset.owner.toLowerCase();
      if (!stats[ownerLower]) {
        stats[ownerLower] = { total: 0, active: 0, revoked: 0, sampleTypes: new Set() };
      }
      stats[ownerLower].total += 1;
      if (asset.isRevoked) {
        stats[ownerLower].revoked += 1;
      } else {
        stats[ownerLower].active += 1;
      }
      if (asset.assetType) stats[ownerLower].sampleTypes.add(asset.assetType);
    });
    return stats;
  }, [assets]);

  // Find manager assignment timestamps from audit logs
  const managerAssignmentDates = useMemo(() => {
    const dates = {};
    auditLogs.forEach(log => {
      if (log.activity && log.activity.toLowerCase().includes('manager role granted')) {
        const match = log.details && log.details.match(/0x[a-fA-F0-9]{40}/);
        if (match) {
          dates[match[0].toLowerCase()] = log.timestamp;
        }
      }
    });
    return dates;
  }, [auditLogs]);

  const query = searchQuery.toLowerCase().trim();

  // Root Admin matching
  const adminMatches = useMemo(() => {
    if (categoryFilter !== 'all' && categoryFilter !== 'admin') return false;
    if (statusFilter === 'revoked') return false;
    if (!query) return true;
    return (
      adminAddress.toLowerCase().includes(query) ||
      'root admin deployer master authority governance primary contract'.includes(query)
    );
  }, [adminAddress, categoryFilter, statusFilter, query]);

  // Operational Managers Roster:
  // If the connected wallet holds MANAGER_ROLE, dynamically ensure it is recognized in the directory
  const effectiveManagers = useMemo(() => {
    let list = Array.isArray(managers) ? [...managers] : [];
    const normalizedRole = (userRole || '').toLowerCase().trim();
    if (normalizedRole === 'manager' && currentAccount) {
      const normCurrent = currentAccount.toLowerCase();
      const exists = list.some(m => (m.address || m).toLowerCase() === normCurrent);
      if (!exists) {
        list.unshift({
          address: currentAccount,
          status: 'Active',
          assignedDate: '2026-10-29T00:00:00.000Z',
          name: 'Operational Manager (You)'
        });
      }
    }
    return list;
  }, [managers, userRole, currentAccount]);

  // Managers matching
  const filteredManagers = useMemo(() => {
    if (categoryFilter !== 'all' && categoryFilter !== 'managers') return [];
    return effectiveManagers.filter(mgr => {
      const addr = (mgr.address || mgr).toLowerCase();
      const name = (mgr.name || '').toLowerCase();
      const isRevoked = Boolean(mgr.isRevoked || mgr.status === 'revoked');

      if (statusFilter === 'active' && isRevoked) return false;
      if (statusFilter === 'revoked' && !isRevoked) return false;

      if (!query) return true;
      return (
        addr.includes(query) ||
        name.includes(query) ||
        'operational manager authorized minter credential'.includes(query)
      );
    });
  }, [effectiveManagers, categoryFilter, statusFilter, query]);

  // Users matching
  const filteredUsers = useMemo(() => {
    if (categoryFilter !== 'all' && categoryFilter !== 'users') return [];
    return users.filter(uAddr => {
      const addr = uAddr.toLowerCase();
      const stats = userAssetStats[addr];
      const isOnlyRevoked = stats && stats.total > 0 && stats.active === 0;

      if (statusFilter === 'active' && isOnlyRevoked) return false;
      if (statusFilter === 'revoked' && !isOnlyRevoked) return false;

      if (!query) return true;
      return (
        addr.includes(query) ||
        'user holder recipient verified digilocker asset credential'.includes(query)
      );
    });
  }, [users, userAssetStats, categoryFilter, statusFilter, query]);

  // Counts
  const totalCount = 1 + effectiveManagers.length + users.length;
  const filteredTotalCount = (adminMatches ? 1 : 0) + filteredManagers.length + filteredUsers.length;

  // Pagination slices
  const paginatedManagers = useMemo(() => {
    const start = (managersPage - 1) * itemsPerPage;
    return filteredManagers.slice(start, start + itemsPerPage);
  }, [filteredManagers, managersPage]);

  const totalManagerPages = Math.ceil(filteredManagers.length / itemsPerPage) || 1;

  const paginatedUsers = useMemo(() => {
    const start = (usersPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, usersPage]);

  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  // Strict role isolation: Standard users must never access System Directory
  if (userRole !== 'admin' && userRole !== 'manager') {
    return (
      <div className="py-20 text-center rounded-2xl bg-gray-900/60 border border-gray-800 p-8 backdrop-blur-xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Access Denied: Administrative Authority Required</h2>
        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
          The System Directory contains institutional participant registries and access rosters. It is strictly restricted to accounts holding DEFAULT_ADMIN_ROLE or MANAGER_ROLE permissions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/40 via-gray-900/60 to-purple-950/40 border border-indigo-900/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-cyan-400 border border-indigo-500/30">
                <ContactRound className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                Access Control & Directory
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Participant & Role Directory
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl leading-relaxed">
              Enterprise directory of verified smart contract participants, including the Master Administrator, Operational Managers, and Registered Credential Holders.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Verified On-Chain Ledger</span>
          </div>
        </div>
      </div>

      {/* 2. Metrics & Overview Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-gray-900/70 border border-gray-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400">Total Participants</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <span className="text-2xl font-extrabold text-white">{totalCount}</span>
          <p className="text-[11px] text-gray-500 mt-0.5">All registered accounts</p>
        </div>

        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-900/40 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-purple-300">Master Administrator</span>
            <Crown className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl font-extrabold text-purple-200">1 Account</span>
          <p className="text-[11px] text-purple-400/70 mt-0.5">DEFAULT_ADMIN_ROLE</p>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-900/40 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-cyan-300">Operational Managers</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-2xl font-extrabold text-cyan-200">{effectiveManagers.length} Assigned</span>
          <p className="text-[11px] text-cyan-400/70 mt-0.5">MANAGER_ROLE (Minter)</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-300">Registered Asset Holders</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-extrabold text-emerald-200">{users.length} Accounts</span>
          <p className="text-[11px] text-emerald-400/70 mt-0.5">DigiLocker Credential Holders</p>
        </div>
      </div>

      {/* 3. Global Search & Filter Controls */}
      <div className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800 backdrop-blur-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Live Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setManagersPage(1);
                setUsersPage(1);
              }}
              placeholder="Search by address (0x...), manager name, or holder..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <span className="text-xs text-gray-400 font-medium mr-1">Status:</span>
            {[
              { id: 'all', label: 'All Statuses' },
              { id: 'active', label: 'Active' },
              { id: 'revoked', label: 'Revoked' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setManagersPage(1);
                  setUsersPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-gray-950/70 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-800/60">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `All Participants (${totalCount})` },
              { id: 'admin', label: 'Master Admin (1)' },
              { id: 'managers', label: `Operational Managers (${effectiveManagers.length})` },
              { id: 'users', label: `Asset Holders (${users.length})` }
            ].map(chip => (
              <button
                key={chip.id}
                onClick={() => {
                  setCategoryFilter(chip.id);
                  setManagersPage(1);
                  setUsersPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  categoryFilter === chip.id
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                    : 'bg-gray-950/70 border border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
            <span>Showing <strong className="text-white">{filteredTotalCount}</strong> participant(s)</span>
            {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}
                className="text-cyan-400 hover:underline cursor-pointer ml-1"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: MASTER ADMINISTRATOR (Root Authority)
          ========================================================================= */}
      {adminMatches && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <Crown className="w-4 h-4 text-purple-400" />
              Master Administrator (Root Authority)
            </h2>
            <span className="text-xs font-mono text-purple-400/80">Primary Governance · Root Access</span>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-purple-950/25 via-gray-900/80 to-indigo-950/25 border border-purple-500/30 p-6 backdrop-blur-xl hover:border-purple-500/50 transition-all shadow-xl shadow-purple-950/20">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Left: Avatar & Roles */}
              <div className="flex items-start sm:items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/50">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#070b14]" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-lg font-extrabold text-white tracking-tight">
                      Master Administrator (Root Authority)
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      Primary Governance
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      Root Access
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                    </span>
                    {currentAccount && adminAddress && currentAccount.toLowerCase() === adminAddress.toLowerCase() && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
                    Smart Contract Deployer holding primary governance privileges for protocol configuration, operational manager delegations, and root access control.
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              {userRole === 'admin' && onNavigateToRoles && (
                <button
                  onClick={onNavigateToRoles}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/30 shrink-0"
                >
                  <span>Role Governance</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Address Bar */}
            <div className="mt-5 p-3.5 rounded-xl bg-black/60 border border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider shrink-0">Address:</span>
                <span className="font-mono text-xs sm:text-sm text-purple-200 font-bold break-all select-all">
                  {adminAddress || '0x0000000000000000000000000000000000000000'}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(adminAddress, 'admin-addr')}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === 'admin-addr' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://sepolia.etherscan.io/address/${adminAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-semibold flex items-center gap-1.5 border border-purple-500/30 transition-colors"
                >
                  <span>Etherscan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: OPERATIONAL MANAGERS
          ========================================================================= */}
      {(categoryFilter === 'all' || categoryFilter === 'managers') && (
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Operational Managers ({filteredManagers.length} of {effectiveManagers.length})
            </h2>
            <span className="text-xs font-mono text-cyan-400/80">Operational Authority · Asset Minting & Revocation</span>
          </div>

          {filteredManagers.length === 0 ? (
            <div className="p-8 rounded-2xl bg-gray-900/40 border border-dashed border-gray-800 text-center">
              <ShieldAlert className="w-10 h-10 text-gray-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-gray-300">No Operational Managers Assigned</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                {query || statusFilter !== 'all'
                  ? 'No managers match the specified filter criteria. Try clearing your query.'
                  : 'Operational managers granted permissions will appear here once authorized by the Master Administrator.'}
              </p>
              {userRole === 'admin' && onNavigateToRoles && (
                <button
                  onClick={onNavigateToRoles}
                  className="mt-4 px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all cursor-pointer"
                >
                  Assign Manager in Governance
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedManagers.map((mgr, idx) => {
                  const addr = mgr.address || mgr;
                  const isRevoked = Boolean(mgr.isRevoked || mgr.status === 'revoked');
                  const assignedDate = managerAssignmentDates[addr.toLowerCase()] || mgr.addedAt;
                  const itemIndex = (managersPage - 1) * itemsPerPage + idx + 1;
                  const isCurrentAccount = currentAccount && currentAccount.toLowerCase() === addr.toLowerCase();

                  return (
                    <div
                      key={addr}
                      className="rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-cyan-500/40 transition-all p-5 backdrop-blur-xl flex flex-col justify-between group shadow-lg"
                    >
                      <div>
                        {/* Top: Avatar & Title */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-900/40">
                                <ShieldCheck className="w-5 h-5 text-white" />
                              </div>
                              <span
                                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#070b14] ${
                                  isRevoked ? 'bg-rose-400' : 'bg-emerald-400'
                                }`}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-extrabold text-sm text-white truncate max-w-[150px]">
                                  {mgr.name || `Operational Manager #${itemIndex}`}
                                </h3>
                                {isCurrentAccount && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-cyan-300 font-semibold block">
                                MANAGER_ROLE
                              </span>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              isRevoked
                                ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {isRevoked ? 'Revoked' : 'Active'}
                          </span>
                        </div>

                        {/* Address Box */}
                        <div className="p-2.5 rounded-xl bg-black/60 border border-gray-800/80 flex items-center justify-between gap-2 mb-3">
                          <span className="font-mono text-xs text-gray-300 font-semibold truncate" title={addr}>
                            {truncate(addr)}
                          </span>
                          <button
                            onClick={() => handleCopy(addr, `mgr-${addr}`)}
                            title={copiedId === `mgr-${addr}` ? "Copied to clipboard" : "Copy full address"}
                            className="px-2 py-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                          >
                            {copiedId === `mgr-${addr}` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 text-[11px] font-semibold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Permissions & Date */}
                        <div className="text-[11px] text-gray-400 space-y-1 mb-4">
                          <div className="flex justify-between items-center">
                            <span>Role Authority:</span>
                            <span className="text-gray-200 font-medium">Asset Issuance & Revocation</span>
                          </div>
                          {assignedDate && (
                            <div className="flex justify-between items-center text-[10px] text-gray-500">
                              <span>Granted:</span>
                              <span className="font-mono">{formatIST(assignedDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-gray-800/60 flex items-center justify-between text-xs">
                        <a
                          href={`https://sepolia.etherscan.io/address/${addr}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
                        >
                          <span>Etherscan</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        {userRole === 'admin' && onNavigateToRoles ? (
                          <button
                            onClick={onNavigateToRoles}
                            className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                          >
                            Manage Permissions →
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-500 font-mono">
                            Authorized Minter
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Managers Pagination */}
              {totalManagerPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-2 text-xs text-gray-400">
                  <span>Page {managersPage} of {totalManagerPages}</span>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={managersPage <= 1}
                      onClick={() => setManagersPage(p => Math.max(1, p - 1))}
                      className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={managersPage >= totalManagerPages}
                      onClick={() => setManagersPage(p => Math.min(totalManagerPages, p + 1))}
                      className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 3: REGISTERED ASSET HOLDERS
          ========================================================================= */}
      {(categoryFilter === 'all' || categoryFilter === 'users') && (
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Registered Asset Holders ({filteredUsers.length} of {users.length})
            </h2>
            <span className="text-xs font-mono text-emerald-400/80">Credential Holders · Standard Access</span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-8 rounded-2xl bg-gray-900/40 border border-dashed border-gray-800 text-center">
              <Users className="w-10 h-10 text-gray-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-gray-300">No Asset Holders Recorded</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                {query || statusFilter !== 'all'
                  ? 'No asset holders match the specified search filters.'
                  : 'Accounts holding issued enterprise credentials will automatically be listed here upon minting.'}
              </p>
              {(userRole === 'admin' || userRole === 'manager') && onNavigateToMint && (
                <button
                  onClick={onNavigateToMint}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all cursor-pointer"
                >
                  Mint Credential
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedUsers.map((uAddr, idx) => {
                  const stats = userAssetStats[uAddr.toLowerCase()] || { total: 0, active: 0, revoked: 0, sampleTypes: new Set() };
                  const itemIndex = (usersPage - 1) * itemsPerPage + idx + 1;
                  const isCurrentAccount = currentAccount && currentAccount.toLowerCase() === uAddr.toLowerCase();
                  const isRevokedHolder = stats.total > 0 && stats.active === 0;

                  return (
                    <div
                      key={uAddr}
                      className="rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-emerald-500/40 transition-all p-5 backdrop-blur-xl flex flex-col justify-between group shadow-lg"
                    >
                      <div>
                        {/* Top: Avatar & Title */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-900/40">
                                <UserCheck className="w-5 h-5 text-white" />
                              </div>
                              <span
                                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#070b14] ${
                                  isRevokedHolder ? 'bg-rose-400' : 'bg-emerald-400'
                                }`}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-extrabold text-sm text-white truncate max-w-[150px]">
                                  Asset Holder #{itemIndex}
                                </h3>
                                {isCurrentAccount && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-emerald-300 font-semibold block">
                                Credential Holder
                              </span>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              isRevokedHolder
                                ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {isRevokedHolder ? 'Revoked' : 'Active'}
                          </span>
                        </div>

                        {/* Address Box */}
                        <div className="p-2.5 rounded-xl bg-black/60 border border-gray-800/80 flex items-center justify-between gap-2 mb-3">
                          <span className="font-mono text-xs text-gray-300 font-semibold truncate" title={uAddr}>
                            {truncate(uAddr)}
                          </span>
                          <button
                            onClick={() => handleCopy(uAddr, `usr-${uAddr}`)}
                            title={copiedId === `usr-${uAddr}` ? "Copied to clipboard" : "Copy full address"}
                            className="px-2 py-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                          >
                            {copiedId === `usr-${uAddr}` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 text-[11px] font-semibold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Asset Summary */}
                        <div className="p-2.5 rounded-xl bg-gray-950/60 border border-gray-800/60 text-xs mb-3 space-y-1">
                          <div className="flex justify-between items-center text-gray-400">
                            <span className="flex items-center gap-1">
                              <FileCheck2 className="w-3.5 h-3.5 text-indigo-400" /> Total Credentials:
                            </span>
                            <span className="font-bold text-white font-mono">{stats.total} Asset(s)</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-emerald-400 font-medium">● {stats.active} Active</span>
                            <span className="text-rose-400 font-medium">● {stats.revoked} Revoked</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-gray-800/60 flex items-center justify-between text-xs">
                        <a
                          href={`https://sepolia.etherscan.io/address/${uAddr}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
                        >
                          <span>Etherscan</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <span className="text-[11px] text-gray-500 font-mono">
                          Verified Recipient
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Users Pagination */}
              {totalUserPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-2 text-xs text-gray-400">
                  <span>Page {usersPage} of {totalUserPages}</span>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={usersPage <= 1}
                      onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                      className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={usersPage >= totalUserPages}
                      onClick={() => setUsersPage(p => Math.min(totalUserPages, p + 1))}
                      className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
