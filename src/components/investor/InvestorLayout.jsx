import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, PlusCircle, List, UserCircle } from 'lucide-react';

const tabs = [
  { label: 'Home', icon: Home, path: '/investor' },
  { label: 'My Funds', icon: BarChart3, path: '/investor/funds' },
  { label: 'Invest', icon: PlusCircle, path: '/investor/invest' },
  { label: 'Activity', icon: List, path: '/investor/activity' },
  { label: 'Account', icon: UserCircle, path: '/investor/account' },
];

export default function InvestorLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-display font-bold text-xs">V</span>
          </div>
          <span className="font-display font-semibold text-foreground text-sm">VaultIQ</span>
        </div>
        <Link
          to="/backoffice"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
        >
          Back Office →
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex items-center justify-around px-2 py-2 z-40">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all min-w-0
                ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
              `}
            >
              <tab.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] font-medium truncate">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}