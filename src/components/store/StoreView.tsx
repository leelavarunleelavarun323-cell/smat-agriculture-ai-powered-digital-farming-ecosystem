import React, { useState, useEffect } from 'react';
import { StoreProduct, StoreOrder, CartItem } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';
import {
  Store,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  X,
  Package
} from 'lucide-react';

export const StoreView: React.FC = () => {
  const { role, user } = useAuth();
  const { showToast } = useNotifications();

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.location || 'Patel Bio-Farms, Ludhiana North, Punjab');
  const [paymentMethod, setPaymentMethod] = useState('UPI / RuPay Kisan Credit Card');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [activeTab, setActiveTab] = useState<'SHOP' | 'ORDERS'>('SHOP');

  // Add Product Modal (for Store Owner)
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'Seeds' | 'Fertilizers' | 'Pesticides' | 'Organic Products' | 'Agricultural Tools'>('Seeds');
  const [newProdPrice, setNewProdPrice] = useState('850');
  const [newProdStock, setNewProdStock] = useState('50');

  const fetchData = async () => {
    try {
      const [pRes, oRes] = await Promise.all([
        fetch('/api/store/products').then((r) => r.json()),
        fetch('/api/store/orders').then((r) => r.json())
      ]);
      if (pRes.success) setProducts(pRes.data);
      if (oRes.success) setOrders(oRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addToCart = (product: StoreProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart.length) return;
    setSubmittingOrder(true);

    try {
      const res = await fetch('/api/store/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((c) => ({
            productId: c.product.id,
            quantity: c.quantity
          })),
          deliveryAddress,
          paymentMethod
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Store order placed! Expense auto-logged in Financial Ledger.');
        setCart([]);
        setShowCheckoutModal(false);
        setShowCartDrawer(false);
        await fetchData();
        setActiveTab('ORDERS');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/store/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName,
          category: newProdCategory,
          price: Number(newProdPrice),
          mrp: Math.round(Number(newProdPrice) * 1.15),
          stockQuantity: Number(newProdStock),
          unit: 'Pack / Bottle'
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('New product added to store catalog');
        setShowAddProductModal(false);
        setNewProdName('');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-950 via-stone-900 to-emerald-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 mb-2">
            <Store className="h-3.5 w-3.5" /> Certified Agricultural Inputs & Bio-Tech Store
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Seeds & Fertilizer Marketplace
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Order certified high-yield hybrid seeds, nano urea fertilizers, organic bio-repellents, and precision micro-irrigation kits with guaranteed farm-gate delivery.
          </p>
        </div>
      </div>

      {/* Nav & Cart Trigger Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('SHOP')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'SHOP'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Input Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ORDERS'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            My Orders ({orders.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {(role === 'STORE_OWNER' || role === 'ADMIN') && (
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Inventory Item
            </button>
          )}

          <button
            onClick={() => setShowCartDrawer(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Cart ({cart.reduce((s, c) => s + c.quantity, 0)})</span>
            {cartTotal > 0 && <span className="text-teal-200">• ₹{cartTotal}</span>}
          </button>
        </div>
      </div>

      {activeTab === 'SHOP' ? (
        <div className="space-y-4">
          
          {/* Search & Categories */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search seed varieties, fertilizers, bio-pesticides..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-stone-500 text-[11px] mr-1">Categories:</span>
              {['ALL', 'Seeds', 'Fertilizers', 'Organic Products', 'Agricultural Tools'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-teal-700 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat === 'ALL' ? 'All Products' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((prod) => (
              <div
                key={prod.id}
                className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-teal-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full rounded-2xl bg-stone-100 overflow-hidden mb-4">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                      {prod.category}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-teal-700 uppercase">{prod.brand}</span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {prod.rating}
                      </div>
                    </div>

                    <h3 className="font-extrabold text-sm text-stone-900 leading-snug">{prod.name}</h3>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{prod.description}</p>
                  </div>

                  {/* Certifications */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {prod.certifications.map((cert, cIdx) => (
                      <span key={cIdx} className="px-2 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {cert}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-black text-stone-900">₹{prod.price}</span>
                        {prod.mrp > prod.price && (
                          <span className="text-stone-400 text-xs line-through">₹{prod.mrp}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-500">Unit: {prod.unit}</span>
                    </div>

                    <span className="text-[10px] font-semibold text-stone-600 bg-white px-2 py-1 rounded-md border border-stone-200">
                      {prod.stockQuantity > 0 ? `${prod.stockQuantity} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => addToCart(prod)}
                    disabled={prod.stockQuantity === 0}
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Add to Farm Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* Orders Tab */
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-stone-100 font-bold text-xs text-stone-900">
            Order Fulfillment & Delivery Status
          </div>
          <div className="divide-y divide-stone-100">
            {orders.map((order) => (
              <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-stone-900 text-sm">Order #{order.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-stone-500 mt-1">
                    Items: {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                  </p>
                  <p className="text-stone-400 text-[11px] mt-0.5">
                    Delivery Address: {order.deliveryAddress} • {order.paymentMethod}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">Total Amount Paid</span>
                  <strong className="text-stone-900 text-base font-black">₹{order.totalAmount}</strong>
                  <span className="text-[10px] text-emerald-600 block flex items-center justify-end gap-1 mt-0.5">
                    <CheckCircle2 className="h-3 w-3" /> Auto-Logged to Expense Ledger
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-teal-600" />
                  <h3 className="font-extrabold text-stone-900 text-base">Agricultural Inputs Cart</h3>
                </div>
                <button
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="p-12 text-center text-xs text-stone-400 space-y-2">
                  <ShoppingCart className="h-8 w-8 mx-auto text-stone-300" />
                  <p>Your agricultural shopping cart is currently empty.</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 max-h-[60vh] overflow-y-auto mt-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-3 flex items-center justify-between text-xs gap-3">
                      <div>
                        <div className="font-bold text-stone-900">{item.product.name}</div>
                        <div className="text-[11px] text-stone-500">₹{item.product.price} / {item.product.unit}</div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-1 rounded bg-stone-100 hover:bg-stone-200"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-bold text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-1 rounded bg-stone-100 hover:bg-stone-200"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-stone-200 pt-4 space-y-3">
                <div className="flex justify-between items-center text-sm font-black text-stone-900">
                  <span>Cart Total:</span>
                  <span className="text-teal-700 text-lg">₹{cartTotal}</span>
                </div>
                <button
                  onClick={() => {
                    setShowCartDrawer(false);
                    setShowCheckoutModal(true);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Proceed to Farm Delivery Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-stone-900 text-sm">Farm Gate Delivery Checkout</h3>
              <button onClick={() => setShowCheckoutModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Farm Delivery Address</label>
                <textarea
                  rows={2}
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="UPI / RuPay Kisan Credit Card">UPI / RuPay Kisan Credit Card</option>
                  <option value="Direct Agri Bank Transfer (RTGS/NEFT)">Direct Agri Bank Transfer (RTGS/NEFT)</option>
                  <option value="Cash on Farm Delivery">Cash on Farm Delivery</option>
                </select>
              </div>

              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex justify-between items-center">
                <span>Grand Total:</span>
                <strong className="text-base font-black text-teal-950">₹{cartTotal}</strong>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm"
                >
                  {submittingOrder ? 'Placing Order...' : 'Confirm & Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal (For Store Owners) */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="font-extrabold text-stone-900 text-sm">Add New Product to Store Catalog</h3>
            <form onSubmit={handleAddProductSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Mahabeej Certified Soybean Seeds"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Pesticides">Pesticides</option>
                    <option value="Organic Products">Organic Products</option>
                    <option value="Agricultural Tools">Agricultural Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
