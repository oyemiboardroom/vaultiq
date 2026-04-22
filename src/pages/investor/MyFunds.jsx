import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { formatNaira, formatPercent, getReturnColorLight } from '@/lib/formatters';
import { BarChart3, Landmark, Wallet, TrendingUp, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { usePortfolio } from '@/hooks/usePortfolio';

const icons = { equities: BarChart3, fixed_income: Landmark, money_market: Wallet, balanced: TrendingUp };

const allGrowthData = {
  '1m': [
    { date: 'W1', value: 97 }, { date: 'W2', value: 98.2 }, { date: 'W3', value: 99.1 }, { date: 'W4', value: 100 },
  ],
  '3m': [
    { date: 'Jan', value: 95 }, { date: 'Feb', value: 97.5 }, { date: 'Mar', value: 100 },
  ],
  '6m': [
    { date: 'Oct', value: 90 }, { date: 'Nov', value: 92 }, { date: 'Dec', value: 94 },
    { date: 'Jan', value: 95.5 }, { date: 'Feb', value: 97.5 }, { date: 'Mar', value: 100 },
  ],
  '1y': [
    { date: 'Apr', value: 83.2 }, { date: 'May', value: 85 }, { date: 'Jun', value: 87.4 },
    { date: 'Jul', value: 89.5 }, { date: 'Aug', value: 91.2 }, { date: 'Sep', value: 90.3 },
    { date: 'Oct', value: 92.5 }, { date: 'Nov', value: 93.8 }, { date: 'Dec', value: 95.1 },
    { date: 'Jan', value: 96.4 }, { date: 'Feb', value: 98.2 }, { date: 'Mar', value: 100 },
  ],
  'all': [
    { date: '2022', value: 65 }, { date: '2023', value: 74 }, { date: '2024', value: 88 },
    { date: 'Q1\'25', value: 94 }, { date: 'Q2\'25', value: 96 }, { date: 'Q3\'25', value: 98 }, { date: 'Now', value: 100 },
  ],
};

export default function MyFunds() {
  const [period, setPeriod] = useState('1y');
  const { invested, totalValue, totalGain, gainPercent, dailyChange, byFund } = usePortfolio();

  const { data: funds = [] } = useQuery({
    queryKey: ['funds'],
    queryFn: () => base44.entities.Fund.list(),
  });

  // Scale chart data relative to actual portfolio value
  const chartData = useMemo(() => {
    const raw = allGrowthData[period] || allGrowthData['1y'];
    if (totalValue <= 0) return raw.map(d => ({ ...d, value: 0 }));
    return raw.map(d => ({ ...d, value: Math.round((d.value / 100) * totalValue / 1000) }));
  }, [period, totalValue]);

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-foreground text-xl font-display font-semibold mb-1">My Investments</h1>
      <p className="text-foreground text-2xl font-display font-bold">{formatNaira(totalValue)}</p>

      <div className="flex items-center gap-2 mt-1 mb-5">
        {totalGain > 0 ? (
          <>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-600 text-xs font-medium">+{formatNaira(totalGain)} ({formatPercent(gainPercent)})</span>
            <span className="text-muted-foreground text-xs">Total Gain</span>
          </>
        ) : (
          <span className="text-muted-foreground text-xs">Start investing to see your portfolio grow</span>
        )}
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <Tabs value={period} onValueChange={setPeriod} className="mb-3">
          <TabsList className="bg-muted h-7">
            {['1M', '3M', '6M', '1Y', 'All'].map(p => (
              <TabsTrigger key={p} value={p.toLowerCase()} className="text-[10px] h-5 px-2">{p}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart key={period} data={chartData}>
              <defs>
                <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(150, 70%, 15%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(150, 70%, 15%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: 'hsl(150, 8%, 40%)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(v) => [`₦${v.toLocaleString()}K`, 'Value']}
                contentStyle={{ background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(35, 18%, 87%)', borderRadius: 8, fontSize: 11 }}
              />
              <Area type="monotone" dataKey="value" stroke="hsl(150, 70%, 15%)" strokeWidth={2} fill="url(#portfolioGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fund Cards */}
      <div className="space-y-3">
        {funds.filter(f => f.status === 'active').map((fund) => {
          const Icon = icons[fund.asset_class] || BarChart3;
          // My value = NAV per unit × units held (from settled transactions)
          const fundData = byFund[fund.name] || { units: 0, invested: 0 };
          const myUnits = Math.max(0, fundData.units);
          const myValue = myUnits > 0 && fund.nav_per_unit > 0 ? myUnits * fund.nav_per_unit : 0;
          return (
            <Link key={fund.id} to={`/investor/funds/${fund.id}`} className="block bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-semibold">{fund.short_name || fund.name}</p>
                    <p className="text-muted-foreground text-[10px] mt-0.5">Retail Class</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-mono font-bold ${getReturnColorLight(fund.return_ytd)}`}>
                    {formatPercent(fund.return_ytd)} YTD
                  </p>
                </div>
              </div>

              {/* My value in this fund */}
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-[10px]">My Value</p>
                <p className="text-foreground text-sm font-mono font-semibold mt-0.5">
                  {myValue > 0 ? formatNaira(myValue) : '—'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-[10px]">My Units</p>
                <p className="text-foreground text-xs font-mono mt-0.5">{myUnits > 0 ? myUnits.toLocaleString('en-NG', { maximumFractionDigits: 2 }) : '—'}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-[10px]">NAV/unit</p>
                <p className="text-foreground text-xs font-mono mt-0.5">{formatNaira(fund.nav_per_unit)}</p>
              </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Performance Summary */}
      <div className="bg-card rounded-xl border border-border p-4 mt-5">
        <h3 className="text-foreground text-sm font-semibold mb-3">Performance Summary</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-muted-foreground text-[10px]">Total Invested</p>
            <p className="text-foreground text-sm font-semibold">{formatNaira(invested)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-[10px]">Current Value</p>
            <p className="text-foreground text-sm font-semibold">{formatNaira(totalValue)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-[10px]">Total Return</p>
            <p className={`text-sm font-semibold ${getReturnColorLight(totalGain)}`}>
              {totalGain >= 0 ? '+' : ''}{formatNaira(totalGain)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-[10px]">Annualised</p>
            <p className="text-foreground text-sm font-semibold">17.4% p.a.</p>
          </div>
        </div>
      </div>
    </div>
  );
}