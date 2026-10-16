'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MENU_ITEMS, MenuItem } from '@/Mockdata';
import { DishCard } from '@/components/shared/DishCard';
import { ModifierModal } from '@/components/shared/ModifierModal';
import {
  Search,
  SlidersHorizontal,
  Filter,
  RotateCcw,
  X,
} from 'lucide-react';

function MenuContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [userCategory, setUserCategory] = useState<string | null>(null);
  const selectedCategory = userCategory ?? categoryParam;
  const setSelectedCategory = (cat: string) => setUserCategory(cat);

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
          <div className="section-decorator mx-auto mb-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A130E] tracking-tight mb-3">
            Explore Authentic Flavors
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#7A746E] leading-relaxed max-w-2xl mx-auto">
            Every dish is handcrafted using heirloom recipes, stone-ground garam masalas, and the freshest Irish ingredients.
          </p>
        </div>

        {/* ================= STANDARD MODERN FILTER CONTROLS ================= */}
        {/* ================= STANDARD MODERN FILTER CONTROLS ================= */}
        <div className="mb-10 space-y-6">
          {/* Top Row: Sleek Search Bar, Filter Dropdown & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#B84A22] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search biryani, korma, tandoori, naan, or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-white border border-[#EAE5DF] focus:border-[#B84A22] focus:ring-2 focus:ring-[#B84A22]/10 rounded-2xl pl-12 pr-11 text-[14px] text-[#1A130E] placeholder:text-[#9E9790] shadow-[0_2px_8px_rgba(26,19,14,0.02)] outline-none transition-all"
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

            {/* Filter Control (Placed beside Sort) */}
            <div className="h-12 bg-white border border-[#EAE5DF] rounded-2xl px-4 flex items-center gap-2.5 shadow-[0_2px_8px_rgba(26,19,14,0.02)] shrink-0 hover:border-[#B84A22]/40 transition-colors">
              <Filter className="w-4 h-4 text-[#B84A22]" />
              <span className="text-[13px] font-medium text-[#7A746E]">Filter:</span>
              <select
                value={dietaryFilter}
                onChange={(e) => setDietaryFilter(e.target.value)}
                aria-label="Filter dishes by diet"
                className="bg-transparent text-[13px] font-semibold text-[#1A130E] focus:outline-none cursor-pointer pr-1"
              >
                {dietaryTags.map((diet) => (
                  <option key={diet.id} value={diet.id}>
                    {diet.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Control */}
            <div className="h-12 bg-white border border-[#EAE5DF] rounded-2xl px-4 flex items-center gap-2.5 shadow-[0_2px_8px_rgba(26,19,14,0.02)] shrink-0 hover:border-[#B84A22]/40 transition-colors">
              <SlidersHorizontal className="w-4 h-4 text-[#B84A22]" />
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

          {/* Middle Row: Segmented Category Tabs Navigation (Clean wrap, no horizontal scroll/cut-off) */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2 pb-1">
            {categoryList.map((cat) => {
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white shadow-[0_4px_14px_rgba(184,74,34,0.3)]'
                      : 'bg-white hover:bg-[#FAF8F5] text-[#55504A] hover:text-[#1A130E] border border-[#EAE5DF] shadow-[0_1px_4px_rgba(26,19,14,0.02)]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[12px] font-bold ${
                      isActive ? 'text-white/90' : 'text-[#8A847E]'
                    }`}
                  >
                    ({cat.count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter Header with Optional Reset */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-[14px] text-[#7A746E]">
            Showing <span className="font-bold text-[#1A130E]">{filteredDishes.length}</span> authentic dishes
            {selectedCategory !== 'all' && (
              <span className="text-[#B84A22] font-semibold">
                {' '}in {categoryList.find((c) => c.id === selectedCategory)?.name}
              </span>
            )}
            {dietaryFilter !== 'all' && (
              <span className="text-[#B84A22] font-semibold">
                {' '}· {dietaryTags.find((d) => d.id === dietaryFilter)?.label}
              </span>
            )}
          </p>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="text-[12.5px] font-semibold text-[#B84A22] hover:text-[#9E3E1B] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          )}
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-[13px] font-semibold inline-flex items-center gap-2 shadow-[0_4px_14px_rgba(184,74,34,0.3)] cursor-pointer transition-all"
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

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-[#747474]">Loading menu...</div>}>
      <MenuContent />
    </Suspense>
  );
}
