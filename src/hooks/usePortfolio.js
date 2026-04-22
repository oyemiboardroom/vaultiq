import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export function usePortfolio() {
  const { user } = useCurrentUser();

  const { data: myTransactions = [], isLoading } = useQuery({
    queryKey: ['my-transactions', user?.email],
    queryFn: () => base44.entities.Transaction.filter({ created_by: user.email }),
    enabled: !!user?.email,
  });

  const totalInvested = myTransactions
    .filter(t => t.transaction_type === 'subscription' || t.transaction_type === 'auto_invest')
    .filter(t => t.status !== 'cancelled')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalRedeemed = myTransactions
    .filter(t => t.transaction_type === 'redemption')
    .filter(t => t.status !== 'cancelled')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const invested = totalInvested - totalRedeemed;
  const totalValue = invested > 0 ? invested * 1.112 : 0;
  const totalGain = totalValue - invested;
  const gainPercent = invested > 0 ? (totalGain / invested) * 100 : 0;
  const dailyChange = totalValue * 0.0091;

  // Per-fund: invested amounts and units accumulated
  const byFund = myTransactions.reduce((acc, t) => {
    if (t.status === 'cancelled') return acc;
    const fn = t.fund_name;
    if (!acc[fn]) acc[fn] = { invested: 0, units: 0 };
    if (t.transaction_type === 'subscription' || t.transaction_type === 'auto_invest') {
      acc[fn].invested += t.amount || 0;
      acc[fn].units += t.units || 0;
    }
    if (t.transaction_type === 'redemption') {
      acc[fn].invested -= t.amount || 0;
      acc[fn].units -= t.units || 0;
    }
    return acc;
  }, {});

  return { invested, totalValue, totalGain, gainPercent, dailyChange, byFund, isLoading, user };
}