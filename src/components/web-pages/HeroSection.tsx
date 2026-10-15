'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { setFulfillmentType } from '../../redux/slices/fulfillmentSlice';
import {
  Bike,
  Store,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
} from 'lucide-react';

interface HeroSlide {
  id: number;
  image: string;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  dishHighlight: string;
  rating: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: '/images/amber_hero_dish.jpg',
    badge: 'ROYAL HERITAGE SPECIALTY',
    titlePrefix: 'Discover The Real Taste of',
    titleHighlight: 'Heritage Spices',
    description:
      'Dum-cooked in antique copper handis with saffron, stone-ground royal spices and aged aromatic basmati.',
    dishHighlight: "Chef's Signature Dum Biryani",
    rating: '4.9 ★ (1,240+ Reviews)',
  },
  {
    id: 2,
    image: '/images/curry_dish.jpg',
    badge: 'OLD DELHI SLOW TRADITION',
    titlePrefix: 'Velvety Rich & Authentic',
    titleHighlight: 'Royal Curries',
    description:
      'Slow-simmered for 8+ hours with creamy butter, roasted cashews, and aromatic sun-dried fenugreek.',
    dishHighlight: 'Old Delhi Butter Chicken',
    rating: '4.8 ★ (980+ Reviews)',
  },
  {
    id: 3,
    image: '/images/grill_dish.jpg',
    badge: '480°C CLAY TANDOOR',
    titlePrefix: 'Smoky & Sizzling',
    titleHighlight: 'Char-Grilled Feasts',
    description:
      'Marinated for 24 hours in strained yogurt and 14 royal spices, blistered over hot charcoal embers.',
    dishHighlight: 'Tandoori Chicken Skewers',
    rating: '4.9 ★ (850+ Reviews)',
  },
  {
    id: 4,
    image: '/images/hero_dish.jpg',
    badge: 'SPECIAL WEEKEND FEAST',
    titlePrefix: 'Celebrate with Gourmet',
    titleHighlight: 'Family Combos',
    description:
      'Complete celebratory dining featuring biryanis, hot garlic butter naans, aromatic gravies and sides.',
    dishHighlight: 'Grand Amber Family Feast',
    rating: '4.9 ★ (2,100+ Reviews)',
  },
];

