'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearCart } from '../../redux/slices/cartSlice';
import { setCheckoutOpen } from '../../redux/slices/fulfillmentSlice';
import { createOrder, setActiveTrackingOrderId } from '../../redux/slices/orderSlice';
import { OrderItem, RESTAURANT_INFO } from '../../Mockdata';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  Bike,
  Store,
  MapPin,
  User,
  ChevronDown,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fulfillment = useAppSelector((state) => state.fulfillment);
  const cart = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || 'Sarah Ahmed');
  const [phone, setPhone] = useState(user?.phone || '+353 87 234 5678');
  const [email, setEmail] = useState(user?.email || 'sarah.ahmed@dublin.ie');
  const [address, setAddress] = useState(fulfillment.customerAddress);
  const [eircode, setEircode] = useState(fulfillment.eircode);
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cash'>('apple_pay');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

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
      const orderNumber = `AS-${Math.floor(1000 + Math.random() * 9000)}`;

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
      dispatch(setActiveTrackingOrderId(null));
      dispatch(clearCart());
      dispatch(setCheckoutOpen(false));
      setIsSubmitting(false);

      // Senior UX Architecture: Seamlessly navigate to dedicated Order Details & Live Tracking Page
      router.push(`/order-details/${orderId}`);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#B84A22', '#D49B37', '#0FA958'],
      });
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#E5E5E5] rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-[18px] sm:text-[20px] font-bold text-[#1A130E]">Checkout</h2>
            <p className="text-[12px] text-[#747474] flex items-center gap-1.5 mt-0.5">
              {fulfillment.type === 'delivery' ? (
                <>
                  <Bike className="w-3.5 h-3.5 text-[#0FA958]" />
                  <span>Doorstep Delivery · ~35 mins</span>
                </>
              ) : (
                <>
                  <Store className="w-3.5 h-3.5 text-[#F15A24]" />
                  <span>Counter Collection · ~20 mins</span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={() => dispatch(setCheckoutOpen(false))}
            className="w-9 h-9 rounded-full bg-neutral-100 text-[#555555] hover:text-[#1A130E] hover:bg-neutral-200/70 border border-[#E5E5E5] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 overflow-y-auto space-y-5 flex-1 text-[13px] sm:text-[14px]">
          {/* Contact Details */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#F15A24] mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4" /> 1. Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[13px] font-semibold text-[#1A130E] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[rgb(249,249,249)] border border-[#E5E5E5] focus:bg-white rounded-xl px-3.5 py-2.5 text-[13px] sm:text-[14px] text-[#1A130E] focus:outline-none focus:border-[#F15A24] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#1A130E] mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[rgb(249,249,249)] border border-[#E5E5E5] focus:bg-white rounded-xl px-3.5 py-2.5 text-[13px] sm:text-[14px] text-[#1A130E] focus:outline-none focus:border-[#F15A24] transition-colors"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[13px] font-semibold text-[#1A130E] mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[rgb(249,249,249)] border border-[#E5E5E5] focus:bg-white rounded-xl px-3.5 py-2.5 text-[13px] sm:text-[14px] text-[#1A130E] focus:outline-none focus:border-[#F15A24] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {fulfillment.type === 'delivery' && (
            <div>
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#F15A24] mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> 2. Delivery Address
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[13px] font-semibold text-[#1A130E] mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 14 South William St, Apt 3"
                      className="w-full bg-[rgb(249,249,249)] border border-[#E5E5E5] focus:bg-white rounded-xl px-3.5 py-2.5 text-[13px] sm:text-[14px] text-[#1A130E] focus:outline-none focus:border-[#F15A24] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1A130E] mb-1">Eircode</label>
                    <input
                      type="text"
                      required
                      value={eircode}
                      onChange={(e) => setEircode(e.target.value.toUpperCase())}
                      placeholder="D02 P682"
                      className="w-full bg-[rgb(249,249,249)] border border-[#E5E5E5] focus:bg-white rounded-xl px-3.5 py-2.5 text-[13px] sm:text-[14px] text-[#1A130E] focus:outline-none focus:border-[#F15A24] uppercase transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#1A130E] mb-1">
                    Delivery Instructions
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Ring Apt 3 buzzer, leave at reception"
                    className="w-full bg-[rgb(249,249,249)] border border-[#E5E5E5] focus:bg-white rounded-xl px-3.5 py-2.5 text-[13px] sm:text-[14px] text-[#1A130E] focus:outline-none focus:border-[#F15A24] transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#F15A24] mb-3 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" /> 3. Payment Method
            </h3>
            <div className="relative">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-[rgb(249,249,249)] border border-[#E5E5E5] focus:bg-white rounded-xl px-3.5 py-2.5 text-[13px] sm:text-[14px] font-medium text-[#1A130E] focus:outline-none focus:border-[#F15A24] appearance-none pr-10 cursor-pointer transition-colors"
              >
                <option value="apple_pay">Apple Pay / Google Pay</option>
                <option value="card">Credit or Debit Card</option>
                <option value="cash">
                  {fulfillment.type === 'delivery' ? 'Cash on Delivery' : 'Pay at Store'}
                </option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#747474] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Card Details Form when card is active */}
            {paymentMethod === 'card' && (
              <div className="mt-3 p-4 rounded-xl bg-[rgb(249,249,249)] border border-[#E5E5E5] space-y-2.5">
                <div>
                  <label className="block text-[11px] uppercase font-semibold text-[#747474] mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="4532 •••• •••• 8892"
                    defaultValue="4532 8920 1204 8892"
                    className="w-full bg-white border border-[#E5E5E5] rounded-lg px-3.5 py-2.5 text-[13px] text-[#1A130E] focus:outline-none focus:border-[#F15A24]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] uppercase font-semibold text-[#747474] mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      defaultValue="08/28"
                      className="w-full bg-white border border-[#E5E5E5] rounded-lg px-3.5 py-2.5 text-[13px] text-[#1A130E] focus:outline-none focus:border-[#F15A24]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase font-semibold text-[#747474] mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="•••"
                      defaultValue="492"
                      maxLength={4}
                      className="w-full bg-white border border-[#E5E5E5] rounded-lg px-3.5 py-2.5 text-[13px] text-[#1A130E] focus:outline-none focus:border-[#F15A24]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Order */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-[14px] font-bold flex items-center justify-between shadow-[0_4px_14px_rgba(184,74,34,0.3)] hover:scale-[1.01] active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
          >
            <span>{isSubmitting ? 'Placing Order...' : 'Place Order Now'}</span>
            <span>€{total.toFixed(2)}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
