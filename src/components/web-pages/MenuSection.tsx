'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { applyPromoCode, setCartOpen } from '../../redux/slices/cartSlice';
import { CATEGORIES, MenuItem } from '../../Mockdata';
import { DishCard } from '../shared/DishCard';
import { ModifierModal } from '../shared/ModifierModal';
import { ArrowRight } from 'lucide-react';

export const MenuSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const menuState = useAppSelector((state) => state.menu);
  const [activeDish, setActiveDish] = useState<MenuItem | null>(null);

  // Featured Popular Dishes for Homepage Showcase
  const popularDishes = menuState.items.slice(0, 8);

  const handleApplyPromoAndScroll = () => {
    dispatch(applyPromoCode('SPICE20'));
    dispatch(setCartOpen(true));
  };

  return (
    <div id="menu-section" className="py-12 space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* SECTION 1: POPULAR CATEGORIES */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-9">
          <div>
            {/* Decorative Top Accent Line */}
            <div className="section-decorator" />
            <h2 className="section-title">
              Popular Categories
            </h2>
            <p className="section-subtitle mt-1.5">
              Browse our specialties to discover authentic heritage dishes
            </p>
          </div>

          <Link
            href="/menu"
            className="text-sm font-semibold text-[#B84A22] hover:text-[#9E3E1B] flex items-center gap-1.5 group self-start sm:self-auto py-1 transition-colors"
          >
            <span>View All Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 6 Category Cards Grid - Each links to dedicated category on /menu */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.id}`}
              className="bg-white border border-[#E5E5E5] hover:border-[#B84A22] rounded-3xl overflow-hidden group flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[rgb(249,249,249)]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />
              </div>

              <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-[15px] text-[#1A130E] group-hover:text-[#B84A22] transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <span className="text-[12px] font-medium text-[#747474] block mt-0.5">{cat.count}</span>
                </div>

                {/* Circular Arrow Button */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all bg-[rgb(249,249,249)] group-hover:bg-[#B84A22] text-[#747474] group-hover:text-white border border-[#E5E5E5]">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SECTION 2: POPULAR DISHES */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-9">
          <div>
            {/* Decorative Top Accent Line */}
            <div className="section-decorator" />
            <h2 className="section-title">
              Popular Dishes
            </h2>
            <p className="section-subtitle mt-1.5">
              Handpicked favorites, made with love and authentic spices
            </p>
          </div>

          <Link
            href="/menu"
            className="text-sm font-semibold text-[#B84A22] hover:text-[#9E3E1B] flex items-center gap-1.5 group self-start sm:self-auto py-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dishes Grid: Ergonomic 4-Column Responsive Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onSelect={(selected) => setActiveDish(selected)}
            />
          ))}
        </div>
      </div>

      {/* SECTION 3: DUAL PROMOTIONAL BANNERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Banner 1: Special Offer */}
        <div className="relative rounded-3xl overflow-hidden border border-[#3A2D24] text-white p-7 sm:p-9 flex flex-col justify-between shadow-xl group min-h-[310px]">
          {/* Full Cover Food Image with Gradient Scrim */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
            <img
              src="/images/amber_hero_dish.jpg"
              alt="Royal Dum Biryani Special Offer"
              className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700"
            />
            {/* Rich cinematic gradient covering the whole card so text remains super clear */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#140D09] via-[#140D09]/85 sm:via-[#140D09]/75 to-[#140D09]/30" />
          </div>

          <div className="relative z-10 max-w-sm space-y-3.5">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#D49B37] uppercase block">
              SPECIAL OFFER
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Get 20% Off <br /> on Your First Order
            </h3>
            <p className="text-[13px] sm:text-[14px] text-[#E0D7CF] leading-relaxed">
              Use code <span className="font-bold text-[#D49B37] bg-white/10 px-2 py-0.5 rounded-md border border-[#D49B37]/30">SPICE20</span> at checkout and enjoy 20% discount on your first online order.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleApplyPromoAndScroll}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-[13px] font-semibold flex items-center gap-2 shadow-[0_4px_14px_rgba(184,74,34,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/offers"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[13px] font-medium border border-white/20 backdrop-blur-xs flex items-center gap-1.5 transition-all"
              >
                <span>View All Offers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Banner 2: Weekend Special */}
        <div className="relative rounded-3xl overflow-hidden border border-[#3A2D24] text-white p-7 sm:p-9 flex flex-col justify-between shadow-xl group min-h-[310px]">
          {/* Full Cover Food Image with Gradient Scrim */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
            <img
              src="/images/hero_dish.jpg"
              alt="Family Combo Feast"
              className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700"
            />
            {/* Rich cinematic gradient covering the whole card so text remains super clear */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#140D09] via-[#140D09]/85 sm:via-[#140D09]/75 to-[#140D09]/30" />
          </div>

          <div className="relative z-10 max-w-sm space-y-3.5">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#D49B37] uppercase block">
              WEEKEND SPECIAL
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Family Combo <br /> Meals
            </h3>
            <p className="text-[13px] sm:text-[14px] text-[#E0D7CF] leading-relaxed">
              Feed your family with our chef-crafted special combo deals, fresh tandoor sides and aromatic curries.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => dispatch(setCartOpen(true))}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-[13px] font-semibold flex items-center gap-2 shadow-[0_4px_14px_rgba(184,74,34,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/offers"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[13px] font-medium border border-white/20 backdrop-blur-xs flex items-center gap-1.5 transition-all"
              >
                <span>View All Offers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Customizer Modal */}
      <ModifierModal dish={activeDish} onClose={() => setActiveDish(null)} />
    </div>
  );
};
