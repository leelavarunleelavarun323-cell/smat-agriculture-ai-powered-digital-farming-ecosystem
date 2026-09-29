import React, { useState, useEffect } from 'react';
import { CropListing, CropOrder } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';
import {
  Layers,
  Search,
  Plus,
  Truck,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Phone
} from 'lucide-react';

interface CropMarketplaceViewProps {
  setActiveTab: (tab: string) => void;
}

export const CropMarketplaceView: React.FC<CropMarketplaceViewProps> = ({ setActiveTab }) => {
  const { user, role } = useAuth();
  const { showToast } = useNotifications();

  const [listings, setListings] = useState<CropListing[]>([]);
  const [orders, setOrders] = useState<CropOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [activeSubTab, setActiveSubTab] = useState<'LISTINGS' | 'ORDERS'>('LISTINGS');

  // Create Listing Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [cropName, setCropName] = useState('Tomato');
  const [variety, setVariety] = useState('Himsona Hybrid Red');
  const [grade, setGrade] = useState<'Grade A+' | 'Grade A' | 'Grade B' | 'Organic Certified'>('Grade A+');
  const [quantity, setQuantity] = useState('100');
  const [price, setPrice] = useState('2800');
  const [location, setLocation] = useState(user?.location || 'Ludhiana North Farm Gate');
  const [harvestDate, setHarvestDate] = useState('2026-10-15');

  // Purchase Order Modal (for Buyer)
  const [selectedListing, setSelectedListing] = useState<CropListing | null>(null);
  const [orderQuantity, setOrderQuantity] = useState('50');
  const [deliveryLocation, setDeliveryLocation] = useState('Chandigarh APMC Processing Unit 4');
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const fetchData = async () => {
    try {
      const [lRes, oRes] = await Promise.all([
        fetch('/api/marketplace/listings').then((r) => r.json()),
        fetch('/api/marketplace/orders').then((r) => r.json())
      ]);
      if (lRes.success) setListings(lRes.data);
      if (oRes.success) setOrders(oRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/marketplace/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName,
          variety,
          grade,
          quantityQuintals: Number(quantity),
          pricePerQuintal: Number(price),
          location,
          harvestDate,
          imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&auto=format&fit=crop'
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Harvest listed on marketplace! Buyers can now place orders.');
        setShowCreateModal(false);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;
    setSubmittingOrder(true);

    try {
      const res = await fetch('/api/marketplace/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: selectedListing.id,
          quantityQuintals: Number(orderQuantity),
          deliveryLocation,
          offeredPrice: selectedListing.pricePerQuintal
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Procurement order placed! Farmer revenue auto-credited in Ledger.');
        setSelectedListing(null);
        await fetchData();
        setActiveSubTab('ORDERS');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingOrder(false);
    }
  };

  const filtered = listings.filter((l) => {
    const matchSearch = l.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        l.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGrade = gradeFilter === 'ALL' || l.grade === gradeFilter;
    return matchSearch && matchGrade;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-stone-900 to-emerald-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 mb-2">
            <Layers className="h-3.5 w-3.5" /> Farmer-to-Buyer Direct Trade Exchange
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Crop Marketplace & Direct Procurement
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Eliminate traditional middleman commissions. Farmers list certified harvests directly for food processors, retail chains, and wholesale APMC aggregators.
          </p>
        </div>
      </div>

      {/* Nav Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('LISTINGS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'LISTINGS'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Available Harvest Batches ({listings.length})
          </button>
          <button
            onClick={() => setActiveSubTab('ORDERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'ORDERS'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Trade Contracts & Orders ({orders.length})
          </button>
        </div>

        <div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" /> Create Crop Listing
          </button>
        </div>
      </div>

      {activeSubTab === 'LISTINGS' ? (
        <div className="space-y-4">
          
          {/* Filters */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="h-4 w-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crop or farmer..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500">Quality Grade:</span>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-stone-300 bg-white"
              >
                <option value="ALL">All Grades</option>
                <option value="Grade A+">Grade A+</option>
                <option value="Organic Certified">Organic Certified</option>
                <option value="Grade A">Grade A</option>
              </select>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing) => (
              <div
                key={listing.id}
                className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-purple-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full rounded-2xl bg-stone-100 overflow-hidden mb-4">
                    <img src={listing.imageUrl} alt={listing.cropName} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-purple-900/90 text-white text-[10px] font-bold">
                      {listing.grade}
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Ready: {listing.harvestDate}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-base text-stone-900">{listing.cropName}</h3>
                      <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                        {listing.variety}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-stone-400" /> {listing.location}
                    </p>
                  </div>

                  <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Available Batch:</span>
                      <strong className="text-stone-900 font-bold">{listing.quantityQuintals} Quintals</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Expected Rate:</span>
                      <strong className="text-purple-900 font-black text-sm">₹{listing.pricePerQuintal} / Q</strong>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-stone-200 text-[11px] text-stone-500">
                      <span>Farmer: <strong>{listing.farmerName}</strong></span>
                      <span className="text-emerald-600 flex items-center gap-0.5">
                        <Phone className="h-3 w-3" /> {listing.farmerPhone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedListing(listing);
                      setOrderQuantity(String(listing.quantityQuintals));
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" /> Place Purchase Order
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* Orders & Trade Contracts Tab */
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-stone-100 font-bold text-xs text-stone-900">
            Active Farm-Gate Procurement Contracts
          </div>

          <div className="divide-y divide-stone-100">
            {orders.map((ord) => (
              <div key={ord.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-stone-900 text-sm">{ord.cropName}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                      {ord.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-stone-500 mt-1">
                    Buyer: <strong>{ord.buyerName}</strong> • {ord.quantityQuintals} Quintals @ ₹{ord.agreedPricePerQuintal}/Q
                  </p>
                  <p className="text-stone-400 text-[11px] mt-0.5">
                    Delivery Hub: {ord.deliveryLocation}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">Total Contract Value</span>
                    <strong className="text-emerald-700 text-base font-black">₹{ord.totalAmount.toLocaleString()}</strong>
                  </div>

                  <button
                    onClick={() => setActiveTab('transport')}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Truck className="h-3.5 w-3.5" /> Book Transport
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Crop Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="font-extrabold text-stone-900 text-base">Create Crop Harvest Listing</h3>
            <form onSubmit={handleCreateListing} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Crop Name</label>
                  <input
                    type="text"
                    required
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Variety</label>
                  <input
                    type="text"
                    required
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Quantity (Quintals)</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Price / Quintal (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Quality Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="Grade A+">Grade A+ (Premium Export)</option>
                  <option value="Organic Certified">Organic Certified (Zero Residue)</option>
                  <option value="Grade A">Grade A (Standard Wholesale)</option>
                  <option value="Grade B">Grade B (Processing Grade)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Farm Gate Pickup Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Publish Harvest Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buyer Purchase Order Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="font-extrabold text-stone-900 text-base">Direct Crop Procurement Contract</h3>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="font-bold text-stone-900">{selectedListing.cropName} ({selectedListing.variety})</div>
              <div className="text-stone-500 text-[11px]">
                Offered by {selectedListing.farmerName} • Rate: ₹{selectedListing.pricePerQuintal}/Quintal
              </div>
            </div>

            <form onSubmit={handleBuySubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Procurement Quantity (Quintals)</label>
                <input
                  type="number"
                  min="1"
                  max={selectedListing.quantityQuintals}
                  required
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Destination Processing / APMC Hub</label>
                <input
                  type="text"
                  required
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex justify-between items-center text-xs">
                <span>Contract Total:</span>
                <strong className="text-base font-black text-purple-950">
                  ₹{(Number(orderQuantity) * selectedListing.pricePerQuintal).toLocaleString()}
                </strong>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedListing(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-sm"
                >
                  {submittingOrder ? 'Submitting Contract...' : 'Confirm Procurement Contract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
