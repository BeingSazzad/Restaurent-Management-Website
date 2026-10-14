'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setActiveTrackingOrderId, updateOrderStatus } from '../../redux/slices/orderSlice';
import {
  CheckCircle2,
  Clock,
  Bike,
  Store,
  ChefHat,
  MapPin,
  X,
  Sparkles,
} from 'lucide-react';

export const OrderTrackerModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeOrderId = useAppSelector((state) => state.orders.activeTrackingOrderId);
  const orders = useAppSelector((state) => state.orders.orders);

  if (!activeOrderId) return null;

  const currentOrder = orders.find((o) => o.id === activeOrderId);
  if (!currentOrder) return null;

  const steps = [
    { key: 'new', label: 'Order Confirmed', desc: 'Sent to restaurant kitchen', icon: CheckCircle2 },
    { key: 'preparing', label: 'Food Preparing', desc: 'Chefs are grilling & packing', icon: ChefHat },
    {
      key: 'ready',
      label: currentOrder.fulfillmentType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup',
      desc: currentOrder.fulfillmentType === 'delivery' ? 'Driver is on the way' : 'Collect at restaurant counter',
      icon: currentOrder.fulfillmentType === 'delivery' ? Bike : Store,
    },
    { key: 'completed', label: 'Order Delivered', desc: 'Enjoy your hot delicious meal!', icon: Sparkles },
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
      <div className="bg-white border border-[#EBE2D7] rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-[#EBE2D7] flex items-center justify-between bg-white">
          <div>
            <span className="text-[10px] font-bold text-[#B84A22] uppercase tracking-wider block">
              Live Delivery Status
            </span>
            <h2 className="text-lg font-bold text-[#1A130E]">
              Order #{currentOrder.orderNumber}
            </h2>
          </div>
          <button
            onClick={() => dispatch(setActiveTrackingOrderId(null))}
            className="w-8 h-8 rounded-full bg-[#FAF6EF] text-[#747474] hover:text-[#1A130E] flex items-center justify-center border border-[#EBE2D7]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Estimated Time Card */}
          <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#EBE2D7] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#B84A22] flex items-center justify-center shadow-sm border border-[#EBE2D7]">
                <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <span className="text-[11px] text-[#747474] block">Estimated Arrival</span>
                <span className="text-base font-bold text-[#1A130E]">
                  {currentOrder.status === 'completed'
                    ? 'Delivered'
                    : `~${currentOrder.estimatedMinutes} Minutes`}
                </span>
              </div>
            </div>

            <button
              onClick={handleAdvanceStatus}
              className="text-[11px] font-semibold bg-white hover:bg-[#B84A22] text-[#B84A22] hover:text-white px-3 py-1.5 rounded-full border border-[#B84A22] transition-colors shadow-sm"
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isFinished
                          ? 'bg-[#0FA958] text-white font-bold'
                          : isCurrent
                          ? 'bg-[#B84A22] text-white font-bold ring-4 ring-[#F3ECE2]'
                          : 'bg-[#F4EDE2] text-[#9B8C80]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`w-0.5 h-7 my-1 transition-colors ${
                          idx < currentIndex ? 'bg-[#0FA958]' : 'bg-[#EBE2D7]'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pt-0.5">
                    <h4
                      className={`font-bold text-xs ${
                        isCurrent
                          ? 'text-[#B84A22]'
                          : isFinished
                          ? 'text-[#1A130E]'
                          : 'text-[#9B8C80]'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-[#747474]">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Details */}
          <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#EBE2D7] space-y-2">
            <h5 className="font-semibold text-[11px] text-[#747474] uppercase tracking-wider">
              Items Ordered ({currentOrder.items.length})
            </h5>
            {currentOrder.items.map((item, i) => (
              <div key={i} className="flex justify-between text-xs py-0.5 text-[#3D3D3D]">
                <span>
                  {item.quantity}x {item.dish.name}
                </span>
                <span className="font-bold text-[#1A130E]">
                  €{item.totalPrice.toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-[#EBE2D7] pt-2 flex justify-between text-xs font-bold text-[#1A130E]">
              <span>Total Paid</span>
              <span className="text-[#B84A22]">€{currentOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Destination */}
          {currentOrder.deliveryAddress && (
            <div className="p-3.5 rounded-2xl bg-white border border-[#EBE2D7] flex items-start gap-3 text-xs text-[#3D3D3D] shadow-sm">
              <MapPin className="w-4 h-4 text-[#B84A22] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#1A130E]">Delivering to:</span>
                {currentOrder.deliveryAddress} ({currentOrder.eircode})
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
