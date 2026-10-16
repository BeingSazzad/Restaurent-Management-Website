'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateOrderStatus } from '@/redux/slices/orderSlice';
import { OrderItem } from '@/Mockdata';
import {
  Search,
  CheckCircle2,
  Clock,
  Bike,
  Store,
  Printer,
  Eye,
  AlertCircle,
  TrendingUp,
  Phone,
} from 'lucide-react';

interface MasterOrdersManagerProps {
  onOpenReceiptSlip?: (order: OrderItem) => void;
}

export const MasterOrdersManager: React.FC<MasterOrdersManagerProps> = ({ onOpenReceiptSlip }) => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<'all' | 'delivery' | 'collection'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Financial Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const activeOrders = orders.filter((o) => ['new', 'preparing', 'ready', 'out_for_delivery'].includes(o.status));

  const filteredOrders = orders.filter((order) => {
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

  const handleStatusChange = (orderId: string, newStatus: OrderItem['status']) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-700">New Order</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-orange-100 text-[#F15A24]">Kitchen Prep</span>;
      case 'ready':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800">Ready for Dispatch</span>;
      case 'out_for_delivery':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-700">Out on Route</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-700">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-700">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-stone-100 text-stone-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <span className="p-2 rounded-xl bg-orange-50 text-[#F15A24]">€</span>
          </div>
          <div className="text-2xl font-extrabold text-[#1A130E]">€{totalRevenue.toFixed(2)}</div>
          <div className="text-[11px] text-stone-400 mt-1">Across all confirmed customer orders</div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Active Tickets</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600">{activeOrders.length}</div>
          <div className="text-[11px] text-stone-400 mt-1">Currently in prep or dispatch</div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Orders</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{completedOrders.length}</div>
          <div className="text-[11px] text-stone-400 mt-1">Delivered or collected</div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Average Order (AOV)</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-[#1A130E]">
            €{orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Per ticket ticket spend</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Order # (e.g. ZM-4047), customer name, phone, Eircode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-stone-50 border border-stone-200 focus:border-[#F15A24] rounded-xl pl-10 pr-4 text-xs text-stone-800 placeholder:text-stone-400 outline-none transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'new', label: 'New' },
            { id: 'preparing', label: 'Kitchen Prep' },
            { id: 'ready', label: 'Ready' },
            { id: 'out_for_delivery', label: 'Out' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                statusFilter === tab.id
                  ? 'bg-[#1A130E] text-white border-[#1A130E]'
                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Fulfillment Type */}
        <div className="flex items-center gap-1.5 shrink-0">
          {(['all', 'delivery', 'collection'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFulfillmentFilter(type)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium capitalize cursor-pointer border ${
                fulfillmentFilter === type
                  ? 'bg-orange-100 text-[#F15A24] border-orange-200 font-bold'
                  : 'bg-stone-50 border-stone-200 text-stone-600'
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
              <tr className="bg-stone-50 border-b border-stone-200/80 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3 px-4">Order / Ticket</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Fulfillment</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                  {/* Order & Time */}
                  <td className="py-3.5 px-4 font-bold text-[#1A130E] whitespace-nowrap">
                    <div className="font-extrabold text-[13px] text-[#F15A24]">{order.orderNumber}</div>
                    <div className="text-[10px] text-stone-400 font-normal mt-0.5">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ·{' '}
                      {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#1A130E]">{order.customerName}</div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span>{order.customerPhone || '+353 (01) 485 9210'}</span>
                    </div>
                  </td>

                  {/* Fulfillment */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                      {order.fulfillmentType === 'delivery' ? (
                        <>
                          <Bike className="w-3.5 h-3.5 text-blue-500" />
                          <span>Delivery</span>
                        </>
                      ) : (
                        <>
                          <Store className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Collection</span>
                        </>
                      )}
                    </div>
                    {order.deliveryAddress && (
                      <div className="text-[10px] text-stone-500 max-w-[180px] truncate mt-0.5" title={order.deliveryAddress}>
                        {order.deliveryAddress}
                      </div>
                    )}
                  </td>

                  {/* Items */}
                  <td className="py-3.5 px-4">
                    <div className="text-stone-700 font-medium">
                      {order.items.map((i) => `${i.quantity}x ${i.dish.name}`).join(', ')}
                    </div>
                    {order.specialNotes && (
                      <div className="text-[10px] text-amber-700 italic mt-0.5">Note: {order.specialNotes}</div>
                    )}
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 font-extrabold text-[13px] text-[#1A130E] whitespace-nowrap">
                    €{order.total.toFixed(2)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Status select dropdown */}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                        className="h-8 px-2 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 outline-none cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="preparing">Prep</option>
                        <option value="ready">Ready</option>
                        <option value="out_for_delivery">Out</option>
                        <option value="completed">Done</option>
                        <option value="cancelled">Cancel</option>
                      </select>

                      {/* View details */}
                      <Link
                        href={`/order-details/${order.orderNumber}`}
                        className="h-8 px-2.5 rounded-lg border border-stone-200 hover:border-[#F15A24] hover:text-[#F15A24] text-stone-600 flex items-center gap-1 cursor-pointer transition-colors"
                        title="View Full Customer Receipt"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Details</span>
                      </Link>

                      {/* Print thermal slip */}
                      {onOpenReceiptSlip && (
                        <button
                          type="button"
                          onClick={() => onOpenReceiptSlip(order)}
                          className="h-8 w-8 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
                          title="Print Kitchen Docket / Slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      )}
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
            <h4 className="font-bold text-sm text-[#1A130E]">No orders match your filter criteria</h4>
            <p className="text-xs text-stone-400 mt-1">Try another search term or reset the status filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
