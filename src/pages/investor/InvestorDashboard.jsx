import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { formatNaira, formatPercent, getReturnColorLight } from '@/lib/formatters';
import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp, Wallet, History, FileText, BarChart3, Landmark } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { usePortfolio } from '@/hooks/usePortfolio';

const marketData = [
  { label: 'NGX ASI', value: '108,421', change: '+1.24%', up: true },
  { label: 'USD/NGN', value: '₦1,623', change: '-0.32%', up: false },
  { label: 'FGN 10Y', value: '19.8%', change: '+12bps', up: true },
  { label: '91D T-BILL', value: '26.4%', change: 'Unchanged', up: null },
];

export default function InvestorDashboard() {
  const { user } = useCurrentUser();
  const { invested, totalValue, totalGain, gainPercent, dailyChange } = usePortfolio();

  const { data: funds = [] } = useQuery({
    queryKey: ['funds'],
    queryFn: () => base44.entities.Fund.list(),
  });

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">Good morning,</p>
        <h1 className="text-foreground text-xl font-display font-semibold">{user?.full_name || 'Investor'}</h1>
      </div>

      {/* Portfolio Card */}
      <div className="bg-primary rounded-2xl p-5 mb-6 text-primary-foreground">
        <p className="text-primary-foreground/60 text-xs font-medium uppercase tracking-wider">Total Portfolio Value</p>
        <h2 className="text-3xl font-display font-bold mt-1">{totalValue > 0 ? formatNaira(totalValue) : '₦0.00'}</h2>
        {totalValue > 0 ? (
          <div className="flex items-center gap-1 mt-1.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-emerald-300 text-xs font-medium">+{formatNaira(dailyChange)} today (+0.91%)</span>
          </div>
        ) : (
          <p className="text-primary-foreground/50 text-xs mt-1.5">Start investing to grow your portfolio</p>
        )}

        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-primary-foreground/10">
          <div>
            <p className="text-primary-foreground/50 text-[10px] uppercase">Invested</p>
            <p className="text-sm font-semibold mt-0.5">{formatNaira(invested, true)}</p>
          </div>
          <div>
            <p className="text-primary-foreground/50 text-[10px] uppercase">Total Gain</p>
            <p className="text-sm font-semibold mt-0.5 text-emerald-300">
              {totalGain > 0 ? '+' : ''}{formatNaira(totalGain, true)}
            </p>
          </div>
          <div>
            <p className="text-primary-foreground/50 text-[10px] uppercase">Return</p>
            <p className="text-sm font-semibold mt-0.5 text-emerald-300">{formatPercent(gainPercent)}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { icon: TrendingUp, label: 'Invest', path: '/investor/invest' },
          { icon: Wallet, label: 'Redeem', path: '/investor/invest' },
          { icon: History, label: 'History', path: '/investor/activity' },
          { icon: FileText, label: 'Statements', path: '/investor/account' },
        ].map((action) => (
          <Link
            key={action.label}
            to={action.path}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
          >
            <action.icon className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-medium text-foreground">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* My Funds */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-foreground text-sm font-semibold">My Funds</h3>
          <Link to="/investor/funds" className="text-primary text-xs font-medium">View all →</Link>
        </div>

        <div className="space-y-3">
          {funds.filter(f => f.status === 'active').slice(0, 3).map((fund) => {
            const icons = { equities: BarChart3, fixed_income: Landmark, money_market: Wallet, balanced: TrendingUp };
            const Icon = icons[fund.asset_class] || BarChart3;
            return (
              <div key={fund.id} className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-semibold">{fund.short_name || fund.name}</p>
                      <p className="text-muted-foreground text-[11px] mt-0.5">{fund.description || fund.asset_class?.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-mono font-bold ${getReturnColorLight(fund.return_ytd)}`}>
                    {formatPercent(fund.return_ytd)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-muted-foreground text-[10px]">NAV/unit: {formatNaira(fund.nav_per_unit)}</span>
                  <span className="text-muted-foreground text-[10px]">Risk: {fund.risk_level?.replace('_', '-')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Pulse */}
      <div>
        <h3 className="text-foreground text-sm font-semibold mb-3">Market Pulse</h3>
        <div className="grid grid-cols-2 gap-2">
          {marketData.map((m) => (
            <div key={m.label} className="bg-card rounded-xl p-3 border border-border">
              <p className="text-muted-foreground text-[10px] font-medium">{m.label}</p>
              <p className="text-foreground text-sm font-mono font-bold mt-0.5">{m.value}</p>
              <span className={`text-[10px] font-medium ${m.up === true ? 'text-emerald-600' : m.up === false ? 'text-red-500' : 'text-muted-foreground'}`}>
                {m.up === true && '↑ '}{m.up === false && '↓ '}{m.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}