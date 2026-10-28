import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ShieldCheck, UserCheck, Shield, ExternalLink, LogOut, Wallet } from 'lucide-react';
import { CONTRACT_ADDRESS } from '../constants/contract';

export default function WalletHeader({ account, role, networkName = "Ethereum Sepolia", onDisconnect }) {
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!account) return null;

  // Format truncated address e.g. "0x71...7D"
  const truncatedAddress = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRoleBadge = () => {
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
          <Shield className="w-3 h-3 text-purple-400" /> Admin
        </span>
      );
    }
    if (role === 'manager') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
          <ShieldCheck className="w-3 h-3 text-cyan-400" /> Manager
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
        <UserCheck className="w-3 h-3 text-emerald-400" /> Standard User
      </span>
    );
  };

  return (
    <div className="relative">
      {/* Sleek Enterprise Wallet Pill without MetaMask Fox Logo */}
      <div
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3 px-3.5 py-2 rounded-2xl cursor-pointer select-none transition-all duration-200
                   bg-gray-900/90 hover:bg-gray-800/90 border border-gray-700/60 hover:border-indigo-500/50 
                   shadow-lg shadow-black/40 backdrop-blur-md group"
        title="View Connected Wallet Details & Session Options"
      >
        {/* Sleek Enterprise Wallet Icon */}
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 group-hover:scale-105 group-hover:text-cyan-400 group-hover:border-cyan-500/40 transition-all shrink-0">
          <Wallet className="w-4 h-4" />
        </div>

        {/* Truncated Wallet Address & Status */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            {/* Green Pulse Dot */}
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-gray-400">Connected:</span>
            <span className="font-mono text-xs font-bold text-gray-100 tracking-wide">
              {truncatedAddress}
            </span>
            <button
              onClick={handleCopy}
              title="Copy full wallet address"
              className="p-1 text-gray-400 hover:text-white transition-colors rounded hover:bg-white/10"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-gray-400 font-mono">{networkName}</span>
            {getRoleBadge()}
          </div>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Wallet Dropdown Details */}
      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-gray-900/95 border border-gray-700/80 shadow-2xl backdrop-blur-xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-2 py-2 border-b border-gray-800">
              <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Connected Account</p>
              <p className="text-xs font-mono text-gray-200 break-all select-all mt-1">{account}</p>
            </div>

            <div className="py-2.5 px-2 border-b border-gray-800 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Verified Role</span>
                <span className="capitalize font-bold text-white">{role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Network</span>
                <span className="text-cyan-400 font-mono text-[11px]">{networkName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Contract</span>
                <a
                  href={`https://etherscan.io/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline font-mono text-[11px] flex items-center gap-1"
                >
                  {CONTRACT_ADDRESS.substring(0, 8)}...
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Top-Right Disconnect Option */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onDisconnect();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect Session
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
