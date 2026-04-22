import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FileText, Receipt, ClipboardList, Bell, Building2, Wallet, Settings, LogOut, ChevronRight, ShieldCheck, BadgeCheck } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { formatNaira } from '@/lib/formatters';

const staticMenuItems = [
  { icon: FileText, label: 'Account Statements', desc: 'Monthly PDF statements', path: '#' },
  { icon: Receipt, label: 'Tax Certificates', desc: 'FY2025 available · FIRS compliant', path: '#' },
  { icon: ClipboardList, label: 'KYC Documents', desc: 'NIN, BVN, address verification', path: '#' },
  { icon: Bell, label: 'Notifications', desc: 'NAV alerts · Dividend credits', path: '#' },
  { icon: Building2, label: 'Bank Accounts', desc: 'Manage linked accounts', path: '#' },
  { icon: Wallet, label: 'Wallet', desc: 'Balance · Virtual account · Withdrawals', path: '/investor/wallet' },
  { icon: Settings, label: 'Settings', desc: 'Security · PIN · Biometrics', path: '#' },
];

export default function Account() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });
  const { balance } = useWallet();

  const handleLogout = () => {
    base44.auth.logout();
  };

  const menuItems = staticMenuItems.map(item =>
    item.label === 'Wallet'
      ? { ...item, desc: `Balance: ${formatNaira(Math.max(0, balance))} · Virtual account · Withdrawals` }
      : item
  );

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-foreground text-xl font-display font-semibold mb-5">Account</h1>

      {/* Profile Card */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-display font-bold text-lg">
              {(user?.full_name || 'I').charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-foreground font-semibold">{user?.full_name || 'Investor'}</p>
            <p className="text-muted-foreground text-xs">{user?.email || ''}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-medium">
            <ShieldCheck className="w-3 h-3" /> BVN Verified
          </span>
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
            <BadgeCheck className="w-3 h-3" /> KYC Level 2
          </span>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-5">
        {menuItems.map((item, i) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors ${
              i < menuItems.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <item.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">{item.label}</p>
              <p className="text-muted-foreground text-[10px]">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      {/* Sign Out */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive/20 text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}