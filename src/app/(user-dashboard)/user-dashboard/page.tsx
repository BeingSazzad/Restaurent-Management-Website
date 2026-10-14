'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToCart, setCartOpen } from '@/redux/slices/cartSlice';
import { setActiveTrackingOrderId } from '@/redux/slices/orderSlice';
import { MOCK_USER } from '@/Mockdata';
import { MapPin, RotateCcw, Clock, ArrowRight } from 'lucide-react';

export default function UserDashboardPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach((item) => {
      dispatch(
        addToCart({
          ...item,
          cartItemId: `${item.dish.id}-${Date.now()}-${Math.random()}`,
        })
      );
    });
    dispatch(setCartOpen(true));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer Profile */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#EBE2D7] shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#F3ECE2] text-[#B84A22] flex items-center justify-center font-bold text-2xl mb-4 border border-[#E9DFD3]">
              {MOCK_USER.name.charAt(0)}
            </div>
            <h2 className="text-lg font-bold text-[#1A130E]">{MOCK_USER.name}</h2>
            <p className="text-xs text-[#747474] mb-1">{MOCK_USER.email}</p>
            <div className="text-xs text-[#B84A22] font-semibold mb-6">{MOCK_USER.phone}</div>

            <div className="pt-4 border-t border-[#EBE2D7] space-y-3 text-xs">
              <span className="text-[#747474] font-semibold uppercase tracking-wider block text-[11px]">
                Saved Delivery Addresses
              </span>
              {MOCK_USER.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3.5 rounded-2xl bg-[#FAF6EF] border border-[#EBE2D7] flex items-start gap-2.5"
                >
                  <MapPin className="w-4 h-4 text-[#B84A22] shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1A130E]">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-[#F3ECE2] text-[#B84A22] px-2 py-0.5 rounded-full font-semibold border border-[#E9DFD3]">
                          Default
                        </span>
                      )}
                    </div>
                    <span className="text-[#747474] block text-[11px] mt-0.5">
                      {addr.address} ({addr.eircode})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <div className="section-decorator" />
            <h1 className="section-title mb-1">
              My Orders & Receipts
            </h1>
            <p className="section-subtitle">
              Track active food deliveries or re-order your favorite royal dishes in one click
            </p>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-white border border-[#EBE2D7] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="font-bold text-sm text-[#1A130E]">
                      #{order.orderNumber}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                        order.status === 'completed'
                          ? 'bg-[#F4EDE2] text-[#747474]'
                          : 'bg-[#F3ECE2] text-[#B84A22] border border-[#E9DFD3]'
                      }`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[#9B8C80]">
                      {new Date(order.createdAt).toLocaleDateString('en-IE', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-[#3D3D3D] mb-2 font-normal">
                    {order.items.map((i) => `${i.quantity}x ${i.dish.name}`).join(', ')}
                  </p>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-bold text-[#B84A22] text-sm">
                      €{order.total.toFixed(2)}
                    </span>
                    <span className="text-[#EBE2D7]">|</span>
                    <span className="text-[#747474] capitalize">{order.fulfillmentType}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => dispatch(setActiveTrackingOrderId(order.id))}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-full text-xs font-semibold bg-[#FAF6EF] hover:bg-[#F3ECE2] text-[#3D3D3D] border border-[#EBE2D7] transition-colors"
                  >
                    Track Status
                  </button>
                  <button
                    onClick={() => handleReorder(order)}
                    className="flex-1 sm:flex-initial btn-amber-primary px-4 py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
