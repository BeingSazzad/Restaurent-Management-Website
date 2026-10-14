'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToCart, setCartOpen } from '@/redux/slices/cartSlice';
import { setActiveTrackingOrderId } from '@/redux/slices/orderSlice';
import { MOCK_USER } from '@/Mockdata';
import { User, MapPin, Clock, RotateCcw, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

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
          <div className="p-6 rounded-3xl bg-white border border-[#EBEBEB] shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FFF4EC] text-[#FF8D2F] flex items-center justify-center font-black text-2xl mb-4 border border-[#FFE0CC]">
              {MOCK_USER.name.charAt(0)}
            </div>
            <h2 className="text-lg font-extrabold text-[#1F1F1F]">{MOCK_USER.name}</h2>
            <p className="text-xs text-[#747474] mb-2">{MOCK_USER.email}</p>
            <div className="text-xs text-[#FF8D2F] font-bold mb-6">{MOCK_USER.phone}</div>

            <div className="pt-4 border-t border-[#F1F1F1] space-y-3 text-xs">
              <span className="text-[#747474] font-bold uppercase tracking-wider block text-[11px]">
                Saved Delivery Addresses:
              </span>
              {MOCK_USER.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3 rounded-2xl bg-[#F9F9F9] border border-[#EBEBEB] flex items-start gap-2.5"
                >
                  <MapPin className="w-4 h-4 text-[#FF8D2F] shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1F1F1F]">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-[#FFF4EC] text-[#FF8D2F] px-1.5 py-0.2 rounded-full font-bold">
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
            <h1 className="text-2xl font-extrabold text-[#1F1F1F] mb-1">
              My Orders & Receipts
            </h1>
            <p className="text-xs text-[#747474]">
              Track active food deliveries or re-order your favorite dishes in one click
            </p>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="font-extrabold text-sm text-[#1F1F1F]">
                      #{order.orderNumber}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        order.status === 'completed'
                          ? 'bg-[#F1F1F1] text-[#747474]'
                          : 'bg-[#FFF4EC] text-[#FF8D2F]'
                      }`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[#A0A0A0]">
                      {new Date(order.createdAt).toLocaleDateString('en-IE', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-[#3D3D3D] mb-2 font-medium">
                    {order.items.map((i) => `${i.quantity}x ${i.dish.name}`).join(', ')}
                  </p>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-extrabold text-[#FF8D2F] text-sm">
                      €{order.total.toFixed(2)}
                    </span>
                    <span className="text-[#EBEBEB]">|</span>
                    <span className="text-[#747474] capitalize">{order.fulfillmentType}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => dispatch(setActiveTrackingOrderId(order.id))}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-full text-xs font-semibold bg-[#F9F9F9] hover:bg-[#F1F1F1] text-[#3D3D3D] border border-[#EBEBEB] transition-colors"
                  >
                    Track Status
                  </button>
                  <button
                    onClick={() => handleReorder(order)}
                    className="flex-1 sm:flex-initial zomo-btn-primary px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5"
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
