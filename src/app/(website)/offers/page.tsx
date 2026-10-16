'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { applyPromoCode, setCartOpen } from '@/redux/slices/cartSlice';
import { syncCouponsFromStorage, INITIAL_COUPONS } from '@/redux/slices/couponSlice';
import { Check, Copy, ArrowRight, Percent } from 'lucide-react';
import Link from 'next/link';

export default function OffersPage() {
  const dispatch = useAppDispatch();
  const reduxCoupons = useAppSelector((state) => state.coupons?.items);
  const coupons = reduxCoupons && reduxCoupons.length > 0 ? reduxCoupons : INITIAL_COUPONS;
  const activeOffers = coupons.filter((c) => c.isActive);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    dispatch(syncCouponsFromStorage());
    const handleUpdate = () => dispatch(syncCouponsFromStorage());
    window.addEventListener('amber_spice_coupons_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('amber_spice_coupons_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [dispatch]);

  const handleCopyCode = async (code: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      }
    } catch {
      // fallback
    }
    dispatch(applyPromoCode(code));
    dispatch(setCartOpen(true));
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[rgb(249,249,249)] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-[#F15A24] text-[12px] font-bold uppercase tracking-widest mb-3">
            <Percent className="w-3.5 h-3.5 text-[#F15A24]" />
            <span>Exclusive Promo Codes</span>
          </div>
          <h1 className="section-title mb-3">
            Special Culinary Offers
          </h1>
          <p className="section-subtitle">
            Save on authentic Dublin deliveries and collection feasts. Copy any promo voucher below with a single click.
          </p>
        </div>

        {/* Offers Grid: Clean 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {activeOffers.map((offer, idx) => {
            const isPopular = idx === 0 || offer.badge.toLowerCase().includes('trending') || offer.badge.toLowerCase().includes('special');
            const discountLabel =
              offer.discountType === 'percentage'
                ? `${offer.discountValue}% OFF`
                : `€${offer.discountValue.toFixed(2)} OFF`;
            const minOrderLabel =
              offer.minOrderAmount > 0
                ? `Min order €${offer.minOrderAmount.toFixed(2)}`
                : 'No minimum order';

            return (
              <div
                key={offer.id || offer.code}
                className={`p-6 bg-white border rounded-3xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 ${
                  isPopular
                    ? 'border-[#F15A24] ring-2 ring-[#F15A24]/20'
                    : 'border-[#E5E5E5] hover:border-[#F15A24]/50'
                }`}
              >
                {/* Top Accent Pill */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F15A24]">
                    {offer.badge || 'Discount Voucher'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#F15A24] tracking-tight">
                    {discountLabel}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="mb-6">
                  <h3 className="font-bold text-[17px] text-[#1A130E] mb-2 leading-snug">
                    {offer.title}
                  </h3>
                  <p className="text-[13.5px] text-[#555555] leading-relaxed mb-3">
                    {offer.description}
                  </p>
                  <div className="flex items-center gap-3 text-[12px] text-[#747474] font-medium">
                    <span>{minOrderLabel}</span>
                    <span>•</span>
                    <span>{offer.validTill || 'Ongoing'}</span>
                  </div>
                </div>

                {/* Voucher Code Box & Copy CTA */}
                <div className="p-2 sm:p-2.5 rounded-2xl bg-[rgb(249,249,249)] border border-[#E5E5E5] flex items-center justify-between gap-3">
                  <div className="pl-3 py-1">
                    <span className="font-bold text-sm tracking-widest text-[#1A130E] font-mono select-all">
                      {offer.code}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(offer.code)}
                    className={`px-4 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      copiedCode === offer.code
                        ? 'bg-emerald-600 text-white shadow-xs scale-102'
                        : 'bg-gradient-to-r from-[#F15A24] to-[#FBA138] hover:from-[#d94e1c] hover:to-[#e89228] text-white shadow-[0_4px_14px_rgba(241,90,36,0.25)] hover:scale-102 active:scale-95'
                    }`}
                    aria-label={`Copy promo code ${offer.code}`}
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Apply Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free Delivery Banner */}
        <div className="max-w-5xl mx-auto p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1C1510] via-[#241A14] to-[#17110D] border border-[#3A2D24] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="text-[11px] text-[#F15A24] font-bold uppercase tracking-wider mb-2">
              Everyday Dublin Benefit
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Free Delivery on Orders Over €30.00
            </h3>
            <p className="text-[14px] text-[#D5CBC2] max-w-xl leading-relaxed">
              No promo code needed. Minimum threshold is automatically calculated in your cart for Dublin 1, 2, 4, 6 & 8 postal zones.
            </p>
          </div>
          <Link
            href="/menu"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#F15A24] to-[#FBA138] hover:from-[#d94e1c] hover:to-[#e89228] text-white text-[13px] font-semibold flex items-center gap-2 shrink-0 whitespace-nowrap shadow-[0_4px_14px_rgba(241,90,36,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            <span>Explore Menu & Order</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
