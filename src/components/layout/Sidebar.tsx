import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  LayoutDashboard,
  Sparkles,
  CloudSun,
  TrendingUp,
  Droplets,
  HardHat,
  Tractor,
  Truck,
  Store,
  Wallet,
  Users,
  Shield,
  Layers,
  FileText,
  BadgeAlert,
  ShoppingBag,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const { role } = useAuth();

  const getNavItems = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { id: 'admin', label: 'Admin Console', icon: Shield, badge: 'Full Access' },
          { id: 'admin-users', label: 'User & KYC Verification', icon: Users, badge: 'Live' },
          { id: 'marketplace', label: 'Crop Trade Moderation', icon: Layers },
          { id: 'store', label: 'Seeds & Store Inventory', icon: Store },
          { id: 'transport', label: 'Logistics Fleet Dispatch', icon: Truck },
          { id: 'admin-analytics', label: 'Ecosystem Analytics', icon: TrendingUp, badge: 'Realtime' },
          { id: 'admin-audit', label: 'Security Audit Logs', icon: FileText },
          { id: 'weather', label: 'Weather Telemetry', icon: CloudSun },
          { id: 'community', label: 'Community Governance', icon: BadgeAlert },
        ];
      case 'WORKER':
        return [
          { id: 'labour', label: 'Job Marketplace', icon: HardHat, badge: 'Available' },
          { id: 'labour-bookings', label: 'My Work Bookings', icon: Clock },
          { id: 'finance', label: 'Earnings & Wages', icon: Wallet },
          { id: 'community', label: 'Worker Community', icon: Users },
          { id: 'weather', label: 'Weather Forecast', icon: CloudSun },
        ];
      case 'TRANSPORT':
        return [
          { id: 'transport', label: 'Haul Bookings & Dispatch', icon: Truck, badge: 'Live GPS' },
          { id: 'marketplace', label: 'Produce Pickup Orders', icon: Layers },
          { id: 'finance', label: 'Transport Income', icon: Wallet },
          { id: 'weather', label: 'Highway Weather Alerts', icon: CloudSun },
          { id: 'community', label: 'Transporters Network', icon: Users },
        ];
      case 'BUYER':
        return [
          { id: 'marketplace', label: 'Browse Farm Produce', icon: ShoppingBag, badge: 'Farm-Gate' },
          { id: 'market', label: 'Mandi Price Benchmarks', icon: TrendingUp },
          { id: 'transport', label: 'Freight Transport Logistics', icon: Truck },
          { id: 'finance', label: 'Procurement Invoices', icon: Wallet },
          { id: 'community', label: 'Agri Business Exchange', icon: Users },
        ];
      case 'STORE_OWNER':
        return [
          { id: 'store', label: 'Storefront Products', icon: Store, badge: 'Catalog' },
          { id: 'store-orders', label: 'Farmer Orders Received', icon: ShoppingBag },
          { id: 'finance', label: 'Store Sales & Profit', icon: Wallet },
          { id: 'market', label: 'Input Price Trends', icon: TrendingUp },
          { id: 'community', label: 'Agri Retail Forum', icon: Users },
        ];
      case 'MACHINE_OWNER':
        return [
          { id: 'machines', label: 'My Machinery Fleet', icon: Tractor, badge: 'Available' },
          { id: 'machines-bookings', label: 'Rental Bookings & Approvals', icon: Clock },
          { id: 'finance', label: 'Rental Revenue', icon: Wallet },
          { id: 'weather', label: 'Spraying / Tilling Windows', icon: CloudSun },
          { id: 'community', label: 'Equipment Operators', icon: Users },
        ];
      case 'FARMER':
      default:
        return [
          { id: 'dashboard', label: 'Farmer Dashboard', icon: LayoutDashboard },
          { id: 'crop-recommendation', label: 'AI Crop Recommendation', icon: Sparkles, badge: 'Gemini' },
          { id: 'weather', label: 'Smart Weather', icon: CloudSun, badge: 'Advisory' },
          { id: 'market', label: 'Market Intelligence', icon: TrendingUp },
          { id: 'irrigation', label: 'Smart Irrigation', icon: Droplets, badge: 'Live Sensor' },
          { id: 'labour', label: 'Labour Hiring', icon: HardHat },
          { id: 'machines', label: 'Machinery Rental', icon: Tractor },
          { id: 'transport', label: 'Transport Booking', icon: Truck },
          { id: 'marketplace', label: 'Crop Marketplace', icon: Layers, badge: 'Direct Sale' },
          { id: 'store', label: 'Seeds & Fertilizer Store', icon: Store },
          { id: 'finance', label: 'Financial Dashboard', icon: Wallet },
          { id: 'community', label: 'Farmer Community', icon: Users },
        ];
    }
  };

  const navItems = getNavItems();

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-stone-50 border-r border-stone-200/80 p-4 overflow-y-auto transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
            {role.replace('_', ' ')} MODULES
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-stone-700 hover:bg-stone-200/60 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-stone-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tight shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badge === 'Gemini'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Ecosystem Connectivity Callout */}
        <div className="mt-8 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100/60 border border-emerald-200/80">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold mb-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Unified Platform</span>
          </div>
          <p className="text-[11px] text-emerald-950/80 leading-relaxed">
            All modules are interconnected: farm tasks sync to financials, bookings alert workers, and harvest listings link to buyers.
          </p>
        </div>
      </aside>
    </>
  );
};
