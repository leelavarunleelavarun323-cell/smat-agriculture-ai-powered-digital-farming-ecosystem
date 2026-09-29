import React, { useState, useEffect } from 'react';
import { FinancialTransaction, FinancialSummary } from '../../types/index.ts';
import { useNotifications } from '../../context/NotificationContext.tsx';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  DollarSign,
  PieChart,
  BarChart3,
  FileText,
  Filter
} from 'lucide-react';

export const FinancialDashboard: React.FC = () => {
  const { showToast } = useNotifications();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Transaction Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [txType, setTxType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [category, setCategory] = useState<string>('Fertilizer');
  const [amount, setAmount] = useState('2500');
  const [description, setDescription] = useState('');
  const [relatedCrop, setRelatedCrop] = useState('Tomato');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Bank Transfer' | 'UPI / Digital'>('UPI / Digital');
  const [submitting, setSubmitting] = useState(false);

  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  const fetchData = async () => {
    try {
      const [sRes, tRes] = await Promise.all([
        fetch('/api/finance/summary').then((r) => r.json()),
        fetch('/api/finance/transactions').then((r) => r.json())
      ]);
      if (sRes.success) setSummary(sRes.data);
      if (tRes.success) setTransactions(tRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/finance/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: txType,
          category,
          amount: Number(amount),
          description,
          relatedCrop,
          paymentMode
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Transaction logged in Financial Ledger');
        setShowAddModal(false);
        setDescription('');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTx = filterType === 'ALL'
    ? transactions
    : transactions.filter((t) => t.type === filterType);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
            <Wallet className="h-3.5 w-3.5" /> Farm Accounting & Profit/Loss Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Farm Financial Intelligence
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Real-time income vs expense reconciliation. Automated linkage with seed purchases, machinery rentals, labour bookings, and crop sales.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-stone-500 text-xs block mb-1">Total Crop Income</span>
          <div className="text-2xl font-black text-emerald-600">
            ₹{summary ? summary.totalIncome.toLocaleString() : '2,03,000'}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" /> Harvest sales & PM subsidies
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-stone-500 text-xs block mb-1">Operating Expenses</span>
          <div className="text-2xl font-black text-rose-600">
            ₹{summary ? summary.totalExpense.toLocaleString() : '24,406'}
          </div>
          <span className="text-[11px] text-rose-700 font-semibold mt-1 flex items-center gap-1">
            <ArrowDownRight className="h-3 w-3" /> Labour, Seeds & Equipment
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-stone-500 text-xs block mb-1">Net Seasonal Profit</span>
          <div className="text-2xl font-black text-stone-900">
            ₹{summary ? summary.netProfit.toLocaleString() : '1,78,594'}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Net Margin: <strong>{summary?.profitMarginPercent || 88}%</strong>
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-stone-500 text-xs block mb-1">Ledger Balance</span>
            <div className="text-xs font-bold text-stone-800">Direct RuPay Bank Link</div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Log Income / Expense
          </button>
        </div>
      </div>

      {/* Monthly Trends & Crop Profit Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Trend (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-stone-900">Monthly Profitability Trend</h2>
              <p className="text-xs text-stone-500">Income vs Operating Expenses (Kharif Season)</p>
            </div>
            <BarChart3 className="h-4 w-4 text-emerald-600" />
          </div>

          <div className="h-48 flex items-end justify-around gap-4 pt-6 pb-2 px-2 bg-stone-50 rounded-2xl border border-stone-100">
            {summary?.monthlyTrend.map((m, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group flex-1">
                <div className="text-[10px] font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  +₹{(m.profit / 1000).toFixed(0)}k
                </div>
                <div className="w-full flex items-end justify-center gap-1.5 h-32">
                  <div
                    style={{ height: `${Math.min(100, (m.income / 210000) * 100)}%` }}
                    className="w-4 bg-emerald-500 rounded-t-md"
                    title={`Income: ₹${m.income}`}
                  />
                  <div
                    style={{ height: `${Math.min(100, (m.expense / 210000) * 100)}%` }}
                    className="w-4 bg-rose-400 rounded-t-md"
                    title={`Expense: ₹${m.expense}`}
                  />
                </div>
                <span className="text-xs font-bold text-stone-700">{m.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-stone-500 pt-2">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Expense
            </span>
          </div>
        </div>

        {/* Crop-wise Profitability Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-stone-900">Crop-Wise Profit Margin</h2>
              <p className="text-xs text-stone-500">Net realization after input costs</p>
            </div>
            <PieChart className="h-4 w-4 text-emerald-600" />
          </div>

          <div className="space-y-3">
            {summary?.cropBreakdown.map((crop, cIdx) => (
              <div key={cIdx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <span>{crop.cropName}</span>
                  <span className="text-emerald-700">+₹{crop.net.toLocaleString()}</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (crop.net / crop.revenue) * 100)}%` }}
                    className="h-full bg-emerald-600 rounded-full"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>Gross: ₹{crop.revenue.toLocaleString()}</span>
                  <span>Cost: ₹{crop.cost.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs space-y-3 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">Financial Ledger Entries</h2>
            <p className="text-xs text-stone-500">Audited cash inflows and outflows</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filterType === 'ALL' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('INCOME')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filterType === 'INCOME' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-700'
              }`}
            >
              Incomes
            </button>
            <button
              onClick={() => setFilterType('EXPENSE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filterType === 'EXPENSE' ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-700'
              }`}
            >
              Expenses
            </button>
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {filteredTx.map((tx) => {
            const isInc = tx.type === 'INCOME';
            return (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isInc ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {isInc ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  </div>

                  <div>
                    <div className="font-bold text-stone-900">{tx.description}</div>
                    <div className="text-[11px] text-stone-400">
                      {tx.category} • {tx.date} • Mode: {tx.paymentMode} {tx.relatedCrop ? `• ${tx.relatedCrop}` : ''}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <strong className={`text-sm font-black ${isInc ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {isInc ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="font-extrabold text-stone-900 text-base">Record Financial Transaction</h3>
            <form onSubmit={handleAddTxSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Transaction Type</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="EXPENSE">Expense (Outflow)</option>
                    <option value="INCOME">Income (Inflow)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    {txType === 'INCOME' ? (
                      <>
                        <option value="Crop Sale">Crop Sale</option>
                        <option value="Government Subsidy">Government Subsidy</option>
                        <option value="Other">Other Revenue</option>
                      </>
                    ) : (
                      <>
                        <option value="Seeds">Seeds</option>
                        <option value="Fertilizer">Fertilizer</option>
                        <option value="Labour Wage">Labour Wage</option>
                        <option value="Machinery Rent">Machinery Rent</option>
                        <option value="Transport">Transport</option>
                        <option value="Electricity / Irrigation">Electricity / Irrigation</option>
                        <option value="Pesticides">Pesticides</option>
                        <option value="Other">Other Expense</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description / Notes</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Purchased 4 bags of urea from local mandi"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Related Crop</label>
                  <input
                    type="text"
                    value={relatedCrop}
                    onChange={(e) => setRelatedCrop(e.target.value)}
                    placeholder="e.g. Tomato / Wheat"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="UPI / Digital">UPI / Digital</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm"
                >
                  {submitting ? 'Saving...' : 'Record Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
