import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole } from '../../types/index.ts';
import {
  Sprout,
  Sparkles,
  CloudSun,
  TrendingUp,
  Droplets,
  HardHat,
  Tractor,
  Truck,
  Store,
  Wallet,
  Shield,
  Layers,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Users,
  Compass
} from 'lucide-react';

interface LandingPageProps {
  onEnterPlatform: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterPlatform, onOpenAuth }) => {
  const { switchRole } = useAuth();

  const handlePersonaSelect = async (role: UserRole) => {
    await switchRole(role);
    onEnterPlatform();
  };

  const featureCards = [
    {
      title: 'AI Crop Recommendation',
      desc: 'Deep soil NPK chemistry and micro-climate analytics generating yield, risk and profit optimized crop plans.',
      icon: Sparkles,
      color: 'from-emerald-500 to-green-600',
      tag: 'Gemini 3.8 Flash'
    },
    {
      title: 'Smart Agro-Weather',
      desc: 'Satellite rain prediction, micro-climate soil probes, and precision spraying & harvest advisory windows.',
      icon: CloudSun,
      color: 'from-sky-500 to-blue-600',
      tag: '7-Day Forecast'
    },
    {
      title: 'Market Intelligence',
      desc: 'Live APMC mandi quotes, 7-day predictive ARIMA price curves, and supply-demand arbitrage meters.',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-700',
      tag: 'Real-Time APMC'
    },
    {
      title: 'Smart Micro-Irrigation',
      desc: 'IoT capacitive moisture probes and automated solenoid valves saving up to 42% water vs flood irrigation.',
      icon: Droplets,
      color: 'from-cyan-500 to-teal-600',
      tag: 'IoT Telemetry'
    },
    {
      title: 'Labour Marketplace',
      desc: 'Instant booking for master combine operators, paddy transplanting crews, and pruning specialists.',
      icon: HardHat,
      color: 'from-amber-500 to-orange-600',
      tag: 'Verified Labour'
    },
    {
      title: 'Machinery & Drone Rental',
      desc: 'Lease 45-100 HP tractors, combine harvesters, and 16L precision aerial drone sprayers by the hour or day.',
      icon: Tractor,
      color: 'from-orange-500 to-red-600',
      tag: 'Heavy Fleet'
    },
    {
      title: 'Direct Crop Marketplace',
      desc: 'Cut out middlemen. Sell harvest directly to verified food processors and wholesale aggregators at premium rates.',
      icon: Layers,
      color: 'from-purple-500 to-indigo-600',
      tag: 'Farm-Gate Sale'
    },
    {
      title: 'Agri Cold-Chain Transport',
      desc: 'Book reefer trucks, tractor trolleys, and flatbeds with live GPS transit tracking from farm gate to mandi.',
      icon: Truck,
      color: 'from-blue-500 to-indigo-700',
      tag: 'Fleet Dispatch'
    },
    {
      title: 'Financial Ledger & P&L',
      desc: 'Automated income and expense reconciliation with crop-level profit margins and bank subsidy tracking.',
      icon: Wallet,
      color: 'from-emerald-600 to-teal-800',
      tag: 'Profit Ledger'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-emerald-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 bg-gradient-to-b from-stone-950 via-emerald-950 to-stone-900 text-white">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold mb-6 animate-pulse">
            <Sparkles className="h-4 w-4" /> Next-Generation Agritech Infrastructure
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Smart Agriculture for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-cyan-300">Smarter Future</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            A unified digital farming ecosystem connecting Farmers, Agronomists, Labour, Machinery, Freight Transporters, and Wholesale Buyers on a single real-time platform.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onEnterPlatform}
              className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Launch Digital Ecosystem</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenAuth}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all cursor-pointer"
            >
              Sign In / Select Persona
            </button>
          </div>

          {/* Quick Persona Launchers */}
          <div className="mt-12 pt-8 border-t border-white/10 max-w-4xl mx-auto">
            <p className="text-xs font-semibold text-emerald-300/80 uppercase tracking-wider mb-4">
              Explore Platform by User Role (Instant Demo)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
              <button
                onClick={() => handlePersonaSelect('FARMER')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-emerald-500/30 border border-white/15 text-white font-semibold transition-all flex flex-col items-center gap-1.5"
              >
                <Sprout className="h-4 w-4 text-emerald-400" />
                <span>Farmer</span>
              </button>
              <button
                onClick={() => handlePersonaSelect('ADMIN')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-indigo-500/30 border border-white/15 text-white font-semibold transition-all flex flex-col items-center gap-1.5"
              >
                <Shield className="h-4 w-4 text-indigo-400" />
                <span>Admin</span>
              </button>
              <button
                onClick={() => handlePersonaSelect('BUYER')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-purple-500/30 border border-white/15 text-white font-semibold transition-all flex flex-col items-center gap-1.5"
              >
                <Layers className="h-4 w-4 text-purple-400" />
                <span>Agri Buyer</span>
              </button>
              <button
                onClick={() => handlePersonaSelect('WORKER')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-amber-500/30 border border-white/15 text-white font-semibold transition-all flex flex-col items-center gap-1.5"
              >
                <HardHat className="h-4 w-4 text-amber-400" />
                <span>Labour</span>
              </button>
              <button
                onClick={() => handlePersonaSelect('TRANSPORT')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-blue-500/30 border border-white/15 text-white font-semibold transition-all flex flex-col items-center gap-1.5"
              >
                <Truck className="h-4 w-4 text-blue-400" />
                <span>Transport</span>
              </button>
              <button
                onClick={() => handlePersonaSelect('STORE_OWNER')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-teal-500/30 border border-white/15 text-white font-semibold transition-all flex flex-col items-center gap-1.5"
              >
                <Store className="h-4 w-4 text-teal-400" />
                <span>Agri Store</span>
              </button>
              <button
                onClick={() => handlePersonaSelect('MACHINE_OWNER')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-orange-500/30 border border-white/15 text-white font-semibold transition-all flex flex-col items-center gap-1.5"
              >
                <Tractor className="h-4 w-4 text-orange-400" />
                <span>Machine Fleet</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Complete Digital Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Every Aspect of Modern Agriculture Connected
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            Say goodbye to fragmented apps. From soil chemistry diagnosis to cold-chain transport delivery and final bank settlements, our ecosystem delivers seamless end-to-end integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-stone-200 hover:border-emerald-400 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${feat.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-stone-900 group-hover:text-emerald-700 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explore Service <ArrowRight className="h-3 w-3" />
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-emerald-500" />
            <span className="font-bold text-white text-sm">SMART AGRICULTURE ECOSYSTEM</span>
          </div>
          <p>© 2026 Smart Agriculture Inc. AI-Powered Digital Farming & Market Platform.</p>
        </div>
      </footer>

    </div>
  );
};
