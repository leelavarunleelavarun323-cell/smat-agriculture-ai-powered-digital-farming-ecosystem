import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Farm, WeatherData, MarketPriceItem, IrrigationZone, FinancialSummary } from '../../types/index.ts';
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
  Layers,
  Wallet,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Plus,
  CheckCircle2,
  Calendar,
  Activity,
  Gauge
} from 'lucide-react';

interface FarmerDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [prices, setPrices] = useState<MarketPriceItem[]>([]);
  const [zones, setZones] = useState<IrrigationZone[]>([]);
  const [finance, setFinance] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Quick Add Field Modal State
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newCropName, setNewCropName] = useState('Chilli');
  const [newArea, setNewArea] = useState('3.0');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [farmRes, weatherRes, priceRes, irrigRes, finRes] = await Promise.all([
          fetch('/api/farms').then((r) => r.json()),
          fetch('/api/weather').then((r) => r.json()),
          fetch('/api/market/prices').then((r) => r.json()),
          fetch('/api/irrigation/zones').then((r) => r.json()),
          fetch('/api/finance/summary').then((r) => r.json())
        ]);

        if (farmRes.success) setFarms(farmRes.data);
        if (weatherRes.success) setWeather(weatherRes.data);
        if (priceRes.success) setPrices(priceRes.data);
        if (irrigRes.success) setZones(irrigRes.data);
        if (finRes.success) setFinance(finRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleAddFieldSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farms.length) return;
    const farmId = farms[0].id;
    try {
      const res = await fetch(`/api/farms/${farmId}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldName: newFieldName || 'New Crop Sector',
          cropName: newCropName,
          variety: 'Hybrid High Yield',
          areaAcres: Number(newArea),
          stage: 'Sowing'
        })
      });
      const json = await res.json();
      if (json.success) {
        const updated = await fetch('/api/farms').then((r) => r.json());
        if (updated.success) setFarms(updated.data);
        setShowAddField(false);
        setNewFieldName('');
      }
    } catch (err) {
      console.error('Error adding field:', err);
    }
  };

  const currentFarm = farms[0];
  const activeFields = currentFarm?.activeCrops || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Welcome Banner & Overview */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Sprout className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/50 border border-emerald-500/30 text-emerald-200 text-xs font-semibold mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Digital Farming Operating System
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || 'Farmer'}!
          </h1>
          <p className="text-emerald-100 text-sm mt-1 leading-relaxed">
            {currentFarm?.name || 'Patel Organic Bio-Farms'} • {currentFarm?.totalAreaAcres || 18.5} Total Acres • All sensors and AI models operational.
          </p>
          
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('crop-recommendation')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" /> Run AI Crop Advisory
            </button>
            <button
              onClick={() => setActiveTab('irrigation')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs transition-all flex items-center gap-2"
            >
              <Droplets className="h-4 w-4 text-cyan-300" /> Sensor & Irrigation
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs transition-all flex items-center gap-2"
            >
              <Layers className="h-4 w-4 text-amber-300" /> Sell Harvest Direct
            </button>
          </div>
        </div>
      </div>

      {/* Critical Agricultural Alerts Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-amber-900">Moisture Alert • Field C (Mustard)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-semibold">26% Moisture</span>
            </div>
            <p className="text-xs text-amber-800 mt-1">
              Soil moisture is in the critical zone for seedlings. Run drip cycle for 45 minutes today.
            </p>
            <button
              onClick={() => setActiveTab('irrigation')}
              className="mt-2 text-xs font-bold text-amber-900 hover:underline flex items-center gap-1"
            >
              Start Drip Irrigation Now <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-emerald-900">Mandi Price Surge • Tomato +4.8%</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-semibold">₹2,850/Quintal</span>
            </div>
            <p className="text-xs text-emerald-800 mt-1">
              High wholesale procurement demand across regional mandis. Your harvest contract is ready.
            </p>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="mt-2 text-xs font-bold text-emerald-900 hover:underline flex items-center gap-1"
            >
              View Buyer Offers <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Cultivated Area</span>
            <Sprout className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">
            {currentFarm?.totalAreaAcres || 18.5} <span className="text-xs font-normal text-stone-500">Acres</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> 3 Active Crop Zones
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Net Profit (Kharif)</span>
            <Wallet className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600">
            ₹{finance ? (finance.netProfit).toLocaleString() : '1,78,594'}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Margin: <strong>{finance?.profitMarginPercent || 88}%</strong> on ₹2.03L Revenue
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Weather & Spray</span>
            <CloudSun className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">
            {weather?.current.tempC || 28.5}°C
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Spray Window Open (36 hrs)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Irrigation State</span>
            <Droplets className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">
            {zones.filter((z) => z.status === 'IRRIGATING').length} Active
          </div>
          <div className="text-[11px] text-cyan-700 font-medium mt-1">
            1,680L saved via Smart Drip
          </div>
        </div>
      </div>

      {/* 10 Quick Actions Ecosystem Grid */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-stone-900">Digital Farming Services & Quick Actions</h2>
            <p className="text-xs text-stone-500">Instant access to all connected ecosystem modules</p>
          </div>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            10 Connected Modules
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => setActiveTab('crop-recommendation')}
            className="p-3.5 rounded-2xl bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200/80 text-left transition-all group"
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="font-bold text-xs text-stone-900">AI Crop Rec</div>
            <div className="text-[10px] text-stone-500">Gemini Agronomy</div>
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className="p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-50 hover:border-amber-300 border border-stone-200/80 text-left transition-all group"
          >
            <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <CloudSun className="h-5 w-5" />
            </div>
            <div className="font-bold text-xs text-stone-900">Smart Weather</div>
            <div className="text-[10px] text-stone-500">7-Day Forecast</div>
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className="p-3.5 rounded-2xl bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200/80 text-left transition-all group"
          >
            <div className="h-9 w-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="font-bold text-xs text-stone-900">Market Mandi</div>
            <div className="text-[10px] text-stone-500">Live APMC Prices</div>
          </button>

          <button
            onClick={() => setActiveTab('irrigation')}
            className="p-3.5 rounded-2xl bg-stone-50 hover:bg-cyan-50 hover:border-cyan-300 border border-stone-200/80 text-left transition-all group"
          >
            <div className="h-9 w-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Droplets className="h-5 w-5" />
            </div>
            <div className="font-bold text-xs text-stone-900">Smart Irrigation</div>
            <div className="text-[10px] text-stone-500">Moisture & Valves</div>
          </button>

          <button
            onClick={() => setActiveTab('labour')}
            className="p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-50 hover:border-amber-300 border border-stone-200/80 text-left transition-all group"
          >
            <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <HardHat className="h-5 w-5" />
            </div>
            <div className="font-bold text-xs text-stone-900">Labour Hire</div>
            <div className="text-[10px] text-stone-500">Skilled Farm Workers</div>
          </button>

          <button
            onClick={() => setActiveTab('machines')}
            className="p-3.5 rounded-2xl bg-stone-50 hover:bg-orange-50 hover:border-orange-300 border border-stone-200/80 text-left transition-all group"
          >
            <div className="h-9 w-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Tractor className="h-5 w-5" />
            </div>
            <div className="font-bold text-xs text-stone-900">Machine Rental</div>
            <div className="text-[10px] text-stone-500">Tractors & Drones</div>
          </button>

          <button
            onClick={() => setActiveTab('transport')}
            className="p-3.5 rounded-2xl bg-stone-50 hover:bg-blue-50 hover:border-blue-300 border border-stone-200/80 text-left transition-all group"
          >
            <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Truck className="h-5 w-5" />
            </div>
            <div className="font-bold text-xs text-stone-900">Agri Transport</div>
            <div className="text-[10px] text-stone-500">Haulage & Trucks</div>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className="p-3.5 rounded-2xl bg-stone-50 hover:bg-purple-50 hover:border-purple-300 border border-stone-200/80 text-left transition-all group"
          >
            <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5" />
            </div>
            <div className="font-bold text-xs text-stone-900">Marketplace</div>
            <div className="text-[10px] text-stone-500">Direct Buyer Sales</div>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className="p-3.5 rounded-2xl bg-stone-50 hover:bg-teal-50 hover:border-teal-300 border border-stone-200/80 text-left transition-all group"
          >
            <div className="h-9 w-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Store className="h-5 w-5" />
            </div>
            <div className="font-bold text-xs text-stone-900">Seeds & Inputs</div>
            <div className="text-[10px] text-stone-500">Kisan Agro Store</div>
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className="p-3.5 rounded-2xl bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200/80 text-left transition-all group"
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="font-bold text-xs text-stone-900">Finance Ledger</div>
            <div className="text-[10px] text-stone-500">Profit & Expense</div>
          </button>
        </div>
      </div>

      {/* Active Crop Fields Section */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">My Farm Fields & Active Cultivations</h2>
            <p className="text-xs text-stone-500">Real-time biological growth stages, health scores, and soil sensors</p>
          </div>
          <button
            onClick={() => setShowAddField(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 self-start shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Field Zone
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeFields.map((field) => (
            <div
              key={field.id}
              className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-stone-900">{field.cropName}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {field.stage}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium">
                  {field.fieldName} • {field.variety}
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Field Area:</span>
                    <strong className="text-stone-900">{field.areaAcres} Acres</strong>
                  </div>
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Health Score:</span>
                    <strong className="text-emerald-700 flex items-center gap-1">
                      <Activity className="h-3 w-3" /> {field.healthScore}% Optimal
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Soil Moisture:</span>
                    <strong className={`${field.soilMoisturePercent < 30 ? 'text-amber-600' : 'text-stone-900'}`}>
                      {field.soilMoisturePercent}%
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Target Yield:</span>
                    <strong className="text-stone-900">{field.targetYieldTons} Tons</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-[11px]">
                <span className="text-stone-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Harvest: {field.expectedHarvestDate}
                </span>
                <button
                  onClick={() => setActiveTab('irrigation')}
                  className="font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
                >
                  Sensors <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Add Field Modal */}
      {showAddField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">Add New Cultivation Field</h3>
            <form onSubmit={handleAddFieldSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Field Zone Name</label>
                <input
                  type="text"
                  required
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="e.g. West Basin Sector D"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Crop</label>
                  <input
                    type="text"
                    required
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    placeholder="e.g. Tomato / Wheat"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddField(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Register Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Market Produce Snapshot */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">Regional APMC Mandi Price Benchmarks</h2>
            <p className="text-xs text-stone-500">Live commodity prices, demand indices & price predictions</p>
          </div>
          <button
            onClick={() => setActiveTab('market')}
            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
          >
            Full Market Intelligence <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {prices.slice(0, 3).map((item) => (
            <div key={item.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900">{item.cropName}</span>
                <span className={`text-xs font-bold ${item.dailyChangePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.dailyChangePercent >= 0 ? '+' : ''}{item.dailyChangePercent}%
                </span>
              </div>
              <div className="text-xl font-black text-stone-900 mt-2">
                ₹{item.currentPricePerQuintal.toLocaleString()}{' '}
                <span className="text-xs font-normal text-stone-500">/ Quintal</span>
              </div>
              <div className="mt-2 text-xs text-stone-500 flex items-center justify-between">
                <span>{item.mandi}</span>
                <span className="px-2 py-0.5 rounded bg-white text-stone-700 border border-stone-200 text-[10px] font-semibold">
                  Demand: {item.demandIndex}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
