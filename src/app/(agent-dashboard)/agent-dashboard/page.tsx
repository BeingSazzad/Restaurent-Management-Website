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
  LayoutGrid,
  List,
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
  const [stockViewMode, setStockViewMode] = useState<'grid' | 'table'>('grid');

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

      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ================= TOP STAFF CONTROLLER DECK ================= */}
        <div className="bg-white rounded-2xl border border-[#EFEAE4] shadow-xs p-5 sm:p-6 space-y-5">
          {/* Row 1: Brand & Identity + Global Quick Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-[#F2EFE9]">
            {/* Identity & Status */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF4EC] border border-[#F15A24]/20 text-[#F15A24] flex items-center justify-center font-bold shadow-xs shrink-0">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1A130E] tracking-tight">
                    Staff Operations & Kitchen Display
                  </h1>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] px-2.5 py-0.5 rounded-full font-semibold inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live System Active
                  </span>
                  {kitchenSnooze && (
                    <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Rush Mode Active (+{kitchenSnoozeMinutes}m)
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-[13px] text-[#7A746E] mt-0.5">
                  Executive Chef: <strong className="text-[#1A130E]">Tariq Al-Mansoor</strong> · 18 South William St, Dublin 2
                </p>
              </div>
            </div>

            {/* Quick Actions (Audio, Rush Mode, Fire Ticket) */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  if (!soundEnabled) playChime();
                  setSoundEnabled(!soundEnabled);
                  showToast(soundEnabled ? 'Chime muted' : 'Kitchen Chime sound enabled');
                }}
                className={`h-10 px-3.5 rounded-xl text-xs sm:text-[12.5px] font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
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

              <button
                onClick={() => {
                  dispatch(toggleKitchenSnooze(20));
                  showToast(kitchenSnooze ? 'Rush mode deactivated' : 'Rush Mode (+20m delay) activated for dines');
                }}
                className={`h-10 px-4 rounded-xl text-xs sm:text-[12.5px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  kitchenSnooze
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-white border border-[#EAE5DF] text-[#1A130E] hover:border-[#F15A24]'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{kitchenSnooze ? 'Exit Rush Mode' : 'Rush Mode (+20m)'}</span>
              </button>

              <button
                onClick={() => setIsManualModalOpen(true)}
                className="h-10 px-4 rounded-xl text-xs sm:text-[12.5px] font-semibold bg-[#F15A24] hover:bg-[#D94E1C] text-white shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Fire Manual Ticket</span>
              </button>
            </div>
          </div>

          {/* Row 2: Standard Segmented Tab Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex bg-[#F4EFEA] p-1 rounded-xl border border-[#EAE5DF]">
              <button
                onClick={() => setSelectedTab('kds')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedTab === 'kds'
                    ? 'bg-white text-[#F15A24] shadow-xs'
                    : 'text-[#666059] hover:text-[#1A130E]'
                }`}
              >
                <span>KDS Pipeline</span>
                <span className={`px-2 py-0.2 rounded-full text-[11px] font-bold ${selectedTab === 'kds' ? 'bg-orange-50 text-[#F15A24]' : 'bg-[#EAE5DF] text-[#7A746E]'}`}>
                  {orders.length}
                </span>
              </button>
              <button
                onClick={() => setSelectedTab('menu-86')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedTab === 'menu-86'
                    ? 'bg-white text-[#F15A24] shadow-xs'
                    : 'text-[#666059] hover:text-[#1A130E]'
                }`}
              >
                <span>86 Stock Manager</span>
                {soldOutCount > 0 ? (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {soldOutCount}
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-600 font-bold">All In</span>
                )}
              </button>
              <button
                onClick={() => setSelectedTab('sales')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                  selectedTab === 'sales'
                    ? 'bg-white text-[#F15A24] shadow-xs'
                    : 'text-[#666059] hover:text-[#1A130E]'
                }`}
              >
                Shift Z-Report & Analytics
              </button>
            </div>
          </div>

          {/* Row 3 (KDS Active): Secondary Filter & Search Toolbar */}
          {selectedTab === 'kds' && (
            <div className="pt-4 border-t border-[#F2EFE9] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-[#9E9790] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search ticket # or diner name..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full h-10 bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]/30 rounded-xl pl-10 pr-8 text-sm outline-none transition-all placeholder:text-[#9E9790]"
                />
                {orderSearchQuery && (
                  <button
                    onClick={() => setOrderSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9E9790] hover:text-[#1A130E]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Station Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-semibold text-[#8C8681] mr-1 shrink-0">Station:</span>
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
                    className={`h-9 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
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
              <div className="h-9 bg-[#FAF8F5] p-1 rounded-xl border border-[#EAE5DF] flex items-center gap-1 shrink-0">
                {[
                  { id: 'all', label: 'All Orders' },
                  { id: 'delivery', label: '🛵 Delivery' },
                  { id: 'collection', label: '🛍 Pickup' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFulfillmentFilter(f.id as FulfillmentFilter)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-[#EFEAE4] shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E23744]" />
                <div>
                  <h3 className="font-bold text-[13px] uppercase tracking-wider text-[#1A130E]">
                    Incoming Tickets
                  </h3>
                  <p className="text-[11px] text-[#7A746E]">New orders to fire</p>
                </div>
              </div>
              <span className="bg-rose-50 text-rose-700 border border-rose-200/70 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                {newOrders.length} Tickets
              </span>
            </div>

            {newOrders.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-[#E5DFD7] rounded-2xl p-6 text-xs text-[#9E9790]">
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
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-[#EFEAE4] shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F15A24]" />
                <div>
                  <h3 className="font-bold text-[13px] uppercase tracking-wider text-[#1A130E]">
                    Cooking / Grilling
                  </h3>
                  <p className="text-[11px] text-[#7A746E]">Active pots & tandoor skewers</p>
                </div>
              </div>
              <span className="bg-orange-50 text-[#F15A24] border border-orange-200/70 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                {preparingOrders.length} Cooking
              </span>
            </div>

            {preparingOrders.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-[#E5DFD7] rounded-2xl p-6 text-xs text-[#9E9790]">
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
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-[#EFEAE4] shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0FA958]" />
                <div>
                  <h3 className="font-bold text-[13px] uppercase tracking-wider text-[#1A130E]">
                    Ready / Out for Delivery
                  </h3>
                  <p className="text-[11px] text-[#7A746E]">Packed in thermal bags</p>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                {readyOrders.length} Ready
              </span>
            </div>

            {readyOrders.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-[#E5DFD7] rounded-2xl p-6 text-xs text-[#9E9790]">
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
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-2xl border border-[#EFEAE4] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#1A130E] tracking-tight">
                  Kitchen Stock &amp; 86 Menu Manager
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF8F5] text-[#55504A] border border-[#EAE5DF]">
                  Live Menu Sync
                </span>
              </div>
              <p className="text-[13px] text-[#7A746E] mt-1">
                1-tap toggle to immediately grey out or restore dishes across digital menus, POS, and customer orders.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {menuItems.length - soldOutCount} Active In Stock
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {soldOutCount} 86&apos;d Sold Out
              </span>
              {soldOutCount > 0 && (
                <button
                  onClick={() => {
                    menuItems
                      .filter((item) => !item.isAvailable)
                      .forEach((item) => dispatch(toggleItemAvailability(item.id)));
                    showToast('All menu items successfully restocked!');
                  }}
                  className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restock All ({soldOutCount})</span>
                </button>
              )}
            </div>
          </div>

          {/* Search, Filter Bar & View Controls */}
          <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-[#EFEAE4] shadow-xs space-y-3.5">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#F15A24] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search dish by name, ingredients, category, or ID..."
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  className="w-full h-11 bg-[#FAF8F5] border border-[#EAE5DF] focus:bg-white focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]/30 rounded-xl pl-10 pr-9 text-sm outline-none transition-colors"
                />
                {stockSearchQuery && (
                  <button
                    onClick={() => setStockSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9790] hover:text-[#1A130E] p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter Tabs & View Mode Switcher */}
              <div className="flex items-center gap-2.5 shrink-0">
                {/* Stock Status Filter */}
                <div className="flex items-center p-1 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setStockStatusFilter('all')}
                    className={`h-9 px-3 rounded-lg transition-all cursor-pointer ${
                      stockStatusFilter === 'all'
                        ? 'bg-white text-[#1A130E] shadow-2xs font-bold'
                        : 'text-[#7A746E] hover:text-[#1A130E]'
                    }`}
                  >
                    All ({menuItems.length})
                  </button>
                  <button
                    onClick={() => setStockStatusFilter('in_stock')}
                    className={`h-9 px-3 rounded-lg transition-all cursor-pointer ${
                      stockStatusFilter === 'in_stock'
                        ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                        : 'text-[#7A746E] hover:text-emerald-700'
                    }`}
                  >
                    In Stock ({menuItems.length - soldOutCount})
                  </button>
                  <button
                    onClick={() => setStockStatusFilter('sold_out')}
                    className={`h-9 px-3 rounded-lg transition-all cursor-pointer ${
                      stockStatusFilter === 'sold_out'
                        ? 'bg-white text-rose-700 shadow-2xs font-bold'
                        : 'text-[#7A746E] hover:text-rose-700'
                    }`}
                  >
                    86&apos;d ({soldOutCount})
                  </button>
                </div>

                {/* View Mode (Grid vs Table) */}
                <div className="hidden sm:flex items-center p-1 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl">
                  <button
                    onClick={() => setStockViewMode('grid')}
                    title="Cards Grid View"
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      stockViewMode === 'grid'
                        ? 'bg-white text-[#F15A24] shadow-2xs'
                        : 'text-[#7A746E] hover:text-[#1A130E]'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setStockViewMode('table')}
                    title="Compact Table View"
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      stockViewMode === 'table'
                        ? 'bg-white text-[#F15A24] shadow-2xs'
                        : 'text-[#7A746E] hover:text-[#1A130E]'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none pt-1 border-t border-[#F2EFE9]">
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
                  className={`h-9 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    stockCategoryFilter === c.id
                      ? 'bg-[#F15A24] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#55504A] hover:bg-white hover:text-[#1A130E] border border-[#EAE5DF]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Empty Search / Filter State */}
          {filteredStockItems.length === 0 && (
            <div className="text-center py-16 bg-white border border-dashed border-[#E5DFD7] rounded-2xl p-8 space-y-3">
              <Search className="w-10 h-10 text-[#CCC5BC] mx-auto mb-1" />
              <h3 className="text-base font-bold text-[#1A130E]">No dishes found</h3>
              <p className="text-xs text-[#7A746E] max-w-sm mx-auto">
                No items match your active search &quot;{stockSearchQuery}&quot; or category filters.
              </p>
              <button
                onClick={() => {
                  setStockSearchQuery('');
                  setStockCategoryFilter('all');
                  setStockStatusFilter('all');
                }}
                className="mt-2 h-9 px-4 rounded-xl bg-[#FAF8F5] border border-[#EAE5DF] text-xs font-semibold text-[#1A130E] hover:bg-white cursor-pointer"
              >
                Reset Search &amp; Filters
              </button>
            </div>
          )}

          {/* ============ VIEW 1: STANDARD VISUAL FOOD CARDS (GRID) ============ */}
          {filteredStockItems.length > 0 && stockViewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStockItems.map((dish) => {
                const inStock = dish.isAvailable;

                return (
                  <div
                    key={dish.id}
                    className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                      inStock
                        ? 'border-[#EAE5DF] hover:border-[#D49B37]/60'
                        : 'bg-[#FFFBFB] border-rose-200/90 shadow-2xs'
                    }`}
                  >
                    {/* Top Image Banner with Badges */}
                    <div className="relative h-48 w-full overflow-hidden bg-[#FAF8F5]">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                          inStock ? '' : 'grayscale-[35%] opacity-85'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/15 uppercase tracking-wide">
                          {dish.categoryLabel}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-xs flex items-center gap-1.5 ${
                            inStock
                              ? 'bg-emerald-500/90 text-white'
                              : 'bg-rose-600/95 text-white'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              inStock ? 'bg-white animate-pulse' : 'bg-white'
                            }`}
                          />
                          {inStock ? 'In Stock' : '86’d Sold Out'}
                        </span>
                      </div>

                      {/* Bottom on Image: Price & Prep Time */}
                      <div className="absolute bottom-3 inset-x-3 flex items-end justify-between gap-2 pointer-events-none">
                        <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-black/5 flex items-baseline gap-0.5">
                          <span className="text-xs font-semibold text-[#B84A22]">€</span>
                          <span className="text-base font-extrabold text-[#1A130E] leading-none">
                            {dish.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="bg-black/60 backdrop-blur-md text-white/95 px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 border border-white/10">
                          <Clock className="w-3 h-3 text-[#FBA138]" />
                          <span>{dish.prepTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={`font-bold text-[15px] leading-snug tracking-tight line-clamp-1 ${
                              inStock ? 'text-[#1A130E]' : 'text-rose-950/70 line-through'
                            }`}
                          >
                            {dish.name}
                          </h4>
                          {dish.isBestSeller && (
                            <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              ★ Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#7A746E] line-clamp-2 leading-relaxed min-h-[32px]">
                          {dish.description}
                        </p>
                      </div>

                      {/* Dietary & Allergen Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {dish.dietary?.map((diet) => (
                          <span
                            key={diet}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#FAF8F5] text-[#55504A] border border-[#EAE5DF] capitalize"
                          >
                            {diet}
                          </span>
                        ))}
                        {dish.allergens?.map((allg) => (
                          <span
                            key={allg}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-orange-50/70 text-orange-800 border border-orange-200/60"
                          >
                            {allg}
                          </span>
                        ))}
                      </div>

                      {/* Action Button: 86 Toggle */}
                      <div className="pt-2 border-t border-[#F2EFE9]">
                        <button
                          onClick={() => {
                            dispatch(toggleItemAvailability(dish.id));
                            showToast(
                              inStock
                                ? `86 Alert: "${dish.name}" marked as Sold Out`
                                : `Restocked: "${dish.name}" marked as Available`
                            );
                          }}
                          className={`w-full h-11 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-[0.98] ${
                            inStock
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                              : 'bg-rose-600 text-white hover:bg-emerald-600 border border-rose-600'
                          }`}
                        >
                          {inStock ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-600" />
                              <span>Active on Menu · Tap to 86</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4 text-white" />
                              <span>86&apos;d Sold Out · Tap to Restock</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ============ VIEW 2: COMPACT OPERATIONAL TABLE ============ */}
          {filteredStockItems.length > 0 && stockViewMode === 'table' && (
            <div className="bg-white rounded-2xl border border-[#EAE5DF] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#EAE5DF] text-[#7A746E] uppercase font-bold text-[11px] tracking-wider">
                      <th className="py-3.5 px-4">Dish &amp; Details</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Prep Pacing</th>
                      <th className="py-3.5 px-4">Stock Status</th>
                      <th className="py-3.5 px-4 text-right">Instant 86 Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2EFE9]">
                    {filteredStockItems.map((dish) => {
                      const inStock = dish.isAvailable;

                      return (
                        <tr
                          key={dish.id}
                          className={`hover:bg-[#FCFAF7] transition-colors ${
                            inStock ? '' : 'bg-[#FFFBFB]'
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className={`w-12 h-12 rounded-xl object-cover border shrink-0 ${
                                  inStock
                                    ? 'border-[#EAE5DF]'
                                    : 'border-rose-200 grayscale-[40%] opacity-80'
                                }`}
                              />
                              <div>
                                <h4
                                  className={`font-semibold text-sm ${
                                    inStock
                                      ? 'text-[#1A130E]'
                                      : 'text-rose-950/70 line-through'
                                  }`}
                                >
                                  {dish.name}
                                </h4>
                                <p className="text-[11px] text-[#7A746E] line-clamp-1 max-w-md">
                                  {dish.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#FAF8F5] text-[#55504A] border border-[#EAE5DF]">
                              {dish.categoryLabel}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#1A130E] text-sm">
                            €{dish.price.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 text-[#7A746E]">
                            <div className="flex items-center gap-1 font-medium">
                              <Clock className="w-3.5 h-3.5 text-[#F15A24]" />
                              <span>{dish.prepTime}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                inStock
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  inStock ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                              />
                              {inStock ? 'In Stock' : '86’d Sold Out'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                dispatch(toggleItemAvailability(dish.id));
                                showToast(
                                  inStock
                                    ? `86 Alert: "${dish.name}" marked as Sold Out`
                                    : `Restocked: "${dish.name}" marked as Available`
                                );
                              }}
                              className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 ${
                                inStock
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                                  : 'bg-rose-600 text-white hover:bg-emerald-600 border border-rose-600'
                              }`}
                            >
                              {inStock ? '✓ In Stock' : '✕ 86 Sold Out'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: SHIFT Z-REPORT & KITCHEN ANALYTICS ================= */}
      {selectedTab === 'sales' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EFEAE4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              className="h-10 px-4 rounded-xl bg-white border border-[#EAE5DF] hover:border-[#1A130E] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>Print Shift Report</span>
            </button>
          </div>

          {/* Top 3 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#EFEAE4] shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A746E] block">
                Shift Gross Revenue
              </span>
              <div className="text-3xl font-extrabold text-[#F15A24]">
                €{totalRevenue.toFixed(2)}
              </div>
              <span className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" /> Live Kitchen Orders Total
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EFEAE4] shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A746E] block">
                Orders Volume
              </span>
              <div className="text-3xl font-extrabold text-[#1A130E]">
                {orders.length} Tickets
              </div>
              <span className="text-xs text-[#7A746E] block">
                {deliveryCount} Delivery ({Math.round((deliveryCount / (orders.length || 1)) * 100)}%) · {collectionCount} Counter Pickup
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EFEAE4] shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A746E] block">
                Average Prep Time
              </span>
              <div className="text-3xl font-extrabold text-emerald-600">
                17.4 Mins
              </div>
              <span className="text-xs text-[#7A746E] block">
                Target: 20 mins · 96.8% On-Time Pacing
              </span>
            </div>
          </div>

          {/* Station Breakdown & Shift Staffing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#EFEAE4] shadow-xs space-y-4">
              <h3 className="font-bold text-[15px] text-[#1A130E] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#F15A24]" />
                <span>Station Output Breakdown</span>
              </h3>
              <div className="space-y-1 text-sm divide-y divide-[#F2EFE9]">
                <div className="flex items-center justify-between py-3">
                  <span className="font-medium text-[#55504A]">🥘 Karahi & Curries Station</span>
                  <span className="font-bold text-[#1A130E]">
                    {orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'curries').length} Portions
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="font-medium text-[#55504A]">🍚 Dum Biryani & Rice Station</span>
                  <span className="font-bold text-[#1A130E]">
                    {orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'biryani').length} Portions
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="font-medium text-[#55504A]">🍢 Clay Oven Tandoor Grills</span>
                  <span className="font-bold text-[#1A130E]">
                    {orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'grill').length} Portions
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="font-medium text-[#55504A]">🫓 Naan & Bread Bakery</span>
                  <span className="font-bold text-[#1A130E]">
                    {orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'breads').length} Breads
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EFEAE4] shadow-xs space-y-4">
              <h3 className="font-bold text-[15px] text-[#1A130E] flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-[#F15A24]" />
                <span>Active Shift Staff & Stations</span>
              </h3>
              <div className="space-y-1 text-sm divide-y divide-[#F2EFE9]">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-bold text-[#1A130E] block">Chef Tariq Al-Mansoor</span>
                    <span className="text-xs text-[#7A746E]">Executive Head Chef · Expediter</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    On Duty
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-bold text-[#1A130E] block">Sous Chef Imran Malik</span>
                    <span className="text-xs text-[#7A746E]">Karahi & Slow-Braised Curries</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    On Duty
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-bold text-[#1A130E] block">Master Tandoor Ustad Javed</span>
                    <span className="text-xs text-[#7A746E]">Clay Oven Grills & Dum Handi</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    On Duty
                  </span>
                </div>
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

  // Urgency Timer Pacing
  const isDelayed = elapsedMinutes >= 25;
  const isWarning = elapsedMinutes >= 15 && elapsedMinutes < 25;
  const totalItemCount = order.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="bg-white rounded-2xl border border-[#EFEAE4] hover:border-[#DFD7CE] shadow-[0_1px_3px_rgba(26,19,14,0.04)] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      {/* Top Header: Order Number, Type, Elapsed Timer & Slip Action */}
      <div className="px-4.5 py-3.5 bg-[#FAF8F5] border-b border-[#EFEAE4] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-[15px] text-[#1A130E] tracking-tight">
            #{order.orderNumber}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 ${
              isDelivery
                ? 'bg-[#FFF4EC] text-[#F15A24] border border-[#F15A24]/20'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
            }`}
          >
            {isDelivery ? <Bike className="w-3 h-3" /> : <Store className="w-3 h-3" />}
            <span>{isDelivery ? 'Delivery' : 'Pickup'}</span>
          </span>
        </div>

        {/* Live Elapsed Badge & Slip Inspector Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
              isDelayed
                ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
                : isWarning
                ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                : 'bg-neutral-100 text-[#666059] border border-neutral-200/60'
            }`}
            title="Elapsed cooking & prep time"
          >
            <Clock className="w-3 h-3" />
            <span>{elapsedMinutes}m</span>
          </span>

          <button
            onClick={onPrint}
            title="View Full Ticket Details & Slip"
            className="w-7.5 h-7.5 rounded-lg bg-white border border-[#EAE5DF] hover:border-[#1A130E] text-[#666059] hover:text-[#1A130E] flex items-center justify-center transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Diner & Count Row (Clutter-free: phone & price moved to details slip) */}
      <div className="px-4.5 py-2.5 border-b border-[#F4EFEA] flex items-center justify-between text-xs text-[#7A746E] bg-white">
        <span className="font-medium text-[#1A130E] truncate">{order.customerName}</span>
        <span className="shrink-0 text-[11.5px] font-medium">
          {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Itemized Order Content (Clean Chef-Focused Layout) */}
      <div className="p-4.5 space-y-3.5 flex-1">
        {order.items.map((item, idx) => {
          const hasInstruction =
            item.specialInstructions &&
            item.specialInstructions.trim().toLowerCase() !== order.specialNotes?.trim().toLowerCase();

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-start gap-2.5">
                <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] rounded-md bg-[#FAF8F5] border border-[#EFEAE4] text-[12px] font-bold text-[#F15A24] shrink-0 mt-0.5">
                  {item.quantity}×
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[13.5px] font-semibold text-[#1A130E] leading-snug">
                    {item.dish.name}
                  </h4>

                  {/* Modifiers List */}
                  {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                    <div className="mt-0.5 space-y-0.5">
                      {item.selectedModifiers.map((mod, mIdx) => (
                        <p key={mIdx} className="text-[11.5px] text-[#7A746E] leading-tight">
                          • {mod.optionName}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Special Dietary / Culinary Instruction */}
                  {hasInstruction && (
                    <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50/80 border border-amber-200/70 text-amber-900 text-[11px] font-medium leading-tight">
                      <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{item.specialInstructions}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Delivery / Packaging Special Note (Muted 1-line preview, full note in modal) */}
        {order.specialNotes && (
          <div
            onClick={onPrint}
            title="Click to view full ticket details"
            className="mt-2 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EFEAE4] text-[11.5px] text-[#55504A] flex items-start gap-2 cursor-pointer hover:bg-[#F5EFE8] transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#9E9790] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-[#1A130E]">Note: </span>
              <span className="line-clamp-1">{order.specialNotes}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Forward Action & Accidental Recall */}
      <div className="p-3.5 bg-[#FAF8F5] border-t border-[#EFEAE4] flex items-center gap-2">
        {order.status === 'new' && (
          <button
            onClick={() => onStatusChange('preparing')}
            className="flex-1 h-10.5 rounded-xl font-semibold text-[13px] bg-[#F15A24] hover:bg-[#D94E1C] text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Flame className="w-4 h-4" />
            <span>Fire Ticket (Start Cooking)</span>
          </button>
        )}

        {order.status === 'preparing' && (
          <>
            <button
              onClick={() => onStatusChange('ready')}
              className="flex-1 h-10.5 rounded-xl font-semibold text-[13px] bg-[#0FA958] hover:bg-[#0D914B] text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Ready for Pickup</span>
            </button>
            <button
              onClick={() => onStatusChange('new')}
              title="Recall to Incoming Tickets"
              className="w-10.5 h-10.5 rounded-xl bg-white border border-[#EAE5DF] hover:border-[#1A130E] text-[#7A746E] hover:text-[#1A130E] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {order.status === 'ready' && (
          <>
            <button
              onClick={() => onStatusChange('completed')}
              className="flex-1 h-10.5 rounded-xl font-semibold text-[13px] bg-[#1A130E] hover:bg-black text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <CheckCheck className="w-4 h-4 text-[#FFA940]" />
              <span>Handover & Complete</span>
            </button>
            <button
              onClick={() => onStatusChange('preparing')}
              title="Return to Cooking"
              className="w-10.5 h-10.5 rounded-xl bg-white border border-[#EAE5DF] hover:border-[#1A130E] text-[#7A746E] hover:text-[#1A130E] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
