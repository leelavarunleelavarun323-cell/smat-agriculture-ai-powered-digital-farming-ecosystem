import React, { useState, useEffect } from 'react';
import { CropRecommendationInput, CropRecommendationItem } from '../../types/index.ts';
import {
  Sparkles,
  Sprout,
  Droplets,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  Sliders,
  Info
} from 'lucide-react';

interface CropRecommendationViewProps {
  setActiveTab: (tab: string) => void;
}

export const CropRecommendationView: React.FC<CropRecommendationViewProps> = ({ setActiveTab }) => {
  const [formData, setFormData] = useState<CropRecommendationInput>({
    location: 'Ludhiana, Punjab',
    soilType: 'Alluvial',
    soilPh: 6.8,
    nitrogen: 65,
    phosphorus: 48,
    potassium: 42,
    temperature: 28,
    humidity: 58,
    rainfall: 620,
    waterAvailability: 'Moderate',
    season: 'Kharif',
    farmArea: 5,
    previousCrop: 'Wheat',
    irrigationType: 'Drip'
  });

  const [recommendations, setRecommendations] = useState<CropRecommendationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropRecommendationItem | null>(null);

  // Initial load with default values
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/crop-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success && json.data) {
        setRecommendations(json.data);
        if (json.data.length > 0) setSelectedCrop(json.data[0]);
      }
    } catch (err) {
      console.error('Failed to get crop recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecommendations();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-green-900 to-stone-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
            <Sparkles className="h-3.5 w-3.5" /> AI Agronomy Intelligence (Gemini 3.8 Flash)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Crop Recommendation Engine
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Multi-factor soil chemistry, micro-climate telemetry, water availability, and APMC market demand analytics synthesize optimal crop rotations for maximum profitability.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Parameter Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-stone-900">Farm & Soil Diagnostics</h2>
            </div>
            <span className="text-[11px] text-stone-500">14 Parameters</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Farm Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 bg-stone-50/50"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Season</label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Kharif">Kharif (Monsoon/Autumn)</option>
                  <option value="Rabi">Rabi (Winter/Spring)</option>
                  <option value="Zaid">Zaid (Summer)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Soil Type</label>
                <select
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Alluvial">Alluvial (High Fertility)</option>
                  <option value="Black">Black (Clayey / Moisture-holding)</option>
                  <option value="Red">Red (Sandy Clay)</option>
                  <option value="Clay">Clay (Heavy / Dense)</option>
                  <option value="Loamy">Loamy (Balanced)</option>
                  <option value="Sandy">Sandy (Fast Drainage)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Irrigation Method</label>
                <select
                  value={formData.irrigationType}
                  onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Drip">Drip Irrigation (High Efficiency)</option>
                  <option value="Sprinkler">Micro Sprinkler</option>
                  <option value="Canal / Flood">Canal / Surface Furrow</option>
                  <option value="Borewell">Deep Borewell Tubewell</option>
                  <option value="Rainfed">Rainfed (Dryland)</option>
                </select>
              </div>
            </div>

            {/* Soil Chemistry (NPK + pH) */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between text-stone-800 font-bold">
                <span>Soil Nutrients (NPK & pH)</span>
                <span className="text-[10px] text-emerald-600 font-normal">Lab Tested</span>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                  <span>Soil pH: <strong>{formData.soilPh}</strong></span>
                  <span className="text-stone-400">
                    {formData.soilPh < 6 ? 'Acidic' : formData.soilPh > 7.5 ? 'Alkaline' : 'Neutral / Optimal'}
                  </span>
                </div>
                <input
                  type="range"
                  min="4.5"
                  max="9.0"
                  step="0.1"
                  value={formData.soilPh}
                  onChange={(e) => setFormData({ ...formData, soilPh: Number(e.target.value) })}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Nitrogen (N)</label>
                  <input
                    type="number"
                    value={formData.nitrogen}
                    onChange={(e) => setFormData({ ...formData, nitrogen: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded border border-stone-300 bg-white text-xs font-semibold"
                  />
                  <span className="text-[9px] text-stone-400">kg/ha</span>
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Phosphorus (P)</label>
                  <input
                    type="number"
                    value={formData.phosphorus}
                    onChange={(e) => setFormData({ ...formData, phosphorus: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded border border-stone-300 bg-white text-xs font-semibold"
                  />
                  <span className="text-[9px] text-stone-400">kg/ha</span>
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Potassium (K)</label>
                  <input
                    type="number"
                    value={formData.potassium}
                    onChange={(e) => setFormData({ ...formData, potassium: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded border border-stone-300 bg-white text-xs font-semibold"
                  />
                  <span className="text-[9px] text-stone-400">kg/ha</span>
                </div>
              </div>
            </div>

            {/* Environmental & Agronomic Context */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-stone-600 text-[11px] mb-1">Temp (°C)</label>
                <input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded border border-stone-300 bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-stone-600 text-[11px] mb-1">Humidity (%)</label>
                <input
                  type="number"
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded border border-stone-300 bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-stone-600 text-[11px] mb-1">Rain (mm)</label>
                <input
                  type="number"
                  value={formData.rainfall}
                  onChange={(e) => setFormData({ ...formData, rainfall: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded border border-stone-300 bg-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Previous Crop</label>
                <input
                  type="text"
                  value={formData.previousCrop}
                  onChange={(e) => setFormData({ ...formData, previousCrop: e.target.value })}
                  placeholder="e.g. Wheat"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Farm Area (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.farmArea}
                  onChange={(e) => setFormData({ ...formData, farmArea: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Computing AI Crop Models...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Compute AI Crop Recommendations</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900">Recommended Crops for Your Soil</h2>
            <span className="text-xs text-stone-500 font-medium">Ranked by Suitability Score</span>
          </div>

          {loading ? (
            <div className="p-12 bg-white rounded-3xl border border-stone-200 text-center space-y-3">
              <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-stone-800">Synthesizing Agronomic Models...</p>
              <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                Analyzing soil pH ({formData.soilPh}), NPK ratios, evapotranspiration rates, and historical mandi price curves.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => {
                const isSelected = selectedCrop?.id === rec.id;
                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedCrop(rec)}
                    className={`p-5 rounded-3xl bg-white border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : 'border-stone-200 hover:border-stone-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg font-black text-stone-900">{rec.cropName}</span>
                          <span className="text-xs text-stone-500 font-medium">({rec.variety})</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Demand: {rec.expectedMarketDemand}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.riskLevel === 'Low' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            Risk: {rec.riskLevel}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                            Water: {rec.waterRequirement}
                          </span>
                        </div>
                      </div>

                      {/* Suitability Score Gauge */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <div className="text-2xl font-black text-emerald-600">{rec.suitabilityScore}%</div>
                          <div className="text-[10px] text-stone-400 font-semibold uppercase">Suitability</div>
                        </div>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200/60 text-xs">
                      <div>
                        <span className="text-stone-500 text-[10px] block">Expected Yield</span>
                        <strong className="text-stone-900">{rec.expectedYield}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 text-[10px] block">Duration</span>
                        <strong className="text-stone-900">{rec.estimatedDuration}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 text-[10px] block">Estimated Revenue</span>
                        <strong className="text-emerald-700">₹{rec.estimatedRevenuePerAcre.toLocaleString()}/ac</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 text-[10px] block">Est. Net Profit</span>
                        <strong className="text-emerald-700">₹{rec.estimatedProfitPerAcre.toLocaleString()}/ac</strong>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="mt-3.5 text-xs text-stone-600 leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/60">
                      <div className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
                        <Info className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Why this crop is recommended:</span>
                      </div>
                      <p>{rec.whyRecommended}</p>
                    </div>

                    {/* Action buttons connecting other modules */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[11px] text-stone-500">
                        Fertilizer: <span className="font-semibold text-stone-800">{rec.fertilizerRequirement}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab('store');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" /> Order Seeds
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab('irrigation');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center gap-1"
                        >
                          <Droplets className="h-3.5 w-3.5 text-cyan-600" /> Plan Irrigation
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
