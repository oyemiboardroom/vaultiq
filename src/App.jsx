import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Pages
import Home from '@/pages/Home';

// Back Office
import BackOfficeLayout from '@/components/backoffice/BackOfficeLayout';
import Dashboard from '@/pages/backoffice/Dashboard';
import Portfolio from '@/pages/backoffice/Portfolio';
import Orders from '@/pages/backoffice/Orders';
import Compliance from '@/pages/backoffice/Compliance';
import Risk from '@/pages/backoffice/Risk';
import Performance from '@/pages/backoffice/Performance';
import Operations from '@/pages/backoffice/Operations';
import Investors from '@/pages/backoffice/Investors';
import Reporting from '@/pages/backoffice/Reporting';

// Investor Portal
import InvestorLayout from '@/components/investor/InvestorLayout';
import InvestorDashboard from '@/pages/investor/InvestorDashboard';
import MyFunds from '@/pages/investor/MyFunds';
import Invest from '@/pages/investor/Invest';
import Activity from '@/pages/investor/Activity';
import Account from '@/pages/investor/Account';
import FundDetail from '@/pages/investor/FundDetail';
import Securities from '@/pages/investor/Securities';
import WalletPage from '@/pages/investor/WalletPage';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <span className="text-muted-foreground text-sm font-mono">Loading VaultIQ...</span>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Back Office Routes */}
      <Route element={<BackOfficeLayout />}>
        <Route path="/backoffice" element={<Dashboard />} />
        <Route path="/backoffice/portfolio" element={<Portfolio />} />
        <Route path="/backoffice/orders" element={<Orders />} />
        <Route path="/backoffice/compliance" element={<Compliance />} />
        <Route path="/backoffice/risk" element={<Risk />} />
        <Route path="/backoffice/performance" element={<Performance />} />
        <Route path="/backoffice/operations" element={<Operations />} />
        <Route path="/backoffice/investors" element={<Investors />} />
        <Route path="/backoffice/reporting" element={<Reporting />} />
      </Route>

      {/* Investor Portal Routes */}
      <Route element={<InvestorLayout />}>
        <Route path="/investor" element={<InvestorDashboard />} />
        <Route path="/investor/funds" element={<MyFunds />} />
        <Route path="/investor/invest" element={<Invest />} />
        <Route path="/investor/activity" element={<Activity />} />
        <Route path="/investor/account" element={<Account />} />
        <Route path="/investor/funds/:fundId" element={<FundDetail />} />
        <Route path="/investor/securities" element={<Securities />} />
        <Route path="/investor/wallet" element={<WalletPage />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App