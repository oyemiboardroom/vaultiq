import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { formatNaira, formatPercent, getReturnColorLight } from '@/lib/formatters';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Landmark, Wallet, TrendingUp, Building2, DollarSign } from 'lucide-react';

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'mutual_fund', label: 'Mutual Funds' },
  { key: 'equity', label: 'Stocks' },
  { key: 'fixed_income', label: 'Fixed Income' },
];

// Map Holding security_type to our tab keys
const typeToTab = {
  equity: 'equity',
  fgn_bond: 'fixed_income',
  corp_bond: 'fixed_income',
  tbill: 'fixed_income',
  commercial_paper: 'fixed_income',
  reit: 'mutual_fund',
  etf: 'mutual_fund',
  cash: 'all',
};

const securityIcons = {
  equity: BarChart3,
  fgn_bond: Landmark,
  corp_bond: Building2,
  tbill: DollarSign,
  commercial_paper: DollarSign,
  reit: Building2,
  etf: TrendingUp,
  cash: Wallet,
};

const securityTypeLabel = {
  equity: 'Equity',
  fgn_bond: 'FGN Bond',
  corp_bond: 'Corp. Bond',
  tbill: 'T-Bill',
  commercial_paper: 'Comm. Paper',
  reit: 'REIT',
  etf: 'ETF',
  cash: 'Cash',
};

export default function Securities() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || 'all';
  const [activeTab, setActiveTab] = useState(initialTab);

  const { data: holdings = [] } = useQuery({
    queryKey: ['holdings'],
    queryFn: () => base44.entities.Holding.list(),
  });

  const filtered = holdings.filter(h => {
    if (activeTab === 'all') return true;
    return typeToTab[h.security_type] === activeTab;
  });

  // Group by security_type within tab
  const grouped = filtered.reduce((acc, h) => {
    const group = securityTypeLabel[h.security_type] || h.security_type || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(h);
    return acc;
  }, {});

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-foreground text-xl font-display font-semibold mb-1">Securities</h1>
      <p className="text-muted-foreground text-xs mb-4">{holdings.length} securities across all funds</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="bg-muted h-8 w-full">
          {tabs.map(t => (
            <TabsTrigger key={t.key} value={t.key} className="text-[11px] flex-1">{t.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">No securities found</div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([groupName, items]) => (
            <div key={groupName}>
              {activeTab === 'all' && (
                <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider mb-2">{groupName}</p>
              )}
              <div className="space-y-2">
                {items.map(h => {
                  const Icon = securityIcons[h.security_type] || BarChart3;
                  const pnlColor = h.pnl_percent > 0 ? 'text-emerald-600' : h.pnl_percent < 0 ? 'text-red-500' : 'text-muted-foreground';
                  const changeColor = h.change_7d > 0 ? 'text-emerald-600' : h.change_7d < 0 ? 'text-red-500' : 'text-muted-foreground';
                  return (
                    <div key={h.id} className="bg-card rounded-xl border border-border p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0">
                              <p className="text-foreground text-sm font-semibold truncate">{h.security_name}</p>
                              <p className="text-muted-foreground text-[10px] mt-0.5">{h.ticker} · {h.sector || securityTypeLabel[h.security_type]}</p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-2">
                              <p className="text-foreground text-sm font-mono font-bold">{formatNaira(h.current_price)}</p>
                              {h.change_7d != null && (
                                <p className={`text-[10px] font-medium ${changeColor}`}>
                                  {h.change_7d > 0 ? '↑' : h.change_7d < 0 ? '↓' : ''} {Math.abs(h.change_7d).toFixed(2)}% 7d
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                            <span className="text-muted-foreground text-[10px]">Mkt Value: {formatNaira(h.market_value, true)}</span>
                            <span className="text-muted-foreground text-[10px]">Weight: {h.weight != null ? `${h.weight.toFixed(1)}%` : '—'}</span>
                            {h.pnl_percent != null && (
                              <span className={`text-[10px] font-medium ${pnlColor}`}>
                                P&L: {h.pnl_percent > 0 ? '+' : ''}{h.pnl_percent?.toFixed(2)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}