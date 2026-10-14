'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearCart } from '../../redux/slices/cartSlice';
import { setCheckoutOpen } from '../../redux/slices/fulfillmentSlice';
import { createOrder, setActiveTrackingOrderId } from '../../redux/slices/orderSlice';
import { OrderItem, RESTAURANT_INFO } from '../../Mockdata';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  CheckCircle2,
  Bike,
  Store,
  MapPin,
  Phone,
  User,
  Mail,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const fulfillment = useAppSelector((state) => state.fulfillment);
  const cart = useAppSelector((state) => state.cart);

  const [name, setName] = useState('Mark Jecno');
  const [phone, setPhone] = useState('+353 87 123 4567');
  const [email, setEmail] = useState('mark.jecno@example.com');
  const [address, setAddress] = useState(fulfillment.customerAddress);
  const [eircode, setEircode] = useState(fulfillment.eircode);
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cash'>('apple_pay');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!fulfillment.isCheckoutOpen) return null;

  const subtotal = cart.items.reduce((acc, i) => acc + i.totalPrice, 0);
  const isFreeDelivery = subtotal >= RESTAURANT_INFO.freeDeliveryThreshold;
  const deliveryFee =
    fulfillment.type === 'delivery'
      ? isFreeDelivery
        ? 0
        : fulfillment.selectedZone?.fee || RESTAURANT_INFO.baseDeliveryFee
      : 0;
  const discount = (subtotal * cart.discountPercentage) / 100;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderNumber = `ZM-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder: OrderItem = {
        id: orderId,
        orderNumber,
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        fulfillmentType: fulfillment.type,
        deliveryAddress: fulfillment.type === 'delivery' ? address : undefined,
        eircode: fulfillment.type === 'delivery' ? eircode : undefined,
        items: [...cart.items],
        subtotal,
        deliveryFee,
        discount,
        total,
        status: 'new',
        createdAt: new Date().toISOString(),
        estimatedMinutes: fulfillment.type === 'delivery' ? 35 : 20,
        specialNotes: specialNotes || undefined,
        paymentMethod,
      };

      dispatch(createOrder(newOrder));
      dispatch(setActiveTrackingOrderId(orderId));
      dispatch(clearCart());
      dispatch(setCheckoutOpen(false));
      setIsSubmitting(false);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#FF8D2F', '#0FA958', '#0D6EFD'],
      });
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#EBEBEB] rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-[#EBEBEB] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-lg font-extrabold text-[#1F1F1F]">Fast Checkout</h2>
            <p className="text-xs text-[#747474] flex items-center gap-1.5 mt-0.5">
              {fulfillment.type === 'delivery' ? (
                <>
                  <Bike className="w-3.5 h-3.5 text-[#0FA958]" />
                  <span>Doorstep Delivery · ~35 mins</span>
                </>
              ) : (
                <>
                  <Store className="w-3.5 h-3.5 text-[#FF8D2F]" />
                  <span>Restaurant Collection · ~20 mins</span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={() => dispatch(setCheckoutOpen(false))}
            className="w-8 h-8 rounded-full bg-[#F9F9F9] text-[#747474] hover:text-[#1F1F1F] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF8D2F] mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4" /> 1. Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#747474] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F9F9F9] border border-[#EBEBEB] rounded-xl px-3 py-2 text-xs text-[#3D3D3D] focus:outline-none focus:border-[#FF8D2F]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#747474] mb-1">Mobile Phone (for delivery SMS)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F9F9F9] border border-[#EBEBEB] rounded-xl px-3 py-2 text-xs text-[#3D3D3D] focus:outline-none focus:border-[#FF8D2F]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-[#747474] mb-1">Email (for digital receipt)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F9F9F9] border border-[#EBEBEB] rounded-xl px-3 py-2 text-xs text-[#3D3D3D] focus:outline-none focus:border-[#FF8D2F]"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {fulfillment.type === 'delivery' && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF8D2F] mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> 2. Delivery Address in Dublin
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-[#747474] mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 14 South William St, Apt 3"
                      className="w-full bg-[#F9F9F9] border border-[#EBEBEB] rounded-xl px-3 py-2 text-xs text-[#3D3D3D] focus:outline-none focus:border-[#FF8D2F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#747474] mb-1">Dublin Eircode</label>
                    <input
                      type="text"
                      required
                      value={eircode}
                      onChange={(e) => setEircode(e.target.value.toUpperCase())}
                      placeholder="D02 P682"
                      className="w-full bg-[#F9F9F9] border border-[#EBEBEB] rounded-xl px-3 py-2 text-xs text-[#3D3D3D] focus:outline-none focus:border-[#FF8D2F] uppercase"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#747474] mb-1">
                    Buzzer / Gate Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Ring Apt 3 buzzer, leave at reception"
                    className="w-full bg-[#F9F9F9] border border-[#EBEBEB] rounded-xl px-3 py-2 text-xs text-[#3D3D3D] focus:outline-none focus:border-[#FF8D2F]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF8D2F] mb-3 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" /> 3. Select Payment Method
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'apple_pay'
                    ? 'bg-[#FFF4EC] border-[#FF8D2F] text-[#FF8D2F] font-bold shadow-sm'
                    : 'bg-[#F9F9F9] border-[#EBEBEB] text-[#747474] hover:border-[#FF8D2F]'
                }`}
              >
                <span className="text-xs font-bold"> Pay / GPay</span>
                <span className="text-[10px] text-[#747474]">1-Click Instant</span>
              </div>

              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'card'
                    ? 'bg-[#FFF4EC] border-[#FF8D2F] text-[#FF8D2F] font-bold shadow-sm'
                    : 'bg-[#F9F9F9] border-[#EBEBEB] text-[#747474] hover:border-[#FF8D2F]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-xs font-semibold">Credit/Debit</span>
              </div>

              <div
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'cash'
                    ? 'bg-[#FFF4EC] border-[#FF8D2F] text-[#FF8D2F] font-bold shadow-sm'
                    : 'bg-[#F9F9F9] border-[#EBEBEB] text-[#747474] hover:border-[#FF8D2F]'
                }`}
              >
                <span className="text-xs">💵</span>
                <span className="text-xs font-semibold">
                  {fulfillment.type === 'delivery' ? 'Cash on Delivery' : 'Pay at Store'}
                </span>
              </div>
            </div>
          </div>

          {/* Secure SSL Tag */}
          <div className="flex items-center gap-2 p-3 bg-[#F9F9F9] rounded-xl text-[11px] text-[#747474] border border-[#EBEBEB]">
            <Lock className="w-3.5 h-3.5 text-[#0FA958]" />
            <span>256-bit encrypted checkout. PCI-DSS and GDPR compliant.</span>
          </div>

          {/* Submit Order */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-amber-primary py-3.5 px-6 text-sm font-bold flex items-center justify-between shadow-amber disabled:opacity-60"
          >
            <span>{isSubmitting ? 'Placing Order...' : 'Place Order Now'}</span>
            <span>€{total.toFixed(2)}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
