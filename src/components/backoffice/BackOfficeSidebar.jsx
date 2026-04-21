import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, ArrowRightLeft, Shield, BarChart3,
  TrendingUp, Settings2, Users, FileText, ChevronLeft, ChevronRight, Activity
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/backoffice' },
  { label: 'Portfolio', icon: Briefcase, path: '/backoffice/portfolio' },
  { label: 'Orders & Trades', icon: ArrowRightLeft, path: '/backoffice/orders' },
  { label: 'Compliance', icon: Shield, path: '/backoffice/compliance' },
  { label: 'Risk', icon: BarChart3, path: '/backoffice/risk' },
  { label: 'Performance', icon: TrendingUp, path: '/backoffice/performance' },
  { label: 'Operations', icon: Settings2, path: '/backoffice/operations' },
  { label: 'Investors', icon: Users, path: '/backoffice/investors' },
  { label: 'Reporting', icon: FileText, path: '/backoffice/reporting' },
];

export default function BackOfficeSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-navy flex flex-col z-50 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-teal/20 flex items-center justify-center flex-shrink-0">
          <Activity className="w-4 h-4 text-teal" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="font-heading font-bold text-white text-sm tracking-wider">VaultIQ</span>
            <p className="text-[10px] text-white/40 font-mono">IMS Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/backoffice' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? 'bg-teal/10 text-teal'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-white/5 text-white/30 hover:text-white/60 transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}