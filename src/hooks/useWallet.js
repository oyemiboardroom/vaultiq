import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export function useWallet() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['wallet-transactions', user?.email],
    queryFn: () => base44.entities.WalletTransaction.filter({ user_email: user.email }, '-created_date', 50),
    enabled: !!user?.email,
  });

  const balance = transactions.reduce((sum, t) => {
    if (t.status === 'failed') return sum;
    if (t.type === 'credit') return sum + (t.amount || 0);
    if (t.type === 'debit' || t.type === 'withdrawal') return sum - (t.amount || 0);
    return sum;
  }, 0);

  const debit = async (amount, description, reference) => {
    await base44.entities.WalletTransaction.create({
      user_email: user.email,
      type: 'debit',
      amount,
      description,
      reference,
      status: 'completed',
    });
    queryClient.invalidateQueries({ queryKey: ['wallet-transactions', user?.email] });
  };

  const withdraw = async (amount, bankName, bankAccount) => {
    await base44.entities.WalletTransaction.create({
      user_email: user.email,
      type: 'withdrawal',
      amount,
      description: `Withdrawal to ${bankName} ··${bankAccount.slice(-4)}`,
      reference: `WD-${Date.now()}`,
      bank_name: bankName,
      bank_account: bankAccount,
      status: 'pending',
    });
    queryClient.invalidateQueries({ queryKey: ['wallet-transactions', user?.email] });
  };

  return { balance, transactions, isLoading, debit, withdraw };
}