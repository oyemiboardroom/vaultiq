import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { month: 'May', aum: 28.4, netFlow: 1.2 },
  { month: 'Jun', aum: 29.8, netFlow: 0.8 },
  { month: 'Jul', aum: 31.2, netFlow: 1.4 },
  { month: 'Aug', aum: 32.6, netFlow: 0.6 },
  { month: 'Sep', aum: 34.1, netFlow: 1.8 },
  { month: 'Oct', aum: 35.0, netFlow: -0.2 },
  { month: 'Nov', aum: 36.4, netFlow: 1.1 },
  { month: 'Dec', aum: 37.8, netFlow: 0.9 },
  { month: 'Jan', aum: 38.6, netFlow: 0.4 },
  { month: 'Feb', aum: 39.8, netFlow: 1.6 },
  { month: 'Mar', aum: 41.4, netFlow: 2.1 },
  { month: 'Apr', aum: 42.6, netFlow: 1.2 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy border border-white/10 rounded-lg px-3 py-2 text-xs">
        <p className="text-white/60 mb-1">{label}</p>
        <p className="text-teal font-medium">AUM: ₦{payload[0].value}B</p>
        <p className="text-amber-400 font-medium">Net Flow: ₦{payload[1]?.value}B</p>
      </div>
    );
  }
  return null;
};

export default function AumChart() {
  return (
    <div className="bg-navy-light rounded-xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white text-sm font-semibold">AUM & Net Cash Flow</h3>
          <p className="text-white/30 text-xs mt-0.5">Last 12 months · NAV-weighted</p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="aumGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${v}B`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="aum" stroke="#00d4aa" strokeWidth={2} fill="url(#aumGrad)" />
            <Area type="monotone" dataKey="netFlow" stroke="#f5a623" strokeWidth={1.5} fill="none" strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}