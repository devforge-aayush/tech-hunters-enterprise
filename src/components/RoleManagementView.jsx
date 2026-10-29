import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserPlus,
  UserX,
  Lock,
  Copy,
  Check,
  ShieldAlert
} from 'lucide-react';
import { formatIST } from '../utils/dateUtils';

export default function RoleManagementView({
  managers = [],
  onGrantManager,
  onRevokeManager,
  loading = false,
  statusMsg: _statusMsg = "",
  userRole = 'admin'
}) {
  const [addressInput, setAddressInput] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(null);

  // Strict role isolation: Only Master Administrator holding DEFAULT_ADMIN_ROLE can manage roles
  if (userRole !== 'admin') {
    return (
      <div className="py-20 text-center rounded-2xl bg-gray-900/60 border border-gray-800 p-8 backdrop-blur-xl">
        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto mb-4 text-purple-400">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Access Denied: Root Administrator Required</h2>
        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
          Role governance, operational manager delegation, and contract privilege assignments are strictly reserved for the Master Administrator.
        </p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    onGrantManager(addressInput.trim());
    setAddressInput('');
  };

  const handleCopy = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-gray-900/60 to-indigo-950/40 border border-purple-900/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Users className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                Governance & Access Control
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Institutional Role Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
              Grant or revoke smart contract manager permissions (<code className="text-purple-300">MANAGER_ROLE</code>). Managers can mint and revoke enterprise credentials on behalf of the institution.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" /> Root Admin Exclusive
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grant Role Form: Clean Single-Field Direct Role Assignment */}
        <div className="lg:col-span-5 rounded-2xl bg-gray-900/60 border border-gray-800 p-6 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
            <UserPlus className="w-5 h-5 text-indigo-400" />
            Assign Manager Role
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Directly authorizes an Ethereum address to execute credential issuance and verification lifecycle actions.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Manager Wallet Address (0x...) *
              </label>
              <input
                type="text"
                placeholder="0xB7c3A398e8e9eD1Bd1aFC6832f02b1A11c2d4677"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value.trim())}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-white placeholder-gray-600 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !addressInput.trim()}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Broadcasting Role Transaction...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Confirm & Grant Manager Role
                </>
              )}
            </button>
          </form>

          {/* Role Policy Notice */}
          <div className="mt-6 p-4 rounded-xl bg-purple-950/20 border border-purple-900/30 text-xs text-purple-300/90 leading-relaxed">
            <strong className="block text-purple-200 mb-1">Smart Contract Enforcement:</strong>
            All role assignments execute on-chain via OpenZeppelin AccessControl. Root admin may revoke manager privileges at any time.
          </div>
        </div>

        {/* Active Managers Ledger */}
        <div className="lg:col-span-7 rounded-2xl bg-gray-900/60 border border-gray-800 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Active Operational Managers
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Institutional accounts possessing active <code className="text-purple-300">MANAGER_ROLE</code>
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {managers.length} Active
              </span>
            </div>

            {managers.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-gray-800 rounded-xl bg-gray-950/40">
                <ShieldAlert className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-300">No Operational Managers Assigned</p>
                <p className="text-[11px] text-gray-500 mt-1 max-w-xs mx-auto">
                  Use the form on the left to assign your first operational manager directly by Ethereum wallet address.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-800/80">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-950/80 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-800">
                      <th className="py-3 px-4">Role Status</th>
                      <th className="py-3 px-4">Manager Wallet Address</th>
                      <th className="py-3 px-4">Date Granted (IST)</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {managers.map((mgr) => {
                      const addr = mgr.address || mgr;
                      const truncated = `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
                      const isCopied = copiedAddress === addr;

                      return (
                        <tr key={addr} className="hover:bg-purple-950/10 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-white">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                              <span className="text-xs font-bold text-white">Operational Manager</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-mono">Active Authorization</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <span title={addr}>{truncated}</span>
                              <button
                                onClick={() => handleCopy(addr)}
                                className="p-1 text-gray-500 hover:text-white rounded"
                                title="Copy Wallet Address"
                              >
                                {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                            {formatIST(mgr.assignedDate)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => onRevokeManager(addr)}
                              disabled={loading}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold transition-all flex items-center gap-1 ml-auto cursor-pointer"
                            >
                              <UserX className="w-3 h-3 text-rose-400" />
                              Revoke
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Security Standard: OpenZeppelin AccessControl</span>
            <span className="text-indigo-400 font-mono">RoleHash: MANAGER_ROLE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
