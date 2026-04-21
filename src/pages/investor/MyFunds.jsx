import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { formatNaira, formatPercent, getReturnColorLight } from '@/lib/formatters';
import { BarChart3, Landmark, Wallet, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const growthData = [
  { date: 'Jan', value: 13200 },
  { date: 'Feb', value: 13600 },
  { date: 'Mar', value: 14100 },
  { date: 'Apr', value: 13900 },
  { date: 'May', value: 14400 },
  { date: 'Jun', value: 14800 },
  { date: 'Jul', value: 15100 },
  { date: 'Aug', value: 15400 },
  { date: 'Sep', value: 15200 },
  { date: 'Oct', value: 15600 },
  { date: 'Nov', value: 15500 },
  { date: 'Dec', value: 15868 },
];

const icons = { equities: BarChart3, fixed_income: Landmark, money_market: Wallet, balanced: TrendingUp };

export default function MyFunds() {
  const [period, setPeriod] = useState('1y');

  const { data: funds = [] } = useQuery({
    queryKey: ['funds'],
    queryFn: () => base44.entities.Fund.list(),
  });

  const totalValue = 15868420;
  const totalGain = 1668420;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-foreground text-xl font-display font-semibold mb-1">My Investments</h1>
      <p className="text-foreground text-2xl font-display font-bold">{formatNaira(totalValue)}</p>

      <div className="flex items-center gap-2 mt-1 mb-5">
        <span className="text-emerald-600 text-xs font-medium">+{formatNaira(totalGain)} +11.7%</span>
        <span className="text-muted-foreground text-xs">Portfolio Growth</span>
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
            <AreaChart data={growthData}>
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
          return (
            <div key={fund.id} className="bg-card rounded-xl p-4 border border-border">
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
                  <p className="text-foreground text-sm font-bold font-mono">{formatNaira(fund.total_nav, true)}</p>
                  <span className={`text-[10px] font-medium ${getReturnColorLight(fund.return_ytd)}`}>
                    {formatPercent(fund.return_ytd)} YTD
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Summary */}
      <div className="bg-card rounded-xl border border-border p-4 mt-5">
        <h3 className="text-foreground text-sm font-semibold mb-3">Performance Summary</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-muted-foreground text-[10px]">Total Invested</p>
            <p className="text-foreground text-sm font-semibold">₦14,200,000</p>
          </div>
          <div>
            <p className="text-muted-foreground text-[10px]">Current Value</p>
            <p className="text-foreground text-sm font-semibold">{formatNaira(totalValue)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-[10px]">Total Return</p>
            <p className="text-emerald-600 text-sm font-semibold">+{formatNaira(totalGain)}</p>
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