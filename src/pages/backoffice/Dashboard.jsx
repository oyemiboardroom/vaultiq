import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Wallet, Layers, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatNaira, formatPercent } from '@/lib/formatters';
import SectionHeader from '@/components/backoffice/SectionHeader';
import StatCard from '@/components/backoffice/StatCard';
import AumChart from '@/components/backoffice/dashboard/AumChart';
import AssetAllocation from '@/components/backoffice/dashboard/AssetAllocation';
import FundSummaryTable from '@/components/backoffice/dashboard/FundSummaryTable';
import OpsStatus from '@/components/backoffice/dashboard/OpsStatus';

export default function Dashboard() {
  const { data: funds = [] } = useQuery({
    queryKey: ['funds'],
    queryFn: () => base44.entities.Fund.list(),
  });

  const { data: rules = [] } = useQuery({
    queryKey: ['compliance-rules'],
    queryFn: () => base44.entities.ComplianceRule.list(),
  });

  const totalAum = funds.reduce((sum, f) => sum + (f.total_nav || 0), 0);
  const activeFunds = funds.filter(f => f.status === 'active').length;
  const avgReturn = funds.length > 0
    ? funds.reduce((sum, f) => sum + (f.return_ytd || 0), 0) / funds.length
    : 0;
  const warnings = rules.filter(r => r.status === 'warning' || r.status === 'breach').length;

  return (
    <div className="dark">
      <SectionHeader
        title="Verdant Vault Limited · All Funds"
        subtitle="NAV DATE: 08 APR 2026"
        live
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total AUM"
          value={formatNaira(totalAum, true)}
          subtitle="↑ ₦1.2B this month"
          icon={Wallet}
        />
        <StatCard
          label="Funds Under Management"
          value={activeFunds}
          subtitle={`Active · ${funds.filter(f => f.status === 'pipeline').length} in pipeline`}
          icon={Layers}
        />
        <StatCard
          label="Portfolio Return (YTD)"
          value={formatPercent(avgReturn)}
          subtitle="↑ +3.2% vs benchmark"
          icon={TrendingUp}
        />
        <StatCard
          label="Compliance Issues"
          value={warnings}
          subtitle={warnings > 0 ? '↑ Needs review' : 'All clear'}
          icon={AlertTriangle}
        />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <AumChart />
        </div>
        <AssetAllocation />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FundSummaryTable />
        <OpsStatus />
      </div>
    </div>
  );
}