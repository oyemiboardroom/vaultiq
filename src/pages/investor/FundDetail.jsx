import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { formatNaira, formatPercent, getReturnColorLight } from '@/lib/formatters';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Download, BarChart3, Landmark, Wallet, TrendingUp,
  ShieldCheck, TrendingDown, Info
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const icons = { equities: BarChart3, fixed_income: Landmark, money_market: Wallet, balanced: TrendingUp };

const allocationColors = ['#0f4d2a', '#b87333', '#2e7d5e', '#8b6914', '#1a5c3a', '#c4922a'];

const riskLabel = { low: 'Low', low_medium: 'Low–Medium', medium: 'Medium', high: 'High' };

const performanceRows = [
  { label: '1 Month', key: 'return_1m' },
  { label: '3 Months', key: 'return_3m' },
  { label: '6 Months', key: 'return_6m' },
  { label: 'YTD', key: 'return_ytd' },
  { label: '1 Year', key: 'return_1y' },
  { label: '3 Years p.a.', key: 'return_3y_pa' },
  { label: 'Since Inception', key: 'return_since_inception' },
];

// Default allocations per asset class
const defaultAllocations = {
  equities: [
    { name: 'Large Cap Equities', value: 60 },
    { name: 'Mid Cap Equities', value: 25 },
    { name: 'Cash & Equivalents', value: 15 },
  ],
  fixed_income: [
    { name: 'FGN Bonds', value: 50 },
    { name: 'Corporate Bonds', value: 30 },
    { name: 'Eurobonds', value: 10 },
    { name: 'Cash', value: 10 },
  ],
  money_market: [
    { name: 'T-Bills', value: 55 },
    { name: 'Commercial Paper', value: 25 },
    { name: 'Bank Placements', value: 15 },
    { name: 'Cash', value: 5 },
  ],
  balanced: [
    { name: 'Equities', value: 40 },
    { name: 'Fixed Income', value: 35 },
    { name: 'Money Market', value: 15 },
    { name: 'Cash', value: 10 },
  ],
  real_estate: [
    { name: 'Commercial', value: 50 },
    { name: 'Residential', value: 30 },
    { name: 'Industrial', value: 20 },
  ],
  dollar_fund: [
    { name: 'USD T-Bills', value: 40 },
    { name: 'USD Bonds', value: 35 },
    { name: 'USD Equities', value: 15 },
    { name: 'Cash (USD)', value: 10 },
  ],
};

