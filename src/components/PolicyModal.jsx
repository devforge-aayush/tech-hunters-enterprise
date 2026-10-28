import React from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle } from 'lucide-react';

export default function PolicyModal({ type, onClose }) {
  if (!type) return null;

  const contentMap = {
    security: {
      title: "Cryptographic Security Architecture",
      icon: ShieldCheck,
      sections: [
        {
          heading: "Role-Based Access Control (RBAC)",
          body: "Administrative authority is enforced through immutable OpenZeppelin AccessControl contracts. Only accounts explicitly granted DEFAULT_ADMIN_ROLE can assign MANAGER_ROLE permissions."
        },
        {
          heading: "Decentralized IPFS Metadata Integrity",
          body: "All credential artifacts, holographic schemas, and employee metadata are hashed using SHA-256 and stored on InterPlanetary File System (IPFS) content-addressed hashes."
        },
        {
          heading: "State Revocation & Non-Transferability",
          body: "Assets possess on-chain revocation state tracking via setAssetRevoked(). Revoked tokens immediately register as void across all network verifiers."
        }
      ]
    },
    privacy: {
      title: "Institutional Privacy Policy",
      icon: Lock,
      sections: [
        {
          heading: "Zero-Knowledge Data Segregation",
          body: "Private biometric and sensitive personal records remain encrypted off-chain. Only cryptographic verification hashes and public keys are posted to the public ledger."
        },
        {
          heading: "Wallet Identity Preservation",
          body: "No cookies or tracking pixels are utilized. Session connections are direct client-to-EVM via window.ethereum providers without centralized intermediary databases."
        }
      ]
    },
    terms: {
      title: "Terms of Institutional Service",
      icon: FileText,
      sections: [
        {
          heading: "Authorized Institutional Usage",
          body: "The Tech Hunters ledger is intended for authorized organizational credentials, enterprise software licensing, and certified employee identification."
        },
        {
          heading: "Cryptographic Finality",
          body: "Transactions signed via MetaMask and mined on EVM consensus chains are final, timestamped, and unalterable."
        }
      ]
    }
  };

  const item = contentMap[type] || contentMap.security;
  const Icon = item.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#090e1a] border border-gray-800 shadow-2xl overflow-hidden p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Icon className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">{item.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs sm:text-sm text-gray-300">
          {item.sections.map((sec, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-gray-950/60 border border-gray-800/80">
              <h4 className="font-bold text-white text-xs uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                {sec.heading}
              </h4>
              <p className="text-gray-400 leading-relaxed text-xs">{sec.body}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
