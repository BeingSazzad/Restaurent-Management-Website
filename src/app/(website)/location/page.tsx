'use client';

import React from 'react';
import Link from 'next/link';
import { RESTAURANT_INFO } from '@/Mockdata';
import { MapPin, Phone, Mail, Clock, Navigation, Car, Train, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LocationPage() {
  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="section-decorator mx-auto" />
        <h1 className="section-title mb-3">Location & Find Us</h1>
        <p className="section-subtitle">
          Visit our central Dublin kitchen on South William Street for authentic dine-in, takeaway
          collection, or rapid city delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: Essential Store Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="amber-card p-6 space-y-5">
            <h3 className="font-bold text-base text-[#1A130E] border-b border-[#EBE2D7] pb-3">
              Store Information
            </h3>

            <div className="flex items-start gap-3.5 text-xs text-[#3D3D3D]">
              <div className="w-8 h-8 rounded-full bg-[#FAF6EF] text-[#B84A22] border border-[#EBE2D7] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#1A130E] block text-sm">Central Dublin Kitchen</span>
                <p className="text-[#747474] mt-0.5">{RESTAURANT_INFO.location}</p>
                <span className="text-[11px] font-semibold text-[#B84A22]">Dublin 2, D02 HR58</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-xs text-[#3D3D3D]">
              <div className="w-8 h-8 rounded-full bg-[#FAF6EF] text-[#0FA958] border border-[#EBE2D7] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#1A130E] block text-sm">Opening Hours</span>
                <p className="text-[#747474] mt-0.5">Monday – Sunday: 11:00 AM – 11:00 PM</p>
                <span className="text-[11px] font-semibold text-[#0FA958]">Open 7 Days a Week</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-xs text-[#3D3D3D]">
              <div className="w-8 h-8 rounded-full bg-[#FAF6EF] text-[#D49B37] border border-[#EBE2D7] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#1A130E] block text-sm">Phone Support</span>
                <p className="text-[#747474] mt-0.5">{RESTAURANT_INFO.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-xs text-[#3D3D3D]">
              <div className="w-8 h-8 rounded-full bg-[#FAF6EF] text-[#747474] border border-[#EBE2D7] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#1A130E] block text-sm">Email Inquiries</span>
                <p className="text-[#747474] mt-0.5">{RESTAURANT_INFO.email}</p>
              </div>
            </div>
          </div>

          {/* Transit & Parking Advice */}
          <div className="amber-card p-6 space-y-4">
            <h4 className="font-bold text-sm text-[#1A130E]">Getting Here</h4>
            <div className="space-y-3 text-xs text-[#747474]">
              <div className="flex items-start gap-2.5">
                <Train className="w-4 h-4 text-[#B84A22] shrink-0 mt-0.5" />
                <span>
                  <strong>Luas Green Line:</strong> 3-minute walk from St. Stephen&apos;s Green or
                  Dawson Street stops.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Car className="w-4 h-4 text-[#B84A22] shrink-0 mt-0.5" />
                <span>
                  <strong>Parking:</strong> Underground multi-storey parking available nearby at St.
                  Stephen&apos;s Green Shopping Centre and Drury Street Car Park.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Interactive Map & Collection Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="amber-card p-6 sm:p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#1A130E]">18 South William Street</h3>
                  <p className="text-xs text-[#747474]">Heart of Dublin Creative Quarter</p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF6EF] border border-[#EBE2D7] text-xs font-semibold text-[#0FA958]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kitchen Open Now</span>
                </div>
              </div>

              {/* Styled Visual Map Graphic */}
              <div className="relative rounded-2xl overflow-hidden bg-[#201813] border border-[#EBE2D7] h-80 flex flex-col items-center justify-center p-6 text-center text-white mb-6">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D49B37_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#B84A22] text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">AMBER SPICE RESTAURANT</h4>
                    <p className="text-xs text-[#E2D8CE]">18 South William St, Dublin 2</p>
                    <span className="text-[11px] text-[#D49B37] font-medium">Just off Grafton Street</span>
                  </div>
                  <a
                    href="https://maps.google.com/?q=18+South+William+Street+Dublin+2"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[#1A130E] hover:bg-[#FAF6EF] text-xs font-semibold shadow-md transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#B84A22]" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Takeaway Collection Counter details */}
            <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#EBE2D7] flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-xs text-[#1A130E]">Takeaway Collection Counter</h4>
                <p className="text-[11px] text-[#747474]">Ready in ~15-20 mins · Pick up hot from counter</p>
              </div>
              <Link
                href="/menu"
                className="btn-amber-primary px-5 py-2 text-xs font-semibold shrink-0"
              >
                Order Takeaway
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center p-8 rounded-3xl bg-[#FAF6EF] border border-[#EBE2D7]">
        <h3 className="font-bold text-lg text-[#1A130E] mb-2">Planning a Visit or Takeaway?</h3>
        <p className="text-xs text-[#747474] max-w-md mx-auto mb-5">
          Order ahead online to have your food packed hot and ready precisely when you arrive.
        </p>
        <Link
          href="/menu"
          className="btn-amber-primary px-7 py-3 text-xs font-semibold inline-flex items-center gap-2 shadow-amber"
        >
          <span>Order for Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
