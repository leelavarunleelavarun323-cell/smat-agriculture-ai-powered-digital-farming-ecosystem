import React, { useState, useEffect } from 'react';
import { MarketPriceItem } from '../../types/index.ts';
import {
  TrendingUp,
  TrendingDown,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  DollarSign,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

interface MarketIntelligenceViewProps {
  setActiveTab: (tab: string) => void;
}

export const MarketIntelligenceView: React.FC<MarketIntelligenceViewProps> = ({ setActiveTab }) => {
  const [prices, setPrices] = useState<MarketPriceItem[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<MarketPriceItem | null>(null);
  const [filterState, setFilterState] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/market/prices')
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          setPrices(json.data);
          if (json.data.length > 0) setSelectedCrop(json.data[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterState === 'ALL'
    ? prices
    : prices.filter((p) => p.state.toLowerCase().includes(filterState.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-green-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
            <TrendingUp className="h-3.5 w-3.5" /> APMC Mandi Real-Time Price Index
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Market Demand & Price Intelligence
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Live commodity prices, demand elasticity metrics, predictive 7-day ARIMA price forecasting, and farm-gate arbitrage analysis.
          </p>
        </div>
      </div>

      {/* Main Grid: Crop List (5 cols) & Deep Analysis (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Mandi Rates (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Live Mandi Quotes</h2>
              <p className="text-[11px] text-stone-500">Updated today across North Indian APMCs</p>
            </div>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50"
            >
              <option value="ALL">All States</option>
              <option value="Punjab">Punjab</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>

          <div className="space-y-2.5 max-h-[550px] overflow-y-auto">
            {filtered.map((item) => {
              const isSelected = selectedCrop?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCrop(item)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-stone-900">{item.cropName}</div>
                      <div className="text-[10px] text-stone-500">{item.variety} • {item.mandi}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-sm text-stone-900">₹{item.currentPricePerQuintal}</div>
                      <span className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                        item.dailyChangePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {item.dailyChangePercent >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                        {item.dailyChangePercent}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px]">
                    <span className="text-stone-500">
                      Demand: <strong className="text-stone-800">{item.demandIndex}</strong>
                    </span>
                    <span className="text-stone-500">
                      Supply: <strong className="text-stone-800">{item.supplyIndex}</strong>
                    </span>
                    <span className="text-emerald-700 font-semibold">
                      Pred: ₹{item.predictedNextWeekPrice}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail & Trend Forecast (7 cols) */}
        {selectedCrop && (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-stone-900">{selectedCrop.cropName}</h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    {selectedCrop.variety}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {selectedCrop.mandi}, {selectedCrop.state}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="h-3.5 w-3.5" /> List Crop on Marketplace
                </button>
              </div>
            </div>

            {/* Price Ranges & AI Prediction */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 text-[10px] block">Current Modal Rate</span>
                <strong className="text-base font-black text-stone-900">₹{selectedCrop.modalPrice}</strong>
                <span className="text-[10px] text-stone-400 block">per Quintal (100kg)</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 text-[10px] block">Mandi Range (Min-Max)</span>
                <strong className="text-sm font-bold text-stone-900">₹{selectedCrop.minPrice} - ₹{selectedCrop.maxPrice}</strong>
                <span className="text-[10px] text-stone-400 block">Today's spread</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-emerald-800 text-[10px] block font-semibold">AI Next-Week Forecast</span>
                <strong className="text-base font-black text-emerald-700">₹{selectedCrop.predictedNextWeekPrice}</strong>
                <span className="text-[10px] text-emerald-600 block flex items-center gap-0.5">
                  <Sparkles className="h-2.5 w-2.5" /> High Confidence
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 text-[10px] block">Supply / Demand</span>
                <strong className="text-sm font-bold text-stone-900">{selectedCrop.supplyIndex}</strong>
                <span className="text-[10px] text-stone-500 block">Demand: {selectedCrop.demandIndex}</span>
              </div>
            </div>

            {/* Historical Price Trend Graph */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <BarChart3 className="h-4 w-4 text-emerald-600" />
                  <span>7-Day Price Movement & Historical Trajectory</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  Trajectory: {selectedCrop.dailyChangePercent >= 0 ? 'Bullish' : 'Neutral'}
                </span>
              </div>

              {/* Chart visualization */}
              <div className="h-40 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
                {selectedCrop.historicalPrices.map((hist, idx) => {
                  const maxPrice = 5000;
                  const heightPercent = Math.min(100, Math.max(25, (hist.price / maxPrice) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-[10px] font-bold text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{hist.price}
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-emerald-500 group-hover:bg-emerald-600 rounded-t-lg transition-all shadow-xs"
                      />
                      <span className="text-[9px] text-stone-400 font-medium">
                        {hist.date.split('-').slice(1).join('/')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Farmgate Arbitrage Analysis */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2 text-xs">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Ecosystem Direct Procurement Advantage</span>
              </div>
              <p className="text-emerald-900/80 leading-relaxed text-[11px]">
                Selling directly via our <strong>Crop Marketplace</strong> to verified food processors bypasses intermediate middleman margins (avg. ₹140/Q saved in APMC cess and loading charges). Plus, farm-gate pickup can be scheduled directly with our integrated transport fleet.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
