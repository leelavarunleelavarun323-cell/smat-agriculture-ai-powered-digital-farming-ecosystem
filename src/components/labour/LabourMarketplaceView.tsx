import React, { useState, useEffect } from 'react';
import { LabourWorker, LabourBooking } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';
import {
  HardHat,
  Search,
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Briefcase,
  DollarSign,
  Filter,
  Check,
  Award
} from 'lucide-react';

export const LabourMarketplaceView: React.FC = () => {
  const { role, user } = useAuth();
  const { showToast } = useNotifications();

  const [workers, setWorkers] = useState<LabourWorker[]>([]);
  const [bookings, setBookings] = useState<LabourBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [selectedWorker, setSelectedWorker] = useState<LabourWorker | null>(null);
  const [jobRole, setJobRole] = useState('Tomato Trellising & Staking');
  const [daysCount, setDaysCount] = useState('2');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Tab switch between Find Workers and My Bookings
  const [activeSubTab, setActiveSubTab] = useState<'WORKERS' | 'BOOKINGS'>('WORKERS');

  const fetchData = async () => {
    try {
      const [wRes, bRes] = await Promise.all([
        fetch('/api/labour/workers').then((r) => r.json()),
        fetch('/api/labour/bookings').then((r) => r.json())
      ]);
      if (wRes.success) setWorkers(wRes.data);
      if (bRes.success) setBookings(bRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/labour/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerId: selectedWorker.id,
          jobRole,
          daysCount: Number(daysCount),
          startDate,
          specialInstructions
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Worker ${selectedWorker.name} booked! Expense recorded in Finance.`);
        setSelectedWorker(null);
        await fetchData();
        setActiveSubTab('BOOKINGS');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await fetch(`/api/labour/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Job status updated to ${status}`);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredWorkers = workers.filter((w) => {
    const matchSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        w.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSkill = selectedSkill === 'ALL' || w.skills.some((s) => s.toLowerCase().includes(selectedSkill.toLowerCase()));
    return matchSearch && matchSkill;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
            <HardHat className="h-3.5 w-3.5" /> Agricultural Labour Marketplace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Agricultural Labour & Skill Platform
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Connect with verified agricultural workers, harvesting crews, tractor operators, and precision pruning specialists. Instant booking with transparent wage rates.
          </p>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveSubTab('WORKERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'WORKERS'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Browse Available Workers ({workers.length})
        </button>
        <button
          onClick={() => setActiveSubTab('BOOKINGS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'BOOKINGS'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          My Labour Bookings ({bookings.length})
        </button>
      </div>

      {activeSubTab === 'WORKERS' ? (
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="h-4 w-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search worker by name or location..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-stone-400" />
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="ALL">All Specializations</option>
                <option value="Harvesting">Combine & Manual Harvesting</option>
                <option value="Pruning">Precision Pruning & Trellising</option>
                <option value="Sowing">Organic Sowing & Transplanting</option>
                <option value="Tractor">Tractor Operator / Tilling</option>
                <option value="Spraying">Pesticide / Drip Maintenance</option>
              </select>
            </div>
          </div>

          {/* Workers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <img
                      src={worker.avatarUrl}
                      alt={worker.name}
                      className="h-14 w-14 rounded-2xl object-cover border border-stone-200 shadow-2xs"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-stone-900">{worker.name}</h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-stone-400" /> {worker.location}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {worker.rating} ({worker.reviewCount})
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {worker.completedJobsCount} jobs completed
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills Pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {worker.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-stone-100 text-stone-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-stone-500 text-[10px] block">Daily Wage</span>
                      <strong className="text-stone-900 text-sm font-black">₹{worker.dailyWage}</strong>
                      <span className="text-[10px] text-stone-400">/ 8-hour shift</span>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] block">Experience</span>
                      <strong className="text-stone-800">{worker.experienceYears} Years</strong>
                    </div>
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {worker.availability}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => setSelectedWorker(worker)}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <HardHat className="h-3.5 w-3.5" /> Book Worker
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* My Bookings Tab */
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-stone-100 font-bold text-xs text-stone-900">
              Active & Completed Labour Work Orders
            </div>

            <div className="divide-y divide-stone-100">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-stone-900 text-sm">{booking.jobRole}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        booking.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-stone-500 mt-1">
                      Worker: <strong>{booking.workerName}</strong> • {booking.daysCount} Days (Starting {booking.startDate})
                    </p>
                    <p className="text-stone-400 text-[11px] mt-0.5">
                      Location: {booking.farmLocation}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block">Total Wage</span>
                      <strong className="text-stone-900 text-sm font-black">₹{booking.totalCost}</strong>
                    </div>

                    {booking.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(booking.id, 'COMPLETED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Book Worker Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <HardHat className="h-5 w-5 text-amber-600" />
                <h3 className="font-extrabold text-stone-900 text-sm">Book Agricultural Worker</h3>
              </div>
              <button
                onClick={() => setSelectedWorker(null)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
              <img src={selectedWorker.avatarUrl} alt="" className="h-10 w-10 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-xs text-stone-900">{selectedWorker.name}</h4>
                <p className="text-[11px] text-stone-500">₹{selectedWorker.dailyWage} / day • {selectedWorker.location}</p>
              </div>
            </div>

            <form onSubmit={handleBookWorker} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Task / Job Description</label>
                <input
                  type="text"
                  required
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Tomato Staking / Paddy Weeding"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={daysCount}
                    onChange={(e) => setDaysCount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Special Instructions</label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Bring own pruning shears; report at 7:30 AM."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs flex justify-between items-center">
                <span>Calculated Total Wage:</span>
                <strong className="text-base font-black text-amber-950">
                  ₹{selectedWorker.dailyWage * (Number(daysCount) || 1)}
                </strong>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedWorker(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
                >
                  {submitting ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
