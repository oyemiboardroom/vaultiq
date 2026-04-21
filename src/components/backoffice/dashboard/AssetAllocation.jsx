import React from 'react';

const allocations = [
  { label: 'NGX Equities', percent: 38.4, color: 'bg-teal' },
  { label: 'FGN Bonds', percent: 29.1, color: 'bg-blue-400' },
  { label: 'T-Bills / MM', percent: 18.6, color: 'bg-amber-400' },
  { label: 'Corp. Bonds', percent: 9.3, color: 'bg-purple-400' },
  { label: 'Cash / FX', percent: 4.6, color: 'bg-white/30' },
];

export default function AssetAllocation() {
  return (
    <div className="bg-navy-light rounded-xl border border-white/5 p-5">
      <h3 className="text-white text-sm font-semibold mb-4">Asset Allocation</h3>
      <p className="text-white/30 text-xs mb-4">All funds blended</p>

      {/* Stacked bar */}
      <div className="flex rounded-full overflow-hidden h-3 mb-5">
        {allocations.map((a) => (
          <div key={a.label} className={`${a.color} h-full`} style={{ width: `${a.percent}%` }} />
        ))}
      </div>

      <div className="space-y-3">
        {allocations.map((a) => (
          <div key={a.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${a.color}`} />
              <span className="text-white/60 text-xs">{a.label}</span>
            </div>
            <span className="text-white text-xs font-mono font-medium">{a.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}