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

  // Audio Notifications
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Thermal Slip Modal
  const [activeSlipOrder, setActiveSlipOrder] = useState<OrderItem | null>(null);

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
  }, [menuItems, stockCategoryFilter, stockSearchQuery]);

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
    <div className="min-h-screen bg-[#FBF9F6] text-[#1A130E] p-4 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-xl bg-[#1A130E] text-white text-[13px] font-semibold flex items-center gap-2.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#0FA958] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= TOP KITCHEN CONTROLLER BAR ================= */}
      <div className="bg-white p-5 rounded-[20px] border border-[#EFEAE4] shadow-[0_4px_24px_rgba(26,19,14,0.03)] mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Identity & Status */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFA940] to-[#F15A24] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1A130E] tracking-tight">
                  Kitchen Display System (KDS)
                </h1>
                <span className="bg-[#0FA958]/10 text-[#0FA958] border border-[#0FA958]/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0FA958] animate-ping inline-block" />
                  Live Order Dispatch
                </span>
                {kitchenSnooze && (
                  <span className="bg-red-50 text-red-600 border border-red-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Rush Mode Active (+{kitchenSnoozeMinutes}m)
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[#7A746E] mt-0.5">
                Head Chef: <strong className="text-[#1A130E]">Tariq Al-Mansoor</strong> · 18 South William St, Dublin 2
              </p>
            </div>
          </div>

          {/* Quick Global Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                if (!soundEnabled) playChime();
                setSoundEnabled(!soundEnabled);
                showToast(soundEnabled ? 'Chime muted' : 'Kitchen Chime sound enabled');
              }}
              className={`px-3.5 py-2 rounded-xl text-[12.5px] font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-white border-[#EAE5DF] text-[#1A130E] hover:border-[#F15A24]'
                  : 'bg-neutral-100 border-neutral-200 text-[#9E9790]'
              }`}
              title="Toggle Web Audio Chime"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#F15A24]" />
                  <span>Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Sound Muted</span>
                </>
              )}
            </button>

            {/* Rush Mode Selector */}
            <button
              onClick={() => {
                dispatch(toggleKitchenSnooze(20));
                showToast(kitchenSnooze ? 'Rush mode deactivated' : 'Rush Mode (+20m delay) activated for dines');
              }}
              className={`px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                kitchenSnooze
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-white border border-[#EAE5DF] text-[#1A130E] hover:border-[#F15A24]'
              }`}
            >
              <Clock className="w-4 h-4 text-inherit" />
              <span>{kitchenSnooze ? 'Exit Rush Mode' : 'Rush Mode (+20m)'}</span>
            </button>

            {/* Quick Fire Manual Order Button */}
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="px-4 py-2 rounded-xl text-[12.5px] font-semibold bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white hover:opacity-95 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Fire Manual Ticket</span>
            </button>

            {/* Tab Pill Switcher */}
            <div className="flex bg-[#F2ECE5] p-1 rounded-2xl border border-[#E8E2D9]">
              <button
                onClick={() => setSelectedTab('kds')}
                className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-semibold transition-all cursor-pointer ${
                  selectedTab === 'kds'
                    ? 'bg-white text-[#F15A24] shadow-xs'
                    : 'text-[#666059] hover:text-[#1A130E]'
                }`}
              >
                KDS Screen ({orders.length})
              </button>
              <button
                onClick={() => setSelectedTab('menu-86')}
                className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedTab === 'menu-86'
                    ? 'bg-white text-[#F15A24] shadow-xs'
                    : 'text-[#666059] hover:text-[#1A130E]'
                }`}
              >
                <span>86 Sold-Out</span>
                {soldOutCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {soldOutCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setSelectedTab('sales')}
                className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-semibold transition-all cursor-pointer ${
                  selectedTab === 'sales'
                    ? 'bg-white text-[#F15A24] shadow-xs'
                    : 'text-[#666059] hover:text-[#1A130E]'
                }`}
              >
                Z-Report (Shift)
              </button>
            </div>
          </div>
        </div>

        {/* ================= TAB 1 SECONDARY TOOLBAR: STATION & TYPE FILTERS ================= */}
        {selectedTab === 'kds' && (
          <div className="mt-5 pt-4 border-t border-[#F2EFE9] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search by Order Number or Diner */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-[#9E9790] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search ticket # or diner name..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] rounded-xl pl-9 pr-3 py-1.5 text-[13px] outline-none transition-all placeholder:text-[#9E9790]"
              />
              {orderSearchQuery && (
                <button
                  onClick={() => setOrderSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#9E9790] hover:text-[#1A130E]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Station Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[12px] font-semibold text-[#8C8681] mr-1">Station:</span>
              {[
                { id: 'all', label: 'All Stations' },
                { id: 'biryani', label: '🍚 Biryani' },
                { id: 'curries', label: '🥘 Karahi' },
                { id: 'grill', label: '🍢 Tandoor' },
                { id: 'breads', label: '🫓 Breads' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStationFilter(st.id as StationFilter)}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                    stationFilter === st.id
                      ? 'bg-[#1A130E] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#55504A] hover:bg-white border border-[#EAE5DF]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Fulfillment Type Segment */}
            <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#EAE5DF]">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'delivery', label: '🛵 Delivery' },
                { id: 'collection', label: '🛍 Pickup' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFulfillmentFilter(f.id as FulfillmentFilter)}
                  className={`px-2.5 py-1 rounded-lg text-[11.5px] font-semibold transition-all cursor-pointer ${
                    fulfillmentFilter === f.id
                      ? 'bg-white text-[#F15A24] shadow-xs'
                      : 'text-[#666059] hover:text-[#1A130E]'
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
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-[18px] border border-[#EFEAE4] shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#E23744] animate-pulse" />
                <div>
                  <h3 className="font-bold text-[13px] uppercase tracking-wider text-[#1A130E]">
                    Incoming Tickets
                  </h3>
                  <p className="text-[11px] text-[#7A746E]">New orders to fire</p>
                </div>
              </div>
              <span className="bg-[#E23744]/10 text-[#E23744] border border-[#E23744]/25 px-2.5 py-0.5 rounded-full text-xs font-bold">
                {newOrders.length} Tickets
              </span>
            </div>

            {newOrders.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-[#E5DFD7] rounded-[18px] p-6 text-xs text-[#9E9790]">
                <UtensilsCrossed className="w-8 h-8 text-[#CCC5BC] mx-auto mb-2" />
                <span className="block font-semibold text-[13px] text-[#55504A]">No New Tickets</span>
                <span>Incoming takeaway and delivery orders will appear here.</span>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-[18px] border border-[#EFEAE4] shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#FFA940]" />
                <div>
                  <h3 className="font-bold text-[13px] uppercase tracking-wider text-[#1A130E]">
                    Cooking / Grilling
                  </h3>
                  <p className="text-[11px] text-[#7A746E]">Active pots & tandoor skewers</p>
                </div>
              </div>
              <span className="bg-[#FFF4EC] text-[#F15A24] border border-[#F15A24]/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                {preparingOrders.length} Cooking
              </span>
            </div>

            {preparingOrders.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-[#E5DFD7] rounded-[18px] p-6 text-xs text-[#9E9790]">
                <Flame className="w-8 h-8 text-[#CCC5BC] mx-auto mb-2" />
                <span className="block font-semibold text-[13px] text-[#55504A]">Tandoors Clear</span>
                <span>Click &quot;Fire Ticket&quot; on any new order to start cooking.</span>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-[18px] border border-[#EFEAE4] shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#0FA958]" />
                <div>
                  <h3 className="font-bold text-[13px] uppercase tracking-wider text-[#1A130E]">
                    Ready / Out for Delivery
                  </h3>
                  <p className="text-[11px] text-[#7A746E]">Packed in thermal bags</p>
                </div>
              </div>
              <span className="bg-[#0FA958]/10 text-[#0FA958] border border-[#0FA958]/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
                {readyOrders.length} Ready
              </span>
            </div>

            {readyOrders.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-[#E5DFD7] rounded-[18px] p-6 text-xs text-[#9E9790]">
                <CheckCircle2 className="w-8 h-8 text-[#CCC5BC] mx-auto mb-2" />
                <span className="block font-semibold text-[13px] text-[#55504A]">No Packed Orders</span>
                <span>Ready orders waiting for customer pickup or rider show here.</span>
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
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-[20px] border border-[#EFEAE4] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#1A130E] tracking-tight">
                Instant Kitchen Stock Manager (86ing)
              </h2>
              <p className="text-[13px] text-[#7A746E] mt-0.5">
                1-tap toggle to immediately grey out or restore dishes on customer ordering menu.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                ✓ {menuItems.length - soldOutCount} In Stock
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold">
                ✕ {soldOutCount} 86&apos;d Sold Out
              </span>
            </div>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#F15A24] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search dish by name, ingredients, or ID..."
                value={stockSearchQuery}
                onChange={(e) => setStockSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#EAE5DF] focus:border-[#F15A24] rounded-xl pl-10 pr-4 py-2.5 text-[14px] outline-none shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'All Items' },
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
                  className={`px-3.5 py-2 rounded-xl text-[12.5px] font-semibold transition-all cursor-pointer shrink-0 ${
                    stockCategoryFilter === c.id
                      ? 'bg-[#F15A24] text-white shadow-xs'
                      : 'bg-white text-[#55504A] hover:bg-[#FAF8F5] border border-[#EAE5DF]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredStockItems.map((dish) => {
              const inStock = dish.isAvailable;

              return (
                <div
                  key={dish.id}
                  className={`p-4 rounded-[18px] border transition-all flex items-center justify-between gap-3 shadow-xs ${
                    inStock
                      ? 'bg-white border-[#EFEAE4] hover:border-[#F15A24]/40'
                      : 'bg-[#FFF8F8] border-red-200/80 opacity-90'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className={`w-13 h-13 rounded-xl object-cover shrink-0 border ${
                        inStock ? 'border-[#EAE5DF]' : 'border-red-200 filter grayscale-[40%]'
                      }`}
                    />
                    <div className="min-w-0">
                      <h4
                        className={`font-bold text-[13.5px] truncate ${
                          inStock ? 'text-[#1A130E]' : 'text-red-950 line-through'
                        }`}
                      >
                        {dish.name}
                      </h4>
                      <p className="text-[12px] text-[#7A746E]">
                        €{dish.price.toFixed(2)} · {dish.categoryLabel}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      dispatch(toggleItemAvailability(dish.id));
                      showToast(
                        inStock
                          ? `86 Alert: "${dish.name}" marked as Sold Out`
                          : `Restocked: "${dish.name}" marked as Available`
                      );
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs active:scale-95 ${
                      inStock
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                        : 'bg-red-600 text-white hover:bg-emerald-600'
                    }`}
                  >
                    {inStock ? '✓ In Stock' : '✕ 86 Sold Out'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: SHIFT Z-REPORT & KITCHEN ANALYTICS ================= */}
      {selectedTab === 'sales' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1A130E] tracking-tight">
                Kitchen Shift Closeout & Performance (Z-Report)
              </h2>
              <p className="text-[13px] text-[#7A746E] mt-0.5">
                Live Dublin kitchen metrics, ticket volume, average preparation pacing, and revenue.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-white border border-[#EAE5DF] hover:border-[#1A130E] text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Shift Report</span>
            </button>
          </div>

          {/* Top 3 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-[20px] bg-white border border-[#EFEAE4] shadow-xs">
              <span className="text-[12px] text-[#7A746E] uppercase font-bold tracking-wider">
                Shift Gross Revenue
              </span>
              <div className="text-3xl font-extrabold text-[#F15A24] mt-2">
                €{totalRevenue.toFixed(2)}
              </div>
              <span className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" /> Live Kitchen Orders Total
              </span>
            </div>

            <div className="p-6 rounded-[20px] bg-white border border-[#EFEAE4] shadow-xs">
              <span className="text-[12px] text-[#7A746E] uppercase font-bold tracking-wider">
                Orders Volume
              </span>
              <div className="text-3xl font-extrabold text-[#1A130E] mt-2">
                {orders.length} Tickets
              </div>
              <span className="text-xs text-[#7A746E] mt-1 block">
                {deliveryCount} Delivery ({Math.round((deliveryCount / (orders.length || 1)) * 100)}%) · {collectionCount} Counter Collection
              </span>
            </div>

            <div className="p-6 rounded-[20px] bg-white border border-[#EFEAE4] shadow-xs">
              <span className="text-[12px] text-[#7A746E] uppercase font-bold tracking-wider">
                Average Prep Time
              </span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-2">
                17.4 Mins
              </div>
              <span className="text-xs text-[#7A746E] mt-1 block">
                Target: 20 mins · 96.8% On-Time Pacing
              </span>
            </div>
          </div>

          {/* Station Breakdown & Shift Staffing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[20px] border border-[#EFEAE4] shadow-xs space-y-4">
              <h3 className="font-bold text-[15px] text-[#1A130E] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#F15A24]" />
                <span>Station Output Breakdown</span>
              </h3>
              <div className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
                  <span className="font-medium text-[#55504A]">🥘 Karahi & Curries Station</span>
                  <span className="font-bold text-[#1A130E]">
                    {orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'curries').length} Portions
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
                  <span className="font-medium text-[#55504A]">🍚 Dum Biryani & Rice Station</span>
                  <span className="font-bold text-[#1A130E]">
                    {orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'biryani').length} Portions
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
                  <span className="font-medium text-[#55504A]">🍢 Clay Oven Tandoor Grills</span>
                  <span className="font-bold text-[#1A130E]">
                    {orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'grill').length} Portions
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#55504A]">🫓 Naan & Bread Bakery</span>
                  <span className="font-bold text-[#1A130E]">
                    {orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'breads').length} Breads
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[20px] border border-[#EFEAE4] shadow-xs space-y-4">
              <h3 className="font-bold text-[15px] text-[#1A130E] flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-[#F15A24]" />
                <span>Active Shift Staff & Stations</span>
              </h3>
              <div className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
                  <div>
                    <span className="font-bold text-[#1A130E] block">Chef Tariq Al-Mansoor</span>
                    <span className="text-xs text-[#7A746E]">Executive Head Chef · Expediter</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    On Duty
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
                  <div>
                    <span className="font-bold text-[#1A130E] block">Sous Chef Imran Malik</span>
                    <span className="text-xs text-[#7A746E]">Karahi & Slow-Braised Curries</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    On Duty
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1A130E] block">Master Tandoor Ustad Javed</span>
                    <span className="text-xs text-[#7A746E]">Clay Oven Grills & Dum Handi</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    On Duty
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= THERMAL SLIP / RECEIPT MODAL ================= */}
      {activeSlipOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[20px] max-w-sm w-full p-6 shadow-2xl border border-[#EAE5DF] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DF]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A746E]">
                Kitchen Thermal Slip
              </span>
              <button
                onClick={() => setActiveSlipOrder(null)}
                className="text-[#9E9790] hover:text-[#1A130E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Thermal Paper */}
            <div className="bg-[#FAF8F5] p-5 rounded-xl border border-dashed border-[#DCD5CB] font-mono text-xs space-y-3 leading-relaxed">
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

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  window.print();
                  setActiveSlipOrder(null);
                }}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-[#1A130E] text-white hover:bg-black flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print to Thermal ESC/POS</span>
              </button>
              <button
                onClick={() => setActiveSlipOrder(null)}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs border border-[#EAE5DF] text-[#666059] hover:bg-neutral-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FAST MANUAL WALK-IN TICKET MODAL ================= */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCreateManualOrder}
            className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl border border-[#EAE5DF] space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DF]">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#F15A24]" />
                <h3 className="font-bold text-base text-[#1A130E]">Fire Manual Kitchen Ticket</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="text-[#9E9790] hover:text-[#1A130E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-[13px]">
              <div>
                <label className="block text-xs font-semibold text-[#1A130E] mb-1">
                  Customer / Table Identifier
                </label>
                <input
                  type="text"
                  required
                  value={manualCustomer}
                  onChange={(e) => setManualCustomer(e.target.value)}
                  placeholder="e.g. Table 4 / Walk-in / Phone order"
                  className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white rounded-xl px-3.5 py-2 outline-none text-[#1A130E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#1A130E] mb-1">
                    Order Type
                  </label>
                  <select
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white rounded-xl px-3 py-2 outline-none text-[#1A130E]"
                  >
                    <option value="collection">🛍 Counter Collection</option>
                    <option value="delivery">🛵 Dublin Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A130E] mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="+353 87 000 0000"
                    className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white rounded-xl px-3 py-2 outline-none text-[#1A130E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A130E] mb-1">
                  Select Culinary Dish
                </label>
                <select
                  value={manualDishId}
                  onChange={(e) => setManualDishId(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white rounded-xl px-3 py-2 outline-none text-[#1A130E]"
                >
                  {menuItems.map((dish) => (
                    <option key={dish.id} value={dish.id}>
                      {dish.name} — €{dish.price.toFixed(2)} ({dish.categoryLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-[#1A130E] mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={manualQty}
                    onChange={(e) => setManualQty(Number(e.target.value) || 1)}
                    className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white rounded-xl px-3 py-2 outline-none text-[#1A130E]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#1A130E] mb-1">
                    Kitchen Notes / Allergen
                  </label>
                  <input
                    type="text"
                    value={manualNote}
                    onChange={(e) => setManualNote(e.target.value)}
                    placeholder="e.g. Extra spicy, mild raita"
                    className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white rounded-xl px-3 py-2 outline-none text-[#1A130E]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white shadow-xs hover:opacity-95 cursor-pointer"
              >
                Fire Ticket Immediately
              </button>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs border border-[#EAE5DF] text-[#666059] hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
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

  // Live Elapsed Time Calculation
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    const calc = () => {
      const createdTime = new Date(order.createdAt).getTime();
      const now = Date.now();
      const diffMins = Math.max(0, Math.floor((now - createdTime) / 60000));
      setElapsedMinutes(diffMins);
    };
    calc();
    const interval = setInterval(calc, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [order.createdAt]);

  // Urgency Color Pacing
  const isDelayed = elapsedMinutes >= 20;
  const isWarning = elapsedMinutes >= 10 && elapsedMinutes < 20;

  return (
    <div
      className={`bg-white rounded-[18px] border transition-all duration-200 shadow-[0_2px_12px_rgba(26,19,14,0.02)] overflow-hidden ${
        isDelayed
          ? 'border-red-400 ring-2 ring-red-400/20'
          : isWarning
          ? 'border-amber-300'
          : 'border-[#EFEAE4]'
      }`}
    >
      {/* Top Header: Order Number, Type, Print & Live Elapsed Timer */}
      <div className="p-3.5 bg-[#FAF8F5] border-b border-[#EAE5DF] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-extrabold text-[15px] text-[#1A130E] tracking-tight">
            #{order.orderNumber}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase flex items-center gap-1 ${
              isDelivery
                ? 'bg-orange-50 text-[#F15A24] border border-orange-200/60'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
            }`}
          >
            {isDelivery ? <Bike className="w-3 h-3" /> : <Store className="w-3 h-3" />}
            <span>{order.fulfillmentType}</span>
          </span>
        </div>

        {/* Live Elapsed Badge & Print Action */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold flex items-center gap-1 ${
              isDelayed
                ? 'bg-red-500 text-white animate-pulse'
                : isWarning
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'bg-neutral-100 text-[#55504A]'
            }`}
            title="Elapsed cooking & prep time"
          >
            <Timer className="w-3 h-3" />
            <span>{elapsedMinutes}m</span>
          </span>

          <button
            onClick={onPrint}
            title="Print Kitchen Slip"
            className="w-7 h-7 rounded-lg bg-white border border-[#EAE5DF] hover:border-[#1A130E] text-[#666059] flex items-center justify-center transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Customer Contact & Station Routing Bar */}
      <div className="px-4 py-2 border-b border-[#F2EFE9] flex items-center justify-between text-[11.5px] text-[#7A746E] bg-white">
        <div className="truncate pr-2">
          <span className="font-bold text-[#1A130E]">{order.customerName}</span>
          <span className="ml-1.5 font-medium">{order.customerPhone}</span>
        </div>
        <span className="font-bold text-[#1A130E] shrink-0">€{order.total.toFixed(2)}</span>
      </div>

      {/* Itemized Order Content */}
      <div className="p-4 space-y-3 text-[13px]">
        {order.items.map((item, idx) => (
          <div key={idx} className="pb-2 border-b border-[#FAF8F5] last:border-0 last:pb-0">
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-[14px] text-[#1A130E] leading-snug">
                <span className="text-[#F15A24] font-black mr-1">{item.quantity}x</span>
                {item.dish.name}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#8C8681] bg-[#FAF8F5] px-1.5 py-0.5 rounded">
                {item.dish.category}
              </span>
            </div>

            {/* Modifiers List */}
            {item.selectedModifiers.map((mod, mIdx) => (
              <span
                key={mIdx}
                className="text-[11.5px] text-[#F15A24] font-semibold block ml-3 mt-0.5"
              >
                • {mod.optionName}
              </span>
            ))}

            {/* Special Dietary & Cooking Instructions */}
            {item.specialInstructions && (
              <div className="mt-1.5 bg-red-50 border border-red-200/80 text-red-800 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{item.specialInstructions}</span>
              </div>
            )}
          </div>
        ))}

        {/* Global Delivery / Packaging Notes */}
        {order.specialNotes && (
          <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EAE5DF] text-[11.5px] text-[#55504A]">
            <span className="font-bold text-[#1A130E] block">Note:</span>
            {order.specialNotes}
          </div>
        )}
      </div>

      {/* Footer Forward Action & Accidental Recall */}
      <div className="p-3 bg-[#FAF8F5] border-t border-[#EAE5DF] flex items-center gap-2">
        {/* Status Forward Transition */}
        {order.status === 'new' && (
          <button
            onClick={() => onStatusChange('preparing')}
            className="flex-1 py-2.5 rounded-xl font-bold text-[12.5px] bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white hover:opacity-95 transition-opacity shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Flame className="w-4 h-4" />
            <span>Fire Ticket (Start Cooking)</span>
          </button>
        )}

        {order.status === 'preparing' && (
          <button
            onClick={() => onStatusChange('ready')}
            className="flex-1 py-2.5 rounded-xl font-bold text-[12.5px] bg-[#0FA958] hover:bg-[#0D914B] text-white transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Ready for Pickup</span>
          </button>
        )}

        {order.status === 'ready' && (
          <button
            onClick={() => onStatusChange('completed')}
            className="flex-1 py-2.5 rounded-xl font-bold text-[12.5px] bg-[#1A130E] hover:bg-black text-white transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <CheckCheck className="w-4 h-4 text-[#FFA940]" />
            <span>Handover & Complete</span>
          </button>
        )}

        {/* Accidental Status Rollback / Undo Button */}
        {order.status === 'preparing' && (
          <button
            onClick={() => onStatusChange('new')}
            title="Recall to New Tickets"
            className="w-9 h-9 rounded-xl bg-white border border-[#EAE5DF] hover:border-[#1A130E] text-[#7A746E] flex items-center justify-center transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
        )}

        {order.status === 'ready' && (
          <button
            onClick={() => onStatusChange('preparing')}
            title="Return to Cooking"
            className="w-9 h-9 rounded-xl bg-white border border-[#EAE5DF] hover:border-[#1A130E] text-[#7A746E] flex items-center justify-center transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
