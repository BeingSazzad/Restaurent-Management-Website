'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { applyPromoCode } from '@/redux/slices/cartSlice';
import { Check, Copy, ArrowRight, Percent } from 'lucide-react';
import Link from 'next/link';

interface OfferCard {
  code: string;
  discount: string;
  title: string;
  description: string;
  minOrder: string;
  validTill: string;
  badge: string;
  isPopular?: boolean;
}

const OFFERS_LIST: OfferCard[] = [
  {
    code: 'SPICE20',
    discount: '20% OFF',
    title: 'Grand Royal Feast Discount',
    description: 'Enjoy 20% discount on all heritage curries, dum biryanis, and chef specials.',
    minOrder: 'Min order €35.00',
    validTill: 'Valid until Sunday',
    badge: 'Trending Special',
    isPopular: true,
  },
  {
    code: 'FAMILYFEST',
    discount: '15% OFF',
    title: 'Family Gathering Platter Offer',
    description: 'Special 15% concession for family platters, mixed tandoori grills, and sides.',
    minOrder: 'Min order €45.00',
    validTill: 'Valid all week',
    badge: 'Family Weekend',
  },
  {
    code: 'FIRSTBITE',
    discount: '10% OFF',
    title: 'Welcome First-Time Diner Gift',
    description: 'First time ordering? Enjoy 10% off your authentic doorstep delivery.',
    minOrder: 'No minimum order',
    validTill: 'First order only',
    badge: 'New Customer',
  },
  {
    code: 'AMBER10',
    discount: '10% OFF',
    title: 'Midweek Spice Craving Discount',
    description: 'Get 10% off anytime Monday through Thursday on hot curry bowls and freshly baked naans.',
    minOrder: 'Min order €25.00',
    validTill: 'Mon - Thu',
    badge: 'Midweek Saver',
  },
];

export default function OffersPage() {
  const dispatch = useAppDispatch();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      }
    } catch {
      // fallback
    }
    dispatch(applyPromoCode(code));
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
          <div className="inline-flex items-center gap-2 text-[#B84A22] text-[12px] font-bold uppercase tracking-widest mb-3">
            <Percent className="w-3.5 h-3.5 text-[#B84A22]" />
            <span>Exclusive Promo Codes</span>
          </div>
          <h1 className="section-title mb-3">
            Special Culinary Offers
          </h1>
          <p className="section-subtitle">
            Save on authentic Dublin deliveries and collection feasts. Copy any promo voucher below with a single click.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          {OFFERS_LIST.map((offer) => (
            <div
              key={offer.code}
              className={`p-6 sm:p-7 bg-white border rounded-3xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 ${
                offer.isPopular
                  ? 'border-[#B84A22] ring-2 ring-[#B84A22]/20'
                  : 'border-[#E5E5E5] hover:border-[#B84A22]/50'
              }`}
            >
              {/* Top Accent Pill */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[rgb(249,249,249)] border border-[#E5E5E5] text-[#B84A22]">
                  {offer.badge}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#B84A22] tracking-tight">
                  {offer.discount}
                </span>
              </div>

              {/* Title & Description */}
              <div className="mb-6">
                <h3 className="font-bold text-[18px] sm:text-[19px] text-[#1A130E] mb-2 leading-snug">
                  {offer.title}
                </h3>
                <p className="text-[14px] text-[#555555] leading-relaxed mb-4">
                  {offer.description}
                </p>
                <div className="flex items-center gap-4 text-[12px] text-[#747474] font-medium">
                  <span>• {offer.minOrder}</span>
                  <span>• {offer.validTill}</span>
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
                      : 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white shadow-[0_4px_14px_rgba(184,74,34,0.3)] hover:scale-102 active:scale-95'
                  }`}
                  aria-label={`Copy promo code ${offer.code}`}
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Free Delivery Banner */}
        <div className="max-w-5xl mx-auto p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1C1510] via-[#241A14] to-[#17110D] border border-[#3A2D24] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="text-[11px] text-[#D49B37] font-bold uppercase tracking-wider mb-2">
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
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-[13px] font-semibold flex items-center gap-2 shrink-0 whitespace-nowrap shadow-[0_4px_14px_rgba(184,74,34,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            <span>Explore Menu & Order</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
