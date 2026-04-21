import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { formatNaira } from '@/lib/formatters';
import SectionHeader from '@/components/backoffice/SectionHeader';
import StatCard from '@/components/backoffice/StatCard';
import { Users, User, Crown, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Investors() {
  const { data: investors = [] } = useQuery({
    queryKey: ['investors'],
    queryFn: () => base44.entities.Investor.list('-created_date', 100),
  });

  const retail = investors.filter(i => i.investor_type === 'retail');
  const hni = investors.filter(i => i.investor_type === 'hni');
  const institutional = investors.filter(i => i.investor_type === 'institutional');

  const pieData = [
    { name: 'Retail', value: retail.length, color: '#00d4aa' },
    { name: 'HNI', value: hni.length, color: '#f5a623' },
    { name: 'Institutional', value: institutional.length, color: '#3d9eff' },
  ];

  const kycStyle = {
    verified: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    pending: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    rejected: 'bg-red-400/10 text-red-400 border-red-400/20',
  };

  const typeStyle = {
    retail: 'bg-teal/10 text-teal border-teal/20',
    hni: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    institutional: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  };

  return (
    <div className="dark">
      <SectionHeader title="Investor Portal & CRM" subtitle={`${investors.length} active investors · Digital onboarding enabled`} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Investors" value={investors.length} subtitle={`↑ ${investors.filter(i => {
          const d = new Date(i.created_date);
          const now = new Date();
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length} new this month`} icon={Users} />
        <StatCard label="Retail (< ₦10M)" value={retail.length} subtitle={`${((retail.length / (investors.length || 1)) * 100).toFixed(1)}% of base`} icon={User} />
        <StatCard label="HNI (₦10M – ₦1B)" value={hni.length} subtitle={formatNaira(hni.reduce((s, i) => s + (i.aum || 0), 0), true) + ' AUM'} icon={Crown} />
        <StatCard label="Institutional" value={institutional.length} subtitle={formatNaira(institutional.reduce((s, i) => s + (i.aum || 0), 0), true) + ' AUM'} icon={Building2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Investor Table */}
        <div className="lg:col-span-2 bg-navy-light rounded-xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-white text-sm font-semibold">Recent Investors</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-white/30 border-b border-white/5">
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-center px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Fund</th>
                  <th className="text-right px-4 py-3 font-medium">AUM (₦)</th>
                  <th className="text-center px-4 py-3 font-medium">KYC</th>
                </tr>
              </thead>
              <tbody>
                {investors.map((inv) => (
                  <tr key={inv.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-white/80 font-medium">{inv.name}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="outline" className={`text-[10px] font-mono uppercase ${typeStyle[inv.investor_type] || ''}`}>
                        {inv.investor_type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-white/50">{inv.fund_name || '-'}</td>
                    <td className="px-4 py-3 text-right text-white font-mono">{formatNaira(inv.aum)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="outline" className={`text-[10px] font-mono uppercase ${kycStyle[inv.kyc_status] || ''}`}>
                        {inv.kyc_status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {investors.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 text-white/30">No investors yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-navy-light rounded-xl border border-white/5 p-5">
          <h3 className="text-white text-sm font-semibold mb-4">Investor AUM Breakdown</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0b1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-white/60">{d.name}</span>
                </div>
                <span className="text-white font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}