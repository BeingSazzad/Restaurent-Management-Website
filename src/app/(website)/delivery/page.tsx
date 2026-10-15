'use client';

import React from 'react';
import Link from 'next/link';
import { DELIVERY_ZONES } from '@/Mockdata';
import { Bike, ShieldCheck, Clock, CheckCircle2, PackageCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function DeliveryInformationPage() {
  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="section-decorator mx-auto" />
        <h1 className="section-title mb-3">Dublin Delivery Information</h1>
        <p className="section-subtitle">
          From our South William Street kitchen directly to your doorstep in thermal-insulated
          delivery bags.
        </p>
      </div>

      {/* 3 Core Delivery Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="amber-card p-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF6EF] text-[#B84A22] border border-[#EBE2D7] flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="badge-base badge-terracotta mb-2 inline-block">30-35 MINS AVERAGE</span>
          <h3 className="font-bold text-base text-[#1A130E] mb-1">Fast Dublin Dispatch</h3>
          <p className="text-xs text-[#747474] leading-relaxed">
            Every dish is cooked fresh upon order and immediately packed in heat-retaining containers
            to arrive piping hot.
          </p>
        </div>

        <div className="amber-card p-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF6EF] text-[#0FA958] border border-[#EBE2D7] flex items-center justify-center mb-4">
            <PackageCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="badge-base badge-success mb-2 inline-block">FREE OVER €30</span>
          <h3 className="font-bold text-base text-[#1A130E] mb-1">Generous Free Delivery</h3>
          <p className="text-xs text-[#747474] leading-relaxed">
            Enjoy complimentary doorstep delivery across Dublin Zones 1 to 4 on all orders over €30.
          </p>
        </div>

        <div className="amber-card p-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF6EF] text-[#D49B37] border border-[#EBE2D7] flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="badge-base badge-gold mb-2 inline-block">100% ECO PACKAGING</span>
          <h3 className="font-bold text-base text-[#1A130E] mb-1">Thermal & Leakproof</h3>
          <p className="text-xs text-[#747474] leading-relaxed">
            Delivered in 100% recyclable, microwave-safe, spill-resistant food containers.
          </p>
        </div>
      </div>

      {/* Coverage Zones Table */}
      <div className="amber-card p-6 sm:p-8 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1A130E] mb-1">Supported Dublin Delivery Zones</h2>
            <p className="text-xs text-[#747474]">
              We deliver to Dublin City Centre and surrounding metropolitan residential zones.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF6EF] border border-[#EBE2D7] text-xs font-semibold text-[#0FA958]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Real-time courier dispatch active</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EBE2D7] text-[#1A130E] font-semibold bg-[#FAF6EF]">
                <th className="py-3 px-4 rounded-l-xl">Zone Code</th>
                <th className="py-3 px-4">Coverage Areas</th>
                <th className="py-3 px-4">Est. Delivery Time</th>
                <th className="py-3 px-4">Delivery Fee</th>
                <th className="py-3 px-4 rounded-r-xl">Free Delivery Eligible</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE2D7]">
              {DELIVERY_ZONES.map((zone) => (
                <tr key={zone.key} className="hover:bg-[#FAF6EF]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#B84A22]">{zone.key}</td>
                  <td className="py-3.5 px-4 font-medium text-[#1A130E]">{zone.name}</td>
                  <td className="py-3.5 px-4 text-[#747474]">25 - 35 mins</td>
                  <td className="py-3.5 px-4 font-semibold text-[#1A130E]">€{zone.fee.toFixed(2)}</td>
                  <td className="py-3.5 px-4">
                    <span className="badge-base badge-success">Over €30</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delivery FAQs / Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-white border border-[#EBE2D7] space-y-3">
          <h4 className="font-bold text-sm text-[#1A130E] flex items-center gap-2">
            <Bike className="w-4 h-4 text-[#B84A22]" /> Live Courier Tracking
          </h4>
          <p className="text-xs text-[#747474] leading-relaxed">
            Once your order is confirmed, you can follow its live status in real-time from our
            tandoor kitchen to your doorstep via our live visual tracker.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#EBE2D7] space-y-3">
          <h4 className="font-bold text-sm text-[#1A130E] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#D49B37]" /> Contact-Free Delivery Available
          </h4>
          <p className="text-xs text-[#747474] leading-relaxed">
            Prefer a contactless drop-off? Simply add delivery notes at checkout (e.g. &quot;Leave at
            apartment lobby or front porch&quot;) and our driver will notify you upon arrival.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-[#201813] text-white text-center max-w-2xl mx-auto border border-[#2D241E]">
        <h3 className="text-xl font-bold mb-2">Craving Royal Spices Tonight?</h3>
        <p className="text-xs text-[#C4B5A5] mb-5">
          Order directly online for instant preparation and prompt doorstep delivery.
        </p>
        <Link
          href="/menu"
          className="btn-amber-primary px-7 py-3 text-xs font-semibold inline-flex items-center gap-2 shadow-amber"
        >
          <span>Start Your Order</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
