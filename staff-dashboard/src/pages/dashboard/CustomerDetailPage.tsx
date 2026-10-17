import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Crown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  TrendingUp,
  Heart,
  ShieldCheck,
  Ban,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Bike,
  Store,
  Receipt,
  CreditCard,
  Clock,
} from 'lucide-react';
import {
  getCustomerById,
  banCustomer,
  unbanCustomer,
  RegisteredCustomer,
} from '../../services/customerService';
import { useAppSelector } from '../../store/hooks';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { TicketSlipModal } from '../../components/dashboard/TicketSlipModal';
import { KdsOrder } from '../../types/common.types';

interface HistoricalOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  itemsSummary: string;
  fulfillmentType: 'delivery' | 'collection';
  status: 'completed' | 'preparing' | 'ready' | 'out_for_delivery' | 'new' | 'cancelled';
  paymentMethod: string;
  total: number;
  isLiveOrder?: boolean;
  liveOrderObj?: KdsOrder;
}

export function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { orders: liveOrders } = useAppSelector((state) => state.orders);

  const [customer, setCustomer] = useState<RegisteredCustomer | undefined>(() =>
    customerId ? getCustomerById(customerId) : undefined
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [banReason, setBanReason] = useState('Repeated fake or cancelled orders');
  const [selectedSlipOrder, setSelectedSlipOrder] = useState<KdsOrder | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (customerId) {
      setCustomer(getCustomerById(customerId));
    }
  }, [customerId]);

  const handleConfirmBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    const updated = banCustomer(customer.id, banReason);
    if (updated) setCustomer(updated);
    setIsBanModalOpen(false);
    showToast(`✓ ${customer.name} has been banned.`);
  };

  const handleUnban = () => {
    if (!customer) return;
    const updated = unbanCustomer(customer.id);
    if (updated) setCustomer(updated);
    showToast(`✓ ${customer.name} has been unbanned.`);
  };

  // Compile combined live & simulated historical order history
  const orderHistory = useMemo<HistoricalOrder[]>(() => {
    if (!customer) return [];

    const history: HistoricalOrder[] = [];

    // 1. Check matching live orders
    const matchedLive = liveOrders.filter(
      (o) =>
        o.customerEmail?.toLowerCase() === customer.email.toLowerCase() ||
        o.customerName?.toLowerCase() === customer.name.toLowerCase()
    );

    matchedLive.forEach((o) => {
      history.push({
        id: o.id,
        orderNumber: o.orderNumber,
        createdAt: o.createdAt,
        itemsSummary: o.items.map((i) => `${i.quantity}x ${i.dish.name}`).join(', '),
        fulfillmentType: o.fulfillmentType,
        status: o.status,
        paymentMethod: o.paymentMethod || 'Card',
        total: o.total,
        isLiveOrder: true,
        liveOrderObj: o,
      });
    });

    // 2. Generate past completed historical orders to match customer.totalOrders
    const needed = Math.max(0, customer.totalOrders - matchedLive.length);
    const regDate = new Date(customer.registeredAt).getTime();
    const lastDate = new Date(customer.lastOrderDate || Date.now()).getTime();
    const interval = needed > 0 ? (lastDate - regDate) / (needed + 1) : 0;

    const sampleDishes = [
      customer.favoriteDish,
      'Royal Chicken Dum Biryani',
      'Tandoori Garlic Butter Naan',
      'Old Delhi Butter Chicken',
      'Kashmiri Lamb Rogan Josh',
      'Flame-Grilled Tandoori Chicken',
    ];

    for (let i = 0; i < needed; i++) {
      const orderTimestamp = new Date(lastDate - (i + 1) * Math.max(interval, 86400000)).toISOString();
      const numDishes = (i % 2 === 0) ? 2 : 3;
      const dishesPicked = sampleDishes.slice(i % 3, (i % 3) + numDishes);
      const itemsText = dishesPicked.map((d) => `1x ${d}`).join(', ');

      const approxTotal = Math.round(
        (customer.totalSpent / Math.max(1, customer.totalOrders)) * (0.85 + (i * 0.08) % 0.3) * 100
      ) / 100;

      history.push({
        id: `hist-ord-${customer.id}-${i + 1}`,
        orderNumber: `#AS-${3100 - i * 142}`,
        createdAt: orderTimestamp,
        itemsSummary: itemsText,
        fulfillmentType: i % 3 === 0 ? 'collection' : 'delivery',
        status: 'completed',
        paymentMethod: i % 2 === 0 ? 'Apple Pay' : 'Stripe / Card',
        total: approxTotal || 28.50,
        isLiveOrder: false,
      });
    }

    // Sort newest first
    return history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [customer, liveOrders]);

  if (!customer) {
    return (
      <div className="bg-white border border-stone-200/90 rounded-2xl p-12 text-center shadow-2xs max-w-xl mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#1A130E]">Customer Not Found</h2>
        <p className="text-xs text-stone-500 mt-1.5 mb-6">
          The requested customer profile does not exist or may have been deleted.
        </p>
        <Link
          to="/customers"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Customers List</span>
        </Link>
      </div>
    );
  }

  const isBanned = customer.isBanned || customer.status === 'banned';
  const avgOrderValue = customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0;

  return (
    <div className="space-y-6 text-[#1A130E] pb-10">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center gap-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/customers"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customers</span>
        </Link>

        <div className="flex items-center gap-2">
          {isBanned ? (
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold"
              onClick={handleUnban}
              leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Unban Customer
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
              onClick={() => setIsBanModalOpen(true)}
              leftIcon={<Ban className="w-3.5 h-3.5 text-rose-500" />}
            >
              Ban Customer
            </Button>
          )}
        </div>
      </div>

      {/* Banned Alert Banner */}
      {isBanned && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/90 text-rose-900 flex items-start gap-3 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-sm text-rose-950">This customer account is currently BANNED</h4>
            <p className="mt-0.5 text-rose-700">Reason: {customer.banReason || 'Policy violation'}</p>
            {customer.bannedAt && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">
                Banned on {new Date(customer.bannedAt).toLocaleString('en-IE')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Customer Hero Profile Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={customer.avatarUrl || '/images/avatars/sarah.jpg'}
              alt={customer.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md bg-stone-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/chef_master.jpg';
              }}
            />
            {customer.status === 'vip' && (
              <div
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs border-2 border-white"
                title="VIP Member"
              >
                <Crown className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-[#1A130E]">{customer.name}</h1>
              {isBanned ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                  <Ban className="w-3 h-3 text-rose-600" />
                  Banned
                </span>
              ) : (
                <>
                  {customer.status === 'vip' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      VIP Customer
                    </span>
                  )}
                  {customer.status === 'active' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active Customer
                    </span>
                  )}
                  {customer.status === 'new' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      New Customer
                    </span>
                  )}
                </>
              )}
            </div>

            <p className="text-xs text-stone-500 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1 text-stone-600">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <a href={`mailto:${customer.email}`} className="hover:underline text-stone-700">
                  {customer.email}
                </a>
              </span>
              <span className="text-stone-300">·</span>
              <span className="inline-flex items-center gap-1 text-stone-600">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <a href={`tel:${customer.phone}`} className="hover:underline text-stone-700">
                  {customer.phone}
                </a>
              </span>
              <span className="text-stone-300">·</span>
              <span className="inline-flex items-center gap-1 text-stone-400">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Member since {new Date(customer.registeredAt).toLocaleDateString('en-IE', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6 shrink-0">
          <div className="text-left md:text-right">
            <span className="text-xs font-medium text-stone-400 block">Total Lifetime Spend</span>
            <span className="text-2xl font-black text-stone-900 tracking-tight">
              {formatCurrency(customer.totalSpent)}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#F15A24]" />
          </div>
          <span className="text-xl font-bold text-stone-900">{customer.totalOrders}</span>
          <span className="text-[11px] text-stone-400 block mt-0.5">Completed orders</span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">Avg Order Value</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-xl font-bold text-stone-900">{formatCurrency(avgOrderValue)}</span>
          <span className="text-[11px] text-stone-400 block mt-0.5">Per order average</span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">Favorite Dish</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-sm font-bold text-stone-900 truncate block" title={customer.favoriteDish}>
            {customer.favoriteDish}
          </span>
          <span className="text-[11px] text-stone-400 block mt-0.5">Most reordered item</span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">Last Order</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-sm font-bold text-stone-900 block">
            {new Date(customer.lastOrderDate).toLocaleDateString('en-IE', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
          <span className="text-[11px] text-stone-400 block mt-0.5">
            {new Date(customer.lastOrderDate).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Two Column Section: Contact & Delivery Info + Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Delivery Address Card */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <MapPin className="w-4 h-4 text-[#F15A24]" />
            <span>Delivery & Address</span>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 text-xs space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
              Default Destination
            </span>
            <p className="font-semibold text-stone-900 text-sm leading-snug">{customer.deliveryAddress}</p>
            <div className="flex items-center gap-1.5 text-stone-600 pt-1">
              <span className="font-mono font-bold text-stone-800 bg-white border border-stone-200 px-2 py-0.5 rounded text-[11px]">
                {customer.eircode}
              </span>
              <span className="text-[11px] text-stone-400">Dublin delivery zone</span>
            </div>
          </div>

          <div className="text-xs space-y-2 pt-1 text-stone-600">
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Phone:</span>
              <span className="font-medium text-stone-800">{customer.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Email:</span>
              <span className="font-medium text-stone-800">{customer.email}</span>
            </div>
          </div>
        </div>

        {/* Order History Table (Spans 2 columns) */}
        <div className="md:col-span-2 bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#F15A24]" />
              <h3 className="font-bold text-sm text-[#1A130E]">Order History</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-[#B84A22] font-semibold border border-orange-200/60">
                {orderHistory.length} orders
              </span>
            </div>
            <span className="text-xs text-stone-400">Lifetime transactions</span>
          </div>

          {orderHistory.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-400">
              No orders found for this customer account.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stone-200/80 bg-stone-50/70 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Order #</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Items Ordered</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orderHistory.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-stone-900 font-mono">
                          {ord.orderNumber}
                        </span>
                        {ord.isLiveOrder && (
                          <span className="ml-1 text-[10px] font-bold text-[#B84A22] bg-orange-50 border border-orange-200/60 px-1.5 py-0.2 rounded">
                            Live
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-stone-600 whitespace-nowrap">
                        {new Date(ord.createdAt).toLocaleDateString('en-IE', {
                          day: 'numeric',
                          month: 'short',
                        })}
                        <span className="text-stone-400 block text-[10px]">
                          {new Date(ord.createdAt).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-700 max-w-xs truncate" title={ord.itemsSummary}>
                        {ord.itemsSummary}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600 capitalize">
                          {ord.fulfillmentType === 'delivery' ? (
                            <Bike className="w-3 h-3 text-[#F15A24]" />
                          ) : (
                            <Store className="w-3 h-3 text-emerald-600" />
                          )}
                          {ord.fulfillmentType}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {ord.status === 'completed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Completed
                          </span>
                        )}
                        {ord.status === 'preparing' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Preparing
                          </span>
                        )}
                        {ord.status === 'ready' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            Ready
                          </span>
                        )}
                        {ord.status === 'out_for_delivery' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            On Route
                          </span>
                        )}
                        {ord.status === 'new' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#B84A22] border border-orange-200">
                            New
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-stone-900 whitespace-nowrap">
                        {formatCurrency(ord.total)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {ord.isLiveOrder && ord.liveOrderObj ? (
                          <button
                            type="button"
                            onClick={() => setSelectedSlipOrder(ord.liveOrderObj!)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors cursor-pointer"
                          >
                            View Ticket
                          </button>
                        ) : (
                          <span className="text-[11px] text-stone-400 font-medium">
                            Paid via {ord.paymentMethod}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Ban Customer Confirmation Modal */}
      {isBanModalOpen && (
        <Modal
          isOpen={isBanModalOpen}
          onClose={() => setIsBanModalOpen(false)}
          title={`Ban Customer: ${customer.name}`}
          subtitle="Are you sure you want to block this customer from placing orders?"
          maxWidth="sm"
        >
          <form onSubmit={handleConfirmBan} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1">
              <p className="font-bold">Warning:</p>
              <p>
                Banning this customer will immediately prevent checkout on the online store using this email or phone number.
              </p>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Reason for Ban</label>
              <select
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="w-full h-9 rounded-lg border border-stone-300 px-3 bg-white text-stone-800 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="Repeated fake or cancelled orders">Repeated fake or cancelled orders</option>
                <option value="Abusive behavior towards delivery driver">Abusive behavior towards delivery driver</option>
                <option value="Chargeback / payment fraud claim">Chargeback / payment fraud claim</option>
                <option value="Other terms violation">Other terms violation</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsBanModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-rose-600 hover:bg-rose-700 text-white">
                Confirm Ban
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Ticket Slip Modal for Live Orders */}
      {selectedSlipOrder && (
        <TicketSlipModal
          order={selectedSlipOrder}
          onClose={() => setSelectedSlipOrder(null)}
        />
      )}
    </div>
  );
}

export default CustomerDetailPage;
