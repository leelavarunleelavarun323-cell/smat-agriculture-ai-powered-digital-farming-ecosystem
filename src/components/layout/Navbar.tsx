import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';
import { UserRole } from '../../types/index.ts';
import { 
  Sprout, 
  Bell, 
  SunMedium, 
  UserCheck, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles,
  Shield,
  Tractor,
  Truck,
  ShoppingBag,
  Store,
  HardHat,
  Check
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const roleConfigs: Record<UserRole, { label: string; icon: any; color: string; desc: string }> = {
  FARMER: { label: 'Farmer', icon: Sprout, color: 'bg-emerald-600 text-white', desc: 'Manage farm, AI recommendations & sales' },
  ADMIN: { label: 'System Admin', icon: Shield, color: 'bg-indigo-600 text-white', desc: 'Platform moderation, KYC & system audit' },
  WORKER: { label: 'Labour / Worker', icon: HardHat, color: 'bg-amber-600 text-white', desc: 'Accept farm jobs & track daily wages' },
  TRANSPORT: { label: 'Transport Provider', icon: Truck, color: 'bg-blue-600 text-white', desc: 'Manage freight trucks & haul routes' },
  BUYER: { label: 'Agri Buyer', icon: ShoppingBag, color: 'bg-purple-600 text-white', desc: 'Wholesale procurement & direct contracts' },
  STORE_OWNER: { label: 'Store Owner', icon: Store, color: 'bg-teal-600 text-white', desc: 'Manage seed & fertilizer inventory' },
  MACHINE_OWNER: { label: 'Machine Owner', icon: Tractor, color: 'bg-orange-600 text-white', desc: 'Lease tractors, harvesters & drones' }
};

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenProfile,
  mobileMenuOpen,
  setMobileMenuOpen,
  setActiveTab
}) => {
  const { user, role, switchRole, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const CurrentRoleIcon = roleConfigs[role]?.icon || Sprout;

  const handleRoleSelect = async (newRole: UserRole) => {
    await switchRole(newRole);
    setRoleDropdownOpen(false);
    if (newRole === 'ADMIN') setActiveTab('admin');
    else if (newRole === 'WORKER') setActiveTab('labour');
    else if (newRole === 'BUYER') setActiveTab('marketplace');
    else if (newRole === 'TRANSPORT') setActiveTab('transport');
    else if (newRole === 'STORE_OWNER') setActiveTab('store');
    else if (newRole === 'MACHINE_OWNER') setActiveTab('machines');
    else setActiveTab('dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-stone-900 tracking-tight text-base sm:text-lg">
                  SMART <span className="text-emerald-600">AGRICULTURE</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="h-2.5 w-2.5" /> AI 3.8
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block -mt-0.5">
                AI Powered Digital Farming Ecosystem
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Weather Pill */}
        <div 
          onClick={() => setActiveTab('weather')}
          className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200/60 cursor-pointer transition-colors text-xs font-medium"
          title="Click to view full 7-day agricultural weather forecast"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <SunMedium className="h-4 w-4 text-amber-500" />
          <span>Ludhiana: <strong>28.5°C</strong> • Partly Sunny</span>
          <span className="text-[10px] text-emerald-600 font-semibold bg-white px-1.5 py-0.5 rounded-full shadow-2xs">
            Spray Window Open
          </span>
        </div>

        {/* Right Actions: Persona Switcher, Notifications, User */}
        <div className="flex items-center gap-2.5">
          
          {/* RBAC Persona Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-emerald-300 bg-white hover:bg-stone-50 text-stone-800 transition-all text-xs font-semibold shadow-2xs"
            >
              <span className={`p-1 rounded-md ${roleConfigs[role]?.color}`}>
                <CurrentRoleIcon className="h-3.5 w-3.5" />
              </span>
              <div className="text-left hidden sm:block leading-tight">
                <div className="text-[10px] text-stone-500 font-normal">Active Role</div>
                <div>{roleConfigs[role]?.label}</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in duration-150">
                <div className="px-2 py-1.5 mb-1 border-b border-stone-100">
                  <p className="text-xs font-bold text-stone-900">Switch Ecosystem Role</p>
                  <p className="text-[11px] text-stone-500">Instant RBAC persona simulator for testing</p>
                </div>
                <div className="space-y-1">
                  {(Object.keys(roleConfigs) as UserRole[]).map((r) => {
                    const cfg = roleConfigs[r];
                    const Icon = cfg.icon;
                    const isSelected = r === role;
                    return (
                      <button
                        key={r}
                        onClick={() => handleRoleSelect(r)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                          isSelected ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`p-1.5 rounded-md ${cfg.color}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <div>
                            <div className="font-medium text-stone-900">{cfg.label}</div>
                            <div className="text-[10px] text-stone-500 leading-tight">{cfg.desc}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Centralized Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Open notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-stone-200 z-50 animate-in fade-in duration-150">
                <div className="p-3 border-b border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-stone-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markAsRead(n.id);
                          if (n.linkTab) {
                            setActiveTab(n.linkTab);
                            setNotifDropdownOpen(false);
                          }
                        }}
                        className={`p-3 text-left hover:bg-stone-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-stone-900">{n.title}</span>
                          {!n.read && (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5 line-clamp-2">{n.message}</p>
                        <span className="text-[10px] text-stone-400 mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-stone-100 transition-colors"
                title="View user profile"
              >
                <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs border border-emerald-300">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden xl:block">
                  <div className="text-xs font-semibold text-stone-800 leading-tight truncate max-w-[110px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                    <UserCheck className="h-2.5 w-2.5" /> Verified
                  </div>
                </div>
              </button>
              <button
                onClick={logout}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Sign In
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
