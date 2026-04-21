import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SectionHeader from '@/components/backoffice/SectionHeader';
import StatCard from '@/components/backoffice/StatCard';
import { ClipboardCheck, AlertCircle, Activity, Layers } from 'lucide-react';
import { CheckCircle2, Loader2, Clock } from 'lucide-react';

const reconData = [
  { security: 'DANGCEM', ibor: '1,420,000', cscs: '1,418,500', diff: '-1,500', status: 'break' },
  { security: 'ZENITHBANK', ibor: '3,800,000', cscs: '3,800,000', diff: '0', status: 'matched' },
  { security: 'FGN APR-2031', ibor: '₦5,000,000,000', cscs: '₦4,980,000,000', diff: '-₦20M', status: 'break' },
  { security: 'GTCO', ibor: '2,100,000', cscs: '2,100,000', diff: '0', status: 'matched' },
  { security: 'AIRTELAFRI', ibor: '880,000', cscs: '880,000', diff: '0', status: 'matched' },
];

const statusIcon = {
  completed: { icon: CheckCircle2, color: 'text-emerald-400', label: '✓' },
  running: { icon: Loader2, color: 'text-amber-400', spin: true, label: 'Running...' },
  pending: { icon: Clock, color: 'text-white/20', label: 'Pending' },
  failed: { icon: AlertCircle, color: 'text-red-400', label: 'Failed' },
};

export default function Operations() {
  const queryClient = useQueryClient();
  const { data: tasks = [] } = useQuery({
    queryKey: ['ops-tasks'],
    queryFn: () => base44.entities.OperationsTask.list('sort_order'),
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }) => base44.entities.OperationsTask.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ops-tasks'] }),
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const breaks = reconData.filter(r => r.status === 'break').length;

  return (
    <div className="dark">
      <SectionHeader title="Operations Hub" subtitle="Exception-based workflows · Middle & back office" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Trades to Confirm" value="8" subtitle="2 approaching deadline" icon={ClipboardCheck} />
        <StatCard label="Recon Breaks" value={breaks} subtitle="Needs investigation" icon={AlertCircle} />
        <StatCard label="NAV Progress" value="68%" subtitle="In calculation" icon={Activity} />
        <StatCard label="Corporate Actions" value="3" subtitle="Pending processing" icon={Layers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Checklist */}
        <div className="bg-navy-light rounded-xl border border-white/5 p-5">
          <h3 className="text-white text-sm font-semibold mb-1">Daily Process Checklist</h3>
          <p className="text-white/30 text-xs mb-4">08 Apr 2026 — End of day</p>
          <div className="space-y-3">
            {tasks.map((task) => {
              const cfg = statusIcon[task.status] || statusIcon.pending;
              const Icon = cfg.icon;
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 group cursor-pointer"
                  onClick={() => {
                    if (task.status === 'pending') {
                      updateTask.mutate({ id: task.id, data: { status: 'running' } });
                    } else if (task.status === 'running') {
                      const now = new Date();
                      updateTask.mutate({ id: task.id, data: { status: 'completed', completed_time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}` } });
                    }
                  }}
                >
                  <div className={`w-6 h-6 rounded-full border ${task.status === 'completed' ? 'bg-emerald-400/10 border-emerald-400/30' : 'border-white/10'} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${cfg.color} ${cfg.spin ? 'animate-spin' : ''}`} />
                  </div>
                  <span className={`text-xs flex-1 ${task.status === 'completed' ? 'text-white/40 line-through' : 'text-white/70'}`}>
                    {task.task_name}
                  </span>
                  <span className="text-white/20 text-[10px] font-mono">
                    {task.completed_time || cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reconciliation */}
        <div className="bg-navy-light rounded-xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-white text-sm font-semibold">Reconciliation Exceptions</h3>
            <p className="text-white/30 text-[10px] font-mono mt-1">IBOR vs CSCS — Breaks require action</p>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-white/30 border-b border-white/5">
                <th className="text-left px-4 py-2 font-medium">Security</th>
                <th className="text-right px-4 py-2 font-medium">IBOR Qty</th>
                <th className="text-right px-4 py-2 font-medium">CSCS Qty</th>
                <th className="text-right px-4 py-2 font-medium">Diff</th>
                <th className="text-center px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {reconData.map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="px-4 py-3 text-white/80 font-mono font-medium">{row.security}</td>
                  <td className="px-4 py-3 text-right text-white/60 font-mono">{row.ibor}</td>
                  <td className="px-4 py-3 text-right text-white/60 font-mono">{row.cscs}</td>
                  <td className={`px-4 py-3 text-right font-mono font-medium ${row.status === 'break' ? 'text-red-400' : 'text-white/30'}`}>{row.diff}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      row.status === 'break' ? 'bg-red-400/10 text-red-400' : 'bg-emerald-400/10 text-emerald-400'
                    }`}>
                      {row.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}