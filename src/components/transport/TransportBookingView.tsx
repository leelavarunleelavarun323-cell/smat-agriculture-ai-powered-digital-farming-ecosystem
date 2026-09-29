import React, { useState, useEffect } from 'react';
import { TransportVehicle, TransportBooking } from '../../types/index.ts';
import { useNotifications } from '../../context/NotificationContext.tsx';
import {
  Truck,
  MapPin,
  Calendar,
  Phone,
  CheckCircle2,
  Navigation,
  Clock,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Compass
} from 'lucide-react';

export const TransportBookingView: React.FC = () => {
  const { showToast } = useNotifications();
  const [vehicles, setVehicles] = useState<TransportVehicle[]>([]);
  const [bookings, setBookings] = useState<TransportBooking[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'FLEET' | 'TRACKING'>('FLEET');

  // Book Transport Modal State
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicle | null>(null);
  const [pickupLocation, setPickupLocation] = useState('Patel Bio-Farms, Ludhiana North Sector');
  const [dropLocation, setDropLocation] = useState('Chandigarh APMC Processing Unit 4');
  const [cropName, setCropName] = useState('Fresh Harvest Produce (Tomato / Wheat)');
  const [tonnage, setTonnage] = useState('5.0');
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [distanceKm, setDistanceKm] = useState('85');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [vRes, bRes] = await Promise.all([
        fetch('/api/transport/vehicles').then((r) => r.json()),
        fetch('/api/transport/bookings').then((r) => r.json())
      ]);
      if (vRes.success) setVehicles(vRes.data);
      if (bRes.success) setBookings(bRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookTransport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/transport/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: selectedVehicle.id,
          pickupLocation,
          dropLocation,
          cropName,
          tonnage: Number(tonnage),
          pickupDate,
          distanceKm: Number(distanceKm)
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Transport booked! Expense auto-recorded in Finance Ledger.');
        setSelectedVehicle(null);
        await fetchData();
        setActiveSubTab('TRACKING');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdvanceStep = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/transport/bookings/${bookingId}/step`, {
        method: 'POST'
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Transit Milestone updated to: ${json.data.status}`);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stepsList = ['BOOKED', 'DRIVER_EN_ROUTE', 'LOADED', 'IN_TRANSIT', 'DELIVERED'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-stone-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 mb-2">
            <Truck className="h-3.5 w-3.5" /> Agricultural Cold-Chain & Haulage Logistics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Agricultural Transport & Freight Booking
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Dispatch produce safely with specialized agricultural haulers: temperature-controlled refrigerated reefers, 10-ton flatbeds, and local tractor trolleys.
          </p>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveSubTab('FLEET')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'FLEET'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Available Transport Carriers ({vehicles.length})
        </button>
        <button
          onClick={() => setActiveSubTab('TRACKING')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'TRACKING'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Active Shipments & Live Tracking ({bookings.length})
        </button>
      </div>

      {activeSubTab === 'FLEET' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-base text-stone-900">{v.vehicleType}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Carrier: <strong>{v.providerName}</strong></p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {v.vehicleNumber}
                  </span>
                </div>

                <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Payload</span>
                    <strong className="text-stone-900">{v.capacityTons} Tons</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Base Freight</span>
                    <strong className="text-blue-700">₹{v.ratePerKm} / km</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Location</span>
                    <strong className="text-stone-700 text-[11px] truncate block">{v.currentLocation}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100">
                <button
                  onClick={() => setSelectedVehicle(v)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Truck className="h-3.5 w-3.5" /> Book Freight Vehicle
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Tracking Tab */
        <div className="space-y-4">
          {bookings.map((booking) => {
            const currentStepIdx = booking.liveStep ?? 0;
            return (
              <div
                key={booking.id}
                className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-stone-900 text-base">Booking #{booking.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Produce: <strong>{booking.cropName}</strong> ({booking.tonnage} Tons)
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <span className="text-stone-400 block">Freight Total</span>
                      <strong className="text-stone-900 text-base font-black">₹{booking.totalFare}</strong>
                    </div>

                    {booking.status !== 'DELIVERED' && (
                      <button
                        onClick={() => handleAdvanceStep(booking.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 transition-colors"
                      >
                        Advance Milestone <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Milestone Stepper */}
                <div className="py-2">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-stone-200 z-0" />
                    <div
                      style={{ width: `${(currentStepIdx / (stepsList.length - 1)) * 100}%` }}
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 z-0 transition-all duration-500"
                    />

                    {stepsList.map((step, sIdx) => {
                      const isDone = sIdx <= currentStepIdx;
                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isDone ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="h-4 w-4" /> : sIdx + 1}
                          </div>
                          <span className="text-[10px] font-semibold text-stone-600 mt-1 uppercase">
                            {step.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Route & Driver details */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 text-[10px] block">Pickup Gate</span>
                    <strong className="text-stone-800">{booking.pickupLocation}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Mandi Destination</span>
                    <strong className="text-stone-800">{booking.dropLocation}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Assigned Driver</span>
                    <strong className="text-stone-800">{booking.driverName} ({booking.driverPhone})</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="font-extrabold text-stone-900 text-base">Schedule Farm Produce Transport</h3>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="font-bold text-stone-900">{selectedVehicle.vehicleType}</div>
              <div className="text-stone-500 text-[11px]">
                {selectedVehicle.providerName} • Rate: ₹{selectedVehicle.ratePerKm}/km
              </div>
            </div>

            <form onSubmit={handleBookTransport} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Pickup Farm Location</label>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Mandi / Destination Hub</label>
                <input
                  type="text"
                  required
                  value={dropLocation}
                  onChange={(e) => setDropLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Haul Tonnage (Tons)</label>
                  <input
                    type="number"
                    step="0.5"
                    max={selectedVehicle.capacityTons}
                    required
                    value={tonnage}
                    onChange={(e) => setTonnage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Estimated Distance (km)</label>
                  <input
                    type="number"
                    required
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex justify-between items-center text-xs">
                <span>Calculated Total Fare:</span>
                <strong className="text-base font-black text-blue-950">
                  ₹{(Number(distanceKm) * selectedVehicle.ratePerKm).toLocaleString()}
                </strong>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedVehicle(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
                >
                  {submitting ? 'Booking...' : 'Confirm Freight Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
