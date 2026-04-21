import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import BackOfficeSidebar from './BackOfficeSidebar';
import { Menu, X, ShieldOff } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function BackOfficeLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoading } = useCurrentUser();

  if (!isLoading && user && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center dark">
        <div className="text-center px-6">
          <ShieldOff className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h2 className="text-white text-lg font-heading font-semibold">Access Restricted</h2>
          <p className="text-white/40 text-sm mt-2 mb-5">The Back Office is for administrators only.</p>
          <Link to="/investor" className="px-4 py-2 rounded-lg bg-teal/20 text-teal text-sm font-medium hover:bg-teal/30 transition-colors">
            Go to Investor Portal →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy dark">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <BackOfficeSidebar />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-navy border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal/20 flex items-center justify-center">
            <span className="text-teal text-xs font-bold">V</span>
          </div>
          <span className="font-heading font-bold text-white text-sm">VaultIQ</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/investor" className="text-white/40 text-xs font-mono hover:text-white/70 transition-colors">
            Investor →
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white/60 hover:text-white transition-colors">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full" onClick={() => setMobileOpen(false)}>
            <BackOfficeSidebar />
          </div>
        </div>
      )}

      <main className="lg:ml-60 min-h-screen pt-14 lg:pt-0">
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}