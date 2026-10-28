import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "warning" // warning, danger, info
}) {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div 
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-[#090e1a] border border-gray-800 shadow-2xl p-6 sm:p-7"
      >
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 p-1 rounded-xl text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${isDanger
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
              : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
            }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500">
              Safety Confirmation Check
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer ${isDanger
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
