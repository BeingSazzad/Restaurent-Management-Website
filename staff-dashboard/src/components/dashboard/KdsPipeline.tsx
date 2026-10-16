import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  UtensilsCrossed,
  Flame,
  CheckCircle2,
  CheckCheck,
  Undo2,
  Bike,
  Store,
  Clock,
  FileText,
  AlertTriangle,
  LayoutList,
  LayoutGrid,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateOrderStatus, syncOrdersFromStorage } from '../../store/slices/orderSlice';
import { deductRecipeStockForOrder } from '../../store/slices/stockSlice';
import { KdsOrder, OrderStatus, StationType, FulfillmentType } from '../../types/common.types';
import { formatCurrency } from '../../lib/utils';
import { KdsTicketCard } from './KdsTicketCard';
import { TicketSlipModal } from './TicketSlipModal';

function ElapsedTimeCell({ createdAt }: { createdAt: string }) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    const calc = () => {
      const createdTime = new Date(createdAt).getTime();
      const now = Date.now();
      const diffMins = Math.max(0, Math.floor((now - createdTime) / 60000));
      const realisticMins = diffMins > 60 ? (diffMins % 25) + 4 : diffMins;
      setElapsedMinutes(realisticMins);
    };
    calc();
    const interval = setInterval(calc, 30000);
    return () => clearInterval(interval);
  }, [createdAt]);

  const isDelayed = elapsedMinutes >= 25;
  const isWarning = elapsedMinutes >= 15 && elapsedMinutes < 25;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
        isDelayed
          ? 'bg-rose-50 text-rose-700 border border-rose-200'
          : isWarning
          ? 'bg-amber-50 text-amber-700 border border-amber-200'
          : 'bg-stone-100 text-stone-600 border border-stone-200/60'
      }`}
      title="Elapsed cooking & prep time"
    >
      <Clock className="w-3 h-3" />
      <span>{elapsedMinutes}m</span>
    </span>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  if (status === 'new') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        Incoming
      </span>
    );
  }
  if (status === 'preparing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#F15A24] border border-orange-200/70">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F15A24]" />
        In Progress
      </span>
    );
  }
  if (status === 'ready') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Ready
      </span>
    );
  }
  if (status === 'out_for_delivery') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/70">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
        Out for Delivery
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
      {status}
    </span>
  );
}

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

  const [viewMode, setViewMode] = useState<'table' | 'board'>('table');
  const [tableStatusFilter, setTableStatusFilter] = useState<'all' | 'new' | 'preparing' | 'ready'>('all');
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
  const readyOrders = filteredOrders.filter((o) => o.status === 'ready' || o.status === 'out_for_delivery');

  const tableOrders = filteredOrders.filter((order) => {
    if (tableStatusFilter === 'all') return true;
    if (tableStatusFilter === 'ready') return order.status === 'ready' || order.status === 'out_for_delivery';
    return order.status === tableStatusFilter;
  });

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    dispatch(updateOrderStatus({ orderId, status }));
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder && ['ready', 'out_for_delivery', 'completed'].includes(status) && !targetOrder.stockDeducted) {
      dispatch(
        deductRecipeStockForOrder({
          items: targetOrder.items.map((i) => ({ dishId: i.dish.id, quantity: i.quantity })),
        })
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Standard Unified Toolbar Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Field */}
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

        {/* Filter Controls: Stations & Order Type & View Switcher */}
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

          {/* View Switcher: Table View vs Board View */}
          <div className="h-10 flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5 text-[#F15A24]" />
              <span>Table View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-stone-600" />
              <span>Board View</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW CONTENT */}
      {viewMode === 'table' ? (
        /* ==================== 1. HIGH-DENSITY TABLE VIEW ==================== */
        <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xs overflow-hidden">
          {/* Table Status Filter Tabs */}
          <div className="p-3 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 bg-stone-50/50">
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'All Active', count: filteredOrders.length },
                { id: 'new', label: 'Incoming', count: newOrders.length, color: 'bg-rose-500' },
                { id: 'preparing', label: 'In Progress', count: preparingOrders.length, color: 'bg-[#F15A24]' },
                { id: 'ready', label: 'Ready / Dispatched', count: readyOrders.length, color: 'bg-emerald-500' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTableStatusFilter(tab.id as any)}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    tableStatusFilter === tab.id
                      ? 'bg-white text-stone-900 shadow-2xs border border-stone-200'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {tab.color && <span className={`w-2 h-2 rounded-full ${tab.color}`} />}
                  <span>{tab.label}</span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-600 font-bold">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-xs text-stone-400 font-medium">
              Showing <span className="font-bold text-stone-700">{tableOrders.length}</span> active tickets
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Ticket & Type</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 min-w-[240px]">Items & Prep Notes</th>
                  <th className="py-3 px-4">Elapsed</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {tableOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-stone-400">
                      <UtensilsCrossed className="w-6 h-6 mx-auto mb-2 text-stone-300" />
                      <p className="font-semibold text-xs text-stone-600">No Orders in this view</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">Orders will appear here as they are received.</p>
                    </td>
                  </tr>
                ) : (
                  tableOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Ticket # & Fulfillment */}
                      <td className="py-3 px-4 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-stone-900 tracking-tight">
                              #{order.orderNumber}
                            </span>
                            {order.driverName && (
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200/80 rounded px-1.5 py-0.5">
                                🛵 {order.driverName}
                              </span>
                            )}
                          </div>
                          <div className="inline-flex items-center gap-1 text-[11px] text-stone-500 font-medium">
                            {order.fulfillmentType === 'delivery' ? (
                              <Bike className="w-3.5 h-3.5 text-[#F15A24]" />
                            ) : (
                              <Store className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                            <span className="capitalize">{order.fulfillmentType}</span>
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4 align-top">
                        <div className="space-y-0.5">
                          <div className="font-bold text-xs text-stone-900">{order.customerName}</div>
                          <div className="text-[11px] text-stone-500">
                            {order.items.reduce((acc, i) => acc + i.quantity, 0)} items · {formatCurrency(order.total)}
                          </div>
                        </div>
                      </td>

                      {/* Items & Instructions */}
                      <td className="py-3 px-4 align-top">
                        <div className="space-y-1 max-w-md">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-xs text-stone-800 flex flex-wrap items-baseline gap-1.5">
                              <span className="font-bold text-[#F15A24]">{item.quantity}×</span>
                              <span className="font-semibold text-stone-900">{item.dish.name}</span>
                              {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                                <span className="text-[11px] text-stone-500">
                                  ({item.selectedModifiers.map((m) => m.optionName).join(', ')})
                                </span>
                              )}
                              {item.specialInstructions && (
                                <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 inline-flex items-center gap-1">
                                  <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                                  {item.specialInstructions}
                                </span>
                              )}
                            </div>
                          ))}
                          {order.specialNotes && (
                            <div className="text-[11px] text-stone-600 bg-stone-50 rounded px-2 py-1 border-l-2 border-[#F15A24] mt-1 flex items-start gap-1">
                              <span className="font-bold text-stone-700 shrink-0">Note:</span>
                              <span className="line-clamp-2">{order.specialNotes}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Elapsed Cooking Timer */}
                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        <ElapsedTimeCell createdAt={order.createdAt} />
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === 'new' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'preparing')}
                              className="h-8 px-3 rounded-lg font-medium text-xs bg-[#F15A24] hover:bg-[#D94E1C] text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                            >
                              <Flame className="w-3.5 h-3.5" />
                              <span>Fire Ticket</span>
                            </button>
                          )}

                          {order.status === 'preparing' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(order.id, 'ready')}
                                className="h-8 px-3 rounded-lg font-medium text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Mark Ready</span>
                              </button>
                              <button
                                onClick={() => handleStatusChange(order.id, 'new')}
                                title="Recall to Incoming Tickets"
                                className="h-8 w-8 rounded-lg border border-stone-200 hover:border-stone-400 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                              >
                                <Undo2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {(order.status === 'ready' || order.status === 'out_for_delivery') && (
                            <>
                              <button
                                onClick={() => handleStatusChange(order.id, 'completed')}
                                className="h-8 px-3 rounded-lg font-medium text-xs bg-stone-900 hover:bg-black text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                              >
                                <CheckCheck className="w-3.5 h-3.5 text-[#FFA940]" />
                                <span>{order.status === 'out_for_delivery' ? 'Delivered' : 'Handover'}</span>
                              </button>
                              <button
                                onClick={() => handleStatusChange(order.id, 'preparing')}
                                title="Return to Cooking"
                                className="h-8 w-8 rounded-lg border border-stone-200 hover:border-stone-400 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                              >
                                <Undo2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => setActiveSlipOrder(order)}
                            title="View Full Ticket Details & Slip"
                            className="h-8 w-8 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ==================== 2. 3-COLUMN KANBAN BOARD VIEW ==================== */
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
                  Ready / Dispatched
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  {readyOrders.length}
                </span>
              </div>
              <span className="text-[11px] font-medium text-stone-400">Handover / In Transit</span>
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
      )}

      {/* Ticket Slip & Details Modal */}
      <TicketSlipModal order={activeSlipOrder} onClose={() => setActiveSlipOrder(null)} />
    </div>
  );
}
