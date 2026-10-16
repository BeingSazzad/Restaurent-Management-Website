import React, { useState, useEffect } from 'react';
import { Search, X, UtensilsCrossed, Flame, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateOrderStatus, syncOrdersFromStorage } from '../../store/slices/orderSlice';
import { KdsOrder, OrderStatus, StationType, FulfillmentType } from '../../types/common.types';
import { KdsTicketCard } from './KdsTicketCard';
import { TicketSlipModal } from './TicketSlipModal';

export function KdsPipeline() {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.orders);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'amber_spice_orders') {
        dispatch(syncOrdersFromStorage());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState('');
  const [stationFilter, setStationFilter] = useState<StationType>('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<FulfillmentType | 'all'>('all');
  const [activeSlipOrder, setActiveSlipOrder] = useState<KdsOrder | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (order.status === 'completed' || order.status === 'cancelled') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      if (!matchNum && !matchName) return false;
    }

    // Fulfillment
    if (fulfillmentFilter !== 'all' && order.fulfillmentType !== fulfillmentFilter) {
      return false;
    }

    // Station
    if (stationFilter !== 'all') {
      const hasItem = order.items.some((i) => i.dish.category === stationFilter);
      if (!hasItem) return false;
    }

    return true;
  });

  const newOrders = filteredOrders.filter((o) => o.status === 'new');
  const preparingOrders = filteredOrders.filter((o) => o.status === 'preparing');
  const readyOrders = filteredOrders.filter((o) => o.status === 'ready');

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  return (
    <div className="space-y-4">
      {/* Standard Unified Toolbar Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Field (Equal h-10 height, spacious pl-11 icon clearance) */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search ticket # or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/10 rounded-xl pl-11 pr-10 text-[13.5px] font-medium text-stone-900 placeholder:text-stone-400 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls: Stations & Order Type (Equal h-10 height) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Station Segmented Control */}
          <div className="h-10 flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 overflow-x-auto overflow-y-hidden scrollbar-none">
            {[
              { id: 'all', label: 'All Stations' },
              { id: 'biryani', label: 'Biryani' },
              { id: 'curries', label: 'Curries' },
              { id: 'grill', label: 'Grill' },
              { id: 'breads', label: 'Breads' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStationFilter(st.id as StationType)}
                className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  stationFilter === st.id
                    ? 'bg-white text-stone-900 font-semibold shadow-xs border border-stone-200/60'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Fulfillment Segmented Control */}
          <div className="h-10 flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60">
            {[
              { id: 'all', label: 'All' },
              { id: 'delivery', label: 'Delivery' },
              { id: 'collection', label: 'Pickup' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFulfillmentFilter(f.id as FulfillmentType | 'all')}
                className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  fulfillmentFilter === f.id
                    ? 'bg-white text-stone-900 font-semibold shadow-xs border border-stone-200/60'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Pipeline Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* COLUMN 1: INCOMING */}
        <div className="space-y-3">
          <div className="bg-white border border-stone-200/90 rounded-xl px-3.5 py-2.5 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-100" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                Incoming
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60">
                {newOrders.length}
              </span>
            </div>
            <span className="text-[11px] font-medium text-stone-400">To Prepare</span>
          </div>

          {newOrders.length === 0 ? (
            <div className="text-center py-12 px-4 text-stone-400 bg-white/60 rounded-xl border border-dashed border-stone-200">
              <UtensilsCrossed className="w-6 h-6 text-stone-300 mx-auto mb-2" />
              <p className="font-medium text-xs text-stone-600">No Incoming Orders</p>
              <p className="text-[11px] text-stone-400 mt-0.5">New orders will appear here.</p>
            </div>
          ) : (
            newOrders.map((order) => (
              <KdsTicketCard
                key={order.id}
                order={order}
                onStatusChange={(status) => handleStatusChange(order.id, status)}
                onViewSlip={() => setActiveSlipOrder(order)}
              />
            ))
          )}
        </div>

        {/* COLUMN 2: IN PROGRESS */}
        <div className="space-y-3">
          <div className="bg-white border border-stone-200/90 rounded-xl px-3.5 py-2.5 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F15A24] ring-4 ring-orange-100" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                In Progress
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#F15A24] border border-orange-200/60">
                {preparingOrders.length}
              </span>
            </div>
            <span className="text-[11px] font-medium text-stone-400">Cooking</span>
          </div>

          {preparingOrders.length === 0 ? (
            <div className="text-center py-12 px-4 text-stone-400 bg-white/60 rounded-xl border border-dashed border-stone-200">
              <Flame className="w-6 h-6 text-stone-300 mx-auto mb-2" />
              <p className="font-medium text-xs text-stone-600">Kitchen Clear</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Orders being prepared will show here.</p>
            </div>
          ) : (
            preparingOrders.map((order) => (
              <KdsTicketCard
                key={order.id}
                order={order}
                onStatusChange={(status) => handleStatusChange(order.id, status)}
                onViewSlip={() => setActiveSlipOrder(order)}
              />
            ))
          )}
        </div>

        {/* COLUMN 3: READY */}
        <div className="space-y-3">
          <div className="bg-white border border-stone-200/90 rounded-xl px-3.5 py-2.5 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                Ready
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                {readyOrders.length}
              </span>
            </div>
            <span className="text-[11px] font-medium text-stone-400">For Handover</span>
          </div>

          {readyOrders.length === 0 ? (
            <div className="text-center py-12 px-4 text-stone-400 bg-white/60 rounded-xl border border-dashed border-stone-200">
              <CheckCircle2 className="w-6 h-6 text-stone-300 mx-auto mb-2" />
              <p className="font-medium text-xs text-stone-600">No Ready Orders</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Orders ready for handover will show here.</p>
            </div>
          ) : (
            readyOrders.map((order) => (
              <KdsTicketCard
                key={order.id}
                order={order}
                onStatusChange={(status) => handleStatusChange(order.id, status)}
                onViewSlip={() => setActiveSlipOrder(order)}
              />
            ))
          )}
        </div>
      </div>

      {/* Ticket Slip & Details Modal */}
      <TicketSlipModal order={activeSlipOrder} onClose={() => setActiveSlipOrder(null)} />
    </div>
  );
}
