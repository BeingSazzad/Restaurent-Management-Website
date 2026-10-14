'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSelectedCategory, setSearchQuery } from '../../redux/slices/menuSlice';
import { applyPromoCode, setCartOpen } from '../../redux/slices/cartSlice';
import { CATEGORIES, MenuItem } from '../../Mockdata';
import { DishCard } from '../shared/DishCard';
import { ModifierModal } from '../shared/ModifierModal';
import { ArrowRight } from 'lucide-react';

export const MenuSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const menuState = useAppSelector((state) => state.menu);
  const [activeDish, setActiveDish] = useState<MenuItem | null>(null);

  // Filter dishes by selected category or show all
  const filteredDishes = menuState.items.filter((dish) => {
    if (menuState.selectedCategory !== 'all' && dish.category !== menuState.selectedCategory) {
      return false;
    }
    if (menuState.searchQuery) {
      const q = menuState.searchQuery.toLowerCase();
      return (
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q) ||
        dish.categoryLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApplyPromoAndScroll = () => {
    dispatch(applyPromoCode('WELCOME10'));
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

          <button
            onClick={() => dispatch(setSelectedCategory('all'))}
            className="text-sm font-semibold text-[#B84A22] hover:text-[#9E3E1B] flex items-center gap-1.5 group self-start sm:self-auto py-1 transition-colors"
          >
            <span>View All Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 6 Category Cards Grid with Proper Proportions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {CATEGORIES.map((cat) => {
            const isSelected = menuState.selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() =>
                  dispatch(
                    setSelectedCategory(isSelected ? 'all' : cat.id)
                  )
                }
                className={`amber-card overflow-hidden cursor-pointer group flex flex-col justify-between transition-all duration-300 hover:shadow-md ${
                  isSelected ? 'ring-2 ring-[#B84A22] shadow-sm' : ''
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3ECE2]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>

                <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-[14px] text-[#1A130E] group-hover:text-[#B84A22] transition-colors leading-snug">
                      {cat.name}
                    </h3>
                    <span className="text-[12px] text-[#747474] block mt-0.5">{cat.count}</span>
                  </div>

                  {/* Circular Terracotta Arrow Button */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-[#B84A22] text-white shadow-sm'
                        : 'bg-[#FAF6EF] group-hover:bg-[#B84A22] text-[#B84A22] group-hover:text-white border border-[#EBE2D7]'
                    }`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
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

          <button
            onClick={() => dispatch(setSelectedCategory('all'))}
            className="text-sm font-semibold text-[#B84A22] hover:text-[#9E3E1B] flex items-center gap-1.5 group self-start sm:self-auto py-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dishes Grid: Ergonomic 4-Column Responsive Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDishes.map((dish) => (
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
        <div className="relative rounded-3xl overflow-hidden bg-[#201813] text-white p-7 sm:p-9 flex flex-col justify-between shadow-xl">
          <div className="relative z-10 max-w-sm space-y-3">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#D49B37] uppercase block">
              SPECIAL OFFER
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Get 20% Off <br /> on Your First Order
            </h3>
            <p className="text-xs text-[#C4B5A5] leading-relaxed">
              Use code <span className="font-bold text-[#D49B37]">SPICE20</span> at checkout and
              enjoy 20% discount on your first online order.
            </p>
            <div className="pt-2">
              <button
                onClick={handleApplyPromoAndScroll}
                className="btn-amber-primary px-6 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-amber"
              >
                <span>Order Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Food image floating on right */}
          <div className="hidden sm:block absolute right-0 bottom-0 top-0 w-1/2 overflow-hidden pointer-events-none">
            <img
              src="/images/amber_hero_dish.jpg"
              alt="Royal Dum Biryani Special Offer"
              className="w-full h-full object-cover object-left opacity-60 mix-blend-screen scale-110"
            />
          </div>
        </div>

        {/* Banner 2: Weekend Special */}
        <div className="relative rounded-3xl overflow-hidden bg-[#F4EDE2] border border-[#E9DFD3] p-7 sm:p-9 flex flex-col justify-between shadow-sm">
          <div className="relative z-10 max-w-xs space-y-3">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#B84A22] uppercase block">
              WEEKEND SPECIAL
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1A130E] leading-tight">
              Family Combo <br /> Meals
            </h3>
            <p className="text-xs text-[#786960] leading-relaxed">
              Feed your family with our chef-crafted special combo deals, fresh tandoor sides and drinks.
            </p>
            <div className="pt-2">
              <button
                onClick={() => dispatch(setCartOpen(true))}
                className="btn-amber-primary px-6 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-amber"
              >
                <span>Order Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Food image on right */}
          <div className="hidden sm:block absolute right-3 bottom-3 top-3 w-1/2 overflow-hidden rounded-2xl pointer-events-none">
            <img
              src="/images/hero_dish.jpg"
              alt="Family Combo Feast"
              className="w-full h-full object-cover object-center rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Customizer Modal */}
      <ModifierModal dish={activeDish} onClose={() => setActiveDish(null)} />
    </div>
  );
};
