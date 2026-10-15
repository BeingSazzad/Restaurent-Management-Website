import React from 'react';
import Link from 'next/link';
import {
  Flame,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Clock,
  MapPin,
  CheckCircle2,
  ChefHat,
  Calendar,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
      {/* 1. HERO HEADER */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="section-decorator mx-auto mb-3" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E5E5] text-[#B84A22] text-[12px] font-semibold uppercase tracking-wider mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Authentic Flavors · Timeless Recipes</span>
        </div>
        <h1 className="section-title mb-4">Our Culinary Heritage & Dublin Story</h1>
        <p className="section-subtitle leading-relaxed text-base sm:text-lg">
          Born out of reverence for centuries-old Awadhi dum cooking, slow-fire copper handi
          secrets, and clay tandoor mastery — crafted fresh every day in the heart of Dublin 2.
        </p>
      </div>

      {/* 2. THE STORY: DUAL COLUMN EDITORIAL WITH HIGH-RES PHOTOGRAPHY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Story Text */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#F15A24] block">
              EST. 2018 · SOUTH WILLIAM STREET
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A130E] leading-tight">
              Reviving Ancient Royal Kitchens in Dublin
            </h2>
          </div>

          <p className="text-[15px] text-[#444444] leading-relaxed">
            Amber Spice was founded with a singular conviction: that true Indian heritage cooking
            cannot be hurried, diluted, or compromised. While modern kitchens turned to pre-ground
            powders and quick commercial pastes, we chose the slower, sacred path of ancient dum
            pukht.
          </p>

          <p className="text-[15px] text-[#444444] leading-relaxed">
            Every morning before sunrise, our Dublin kitchen roasts whole green cardamom, star
            anise, Malabar peppercorns, and Kashmiri chilies. We blend centuries-old Awadhi and
            Mughlai culinary lineage with the very best local Irish produce — including 100%
            grass-fed Irish beef, locally sourced dairy, and farm-fresh herbs.
          </p>

          {/* Master Chef Quote Box */}
          <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[#1A130E] relative">
            <p className="text-[14px] italic text-[#632812] leading-relaxed">
              &quot;In royal heritage cooking, the vessel is as important as the flame. When we seal
              our antique copper handis with dough, the meat and basmati braise in their own trapped
              juices. You taste true aroma in every grain.&quot;
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-[14px] text-[#1A130E] block">
                  Chef Tariq Mahmood
                </span>
                <span className="text-[12px] text-[#747474]">
                  Executive Head Chef · 22 Years Heritage Craft
                </span>
              </div>
              <ChefHat className="w-6 h-6 text-[#B84A22]" />
            </div>
          </div>
        </div>

        {/* Visual Showcase Card with Image & Live Perks */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-3xl overflow-hidden border border-[#E5E5E5] shadow-xl group aspect-[4/3] sm:aspect-[16/11]">
            <img
              src="/images/amber_hero_dish.jpg"
              alt="Authentic Copper Handi Dum Cooking"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            <div className="absolute top-4 left-4">
              <span className="px-3.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-[#D49B37] text-xs font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#F15A24]" />
                <span>Slow Charcoal Dum · 8+ Hours</span>
              </span>
            </div>

            <div className="absolute bottom-5 left-5 right-5 text-white">
              <h3 className="text-xl sm:text-2xl font-bold mb-1 drop-shadow-md">
                Handcrafted in Dublin 2
              </h3>
              <p className="text-xs sm:text-sm text-[#E2D8CE] line-clamp-2">
                Simmered in heavy-bottomed brass & copper handis with Dehradun aged basmati and
                saffron.
              </p>
            </div>
          </div>

          {/* Floating Verification Tag */}
          <div className="absolute -bottom-6 -left-4 sm:left-6 bg-white border border-[#E5E5E5] rounded-2xl p-4 shadow-xl flex items-center gap-3 max-w-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F15A24] flex items-center justify-center shrink-0 border border-orange-200/60">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-[13px] text-[#1A130E] block">100% Halal Certified</span>
              <span className="text-[11px] text-[#747474]">Grass-fed Irish meats & freshest spices</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. THE THREE PILLARS OF OUR CRAFT - WITH HIGH-RES REAL IMAGERY */}
      <div className="space-y-8 pt-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#B84A22] block mb-2">
            CULINARY MASTERY
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A130E]">
            The Three Pillars of Our Kitchen
          </h2>
          <p className="text-[14px] text-[#747474] mt-2">
            Every dish we send to your table or doorstep is built on these foundational culinary
            commitments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Pillar 1: Dum Cooking */}
          <div className="group rounded-3xl overflow-hidden bg-white border border-[#E5E5E5] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div className="relative h-56 sm:h-64 overflow-hidden bg-[rgb(249,249,249)]">
              <img
                src="/images/amber_hero_dish.jpg"
                alt="Authentic Dum Cooking"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-black/60 text-[#FBA138] border border-white/15 backdrop-blur-md">
                  ANCIENT DUM PUKHT
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-bold text-white mb-0.5">Dough-Sealed Copper Handis</h3>
                <p className="text-xs text-[#D5CBC2]">Steamed in its own natural juices</p>
              </div>
            </div>

            <div className="p-6 space-y-3.5 flex-1 flex flex-col justify-between">
              <p className="text-[14px] text-[#555555] leading-relaxed">
                Our biryanis are sealed with wheat dough (Purda) in heavy copper pots over mild
                charcoal embers. The internal steam cycles continuously, ensuring maximum tenderness
                and aromatic saffron infusion.
              </p>
              <div className="pt-3 border-t border-[#F1F1F1] flex items-center justify-between text-xs font-semibold text-[#1A130E]">
                <span className="flex items-center gap-1.5 text-[#B84A22]">
                  <CheckCircle2 className="w-4 h-4" /> 8+ Hours Low Embers
                </span>
                <span className="text-[#747474]">Aged Basmati</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Whole Stone-Ground Spices */}
          <div className="group rounded-3xl overflow-hidden bg-white border border-[#E5E5E5] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div className="relative h-56 sm:h-64 overflow-hidden bg-[rgb(249,249,249)]">
              <img
                src="/images/curry_dish.jpg"
                alt="Stone-Ground Whole Spices"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-black/60 text-[#0FA958] border border-white/15 backdrop-blur-md">
                  SINGLE-ORIGIN SPICES
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-bold text-white mb-0.5">Zero Pre-Ground Powders</h3>
                <p className="text-xs text-[#D5CBC2]">Roasted and ground fresh each morning</p>
              </div>
            </div>

            <div className="p-6 space-y-3.5 flex-1 flex flex-col justify-between">
              <p className="text-[14px] text-[#555555] leading-relaxed">
                We import whole green cardamom from Idukki, star anise, black cumin, and Kashmiri
                chilies. Roasted dry in small batches to awaken volatile essential oils, yielding
                authentic deep layers of spice.
              </p>
              <div className="pt-3 border-t border-[#F1F1F1] flex items-center justify-between text-xs font-semibold text-[#1A130E]">
                <span className="flex items-center gap-1.5 text-[#0FA958]">
                  <CheckCircle2 className="w-4 h-4" /> 100% Pure Natural
                </span>
                <span className="text-[#747474]">No Artificial Colors</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: 480C Clay Tandoor */}
          <div className="group rounded-3xl overflow-hidden bg-white border border-[#E5E5E5] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div className="relative h-56 sm:h-64 overflow-hidden bg-[rgb(249,249,249)]">
              <img
                src="/images/grill_dish.jpg"
                alt="Clay Tandoor Mastery"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-black/60 text-[#F15A24] border border-white/15 backdrop-blur-md">
                  480°C CLAY OVEN
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-bold text-white mb-0.5">Live Charcoal Embers</h3>
                <p className="text-xs text-[#D5CBC2]">Blistered naans & smoky succulent kebabs</p>
              </div>
            </div>

            <div className="p-6 space-y-3.5 flex-1 flex flex-col justify-between">
              <p className="text-[14px] text-[#555555] leading-relaxed">
                Our authentic clay tandoor oven runs at blistering 480°C heat over hardwood lump
                charcoal. Hand-stretched dough adheres to clay walls, blistering with charred pockets
                in seconds while locking in moisture.
              </p>
              <div className="pt-3 border-t border-[#F1F1F1] flex items-center justify-between text-xs font-semibold text-[#1A130E]">
                <span className="flex items-center gap-1.5 text-[#F15A24]">
                  <CheckCircle2 className="w-4 h-4" /> Blistered Naans
                </span>
                <span className="text-[#747474]">Charcoal Smokiness</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DUBLIN PROVENANCE & SOURCING METRICS */}
      <div className="rounded-3xl bg-white border border-[#E5E5E5] p-8 sm:p-10 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#E5E5E5]">
          <div className="p-2 space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#B84A22] block font-['Poppins']">
              100%
            </span>
            <span className="text-[13px] font-bold text-[#1A130E] block">Irish Halal Certified</span>
            <span className="text-[12px] text-[#747474]">Grass-fed beef & local poultry</span>
          </div>

          <div className="pt-6 md:pt-2 md:px-4 space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#B84A22] block font-['Poppins']">
              8+ Hrs
            </span>
            <span className="text-[13px] font-bold text-[#1A130E] block">Slow Dum Infusion</span>
            <span className="text-[12px] text-[#747474]">Traditional copper handis</span>
          </div>

          <div className="pt-6 md:pt-2 md:px-4 space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#B84A22] block font-['Poppins']">
              28+
            </span>
            <span className="text-[13px] font-bold text-[#1A130E] block">Whole Spices Blended</span>
            <span className="text-[12px] text-[#747474]">In-house roasted daily</span>
          </div>

          <div className="pt-6 md:pt-2 md:px-4 space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#B84A22] block font-['Poppins']">
              4.9 ★
            </span>
            <span className="text-[13px] font-bold text-[#1A130E] block">Customer Rating</span>
            <span className="text-[12px] text-[#747474]">Across 2,140+ Dublin diners</span>
          </div>
        </div>
      </div>

      {/* 5. LUXURY CULINARY CTA BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1C120C] via-[#241710] to-[#150D08] border border-[#3E291C] text-white p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F15A24]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D49B37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#D49B37] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXPERIENCE THE ROYAL HERITAGE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Ready to Savor Authentic Royal Flavors?
            </h2>

            <p className="text-[14px] sm:text-[15px] text-[#D5CBC2] max-w-xl leading-relaxed">
              Order directly online for prompt 30-45 minute doorstep delivery across Dublin, or join
              us for an unforgettable dining experience at our South William Street restaurant.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#E2D8CE] pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#F15A24]" />
                <span>18 South William St, Dublin 2</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0FA958]" />
                <span>Open Daily 12:00 PM – 11:00 PM</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center lg:items-end">
            <Link
              href="/menu"
              className="w-full sm:w-auto lg:w-full py-3.5 px-7 rounded-xl bg-gradient-to-r from-[#FBA138] to-[#F15A24] hover:from-[#F59828] hover:to-[#E54E18] text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-98 transition-all"
            >
              <span>Explore Online Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/reservations"
              className="w-full sm:w-auto lg:w-full py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-[14px] font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4 text-[#D49B37]" />
              <span>Reserve a Table</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
