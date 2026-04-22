import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { formatNaira, formatPercent, getReturnColorLight } from '@/lib/formatters';
import { BarChart3, Landmark, Wallet, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useWallet } from '@/hooks/useWallet';
import { Link } from 'react-router-dom';

const icons = { equities: BarChart3, fixed_income: Landmark, money_market: Wallet, balanced: TrendingUp, real_estate: Landmark, dollar_fund: Wallet };

const assetClassTabs = [
  { value: 'all', label: 'All' },
  { value: 'equities', label: 'Equities' },
  { value: 'fixed_income', label: 'Fixed Income' },
  { value: 'money_market', label: 'Money Market' },
  { value: 'balanced', label: 'Balanced' },
];

export default function Invest() {
  const [selectedFund, setSelectedFund] = useState(null);
  const [amount, setAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const { balance, debit } = useWallet();
  const amountRef = useRef(null);

  const { data: funds = [] } = useQuery({
    queryKey: ['funds'],
    queryFn: () => base44.entities.Fund.list(),
  });

  const activeFunds = funds.filter(f => f.status === 'active');
  const filteredFunds = activeTab === 'all' ? activeFunds : activeFunds.filter(f => f.asset_class === activeTab);

  // Auto-select fund from URL param (e.g. coming from FundDetail)
  useEffect(() => {
    if (funds.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const fundId = params.get('fundId');
    if (!fundId) return;
    const match = funds.find(f => f.id === fundId);
    if (match) {
      setSelectedFund(match);
      // Switch tab to match the fund's asset class
      setActiveTab(match.asset_class || 'all');
      // Focus amount input after a short delay to let the component render
      setTimeout(() => amountRef.current?.focus(), 150);
    }
  }, [funds]);

  // Only show tabs that have funds
  const availableTabs = assetClassTabs.filter(tab =>
    tab.value === 'all' || activeFunds.some(f => f.asset_class === tab.value)
  );

  const investAmount = Number(amount);
  const hasInsufficientBalance = investAmount > 0 && investAmount > balance;

  const handleInvest = async () => {
    if (!selectedFund || !amount || !user) return;
    if (investAmount > balance) {
      setInsufficientFunds(true);
      return;
    }
    setIsSubmitting(true);
    const units = Math.floor(investAmount / (selectedFund.nav_per_unit || 1));

    // Debit wallet first
    await debit(investAmount, `Investment in ${selectedFund.short_name || selectedFund.name}`, `INV-${Date.now()}`);

    // Create transaction record
    await base44.entities.Transaction.create({
      investor_name: user.full_name || user.email,
      fund_name: selectedFund.name,
      transaction_type: 'subscription',
      amount: investAmount,
      units,
      nav_per_unit: selectedFund.nav_per_unit,
      status: 'pending',
      reference: `SUB-${Date.now()}`,
    });
    queryClient.invalidateQueries({ queryKey: ['my-transactions'] });
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-foreground text-xl font-display font-semibold mb-1">Invest</h1>

      {/* Wallet Balance */}
      <div className="bg-gold-light rounded-xl p-4 mb-5 border border-accent/20">
        <p className="text-accent text-[10px] font-medium uppercase tracking-wider">Wallet Balance</p>
        <p className="text-foreground text-xl font-bold font-display mt-0.5">{formatNaira(Math.max(0, balance))}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-muted-foreground text-[10px]">Top-up · 6500123456 · Providus Bank</p>
          <Link to="/investor/wallet" className="text-accent text-[10px] font-medium underline-offset-2 underline">Manage →</Link>
        </div>
      </div>

      {/* Asset Class Tabs */}
      <div className="mb-4">
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSelectedFund(null); }}>
          <TabsList className="bg-muted h-8 w-full flex">
            {availableTabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-[10px] h-6 flex-1 px-1">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <h3 className="text-foreground text-sm font-semibold mb-3">Choose a Fund</h3>

      {/* Fund Selection */}
      <div className="space-y-3 mb-6">
        {filteredFunds.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">No funds available in this category.</p>
        )}
        {filteredFunds.map((fund) => {
          const Icon = icons[fund.asset_class] || BarChart3;
          const isSelected = selectedFund?.id === fund.id;
          return (
            <button
              key={fund.id}
              onClick={() => setSelectedFund(fund)}
              className={`w-full text-left bg-card rounded-xl p-4 border transition-all ${
                isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground text-sm font-semibold truncate">{fund.short_name || fund.name}</p>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                  </div>
                  <p className="text-muted-foreground text-[10px] mt-0.5">{fund.description || fund.asset_class?.replace(/_/g, ' ')}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border">
                <div>
                  <p className="text-muted-foreground text-[9px]">1Y Return</p>
                  <p className={`text-xs font-mono font-semibold ${getReturnColorLight(fund.return_1y)}`}>{formatPercent(fund.return_1y)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[9px]">Risk</p>
                  <p className="text-xs font-medium text-foreground">{fund.risk_level?.replace('_', '-') || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[9px]">Min. Invest</p>
                  <p className="text-xs font-mono text-foreground">{formatNaira(fund.min_investment, true)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[9px]">NAV/unit</p>
                  <p className="text-xs font-mono text-foreground">{formatNaira(fund.nav_per_unit)}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Amount Input */}
      {selectedFund && (
        <div className="bg-card rounded-xl border border-border p-4 mb-4">
          <p className="text-foreground text-sm font-semibold mb-1">
            Invest in {selectedFund.short_name || selectedFund.name}
          </p>
          <p className="text-muted-foreground text-xs mb-3">
            NAV: {formatNaira(selectedFund.nav_per_unit)} / unit · Min. {formatNaira(selectedFund.min_investment, true)}
          </p>
          <Input
            ref={amountRef}
            type="number"
            placeholder="Amount (₦)"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setInsufficientFunds(false); }}
            className="text-lg font-mono mb-1"
          />
          {hasInsufficientBalance && (
            <div className="flex items-center gap-1.5 mt-1 mb-2">
              <AlertCircle className="w-3.5 h-3.5 text-destructive" />
              <p className="text-destructive text-xs">
                Insufficient wallet balance. <Link to="/investor/wallet" className="underline font-medium">Top up →</Link>
              </p>
            </div>
          )}
          {amount && !hasInsufficientBalance && (
            <p className="text-muted-foreground text-xs mb-2">
              ≈ {Math.floor(Number(amount) / (selectedFund.nav_per_unit || 1))} units · Settlement T+1
            </p>
          )}
          <div className="flex gap-2 mb-3 flex-wrap">
            {['50000', '100000', '500000', '1000000'].map((v) => (
              <button
                key={v}
                onClick={() => { setAmount(v); setInsufficientFunds(false); }}
                className="px-2.5 py-1 rounded-lg bg-muted text-xs font-medium text-foreground hover:bg-primary/10 transition-colors"
              >
                {formatNaira(Number(v), true)}
              </button>
            ))}
          </div>
          <Button
            onClick={handleInvest}
            disabled={isSubmitting || !amount || hasInsufficientBalance || Number(amount) < (selectedFund.min_investment || 0)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSubmitting ? 'Processing...' : 'Confirm Investment →'}
          </Button>
        </div>
      )}

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-sm text-center">
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-lg font-display font-bold mb-2">Investment Successful!</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Your investment has been placed. Units will be allocated at today's NAV after market close.
            </p>
            <div className="w-full bg-muted rounded-lg p-3 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fund</span>
                <span className="font-medium">{selectedFund?.short_name || selectedFund?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium font-mono">{formatNaira(investAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">NAV/Unit</span>
                <span className="font-medium font-mono">{formatNaira(selectedFund?.nav_per_unit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Units</span>
                <span className="font-medium font-mono">~{Math.floor(investAmount / (selectedFund?.nav_per_unit || 1))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wallet Balance</span>
                <span className="font-medium font-mono">{formatNaira(Math.max(0, balance))}</span>
              </div>
            </div>
            <Button onClick={() => { setShowSuccess(false); setAmount(''); setSelectedFund(null); }} className="mt-4 w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}