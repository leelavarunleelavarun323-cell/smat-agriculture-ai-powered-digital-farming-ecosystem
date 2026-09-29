import React, { useState, useEffect } from 'react';
import { IrrigationZone } from '../../types/index.ts';
import {
  Droplets,
  Power,
  Sliders,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  RefreshCw,
  TrendingDown
} from 'lucide-react';

export const SmartIrrigationView: React.FC = () => {
  const [zones, setZones] = useState<IrrigationZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showIotModal, setShowIotModal] = useState(false);

  const fetchZones = async () => {
    try {
      const res = await fetch('/api/irrigation/zones');
      const json = await res.json();
      if (json.success && json.data) {
        setZones(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleToggleValve = async (zoneId: string) => {
    setActionLoading(zoneId);
    try {
      const res = await fetch('/api/irrigation/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zoneId })
      });
      const json = await res.json();
      if (json.success) {
        await fetchZones();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleMode = async (zoneId: string) => {
    try {
      const res = await fetch('/api/irrigation/mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zoneId })
      });
      const json = await res.json();
      if (json.success) {
        await fetchZones();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalWaterUsed = zones.reduce((sum, z) => sum + z.totalWaterUsedTodayLiters, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-cyan-950 via-teal-950 to-stone-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/30 mb-2">
            <Droplets className="h-3.5 w-3.5" /> IoT Precision Soil Moisture Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Smart Micro-Irrigation Control System
          </h1>
          <p className="text-cyan-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Real-time capacitive soil moisture probes, automated solenoid valve control, dynamic evapotranspiration scheduling, and water conservation analytics.
          </p>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-stone-500 text-xs block mb-1">Active Solenoids</span>
          <div className="text-2xl font-black text-stone-900">
            {zones.filter((z) => z.status === 'IRRIGATING').length} / {zones.length}
          </div>
          <span className="text-[11px] text-cyan-600 font-semibold mt-1 block">
            {zones.filter((z) => z.status === 'IRRIGATING').length > 0 ? 'Water Flowing' : 'All Valves Closed'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-stone-500 text-xs block mb-1">Water Dispensed Today</span>
          <div className="text-2xl font-black text-cyan-700">
            {totalWaterUsed.toLocaleString()} <span className="text-xs font-normal text-stone-500">Liters</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Drip micro-emitter delivery</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-stone-500 text-xs block mb-1">Estimated Water Saved</span>
          <div className="text-2xl font-black text-emerald-600">
            18,400 <span className="text-xs font-normal text-stone-500">Liters</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block flex items-center gap-1">
            <TrendingDown className="h-3.5 w-3.5" /> 42% less than flood irrigation
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-stone-500 text-xs block mb-1">Sensor Architecture</span>
            <div className="text-xs font-bold text-stone-800">LoRaWAN Probes Online</div>
          </div>
          <button
            onClick={() => setShowIotModal(true)}
            className="text-xs font-bold text-cyan-700 hover:underline flex items-center gap-1"
          >
            <Cpu className="h-3.5 w-3.5" /> View Telemetry Architecture
          </button>
        </div>
      </div>

      {/* Field Zones Control Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">Field Irrigation Zones & Valve Actuators</h2>
            <p className="text-xs text-stone-500">Live capacitive moisture readings and interactive valve triggers</p>
          </div>
          <button
            onClick={fetchZones}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title="Refresh telemetry"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {zones.map((zone) => {
            const isIrrigating = zone.status === 'IRRIGATING';
            const isLow = zone.soilMoisture < zone.targetMoisture - 10;
            return (
              <div
                key={zone.id}
                className={`p-6 rounded-3xl bg-white border transition-all shadow-2xs flex flex-col justify-between ${
                  isIrrigating ? 'border-cyan-400 ring-2 ring-cyan-400/20' : 'border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-sm text-stone-900 leading-snug">{zone.zoneName}</h3>
                      <p className="text-xs text-stone-500 mt-0.5">Crop: <strong>{zone.crop}</strong> ({zone.areaAcres} Acres)</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      isIrrigating
                        ? 'bg-cyan-100 text-cyan-900 animate-pulse'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${isIrrigating ? 'bg-cyan-600' : 'bg-stone-400'}`} />
                      {zone.status}
                    </span>
                  </div>

                  {/* Moisture Gauge */}
                  <div className="mt-6 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-600 flex items-center gap-1">
                        <Activity className="h-3.5 w-3.5 text-cyan-600" /> Soil Moisture
                      </span>
                      <span className={`font-black text-base ${isLow ? 'text-amber-600' : 'text-stone-900'}`}>
                        {zone.soilMoisture}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, zone.soilMoisture)}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLow ? 'bg-amber-500' : 'bg-cyan-600'
                        }`}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-stone-400">
                      <span>Target: {zone.targetMoisture}%</span>
                      <span>Flow: {zone.flowRateLitersPerMin} L/min</span>
                    </div>
                  </div>

                  {/* Zone Details */}
                  <div className="mt-4 space-y-2 text-xs text-stone-600">
                    <div className="flex items-center justify-between">
                      <span>Mode:</span>
                      <button
                        onClick={() => handleToggleMode(zone.id)}
                        className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-[10px]"
                      >
                        {zone.mode} (Click to toggle)
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Watered:</span>
                      <strong className="text-stone-800">{zone.lastWatered}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Schedule:</span>
                      <strong className="text-stone-800">{zone.schedule}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Water Used Today:</span>
                      <strong className="text-cyan-700 font-bold">{zone.totalWaterUsedTodayLiters} L</strong>
                    </div>
                  </div>
                </div>

                {/* Valve Actuator Action */}
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleToggleValve(zone.id)}
                    disabled={actionLoading === zone.id}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                      isIrrigating
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/20'
                    }`}
                  >
                    <Power className="h-4 w-4" />
                    {actionLoading === zone.id ? (
                      <span>Updating Valve...</span>
                    ) : isIrrigating ? (
                      <span>Stop Drip Cycle</span>
                    ) : (
                      <span>Start Drip Cycle</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* IoT Architecture Modal */}
      {showIotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-cyan-600" />
                <h3 className="font-extrabold text-stone-900 text-base">Smart IoT Telemetry Architecture</h3>
              </div>
              <button
                onClick={() => setShowIotModal(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
              <p>
                Our digital farming ecosystem connects capacitive <strong>FDR soil moisture sensors</strong> and <strong>PT100 temperature probes</strong> via LoRaWAN gateways stationed across farm sectors.
              </p>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="font-bold text-stone-900">Communication Pipeline:</div>
                <div className="text-[11px] font-mono text-stone-600 space-y-1">
                  <div>1. Soil Probes (0-100% Volumetric Water Content)</div>
                  <div>2. Solar Edge Node (ESP32 / LoRa 868MHz transmitter)</div>
                  <div>3. MQTT Microservice Broker → REST API Endpoint</div>
                  <div>4. Automated Solenoid Valve Relays (12V DC latching)</div>
                </div>
              </div>
              <p className="text-[11px] text-stone-500">
                When soil moisture drops below threshold (e.g. 50%), the edge controller triggers micro-drip emitters and notifies the farmer dashboard in real-time.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
