import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole } from '../../types/index.ts';
import { X, Sprout, Shield, HardHat, Truck, ShoppingBag, Store, Tractor, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, switchRole } = useAuth();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('FARMER');
  const [location, setLocation] = useState('Punjab, India');
  const [farmName, setFarmName] = useState('Green Valley Farm');
  const [acres, setAcres] = useState('12');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'LOGIN') {
        const ok = await login(email, role);
        if (ok) {
          onClose();
        } else {
          setErrorMsg('Invalid credentials or suspended account. Try 1-click demo login below.');
        }
      } else {
        const ok = await register({
          name,
          email,
          phone,
          role,
          location,
          farmDetails: role === 'FARMER' ? {
            farmName,
            totalAcres: Number(acres),
            primaryCrops: ['Wheat', 'Tomato'],
            soilType: 'Alluvial',
            irrigationType: 'Drip'
          } : undefined
        });
        if (ok) {
          onClose();
        } else {
          setErrorMsg('Registration failed. Email may already be in use.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (targetRole: UserRole) => {
    setLoading(true);
    await switchRole(targetRole);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sprout className="h-6 w-6" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Smart Agriculture</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            {mode === 'LOGIN' ? 'Access Digital Farming Ecosystem' : 'Join the Agricultural Network'}
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Unified access for Farmers, Agronomists, Workers, Transporters & Buyers.
          </p>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Demo Personas */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
            <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wide mb-2 flex items-center justify-between">
              <span>Instant 1-Click Demo Login</span>
              <span className="text-[10px] text-emerald-600 font-normal">No password required</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('FARMER')}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-[11px] font-semibold text-stone-800 transition-all text-left shadow-2xs"
              >
                <Sprout className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Farmer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-stone-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-[11px] font-semibold text-stone-800 transition-all text-left shadow-2xs"
              >
                <Shield className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('BUYER')}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-stone-200 hover:border-purple-500 hover:bg-purple-50/50 text-[11px] font-semibold text-stone-800 transition-all text-left shadow-2xs"
              >
                <ShoppingBag className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                <span className="truncate">Buyer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('WORKER')}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-stone-200 hover:border-amber-500 hover:bg-amber-50/50 text-[11px] font-semibold text-stone-800 transition-all text-left shadow-2xs"
              >
                <HardHat className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Labour</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('TRANSPORT')}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-stone-200 hover:border-blue-500 hover:bg-blue-50/50 text-[11px] font-semibold text-stone-800 transition-all text-left shadow-2xs"
              >
                <Truck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Transport</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('STORE_OWNER')}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-stone-200 hover:border-teal-500 hover:bg-teal-50/50 text-[11px] font-semibold text-stone-800 transition-all text-left shadow-2xs"
              >
                <Store className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span className="truncate">Agri Store</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('MACHINE_OWNER')}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-stone-200 hover:border-orange-500 hover:bg-orange-50/50 text-[11px] font-semibold text-stone-800 transition-all text-left shadow-2xs col-span-2"
              >
                <Tractor className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                <span className="truncate">Machine Owner Fleet</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {mode === 'REGISTER' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Location / District</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ludhiana, Punjab"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Select Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="FARMER">Farmer (Cultivator / Landowner)</option>
                    <option value="BUYER">Buyer (Wholesaler / Processor / Consumer)</option>
                    <option value="WORKER">Worker / Agricultural Labour</option>
                    <option value="TRANSPORT">Transport Logistics Provider</option>
                    <option value="STORE_OWNER">Seeds & Fertilizer Store Owner</option>
                    <option value="MACHINE_OWNER">Machinery & Equipment Fleet Owner</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>

                {role === 'FARMER' && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 space-y-3">
                    <p className="text-[11px] font-bold text-emerald-900">Farm Dimensions</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-stone-600 mb-1">Farm Name</label>
                        <input
                          type="text"
                          value={farmName}
                          onChange={(e) => setFarmName(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-600 mb-1">Total Land (Acres)</label>
                        <input
                          type="number"
                          value={acres}
                          onChange={(e) => setAcres(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-300 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@smartagri.org"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{mode === 'LOGIN' ? 'Sign In to Ecosystem' : 'Complete Registration'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="pt-2 border-t border-stone-200 text-center text-xs text-stone-500">
            {mode === 'LOGIN' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('REGISTER')}
                  className="font-bold text-emerald-600 hover:underline"
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('LOGIN')}
                  className="font-bold text-emerald-600 hover:underline"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
