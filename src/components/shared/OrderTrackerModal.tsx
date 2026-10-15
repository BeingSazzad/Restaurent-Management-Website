'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setActiveTrackingOrderId, updateOrderStatus } from '../../redux/slices/orderSlice';
import { addToCart, setCartOpen } from '../../redux/slices/cartSlice';
import {
  CheckCircle2,
  Clock,
  Bike,
  Store,
  ChefHat,
  MapPin,
  X,
  ClipboardCheck,
  UtensilsCrossed,
  Star,
  RotateCcw,
  Check,
} from 'lucide-react';

export const OrderTrackerModal: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const activeOrderId = useAppSelector((state) => state.orders.activeTrackingOrderId);
  const orders = useAppSelector((state) => state.orders.orders);

  // Post-delivery rating state
  const [rating, setRating] = React.useState<number>(5);
  const [selectedTags, setSelectedTags] = React.useState<string[]>(['Authentic Flavor', 'Piping Hot']);
  const [reviewComment, setReviewComment] = React.useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = React.useState<boolean>(false);

  if (!activeOrderId) return null;

  const currentOrder = orders.find((o) => o.id === activeOrderId);
  if (!currentOrder) return null;

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
  };

  const handleReorder = () => {
    currentOrder.items.forEach((item) => {
      dispatch(
        addToCart({
          ...item,
          cartItemId: `${item.dish.id}-${Date.now()}-${Math.random()}`,
        })
      );
    });
    dispatch(setActiveTrackingOrderId(null));
    dispatch(setCartOpen(true));
  };

  const steps = [
    { key: 'new', label: 'Order Confirmed', desc: 'Sent to kitchen chefs', icon: ClipboardCheck },
    { key: 'preparing', label: 'Food Preparing', desc: 'Chefs are grilling & packing', icon: ChefHat },
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

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'new':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
      case 'out_for_delivery':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentOrder.status);

  const handleAdvanceStatus = () => {
    const sequence: ('new' | 'preparing' | 'ready' | 'completed')[] = [
      'new',
      'preparing',
      'ready',
      'completed',
    ];
    const nextIdx = (currentIndex + 1) % sequence.length;
    dispatch(updateOrderStatus({ orderId: currentOrder.id, status: sequence[nextIdx] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#E5E5E5] rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between bg-white">
          <div>
            <span className="text-[11px] font-bold text-[#F15A24] uppercase tracking-wider block">
              Live Delivery Status
            </span>
            <h2 className="text-[18px] sm:text-[19px] font-bold text-[#1A130E]">
              Order #{currentOrder.orderNumber}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                dispatch(setActiveTrackingOrderId(null));
                router.push(`/order-details/${currentOrder.id}`);
              }}
              className="text-[12px] font-semibold text-[#F15A24] hover:text-white hover:bg-[#F15A24] border border-[#F15A24] px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Details Page ➔
            </button>
            <button
              onClick={() => dispatch(setActiveTrackingOrderId(null))}
              className="w-9 h-9 rounded-full bg-neutral-100 text-[#555555] hover:text-[#1A130E] hover:bg-neutral-200/70 flex items-center justify-center border border-[#E5E5E5] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-[13px] sm:text-[14px]">
          {/* Estimated Time Card */}
          <div className="p-4 rounded-2xl bg-[rgb(249,249,249)] border border-[#E5E5E5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#F15A24] flex items-center justify-center shadow-xs border border-[#E5E5E5]">
                <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <span className="text-[11px] font-medium text-[#747474] block">Estimated Arrival</span>
                <span className="text-[16px] font-bold text-[#1A130E]">
                  {currentOrder.status === 'completed'
                    ? 'Delivered'
                    : `~${currentOrder.estimatedMinutes} Minutes`}
                </span>
              </div>
            </div>

            <button
              onClick={handleAdvanceStatus}
              className="text-[12px] font-semibold bg-white hover:bg-[#F15A24] text-[#F15A24] hover:text-white px-3.5 py-1.5 rounded-xl border border-[#F15A24] transition-colors shadow-xs"
            >
              Simulate Next Status ➔
            </button>
          </div>

          {/* Stepper */}
          <div className="space-y-4 pt-1">
            {steps.map((step, idx) => {
              const isFinished = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const Icon = step.icon;

              return (
                <div key={step.key} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isFinished
                          ? 'bg-[#0FA958] text-white font-bold shadow-xs'
                          : isCurrent
                          ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white font-bold ring-4 ring-orange-100 shadow-xs'
                          : 'bg-neutral-100 text-[#888888] border border-[#E5E5E5]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`w-0.5 h-7 my-1 transition-colors ${
                          idx < currentIndex ? 'bg-[#0FA958]' : 'bg-[#E5E5E5]'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pt-0.5">
                    <h4
                      className={`font-semibold text-[14px] whitespace-nowrap ${
                        isCurrent
                          ? 'text-[#F15A24]'
                          : isFinished
                          ? 'text-[#1A130E]'
                          : 'text-[#888888]'
                      }`}
                    >
                      {step.label}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Details */}
          <div className="p-4 rounded-2xl bg-[rgb(249,249,249)] border border-[#E5E5E5] space-y-2">
            <h5 className="font-semibold text-[12px] text-[#666666] uppercase tracking-wider">
              Items Ordered ({currentOrder.items.length})
            </h5>
            {currentOrder.items.map((item, i) => (
              <div key={i} className="flex justify-between text-[13px] sm:text-[14px] py-1 text-[#3D3D3D]">
                <span>
                  {item.quantity}x {item.dish.name}
                </span>
                <span className="font-bold text-[#1A130E]">
                  €{item.totalPrice.toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-[#E5E5E5] pt-2.5 flex justify-between text-[14px] font-bold text-[#1A130E]">
              <span>Total Paid</span>
              <span className="text-[#F15A24] text-[15px]">€{currentOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Destination */}
          {currentOrder.deliveryAddress && (
            <div className="p-4 rounded-2xl bg-white border border-[#E5E5E5] flex items-start gap-3 text-[13px] sm:text-[14px] text-[#3D3D3D] shadow-xs">
              <MapPin className="w-4 h-4 text-[#F15A24] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#1A130E]">Delivering to:</span>
                {currentOrder.deliveryAddress} ({currentOrder.eircode})
              </div>
            </div>
          )}

          {/* Post-Delivery Rating, Review & Reorder */}
          {currentOrder.status === 'completed' && (
            <div className="p-5 rounded-2xl bg-[rgb(249,249,249)] border border-[#E5E5E5] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[15px] text-[#1A130E]">Rate Your Dining Experience</h4>
                  <p className="text-[12px] text-[#666666]">How was the authentic flavor and delivery speed?</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= rating
                            ? 'fill-[#D49B37] text-[#D49B37]'
                            : 'text-[#D4D4D4]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {!reviewSubmitted ? (
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  {/* Feedback Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Authentic Flavor',
                      'Piping Hot',
                      'Generous Portion',
                      'Fast Delivery',
                      'Aromatic Spices',
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`px-3 py-1 rounded-lg text-[12px] font-medium transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white shadow-xs'
                            : 'bg-white border border-[#E5E5E5] text-[#555555] hover:border-[#F15A24]'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Comment box */}
                  <textarea
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell our Dublin kitchen chefs how you liked the spices..."
                    className="w-full bg-white border border-[#E5E5E5] rounded-xl p-3 text-[13px] text-[#3D3D3D] placeholder-[#9B8C80] focus:outline-none focus:border-[#F15A24]"
                  />

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white shadow-[0_4px_12px_rgba(184,74,34,0.3)] flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Submit Review</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReorder}
                      className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-white border border-[#E5E5E5] text-[#1A130E] hover:border-[#F15A24] hover:text-[#F15A24] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Re-order Meal</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-3.5 bg-white rounded-xl border border-[#0FA958]/30 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2 text-[13px] text-[#0FA958] font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Review submitted. Thank you for your feedback!</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleReorder}
                    className="px-3.5 py-1.5 rounded-xl text-[12px] font-semibold bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-order</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
