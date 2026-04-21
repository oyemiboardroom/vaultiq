import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { formatNaira } from '@/lib/formatters';
import SectionHeader from '@/components/backoffice/SectionHeader';
import StatCard from '@/components/backoffice/StatCard';
import { ArrowRightLeft, Banknote, Activity, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const statusStyles = {
  open: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  partial: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  filled: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  cancelled: 'bg-white/5 text-white/30 border-white/10',
  rejected: 'bg-red-400/10 text-red-400 border-red-400/20',
};

export default function Orders() {
  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 50),
  });

  const filled = orders.filter(o => o.status === 'filled').length;
  const open = orders.filter(o => o.status === 'open' || o.status === 'partial').length;
  const totalValue = orders.reduce((sum, o) => sum + ((o.avg_price || o.limit_price || 0) * (o.filled_quantity || o.quantity || 0)), 0);

  return (
    <div className="dark">
      <SectionHeader
        title="Order & Trade Management"
        subtitle="Live order blotter · FIX connectivity active"
        live
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Orders Today" value={orders.length} subtitle={`${filled} filled · ${open} open`} icon={ArrowRightLeft} />
        <StatCard label="Trade Value" value={formatNaira(totalValue, true)} subtitle="↑ Active market day" icon={Banknote} />
        <StatCard label="Avg Fill Rate" value="94.2%" subtitle="↑ Above 90% target" icon={Activity} />
        <StatCard label="Pending Settlement" value="₦620M" subtitle="T+0 → T+3 pipeline" icon={Clock} />
      </div>

      <div className="bg-navy-light rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-white text-sm font-semibold">Order Blotter</h3>
          <p className="text-white/30 text-[10px] font-mono mt-1">Today's orders · All funds</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-white/30 border-b border-white/5">
                <th className="text-left px-4 py-3 font-medium">Order ID</th>
                <th className="text-left px-4 py-3 font-medium">Time</th>
                <th className="text-left px-4 py-3 font-medium">Security</th>
                <th className="text-left px-4 py-3 font-medium">Fund</th>
                <th className="text-left px-4 py-3 font-medium">Side</th>
                <th className="text-right px-4 py-3 font-medium">Qty</th>
                <th className="text-right px-4 py-3 font-medium">Limit (₦)</th>
                <th className="text-right px-4 py-3 font-medium">Filled</th>
                <th className="text-right px-4 py-3 font-medium">Avg Price</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Broker</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-teal font-mono">{order.order_id}</td>
                  <td className="px-4 py-3 text-white/40 font-mono">{order.order_time || '-'}</td>
                  <td className="px-4 py-3 text-white/80 font-medium">{order.security_name}</td>
                  <td className="px-4 py-3 text-white/50">{order.fund_name}</td>
                  <td className="px-4 py-3">
                    <span className={`font-mono font-bold uppercase ${order.side === 'buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {order.side}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-white/60 font-mono">{(order.quantity || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-white/60 font-mono">{formatNaira(order.limit_price)}</td>
                  <td className="px-4 py-3 text-right text-white font-mono">{(order.filled_quantity || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-white font-mono">{order.avg_price ? formatNaira(order.avg_price) : '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="outline" className={`text-[10px] font-mono uppercase ${statusStyles[order.status] || ''}`}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-white/40">{order.broker || '-'}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-white/30">No orders today</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}