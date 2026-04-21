import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, BarChart3, Shield, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground text-lg tracking-tight">VaultIQ</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/investor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Investor Portal</Link>
            <Link to="/backoffice" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium">
              Back Office
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="text-accent text-sm font-medium uppercase tracking-widest mb-4">SEC-Compliant · IBOR-Powered · Cloud-Native</p>
            <h1 className="text-foreground text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              Your wealth,<br />
              <span className="italic text-primary">growing quietly.</span>
            </h1>
            <p className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
              Nigeria's most refined investment management experience. From ₦1,000 to ₦1 trillion — institutional-grade fund management for every Nigerian investor.
            </p>
          </motion.div>

          {/* Portal Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Link
                to="/investor"
                className="group block bg-card rounded-2xl border border-border p-8 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-foreground text-xl font-display font-semibold mb-2">Investor Portal</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  View your portfolio, subscribe to SEC-regulated funds, track returns in real-time, and manage your investment account.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {['Real-time NAV', 'Digital Subscription', 'E-Statements', 'Mobile-first'].map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">{tag}</span>
                  ))}
                </div>
                <span className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Open Portal <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link
                to="/backoffice"
                className="group block bg-navy rounded-2xl border border-white/5 p-8 hover:border-teal/30 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-5">
                  <BarChart3 className="w-6 h-6 text-teal" />
                </div>
                <h3 className="text-white text-xl font-heading font-semibold mb-2">Back Office</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  Full investment management system — portfolio management, OMS, compliance, risk analytics, operations hub, and regulatory reporting.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {['IBOR Engine', 'Compliance', 'Risk & VaR', 'SEC Reporting'].map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-white/40 font-medium">{tag}</span>
                  ))}
                </div>
                <span className="flex items-center gap-1 text-teal text-sm font-medium group-hover:gap-2 transition-all">
                  Open Platform <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Shield, label: 'SEC Regulated', desc: 'Full SEC Nigeria compliance' },
              { icon: BarChart3, label: '9 Modules', desc: 'Front-to-NAV platform' },
              { icon: Users, label: '2,847 Investors', desc: 'Active and growing' },
              { icon: TrendingUp, label: '₦42.6B AUM', desc: 'Under management' },
            ].map((f) => (
              <div key={f.label} className="text-center p-4">
                <f.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-foreground text-sm font-semibold">{f.label}</p>
                <p className="text-muted-foreground text-[10px] mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 text-center">
        <p className="text-muted-foreground text-xs">
          Powered by Newage Solutions & Technologies Ltd. · VaultIQ IMS Platform
        </p>
      </footer>
    </div>
  );
}