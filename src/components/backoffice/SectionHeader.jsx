import React from 'react';

export default function SectionHeader({ title, subtitle, live, children }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-white text-xl font-heading font-bold">{title}</h1>
          {live && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal/10 text-teal text-[10px] font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        {subtitle && <p className="text-white/40 text-sm mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}