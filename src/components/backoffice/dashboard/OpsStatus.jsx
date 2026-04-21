import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, Loader2, Clock } from 'lucide-react';

const statusConfig = {
  completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  running: { icon: Loader2, color: 'text-amber-400', bg: 'bg-amber-400/10', spin: true },
  pending: { icon: Clock, color: 'text-white/30', bg: 'bg-white/5' },
  failed: { icon: Clock, color: 'text-red-400', bg: 'bg-red-400/10' },
};

export default function OpsStatus() {
  const { data: tasks = [] } = useQuery({
    queryKey: ['ops-tasks'],
    queryFn: () => base44.entities.OperationsTask.list('sort_order'),
  });

  return (
    <div className="bg-navy-light rounded-xl border border-white/5 p-5">
      <h3 className="text-white text-sm font-semibold mb-1">Operations Status</h3>
      <p className="text-white/30 text-xs mb-4">Today · 08 Apr 2026</p>

      <div className="space-y-2.5">
        {tasks.map((task) => {
          const cfg = statusConfig[task.status] || statusConfig.pending;
          const Icon = cfg.icon;
          return (
            <div key={task.id} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${cfg.color} ${cfg.spin ? 'animate-spin' : ''}`} />
              </div>
              <span className="text-white/60 text-xs flex-1">{task.task_name}</span>
              <span className="text-white/30 text-[10px] font-mono">
                {task.completed_time || (task.status === 'running' ? 'In progress' : 'Pending')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}