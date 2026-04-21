import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { formatNaira } from '@/lib/formatters';
import { TrendingUp, Wallet, ArrowDownRight, ArrowUpRight, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const typeConfig = {
  subscription: { icon: TrendingUp, color: 'bg-primary/10 text-primary', sign: '-' },
  redemption: { icon: Wallet, color: 'bg-accent/10 text-accent', sign: '+' },
  dividend: { icon: ArrowDownRight, color: 'bg-emerald-100 text-emerald-600', sign: '+' },
  interest: { icon: ArrowDownRight, color: 'bg-emerald-100 text-emerald-600', sign: '+' },
  auto_invest: { icon: RefreshCw, color: 'bg-blue-100 text-blue-600', sign: '-' },
};

const statusStyle = {
  settled: 'text-emerald-600',
  credited: 'text-emerald-600',
  paid_out: 'text-emerald-600',
  pending: 'text-amber-500',
  cancelled: 'text-red-500',
};

export default function Activity() {
  const { user } = useCurrentUser();

  const { data: transactions = [] } = useQuery({
    queryKey: ['my-transactions', user?.email],
    queryFn: () => base44.entities.Transaction.filter({ created_by: user.email }, '-created_date', 50),
    enabled: !!user?.email,
  });

  // Group by date
  const grouped = transactions.reduce((acc, tx) => {
    const date = tx.created_date ? format(new Date(tx.created_date), 'dd MMM yyyy') : 'Unknown';
    if (!acc[date]) acc[date] = [];
    acc[date].push(tx);
    return acc;
  }, {});

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-foreground text-xl font-display font-semibold mb-5">Transactions</h1>

      {Object.entries(grouped).length > 0 ? (
        Object.entries(grouped).map(([date, txs]) => (
          <div key={date} className="mb-5">
            <p className="text-muted-foreground text-xs font-medium mb-2">{date}</p>
            <div className="space-y-2">
              {txs.map((tx) => {
                const cfg = typeConfig[tx.transaction_type] || typeConfig.subscription;
                const Icon = cfg.icon;
                return (
                  <div key={tx.id} className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cfg.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm font-medium truncate">
                        {tx.transaction_type?.charAt(0).toUpperCase() + tx.transaction_type?.slice(1).replace('_', '-')} — {tx.fund_name}
                      </p>
                      <p className="text-muted-foreground text-[10px] mt-0.5">{tx.reference || ''}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-mono font-semibold ${cfg.sign === '+' ? 'text-emerald-600' : 'text-foreground'}`}>
                        {cfg.sign}{formatNaira(tx.amount)}
                      </p>
                      <p className={`text-[10px] capitalize ${statusStyle[tx.status] || 'text-muted-foreground'}`}>
                        {tx.status?.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">No transactions yet</p>
        </div>
      )}
    </div>
  );
}