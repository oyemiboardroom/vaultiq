import React from 'react';

export default function StatCard({ label, value, subtitle, icon: Icon, accentColor = 'teal' }) {
  return (
    <div className="bg-navy-light rounded-xl p-5 border border-white/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider">{label}</p>
          <p className="text-white text-2xl font-heading font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-white/40 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-teal" />
          </div>
        )}
      </div>
    </div>
  );
}