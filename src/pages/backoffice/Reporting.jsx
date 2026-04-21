import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SectionHeader from '@/components/backoffice/SectionHeader';
import StatCard from '@/components/backoffice/StatCard';
import { FileText, Clock, CheckCircle2, File } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const statusStyle = {
  not_started: { bg: 'bg-white/5 text-white/30', label: 'NOT STARTED' },
  in_progress: { bg: 'bg-blue-400/10 text-blue-400', label: 'IN PROGRESS' },
  due_soon: { bg: 'bg-amber-400/10 text-amber-400', label: 'DUE SOON' },
  submitted: { bg: 'bg-emerald-400/10 text-emerald-400', label: 'SUBMITTED' },
  overdue: { bg: 'bg-red-400/10 text-red-400', label: 'OVERDUE' },
};

const regulatorLabels = {
  sec_nigeria: 'SEC Nigeria',
  firs: 'FIRS',
  naicom: 'NAICOM',
  nfiu: 'SEC / NFIU',
};

export default function Reporting() {
  const { data: reports = [] } = useQuery({
    queryKey: ['reports'],
    queryFn: () => base44.entities.RegulatoryReport.list('due_date'),
  });

  const submitted = reports.filter(r => r.status === 'submitted').length;
  const dueSoon = reports.filter(r => r.status === 'due_soon' || r.status === 'in_progress').length;

  return (
    <div className="dark">
      <SectionHeader title="Regulatory Reporting" subtitle="Automated SEC Nigeria · FIRS · NAICOM submissions" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Reports This Month" value={reports.length} subtitle={`${submitted} submitted · ${dueSoon} due`} icon={FileText} />
        <StatCard label="Next Due" value={dueSoon} subtitle="Due 15 Apr 2026" icon={Clock} />
        <StatCard label="SEC Compliance Score" value="98%" subtitle="No late submissions" icon={CheckCircle2} />
        <StatCard label="Tax Certificates Issued" value="1,240" subtitle="FY2025 complete" icon={File} />
      </div>

      <div className="bg-navy-light rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-white text-sm font-semibold">Report Schedule — April 2026</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-white/30 border-b border-white/5">
                <th className="text-left px-4 py-3 font-medium">Report Name</th>
                <th className="text-left px-4 py-3 font-medium">Regulator</th>
                <th className="text-left px-4 py-3 font-medium">Frequency</th>
                <th className="text-left px-4 py-3 font-medium">Due Date</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => {
                const style = statusStyle[report.status] || statusStyle.not_started;
                return (
                  <tr key={report.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-white/80 font-medium">{report.report_name}</td>
                    <td className="px-4 py-3 text-white/50">{regulatorLabels[report.regulator] || report.regulator}</td>
                    <td className="px-4 py-3 text-white/40 capitalize">{report.frequency}</td>
                    <td className="px-4 py-3 text-white/60 font-mono">{report.due_date || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${style.bg}`}>
                        {style.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {report.status === 'submitted' ? (
                        <Button variant="ghost" size="sm" className="text-teal text-[10px] h-6 px-2">View →</Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-teal text-[10px] h-6 px-2">
                          {report.status === 'in_progress' ? 'Submit →' : report.status === 'not_started' ? 'Start →' : 'Draft →'}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {reports.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-white/30">No reports scheduled</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}