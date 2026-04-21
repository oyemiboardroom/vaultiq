import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { formatNaira, formatPercent, getReturnColor } from '@/lib/formatters';

export default function FundSummaryTable() {
  const { data: funds = [] } = useQuery({
    queryKey: ['funds'],
    queryFn: () => base44.entities.Fund.list(),
  });

  return (
    <div className="bg-navy-light rounded-xl border border-white/5 p-5">
      <h3 className="text-white text-sm font-semibold mb-1">Fund Summary</h3>
      <p className="text-white/30 text-xs mb-4">NAV & 1M returns</p>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white/30 border-b border-white/5">
              <th className="text-left py-2 font-medium">Fund</th>
              <th className="text-right py-2 font-medium">NAV (₦B)</th>
              <th className="text-right py-2 font-medium">1M Return</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((fund) => (
              <tr key={fund.id} className="border-b border-white/5 last:border-0">
                <td className="py-2.5 text-white/80 font-medium">{fund.short_name || fund.name}</td>
                <td className="py-2.5 text-right text-white font-mono">{formatNaira(fund.total_nav, true)}</td>
                <td className={`py-2.5 text-right font-mono font-medium ${getReturnColor(fund.return_1m)}`}>
                  {formatPercent(fund.return_1m)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}