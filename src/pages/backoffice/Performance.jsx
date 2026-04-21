import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { formatPercent, getReturnColor } from '@/lib/formatters';
import SectionHeader from '@/components/backoffice/SectionHeader';
import StatCard from '@/components/backoffice/StatCard';
import { TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts';

const monthlyData = [
  { month: 'May', fund: 2.1, benchmark: 1.8 },
  { month: 'Jun', fund: 3.4, benchmark: 2.9 },
  { month: 'Jul', fund: -0.8, benchmark: -1.2 },
  { month: 'Aug', fund: 1.9, benchmark: 1.4 },
  { month: 'Sep', fund: 4.2, benchmark: 3.8 },
  { month: 'Oct', fund: -1.2, benchmark: -2.1 },
  { month: 'Nov', fund: 2.8, benchmark: 2.2 },
  { month: 'Dec', fund: 1.4, benchmark: 1.1 },
  { month: 'Jan', fund: 3.1, benchmark: 2.6 },
  { month: 'Feb', fund: 2.4, benchmark: 1.8 },
  { month: 'Mar', fund: 1.8, benchmark: 1.4 },
  { month: 'Apr', fund: 4.8, benchmark: 4.2 },
];

const attributionData = [
  { sector: 'Banking', allocation: 0.8, selection: 1.2 },
  { sector: 'Oil & Gas', allocation: -0.3, selection: 0.6 },
  { sector: 'Telecom', allocation: 0.4, selection: 0.3 },
  { sector: 'Consumer', allocation: 0.2, selection: -0.1 },
  { sector: 'Industrial', allocation: 0.1, selection: 0.4 },
  { sector: 'FGN Bonds', allocation: 0.6, selection: 0.2 },
];

export default function Performance() {
  const { data: funds = [] } = useQuery({
    queryKey: ['funds'],
    queryFn: () => base44.entities.Fund.list(),
  });

  return (
    <div className="dark">
      <SectionHeader title="Performance & Attribution" subtitle="Transaction-based TWR · Brinson-Fachler attribution" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Fund Return (YTD)" value="+18.4%" subtitle="Net of fees" icon={TrendingUp} />
        <StatCard label="Benchmark (NGX ASI YTD)" value="+15.2%" subtitle="NGX All Share Index" icon={Target} />
        <StatCard label="Excess Return (Alpha)" value="+3.2%" subtitle="↑ Outperforming" icon={Award} />
        <StatCard label="Sharpe Ratio" value="1.48" subtitle="↑ Strong risk-adj." icon={BarChart3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Monthly Returns */}
        <div className="bg-navy-light rounded-xl border border-white/5 p-5">
          <h3 className="text-white text-sm font-semibold mb-1">Return vs Benchmark — Monthly</h3>
          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: '#0b1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                <Bar dataKey="fund" fill="#00d4aa" radius={[3, 3, 0, 0]} name="Fund" />
                <Bar dataKey="benchmark" fill="rgba(255,255,255,0.15)" radius={[3, 3, 0, 0]} name="Benchmark" />
                <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attribution */}
        <div className="bg-navy-light rounded-xl border border-white/5 p-5">
          <h3 className="text-white text-sm font-semibold mb-1">Brinson-Fachler Attribution (YTD)</h3>
          <p className="text-white/30 text-xs mb-4">Allocation + Selection effect by sector</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attributionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="sector" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: '#0b1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
                <ReferenceLine x={0} stroke="rgba(255,255,255,0.1)" />
                <Bar dataKey="allocation" fill="#00d4aa" radius={[0, 3, 3, 0]} name="Allocation" />
                <Bar dataKey="selection" fill="#f5a623" radius={[0, 3, 3, 0]} name="Selection" />
                <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Fund Performance Table */}
      <div className="bg-navy-light rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-white text-sm font-semibold">Fund Performance Summary</h3>
          <p className="text-white/30 text-[10px] font-mono mt-1">All periods · Net of management fee (1.5%)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-white/30 border-b border-white/5">
                <th className="text-left px-4 py-3 font-medium">Fund</th>
                <th className="text-right px-4 py-3 font-medium">1M</th>
                <th className="text-right px-4 py-3 font-medium">3M</th>
                <th className="text-right px-4 py-3 font-medium">6M</th>
                <th className="text-right px-4 py-3 font-medium">YTD</th>
                <th className="text-right px-4 py-3 font-medium">1Y</th>
                <th className="text-right px-4 py-3 font-medium">3Y (p.a.)</th>
                <th className="text-right px-4 py-3 font-medium">Since Inc.</th>
                <th className="text-left px-4 py-3 font-medium">Benchmark</th>
                <th className="text-right px-4 py-3 font-medium">Alpha</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((fund) => (
                <tr key={fund.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white/80 font-medium">{fund.short_name || fund.name}</td>
                  <td className={`px-4 py-3 text-right font-mono ${getReturnColor(fund.return_1m)}`}>{formatPercent(fund.return_1m)}</td>
                  <td className={`px-4 py-3 text-right font-mono ${getReturnColor(fund.return_3m)}`}>{formatPercent(fund.return_3m)}</td>
                  <td className={`px-4 py-3 text-right font-mono ${getReturnColor(fund.return_6m)}`}>{formatPercent(fund.return_6m)}</td>
                  <td className={`px-4 py-3 text-right font-mono font-bold ${getReturnColor(fund.return_ytd)}`}>{formatPercent(fund.return_ytd)}</td>
                  <td className={`px-4 py-3 text-right font-mono ${getReturnColor(fund.return_1y)}`}>{formatPercent(fund.return_1y)}</td>
                  <td className={`px-4 py-3 text-right font-mono ${getReturnColor(fund.return_3y_pa)}`}>{formatPercent(fund.return_3y_pa)}</td>
                  <td className={`px-4 py-3 text-right font-mono ${getReturnColor(fund.return_since_inception)}`}>{formatPercent(fund.return_since_inception)}</td>
                  <td className="px-4 py-3 text-white/40">{fund.benchmark || '-'}</td>
                  <td className={`px-4 py-3 text-right font-mono font-bold ${getReturnColor(fund.alpha)}`}>{formatPercent(fund.alpha)}</td>
                </tr>
              ))}
              {funds.length === 0 && (
                <tr><td colSpan={10} className="text-center py-12 text-white/30">No fund data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}