import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SectionHeader from '@/components/backoffice/SectionHeader';
import StatCard from '@/components/backoffice/StatCard';
import { Shield, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const statusStyle = {
  pass: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', label: 'PASS' },
  warning: { bg: 'bg-amber-400/10', text: 'text-amber-400', label: 'WARN' },
  breach: { bg: 'bg-red-400/10', text: 'text-red-400', label: 'BREACH' },
};

export default function Compliance() {
  const { data: rules = [] } = useQuery({
    queryKey: ['compliance-rules'],
    queryFn: () => base44.entities.ComplianceRule.list(),
  });

  const passing = rules.filter(r => r.status === 'pass').length;
  const warnings = rules.filter(r => r.status === 'warning').length;
  const breaches = rules.filter(r => r.status === 'breach').length;

  return (
    <div className="dark">
      <SectionHeader
        title="Investment Compliance"
        subtitle="Pre/post-trade monitoring · SEC Nigeria rules active"
      >
        {warnings > 0 && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-mono font-medium">
            <AlertTriangle className="w-3 h-3" />
            {warnings} WARNING{warnings > 1 ? 'S' : ''} ACTIVE
          </span>
        )}
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Rules Active" value={rules.length} subtitle="Across all funds" icon={Shield} />
        <StatCard label="Passing" value={passing} subtitle={`${rules.length > 0 ? ((passing / rules.length * 100).toFixed(1)) : 0}% pass rate`} icon={CheckCircle2} />
        <StatCard label="Warnings" value={warnings} subtitle="Needs review today" icon={AlertTriangle} />
        <StatCard label="Hard Breaches" value={breaches} subtitle={breaches > 0 ? 'Action required' : 'No blocks today'} icon={XCircle} />
      </div>

      <div className="bg-navy-light rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-white text-sm font-semibold">Active Rule Status</h3>
          <p className="text-white/30 text-[10px] font-mono mt-1">All portfolios · Post-trade</p>
        </div>

        <div className="divide-y divide-white/5">
          {rules.map((rule) => {
            const style = statusStyle[rule.status] || statusStyle.pass;
            return (
              <div key={rule.id} className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex-1">
                  <p className="text-white/80 text-sm font-medium">{rule.rule_name}</p>
                  <p className="text-white/30 text-xs mt-0.5">{rule.fund_name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white/60 text-xs font-mono">
                    {rule.current_value != null ? `${rule.current_value}%` : '-'} / {rule.limit_value != null ? `${rule.limit_value}%` : '-'}
                  </span>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${style.bg} ${style.text}`}>
                    {style.label}
                  </span>
                </div>
              </div>
            );
          })}
          {rules.length === 0 && (
            <div className="p-12 text-center text-white/30 text-sm">No compliance rules configured</div>
          )}
        </div>
      </div>
    </div>
  );
}