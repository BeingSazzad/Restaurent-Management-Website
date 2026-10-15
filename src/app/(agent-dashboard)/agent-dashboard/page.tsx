'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateOrderStatus, toggleKitchenSnooze } from '@/redux/slices/orderSlice';
import { toggleItemAvailability } from '@/redux/slices/menuSlice';
import { OrderItem } from '@/Mockdata';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Volume2,
  Bike,
  Store,
  Printer,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export default function AgentDashboardPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const menuItems = useAppSelector((state) => state.menu.items);
  const kitchenSnooze = useAppSelector((state) => state.orders.kitchenSnoozeActive);
  const [selectedTab, setSelectedTab] = useState<'kds' | 'menu-86' | 'sales'>('kds');

  // Play audio chime using Web Audio API
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.log('Audio chime not supported');
    }
  };

  const newOrders = orders.filter((o) => o.status === 'new');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const readyOrders = orders.filter(
    (o) => o.status === 'ready' || o.status === 'out_for_delivery'
  );

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const deliveryCount = orders.filter((o) => o.fulfillmentType === 'delivery').length;
  const collectionCount = orders.filter((o) => o.fulfillmentType === 'collection').length;

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#3D3D3D] p-4 sm:p-6 lg:p-8">
      {/* Top Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF4EC] text-[#FF8D2F] flex items-center justify-center font-bold">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F1F1F]">
                Kitchen Display System (KDS)
              </h1>
              <span className="bg-[#0FA958]/10 text-[#0FA958] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0FA958] animate-ping inline-block" />
                Live Orders
              </span>
            </div>
            <p className="text-xs text-[#747474]">
              Real-time kitchen order dispatch & instant sold-out controls
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={playChime}
            className="px-3.5 py-2 rounded-xl text-xs bg-[#F9F9F9] hover:bg-[#FFF4EC] border border-[#EBEBEB] hover:border-[#FF8D2F] text-[#3D3D3D] flex items-center gap-1.5 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#FF8D2F]" />
            <span>Sound Bell</span>
          </button>

          <button
            onClick={() => dispatch(toggleKitchenSnooze(20))}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              kitchenSnooze
                ? 'bg-[#E23744] text-white shadow-sm'
                : 'bg-[#F9F9F9] text-[#3D3D3D] border border-[#EBEBEB] hover:border-[#FF8D2F]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{kitchenSnooze ? 'Rush Mode ACTIVE (+20m)' : 'Rush Mode (+20m)'}</span>
          </button>

          <div className="flex bg-[#F1F1F1] p-1 rounded-xl">
            <button
              onClick={() => setSelectedTab('kds')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
                selectedTab === 'kds'
                  ? 'bg-white text-[#FF8D2F] shadow-sm'
                  : 'text-[#747474] hover:text-[#1F1F1F]'
              }`}
            >
              KDS Screen ({orders.length})
            </button>
            <button
              onClick={() => setSelectedTab('menu-86')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
                selectedTab === 'menu-86'
                  ? 'bg-white text-[#FF8D2F] shadow-sm'
                  : 'text-[#747474] hover:text-[#1F1F1F]'
              }`}
            >
              86 Sold-Out ({menuItems.filter((i) => !i.isAvailable).length})
            </button>
            <button
              onClick={() => setSelectedTab('sales')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
                selectedTab === 'sales'
                  ? 'bg-white text-[#FF8D2F] shadow-sm'
                  : 'text-[#747474] hover:text-[#1F1F1F]'
              }`}
            >
              Z-Report
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: KDS COLUMNS */}
      {selectedTab === 'kds' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* COLUMN 1: NEW INCOMING ORDERS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#EBEBEB] shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E23744] animate-pulse" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#1F1F1F]">
                    New Orders
                  </h3>
                </div>
                <span className="bg-[#E23744]/10 text-[#E23744] px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                  {newOrders.length}
                </span>
              </div>

              {newOrders.length === 0 ? (
                <div className="text-center py-12 bg-white border border-dashed border-[#EBEBEB] rounded-2xl text-xs text-[#A0A0A0]">
                  No new orders waiting
                </div>
              ) : (
                newOrders.map((order) => (
                  <KdsOrderTicket
                    key={order.id}
                    order={order}
                    onStatusChange={(status) =>
                      dispatch(updateOrderStatus({ orderId: order.id, status }))
                    }
                  />
                ))
              )}
            </div>

            {/* COLUMN 2: PREPARING IN KITCHEN */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#EBEBEB] shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF8D2F]" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#1F1F1F]">
                    Cooking / Grilling
                  </h3>
                </div>
                <span className="bg-[#FFF4EC] text-[#FF8D2F] px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                  {preparingOrders.length}
                </span>
              </div>

              {preparingOrders.length === 0 ? (
                <div className="text-center py-12 bg-white border border-dashed border-[#EBEBEB] rounded-2xl text-xs text-[#A0A0A0]">
                  No food cooking right now
                </div>
              ) : (
                preparingOrders.map((order) => (
                  <KdsOrderTicket
                    key={order.id}
                    order={order}
                    onStatusChange={(status) =>
                      dispatch(updateOrderStatus({ orderId: order.id, status }))
                    }
                  />
                ))
              )}
            </div>

            {/* COLUMN 3: READY FOR DISPATCH / PICKUP */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#EBEBEB] shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0FA958]" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#1F1F1F]">
                    Ready / Out for Delivery
                  </h3>
                </div>
                <span className="bg-[#0FA958]/10 text-[#0FA958] px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                  {readyOrders.length}
                </span>
              </div>

              {readyOrders.length === 0 ? (
                <div className="text-center py-12 bg-white border border-dashed border-[#EBEBEB] rounded-2xl text-xs text-[#A0A0A0]">
                  No ready orders
                </div>
              ) : (
                readyOrders.map((order) => (
                  <KdsOrderTicket
                    key={order.id}
                    order={order}
                    onStatusChange={(status) =>
                      dispatch(updateOrderStatus({ orderId: order.id, status }))
                    }
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 1-TAP SOLD-OUT (86) MANAGER */}
      {selectedTab === 'menu-86' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-sm mb-6">
            <h2 className="font-bold text-base text-[#1F1F1F]">
              Instant Menu Availability Switch (86ing)
            </h2>
            <p className="text-xs text-[#747474] mt-0.5">
              Click &ldquo;Sold Out&rdquo; to immediately grey out the dish on the customer storefront.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map((dish) => (
              <div
                key={dish.id}
                className="p-4 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-[#1F1F1F] truncate">
                      {dish.name}
                    </h4>
                    <span className="text-[11px] text-[#FF8D2F] font-semibold block">
                      €{dish.price.toFixed(2)} · {dish.categoryLabel}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => dispatch(toggleItemAvailability(dish.id))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    dish.isAvailable
                      ? 'bg-[#0FA958]/10 text-[#0FA958] hover:bg-[#0FA958]/20'
                      : 'bg-[#E23744]/10 text-[#E23744] hover:bg-[#E23744]/20'
                  }`}
                >
                  {dish.isAvailable ? '✓ In Stock' : '✕ Sold Out'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DAILY Z-REPORT */}
      {selectedTab === 'sales' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#EBEBEB] shadow-sm">
              <span className="text-xs text-[#747474] uppercase font-bold">Today&apos;s Revenue</span>
              <div className="text-3xl font-extrabold text-[#FF8D2F] mt-2">
                €{totalRevenue.toFixed(2)}
              </div>
              <span className="text-xs text-[#0FA958] flex items-center gap-1 mt-1 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" /> +18% vs yesterday
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#EBEBEB] shadow-sm">
              <span className="text-xs text-[#747474] uppercase font-bold">Orders Volume</span>
              <div className="text-3xl font-extrabold text-[#1F1F1F] mt-2">
                {orders.length} Orders
              </div>
              <span className="text-xs text-[#747474] mt-1 block">
                {deliveryCount} Delivery · {collectionCount} Pickup
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#EBEBEB] shadow-sm">
              <span className="text-xs text-[#747474] uppercase font-bold">Average Order Value</span>
              <div className="text-3xl font-extrabold text-[#1F1F1F] mt-2">
                €{(totalRevenue / (orders.length || 1)).toFixed(2)}
              </div>
              <span className="text-xs text-[#747474] mt-1 block">Stripe Ireland Settlement</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KdsOrderTicket({
  order,
  onStatusChange,
}: {
  order: OrderItem;
  onStatusChange: (status: OrderItem['status']) => void;
}) {
  const isDelivery = order.fulfillmentType === 'delivery';

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] shadow-sm overflow-hidden text-xs">
      {/* Header */}
      <div className="p-3.5 bg-[#F9F9F9] border-b border-[#EBEBEB] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm text-[#1F1F1F]">
            #{order.orderNumber}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${
              isDelivery
                ? 'bg-[#FFF4EC] text-[#FF8D2F]'
                : 'bg-[#0FA958]/10 text-[#0FA958]'
            }`}
          >
            {isDelivery ? <Bike className="w-3 h-3" /> : <Store className="w-3 h-3" />}
            {order.fulfillmentType}
          </span>
        </div>

        <button
          onClick={() => window.print()}
          className="text-[#747474] hover:text-[#1F1F1F] p-1"
        >
          <Printer className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Customer Info */}
      <div className="p-3 border-b border-[#F1F1F1] flex justify-between items-center text-[11px] text-[#747474]">
        <div>
          <span className="font-bold text-[#1F1F1F] block">{order.customerName}</span>
          <span>{order.customerPhone}</span>
        </div>
        <span className="font-bold text-[#1F1F1F]">€{order.total.toFixed(2)}</span>
      </div>

      {/* Items */}
      <div className="p-3 space-y-2">
        {order.items.map((item, idx) => (
          <div key={idx} className="pb-1.5 border-b border-[#F9F9F9] last:border-0 last:pb-0">
            <div className="flex justify-between font-bold text-[#1F1F1F]">
              <span>
                {item.quantity}x {item.dish.name}
              </span>
            </div>
            {item.selectedModifiers.map((mod, mIdx) => (
              <span key={mIdx} className="text-[11px] text-[#FF8D2F] block ml-2">
                • {mod.optionName}
              </span>
            ))}
            {item.specialInstructions && (
              <div className="mt-1 bg-[#FFF4EC] text-[#FF8D2F] px-2 py-0.5 rounded text-[10px] font-bold">
                ⚠️ {item.specialInstructions}
              </div>
            )}
          </div>
        ))}

        {order.specialNotes && (
          <div className="mt-1 text-[10px] text-[#747474] bg-[#F9F9F9] p-1.5 rounded">
            Note: {order.specialNotes}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 bg-[#F9F9F9] border-t border-[#EBEBEB] flex gap-2">
        {order.status === 'new' && (
          <button
            onClick={() => onStatusChange('preparing')}
            className="w-full zomo-btn-primary py-2 text-xs font-bold"
          >
            Start Preparing (25m)
          </button>
        )}
        {order.status === 'preparing' && (
          <button
            onClick={() => onStatusChange('ready')}
            className="w-full bg-[#0FA958] hover:bg-[#0E974F] text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark Ready for Pickup</span>
          </button>
        )}
        {order.status === 'ready' && (
          <button
            onClick={() => onStatusChange('completed')}
            className="w-full bg-[#1F1F1F] hover:bg-black text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF8D2F]" />
            <span>Handover & Complete</span>
          </button>
        )}
      </div>
    </div>
  );
}
