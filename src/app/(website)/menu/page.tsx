'use client';

import React, { useState, useMemo } from 'react';
import { MENU_ITEMS, CATEGORIES, MenuItem } from '@/Mockdata';
import { DishCard } from '@/components/shared/DishCard';
import { ModifierModal } from '@/components/shared/ModifierModal';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Award,
  Sparkles,
  RotateCcw,
  UtensilsCrossed,
  X,
  Check,
} from 'lucide-react';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  // Filter & Sort Logic
  const filteredDishes = useMemo(() => {
    return MENU_ITEMS.filter((dish) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'all' || dish.category === selectedCategory;

      // Search match
      const matchesSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

      // Dietary filter match
      const matchesDietary =
        dietaryFilter === 'all' ||
        (dietaryFilter === 'bestseller' && dish.isBestSeller) ||
        dish.dietary.includes(dietaryFilter as any);

      return matchesCategory && matchesSearch && matchesDietary;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: popularity / bestsellers first
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, dietaryFilter, sortBy]);

  const categoryList = [
    { id: 'all', name: 'All Dishes', count: MENU_ITEMS.length },
    { id: 'biryani', name: 'Dum Biryani', count: MENU_ITEMS.filter((d) => d.category === 'biryani').length },
    { id: 'curries', name: 'Heritage Curries', count: MENU_ITEMS.filter((d) => d.category === 'curries').length },
    { id: 'grill', name: 'Tandoori Grills', count: MENU_ITEMS.filter((d) => d.category === 'grill').length },
    { id: 'vegetarian', name: 'Vegetarian', count: MENU_ITEMS.filter((d) => d.category === 'vegetarian').length },
    { id: 'breads', name: 'Naan & Breads', count: MENU_ITEMS.filter((d) => d.category === 'breads').length },
    { id: 'desserts', name: 'Royal Desserts', count: MENU_ITEMS.filter((d) => d.category === 'desserts').length },
  ];

  const dietaryTags = [
    { id: 'all', label: 'All Diets' },
    { id: 'bestseller', label: '★ Bestsellers' },
    { id: 'halal', label: 'Halal Certified' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten-Free' },
  ];

  const isFiltered =
    selectedCategory !== 'all' ||
    searchQuery.trim().length > 0 ||
    dietaryFilter !== 'all' ||
    sortBy !== 'popular';

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setDietaryFilter('all');
    setSortBy('popular');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Senior UX Hierarchy */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#EAE5DF] text-[#F15A24] text-[12px] font-semibold uppercase tracking-wider mb-3.5 shadow-xs">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Grand Heritage Menu</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A130E] tracking-tight mb-3">
            Explore Authentic Flavors
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#7A746E] leading-relaxed max-w-2xl mx-auto">
            Every dish is handcrafted using heirloom recipes, stone-ground garam masalas, and the freshest Irish ingredients.
          </p>
        </div>

        {/* ================= STANDARD MODERN FILTER CONTROLS ================= */}
        <div className="mb-10 space-y-5">
          {/* Top Row: Sleek Search Bar & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#F15A24] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search biryani, korma, tandoori, naan, or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-white border border-[#EAE5DF] focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/10 rounded-2xl pl-11 pr-10 text-[14px] text-[#1A130E] placeholder:text-[#9E9790] shadow-[0_2px_8px_rgba(26,19,14,0.02)] outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#666059] flex items-center justify-center transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Control */}
            <div className="h-12 bg-white border border-[#EAE5DF] rounded-2xl px-4 flex items-center gap-2.5 shadow-[0_2px_8px_rgba(26,19,14,0.02)] shrink-0 hover:border-[#F15A24]/40 transition-colors">
              <SlidersHorizontal className="w-4 h-4 text-[#F15A24]" />
              <span className="text-[13px] font-medium text-[#7A746E]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort dishes"
                className="bg-transparent text-[13px] font-semibold text-[#1A130E] focus:outline-none cursor-pointer pr-1"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated (★)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Middle Row: Segmented Category Tabs Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none py-1">
            {categoryList.map((cat) => {
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap px-4.5 py-2.5 rounded-full text-[13px] font-semibold transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white shadow-[0_4px_14px_rgba(241,90,36,0.22)]'
                      : 'bg-white hover:bg-[#FAF8F5] text-[#55504A] hover:text-[#1A130E] border border-[#EAE5DF] shadow-[0_1px_4px_rgba(26,19,14,0.02)]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-neutral-100 text-[#7A746E]'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Row: Dietary Filter Chips & Live Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[12px] font-semibold text-[#8C8681] mr-1.5 uppercase tracking-wider">
                Filter:
              </span>
              {dietaryTags.map((diet) => {
                const isActive = dietaryFilter === diet.id;

                return (
                  <button
                    key={diet.id}
                    onClick={() => setDietaryFilter(diet.id)}
                    className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1A130E] text-white shadow-xs'
                        : 'bg-white/90 text-[#666059] hover:text-[#1A130E] hover:bg-white border border-[#EAE5DF]'
                    }`}
                  >
                    {diet.label}
                  </button>
                );
              })}
            </div>

            {/* Reset Action */}
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="text-[12.5px] font-semibold text-[#F15A24] hover:text-[#D14412] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-[14px] text-[#7A746E]">
            Showing <span className="font-bold text-[#1A130E]">{filteredDishes.length}</span> authentic dishes
            {selectedCategory !== 'all' && (
              <span className="text-[#F15A24] font-semibold">
                {' '}in {categoryList.find((c) => c.id === selectedCategory)?.name}
              </span>
            )}
          </p>
        </div>

        {/* 4-Column Responsive Dish Grid */}
        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} onSelect={(d) => setSelectedDish(d)} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-[#EFEAE4] p-12 text-center rounded-[20px] max-w-lg mx-auto shadow-[0_4px_20px_rgba(26,19,14,0.03)]">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#F15A24] flex items-center justify-center mx-auto mb-4 border border-orange-200/60">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1A130E] mb-2">No culinary matches found</h3>
            <p className="text-[14px] text-[#7A746E] mb-6">
              We couldn&apos;t find any dishes matching &quot;{searchQuery}&quot;. Try searching for biryani, tandoori, or resetting your dietary filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white text-[13px] font-semibold inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Food Details & Customization Modal */}
      <ModifierModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
}
