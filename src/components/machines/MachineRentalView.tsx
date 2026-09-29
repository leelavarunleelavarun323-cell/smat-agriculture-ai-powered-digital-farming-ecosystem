import React, { useState, useEffect } from 'react';
import { MachineItem, MachineBooking } from '../../types/index.ts';
import { useNotifications } from '../../context/NotificationContext.tsx';
import {
  Tractor,
  Search,
  Star,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  Cpu,
  Filter,
  ArrowRight
} from 'lucide-react';

export const MachineRentalView: React.FC = () => {
  const { showToast } = useNotifications();
  const [machines, setMachines] = useState<MachineItem[]>([]);
  const [bookings, setMachineBookings] = useState<MachineBooking[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [selectedMachine, setSelectedMachine] = useState<MachineItem | null>(null);
  const [rentalDays, setRentalDays] = useState('1');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('Patel Bio-Farms, Ludhiana North');
  const [submitting, setSubmitting] = useState(false);

  const [activeSubTab, setActiveSubTab] = useState<'MACHINES' | 'MY_RENTALS'>('MACHINES');

  const fetchData = async () => {
    try {
      const [mRes, bRes] = await Promise.all([
        fetch('/api/machines').then((r) => r.json()),
        fetch('/api/machines/bookings').then((r) => r.json())
      ]);
      if (mRes.success) setMachines(mRes.data);
      if (bRes.success) setMachineBookings(bRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachine) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/machines/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machineId: selectedMachine.id,
          rentalDurationDays: Number(rentalDays),
          startDate,
          location
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Machine ${selectedMachine.title} booked! Expense recorded in Finance.`);
        setSelectedMachine(null);
        await fetchData();
        setActiveSubTab('MY_RENTALS');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = selectedCategory === 'ALL'
    ? machines
    : machines.filter((m) => m.category === selectedCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-orange-950 via-stone-900 to-amber-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30 mb-2">
            <Tractor className="h-3.5 w-3.5" /> High-Torque Machinery & Drone Fleet
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Agricultural Machine Rental Platform
          </h1>
          <p className="text-orange-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Rent tractors, multi-crop combine harvesters, laser levelers, and autonomous aerial spraying drones by the hour or day. Verified fleet owners with transparent rates.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveSubTab('MACHINES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'MACHINES'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Machinery Fleet Catalog ({machines.length})
        </button>
        <button
          onClick={() => setActiveSubTab('MY_RENTALS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'MY_RENTALS'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          My Active Rentals ({bookings.length})
        </button>
      </div>

      {activeSubTab === 'MACHINES' ? (
        <div className="space-y-4">
          
          {/* Category Filter */}
          <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-stone-500 px-2">Filter Category:</span>
            {['ALL', 'Tractor', 'Harvester', 'Sprayer Drone', 'Rotavator'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat === 'ALL' ? 'All Machinery' : cat}
              </button>
            ))}
          </div>

          {/* Machine Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((mach) => (
              <div
                key={mach.id}
                className="bg-white rounded-3xl border border-stone-200 hover:border-orange-400 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={mach.imageUrl}
                      alt={mach.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                      {mach.hp} HP • {mach.category}
                    </span>
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                      {mach.availableFrom}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-base text-stone-900 leading-snug">{mach.title}</h3>
                        <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-stone-400" /> {mach.location}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg shrink-0">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {mach.rating}
                      </div>
                    </div>

                    {/* Specs Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {mach.specs.map((spec, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 text-stone-700">
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Hourly Rate</span>
                        <strong className="text-stone-900 text-sm font-black">₹{mach.ratePerHour}</strong>
                        <span className="text-[10px] text-stone-500"> / hour</span>
                      </div>
                      <div className="h-6 w-px bg-stone-200" />
                      <div>
                        <span className="text-[10px] text-stone-400 block">Full Day Rate</span>
                        <strong className="text-orange-700 text-sm font-black">₹{mach.ratePerDay}</strong>
                        <span className="text-[10px] text-stone-500"> / day</span>
                      </div>
                      <div className="h-6 w-px bg-stone-200" />
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block">Fleet Owner</span>
                        <span className="font-bold text-stone-800 text-[11px] truncate block max-w-[100px]">
                          {mach.ownerName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedMachine(mach)}
                    className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Tractor className="h-4 w-4" /> Book Machine Rental
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* My Rentals Tab */
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-stone-100 font-bold text-xs text-stone-900">
            Active Machinery Bookings & Fleet Approvals
          </div>
          <div className="divide-y divide-stone-100">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-stone-900 text-sm">{booking.machineTitle}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-stone-500 mt-1">
                    Duration: <strong>{booking.rentalDurationDays} Day(s)</strong> starting {booking.startDate}
                  </p>
                  <p className="text-stone-400 text-[11px] mt-0.5">
                    Dispatch Destination: {booking.location}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">Rental Total</span>
                  <strong className="text-orange-700 text-sm font-black">₹{booking.totalAmount}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Tractor className="h-5 w-5 text-orange-600" />
                <h3 className="font-extrabold text-stone-900 text-sm">Rent Farm Machinery</h3>
              </div>
              <button
                onClick={() => setSelectedMachine(null)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-xs text-stone-900">{selectedMachine.title}</h4>
              <p className="text-[11px] text-stone-500">₹{selectedMachine.ratePerDay}/day • {selectedMachine.hp} HP</p>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    required
                    value={rentalDays}
                    onChange={(e) => setRentalDays(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Delivery / Farm Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-xs flex justify-between items-center">
                <span>Total Rental Fare:</span>
                <strong className="text-base font-black text-orange-950">
                  ₹{selectedMachine.ratePerDay * (Number(rentalDays) || 1)}
                </strong>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMachine(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm"
                >
                  {submitting ? 'Confirming...' : 'Approve & Confirm Rental'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
