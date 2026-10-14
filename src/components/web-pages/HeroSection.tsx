'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setFulfillmentType } from '../../redux/slices/fulfillmentSlice';
import { RESTAURANT_INFO } from '../../Mockdata';
import {
  Bike,
  Store,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const fulfillment = useAppSelector((state) => state.fulfillment);

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF6EF] pt-6 pb-16 lg:py-16">
      {/* Subtle background star anise spice illustration */}
      <div className="absolute top-10 right-0 w-96 h-96 opacity-[0.04] pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#B84A22]">
          <path d="M50 0 C45 25 25 45 0 50 C25 55 45 75 50 100 C55 75 75 55 100 50 C75 45 55 25 50 0 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Authentic Flavors Headline */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-[#B84A22] uppercase block">
              AUTHENTIC FLAVORS • TIMELESS RECIPES
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A130E] leading-[1.15] tracking-tight">
              Discover <br />
              The Real Taste of <br />
              <span className="italic font-normal text-[#B84A22]">Heritage Spices</span>
            </h1>

            <p className="text-sm sm:text-base text-[#786960] max-w-lg leading-relaxed font-normal">
              From traditional royal spices to modern culinary twists, we bring you the finest
              dum-cooked biryanis and authentic regional curries — freshly made, always.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={scrollToMenu}
                className="btn-amber-primary px-7 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-amber"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToMenu}
                className="btn-amber-outline px-6 py-3 text-xs sm:text-sm font-semibold"
              >
                View Menu
              </button>
            </div>

            {/* 3 Value Propositions */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#EBE2D7]/80">
              {/* Prop 1: Fast Delivery */}
              <div
                onClick={() => dispatch(setFulfillmentType('delivery'))}
                className="cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-[#F3ECE2] group-hover:bg-[#B84A22] text-[#B84A22] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                  <Bike className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-[#1A130E]">Fast Delivery</h4>
                  <span className="text-[11px] text-[#786960]">To Your Doorstep</span>
                </div>
              </div>

              {/* Prop 2: Collection */}
              <div
                onClick={() => dispatch(setFulfillmentType('collection'))}
                className="cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-[#F3ECE2] group-hover:bg-[#B84A22] text-[#B84A22] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-[#1A130E]">Collection</h4>
                  <span className="text-[11px] text-[#786960]">Takeaway</span>
                </div>
              </div>

              {/* Prop 3: Open Daily */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 rounded-full bg-[#F3ECE2] text-[#B84A22] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-[#1A130E]">Open Daily</h4>
                  <span className="text-[11px] text-[#786960]">11:00 AM – 11:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Copper Handi Biryani Photography */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-lg">
              {/* Outer soft shadow ring */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square border-4 border-white/80">
                <img
                  src="/images/amber_hero_dish.jpg"
                  alt="Royal Chicken Dum Biryani in Copper Handi"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Heritage Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-[#B84A22] shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-[#B84A22]" />
                  <span>Chef&apos;s Royal Specialty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
