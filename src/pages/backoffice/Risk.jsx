import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { formatNaira, formatPercent } from '@/lib/formatters';
import SectionHeader from '@/components/backoffice/SectionHeader';
import StatCard from '@/components/backoffice/StatCard';
import { BarChart3, Activity, TrendingDown, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';

const varData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  var95: 300 + Math.random() * 150,
  var99: 800 + Math.random() * 500,
}));

const sectorData = [
  { sector: 'Banking', exposure: 24.2, limit: 25 },
  { sector: 'Telecom', exposure: 12.1, limit: 20 },
  { sector: 'Consumer', exposure: 8.4, limit: 20 },
  { sector: 'Oil & Gas', exposure: 7.8, limit: 15 },
  { sector: 'Industrial', exposure: 5.2, limit: 15 },
  { sector: 'Insurance', exposure: 3.8, limit: 10 },
];

const severityStyle = {
  positive: 'bg-emerald-400/10 text-emerald-400',
  low: 'bg-blue-400/10 text-blue-400',
  medium: 'bg-amber-400/10 text-amber-400',
  high: 'bg-red-400/10 text-red-400',
  critical: 'bg-red-600/20 text-red-400',
};

export default function Risk() {
  const { data: stressTests = [] } = useQuery({
    queryKey: ['stress-tests'],
    queryFn: () => base44.entities.StressTest.list(),
  });

  return (
    <div className="dark">
      <SectionHeader title="Risk Management & Analytics" subtitle="Parametric VaR · Historical simulation · Stress testing" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Portfolio VaR (1D, 95%)" value="₦384M" subtitle="0.90% of AUM" icon={BarChart3} />
        <StatCard label="Portfolio VaR (10D, 99%)" value="₦1.21B" subtitle="2.84% of AUM" icon={Activity} />
        <StatCard label="Portfolio Beta (vs NGX ASI)" value="0.87" subtitle="↓ vs 0.91 last month" icon={TrendingDown} />
        <StatCard label="Tracking Error (Ann.)" value="4.2%" subtitle="Within 6% target" icon={Target} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* VaR Trend */}
        <div className="bg-navy-light rounded-xl border border-white/5 p-5">
          <h3 className="text-white text-sm font-semibold mb-1">VaR Trend (30D)</h3>
          <p className="text-white/30 text-xs mb-4">All Funds</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={varData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₦${v}M`} />
                <Tooltip contentStyle={{ background: '#0b1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="var99" stroke="#f5a623" strokeWidth={1.5} fill="rgba(245,166,35,0.05)" name="VaR 99%" />
                <Area type="monotone" dataKey="var95" stroke="#00d4aa" strokeWidth={2} fill="rgba(0,212,170,0.1)" name="VaR 95%" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Exposure */}
        <div className="bg-navy-light rounded-xl border border-white/5 p-5">
          <h3 className="text-white text-sm font-semibold mb-1">Sector Exposure vs Limits</h3>
          <p className="text-white/30 text-xs mb-4">All funds</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="sector" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: '#0b1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="exposure" fill="#00d4aa" radius={[0, 4, 4, 0]} name="Current" />
                <Bar dataKey="limit" fill="rgba(255,255,255,0.08)" radius={[0, 4, 4, 0]} name="Limit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stress Tests */}
      <div className="bg-navy-light rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-white text-sm font-semibold">Stress Test Scenarios</h3>
          <p className="text-white/30 text-[10px] font-mono mt-1">P&L impact on ₦42.6B AUM</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-white/30 border-b border-white/5">
                <th className="text-left px-4 py-3 font-medium">Scenario</th>
                <th className="text-right px-4 py-3 font-medium">P&L Impact</th>
                <th className="text-right px-4 py-3 font-medium">% AUM</th>
                <th className="text-center px-4 py-3 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody>
              {stressTests.map((test) => (
                <tr key={test.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white/80 font-medium">{test.scenario_name}</td>
                  <td className={`px-4 py-3 text-right font-mono font-medium ${(test.pnl_impact || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {(test.pnl_impact || 0) >= 0 ? '+' : ''}{formatNaira(test.pnl_impact, true)}
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${(test.pnl_percent || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatPercent(test.pnl_percent)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${severityStyle[test.severity] || ''}`}>
                      {test.severity}
                    </span>
                  </td>
                </tr>
              ))}
              {stressTests.length === 0 && (
                <tr><td colSpan={4} className="text-center py-12 text-white/30">No stress tests configured</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}