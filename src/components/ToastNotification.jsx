import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X, Loader2 } from 'lucide-react';

export default function ToastNotification({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const typeStyles = {
          success: {
            bg: "bg-emerald-950/90 border-emerald-500/40 text-emerald-200",
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          },
          error: {
            bg: "bg-rose-950/90 border-rose-500/40 text-rose-200",
            icon: <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          },
          pending: {
            bg: "bg-indigo-950/90 border-indigo-500/40 text-indigo-200",
            icon: <Loader2 className="w-5 h-5 text-indigo-400 animate-spin shrink-0" />
          },
          info: {
            bg: "bg-cyan-950/90 border-cyan-500/40 text-cyan-200",
            icon: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
          }
        }[toast.type || 'info'];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${typeStyles.bg}`}
          >
            {typeStyles.icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white tracking-wide">{toast.title}</h4>
              <p className="text-xs text-gray-300 mt-0.5 leading-relaxed break-words">{toast.message}</p>
              {toast.txHash && (
                <div className="mt-1.5 flex items-center gap-1 font-mono text-[10px] text-cyan-300">
                  <span>Tx: {toast.txHash.substring(0, 10)}...</span>
                </div>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
