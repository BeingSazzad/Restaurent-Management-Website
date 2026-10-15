import React from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="section-decorator mx-auto" />
        <h1 className="section-title mb-4">
          Our Culinary Heritage
        </h1>
        <p className="section-subtitle leading-relaxed">
          Born out of love for authentic regional heritage recipes: slow dum-cooked biryanis in
          antique copper handis, hand-ground royal spices, and rich velvety curries crafted fresh in
          Dublin.
        </p>
      </div>

      {/* Sourcing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-[rgb(249,249,249)] text-[#B84A22] flex items-center justify-center mb-5 border border-[#E5E5E5] shadow-2xs">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-[18px] font-bold text-[#1A130E] mb-2.5">
            Authentic Dum Cooking
          </h3>
          <p className="text-[14px] text-[#555555] leading-[22px]">
            Our signature biryanis are sealed with whole wheat dough in copper handis and slow-cooked
            over mild charcoal embers so every grain of basmati absorbs aromatic saffron and spices.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-[rgb(249,249,249)] text-[#B84A22] flex items-center justify-center mb-5 border border-[#E5E5E5] shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-[18px] font-bold text-[#1A130E] mb-2.5">
            Stone-Ground Whole Spices
          </h3>
          <p className="text-[14px] text-[#555555] leading-[22px]">
            We ethically source single-origin star anise, green cardamom, Kashmiri chilies, and saffron.
            Every spice blend is roasted and ground in-house each morning.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-[rgb(249,249,249)] text-[#B84A22] flex items-center justify-center mb-5 border border-[#E5E5E5] shadow-2xs">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-[18px] font-bold text-[#1A130E] mb-2.5">
            Clay Tandoor Mastery
          </h3>
          <p className="text-[14px] text-[#555555] leading-[22px]">
            Our tandoor oven reaches over 480°C, delivering smoky, blistered naans and succulent,
            tender kebabs infused with fresh garlic, coriander, and royal herbs.
          </p>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1C1510] via-[#241A14] to-[#17110D] border border-[#3A2D24] text-white text-center max-w-3xl mx-auto shadow-xl">
        <span className="text-[11px] font-bold tracking-[0.2em] text-[#D49B37] uppercase block mb-2">
          TASTE THE ROYAL HERITAGE
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Ready to Experience Authentic Flavors?
        </h2>
        <p className="text-[14px] text-[#D5CBC2] max-w-md mx-auto mb-6 leading-relaxed">
          Order online for fast doorstep Dublin delivery or takeaway collection from South William Street.
        </p>
        <Link
          href="/menu"
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FBA138] to-[#F15A24] hover:from-[#F59828] hover:to-[#E54E18] text-white text-[13px] font-semibold inline-flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          <span>Explore Online Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
