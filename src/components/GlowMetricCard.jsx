import React, { useRef } from 'react';

export default function GlowMetricCard({
  title,
  value,
  subvalue,
  icon: Icon,
  badgeText,
  badgeType = "positive", // positive, info, warning
  trend,
  indicatorColor = "#6366f1"
}) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const badgeStyles = {
    positive: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    info: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    purple: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative rounded-2xl p-[1px] group transition-all duration-300 overflow-hidden"
    >
      {/* Dynamic Cursor-Tracking Glowing Border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), rgba(99, 102, 241, 0.6), rgba(6, 182, 212, 0.4), transparent 65%)`
        }}
      />

      {/* Static Subtle Border */}
      <div className="absolute inset-0 rounded-2xl border border-white/[0.08] pointer-events-none group-hover:border-transparent transition-colors" />

      {/* Card Inner Glass Panel */}
      <div className="relative rounded-[15px] bg-[#0c1222]/90 backdrop-blur-xl p-5 h-full flex flex-col justify-between">
        {/* Header Row: Title & Icon */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {title}
          </span>
          {Icon && (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10"
              style={{ backgroundColor: `${indicatorColor}15`, color: indicatorColor }}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Value and Main Metric */}
        <div className="my-1">
          <div className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-mono">
            {value}
          </div>
          {subvalue && (
            <p className="text-xs text-gray-400 mt-1 font-medium flex items-center gap-1.5">
              {subvalue}
            </p>
          )}
        </div>

        {/* Footer: Trend and Badges */}
        <div className="mt-3 pt-3 border-t border-gray-800/60 flex items-center justify-between">
          {badgeText && (
            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${badgeStyles[badgeType] || badgeStyles.info}`}>
              {badgeText}
            </span>
          )}
          {trend && (
            <span className="text-[11px] text-gray-400 font-mono">
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
