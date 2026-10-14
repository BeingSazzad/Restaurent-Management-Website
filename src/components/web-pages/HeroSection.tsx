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
    <section className="relative bg-[#FAF6EF] pt-4 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Full-width Cinematic Hero Slider Container */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative rounded-3xl overflow-hidden min-h-[520px] sm:min-h-[560px] lg:min-h-[600px] flex items-center shadow-2xl border border-[#2D241E]/30"
        >
          {/* Background Images with smooth fade transition */}
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

          {/* Luxury Dark Gradient Overlay for 100% Text Readability */}
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

          {/* Main Slide Content - Always 100% Readable */}
          <div className="relative z-20 w-full max-w-3xl px-6 sm:px-12 lg:px-16 py-12 text-white">
            {/* Top Category Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D49B37] text-xs font-semibold uppercase tracking-wider mb-5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D49B37]" />
              <span>{HERO_SLIDES[currentSlide].badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.14] tracking-tight mb-4 drop-shadow-sm">
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
                className="px-6 py-3.5 rounded-full border border-white/40 bg-white/10 hover:bg-white hover:text-[#1A130E] text-white text-sm font-semibold backdrop-blur-md transition-all shadow-sm"
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

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-4 z-30 w-11 h-11 rounded-full bg-white/15 hover:bg-[#B84A22] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-4 z-30 w-11 h-11 rounded-full bg-white/15 hover:bg-[#B84A22] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Bottom Slide Dots & Preview Indicators */}
          <div className="absolute bottom-5 right-6 sm:right-12 z-30 flex items-center gap-2">
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

        {/* 3 Value Propositions Bar (Fast Delivery, Collection, Open Daily) */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Prop 1: Fast Delivery */}
          <div
            onClick={() => {
              dispatch(setFulfillmentType('delivery'));
              scrollToMenu();
            }}
            className="cursor-pointer amber-card p-4 flex items-center gap-3.5 hover:border-[#B84A22] transition-colors"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#F3ECE2] text-[#B84A22] flex items-center justify-center shrink-0 border border-[#E9DFD3]">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1A130E]">Doorstep Delivery</h4>
              <span className="text-xs text-[#747474]">Across Dublin Zones 1-8 · 30-35 mins</span>
            </div>
          </div>

          {/* Prop 2: Takeaway Collection */}
          <div
            onClick={() => {
              dispatch(setFulfillmentType('collection'));
              scrollToMenu();
            }}
            className="cursor-pointer amber-card p-4 flex items-center gap-3.5 hover:border-[#B84A22] transition-colors"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#F3ECE2] text-[#B84A22] flex items-center justify-center shrink-0 border border-[#E9DFD3]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1A130E]">Counter Takeaway</h4>
              <span className="text-xs text-[#747474]">South William St Counter · 15-20 mins</span>
            </div>
          </div>

          {/* Prop 3: Open Daily */}
          <div className="amber-card p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F3ECE2] text-[#B84A22] flex items-center justify-center shrink-0 border border-[#E9DFD3]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1A130E]">Open Daily 7 Days</h4>
              <span className="text-xs text-[#747474]">11:00 AM – 11:00 PM · Hot & Fresh</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

