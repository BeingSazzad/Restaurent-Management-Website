import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Eye,
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
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-700">New Order</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-orange-100 text-[#B84A22]">Kitchen Prep</span>;
      case 'ready':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800">Ready</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-stone-100 text-stone-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm text-[#1A130E] flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#B84A22] font-bold flex items-center justify-center text-xs shrink-0">
              €
            </div>
          </div>
          <div className="text-2xl font-extrabold tracking-tight">€{totalRevenue.toFixed(2)}</div>
          <div className="text-[11px] text-stone-500 mt-1">Confirmed orders volume</div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm text-[#1A130E] flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Pipeline</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-600 tracking-tight">{activeOrders.length}</div>
          <div className="text-[11px] text-stone-500 mt-1">Live in prep or handover</div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm text-[#1A130E] flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Tickets</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 tracking-tight">{completedOrders.length}</div>
          <div className="text-[11px] text-stone-500 mt-1">Successfully fulfilled</div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm text-[#1A130E] flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Ticket</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold tracking-tight">
            €{orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Average order value (AOV)</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-stone-800">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Order #, customer name, phone, Eircode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-xl pl-10 pr-4 text-xs text-[#1A130E] placeholder:text-stone-400 outline-none transition-colors"
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
                  ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white border-transparent shadow-xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
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
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer border transition-colors ${
                fulfillmentFilter === type
                  ? 'bg-orange-50 text-[#B84A22] border-orange-200'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3 px-4">Ticket #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {filteredOrders.map((order: KdsOrder) => (
                <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold whitespace-nowrap">
                    <Link
                      to={`/all-orders/${order.id}`}
                      className="text-[13px] font-extrabold text-[#B84A22] hover:underline inline-flex items-center gap-1 group"
                      title="View full order details"
                    >
                      <span>{order.orderNumber}</span>
                      <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#B84A22]" />
                    </Link>
                    <div className="text-[10px] text-stone-400 font-normal mt-0.5">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <Link
                      to={`/all-orders/${order.id}`}
                      className="font-bold text-[#1A130E] hover:text-[#B84A22] transition-colors block"
                    >
                      {order.customerName}
                    </Link>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span>{order.customerPhone || '+353 (01) 485 9210'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-semibold text-[#1A130E]">
                      {order.fulfillmentType === 'delivery' ? (
                        <>
                          <Bike className="w-3.5 h-3.5 text-blue-600" />
                          <span>Delivery</span>
                        </>
                      ) : (
                        <>
                          <Store className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Collection</span>
                        </>
                      )}
                    </div>
                    {order.deliveryAddress && (
                      <div className="text-[10px] text-stone-500 max-w-[170px] truncate mt-0.5" title={order.deliveryAddress}>
                        {order.deliveryAddress}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-stone-600">
                    <div className="line-clamp-1 font-medium">
                      {order.items.map((i: any) => `${i.quantity}x ${i.dish.name}`).join(', ')}
                    </div>
                    {order.specialNotes && (
                      <div className="text-[10px] text-amber-700 italic mt-0.5">Note: {order.specialNotes}</div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-extrabold text-[13px] text-[#1A130E] whitespace-nowrap">
                    €{order.total.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/all-orders/${order.id}`}
                        className="h-8 px-2.5 rounded-lg border border-stone-200 hover:border-[#B84A22] hover:text-[#B84A22] text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs bg-white"
                        title="View Full Order Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-500" />
                        <span className="hidden sm:inline">Details</span>
                      </Link>

                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="h-8 px-2 bg-stone-50 border border-stone-200 text-[#1A130E] rounded-lg text-xs font-semibold outline-none cursor-pointer focus:border-[#B84A22]"
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
                        className="h-8 w-8 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
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
          <div className="p-12 text-center text-stone-500">
            <AlertCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-[#1A130E]">No orders found</h4>
            <p className="text-xs text-stone-400 mt-1">Try another search keyword or reset filters.</p>
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
