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
        <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-7 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[rgb(249,249,249)] text-[#B84A22] border border-[#E5E5E5] flex items-center justify-center mb-4 shadow-2xs">
            <Clock className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="badge-base badge-terracotta mb-2 inline-block">30-35 MINS AVERAGE</span>
          <h3 className="font-bold text-[17px] text-[#1A130E] mb-1.5">Fast Dublin Dispatch</h3>
          <p className="text-[14px] text-[#555555] leading-[22px]">
            Every dish is cooked fresh upon order and immediately packed in heat-retaining containers
            to arrive piping hot.
          </p>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-7 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[rgb(249,249,249)] text-[#0FA958] border border-[#E5E5E5] flex items-center justify-center mb-4 shadow-2xs">
            <PackageCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="badge-base badge-success mb-2 inline-block">FREE OVER €30</span>
          <h3 className="font-bold text-[17px] text-[#1A130E] mb-1.5">Generous Free Delivery</h3>
          <p className="text-[14px] text-[#555555] leading-[22px]">
            Enjoy complimentary doorstep delivery across Dublin Zones 1 to 4 on all orders over €30.
          </p>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-7 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[rgb(249,249,249)] text-[#D49B37] border border-[#E5E5E5] flex items-center justify-center mb-4 shadow-2xs">
            <ShieldCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="badge-base badge-gold mb-2 inline-block">100% ECO PACKAGING</span>
          <h3 className="font-bold text-[17px] text-[#1A130E] mb-1.5">Thermal & Leakproof</h3>
          <p className="text-[14px] text-[#555555] leading-[22px]">
            Delivered in 100% recyclable, microwave-safe, spill-resistant food containers.
          </p>
        </div>
      </div>

      {/* Coverage Zones Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 mb-12 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1A130E] mb-1">Supported Dublin Delivery Zones</h2>
            <p className="text-[14px] text-[#666666]">
              We deliver to Dublin City Centre and surrounding metropolitan residential zones.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[rgb(249,249,249)] border border-[#E5E5E5] text-[12px] font-semibold text-[#0FA958]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Real-time courier dispatch active</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] sm:text-[14px]">
            <thead>
              <tr className="border-b border-[#E5E5E5] text-[#1A130E] font-semibold bg-[rgb(249,249,249)]">
                <th className="py-3 px-4 rounded-l-xl">Zone Code</th>
                <th className="py-3 px-4">Coverage Areas</th>
                <th className="py-3 px-4">Est. Delivery Time</th>
                <th className="py-3 px-4">Delivery Fee</th>
                <th className="py-3 px-4 rounded-r-xl">Free Delivery Eligible</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {DELIVERY_ZONES.map((zone) => (
                <tr key={zone.key} className="hover:bg-[rgb(249,249,249)] transition-colors">
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
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs space-y-3">
          <h4 className="font-bold text-[16px] text-[#1A130E] flex items-center gap-2">
            <Bike className="w-4.5 h-4.5 text-[#B84A22]" /> Live Courier Tracking
          </h4>
          <p className="text-[14px] text-[#555555] leading-[22px]">
            Once your order is confirmed, you can follow its live status in real-time from our
            tandoor kitchen to your doorstep via our live visual tracker.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs space-y-3">
          <h4 className="font-bold text-[16px] text-[#1A130E] flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-[#D49B37]" /> Contact-Free Delivery Available
          </h4>
          <p className="text-[14px] text-[#555555] leading-[22px]">
            Prefer a contactless drop-off? Simply add delivery notes at checkout (e.g. &quot;Leave at
            apartment lobby or front porch&quot;) and our driver will notify you upon arrival.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1C1510] via-[#241A14] to-[#17110D] border border-[#3A2D24] text-white text-center max-w-2xl mx-auto shadow-xl">
        <h3 className="text-xl sm:text-2xl font-bold mb-2">Craving Royal Spices Tonight?</h3>
        <p className="text-[14px] text-[#D5CBC2] mb-6 leading-relaxed">
          Order directly online for instant preparation and prompt doorstep delivery.
        </p>
        <Link
          href="/menu"
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FBA138] to-[#F15A24] hover:from-[#F59828] hover:to-[#E54E18] text-white text-[13px] font-semibold inline-flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          <span>Start Your Order</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