export default function FundDetail() {
  const { fundId } = useParams();
  const { byFund } = usePortfolio();

  const { data: funds = [] } = useQuery({
    queryKey: ['funds'],
    queryFn: () => base44.entities.Fund.list(),
  });

  const fund = funds.find(f => f.id === fundId);

  if (!fund) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <Link to="/investor/funds" className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Funds
        </Link>
        <div className="text-center py-16 text-muted-foreground text-sm">Loading fund details...</div>
      </div>
    );
  }

  const Icon = icons[fund.asset_class] || BarChart3;
  const allocation = defaultAllocations[fund.asset_class] || defaultAllocations.balanced;
  const myValue = byFund[fund.name] ? byFund[fund.name] * 1.112 : 0;
  const myInvested = byFund[fund.name] || 0;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Back */}
      <Link to="/investor/funds" className="flex items-center gap-2 text-muted-foreground text-sm mb-5">
        <ArrowLeft className="w-4 h-4" /> Back to My Investments
      </Link>

      {/* Fund Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-foreground text-lg font-display font-semibold leading-tight">{fund.name}</h1>
          <p className="text-muted-foreground text-xs mt-0.5">{fund.asset_class?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
              {riskLabel[fund.risk_level] || fund.risk_level} Risk
            </span>
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium capitalize">
              {fund.status}
            </span>
          </div>
        </div>
      </div>

      {/* My Holdings Card */}
      {myInvested > 0 && (
        <div className="bg-primary rounded-xl p-4 mb-4 text-primary-foreground">
          <p className="text-primary-foreground/60 text-[10px] font-medium uppercase tracking-wider">My Investment</p>
          <p className="text-2xl font-display font-bold mt-1">{formatNaira(myValue)}</p>
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-primary-foreground/10">
            <div>
              <p className="text-primary-foreground/50 text-[10px] uppercase">Amount Invested</p>
              <p className="text-sm font-semibold mt-0.5">{formatNaira(myInvested)}</p>
            </div>
            <div>
              <p className="text-primary-foreground/50 text-[10px] uppercase">Unrealised Gain</p>
              <p className="text-sm font-semibold mt-0.5 text-emerald-300">+{formatNaira(myValue - myInvested)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-card rounded-xl border border-border p-3">
          <p className="text-muted-foreground text-[10px] uppercase tracking-wide">NAV Per Unit</p>
          <p className="text-foreground text-base font-mono font-bold mt-1">{formatNaira(fund.nav_per_unit)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3">
          <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Total AUM</p>
          <p className="text-foreground text-base font-mono font-bold mt-1">{formatNaira(fund.total_nav, true)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3">
          <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Min. Investment</p>
          <p className="text-foreground text-base font-mono font-bold mt-1">{formatNaira(fund.min_investment, true)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3">
          <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Mgmt. Fee p.a.</p>
          <p className="text-foreground text-base font-mono font-bold mt-1">{fund.management_fee != null ? `${fund.management_fee}%` : '—'}</p>
        </div>
      </div>

      {/* Fund Overview */}
      <div className="bg-card rounded-xl border border-border p-4 mb-4">
        <h2 className="text-foreground text-sm font-semibold mb-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" /> Fund Overview
        </h2>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {fund.description || `The ${fund.name} is a professionally managed investment vehicle designed to deliver consistent risk-adjusted returns. The fund invests in a diversified portfolio of ${fund.asset_class?.replace(/_/g, ' ')} instruments in compliance with applicable SEC Nigeria regulations.`}
        </p>
        {fund.benchmark && (
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-muted-foreground text-[10px]">Benchmark</span>
            <span className="text-foreground text-xs font-medium">{fund.benchmark}</span>
          </div>
        )}
      </div>

      {/* Performance Table */}
      <div className="bg-card rounded-xl border border-border p-4 mb-4">
        <h2 className="text-foreground text-sm font-semibold mb-3">Performance Returns</h2>
        <div className="space-y-2">
          {performanceRows.map(row => {
            const val = fund[row.key];
            return (
              <div key={row.key} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                <span className="text-muted-foreground text-xs">{row.label}</span>
                <span className={`text-xs font-mono font-semibold ${getReturnColorLight(val)}`}>
                  {val != null ? formatPercent(val) : '—'}
                </span>
              </div>
            );
          })}
          {fund.sharpe_ratio != null && (
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground text-xs">Sharpe Ratio</span>
              <span className="text-xs font-mono font-semibold text-foreground">{fund.sharpe_ratio.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Strategic Asset Allocation */}
      <div className="bg-card rounded-xl border border-border p-4 mb-4">
        <h2 className="text-foreground text-sm font-semibold mb-4">Strategic Asset Allocation</h2>
        <div className="flex items-center gap-4">
          <div className="w-28 h-28 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocation} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={50} strokeWidth={0}>
                  {allocation.map((_, i) => (
                    <Cell key={i} fill={allocationColors[i % allocationColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v}%`]}
                  contentStyle={{ background: 'hsl(0,0%,100%)', border: '1px solid hsl(35,18%,87%)', borderRadius: 6, fontSize: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {allocation.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: allocationColors[i % allocationColors.length] }} />
                  <span className="text-muted-foreground text-[10px]">{item.name}</span>
                </div>
                <span className="text-foreground text-[10px] font-mono font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
        {/* Allocation bar */}
        <div className="mt-4 flex rounded-full overflow-hidden h-2">
          {allocation.map((item, i) => (
            <div key={item.name} style={{ width: `${item.value}%`, background: allocationColors[i % allocationColors.length] }} />
          ))}
        </div>
      </div>

      {/* Fund Fact Sheet Download */}
      <div className="bg-gold-light rounded-xl border border-accent/20 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-foreground text-sm font-semibold">Fund Fact Sheet</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">Latest monthly report · PDF</p>
          </div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
        </div>
      </div>

      {/* CTA */}
      <Link
        to="/investor/invest"
        className="block w-full text-center py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        Invest in this Fund →
      </Link>
    </div>
  );
}