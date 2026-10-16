'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToCart, setCartOpen } from '@/redux/slices/cartSlice';
import { updateOrderStatus, syncOrdersFromStorage } from '@/redux/slices/orderSlice';
import {
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  Bike,
  Store,
  ChefHat,
  ClipboardCheck,
  UtensilsCrossed,
} from 'lucide-react';
import { INITIAL_ORDERS, OrderItem } from '@/Mockdata';

// Static historical partner orders for account history demonstrations
const HISTORICAL_ORDERS: Record<string, any> = {
  acb12345458: {
    id: 'ord-mcd',
    orderNumber: 'ACB12345458',
    customerName: 'Sarah Ahmed',
    customerPhone: '+353 87 234 5678',
    customerEmail: 'sarah.ahmed@gmail.com',
    fulfillmentType: 'delivery',
    deliveryAddress: '42 Baggot St Lower, Dublin 2',
    eircode: 'D02 P682',
    items: [
      {
        cartItemId: 'mcd-1',
        dish: {
          id: 'mcd-1',
          name: 'Big Mac Meal',
          price: 12.50,
          image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
          description: 'Double beef patty with special sauce, lettuce, cheese, pickles.',
          category: 'Burgers',
          spiceLevel: 0,
          allergens: ['Gluten', 'Dairy'],
          isPopular: true,
          isVeg: false,
        },
        quantity: 2,
        selectedModifiers: [{ groupName: 'Drink', optionName: 'Coke Large', price: 0 }],
        specialInstructions: 'Extra napkins please',
        totalPrice: 25.00,
      },
      {
        cartItemId: 'mcd-2',
        dish: {
          id: 'mcd-2',
          name: 'Crispy McNuggets (9 pcs) & Large Fries',
          price: 15.00,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
          description: 'Tender crispy chicken bites with golden salted fries and sweet curry dip.',
          category: 'Sides',
          spiceLevel: 0,
          allergens: ['Gluten'],
          isPopular: true,
          isVeg: false,
        },
        quantity: 1,
        selectedModifiers: [{ groupName: 'Sauce', optionName: 'Sweet Curry Dip', price: 0 }],
        totalPrice: 15.00,
      },
    ],
    subtotal: 40.00,
    deliveryFee: 0,
    discount: 0,
    total: 40.00,
    status: 'completed',
    createdAt: '2026-10-15T10:00:00.000Z',
    estimatedMinutes: 0,
    specialNotes: 'Leave at apartment reception desk.',
    paymentMethod: 'apple_pay',
  },
  acb12345459: {
    id: 'ord-sbx',
    orderNumber: 'ACB12345459',
    customerName: 'Sarah Ahmed',
    customerPhone: '+353 87 234 5678',
    customerEmail: 'sarah.ahmed@gmail.com',
    fulfillmentType: 'delivery',
    deliveryAddress: '42 Baggot St Lower, Dublin 2',
    eircode: 'D02 P682',
    items: [
      {
        cartItemId: 'sbx-1',
        dish: {
          id: 'sbx-1',
          name: 'Caramel Macchiato & Butter Croissant',
          price: 25.00,
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
          description: 'Freshly steamed milk with practical vanilla syrup, espresso and caramel drizzle.',
          category: 'Coffee & Bakery',
          spiceLevel: 0,
          allergens: ['Dairy'],
          isPopular: true,
          isVeg: true,
        },
        quantity: 4,
        selectedModifiers: [{ groupName: 'Milk Choice', optionName: 'Oat Milk', price: 0 }],
        totalPrice: 100.00,
      },
    ],
    subtotal: 100.00,
    deliveryFee: 0,
    discount: 0,
    total: 100.00,
    status: 'completed',
    createdAt: '2026-10-14T10:00:00.000Z',
    estimatedMinutes: 0,
    specialNotes: 'Contactless delivery requested.',
    paymentMethod: 'apple_pay',
  },
  acb12345678: {
    id: 'ord-pzh',
    orderNumber: 'ACB12345678',
    customerName: 'Sarah Ahmed',
    customerPhone: '+353 87 234 5678',
    customerEmail: 'sarah.ahmed@gmail.com',
    fulfillmentType: 'delivery',
    deliveryAddress: '42 Baggot St Lower, Dublin 2',
    eircode: 'D02 P682',
    items: [
      {
        cartItemId: 'pzh-1',
        dish: {
          id: 'pzh-1',
          name: 'Stuffed Crust Pepperoni Feast & Garlic Breadsticks',
          price: 60.00,
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
          description: 'Loaded mozzarella stuffed crust pepperoni pizza with hot garlic breadsticks.',
          category: 'Pizza',
          spiceLevel: 1,
          allergens: ['Gluten', 'Dairy'],
          isPopular: true,
          isVeg: false,
        },
        quantity: 1,
        selectedModifiers: [],
        totalPrice: 60.00,
      },
    ],
    subtotal: 60.00,
    deliveryFee: 0,
    discount: 0,
    total: 60.00,
    status: 'completed',
    createdAt: '2026-10-13T10:00:00.000Z',
    estimatedMinutes: 0,
    specialNotes: 'Ring bell twice.',
    paymentMethod: 'apple_pay',
  },
  acb12345679: {
    id: 'ord-bk',
    orderNumber: 'ACB12345679',
    customerName: 'Sarah Ahmed',
    customerPhone: '+353 87 234 5678',
    customerEmail: 'sarah.ahmed@gmail.com',
    fulfillmentType: 'delivery',
    deliveryAddress: '42 Baggot St Lower, Dublin 2',
    eircode: 'D02 P682',
    items: [
      {
        cartItemId: 'bk-1',
        dish: {
          id: 'bk-1',
          name: 'Flame-Grilled Whopper & Onion Rings',
          price: 22.50,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
          description: 'Flame-grilled beef burger with crunchy golden onion rings and chilled drinks.',
          category: 'Burgers',
          spiceLevel: 1,
          allergens: ['Gluten'],
          isPopular: true,
          isVeg: false,
        },
        quantity: 2,
        selectedModifiers: [],
        totalPrice: 45.00,
      },
    ],
    subtotal: 45.00,
    deliveryFee: 0,
    discount: 0,
    total: 45.00,
    status: 'completed',
    createdAt: '2026-10-12T10:00:00.000Z',
    estimatedMinutes: 0,
    specialNotes: 'Leave with concierge.',
    paymentMethod: 'apple_pay',
  },
};

