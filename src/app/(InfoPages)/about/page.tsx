'use client';

import React from 'react';
import Link from 'next/link';
import {
  Flame,
  Sparkles,
  ChefHat,
  Award,
  Heart,
  UtensilsCrossed,
  CheckCircle2,
  Phone,
  Calendar,
  ArrowRight,
  Star,
  Clock,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Users,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[rgb(249,249,249)]">
      {/* 1. HERO BANNER WITH BREADCRUMB */}
      <section className="relative bg-[#1A130E] text-white py-16 sm:py-24 overflow-hidden">
        {/* Background photo with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/about_banner.jpg"
            alt="Amber Spice Restaurant Atmosphere"
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A130E] via-[#1A130E]/90 to-[#1A130E]/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#FBA138] text-[12px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Authentic Heritage & Passion</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-['Poppins']">
            About Us
          </h1>

          <div className="flex items-center justify-center gap-2 text-[13px] sm:text-[14px] text-stone-300 font-medium">
            <Link href="/" className="hover:text-[#F15A24] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-[#FBA138]">About Us</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN STORY SECTION (DUAL COLUMN + MEDIA COLLAGE) */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Story & Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="inline-block px-3.5 py-1 rounded-md bg-orange-100/70 border border-orange-200 text-[#B84A22] text-[11px] font-bold uppercase tracking-widest">
                Our Story & Heritage
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A130E] leading-tight font-['Poppins']">
                From Royal Heritage Recipes To Your Modern Dining Table
              </h2>
            </div>

            <p className="text-[14px] sm:text-[15px] text-[#555555] leading-relaxed">
              At Amber Spice, every recipe is an authentic homage to centuries-old Awadhi and Mughlai culinary lineage. While fast-paced modern kitchens turned to shortcuts and commercial powders, we chose the sacred, unhurried craft of ancient dum pukht — slow-cooking with 100% stone-ground spices in sealed copper handis.
            </p>

            <p className="text-[14px] sm:text-[15px] text-[#555555] leading-relaxed">
              We pair timeless Indian heritage techniques with premium Irish produce — from 100% grass-fed halal beef to farm-fresh vegetables and local dairy, delivering honest flavours in every bite.
            </p>

            {/* Culinary Highlights: Unified Standard Pillars */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F4] border border-[#EAE5DF]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pillar 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#EAE5DF] text-[#B84A22] flex items-center justify-center shrink-0 shadow-xs">
                    <Flame className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#1A130E]">Authentic Dum Pukht</h4>
                    <p className="text-[12px] text-[#78716C] leading-snug mt-0.5">Slow-sealed in antique copper handis</p>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#EAE5DF] text-[#B84A22] flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#1A130E]">100% Halal Certified</h4>
                    <p className="text-[12px] text-[#78716C] leading-snug mt-0.5">Grass-fed Irish beef & local poultry</p>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#EAE5DF] text-[#B84A22] flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#1A130E]">Stone-Ground Spices</h4>
                    <p className="text-[12px] text-[#78716C] leading-snug mt-0.5">28 royal aromatics roasted daily</p>
                  </div>
                </div>

                {/* Pillar 4 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#EAE5DF] text-[#B84A22] flex items-center justify-center shrink-0 shadow-xs">
                    <ChefHat className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#1A130E]">Heritage Master Chefs</h4>
                    <p className="text-[12px] text-[#78716C] leading-snug mt-0.5">Centuries-old Lucknow culinary lineage</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA & Customer Social Proof */}
            <div className="pt-3 flex flex-wrap items-center gap-6">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-[14px] font-bold shadow-[0_4px_14px_rgba(184,74,34,0.3)] hover:scale-[1.02] active:scale-98 transition-all"
              >
                <span>Explore Full Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Avatar stack + Social Proof */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                    src="/images/avatars/ayesha.jpg"
                    alt="Customer"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                    src="/images/avatars/cian.jpg"
                    alt="Customer"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                    src="/images/avatars/elena.jpg"
                    alt="Customer"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                    src="/images/avatars/james.jpg"
                    alt="Customer"
                  />
                </div>
                <div>
                  <div className="flex items-center text-[#FBA138] text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[12px] font-bold text-[#1A130E] block">
                    10K+ Happy Diners
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Montage with Floating Badges */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md sm:max-w-lg lg:max-w-none">
              {/* Primary Large Image */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E5E5E5] shadow-xl group aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="/images/amber_hero_dish.jpg"
                  alt="Amber Spice Royal Dum Cooking"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FBA138] block mb-1">
                    Signature Handi
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold">Awadhi Dum Biryani</h3>
                  <p className="text-xs text-[#E2D8CE] mt-0.5">Sealed with dough over charcoal embers</p>
                </div>
              </div>

              {/* Overlapping Badge: 15+ Years Experience (like reference) */}
              <div className="absolute -top-4 -right-2 sm:-top-6 sm:right-6 bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white p-4 sm:p-5 rounded-2xl shadow-xl text-center border-2 border-white">
                <span className="text-2xl sm:text-3xl font-extrabold block font-['Poppins']">15+</span>
                <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider text-white/90 block leading-tight">
                  Years of<br />Excellence
                </span>
              </div>

              {/* Overlapping Secondary Image (bottom-left) */}
              <div className="absolute -bottom-6 -left-2 sm:-bottom-8 sm:left-4 w-44 sm:w-56 rounded-2xl overflow-hidden border-4 border-white shadow-2xl group">
                <img
                  src="/images/grill_dish.jpg"
                  alt="Charcoal Tandoori Grill"
                  className="w-full h-28 sm:h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[11px] font-bold text-white flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[#F15A24]" /> 480°C Clay Tandoor
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE 5 STATS COUNTER CARDS (Proper radius & luxury Amber Spice color palette) */}
      <section className="py-12 sm:py-14 bg-[#FAF7F4] border-y border-[#EAE5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
            {/* Stat Card 1 */}
            <div className="bg-white rounded-2xl p-6 text-center border border-[#EAE5DF] shadow-[0_2px_12px_rgba(26,19,14,0.03)] hover:-translate-y-1 hover:border-[#B84A22]/50 hover:shadow-[0_10px_24px_rgba(184,74,34,0.08)] transition-all duration-300 flex flex-col items-center justify-between group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFF5ED] to-[#FFE8D6] text-[#B84A22] border border-[#FFD8BD] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#B84A22] group-hover:text-white transition-all duration-300 shadow-xs">
                <UtensilsCrossed className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold block text-[#1A130E] group-hover:text-[#B84A22] transition-colors font-['Poppins']">
                  50k+
                </span>
                <span className="text-[11.5px] sm:text-[12px] font-bold text-[#78716C] uppercase tracking-wider block mt-1.5">
                  Dishes Served
                </span>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white rounded-2xl p-6 text-center border border-[#EAE5DF] shadow-[0_2px_12px_rgba(26,19,14,0.03)] hover:-translate-y-1 hover:border-[#B84A22]/50 hover:shadow-[0_10px_24px_rgba(184,74,34,0.08)] transition-all duration-300 flex flex-col items-center justify-between group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFF5ED] to-[#FFE8D6] text-[#B84A22] border border-[#FFD8BD] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#B84A22] group-hover:text-white transition-all duration-300 shadow-xs">
                <Heart className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold block text-[#1A130E] group-hover:text-[#B84A22] transition-colors font-['Poppins']">
                  15k+
                </span>
                <span className="text-[11.5px] sm:text-[12px] font-bold text-[#78716C] uppercase tracking-wider block mt-1.5">
                  Happy Guests
                </span>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white rounded-2xl p-6 text-center border border-[#EAE5DF] shadow-[0_2px_12px_rgba(26,19,14,0.03)] hover:-translate-y-1 hover:border-[#B84A22]/50 hover:shadow-[0_10px_24px_rgba(184,74,34,0.08)] transition-all duration-300 flex flex-col items-center justify-between group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFF5ED] to-[#FFE8D6] text-[#B84A22] border border-[#FFD8BD] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#B84A22] group-hover:text-white transition-all duration-300 shadow-xs">
                <Sparkles className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold block text-[#1A130E] group-hover:text-[#B84A22] transition-colors font-['Poppins']">
                  28+
                </span>
                <span className="text-[11.5px] sm:text-[12px] font-bold text-[#78716C] uppercase tracking-wider block mt-1.5">
                  Secret Spices
                </span>
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-white rounded-2xl p-6 text-center border border-[#EAE5DF] shadow-[0_2px_12px_rgba(26,19,14,0.03)] hover:-translate-y-1 hover:border-[#B84A22]/50 hover:shadow-[0_10px_24px_rgba(184,74,34,0.08)] transition-all duration-300 flex flex-col items-center justify-between group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFF5ED] to-[#FFE8D6] text-[#B84A22] border border-[#FFD8BD] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#B84A22] group-hover:text-white transition-all duration-300 shadow-xs">
                <Award className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold block text-[#1A130E] group-hover:text-[#B84A22] transition-colors font-['Poppins']">
                  15+
                </span>
                <span className="text-[11.5px] sm:text-[12px] font-bold text-[#78716C] uppercase tracking-wider block mt-1.5">
                  Culinary Awards
                </span>
              </div>
            </div>

            {/* Stat Card 5 */}
            <div className="col-span-2 md:col-span-1 bg-white rounded-2xl p-6 text-center border border-[#EAE5DF] shadow-[0_2px_12px_rgba(26,19,14,0.03)] hover:-translate-y-1 hover:border-[#B84A22]/50 hover:shadow-[0_10px_24px_rgba(184,74,34,0.08)] transition-all duration-300 flex flex-col items-center justify-between group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFF5ED] to-[#FFE8D6] text-[#B84A22] border border-[#FFD8BD] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#B84A22] group-hover:text-white transition-all duration-300 shadow-xs">
                <ChefHat className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold block text-[#1A130E] group-hover:text-[#B84A22] transition-colors font-['Poppins']">
                  30+
                </span>
                <span className="text-[11.5px] sm:text-[12px] font-bold text-[#78716C] uppercase tracking-wider block mt-1.5">
                  Master Chefs & Staff
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT WE OFFER / 3 CORE SPECIALTIES (Like "Provide Professional..." in ref) */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="inline-block px-3.5 py-1 rounded-md bg-orange-100/70 border border-orange-200 text-[#B84A22] text-[11px] font-bold uppercase tracking-widest">
            Our Specialties
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A130E] font-['Poppins']">
            Authentic Recipes Crafted with Royal Precision
          </h2>
          <p className="text-[14px] text-[#747474]">
            Explore the culinary pillars that define the unforgettable dining journey at Amber Spice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service Card 1 */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden flex flex-col justify-between group hover:border-[#B84A22]/40 hover:shadow-xl transition-all duration-300">
            <div className="relative h-56 overflow-hidden">
              <img
                src="/images/amber_hero_dish.jpg"
                alt="Handi Dum Biryani"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-white/90 backdrop-blur-md text-[#F15A24] flex items-center justify-center shadow-md">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1A130E] group-hover:text-[#B84A22] transition-colors">
                  Handi Dum Biryani
                </h3>
                <p className="text-[13px] text-[#555555] leading-relaxed mt-2">
                  Slow-cooked under dough seals in antique copper handis, braising tender halal meat and fragrant Dehradun basmati rice in trapped aromatic vapors.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F1F1F1]">
                <Link
                  href="/menu?category=biryani"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#B84A22] hover:text-[#F15A24] transition-colors"
                >
                  <span>Explore Biryanis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Service Card 2 */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden flex flex-col justify-between group hover:border-[#B84A22]/40 hover:shadow-xl transition-all duration-300">
            <div className="relative h-56 overflow-hidden">
              <img
                src="/images/grill_dish.jpg"
                alt="Clay Tandoor Kebabs"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-white/90 backdrop-blur-md text-[#F15A24] flex items-center justify-center shadow-md">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1A130E] group-hover:text-[#B84A22] transition-colors">
                  Charcoal Tandoori Grills
                </h3>
                <p className="text-[13px] text-[#555555] leading-relaxed mt-2">
                  Succulent skewers roasted over hardwood lump charcoal at 480°C. Delivers a delicate charred crust while locking in uncompromised juiciness.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F1F1F1]">
                <Link
                  href="/menu?category=tandoori"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#B84A22] hover:text-[#F15A24] transition-colors"
                >
                  <span>Explore Tandoor</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Service Card 3 */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden flex flex-col justify-between group hover:border-[#B84A22]/40 hover:shadow-xl transition-all duration-300">
            <div className="relative h-56 overflow-hidden">
              <img
                src="/images/curry_dish.jpg"
                alt="Royal Curries"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-white/90 backdrop-blur-md text-[#F15A24] flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1A130E] group-hover:text-[#B84A22] transition-colors">
                  Royal Mughlai Curries
                </h3>
                <p className="text-[13px] text-[#555555] leading-relaxed mt-2">
                  Velvety simmered gravies crafted with 28+ in-house stone-ground spices, natural cream, and slow-braised cuts. Rich, deep, and never greasy.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F1F1F1]">
                <Link
                  href="/menu?category=curries"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#B84A22] hover:text-[#F15A24] transition-colors"
                >
                  <span>Explore Curries</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CULINARY PROCESS WITH CENTER CHEF PORTRAIT (Directly inspired by reference row 5) */}
      <section className="py-14 sm:py-20 bg-stone-100/60 border-y border-[#EAE5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="inline-block px-3.5 py-1 rounded-md bg-orange-100/70 border border-orange-200 text-[#B84A22] text-[11px] font-bold uppercase tracking-widest">
              How We Create Magic
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A130E] font-['Poppins']">
              Our 4-Step Culinary Journey
            </h2>
            <p className="text-[14px] text-[#747474]">
              Every dish that leaves our kitchen follows a sacred sequence of traditional craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Steps: 1 & 2 */}
            <div className="lg:col-span-4 space-y-6">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-xs hover:border-[#B84A22]/40 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F15A24] flex items-center justify-center font-bold text-[14px]">
                    01
                  </div>
                  <Sparkles className="w-5 h-5 text-stone-300" />
                </div>
                <h3 className="text-base font-bold text-[#1A130E] mb-1.5">
                  Hand-Picked Whole Spices
                </h3>
                <p className="text-[13px] text-[#555555] leading-relaxed">
                  Imported green cardamom, star anise, and saffron roasted gently in-house each morning to awaken essential oils.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-xs hover:border-[#B84A22]/40 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F15A24] flex items-center justify-center font-bold text-[14px]">
                    02
                  </div>
                  <Clock className="w-5 h-5 text-stone-300" />
                </div>
                <h3 className="text-base font-bold text-[#1A130E] mb-1.5">
                  24-Hour Secret Marination
                </h3>
                <p className="text-[13px] text-[#555555] leading-relaxed">
                  100% Irish halal meats rest in hung yogurt, fresh ginger-garlic paste, and crushed herbs for optimal flavor depth.
                </p>
              </div>
            </div>

            {/* Center: Executive Chef Portrait Card */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#E5E5E5] shadow-2xl bg-white max-w-sm w-full group">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="/images/chef_master.jpg"
                    alt="Chef Tariq Mahmood - Master Executive Chef"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 text-white text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#B84A22] text-white text-[11px] font-bold uppercase tracking-wider mx-auto mb-2 shadow-xs">
                    Executive Master Chef
                  </span>
                  <h3 className="text-xl font-bold font-['Poppins']">Chef Tariq Mahmood</h3>
                  <p className="text-xs text-[#E2D8CE] mt-0.5">22+ Years Royal Heritage Experience</p>

                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-center gap-2 text-xs font-semibold text-[#FBA138]">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Table Bookings: +353 1 234 5678</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Steps: 3 & 4 */}
            <div className="lg:col-span-4 space-y-6">
              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-xs hover:border-[#B84A22]/40 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F15A24] flex items-center justify-center font-bold text-[14px]">
                    03
                  </div>
                  <Flame className="w-5 h-5 text-stone-300" />
                </div>
                <h3 className="text-base font-bold text-[#1A130E] mb-1.5">
                  Slow Charcoal Dum Cooking
                </h3>
                <p className="text-[13px] text-[#555555] leading-relaxed">
                  Sealed with fresh dough in heavy copper vessels over mild charcoal embers, locking steam and juices naturally.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-xs hover:border-[#B84A22]/40 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F15A24] flex items-center justify-center font-bold text-[14px]">
                    04
                  </div>
                  <Award className="w-5 h-5 text-stone-300" />
                </div>
                <h3 className="text-base font-bold text-[#1A130E] mb-1.5">
                  Royal Presentation & Service
                </h3>
                <p className="text-[13px] text-[#555555] leading-relaxed">
                  Served piping hot with blistered tandoori naans, rich condiments, and warm hospitalitarian care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER (Matching reference dark banner) */}
      <section className="bg-[#1A130E] text-white py-12 sm:py-16 relative overflow-hidden border-y border-stone-800">
        <div className="absolute inset-0 bg-radial from-orange-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Poppins']">
              Ready for an Unforgettable Dining Experience?
            </h2>
            <p className="text-stone-300 text-[14px] leading-relaxed">
              Reserve your table in our warm Dublin dining room or order your royal feast delivered directly to your doorstep.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/reservations"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-[14px] font-bold shadow-lg hover:scale-[1.02] active:scale-98 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Table</span>
            </Link>
            <Link
              href="/order"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[14px] font-bold hover:scale-[1.02] active:scale-98 transition-all flex items-center gap-2 backdrop-blur-xs"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Order Online</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. RECENT STORIES / BLOG SECTION (Like "Our Most Recent..." in ref) */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="inline-block px-3.5 py-1 rounded-md bg-orange-100/70 border border-orange-200 text-[#B84A22] text-[11px] font-bold uppercase tracking-widest">
            Behind Our Kitchen
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A130E] font-['Poppins']">
            Our Latest Culinary Stories
          </h2>
          <p className="text-[14px] text-[#747474]">
            Discover the time-honored secrets, craft, and lore behind our signature dishes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Blog Card 1 */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden flex flex-col justify-between group hover:border-[#B84A22]/40 hover:shadow-xl transition-all duration-300">
            <div className="relative h-52 overflow-hidden">
              <img
                src="/images/amber_hero_dish.jpg"
                alt="The Sacred Secret of Dum Pukht Cooking"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-[#FBA138]">
                Culinary Secrets
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-[12px] text-[#747474] mb-2">
                  <span>By Chef Tariq</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
                <h3 className="text-base font-bold text-[#1A130E] group-hover:text-[#B84A22] transition-colors leading-snug">
                  The Sacred Secret of Dough-Sealed Dum Pukht Cooking
                </h3>
                <p className="text-[13px] text-[#555555] leading-relaxed mt-2 line-clamp-2">
                  Why sealing heavy copper pots with wheat dough over mild embers locks in unmatched moisture and complex aromas.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F1F1F1]">
                <Link
                  href="/menu?category=biryani"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#B84A22] hover:text-[#F15A24] transition-colors"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Blog Card 2 */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden flex flex-col justify-between group hover:border-[#B84A22]/40 hover:shadow-xl transition-all duration-300">
            <div className="relative h-52 overflow-hidden">
              <img
                src="/images/curry_dish.jpg"
                alt="Stone Ground Spices"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-[#0FA958]">
                Spice Mastery
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-[12px] text-[#747474] mb-2">
                  <span>By Spice Master</span>
                  <span>•</span>
                  <span>4 min read</span>
                </div>
                <h3 className="text-base font-bold text-[#1A130E] group-hover:text-[#B84A22] transition-colors leading-snug">
                  Why We Roast 28 Whole Spices Fresh Every Morning
                </h3>
                <p className="text-[13px] text-[#555555] leading-relaxed mt-2 line-clamp-2">
                  Commercial ground powders lose their essential oils in days. Here is why freshly crushed whole spices transform curries.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F1F1F1]">
                <Link
                  href="/menu?category=curries"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#B84A22] hover:text-[#F15A24] transition-colors"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Blog Card 3 */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden flex flex-col justify-between group hover:border-[#B84A22]/40 hover:shadow-xl transition-all duration-300">
            <div className="relative h-52 overflow-hidden">
              <img
                src="/images/grill_dish.jpg"
                alt="Clay Tandoor Heat"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-[#F15A24]">
                Tandoor Craft
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-[12px] text-[#747474] mb-2">
                  <span>By Grill Chef</span>
                  <span>•</span>
                  <span>6 min read</span>
                </div>
                <h3 className="text-base font-bold text-[#1A130E] group-hover:text-[#B84A22] transition-colors leading-snug">
                  The Intense 480°C Clay Oven: The Science of Smoke & Flame
                </h3>
                <p className="text-[13px] text-[#555555] leading-relaxed mt-2 line-clamp-2">
                  How high radiant heat from authentic clay ovens blisters naan breads and seals marinated meats in seconds.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F1F1F1]">
                <Link
                  href="/menu?category=tandoori"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#B84A22] hover:text-[#F15A24] transition-colors"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
