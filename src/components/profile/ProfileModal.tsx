import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { X, CheckCircle2, ShieldCheck, MapPin, Phone, Mail, Award, Save } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [farmName, setFarmName] = useState(user?.farmDetails?.farmName || '');
  const [acres, setAcres] = useState(String(user?.farmDetails?.totalAcres || '18.5'));
  const [soilType, setSoilType] = useState(user?.farmDetails?.soilType || 'Alluvial');
  const [saved, setSaved] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      phone,
      location,
      farmDetails: user.farmDetails ? {
        ...user.farmDetails,
        farmName,
        totalAcres: Number(acres),
        soilType
      } : undefined
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden relative">
        <div className="p-6 bg-gradient-to-r from-emerald-800 to-green-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl font-black">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight">{user.name}</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-emerald-950">
                  <ShieldCheck className="h-3 w-3" /> KYC Verified
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5 capitalize">
                Role: {user.role.replace('_', ' ')} • Status: {user.status}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {saved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Profile saved successfully!
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Location / Mandi Zone</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {user.role === 'FARMER' && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                <Award className="h-4 w-4 text-emerald-600" />
                <span>Agricultural Holdings & Soil Profile</span>
              </div>
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
                  <label className="block text-[11px] text-stone-600 mb-1">Total Acres</label>
                  <input
                    type="text"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-300 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-stone-600 mb-1">Dominant Soil Type</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-300 bg-white"
                >
                  <option value="Alluvial">Alluvial (High Fertile Loam)</option>
                  <option value="Black">Black Soil (High Moisture Retention)</option>
                  <option value="Red">Red Soil (Iron Rich)</option>
                  <option value="Clay">Clay (Heavy)</option>
                  <option value="Sandy">Sandy Loam (Fast Drainage)</option>
                </select>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
