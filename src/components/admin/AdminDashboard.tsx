import React, { useState, useEffect } from 'react';
import { User, AuditLogItem } from '../../types/index.ts';
import { useNotifications } from '../../context/NotificationContext.tsx';
import {
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  DollarSign,
  Activity,
  Layers,
  ShoppingBag,
  Truck,
  HardHat,
  Tractor,
  Store,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useNotifications();

  const [metrics, setMetrics] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'ANALYTICS' | 'AUDIT'>('OVERVIEW');
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [mRes, uRes, aRes] = await Promise.all([
        fetch('/api/admin/metrics').then((r) => r.json()),
        fetch('/api/admin/users').then((r) => r.json()),
        fetch('/api/admin/audit-logs').then((r) => r.json())
      ]);
      if (mRes.success) setMetrics(mRes.data);
      if (uRes.success) setUsers(uRes.data);
      if (aRes.success) setAuditLogs(aRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`User status updated to ${nextStatus}`);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleKyc = async (userId: string, currentVerified: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentVerified })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`User KYC verification ${!currentVerified ? 'Approved' : 'Revoked'}`);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-indigo-950 to-stone-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-2">
            <Shield className="h-3.5 w-3.5" /> Root System Administration & Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ecosystem Command & Administration
          </h1>
          <p className="text-indigo-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Full platform observability: RBAC enforcement, KYC land record verification, transaction monitoring, automated security audit logs, and gross merchandise volume analytics.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'OVERVIEW'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Ecosystem Overview
        </button>
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'USERS'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          User & KYC Moderation ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ANALYTICS'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Platform Analytics & GMV
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'AUDIT'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Immutable Audit Logs ({auditLogs.length})
        </button>
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-stone-500 text-xs block mb-1">Total Ecosystem Users</span>
              <div className="text-2xl font-black text-stone-900">{metrics?.totalUsers || 7}</div>
              <span className="text-[11px] text-stone-500 mt-1 block">
                7 Core Roles Active
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-stone-500 text-xs block mb-1">Total Platform GMV</span>
              <div className="text-2xl font-black text-emerald-600">
                ₹{metrics?.totalGMV ? metrics.totalGMV.toLocaleString() : '1,77,060'}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                Direct farm trade & orders
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-stone-500 text-xs block mb-1">Crops Listed & Traded</span>
              <div className="text-2xl font-black text-purple-700">
                {metrics?.totalCropListings || 4} Listings
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">
                {metrics?.totalCropOrders || 1} Procurements Active
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-stone-500 text-xs block mb-1">Logistics & Services</span>
              <div className="text-2xl font-black text-blue-700">
                {(metrics?.totalTransportBookings || 1) + (metrics?.totalLabourBookings || 2) + (metrics?.totalMachineBookings || 1)}
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">
                Dispatches & Bookings
              </span>
            </div>
          </div>

          {/* Role Distribution Bar */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4">
            <h2 className="text-base font-extrabold text-stone-900">Ecosystem Stakeholder Distribution</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                <span className="text-emerald-800 font-bold block">Farmers</span>
                <span className="text-xl font-black text-emerald-950 mt-1 block">{metrics?.farmersCount || 1}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                <span className="text-amber-800 font-bold block">Workers</span>
                <span className="text-xl font-black text-amber-950 mt-1 block">{metrics?.workersCount || 1}</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-center">
                <span className="text-purple-800 font-bold block">Buyers</span>
                <span className="text-xl font-black text-purple-950 mt-1 block">{metrics?.buyersCount || 1}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                <span className="text-blue-800 font-bold block">Transport</span>
                <span className="text-xl font-black text-blue-950 mt-1 block">{metrics?.transportCount || 1}</span>
              </div>
              <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100 text-center">
                <span className="text-teal-800 font-bold block">Store Owners</span>
                <span className="text-xl font-black text-teal-950 mt-1 block">{metrics?.storeCount || 1}</span>
              </div>
              <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                <span className="text-orange-800 font-bold block">Fleet Owners</span>
                <span className="text-xl font-black text-orange-950 mt-1 block">{metrics?.machineCount || 1}</span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
                <span className="text-indigo-800 font-bold block">Admins</span>
                <span className="text-xl font-black text-indigo-950 mt-1 block">1</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'USERS' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-stone-900">Ecosystem User Accounts & KYC Governance</h2>
              <p className="text-xs text-stone-500">Verify government Aadhaar/Land title records or suspend compromised accounts</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user, email or role..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-bold border-y border-stone-100">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">KYC Status</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{u.name}</div>
                      <div className="text-[11px] text-stone-400">{u.email} • {u.phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800">
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600">{u.location}</td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {u.isVerified ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                        {u.isVerified ? 'Verified KYC' : 'Pending Verification'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleKyc(u.id, u.isVerified)}
                        className="px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 text-[11px] font-semibold"
                      >
                        {u.isVerified ? 'Revoke KYC' : 'Verify KYC'}
                      </button>

                      <button
                        onClick={() => handleToggleUserStatus(u.id, u.status)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white ${
                          u.status === 'ACTIVE' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-2xs space-y-4">
              <h2 className="text-sm font-extrabold text-stone-900">Regional Procurement Volume by Commodity</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-stone-700 mb-1">
                    <span>Tomato (Himsona Hybrid)</span>
                    <span>150 Quintals (₹4,20,000)</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                    <div className="w-[85%] bg-emerald-600 h-full rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-stone-700 mb-1">
                    <span>Wheat (Sharbati Gold)</span>
                    <span>400 Quintals (₹9,80,000)</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                    <div className="w-[70%] bg-amber-500 h-full rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-stone-700 mb-1">
                    <span>Basmati Rice (1121 Export)</span>
                    <span>250 Quintals (₹10,87,500)</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                    <div className="w-[60%] bg-purple-600 h-full rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-2xs space-y-4">
              <h2 className="text-sm font-extrabold text-stone-900">Platform Resource Utilization</h2>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Tractor & Drone Utilization</span>
                  <span className="text-xl font-black text-orange-700 mt-1 block">78%</span>
                  <span className="text-[10px] text-stone-500 mt-1 block">Peak Kharif season demand</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Freight Fleet Reliability</span>
                  <span className="text-xl font-black text-blue-700 mt-1 block">99.2%</span>
                  <span className="text-[10px] text-stone-500 mt-1 block">On-time farm-gate pickups</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-stone-900">Security & Operational Audit Trail</h2>
              <p className="text-xs text-stone-500">Immutable ledger of sensitive actions, authorization tokens, and IP traces</p>
            </div>
            <FileText className="h-5 w-5 text-indigo-600" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-bold border-y border-stone-100">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">User & Persona</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Module</th>
                  <th className="py-2.5 px-3">Audit Details</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3 text-stone-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 text-stone-800 font-bold font-sans">{log.userName}</td>
                    <td className="py-2.5 px-3 text-indigo-700 font-bold">{log.action}</td>
                    <td className="py-2.5 px-3 text-stone-500">{log.module}</td>
                    <td className="py-2.5 px-3 text-stone-600 font-sans max-w-xs truncate">{log.details}</td>
                    <td className="py-2.5 px-3 text-stone-400">{log.ipAddress}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
