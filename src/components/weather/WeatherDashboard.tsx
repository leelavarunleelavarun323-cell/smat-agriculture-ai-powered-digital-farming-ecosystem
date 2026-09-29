import React, { useState, useEffect } from 'react';
import { WeatherData } from '../../types/index.ts';
import {
  CloudSun,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface WeatherDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ setActiveTab }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/weather')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setWeather(json.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !weather) {
    return (
      <div className="p-12 text-center text-xs text-stone-500">
        Loading agricultural micro-climate telemetry...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-900 via-blue-900 to-stone-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 text-xs font-bold border border-sky-400/30 mb-2">
            <CloudSun className="h-3.5 w-3.5" /> Live Agro-Meteorological Station
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Smart Weather & Advisory System
          </h1>
          <p className="text-sky-100 text-xs sm:text-sm mt-1 leading-relaxed">
            {weather.location} • Real-time satellite precipitation radar, micro-climate soil probes, and precision farming advisories.
          </p>
        </div>
      </div>

      {/* Current Conditions Primary Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main Temperature & Telemetry (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Current Farm Weather</span>
              <div className="text-4xl sm:text-5xl font-black text-stone-900 mt-1">
                {weather.current.tempC}°C{' '}
                <span className="text-sm font-medium text-stone-400">/ {weather.current.tempF}°F</span>
              </div>
              <p className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                <Sun className="h-4 w-4 text-amber-500" /> {weather.current.condition}
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
              <div className="text-stone-500">Air Quality: <strong className="text-stone-800">{weather.current.airQuality}</strong></div>
              <div className="text-stone-500">Soil Probe Temp: <strong className="text-stone-800">{weather.current.soilTempC}°C</strong></div>
              <div className="text-stone-500">UV Index: <strong className="text-amber-600">{weather.current.uvIndex} (Moderate)</strong></div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-sky-50/60 rounded-2xl border border-sky-100 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                <Droplets className="h-4 w-4" />
              </div>
              <div>
                <span className="text-stone-500 text-[10px] block">Relative Humidity</span>
                <strong className="text-stone-900">{weather.current.humidity}%</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                <Wind className="h-4 w-4" />
              </div>
              <div>
                <span className="text-stone-500 text-[10px] block">Wind Speed</span>
                <strong className="text-stone-900">{weather.current.windSpeedKmh} km/h</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                <CloudRain className="h-4 w-4" />
              </div>
              <div>
                <span className="text-stone-500 text-[10px] block">Rain Probability</span>
                <strong className="text-stone-900">{weather.current.rainProbability}%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Rain Alert Box (5 cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-100 mb-2">
              <AlertTriangle className="h-4 w-4 text-white" /> Extreme Weather Outlook
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">Monsoon Showers Friday (Oct 2)</h3>
            <p className="text-xs text-amber-50 mt-2 leading-relaxed">
              Meteorological models forecast 18.5mm rainfall with wind gusts up to 28 km/h. Clear field drains and complete planned spraying before Thursday evening.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
            <span className="text-xs text-amber-100">75% Precipitation Probability</span>
            <button
              onClick={() => setActiveTab('irrigation')}
              className="px-3 py-1.5 rounded-xl bg-white text-stone-900 text-xs font-bold shadow-xs hover:bg-stone-100 transition-colors"
            >
              Adjust Irrigation
            </button>
          </div>
        </div>

      </div>

      {/* 4 Agriculture Specific Advisories */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">Crop-Specific Operational Advisories</h2>
            <p className="text-xs text-stone-500">Actionable farming windows grounded in dynamic meteorological data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {weather.advisories.map((adv, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                adv.level === 'WARNING'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : adv.level === 'OPTIMAL'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-stone-50 border-stone-200 text-stone-950'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80">
                  {adv.type}
                </span>
                <span className={`text-[10px] font-bold ${
                  adv.level === 'WARNING' ? 'text-amber-700' : adv.level === 'OPTIMAL' ? 'text-emerald-700' : 'text-stone-600'
                }`}>
                  {adv.level}
                </span>
              </div>
              <h3 className="font-bold text-xs leading-snug">{adv.title}</h3>
              <p className="text-[11px] opacity-80 mt-1.5 leading-relaxed">{adv.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Weather Forecast */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">7-Day Farming Weather Forecast</h2>
            <p className="text-xs text-stone-500">Day-by-day temperature trends and rainfall distribution</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weather.forecast.map((day, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl text-center border transition-all ${
                day.day === 'Today'
                  ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/10'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <span className="text-xs font-bold text-stone-900 block">{day.day}</span>
              <span className="text-[10px] text-stone-400 block mb-2">{day.date.split('-').slice(1).join('/')}</span>

              <div className="my-2 flex justify-center">
                {day.rainProb > 40 ? (
                  <CloudRain className="h-6 w-6 text-sky-500" />
                ) : day.condition.includes('Sunny') ? (
                  <Sun className="h-6 w-6 text-amber-500" />
                ) : (
                  <CloudSun className="h-6 w-6 text-stone-500" />
                )}
              </div>

              <div className="text-xs font-extrabold text-stone-900">
                {day.tempMax}° / <span className="text-stone-500 font-normal">{day.tempMin}°</span>
              </div>

              <div className="mt-2 text-[10px] font-semibold text-sky-700 bg-sky-100/60 py-0.5 rounded-full">
                {day.rainProb}% rain
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
