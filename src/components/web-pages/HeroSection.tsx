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
    titlePrefix: 'Smoky & Sizzling Char-Grilled',
    titleHighlight: 'Tandoori Feasts',
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
    <section className="relative bg-[rgb(249,249,249)]">
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
            {/* Top Category Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D49B37] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D49B37]" />
              <span>{HERO_SLIDES[currentSlide].badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-white leading-[1.14] tracking-tight mb-4 drop-shadow-sm">
              {HERO_SLIDES[currentSlide].titlePrefix} <br />
              <span className="text-[#D49B37]">
                {HERO_SLIDES[currentSlide].titleHighlight}
              </span>
            </h1>

            {/* Description Paragraph */}
            <p className="text-sm sm:text-base text-[#E2D8CE] max-w-xl leading-relaxed mb-8 drop-shadow font-normal">
              {HERO_SLIDES[currentSlide].description}
            </p>

            {/* Dual CTAs & Live Dish Pill */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={scrollToMenu}
                className="btn-amber-primary px-7 py-3.5 text-sm font-semibold flex items-center gap-2 shadow-amber hover:scale-105 transition-transform"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToMenu}
                className="px-6 py-3.5 rounded-xl border border-white/40 bg-white/10 hover:bg-white hover:text-[#1A130E] text-white text-sm font-semibold backdrop-blur-md transition-all shadow-sm"
              >
                View Menu
              </button>

              {/* Floating Dish Pill */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A130E]/80 backdrop-blur-md border border-white/15 text-xs text-[#E2D8CE]">
                <span className="w-2 h-2 rounded-full bg-[#0FA958] animate-pulse" />
                <span className="font-semibold text-white">
                  {HERO_SLIDES[currentSlide].dishHighlight}
                </span>
                <span className="text-white/40">|</span>
                <span className="text-[#D49B37] font-medium">
                  {HERO_SLIDES[currentSlide].rating}
                </span>
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

      {/* Premium Floating Value Propositions Dock (Senior Product Designer Standard) */}
      <div className="-mt-10 sm:-mt-14 relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Prop 1: Fast Doorstep Delivery */}
          <div
            onClick={() => {
              dispatch(setFulfillmentType('delivery'));
              scrollToMenu();
            }}
            className="group cursor-pointer bg-white border border-[#E5E5E5] hover:border-[#B84A22]/60 rounded-3xl p-5 sm:p-6 shadow-[0_14px_36px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_rgba(184,74,34,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[rgb(249,249,249)] group-hover:bg-[#B84A22] text-[#B84A22] group-hover:text-white border border-[#E5E5E5] group-hover:border-[#B84A22] flex items-center justify-center shrink-0 transition-all duration-300 shadow-xs">
                <Bike className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[rgb(249,249,249)] text-[#B84A22] border border-[#E5E5E5]">
                    ~30-35 MINS
                  </span>
                </div>
                <h3 className="font-semibold text-[17px] text-[#1A130E] group-hover:text-[#B84A22] transition-colors leading-snug">
                  Doorstep Delivery
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#666666] leading-[20px] mt-0.5">
                  Across Dublin Zones 1 to 8 · Free over €30
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[rgb(249,249,249)] group-hover:bg-[#B84A22] text-[#747474] group-hover:text-white border border-[#E5E5E5] group-hover:border-[#B84A22] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:translate-x-1 shadow-xs hidden sm:flex">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Prop 2: Counter Takeaway */}
          <div
            onClick={() => {
              dispatch(setFulfillmentType('collection'));
              scrollToMenu();
            }}
            className="group cursor-pointer bg-white border border-[#E5E5E5] hover:border-[#B84A22]/60 rounded-3xl p-5 sm:p-6 shadow-[0_14px_36px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_rgba(184,74,34,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[rgb(249,249,249)] group-hover:bg-[#B84A22] text-[#B84A22] group-hover:text-white border border-[#E5E5E5] group-hover:border-[#B84A22] flex items-center justify-center shrink-0 transition-all duration-300 shadow-xs">
                <Store className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[rgb(249,249,249)] text-[#B84A22] border border-[#E5E5E5]">
                    ~15-20 MINS
                  </span>
                </div>
                <h3 className="font-semibold text-[17px] text-[#1A130E] group-hover:text-[#B84A22] transition-colors leading-snug">
                  Counter Takeaway
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#666666] leading-[20px] mt-0.5">
                  18 South William St · Packaged hot & fresh
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[rgb(249,249,249)] group-hover:bg-[#B84A22] text-[#747474] group-hover:text-white border border-[#E5E5E5] group-hover:border-[#B84A22] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:translate-x-1 shadow-xs hidden sm:flex">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Prop 3: Open Daily */}
          <div
            onClick={scrollToMenu}
            className="group cursor-pointer bg-white border border-[#E5E5E5] hover:border-[#B84A22]/60 rounded-3xl p-5 sm:p-6 shadow-[0_14px_36px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_rgba(184,74,34,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[rgb(249,249,249)] group-hover:bg-[#B84A22] text-[#B84A22] group-hover:text-white border border-[#E5E5E5] group-hover:border-[#B84A22] flex items-center justify-center shrink-0 transition-all duration-300 shadow-xs">
                <Clock className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[rgb(249,249,249)] text-[#0FA958] border border-[#E5E5E5] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0FA958] animate-pulse" />
                    OPEN 7 DAYS
                  </span>
                </div>
                <h3 className="font-semibold text-[17px] text-[#1A130E] group-hover:text-[#B84A22] transition-colors leading-snug">
                  Clay Oven Daily
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#666666] leading-[20px] mt-0.5">
                  11:00 AM – 11:00 PM · 100% Halal certified
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[rgb(249,249,249)] group-hover:bg-[#B84A22] text-[#747474] group-hover:text-white border border-[#E5E5E5] group-hover:border-[#B84A22] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:translate-x-1 shadow-xs hidden sm:flex">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

