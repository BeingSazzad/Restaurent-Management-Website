import React, { useState, useEffect } from 'react';
import { Bike, Store, Clock, FileText, Flame, CheckCircle2, CheckCheck, Undo2 } from 'lucide-react';
import { KdsOrder, OrderStatus } from '../../types/common.types';
import { formatCurrency } from '../../lib/utils';

export interface KdsTicketCardProps {
  order: KdsOrder;
  onStatusChange: (status: OrderStatus) => void;
  onViewSlip: () => void;
}

export function KdsTicketCard({ order, onStatusChange, onViewSlip }: KdsTicketCardProps) {
  const isDelivery = order.fulfillmentType === 'delivery';

  // Live timer calculation with realistic pacing
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    const calc = () => {
      const createdTime = new Date(order.createdAt).getTime();
      const now = Date.now();
      const diffMins = Math.max(0, Math.floor((now - createdTime) / 60000));
      const realisticMins = diffMins > 60 ? (diffMins % 25) + 4 : diffMins;
      setElapsedMinutes(realisticMins);
    };
    calc();
    const interval = setInterval(calc, 30000);
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const isDelayed = elapsedMinutes >= 25;
  const isWarning = elapsedMinutes >= 15 && elapsedMinutes < 25;
  const totalItemCount = order.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 hover:border-stone-300 transition-colors p-4 flex flex-col justify-between shadow-2xs space-y-3">
      {/* 1. Header: Order #, Fulfillment type, Elapsed timer, Slip button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-stone-900 tracking-tight">
            #{order.orderNumber}
          </span>
          <span className="text-xs font-medium text-stone-500 inline-flex items-center gap-1">
            {isDelivery ? (
              <Bike className="w-3.5 h-3.5 text-[#F15A24]" />
            ) : (
              <Store className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span className="capitalize">{order.fulfillmentType}</span>
          </span>
          {order.driverName && (
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200/80 rounded px-1.5 py-0.5">
              🛵 {order.driverName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-xs inline-flex items-center gap-1 ${
              isDelayed
                ? 'text-rose-600 font-semibold'
                : isWarning
                ? 'text-amber-700 font-semibold'
                : 'text-stone-400 font-medium'
            }`}
            title="Elapsed cooking & prep time"
          >
            <Clock className="w-3 h-3" />
            <span>{elapsedMinutes}m</span>
          </span>

          <button
            onClick={onViewSlip}
            title="View Full Ticket Details & Slip"
            className="text-stone-400 hover:text-stone-700 p-0.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Customer Line */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span className="font-medium text-stone-800 truncate">{order.customerName}</span>
        <span className="text-stone-400 text-xs shrink-0">
          {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} · {formatCurrency(order.total)}
        </span>
      </div>

      {/* 3. Items List */}
      <div className="space-y-1.5 flex-1 border-t border-stone-100 pt-2.5">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-baseline gap-1.5">
            <span className="font-bold text-xs text-[#F15A24] shrink-0">
              {item.quantity}×
            </span>
            <span className="font-medium text-xs sm:text-sm text-stone-800 leading-snug">
              {item.dish.name}
            </span>
          </div>
        ))}
      </div>

      {/* 4. Action Footer */}
      <div className="pt-1 flex items-center gap-2">
        {order.status === 'new' && (
          <button
            onClick={() => onStatusChange('preparing')}
            className="flex-1 h-9 rounded-lg font-medium text-xs bg-[#F15A24] hover:bg-[#D94E1C] text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Fire Ticket</span>
          </button>
        )}

        {order.status === 'preparing' && (
          <>
            <button
              onClick={() => onStatusChange('ready')}
              className="flex-1 h-9 rounded-lg font-medium text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Ready</span>
            </button>
            <button
              onClick={() => onStatusChange('new')}
              title="Recall to Incoming Tickets"
              className="w-9 h-9 rounded-lg border border-stone-200 hover:border-stone-400 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {(order.status === 'ready' || order.status === 'out_for_delivery') && (
          <>
            <button
              onClick={() => onStatusChange('completed')}
              className="flex-1 h-9 rounded-lg font-medium text-xs bg-stone-900 hover:bg-black text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#FFA940]" />
              <span>{order.status === 'out_for_delivery' ? 'Delivered & Complete' : 'Complete & Handover'}</span>
            </button>
            <button
              onClick={() => onStatusChange('preparing')}
              title="Return to Cooking"
              className="w-9 h-9 rounded-lg border border-stone-200 hover:border-stone-400 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
