import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { formatNaira, formatPercent, getReturnColor } from '@/lib/formatters';
import SectionHeader from '@/components/backoffice/SectionHeader';
import StatCard from '@/components/backoffice/StatCard';
import { Briefcase, Banknote, TrendingUp, Hash } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Portfolio() {
  const [selectedFund, setSelectedFund] = useState('all');

  const { data: funds = [] } = useQuery({
    queryKey: ['funds'],
    queryFn: () => base44.entities.Fund.list(),
  });

  const { data: allHoldings = [] } = useQuery({
    queryKey: ['holdings'],
    queryFn: () => base44.entities.Holding.list('-market_value', 100),
  });

  const holdings = selectedFund === 'all'
    ? allHoldings
    : allHoldings.filter(h => h.fund_id === selectedFund);

  const totalMarketValue = holdings.reduce((sum, h) => sum + (h.market_value || 0), 0);
  const totalCost = holdings.reduce((sum, h) => sum + ((h.cost_price || 0) * (h.quantity || 0)), 0);
  const unrealisedPnl = totalMarketValue - totalCost;
  const cashEquivalents = holdings.filter(h => h.security_type === 'cash' || h.security_type === 'tbill')
    .reduce((sum, h) => sum + (h.market_value || 0), 0);

  return (
    <div className="dark">
      <SectionHeader
        title="Portfolio Management"
        subtitle="Real-time IBOR positions · Live NGX pricing"
        live
      />

      <Tabs value={selectedFund} onValueChange={setSelectedFund} className="mb-6">
        <TabsList className="bg-navy-light border border-white/5">
          <TabsTrigger value="all" className="text-xs data-[state=active]:bg-teal/10 data-[state=active]:text-teal">All Funds</TabsTrigger>
          {funds.map(f => (
            <TabsTrigger key={f.id} value={f.id} className="text-xs data-[state=active]:bg-teal/10 data-[state=active]:text-teal">
              {f.short_name || f.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Market Value" value={formatNaira(totalMarketValue, true)} icon={Briefcase} />
        <StatCard label="Cash & Equivalents" value={formatNaira(cashEquivalents, true)} icon={Banknote} />
        <StatCard label="Unrealised P&L" value={formatNaira(unrealisedPnl, true)} subtitle={formatPercent(totalCost > 0 ? (unrealisedPnl / totalCost * 100) : 0)} icon={TrendingUp} />
        <StatCard label="No. of Positions" value={holdings.length} icon={Hash} />
      </div>

      {/* Holdings Table */}
      <div className="bg-navy-light rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-white text-sm font-semibold">Holdings — Top Positions by Market Value</h3>
          <p className="text-white/30 text-[10px] font-mono mt-1">PRICES: NGX LIVE · BONDS: FMDQ EOD</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-white/30 border-b border-white/5">
                <th className="text-left px-4 py-3 font-medium">Security</th>
                <th className="text-left px-4 py-3 font-medium">Ticker</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-right px-4 py-3 font-medium">Qty</th>
                <th className="text-right px-4 py-3 font-medium">Cost (₦)</th>
                <th className="text-right px-4 py-3 font-medium">Price (₦)</th>
                <th className="text-right px-4 py-3 font-medium">Mkt Value (₦M)</th>
                <th className="text-right px-4 py-3 font-medium">P&L %</th>
                <th className="text-right px-4 py-3 font-medium">% AUM</th>
                <th className="text-right px-4 py-3 font-medium">7D</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white/80 font-medium">{h.security_name}</td>
                  <td className="px-4 py-3 text-teal font-mono">{h.ticker}</td>
                  <td className="px-4 py-3 text-white/40 uppercase">{h.security_type?.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-right text-white/60 font-mono">{(h.quantity || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-white/60 font-mono">{formatNaira(h.cost_price)}</td>
                  <td className="px-4 py-3 text-right text-white font-mono">{formatNaira(h.current_price)}</td>
                  <td className="px-4 py-3 text-right text-white font-mono font-medium">{formatNaira((h.market_value || 0) / 1e6, false)}M</td>
                  <td className={`px-4 py-3 text-right font-mono font-medium ${getReturnColor(h.pnl_percent)}`}>{formatPercent(h.pnl_percent)}</td>
                  <td className="px-4 py-3 text-right text-white/40 font-mono">{h.weight?.toFixed(1)}%</td>
                  <td className={`px-4 py-3 text-right font-mono ${getReturnColor(h.change_7d)}`}>{formatPercent(h.change_7d)}</td>
                </tr>
              ))}
              {holdings.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-white/30">No holdings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}