import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateOrderStatus, assignDriver, updateInternalNotes } from '../../store/slices/orderSlice';
import { deductRecipeStockForOrder } from '../../store/slices/stockSlice';
import { KdsOrder, OrderStatus } from '../../types/common.types';
import { INITIAL_DRIVERS } from '../../lib/constants';
import {
  ArrowLeft,
  Printer,
  Clock,
  Phone,
  Mail,
  MapPin,
  Bike,
  Store,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  UtensilsCrossed,
  Receipt,
  User,
  Flame,
  ExternalLink,
  FileText,
  Save,
} from 'lucide-react';
import { TicketSlipModal } from '../../components/dashboard/TicketSlipModal';

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.orders);

  const [isCopied, setIsCopied] = useState(false);
  const [isSlipOpen, setIsSlipOpen] = useState(false);

  // Find order by ID or orderNumber
  const order: KdsOrder | undefined = orders.find(
    (o) => o.id === orderId || o.orderNumber.replace('#', '') === orderId?.replace('#', '')
  );

  const [internalNotesInput, setInternalNotesInput] = useState<string>(order?.internalNotes || '');
  const [notesSaved, setNotesSaved] = useState(false);

  if (!order) {
    return (
      <div className="bg-white border border-stone-200/90 rounded-2xl p-12 text-center shadow-2xs max-w-xl mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#1A130E]">Order Not Found</h2>
        <p className="text-xs text-stone-500 mt-1.5 mb-6">
          The requested ticket #{orderId} does not exist in the live database or has been archived.
        </p>
        <Link
          to="/all-orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Orders List</span>
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: OrderStatus) => {
    dispatch(updateOrderStatus({ orderId: order.id, status: newStatus }));
    if (['ready', 'out_for_delivery', 'completed'].includes(newStatus) && !order.stockDeducted) {
      dispatch(
        deductRecipeStockForOrder({
          items: order.items.map((i) => ({ dishId: i.dish.id, quantity: i.quantity })),
        })
      );
    }
  };

  const handleAssignDriver = (driverName: string) => {
    if (!driverName) return;
    dispatch(assignDriver({ orderId: order.id, driverName }));
    if (!order.stockDeducted) {
      dispatch(
        deductRecipeStockForOrder({
          items: order.items.map((i) => ({ dishId: i.dish.id, quantity: i.quantity })),
        })
      );
    }
  };

  const handleSaveInternalNotes = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateInternalNotes({ orderId: order.id, notes: internalNotesInput.trim() }));
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
            New
          </span>
        );
      case 'preparing':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-[#B84A22] border border-orange-200 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" /> Preparing
          </span>
        );
      case 'ready':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1.5">
            <Bike className="w-3.5 h-3.5" /> On The Way
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700">{status}</span>;
    }
  };

  const orderTime = new Date(order.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const orderDate = new Date(order.createdAt).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate timeline states based on fulfillment type
  const isDelivery = order.fulfillmentType === 'delivery';
  const stages: { key: OrderStatus; label: string; desc: string }[] = isDelivery
    ? [
        { key: 'new', label: 'Received', desc: 'Order placed' },
        { key: 'preparing', label: 'Preparing', desc: 'Kitchen prep' },
        { key: 'ready', label: 'Ready', desc: 'Packed for courier' },
        { key: 'out_for_delivery', label: 'On The Way', desc: 'Driver dispatched' },
        { key: 'completed', label: 'Delivered', desc: 'Handed to customer' },
      ]
    : [
        { key: 'new', label: 'Received', desc: 'Order placed' },
        { key: 'preparing', label: 'Preparing', desc: 'Kitchen prep' },
        { key: 'ready', label: 'Ready', desc: 'Ready at counter' },
        { key: 'completed', label: 'Collected', desc: 'Handed to guest' },
      ];

  const currentStageIndex = stages.findIndex((s) => s.key === order.status);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* 1. TOP NAVIGATION & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/all-orders')}
            className="w-10 h-10 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 flex items-center justify-center cursor-pointer shadow-2xs transition-colors shrink-0"
            title="Back to All Orders"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A130E] tracking-tight">
                Order {order.orderNumber}
              </h1>
              <button
                onClick={copyOrderNumber}
                className="p-1 rounded text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                title="Copy Ticket ID"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
              <span>Placed {orderDate} at {orderTime}</span>
              <span>•</span>
              <span className="capitalize font-semibold text-stone-700">
                {order.fulfillmentType === 'delivery' ? 'Delivery Order' : 'Store Collection'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Controller & Print */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSlipOpen(true)}
            className="h-10 px-4 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold shadow-2xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            <span>Print Kitchen Slip</span>
          </button>

          <div className="flex items-center bg-white border border-stone-200 rounded-xl p-1 shadow-2xs">
            <span className="text-[11px] font-bold text-stone-500 px-2 hidden md:inline">Change Status:</span>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              className="h-8 px-2.5 bg-stone-50 border border-stone-200 text-[#1A130E] rounded-lg text-xs font-bold outline-none cursor-pointer focus:border-[#B84A22] transition-colors"
            >
              <option value="new">New Order</option>
              <option value="preparing">Kitchen Prep (Cooking)</option>
              <option value="ready">Ready for Dispatch</option>
              <option value="out_for_delivery">On The Way (Driver)</option>
              <option value="completed">Completed / Handed Over</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. ORDER PROGRESS STEPPER */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Live Ticket Lifecycle</span>
          <div>{getStatusBadge(order.status)}</div>
        </div>

        <div className={`grid grid-cols-2 ${isDelivery ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-3 relative`}>
          {stages.map((stage, idx) => {
            const isCompleted = currentStageIndex >= idx;
            const isCurrent = order.status === stage.key;

            return (
              <div
                key={stage.key}
                onClick={() => handleStatusChange(stage.key)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-orange-50/80 border-[#B84A22] shadow-xs'
                    : isCompleted
                    ? 'bg-stone-50/70 border-emerald-200 text-stone-800'
                    : 'bg-white border-stone-200 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isCurrent ? 'text-[#B84A22]' : isCompleted ? 'text-emerald-700' : 'text-stone-400'
                    }`}
                  >
                    Step 0{idx + 1}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-stone-300" />
                  )}
                </div>
                <div className="font-bold text-xs text-[#1A130E]">{stage.label}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">{stage.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. THREE SIDE-BY-SIDE CARDS: Customer Profile | Fulfillment Details | Financial Ledger */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* Customer Card */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-sm text-[#1A130E] flex items-center gap-2">
                <User className="w-4 h-4 text-stone-500" />
                <span>Customer</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified
              </span>
            </div>

            <div className="space-y-3 mt-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Name</span>
                <span className="text-sm font-bold text-[#1A130E]">{order.customerName}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Phone</span>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="text-xs font-semibold text-[#B84A22] hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{order.customerPhone || '+353 (01) 485 9210'}</span>
                </a>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Email</span>
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="text-xs font-semibold text-stone-700 hover:text-[#B84A22] flex items-center gap-1.5 mt-0.5 truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{order.customerEmail || 'customer@amberspice.ie'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Fulfillment Card */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-sm text-[#1A130E] flex items-center gap-2">
                {order.fulfillmentType === 'delivery' ? (
                  <Bike className="w-4 h-4 text-blue-600" />
                ) : (
                  <Store className="w-4 h-4 text-emerald-600" />
                )}
                <span>Fulfillment</span>
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                {order.fulfillmentType}
              </span>
            </div>

            {order.fulfillmentType === 'delivery' ? (
              <div className="space-y-3 mt-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Delivery Address
                  </span>
                  <p className="text-xs font-medium text-stone-800 mt-0.5 leading-relaxed">
                    {order.deliveryAddress || '12 Fitzwilliam Square, Dublin 2'}
                  </p>
                </div>

                {order.eircode && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Eircode / Postal
                    </span>
                    <span className="text-xs font-bold text-[#1A130E] bg-stone-100 px-2 py-0.5 rounded inline-block mt-0.5">
                      {order.eircode}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Courier Driver
                  </span>
                  <select
                    value={order.driverName || ''}
                    onChange={(e) => handleAssignDriver(e.target.value)}
                    className="w-full h-8 px-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold text-stone-800 outline-none cursor-pointer focus:border-[#B84A22]"
                  >
                    <option value="">{order.driverName ? `🛵 ${order.driverName}` : '+ Assign Courier'}</option>
                    {INITIAL_DRIVERS.map((d) => (
                      <option key={d.id} value={d.name}>🛵 {d.name} ({d.phone})</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-2 mt-3 text-xs text-stone-600">
                <p>
                  <strong>Collection Counter:</strong> Amber Spice Main Host Stand
                </p>
                <p className="text-stone-500">
                  Guest will present order #{order.orderNumber} for takeaway pickup.
                </p>
              </div>
            )}
          </div>

          {order.fulfillmentType === 'delivery' && (
            <div className="pt-3 border-t border-stone-100">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${order.deliveryAddress || ''} ${order.eircode || ''}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B84A22] hover:underline"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Payment Card */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-sm text-[#1A130E] flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>Payment</span>
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Settled
              </span>
            </div>

            <div className="space-y-2 mt-3 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">€{order.subtotal.toFixed(2)}</span>
              </div>

              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-stone-900">€{order.deliveryFee.toFixed(2)}</span>
                </div>
              )}

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Applied Discount</span>
                  <span>-€{order.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-400 text-[11px] pt-1 border-t border-stone-100">
                <span>VAT (Included 13.5%)</span>
                <span>€{((order.total * 0.135) / 1.135).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-[#1A130E] pt-1.5 border-t border-stone-200">
                <span>Total Paid</span>
                <span className="text-[#B84A22]">€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Payment Gateway:</span>
            <span className="font-semibold text-stone-800 capitalize">
              {order.paymentMethod ? order.paymentMethod.replace('_', ' ') : 'Card (Stripe Online)'}
            </span>
          </div>
        </div>
      </div>

      {/* Internal Notes Quick Banner */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#B84A22]" />
            <span>Internal Kitchen &amp; Courier Notes</span>
          </h3>
          <span className="text-[10px] text-stone-400">Private internal note for staff</span>
        </div>
        <form onSubmit={handleSaveInternalNotes} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Guest requested buzzer 419, extra tamarind chutney added, cutlery pre-packed..."
            value={internalNotesInput}
            onChange={(e) => setInternalNotesInput(e.target.value)}
            className="flex-1 h-9 px-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-xl text-xs text-stone-900 outline-none"
          />
          <button
            type="submit"
            className="h-9 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{notesSaved ? 'Saved!' : 'Save Note'}</span>
          </button>
        </form>
      </div>

      {/* 4. ORDERED DISHES & KITCHEN ACTIONS (Full-Width) */}
      <div className="space-y-6">
        {/* Order Items Table Card */}
        <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-[#1A130E] flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-[#B84A22]" />
                <span>Items ({order.items.reduce((s, i) => s + i.quantity, 0)})</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Dishes and notes.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-bold">
              EST. {order.estimatedMinutes || 20}m
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {order.items.map((item, idx) => (
              <div key={item.cartItemId || idx} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-stone-50/50 transition-colors">
                {/* Dish Thumbnail */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  <img
                    src={item.dish.image || '/images/amber_hero_dish.jpg'}
                    alt={item.dish.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/amber_hero_dish.jpg';
                    }}
                  />
                </div>

                {/* Dish Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#B84A22] uppercase tracking-wider block">
                        {item.dish.categoryLabel || item.dish.category}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-[#1A130E]">
                        {item.dish.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-sm sm:text-base text-[#1A130E]">
                        €{item.totalPrice.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        €{item.dish.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>

                  {/* Modifiers & Portions */}
                  {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.selectedModifiers.map((mod, mIdx) => (
                        <span
                          key={mIdx}
                          className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200"
                        >
                          + {mod.optionName} {mod.price > 0 ? `(€${mod.price.toFixed(2)})` : ''}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Special Item Instructions */}
                  {item.specialInstructions && (
                    <div className="mt-2 text-xs text-amber-800 bg-amber-50/70 border border-amber-200/60 rounded-lg p-2 font-medium">
                      <span className="font-bold">Item Note:</span> {item.specialInstructions}
                    </div>
                  )}

                  {/* Quantity Badge */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 font-extrabold text-xs border border-stone-200">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Special Order Notes Box */}
          {order.specialNotes && (
            <div className="p-4 sm:p-5 bg-amber-50/60 border-t border-amber-200/70">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Customer Chef & Delivery Instructions:
                  </h4>
                  <p className="text-xs text-amber-800 font-medium mt-1 leading-relaxed">
                    &quot;{order.specialNotes}&quot;
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Dispatch / Next Action Bar */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Ready to progress?</div>
            <div className="text-sm font-bold text-[#1A130E] mt-0.5">
              {order.status === 'new' && 'Move ticket to Kitchen Prep line'}
              {order.status === 'preparing' && 'Notify packing station that dishes are ready'}
              {order.status === 'ready' && (isDelivery ? 'Hand over packed food to courier driver' : 'Ready at counter for customer pickup')}
              {order.status === 'out_for_delivery' && `On the road with ${order.driverName || 'courier'}`}
              {order.status === 'completed' && 'This order is fully settled and closed.'}
              {order.status === 'cancelled' && 'This order was cancelled.'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {order.status === 'new' && (
              <button
                type="button"
                onClick={() => handleStatusChange('preparing')}
                className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Flame className="w-4 h-4" />
                <span>Start Kitchen Prep</span>
              </button>
            )}

            {order.status === 'preparing' && (
              <button
                type="button"
                onClick={() => handleStatusChange('ready')}
                className="h-10 px-5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Ready</span>
              </button>
            )}

            {order.status === 'ready' && isDelivery && (
              <>
                <button
                  type="button"
                  onClick={() => handleStatusChange('out_for_delivery')}
                  className="h-10 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <Bike className="w-4 h-4" />
                  <span>Dispatch Driver (On The Way)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('completed')}
                  className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete</span>
                </button>
              </>
            )}

            {order.status === 'ready' && !isDelivery && (
              <button
                type="button"
                onClick={() => handleStatusChange('completed')}
                className="h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hand Over &amp; Complete</span>
              </button>
            )}

            {order.status === 'out_for_delivery' && (
              <button
                type="button"
                onClick={() => handleStatusChange('completed')}
                className="h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Delivered &amp; Complete Order</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Printable Thermal Kitchen Docket Modal */}
      {isSlipOpen && <TicketSlipModal order={order} onClose={() => setIsSlipOpen(false)} />}
    </div>
  );
}

export default OrderDetailPage;
