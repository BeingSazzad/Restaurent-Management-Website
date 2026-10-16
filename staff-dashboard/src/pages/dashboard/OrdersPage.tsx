import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateOrderStatus } from '../../store/slices/orderSlice';
import { KdsOrder, OrderStatus } from '../../types/common.types';
import {
  Search,
  CheckCircle2,
  Clock,
  Bike,
  Store,
  Printer,
  AlertCircle,
  TrendingUp,
  Phone,
} from 'lucide-react';
import { TicketSlipModal } from '../../components/dashboard/TicketSlipModal';

export function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.orders);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<'all' | 'delivery' | 'collection'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlipOrder, setActiveSlipOrder] = useState<KdsOrder | null>(null);

  // Financial Metrics
  const totalRevenue = orders.reduce((sum: number, o: KdsOrder) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const completedOrders = orders.filter((o: KdsOrder) => o.status === 'completed');
  const activeOrders = orders.filter((o: KdsOrder) => ['new', 'preparing', 'ready'].includes(o.status));

  const filteredOrders = orders.filter((order: KdsOrder) => {
    const matchStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchFulfillment = fulfillmentFilter === 'all' || order.fulfillmentType === fulfillmentFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      (order.customerPhone && order.customerPhone.includes(q)) ||
      (order.deliveryAddress && order.deliveryAddress.toLowerCase().includes(q)) ||
      (order.eircode && order.eircode.toLowerCase().includes(q));

    return matchStatus && matchFulfillment && matchSearch;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20">New Order</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-orange-500/10 text-[#F15A24] border border-orange-500/20">Kitchen Prep</span>;
      case 'ready':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20">Ready</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/20">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-stone-500/10 text-stone-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1C1612] border border-stone-800/90 rounded-2xl p-4.5 shadow-xs text-white">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <span className="p-2 rounded-xl bg-[#F15A24]/10 text-[#F15A24] font-bold">€</span>
          </div>
          <div className="text-2xl font-extrabold">€{totalRevenue.toFixed(2)}</div>
          <div className="text-[11px] text-stone-400 mt-1">Confirmed orders volume</div>
        </div>

        <div className="bg-[#1C1612] border border-stone-800/90 rounded-2xl p-4.5 shadow-xs text-white">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Active Pipeline</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-blue-400">{activeOrders.length}</div>
          <div className="text-[11px] text-stone-400 mt-1">Live in prep or handover</div>
        </div>

        <div className="bg-[#1C1612] border border-stone-800/90 rounded-2xl p-4.5 shadow-xs text-white">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Tickets</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{completedOrders.length}</div>
          <div className="text-[11px] text-stone-400 mt-1">Successfully fulfilled</div>
        </div>

        <div className="bg-[#1C1612] border border-stone-800/90 rounded-2xl p-4.5 shadow-xs text-white">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Average Ticket</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold">
            €{orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Average order value (AOV)</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#1C1612] border border-stone-800/90 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-white">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Order #, customer name, phone, Eircode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-stone-900 border border-stone-750 focus:border-[#F15A24] rounded-xl pl-10 pr-4 text-xs text-white placeholder:text-stone-400 outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'new', label: 'New' },
            { id: 'preparing', label: 'Prep' },
            { id: 'ready', label: 'Ready' },
            { id: 'completed', label: 'Done' },
            { id: 'cancelled', label: 'Cancel' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors border ${
                statusFilter === tab.id
                  ? 'bg-[#F15A24] text-white border-[#F15A24]'
                  : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Fulfillment */}
        <div className="flex items-center gap-1.5 shrink-0">
          {(['all', 'delivery', 'collection'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFulfillmentFilter(type)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium capitalize cursor-pointer border ${
                fulfillmentFilter === type
                  ? 'bg-[#F15A24]/20 text-[#F15A24] border-[#F15A24]/40 font-bold'
                  : 'bg-stone-900 border-stone-800 text-stone-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#1C1612] border border-stone-800/90 rounded-2xl shadow-xs overflow-hidden text-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-900/80 border-b border-stone-800 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="py-3 px-4">Ticket #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-850 text-xs text-stone-300">
              {filteredOrders.map((order: KdsOrder) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold whitespace-nowrap">
                    <div className="text-[13px] font-extrabold text-[#F15A24]">{order.orderNumber}</div>
                    <div className="text-[10px] text-stone-400 font-normal mt-0.5">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{order.customerName}</div>
                    <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-stone-500" />
                      <span>{order.customerPhone || '+353 (01) 485 9210'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      {order.fulfillmentType === 'delivery' ? (
                        <>
                          <Bike className="w-3.5 h-3.5 text-blue-400" />
                          <span>Delivery</span>
                        </>
                      ) : (
                        <>
                          <Store className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Collection</span>
                        </>
                      )}
                    </div>
                    {order.deliveryAddress && (
                      <div className="text-[10px] text-stone-400 max-w-[170px] truncate mt-0.5" title={order.deliveryAddress}>
                        {order.deliveryAddress}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-stone-300">
                    <div className="line-clamp-1">
                      {order.items.map((i: any) => `${i.quantity}x ${i.dish.name}`).join(', ')}
                    </div>
                    {order.specialNotes && (
                      <div className="text-[10px] text-amber-400 italic mt-0.5">Note: {order.specialNotes}</div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-extrabold text-[13px] text-white whitespace-nowrap">
                    €{order.total.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="h-8 px-2 bg-stone-900 border border-stone-750 text-white rounded-lg text-xs font-semibold outline-none cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="preparing">Prep</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Done</option>
                        <option value="cancelled">Cancel</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setActiveSlipOrder(order)}
                        className="h-8 w-8 rounded-lg border border-stone-750 hover:bg-stone-800 text-stone-300 flex items-center justify-center cursor-pointer transition-colors"
                        title="Print Kitchen Docket / Slip"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center text-stone-400">
            <AlertCircle className="w-8 h-8 text-stone-500 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-white">No orders found</h4>
            <p className="text-xs text-stone-500 mt-1">Try another search keyword or reset filters.</p>
          </div>
        )}
      </div>

      {/* Slip Modal */}
      {activeSlipOrder && (
        <TicketSlipModal order={activeSlipOrder} onClose={() => setActiveSlipOrder(null)} />
      )}
    </div>
  );
}

export default OrdersPage;
