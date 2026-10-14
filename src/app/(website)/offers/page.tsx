'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { applyPromoCode, setCartOpen } from '@/redux/slices/cartSlice';
import { Tag, Sparkles, CheckCircle2, Copy, ArrowRight, Clock, Percent } from 'lucide-react';
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

  const handleApplyOffer = (code: string) => {
    dispatch(applyPromoCode(code));
    setCopiedCode(code);
    dispatch(setCartOpen(true));
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3ECE2] border border-[#E9DFD3] text-[#B84A22] text-xs font-semibold uppercase tracking-wider mb-3">
            <Percent className="w-3.5 h-3.5" />
            <span>Exclusive Promo Codes</span>
          </div>
          <h1 className="section-title mb-3">
            Special Culinary Offers
          </h1>
          <p className="section-subtitle">
            Save on authentic Dublin deliveries and collection feasts. Apply any promo voucher below with a single click.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          {OFFERS_LIST.map((offer) => (
            <div
              key={offer.code}
              className={`amber-card p-6 sm:p-7 bg-white border rounded-3xl flex flex-col justify-between transition-all relative overflow-hidden ${
                offer.isPopular
                  ? 'border-[#B84A22] ring-1 ring-[#B84A22]/20'
                  : 'border-[#EBE2D7]'
              }`}
            >
              {/* Top Accent Pill */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FAF6EF] border border-[#EBE2D7] text-[#B84A22]">
                  {offer.badge}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#B84A22] tracking-tight">
                  {offer.discount}
                </span>
              </div>

              {/* Title & Description */}
              <div className="mb-6">
                <h3 className="font-bold text-lg text-[#1A130E] mb-2 leading-snug">
                  {offer.title}
                </h3>
                <p className="text-xs text-[#747474] leading-relaxed mb-4">
                  {offer.description}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-[#9B8C80]">
                  <span>• {offer.minOrder}</span>
                  <span>• {offer.validTill}</span>
                </div>
              </div>

              {/* Voucher Code Box & Apply CTA */}
              <div className="p-3.5 rounded-2xl bg-[#FAF6EF] border border-[#EBE2D7] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#B84A22]" />
                  <span className="font-mono font-bold text-sm tracking-widest text-[#1A130E]">
                    {offer.code}
                  </span>
                </div>

                <button
                  onClick={() => handleApplyOffer(offer.code)}
                  className="btn-amber-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Applied!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Apply Voucher</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Free Delivery Banner */}
        <div className="max-w-5xl mx-auto p-8 rounded-3xl bg-[#1A130E] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="text-xs text-[#D49B37] font-semibold uppercase tracking-wider mb-1">
              Everyday Dublin Benefit
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Free Delivery on Orders Over €30.00
            </h3>
            <p className="text-xs text-[#C4B5A5] max-w-xl">
              No promo code needed. Minimum threshold is automatically calculated in your cart for Dublin 1, 2, 4, 6 & 8 postal zones.
            </p>
          </div>
          <Link
            href="/menu"
            className="btn-amber-primary px-6 py-3 text-xs font-semibold flex items-center gap-2 shrink-0 whitespace-nowrap"
          >
            <span>Explore Menu & Order</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
