import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { KdsOrder } from '../../types/common.types';
import { formatCurrency } from '../../lib/utils';
import { RESTAURANT_BRAND } from '../../lib/constants';
import { Printer, MapPin, Phone, AlertTriangle, User } from 'lucide-react';

export interface TicketSlipModalProps {
  order: KdsOrder | null;
  onClose: () => void;
}

export function TicketSlipModal({ order, onClose }: TicketSlipModalProps) {
  const [tab, setTab] = useState<'details' | 'slip'>('details');

  if (!order) return null;

  return (
    <Modal
      isOpen={!!order}
      onClose={onClose}
      title={`Ticket #${order.orderNumber}`}
      footer={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTab('details')}
              className={`h-8 px-3 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                tab === 'details'
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              Order Details
            </button>
            <button
              onClick={() => setTab('slip')}
              className={`h-8 px-3 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                tab === 'slip'
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              Thermal Slip
            </button>
          </div>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={() => window.print()}
          >
            Print Ticket
          </Button>
        </div>
      }
    >
      {tab === 'details' ? (
        <div className="space-y-4 text-xs">
          {/* Customer info card */}
          <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 border border-stone-200/80">
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Customer:</span>
              <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>{order.customerName}</span>
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-stone-200/60">
              <span className="text-stone-500">Contact:</span>
              <a href={`tel:${order.customerPhone}`} className="font-semibold text-[#F15A24] flex items-center gap-1 hover:underline">
                <Phone className="w-3 h-3" />
                <span>{order.customerPhone}</span>
              </a>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-stone-200/60">
              <span className="text-stone-500">Order Type:</span>
              <span className="font-semibold text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-700">
                {order.fulfillmentType}
              </span>
            </div>
            {order.deliveryAddress && (
              <div className="flex justify-between items-start pt-1 border-t border-stone-200/60">
                <span className="text-stone-500">Address:</span>
                <span className="font-medium text-stone-900 text-right flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#F15A24] shrink-0" />
                  <span>{order.deliveryAddress} ({order.eircode})</span>
                </span>
              </div>
            )}
          </div>

          {/* Special Notes */}
          {order.specialNotes && (
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200/80 text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{order.specialNotes}</p>
            </div>
          )}

          {/* Items */}
          <div className="space-y-2">
            <h4 className="font-semibold text-stone-800 text-xs uppercase tracking-wider">
              Items ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
            </h4>
            <div className="divide-y divide-stone-100 border border-stone-200/80 rounded-xl bg-white overflow-hidden">
              {order.items.map((i, idx) => (
                <div key={idx} className="p-3 flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-stone-900">
                      {i.quantity}× {i.dish.name}
                    </div>
                    {i.selectedModifiers.map((m, mIdx) => (
                      <p key={mIdx} className="text-stone-500 pl-4 text-[11px]">
                        • {m.optionName}
                      </p>
                    ))}
                    {i.specialInstructions && (
                      <p className="text-amber-700 pl-4 text-[11px] font-medium">
                        ⚠ {i.specialInstructions}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-stone-900">{formatCurrency(i.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
            <span>Total Paid ({order.paymentMethod.toUpperCase()})</span>
            <span className="text-[#F15A24]">{formatCurrency(order.total)}</span>
          </div>
        </div>
      ) : (
        /* Thermal Slip Preview */
        <div className="bg-[#FAF8F5] p-5 rounded-xl border border-dashed border-stone-300 font-mono text-xs space-y-2 max-w-xs mx-auto">
          <div className="text-center pb-2 border-b border-dashed border-stone-300">
            <h4 className="font-bold text-sm">{RESTAURANT_BRAND.name}</h4>
            <p className="text-[10px] text-stone-500">{RESTAURANT_BRAND.location}</p>
            <p className="font-bold text-[11px] text-[#F15A24] mt-1">*** KITCHEN EXPO TICKET ***</p>
          </div>
          <div className="flex justify-between font-bold">
            <span>#{order.orderNumber}</span>
            <span>{order.fulfillmentType.toUpperCase()}</span>
          </div>
          <div className="text-[11px] text-stone-600">
            <span>Customer: {order.customerName}</span>
            <br />
            <span>Time: {new Date(order.createdAt).toLocaleTimeString()}</span>
          </div>
          <div className="border-t border-dashed border-stone-300 pt-2 space-y-1">
            {order.items.map((i, idx) => (
              <div key={idx} className="flex justify-between font-bold">
                <span>{i.quantity}x {i.dish.name}</span>
                <span>{formatCurrency(i.totalPrice)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-stone-300 pt-2 flex justify-between font-bold">
            <span>TOTAL</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      )}
    </Modal>
  );
}
