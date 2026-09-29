import React from 'react';
import { LayoutDashboard, Sparkles, CloudSun, TrendingUp, Menu } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  setMobileMenuOpen
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <LayoutDashboard className="h-5 w-5" />
        <span>Dashboard</span>
      </button>

      <button
        onClick={() => setActiveTab('crop-recommendation')}
        className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'crop-recommendation' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <Sparkles className="h-5 w-5 text-emerald-600" />
        <span>AI Crops</span>
      </button>

      <button
        onClick={() => setActiveTab('weather')}
        className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'weather' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <CloudSun className="h-5 w-5 text-amber-500" />
        <span>Weather</span>
      </button>

      <button
        onClick={() => setActiveTab('market')}
        className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'market' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <TrendingUp className="h-5 w-5" />
        <span>Market</span>
      </button>

      <button
        onClick={() => setMobileMenuOpen(true)}
        className="flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium text-stone-500 hover:text-stone-800"
      >
        <Menu className="h-5 w-5" />
        <span>All Modules</span>
      </button>
    </nav>
  );
};
