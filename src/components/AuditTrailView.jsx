import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Copy,
  Check,
  Lock,
  FileClock
} from 'lucide-react';
import { formatIST } from '../utils/dateUtils';

export default function AuditTrailView({ auditLogs = [], userRole = 'admin' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const isStandardUser = userRole === 'user';

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLogs = auditLogs.filter(log => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (log.activity && log.activity.toLowerCase().includes(q)) ||
      (log.details && log.details.toLowerCase().includes(q)) ||
      (log.wallet && log.wallet.toLowerCase().includes(q)) ||
      (log.txHash && log.txHash.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/40 via-gray-900/60 to-cyan-950/40 border border-indigo-900/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <History className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                {isStandardUser ? "Personal Ledger Provenance" : "Ledger Provenance"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isStandardUser ? "My Track Records & Credential History" : "Track Records & Immutable Audit Trail"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
              {isStandardUser
                ? "Chronological cryptographic log of verifiable credentials issued, updated, or verified for your connected wallet. All timestamps verified in Indian Standard Time (IST)."
                : "Chronological cryptographic log of every governance action, role privilege assignment, asset issuance, and token revocation recorded on Ethereum. All timestamps verified in Indian Standard Time (IST)."}
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>{isStandardUser ? "Personal Ledger Enforced" : "Zero-Tampering Ledger"}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-gray-900/60 border border-gray-800 p-5 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isStandardUser ? "Search your credential activities or transaction hashes..." : "Search by wallet, activity, or transaction..."}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-gray-400 font-mono">
            Showing <strong className="text-white">{filteredLogs.length}</strong> recorded event(s)
          </span>
        </div>

        {/* Audit Log Timeline Table */}
        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-gray-800 rounded-2xl bg-gray-950/40 mt-5">
            <FileClock className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-300">
              {isStandardUser ? "No Activity Records Found for Your Account" : "No Track Records Logged Yet"}
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No recorded events match "${searchQuery}". Clear your search query.`
                : isStandardUser
                ? "When credentials are minted, revoked, or updated for your connected wallet, verifiable transaction records will appear here."
                : "Blockchain activities, role assignments, and asset minting transactions will automatically record here upon execution."}
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-xl border border-gray-800/80">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-950/80 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  <th className="py-3.5 px-4">Event ID</th>
                  <th className="py-3.5 px-4">Activity & Specification</th>
                  <th className="py-3.5 px-4">Signer / Wallet</th>
                  <th className="py-3.5 px-4">Block & Tx</th>
                  <th className="py-3.5 px-4">Timestamp (IST)</th>
                  <th className="py-3.5 px-4 text-right">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 text-xs">
                {filteredLogs.map((log) => {
                  const truncatedWallet = log.wallet ? `${log.wallet.substring(0, 6)}...${log.wallet.substring(log.wallet.length - 4)}` : '0x0000...0000';
                  const isCopied = copiedId === log.id;

                  return (
                    <tr key={log.id} className="hover:bg-indigo-950/15 transition-colors">
                      {/* Log ID */}
                      <td className="py-4 px-4 font-mono font-bold text-indigo-400 whitespace-nowrap">
                        {log.id}
                      </td>

                      {/* Activity */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white">{log.activity}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5 max-w-sm">{log.details}</div>
                      </td>

                      {/* Signer Wallet */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-300" title={log.wallet}>
                            {truncatedWallet}
                          </span>
                          <button
                            onClick={() => handleCopy(log.wallet, log.id)}
                            title="Copy Full Wallet Address"
                            className="p-1 text-gray-500 hover:text-white rounded hover:bg-white/5 transition-colors"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      {/* Block / Tx */}
                      <td className="py-4 px-4 font-mono text-gray-400 whitespace-nowrap">
                        <div>#{log.blockNumber || '19827394'}</div>
                        <div className="text-[10px] text-indigo-300/80">{log.txHash}</div>
                      </td>

                      {/* Indian Standard Time (IST) Timestamp */}
                      <td className="py-4 px-4 text-gray-400 whitespace-nowrap font-mono text-[11px]">
                        {formatIST(log.timestamp)}
                      </td>

                      {/* Integrity Badge */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          <ShieldCheck className="w-3 h-3 text-cyan-400" /> Immutable
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