export default function OrderDetailsPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const rawId = (params?.id as string) || '';
  const cleanId = decodeURIComponent(rawId).replace(/^#/, '').trim();

  const orders = useAppSelector((state) => state.orders.orders);

  React.useEffect(() => {
    dispatch(syncOrdersFromStorage());
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'amber_spice_orders') {
        dispatch(syncOrdersFromStorage());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [dispatch]);
  
  // Intelligent lookup: matches AS-2041, ord-2041, 2041, ZM-4047, zm-4047, etc.
  const allKnownOrders = React.useMemo(() => [...orders, ...INITIAL_ORDERS], [orders]);
  const foundOrder = allKnownOrders.find((o) => {
    const oId = (o.id || '').toLowerCase();
    const oNum = (o.orderNumber || '').toLowerCase();
    const cId = cleanId.toLowerCase();
    const cDigits = cleanId.replace(/[^0-9]/g, '');
    const oDigits = oNum.replace(/[^0-9]/g, '');

    return (
      oId === cId ||
      oNum === cId ||
      oNum === `as-${cId}` ||
      oNum === `zm-${cId}` ||
      oId === `ord-${cId}` ||
      oNum.replace(/[^a-z0-9]/gi, '') === cleanId.replace(/[^a-z0-9]/gi, '').toLowerCase() ||
      (cDigits.length >= 3 && oDigits === cDigits)
    );
  });

  const matchedHistorical =
    HISTORICAL_ORDERS[cleanId.toLowerCase()] ||
    HISTORICAL_ORDERS[cleanId.toLowerCase().replace(/[^a-z0-9]/gi, '')] ||
    Object.values(HISTORICAL_ORDERS).find(
      (m) =>
        m.id.toLowerCase() === cleanId.toLowerCase() ||
        m.orderNumber.toLowerCase() === cleanId.toLowerCase() ||
        (cleanId.replace(/[^0-9]/g, '').length >= 3 &&
          m.orderNumber.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, ''))
    );

  const is4047 = cleanId.toLowerCase().includes('4047') || cleanId.toLowerCase().startsWith('zm');
  const baseFallback = is4047 ? INITIAL_ORDERS[0] : (INITIAL_ORDERS[1] || INITIAL_ORDERS[0]);
  const currentOrder: OrderItem = (foundOrder || matchedHistorical || {
    ...baseFallback,
    id: cleanId || baseFallback.id,
    orderNumber: cleanId
      ? (cleanId.toUpperCase().startsWith('AS-') || cleanId.toUpperCase().startsWith('ZM-')
          ? cleanId.toUpperCase()
          : `AS-${cleanId.replace(/[^0-9]/g, '') || baseFallback.orderNumber.replace(/[^0-9]/g, '')}`)
      : baseFallback.orderNumber,
  }) as OrderItem;

  const [localStatus, setLocalStatus] = React.useState<
    'new' | 'preparing' | 'ready' | 'completed' | null
  >(null);

  React.useEffect(() => {
    // Celebratory confetti burst when customer lands on Order Confirmation & Details
    try {
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#B84A22', '#D49B37', '#0FA958'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  const activeStatus = localStatus || currentOrder.status;

  const formattedOrderDate = React.useMemo(() => {
    try {
      const d = new Date(currentOrder.createdAt);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-IE', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    } catch {
      // ignore
    }
    return 'Recently Placed';
  }, [currentOrder.createdAt]);

  const steps = [
    {
      key: 'new',
      label: 'Order Confirmed',
      desc: 'Sent to kitchen chefs',
      icon: ClipboardCheck,
    },
    {
      key: 'preparing',
      label: 'Food Preparing',
      desc: 'Chefs are grilling & packing',
      icon: ChefHat,
    },
    {
      key: 'ready',
      label: currentOrder.fulfillmentType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup',
      desc: currentOrder.fulfillmentType === 'delivery' ? 'Driver is on the way' : 'Ready at collection counter',
      icon: currentOrder.fulfillmentType === 'delivery' ? Bike : Store,
    },
    {
      key: 'completed',
      label: currentOrder.fulfillmentType === 'delivery' ? 'Order Delivered' : 'Order Picked Up',
      desc: 'Enjoy your hot delicious meal!',
      icon: UtensilsCrossed,
    },
  ];

  const currentIndex = steps.findIndex((s) => s.key === activeStatus);

  const handleAdvanceStatus = () => {
    const sequence: ('new' | 'preparing' | 'ready' | 'completed')[] = [
      'new',
      'preparing',
      'ready',
      'completed',
    ];
    const nextIdx = (currentIndex + 1) % sequence.length;
    const nextStatus = sequence[nextIdx];
    setLocalStatus(nextStatus);
    dispatch(updateOrderStatus({ orderId: currentOrder.id, status: nextStatus }));
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/user-dashboard?tab=orders"
              className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-[#F15A24] hover:text-[#d44715] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Orders</span>
            </Link>
            <span className="text-[#D5CFC9]">|</span>
            <Link
              href="/menu"
              className="text-[13px] font-medium text-[#7A746E] hover:text-[#1A130E] transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EFEAE4]">
          <div>
            <div className="w-9 h-[3px] bg-[#F15A24] rounded-full mb-3" />
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A130E] tracking-tight">
                Order #{currentOrder.orderNumber}
              </h1>
              <span className="text-[11.5px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-50 text-[#F15A24] border border-orange-200">
                {activeStatus === 'completed'
                  ? 'Delivered'
                  : activeStatus === 'ready'
                  ? 'Out for Delivery'
                  : activeStatus === 'preparing'
                  ? 'Food Preparing'
                  : 'Order Confirmed'}
              </span>
            </div>
            <p className="text-[13px] text-[#8C8681] mt-1.5">
              Placed on {formattedOrderDate} · Amber Spice Kitchen
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => {
                currentOrder.items.forEach((item) => {
                  dispatch(
                    addToCart({
                      ...item,
                      cartItemId: `${item.dish.id}-${Date.now()}-${Math.random()}`,
                    })
                  );
                });
                dispatch(setCartOpen(true));
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white text-[13px] font-semibold hover:opacity-95 transition-opacity cursor-pointer shadow-sm active:scale-95"
            >
              Re-order All Items
            </button>
            <button
              onClick={handleAdvanceStatus}
              className="px-4 py-2.5 rounded-xl border border-[#F15A24] text-[#F15A24] text-[13px] font-semibold hover:bg-orange-50 transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              Simulate Next Status ➔
            </button>
          </div>
        </div>

        {/* Live Delivery Status Card with Stepper */}
        <div className="bg-white border border-[#EFEAE4] rounded-[24px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,19,14,0.03)] space-y-6">
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EFEAE4] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#F15A24] flex items-center justify-center shadow-xs border border-[#EFEAE4] shrink-0">
              <Clock className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <span className="text-[12px] font-bold text-[#F15A24] uppercase tracking-wider block">
                {currentOrder.fulfillmentType === 'delivery' ? 'Live Delivery Status' : 'Live Order Status'}
              </span>
              <span className="text-lg sm:text-xl font-bold text-[#1A130E]">
                {activeStatus === 'completed'
                  ? (currentOrder.fulfillmentType === 'delivery' ? 'Order Delivered' : 'Order Picked Up')
                  : currentOrder.fulfillmentType === 'delivery'
                  ? `Estimated Arrival: ~${currentOrder.estimatedMinutes} Minutes`
                  : `Estimated Ready Time: ~${currentOrder.estimatedMinutes} Minutes`}
              </span>
            </div>
          </div>

          {/* Stepper */}
          <div className="py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {steps.map((step, idx) => {
                const isFinished = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const Icon = step.icon;

                return (
                  <div
                    key={step.key}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                      isCurrent
                        ? 'bg-orange-50/60 border-[#F15A24] shadow-xs ring-1 ring-[#F15A24]/30'
                        : isFinished
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-[#FAF8F5] border-[#EFEAE4] opacity-75'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                        isFinished
                          ? 'bg-[#0FA958] text-white shadow-xs'
                          : isCurrent
                          ? 'bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white ring-4 ring-orange-200/60 shadow-xs'
                          : 'bg-neutral-200 text-[#7A746E]'
                      }`}
                    >
                      {isFinished ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8681] block leading-none mb-1">
                        Step 0{idx + 1}
                      </span>
                      <h4
                        className={`font-bold text-[13px] sm:text-[13.5px] xl:text-[14px] leading-tight whitespace-nowrap ${
                          isCurrent
                            ? 'text-[#F15A24]'
                            : isFinished
                            ? 'text-emerald-900'
                            : 'text-[#55504A]'
                        }`}
                      >
                        {step.label}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2-Column: Ordered Items & Delivery Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Items Column */}
          <div className="lg:col-span-7 bg-white border border-[#EFEAE4] rounded-[24px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,19,14,0.02)] space-y-5">
            <div className="pb-4 border-b border-[#F2EFE9]">
              <h3 className="font-bold text-[17px] text-[#1A130E]">
                Items Ordered ({(currentOrder.items || []).length})
              </h3>
            </div>

            <div className="divide-y divide-[#F4F1EC]">
              {(currentOrder.items || []).map((item, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-[#EAE6E1]">
                      <img
                        src={item.dish?.image || '/images/curry_dish.jpg'}
                        alt={item.dish?.name || 'Dish'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[15px] font-bold text-[#1A130E] block">
                        {item.quantity || 1}x {item.dish?.name || 'Amber Special'}
                      </span>

                      {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                        <div className="text-[12px] text-[#7A746E] mt-0.5">
                          {item.selectedModifiers.map((m, mIdx) => (
                            <span key={mIdx}>
                              {m.groupName}: {m.optionName}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.specialInstructions && (
                        <p className="text-[12px] text-[#F15A24] font-medium italic mt-0.5">
                          Note: &quot;{item.specialInstructions}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="font-bold text-[15px] text-[#1A130E] shrink-0">
                    €{Number(item.totalPrice ?? item.dish?.price ?? 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="pt-4 border-t border-[#F2EFE9] space-y-2.5 text-[13.5px] text-[#666059]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1A130E]">€{Number(currentOrder.subtotal || 0).toFixed(2)}</span>
              </div>
              {Number(currentOrder.discount || 0) > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Special Discount</span>
                  <span className="font-semibold">-€{Number(currentOrder.discount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-[#1A130E]">
                  {Number(currentOrder.deliveryFee || 0) === 0 ? 'FREE' : `€${Number(currentOrder.deliveryFee || 0).toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-dashed border-[#E5DFD7] pt-3.5 flex justify-between text-[17px] font-bold text-[#1A130E]">
                <span>Total Paid</span>
                <span className="text-[#F15A24] text-[20px]">€{Number(currentOrder.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Destination & Customer Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#EFEAE4] rounded-[24px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(26,19,14,0.02)] space-y-4">
              <h3 className="font-bold text-[16px] text-[#1A130E] pb-3 border-b border-[#F2EFE9]">
                Delivery Destination
              </h3>

              <div className="flex items-start gap-3.5 text-[13.5px] text-[#4A443E]">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F15A24] flex items-center justify-center shrink-0 mt-0.5 border border-orange-200/50">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1A130E] block">Delivering to:</span>
                  <p className="mt-0.5 font-medium">{currentOrder.deliveryAddress || '42 Baggot St Lower, Dublin 2'}</p>
                  <span className="text-[#8C8681] text-[12px] block mt-0.5 font-mono">
                    {currentOrder.eircode || 'D02 P682'}
                  </span>
                </div>
              </div>

              {currentOrder.specialNotes && (
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EFEAE4] text-[12.5px] text-[#666059]">
                  <span className="font-bold text-[#1A130E] block mb-0.5">Driver Instructions:</span>
                  {currentOrder.specialNotes}
                </div>
              )}
            </div>

            <div className="bg-white border border-[#EFEAE4] rounded-[24px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(26,19,14,0.02)] space-y-3.5">
              <h3 className="font-bold text-[16px] text-[#1A130E] pb-3 border-b border-[#F2EFE9]">
                Customer & Payment Info
              </h3>

              <div className="space-y-3 text-[13.5px] text-[#55504A]">
                <div className="flex items-center justify-between">
                  <span className="text-[#8C8681]">Customer:</span>
                  <span className="font-semibold text-[#1A130E]">{currentOrder.customerName || 'Mark Jecno'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8C8681]">Phone:</span>
                  <span className="font-semibold text-[#1A130E]">{currentOrder.customerPhone || '+353 87 123 4567'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8C8681]">Payment:</span>
                  <span className="font-semibold text-[#1A130E] uppercase text-[12px]">
                    {currentOrder.paymentMethod ? currentOrder.paymentMethod.replace('_', ' ') : 'Card ending in 4242'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
