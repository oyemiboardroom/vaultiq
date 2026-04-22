import React, { useState } from 'react';
import { formatNaira } from '@/lib/formatters';
import { useWallet } from '@/hooks/useWallet';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, Copy, Wallet, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const VIRTUAL_ACCOUNT = { bank: 'Providus Bank', number: '6500123456', name: 'VaultIQ / {name}' };

const typeIcon = {
  credit: { icon: ArrowDownLeft, color: 'bg-emerald-100 text-emerald-600', sign: '+', label: 'Credit' },
  debit: { icon: ArrowUpRight, color: 'bg-primary/10 text-primary', sign: '-', label: 'Investment' },
  withdrawal: { icon: ArrowUpRight, color: 'bg-accent/10 text-accent', sign: '-', label: 'Withdrawal' },
};

const statusIcon = {
  completed: <CheckCircle2 className="w-3 h-3 text-emerald-500" />,
  pending: <Clock className="w-3 h-3 text-amber-500" />,
  failed: <AlertCircle className="w-3 h-3 text-red-500" />,
};

// Hardcoded linked bank accounts (in a real app these come from the Investor profile)
const LINKED_BANKS = [
  { bank_name: 'GTBank', bank_account: '0123456789' },
  { bank_name: 'Access Bank', bank_account: '9876543210' },
];

export default function WalletPage() {
  const { user } = useCurrentUser();
  const { balance, transactions, isLoading, withdraw } = useWallet();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const accountName = VIRTUAL_ACCOUNT.name.replace('{name}', user?.full_name || 'Investor');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleWithdraw = async () => {
    setError('');
    const amt = Number(withdrawAmount);
    if (!selectedBank) { setError('Select a bank account.'); return; }
    if (!amt || amt <= 0) { setError('Enter a valid amount.'); return; }
    if (amt > balance) { setError('Insufficient wallet balance.'); return; }
    setIsProcessing(true);
    await withdraw(amt, selectedBank.bank_name, selectedBank.bank_account);
    setIsProcessing(false);
    setSuccess(true);
    setWithdrawAmount('');
    setSelectedBank(null);
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-foreground text-xl font-display font-semibold mb-5">Wallet</h1>

      {/* Balance Card */}
      <div className="bg-primary rounded-2xl p-5 mb-5 text-primary-foreground">
        <p className="text-primary-foreground/60 text-xs uppercase tracking-wider font-medium">Available Balance</p>
        <p className="text-3xl font-display font-bold mt-1">{isLoading ? '—' : formatNaira(Math.max(0, balance))}</p>
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            onClick={() => { setShowWithdraw(true); setSuccess(false); setError(''); }}
            className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/20 text-xs"
          >
            Withdraw
          </Button>
        </div>
      </div>

      {/* Virtual Account */}
      <div className="bg-gold-light rounded-xl p-4 mb-5 border border-accent/20">
        <p className="text-accent text-[10px] font-medium uppercase tracking-wider mb-2">Fund Your Wallet</p>
        <p className="text-muted-foreground text-xs mb-3">Transfer to this account to top up your wallet balance.</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">Bank</span>
            <span className="text-foreground text-xs font-semibold">{VIRTUAL_ACCOUNT.bank}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">Account Number</span>
            <button
              onClick={() => handleCopy(VIRTUAL_ACCOUNT.number)}
              className="flex items-center gap-1.5 text-foreground text-xs font-mono font-semibold"
            >
              {VIRTUAL_ACCOUNT.number}
              <Copy className="w-3 h-3 text-accent" />
              {copied && <span className="text-accent text-[10px]">Copied!</span>}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">Account Name</span>
            <span className="text-foreground text-xs font-semibold">{accountName}</span>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <h3 className="text-foreground text-sm font-semibold mb-3">Wallet History</h3>
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <Wallet className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No wallet activity yet</p>
          <p className="text-muted-foreground text-xs mt-1">Fund your wallet using the virtual account above</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => {
            const cfg = typeIcon[tx.type] || typeIcon.debit;
            const Icon = cfg.icon;
            return (
              <div key={tx.id} className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cfg.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium truncate">{tx.description || cfg.label}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {statusIcon[tx.status]}
                    <p className="text-muted-foreground text-[10px] capitalize">{tx.status}</p>
                    {tx.created_date && (
                      <p className="text-muted-foreground text-[10px]">· {format(new Date(tx.created_date), 'dd MMM, HH:mm')}</p>
                    )}
                  </div>
                </div>
                <p className={`text-sm font-mono font-semibold flex-shrink-0 ${tx.type === 'credit' ? 'text-emerald-600' : 'text-foreground'}`}>
                  {cfg.sign}{formatNaira(tx.amount)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Withdrawal Dialog */}
      <Dialog open={showWithdraw} onOpenChange={(o) => { setShowWithdraw(o); setSuccess(false); setError(''); }}>
        <DialogContent className="max-w-sm">
          {success ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-lg font-display font-bold mb-1">Withdrawal Initiated</h2>
              <p className="text-muted-foreground text-sm">Your withdrawal is being processed and will be credited to your bank account within 1 business day.</p>
              <Button onClick={() => setShowWithdraw(false)} className="mt-5 w-full">Done</Button>
            </div>
          ) : (
            <div className="py-2">
              <h2 className="text-lg font-display font-bold mb-1">Withdraw Funds</h2>
              <p className="text-muted-foreground text-xs mb-4">Available: <span className="font-semibold text-foreground">{formatNaira(Math.max(0, balance))}</span></p>

              <p className="text-foreground text-sm font-medium mb-2">Select Bank Account</p>
              <div className="space-y-2 mb-4">
                {LINKED_BANKS.map((b) => (
                  <button
                    key={b.bank_account}
                    onClick={() => setSelectedBank(b)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selectedBank?.bank_account === b.bank_account ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:border-primary/30'}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-xs font-bold text-foreground">{b.bank_name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-medium">{b.bank_name}</p>
                      <p className="text-muted-foreground text-xs">··{b.bank_account.slice(-4)}</p>
                    </div>
                    {selectedBank?.bank_account === b.bank_account && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
                  </button>
                ))}
              </div>

              <p className="text-foreground text-sm font-medium mb-2">Amount</p>
              <Input
                type="number"
                placeholder="Enter amount (₦)"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="font-mono mb-1"
              />
              {error && <p className="text-destructive text-xs mt-1 mb-2">{error}</p>}

              <Button
                onClick={handleWithdraw}
                disabled={isProcessing}
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isProcessing ? 'Processing...' : 'Confirm Withdrawal'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}