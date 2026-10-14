import React from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold text-[#FF8D2F] uppercase tracking-wider block mb-1">
          Our Culinary Philosophy
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F1F1F] mb-4">
          The Story of zomo Kitchen
        </h1>
        <p className="text-sm text-[#747474] leading-relaxed">
          Founded in Dublin with a passion for exceptional food: delivery should never mean
          compromising on gastronomic taste, culinary craft, or fresh ingredients.
        </p>
      </div>

      {/* Sourcing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF4EC] text-[#FF8D2F] flex items-center justify-center mb-4">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1F1F1F] mb-2">
            Live Hardwood Fire
          </h3>
          <p className="text-xs text-[#747474] leading-relaxed">
            Every pizza base and prime steak touches live hardwood embers. Our custom wood oven burns
            seasoned Irish oak at 450°C to impart authentic rustic aroma.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF4EC] text-[#FF8D2F] flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1F1F1F] mb-2">
            100% Irish Wagyu & Angus
          </h3>
          <p className="text-xs text-[#747474] leading-relaxed">
            Partnered directly with regenerative cattle pastures in County Meath. Dry-aged on bone
            for 28 days in Himalayan salt chambers before being hand-carved daily.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF4EC] text-[#FF8D2F] flex items-center justify-center mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1F1F1F] mb-2">
            48-Hour Fermentation
          </h3>
          <p className="text-xs text-[#747474] leading-relaxed">
            We use wild sourdough mother starter cultivated over 6 years. A slow 48-hour cold
            ferment creates airy leopard crusts that are naturally easy to digest.
          </p>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#FF8D2F] to-[#FF6B00] text-white text-center max-w-3xl mx-auto shadow-md">
        <h2 className="text-2xl font-extrabold mb-2">
          Ready to Order Fresh?
        </h2>
        <p className="text-xs opacity-90 max-w-md mx-auto mb-6">
          Order online for fast Dublin delivery or collection from South William Street.
        </p>
        <Link
          href="/"
          className="bg-white text-[#FF8D2F] hover:bg-opacity-95 font-bold text-xs py-3 px-8 rounded-full inline-flex items-center gap-2 shadow-sm"
        >
          <span>Explore Online Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
