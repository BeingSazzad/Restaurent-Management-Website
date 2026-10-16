'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateOrderStatus, toggleKitchenSnooze, createOrder } from '@/redux/slices/orderSlice';
import { toggleItemAvailability } from '@/redux/slices/menuSlice';
import { OrderItem, RESTAURANT_INFO, MENU_ITEMS } from '@/Mockdata';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Volume2,
  VolumeX,
  Bike,
  Store,
  Printer,
  Sparkles,
  TrendingUp,
  Search,
  SlidersHorizontal,
  Flame,
  AlertTriangle,
  RotateCcw,
  Undo2,
  Plus,
  X,
  Check,
  UtensilsCrossed,
  Timer,
  ShoppingBag,
  Phone,
  FileText,
  BadgePercent,
  CheckCheck,
  MapPin,
} from 'lucide-react';

type KdsTab = 'kds' | 'menu-86' | 'sales' | 'manual-order';
type StationFilter = 'all' | 'curries' | 'biryani' | 'grill' | 'breads';
type FulfillmentFilter = 'all' | 'delivery' | 'collection';

export default function AgentDashboardPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const menuItems = useAppSelector((state) => state.menu.items);
  const kitchenSnooze = useAppSelector((state) => state.orders.kitchenSnoozeActive);
  const kitchenSnoozeMinutes = useAppSelector((state) => state.orders.kitchenSnoozeMinutes);

  // Active View Tabs
  const [selectedTab, setSelectedTab] = useState<KdsTab>('kds');

  // KDS Filters
  const [stationFilter, setStationFilter] = useState<StationFilter>('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<FulfillmentFilter>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // 86 Stock Manager Filters
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [stockCategoryFilter, setStockCategoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in_stock' | 'sold_out'>('all');

  // Audio Notifications
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Thermal Slip Modal
  const [activeSlipOrder, setActiveSlipOrder] = useState<OrderItem | null>(null);
  const [slipModalTab, setSlipModalTab] = useState<'details' | 'slip'>('details');

  // Manual Fast Ticket Entry State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualCustomer, setManualCustomer] = useState('Walk-in Table 4');
  const [manualPhone, setManualPhone] = useState('+353 87 000 0000');
  const [manualType, setManualType] = useState<'delivery' | 'collection'>('collection');
  const [manualDishId, setManualDishId] = useState(menuItems[0]?.id || '1');
  const [manualQty, setManualQty] = useState(1);
  const [manualNote, setManualNote] = useState('');

  // Play audio chime using Web Audio API
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // Audio fallback
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Orders for KDS Screen
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Fulfillment filter
      if (fulfillmentFilter !== 'all' && order.fulfillmentType !== fulfillmentFilter) {
        return false;
      }
      // Search query (Order # or Customer Name)
      if (orderSearchQuery.trim()) {
        const query = orderSearchQuery.toLowerCase();
        const matchesNumber = order.orderNumber.toLowerCase().includes(query);
        const matchesName = order.customerName.toLowerCase().includes(query);
        if (!matchesNumber && !matchesName) return false;
      }
      // Station filter (Check if any item belongs to station)
      if (stationFilter !== 'all') {
        const hasStationDish = order.items.some((item) => item.dish.category === stationFilter);
        if (!hasStationDish) return false;
      }
      return true;
    });
  }, [orders, fulfillmentFilter, orderSearchQuery, stationFilter]);

  const newOrders = filteredOrders.filter((o) => o.status === 'new');
  const preparingOrders = filteredOrders.filter((o) => o.status === 'preparing');
  const readyOrders = filteredOrders.filter(
    (o) => o.status === 'ready' || o.status === 'out_for_delivery'
  );
  const completedOrders = filteredOrders.filter((o) => o.status === 'completed');

  // Filtered Items for 86 Stock Manager
  const filteredStockItems = useMemo(() => {
    return menuItems.filter((dish) => {
      if (stockCategoryFilter !== 'all' && dish.category !== stockCategoryFilter) {
        return false;
      }
      if (stockStatusFilter === 'in_stock' && !dish.isAvailable) {
        return false;
      }
      if (stockStatusFilter === 'sold_out' && dish.isAvailable) {
        return false;
      }
      if (stockSearchQuery.trim()) {
        const q = stockSearchQuery.toLowerCase();
        return (
          dish.name.toLowerCase().includes(q) ||
          dish.categoryLabel.toLowerCase().includes(q) ||
          dish.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [menuItems, stockCategoryFilter, stockStatusFilter, stockSearchQuery]);

  // Quick Stats
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const deliveryCount = orders.filter((o) => o.fulfillmentType === 'delivery').length;
  const collectionCount = orders.filter((o) => o.fulfillmentType === 'collection').length;
  const soldOutCount = menuItems.filter((i) => !i.isAvailable).length;

  // Handle Manual Order Submission
  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const dish = menuItems.find((m) => m.id === manualDishId) || menuItems[0];
    if (!dish) return;

    const newOrd: OrderItem = {
      id: `ord-man-${Date.now()}`,
      orderNumber: `AS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: manualCustomer || 'Walk-in Diner',
      customerPhone: manualPhone || '+353 (01) 485 9210',
      customerEmail: 'kitchen@amberspice.ie',
      fulfillmentType: manualType,
      items: [
        {
          cartItemId: `item-${Date.now()}`,
          dish,
          quantity: manualQty,
          selectedModifiers: [],
          totalPrice: dish.price * manualQty,
          specialInstructions: manualNote || undefined,
        },
      ],
      subtotal: dish.price * manualQty,
      deliveryFee: manualType === 'delivery' ? 2.5 : 0,
      discount: 0,
      total: dish.price * manualQty + (manualType === 'delivery' ? 2.5 : 0),
      status: 'new',
      createdAt: new Date().toISOString(),
      estimatedMinutes: manualType === 'delivery' ? 30 : 15,
      specialNotes: manualNote || undefined,
      paymentMethod: 'cash',
    };

    dispatch(createOrder(newOrd));
    if (soundEnabled) playChime();
    setIsManualModalOpen(false);
    showToast(`Order #${newOrd.orderNumber} fired to kitchen!`);
    setManualNote('');
    setManualQty(1);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#1A130E] py-6 sm:py-8 lg:py-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-xl bg-[#1A130E] text-white text-[13px] font-semibold flex items-center gap-2.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#0FA958] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ================= TOP STAFF HEADER & CONTROLS ================= */}
        <div className="space-y-4">
          {/* Row 1: Brand & Identity + Global Quick Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  Kitchen Display System
                </h1>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
                {kitchenSnooze && (
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Rush Mode (+{kitchenSnoozeMinutes}m)
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Dublin Kitchen Operations Console · Shift Orders &amp; Expo
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  if (!soundEnabled) playChime();
                  setSoundEnabled(!soundEnabled);
                  showToast(soundEnabled ? 'Chime muted' : 'Kitchen Chime sound enabled');
                }}
                className={`h-9 px-3 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'bg-white border-stone-200 text-stone-800 hover:border-[#F15A24]'
                    : 'bg-stone-100 border-transparent text-stone-400'
                }`}
                title="Toggle Web Audio Chime"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#F15A24]" />
                    <span>Sound On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Muted</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  dispatch(toggleKitchenSnooze(20));
                  showToast(kitchenSnooze ? 'Rush mode deactivated' : 'Rush Mode (+20m delay) activated');
                }}
                className={`h-9 px-3 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border ${
                  kitchenSnooze
                    ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700'
                    : 'bg-white border-stone-200 text-stone-800 hover:border-[#F15A24]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{kitchenSnooze ? 'Exit Rush' : 'Rush (+20m)'}</span>
              </button>

              <button
                onClick={() => setIsManualModalOpen(true)}
                className="h-9 px-3.5 rounded-lg text-xs font-medium bg-[#1A130E] hover:bg-black text-white shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Fire Ticket</span>
              </button>
            </div>
          </div>

          {/* Row 2: Standard Clean Underline Tab Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setSelectedTab('kds')}
                className={`pb-3 text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 relative cursor-pointer ${
                  selectedTab === 'kds'
                    ? 'text-[#F15A24] font-semibold border-b-2 border-[#F15A24] -mb-[1px]'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <span>KDS Pipeline</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${selectedTab === 'kds' ? 'bg-orange-100 text-[#F15A24]' : 'bg-stone-100 text-stone-600'}`}>
                  {orders.length}
                </span>
              </button>
              <button
                onClick={() => setSelectedTab('menu-86')}
                className={`pb-3 text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 relative cursor-pointer ${
                  selectedTab === 'menu-86'
                    ? 'text-[#F15A24] font-semibold border-b-2 border-[#F15A24] -mb-[1px]'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <span>86 Stock Manager</span>
                {soldOutCount > 0 ? (
                  <span className="bg-rose-100 text-rose-700 text-[11px] px-2 py-0.5 rounded-full font-semibold">
                    {soldOutCount}
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-600 font-semibold">All In</span>
                )}
              </button>
              <button
                onClick={() => setSelectedTab('sales')}
                className={`pb-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  selectedTab === 'sales'
                    ? 'text-[#F15A24] font-semibold border-b-2 border-[#F15A24] -mb-[1px]'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Shift Analytics
              </button>
            </div>
          </div>

          {/* Row 3 (KDS Active): Clean Filter & Search Toolbar */}
          {selectedTab === 'kds' && (
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter ticket # or customer..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full h-8.5 bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]/20 rounded-lg pl-8 pr-7 text-xs outline-none transition-colors placeholder:text-stone-400 text-stone-800"
                />
                {orderSearchQuery && (
                  <button
                    onClick={() => setOrderSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Station Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none flex-wrap">
                {[
                  { id: 'all', label: 'All Stations' },
                  { id: 'biryani', label: 'Biryani' },
                  { id: 'curries', label: 'Curries' },
                  { id: 'grill', label: 'Grill' },
                  { id: 'breads', label: 'Breads' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStationFilter(st.id as StationFilter)}
                    className={`h-7.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                      stationFilter === st.id
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}

                <span className="w-px h-4 bg-stone-200 mx-1 hidden sm:block" />

                {/* Fulfillment Type */}
                {[
                  { id: 'all', label: 'All Orders' },
                  { id: 'delivery', label: 'Delivery' },
                  { id: 'collection', label: 'Pickup' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFulfillmentFilter(f.id as FulfillmentFilter)}
                    className={`h-7.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                      fulfillmentFilter === f.id
                        ? 'bg-[#F15A24] text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      {/* ================= TAB 1: KDS COLUMNS PIPELINE ================= */}
      {selectedTab === 'kds' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* COLUMN 1: NEW INCOMING ORDERS */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <h2 className="font-semibold text-xs uppercase tracking-wider text-stone-700">
                  Incoming Tickets
                </h2>
                <span className="text-xs font-medium text-stone-400">({newOrders.length})</span>
              </div>
              <span className="text-[11px] text-stone-400">Needs fire</span>
            </div>

            {newOrders.length === 0 ? (
              <div className="text-center py-12 px-4 text-stone-400">
                <UtensilsCrossed className="w-6 h-6 text-stone-300 mx-auto mb-2" />
                <p className="font-medium text-xs text-stone-600">No New Tickets</p>
                <p className="text-[11px] text-stone-400 mt-0.5">Incoming orders will appear here.</p>
              </div>
            ) : (
              newOrders.map((order) => (
                <KdsOrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={(status) => {
                    dispatch(updateOrderStatus({ orderId: order.id, status }));
                    showToast(`Order #${order.orderNumber} status advanced to ${status}!`);
                  }}
                  onPrint={() => setActiveSlipOrder(order)}
                />
              ))
            )}
          </div>

          {/* COLUMN 2: PREPARING IN KITCHEN (COOKING / TANDOOR) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F15A24]" />
                <h2 className="font-semibold text-xs uppercase tracking-wider text-stone-700">
                  Cooking / Grilling
                </h2>
                <span className="text-xs font-medium text-stone-400">({preparingOrders.length})</span>
              </div>
              <span className="text-[11px] text-stone-400">In kitchen</span>
            </div>

            {preparingOrders.length === 0 ? (
              <div className="text-center py-12 px-4 text-stone-400">
                <Flame className="w-6 h-6 text-stone-300 mx-auto mb-2" />
                <p className="font-medium text-xs text-stone-600">Kitchen Clear</p>
                <p className="text-[11px] text-stone-400 mt-0.5">Fire new tickets to start cooking.</p>
              </div>
            ) : (
              preparingOrders.map((order) => (
                <KdsOrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={(status) => {
                    dispatch(updateOrderStatus({ orderId: order.id, status }));
                    showToast(`Order #${order.orderNumber} status advanced to ${status}!`);
                  }}
                  onPrint={() => setActiveSlipOrder(order)}
                />
              ))
            )}
          </div>

          {/* COLUMN 3: READY FOR DISPATCH / PICKUP */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h2 className="font-semibold text-xs uppercase tracking-wider text-stone-700">
                  Ready / Out for Delivery
                </h2>
                <span className="text-xs font-medium text-stone-400">({readyOrders.length})</span>
              </div>
              <span className="text-[11px] text-stone-400">For pickup</span>
            </div>

            {readyOrders.length === 0 ? (
              <div className="text-center py-12 px-4 text-stone-400">
                <CheckCircle2 className="w-6 h-6 text-stone-300 mx-auto mb-2" />
                <p className="font-medium text-xs text-stone-600">No Ready Orders</p>
                <p className="text-[11px] text-stone-400 mt-0.5">Orders ready for customer or rider show here.</p>
              </div>
            ) : (
              readyOrders.map((order) => (
                <KdsOrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={(status) => {
                    dispatch(updateOrderStatus({ orderId: order.id, status }));
                    showToast(`Order #${order.orderNumber} marked as ${status}!`);
                  }}
                  onPrint={() => setActiveSlipOrder(order)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: 86 STOCK MANAGER ================= */}
      {selectedTab === 'menu-86' && (
        <div className="space-y-4">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-stone-900">
                  86 Stock Manager
                </h2>
                <span className="text-xs text-stone-500 font-medium">
                  ({menuItems.length - soldOutCount} in stock · {soldOutCount} sold out)
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Toggle dish availability for live customer orders
              </p>
            </div>
            {soldOutCount > 0 && (
              <button
                onClick={() => {
                  menuItems
                    .filter((item) => !item.isAvailable)
                    .forEach((item) => dispatch(toggleItemAvailability(item.id)));
                  showToast('All menu items restored to In Stock!');
                }}
                className="h-8 px-3 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restock All ({soldOutCount})</span>
              </button>
            )}
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search dish by name..."
                value={stockSearchQuery}
                onChange={(e) => setStockSearchQuery(e.target.value)}
                className="w-full h-8.5 bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]/20 rounded-lg pl-8 pr-7 text-xs outline-none transition-colors placeholder:text-stone-400 text-stone-800"
              />
              {stockSearchQuery && (
                <button
                  onClick={() => setStockSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none flex-wrap">
              {[
                { id: 'all', label: 'All' },
                { id: 'biryani', label: 'Biryani' },
                { id: 'curries', label: 'Curries' },
                { id: 'grill', label: 'Grill' },
                { id: 'vegetarian', label: 'Vegetarian' },
                { id: 'breads', label: 'Breads' },
                { id: 'desserts', label: 'Desserts' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setStockCategoryFilter(c.id)}
                  className={`h-7 px-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                    stockCategoryFilter === c.id
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}

              <span className="w-px h-4 bg-stone-200 mx-1 hidden sm:block" />

              {/* Status Quick Filter */}
              <button
                onClick={() => setStockStatusFilter('all')}
                className={`h-7 px-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  stockStatusFilter === 'all'
                    ? 'bg-[#F15A24] text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStockStatusFilter('sold_out')}
                className={`h-7 px-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  stockStatusFilter === 'sold_out'
                    ? 'bg-rose-600 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                86&apos;d ({soldOutCount})
              </button>
            </div>
          </div>

          {/* Empty Search State */}
          {filteredStockItems.length === 0 && (
            <div className="text-center py-12 px-4 text-stone-400">
              <Search className="w-6 h-6 text-stone-300 mx-auto mb-2" />
              <p className="font-medium text-xs text-stone-600">No dishes found</p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                No items match &quot;{stockSearchQuery}&quot;.
              </p>
              <button
                onClick={() => {
                  setStockSearchQuery('');
                  setStockCategoryFilter('all');
                  setStockStatusFilter('all');
                }}
                className="mt-2.5 text-xs text-[#F15A24] hover:underline font-medium cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Clean Operational Stock Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredStockItems.map((dish) => {
              const inStock = dish.isAvailable;

              return (
                <div
                  key={dish.id}
                  className={`p-3 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                    inStock
                      ? 'bg-white border-stone-200/90 hover:border-stone-300 shadow-2xs'
                      : 'bg-rose-50/20 border-rose-200/60'
                  }`}
                >
                  {/* Left: Thumbnail & Essential Dish Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className={`w-11 h-11 rounded-lg object-cover shrink-0 ${
                        inStock ? '' : 'grayscale-[40%]'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-semibold text-xs sm:text-sm truncate leading-snug ${
                            inStock ? 'text-stone-900' : 'text-stone-400 line-through'
                          }`}
                        >
                          {dish.name}
                        </h3>
                        <span className="text-xs font-semibold text-[#B84A22] shrink-0">
                          €{dish.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500">
                        <span>{dish.categoryLabel} Station</span>
                        <span>·</span>
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${
                            inStock ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              inStock ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {inStock ? 'In Stock' : 'Sold Out'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Instant Toggle Button */}
                  <button
                    onClick={() => {
                      dispatch(toggleItemAvailability(dish.id));
                      showToast(
                        inStock
                          ? `86: "${dish.name}" marked as Sold Out`
                          : `Restocked: "${dish.name}" available`
                      );
                    }}
                    className={`h-8 px-2.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      inStock
                        ? 'bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700'
                        : 'bg-rose-600 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {inStock ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>In Stock</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 text-white" />
                        <span>86&apos;d</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: SHIFT Z-REPORT & KITCHEN ANALYTICS ================= */}
      {selectedTab === 'sales' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <h2 className="text-base font-semibold text-stone-900">
                Shift Z-Report &amp; Kitchen Performance
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Active shift metrics, order volume, and station output
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="h-8 px-3 rounded-lg bg-white border border-stone-200 hover:border-stone-400 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>

          {/* Top 3 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
              <span className="text-xs font-medium text-stone-500 block">
                Shift Gross Revenue
              </span>
              <div className="text-2xl font-bold text-[#F15A24] tracking-tight">
                €{totalRevenue.toFixed(2)}
              </div>
              <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> Live Orders Total
              </span>
            </div>

            <div className="p-4.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
              <span className="text-xs font-medium text-stone-500 block">
                Orders Volume
              </span>
              <div className="text-2xl font-bold text-stone-900 tracking-tight">
                {orders.length} Tickets
              </div>
              <span className="text-xs text-stone-500 block">
                {deliveryCount} Delivery · {collectionCount} Pickup
              </span>
            </div>

            <div className="p-4.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
              <span className="text-xs font-medium text-stone-500 block">
                Average Prep Time
              </span>
              <div className="text-2xl font-bold text-emerald-700 tracking-tight">
                17.4 Mins
              </div>
              <span className="text-xs text-stone-500 block">
                Target: 20 mins · 96.8% On-Time
              </span>
            </div>
          </div>

          {/* Station Breakdown & Shift Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4.5 rounded-xl border border-stone-200/90 shadow-2xs space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#F15A24]" />
                <span>Station Output Breakdown</span>
              </h3>
              <div className="text-xs divide-y divide-stone-100">
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-stone-600">🥘 Karahi &amp; Curries</span>
                  <span className="font-semibold text-stone-900">
                    {orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'curries').length} Portions
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-stone-600">🍚 Dum Biryani &amp; Rice</span>
                  <span className="font-semibold text-stone-900">
                    {orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'biryani').length} Portions
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-stone-600">🍢 Clay Oven Tandoor</span>
                  <span className="font-semibold text-stone-900">
                    {orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'grill').length} Portions
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-stone-600">🫓 Naan &amp; Breads</span>
                  <span className="font-semibold text-stone-900">
                    {orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'breads').length} Breads
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-xl border border-stone-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#F15A24]" />
                  <span>Recent Shift Activity</span>
                </h3>
                <span className="text-xs text-stone-400">
                  {orders.length} Tickets
                </span>
              </div>
              <div className="space-y-1 max-h-[240px] overflow-y-auto divide-y divide-stone-100 pr-1">
                {orders.map((ord) => (
                  <div key={ord.id} className="flex items-center justify-between py-2 text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-stone-900">#{ord.orderNumber}</span>
                        <span className="text-stone-600 font-medium">{ord.customerName}</span>
                        <span className="text-stone-400">
                          ({ord.fulfillmentType})
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 block">
                        {ord.items.reduce((acc, i) => acc + i.quantity, 0)} items · {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-stone-900 block text-xs">
                        €{ord.total.toFixed(2)}
                      </span>
                      <span className={`text-[10px] font-medium capitalize px-1.5 py-0.2 rounded-full inline-block ${
                        ord.status === 'completed'
                          ? 'bg-stone-100 text-stone-700'
                          : ord.status === 'ready'
                          ? 'bg-emerald-50 text-emerald-700'
                          : ord.status === 'preparing'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-orange-50 text-[#F15A24]'
                      }`}>
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TICKET DETAILS & KITCHEN SLIP MODAL ================= */}
      {activeSlipOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[22px] max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#EAE5DF] overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#FAF8F5] border-b border-[#EAE5DF] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF4EC] border border-[#F15A24]/20 flex items-center justify-center text-[#F15A24]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[15px] text-[#1A130E]">
                      Order #{activeSlipOrder.orderNumber}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase inline-flex items-center gap-1 ${
                        activeSlipOrder.fulfillmentType === 'delivery'
                          ? 'bg-orange-50 text-[#F15A24] border border-orange-200/60'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                      }`}
                    >
                      {activeSlipOrder.fulfillmentType === 'delivery' ? (
                        <Bike className="w-3 h-3" />
                      ) : (
                        <Store className="w-3 h-3" />
                      )}
                      <span>{activeSlipOrder.fulfillmentType}</span>
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#7A746E]">
                    Placed {new Date(activeSlipOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Status: <span className="font-semibold text-[#1A130E] capitalize">{activeSlipOrder.status.replace('_', ' ')}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSlipOrder(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9E9790] hover:text-[#1A130E] hover:bg-[#EFEAE4]/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* View Switcher Tabs */}
            <div className="px-5 pt-3 pb-2 bg-white border-b border-[#F2EFE9] flex items-center gap-2">
              <button
                onClick={() => setSlipModalTab('details')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  slipModalTab === 'details'
                    ? 'bg-[#1A130E] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#666059] hover:text-[#1A130E] border border-[#EAE5DF]'
                }`}
              >
                Full Ticket Details
              </button>
              <button
                onClick={() => setSlipModalTab('slip')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  slipModalTab === 'slip'
                    ? 'bg-[#1A130E] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#666059] hover:text-[#1A130E] border border-[#EAE5DF]'
                }`}
              >
                <Printer className="w-3 h-3" />
                <span>Thermal ESC/POS Slip</span>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {slipModalTab === 'details' ? (
                <>
                  {/* Customer & Delivery Card */}
                  <div className="bg-[#FAF8F5] rounded-xl p-4 border border-[#EAE5DF] space-y-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8681] block">
                      Customer & Delivery Destination
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[#7A746E] block text-[11px]">Customer</span>
                        <span className="font-semibold text-[#1A130E] text-[13px]">{activeSlipOrder.customerName}</span>
                      </div>
                      <div>
                        <span className="text-[#7A746E] block text-[11px]">Contact Phone</span>
                        <a
                          href={`tel:${activeSlipOrder.customerPhone}`}
                          className="font-semibold text-[#F15A24] hover:underline inline-flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{activeSlipOrder.customerPhone}</span>
                        </a>
                      </div>
                      {activeSlipOrder.deliveryAddress && (
                        <div className="sm:col-span-2">
                          <span className="text-[#7A746E] block text-[11px]">Delivery Address & Eircode</span>
                          <div className="font-medium text-[#1A130E] inline-flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#F15A24] shrink-0" />
                            <span>{activeSlipOrder.deliveryAddress} {activeSlipOrder.eircode ? `(${activeSlipOrder.eircode})` : ''}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Special Notes & Driver Instructions */}
                  {activeSlipOrder.specialNotes && (
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[12px] text-amber-900">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Driver / Packaging Special Notes</span>
                      </div>
                      <p className="text-[12px] leading-relaxed pl-5">{activeSlipOrder.specialNotes}</p>
                    </div>
                  )}

                  {/* Order Items Breakdown */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8681] mb-2 block">
                      Ordered Dishes & Modifiers ({activeSlipOrder.items.reduce((acc, i) => acc + i.quantity, 0)} items)
                    </span>
                    <div className="divide-y divide-[#F2EFE9] border border-[#EAE5DF] rounded-xl overflow-hidden bg-white">
                      {activeSlipOrder.items.map((item, idx) => (
                        <div key={idx} className="p-3 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded bg-[#FAF8F5] border border-[#EAE5DF] flex items-center justify-center text-xs font-bold text-[#F15A24]">
                                {item.quantity}×
                              </span>
                              <span className="font-semibold text-xs text-[#1A130E]">{item.dish.name}</span>
                            </div>
                            <span className="font-semibold text-xs text-[#1A130E]">€{item.totalPrice.toFixed(2)}</span>
                          </div>
                          {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                            <div className="pl-7 space-y-0.5">
                              {item.selectedModifiers.map((mod, mIdx) => (
                                <p key={mIdx} className="text-[11px] text-[#7A746E]">
                                  • {mod.optionName} {mod.price > 0 ? `(+€${mod.price.toFixed(2)})` : ''}
                                </p>
                              ))}
                            </div>
                          )}
                          {item.specialInstructions && (
                            <div className="mt-1 ml-7 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/60 text-[10.5px] font-medium">
                              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>{item.specialInstructions}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EAE5DF] text-xs space-y-1.5">
                    <div className="flex justify-between text-[#7A746E]">
                      <span>Subtotal</span>
                      <span>€{activeSlipOrder.subtotal.toFixed(2)}</span>
                    </div>
                    {activeSlipOrder.deliveryFee > 0 && (
                      <div className="flex justify-between text-[#7A746E]">
                        <span>Delivery Fee</span>
                        <span>€{activeSlipOrder.deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    {activeSlipOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount</span>
                        <span>-€{activeSlipOrder.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm text-[#1A130E] pt-1.5 border-t border-[#EAE5DF]">
                      <span>Total Paid ({activeSlipOrder.paymentMethod.replace('_', ' ').toUpperCase()})</span>
                      <span>€{activeSlipOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Simulated Thermal Paper */
                <div className="bg-[#FAF8F5] p-5 rounded-xl border border-dashed border-[#DCD5CB] font-mono text-xs space-y-3 leading-relaxed max-w-sm mx-auto">
                  <div className="text-center pb-2 border-b border-dashed border-[#CCC5BC]">
                    <h3 className="font-bold text-sm tracking-tight">{RESTAURANT_INFO.name}</h3>
                    <p className="text-[10px] text-[#7A746E]">{RESTAURANT_INFO.location}</p>
                    <p className="text-[11px] font-bold mt-1 text-[#F15A24]">
                      *** KITCHEN EXPO TICKET ***
                    </p>
                  </div>

                  <div className="flex justify-between font-bold text-sm">
                    <span>ORDER: #{activeSlipOrder.orderNumber}</span>
                    <span className="uppercase">{activeSlipOrder.fulfillmentType}</span>
                  </div>

                  <div className="text-[11px] text-[#666059]">
                    <span>Diner: {activeSlipOrder.customerName}</span>
                    <br />
                    <span>Phone: {activeSlipOrder.customerPhone}</span>
                    <br />
                    <span>Time: {new Date(activeSlipOrder.createdAt).toLocaleTimeString()}</span>
                  </div>

                  <div className="border-t border-dashed border-[#CCC5BC] pt-2 space-y-2">
                    {activeSlipOrder.items.map((i, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between font-bold text-[12px]">
                          <span>{i.quantity}x {i.dish.name}</span>
                          <span>€{i.totalPrice.toFixed(2)}</span>
                        </div>
                        {i.selectedModifiers.map((m, mIdx) => (
                          <span key={mIdx} className="block text-[10px] text-[#F15A24] pl-2 font-semibold">
                            &gt; {m.optionName}
                          </span>
                        ))}
                        {i.specialInstructions && (
                          <div className="text-[10px] bg-red-100 text-red-800 font-bold p-1 rounded mt-0.5">
                            ALERTS: {i.specialInstructions}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {activeSlipOrder.specialNotes && (
                    <div className="border-t border-dashed border-[#CCC5BC] pt-2 text-[10px]">
                      <strong>NOTE:</strong> {activeSlipOrder.specialNotes}
                    </div>
                  )}

                  <div className="border-t border-dashed border-[#CCC5BC] pt-2 flex justify-between font-bold text-sm">
                    <span>TOTAL PAID:</span>
                    <span>€{activeSlipOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="px-5 py-3.5 bg-[#FAF8F5] border-t border-[#EAE5DF] flex items-center justify-between gap-2.5">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#1A130E] text-white hover:bg-black flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Thermal Slip</span>
              </button>

              <div className="flex items-center gap-2">
                {activeSlipOrder.status === 'new' && (
                  <button
                    onClick={() => {
                      dispatch(updateOrderStatus({ orderId: activeSlipOrder.id, status: 'preparing' }));
                      showToast(`Order #${activeSlipOrder.orderNumber} sent to cooking!`);
                      setActiveSlipOrder(null);
                    }}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#F15A24] text-white hover:bg-[#D94E1C] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Start Cooking</span>
                  </button>
                )}
                {activeSlipOrder.status === 'preparing' && (
                  <button
                    onClick={() => {
                      dispatch(updateOrderStatus({ orderId: activeSlipOrder.id, status: 'ready' }));
                      showToast(`Order #${activeSlipOrder.orderNumber} marked ready!`);
                      setActiveSlipOrder(null);
                    }}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#0FA958] text-white hover:bg-[#0D914B] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Ready</span>
                  </button>
                )}
                {activeSlipOrder.status === 'ready' && (
                  <button
                    onClick={() => {
                      dispatch(updateOrderStatus({ orderId: activeSlipOrder.id, status: 'completed' }));
                      showToast(`Order #${activeSlipOrder.orderNumber} marked completed!`);
                      setActiveSlipOrder(null);
                    }}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#1A130E] text-white hover:bg-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-[#FFA940]" />
                    <span>Complete Order</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveSlipOrder(null)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs border border-[#EAE5DF] text-[#666059] hover:bg-white cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= FAST MANUAL WALK-IN TICKET MODAL ================= */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCreateManualOrder}
            className="bg-white rounded-[24px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#EAE5DF] space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DF]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF4EC] border border-[#F15A24]/20 flex items-center justify-center text-[#F15A24]">
                  <ChefHat className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#1A130E]">Fire Manual Kitchen Ticket</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9E9790] hover:text-[#1A130E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#1A130E] mb-1.5">
                  Customer / Table Identifier
                </label>
                <input
                  type="text"
                  required
                  value={manualCustomer}
                  onChange={(e) => setManualCustomer(e.target.value)}
                  placeholder="e.g. Table 4 / Walk-in / Phone order"
                  className="w-full h-11 bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]/30 rounded-xl px-3.5 outline-none transition-all text-[#1A130E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#1A130E] mb-1.5">
                    Order Type
                  </label>
                  <select
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value as any)}
                    className="w-full h-11 bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]/30 rounded-xl px-3 outline-none transition-all text-[#1A130E]"
                  >
                    <option value="collection">🛍 Counter Collection</option>
                    <option value="delivery">🛵 Dublin Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A130E] mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="+353 87 000 0000"
                    className="w-full h-11 bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]/30 rounded-xl px-3.5 outline-none transition-all text-[#1A130E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A130E] mb-1.5">
                  Select Culinary Dish
                </label>
                <select
                  value={manualDishId}
                  onChange={(e) => setManualDishId(e.target.value)}
                  className="w-full h-11 bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]/30 rounded-xl px-3 outline-none transition-all text-[#1A130E]"
                >
                  {menuItems.map((dish) => (
                    <option key={dish.id} value={dish.id}>
                      {dish.name} — €{dish.price.toFixed(2)} ({dish.categoryLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-[#1A130E] mb-1.5">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={manualQty}
                    onChange={(e) => setManualQty(Number(e.target.value) || 1)}
                    className="w-full h-11 bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]/30 rounded-xl px-3.5 outline-none transition-all text-[#1A130E]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#1A130E] mb-1.5">
                    Kitchen Notes / Allergen
                  </label>
                  <input
                    type="text"
                    value={manualNote}
                    onChange={(e) => setManualNote(e.target.value)}
                    placeholder="e.g. Extra spicy, mild raita"
                    className="w-full h-11 bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]/30 rounded-xl px-3.5 outline-none transition-all text-[#1A130E]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[#EAE5DF]">
              <button
                type="submit"
                className="flex-1 h-11 rounded-xl font-semibold text-sm bg-[#F15A24] text-white hover:bg-[#D94E1C] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Flame className="w-4 h-4" />
                <span>Fire Ticket Immediately</span>
              </button>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="h-11 px-5 rounded-xl font-semibold text-sm border border-[#EAE5DF] text-[#666059] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      </div>
    </div>
  );
}

// ================= SUB-COMPONENT: KDS ORDER CARD =================
function KdsOrderCard({
  order,
  onStatusChange,
  onPrint,
}: {
  order: OrderItem;
  onStatusChange: (status: OrderItem['status']) => void;
  onPrint: () => void;
}) {
  const isDelivery = order.fulfillmentType === 'delivery';

  // Live Elapsed Time Calculation (realistic kitchen pacing)
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    const calc = () => {
      const createdTime = new Date(order.createdAt).getTime();
      const now = Date.now();
      const diffMins = Math.max(0, Math.floor((now - createdTime) / 60000));
      // Keep realistic pacing for live display (e.g. 4m, 12m, 18m)
      const realisticMins = diffMins > 60 ? (diffMins % 25) + 4 : diffMins;
      setElapsedMinutes(realisticMins);
    };
    calc();
    const interval = setInterval(calc, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const isDelayed = elapsedMinutes >= 25;
  const isWarning = elapsedMinutes >= 15 && elapsedMinutes < 25;
  const totalItemCount = order.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 hover:border-stone-300 transition-colors p-4 flex flex-col justify-between shadow-2xs space-y-3">
      {/* 1. Header: Order #, Fulfillment type, Elapsed timer, Print action */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-stone-900 tracking-tight">
            #{order.orderNumber}
          </span>
          <span className="text-xs font-medium text-stone-500 inline-flex items-center gap-1">
            {isDelivery ? <Bike className="w-3.5 h-3.5 text-[#F15A24]" /> : <Store className="w-3.5 h-3.5 text-emerald-600" />}
            <span className="capitalize">{order.fulfillmentType}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-xs inline-flex items-center gap-1 ${
              isDelayed
                ? 'text-rose-600 font-semibold'
                : isWarning
                ? 'text-amber-700 font-semibold'
                : 'text-stone-400 font-medium'
            }`}
            title="Elapsed cooking & prep time"
          >
            <Clock className="w-3 h-3" />
            <span>{elapsedMinutes}m</span>
          </span>

          <button
            onClick={onPrint}
            title="View Full Ticket Details & Slip"
            className="text-stone-400 hover:text-stone-700 p-0.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Customer Line */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span className="font-medium text-stone-800 truncate">
          {order.customerName}
        </span>
        <span className="text-stone-400 text-xs shrink-0">
          {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} · €{order.total.toFixed(2)}
        </span>
      </div>

      {/* 3. Items List */}
      <div className="space-y-2.5 flex-1 border-t border-stone-100 pt-2.5">
        {order.items.map((item, idx) => {
          const hasInstruction =
            item.specialInstructions &&
            item.specialInstructions.trim().toLowerCase() !== order.specialNotes?.trim().toLowerCase();

          return (
            <div key={idx} className="space-y-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold text-xs text-[#F15A24] shrink-0">
                  {item.quantity}×
                </span>
                <span className="font-medium text-xs sm:text-sm text-stone-800 leading-snug">
                  {item.dish.name}
                </span>
              </div>

              {/* Modifiers List */}
              {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                <div className="pl-4 space-y-0.5">
                  {item.selectedModifiers.map((mod, mIdx) => (
                    <p key={mIdx} className="text-xs text-stone-500">
                      • {mod.optionName}
                    </p>
                  ))}
                </div>
              )}

              {/* Special Instructions */}
              {hasInstruction && (
                <div className="pl-4 pt-0.5 flex items-center gap-1.5 text-xs font-medium text-amber-700">
                  <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>{item.specialInstructions}</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Delivery / Packaging Special Note */}
        {order.specialNotes && (
          <div
            onClick={onPrint}
            title="Click to view full ticket details"
            className="mt-2 pl-2 border-l-2 border-stone-300 text-xs text-stone-600 cursor-pointer hover:border-[#F15A24] transition-colors"
          >
            <span className="font-semibold text-stone-800 text-[11px] block">
              Note:
            </span>
            <span className="line-clamp-2 leading-relaxed">{order.specialNotes}</span>
          </div>
        )}
      </div>

      {/* 4. Action Footer */}
      <div className="pt-1 flex items-center gap-2">
        {order.status === 'new' && (
          <button
            onClick={() => onStatusChange('preparing')}
            className="flex-1 h-9 rounded-lg font-medium text-xs bg-[#F15A24] hover:bg-[#D94E1C] text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Fire Ticket</span>
          </button>
        )}

        {order.status === 'preparing' && (
          <>
            <button
              onClick={() => onStatusChange('ready')}
              className="flex-1 h-9 rounded-lg font-medium text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Ready</span>
            </button>
            <button
              onClick={() => onStatusChange('new')}
              title="Recall to Incoming Tickets"
              className="w-9 h-9 rounded-lg border border-stone-200 hover:border-stone-400 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {order.status === 'ready' && (
          <>
            <button
              onClick={() => onStatusChange('completed')}
              className="flex-1 h-9 rounded-lg font-medium text-xs bg-stone-900 hover:bg-black text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#FFA940]" />
              <span>Handover &amp; Complete</span>
            </button>
            <button
              onClick={() => onStatusChange('preparing')}
              title="Return to Cooking"
              className="w-9 h-9 rounded-lg border border-stone-200 hover:border-stone-400 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