export const HeroSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance slider every 5.5 seconds unless user hovers
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-[rgb(249,249,249)] pb-12 sm:pb-16">
      {/* Full Screen Width (Edge-to-Edge) Cinematic Hero Slider */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full overflow-hidden min-h-[540px] sm:min-h-[600px] lg:min-h-[640px] flex items-center shadow-md"
      >
        {/* Background Images spanning 100% full screen width with smooth fade transition */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 scale-100 z-0' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.titleHighlight}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}

        {/* Luxury Dark Gradient Overlay for 100% Text Readability spanning full screen */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(90deg, rgba(20, 14, 10, 0.95) 0%, rgba(20, 14, 10, 0.88) 45%, rgba(20, 14, 10, 0.52) 75%, rgba(20, 14, 10, 0.3) 100%)',
          }}
        />

        {/* Subtle Vertical Vignette for Top/Bottom Clarity */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(20, 14, 10, 0.4) 0%, transparent 40%, rgba(20, 14, 10, 0.6) 100%)',
          }}
        />

        {/* Slide Content Container - Aligned with Global Container Grid */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-14 sm:py-16 lg:py-20 text-white">
          <div className="max-w-2xl">
            {/* Top Category Indicator (Clean Bold Typography without extra pill bg) */}
            <div className="inline-flex items-center gap-2 text-[#FBA138] text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#FBA138]" />
              <span>{HERO_SLIDES[currentSlide].badge}</span>
            </div>

            {/* Main Headline (Fixed minimum height across slides to prevent layout shifts) */}
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-white leading-[1.14] tracking-tight mb-4 drop-shadow-sm min-h-[76px] sm:min-h-[116px] lg:min-h-[128px]">
              {HERO_SLIDES[currentSlide].titlePrefix} <br />
              <span className="text-[#D49B37]">
                {HERO_SLIDES[currentSlide].titleHighlight}
              </span>
            </h1>

            {/* Description Paragraph (Fixed minimum height to prevent vertical jitter) */}
            <p className="text-sm sm:text-base text-[#E2D8CE] max-w-xl leading-relaxed mb-6 drop-shadow font-normal min-h-[44px] sm:min-h-[48px]">
              {HERO_SLIDES[currentSlide].description}
            </p>

            {/* Dual CTAs (Dedicated Row) */}
            <div className="flex items-center gap-3.5 sm:gap-4 mb-5">
              <button
                onClick={scrollToMenu}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-sm font-semibold flex items-center gap-2 shadow-[0_4px_16px_rgba(184,74,34,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToMenu}
                className="px-6 py-3.5 rounded-xl border border-white/30 bg-white/10 hover:bg-white hover:text-[#1A130E] text-white text-sm font-semibold backdrop-blur-md transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
              >
                View Menu
              </button>
            </div>

            {/* Visual Social Proof Review Badge - Fixed, rock-solid position across all slides */}
            <div className="flex items-center gap-3 pt-1">
              {/* Overlapping Customer Avatars */}
              <div className="flex items-center -space-x-2 shrink-0">
                <img
                  src="/images/avatars/sarah.jpg"
                  alt="Customer avatar"
                  className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border-2 border-white/30 object-cover shadow-sm"
                />
                <img
                  src="/images/avatars/james.jpg"
                  alt="Customer avatar"
                  className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border-2 border-white/30 object-cover shadow-sm"
                />
                <img
                  src="/images/avatars/ayesha.jpg"
                  alt="Customer avatar"
                  className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border-2 border-white/30 object-cover shadow-sm"
                />
              </div>

              {/* Rating Stars & Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-[#FBA138]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FBA138] text-[#FBA138]" />
                  ))}
                </div>
                <span className="font-bold text-white text-xs sm:text-sm">4.9</span>
                <span className="text-white/60 text-xs">·</span>
                <span className="text-white/90 text-xs sm:text-sm font-medium">1,240+ reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Left Arrow Button (Edge-aligned with frosted glass) */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-4 sm:left-6 z-30 w-11 h-11 rounded-full bg-white/15 hover:bg-[#B84A22] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Right Arrow Button (Edge-aligned with frosted glass) */}
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-4 sm:right-6 z-30 w-11 h-11 rounded-full bg-white/15 hover:bg-[#B84A22] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Bottom Slide Dots & Preview Indicators */}
        <div className="absolute bottom-6 right-6 sm:right-12 z-30 flex items-center gap-2">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all rounded-full ${
                idx === currentSlide
                  ? 'w-8 h-2.5 bg-[#B84A22] shadow-md'
                  : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Clean Clutter-Free Value Strip (Separated cleanly below the slider) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="bg-white border border-[#EFEAE4] rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(26,19,14,0.02)]">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#F2EFEA]">
            {/* Prop 1: Fast Doorstep Delivery */}
            <div
              onClick={() => {
                dispatch(setFulfillmentType('delivery'));
                scrollToMenu();
              }}
              className="flex items-center gap-3.5 px-3 py-3 sm:py-1 cursor-pointer hover:opacity-85 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#B84A22] shrink-0">
                <Bike className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-[14.5px] font-bold text-[#1A130E] truncate">Doorstep Delivery</h4>
                  <span className="text-[10px] font-bold text-[#B84A22] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 shrink-0">~30-35m</span>
                </div>
                <p className="text-[12px] text-[#78716C] mt-0.5 truncate">Across Dublin Zones 1 to 8 · Free over €30</p>
              </div>
            </div>

            {/* Prop 2: Counter Takeaway */}
            <div
              onClick={() => {
                dispatch(setFulfillmentType('collection'));
                scrollToMenu();
              }}
              className="flex items-center gap-3.5 px-3 md:px-5 py-3 sm:py-1 cursor-pointer hover:opacity-85 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#B84A22] shrink-0">
                <Store className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-[14.5px] font-bold text-[#1A130E] truncate">Counter Takeaway</h4>
                  <span className="text-[10px] font-bold text-[#B84A22] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 shrink-0">~15-20m</span>
                </div>
                <p className="text-[12px] text-[#78716C] mt-0.5 truncate">18 South William St · Packaged hot & fresh</p>
              </div>
            </div>

            {/* Prop 3: Open Daily */}
            <div
              onClick={scrollToMenu}
              className="flex items-center gap-3.5 px-3 md:px-5 py-3 sm:py-1 cursor-pointer hover:opacity-85 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Clock className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-[14.5px] font-bold text-[#1A130E] truncate">Clay Oven Daily</h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Open 7 Days
                  </span>
                </div>
                <p className="text-[12px] text-[#78716C] mt-0.5 truncate">11:00 AM – 11:00 PM · 100% Halal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

