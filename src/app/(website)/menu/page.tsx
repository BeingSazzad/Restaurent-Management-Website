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

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setDietaryFilter('all');
    setSortBy('popular');
  };

  return (
    <div className="min-h-screen bg-[rgb(249,249,249)] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Senior UX Hierarchy */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E5E5] text-[#B84A22] text-[12px] font-semibold uppercase tracking-wider mb-3.5 shadow-2xs">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Grand Heritage Menu</span>
          </div>
          <h1 className="section-title mb-3">
            Explore Authentic Flavors
          </h1>
          <p className="section-subtitle">
            Every dish is handcrafted using heirloom recipes, stone-ground garam masalas, and the freshest Irish ingredients.
          </p>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="bg-white border border-[#E5E5E5] rounded-3xl p-5 sm:p-6 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Live Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#747474] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search biryani, korma, tandoori, naan, or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[rgb(249,249,249)] border border-[#E5E5E5] focus:bg-white rounded-xl pl-11 pr-4 py-3 text-[14px] text-[#1A130E] placeholder:text-[#888888] focus:outline-none focus:border-[#B84A22] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#747474] hover:text-[#B84A22]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sorting Dropdown & Dietary Pills */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[rgb(249,249,249)] border border-[#E5E5E5] rounded-xl px-4 py-2.5">
                <SlidersHorizontal className="w-4 h-4 text-[#B84A22]" />
                <span className="text-[13px] font-medium text-[#747474] hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort dishes"
                  className="bg-transparent text-[13px] font-semibold text-[#1A130E] focus:outline-none cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Top Rated (★)</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-[#EAEAEA]">
            {categoryList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#B84A22] text-white shadow-sm'
                    : 'bg-[rgb(249,249,249)] hover:bg-white text-[#3D3D3D] border border-[#E5E5E5]'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    selectedCategory === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-[#747474] border border-[#E5E5E5]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Secondary Filter Badges: Dietary */}
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
            <span className="text-[#747474] font-medium text-[12px] mr-1">Filter by:</span>
            {[
              { id: 'all', label: 'All Diets' },
              { id: 'bestseller', label: '★ Bestsellers' },
              { id: 'halal', label: 'Halal Certified' },
              { id: 'vegetarian', label: 'Vegetarian' },
              { id: 'vegan', label: 'Vegan' },
              { id: 'gluten-free', label: 'Gluten-Free' },
            ].map((diet) => (
              <button
                key={diet.id}
                onClick={() => setDietaryFilter(diet.id)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
                  dietaryFilter === diet.id
                    ? 'bg-[#1A130E] text-white'
                    : 'bg-white text-[#555555] hover:text-[#1A130E] border border-[#E5E5E5]'
                }`}
              >
                {diet.label}
              </button>
            ))}

            {(selectedCategory !== 'all' || searchQuery || dietaryFilter !== 'all' || sortBy !== 'popular') && (
              <button
                onClick={resetFilters}
                className="ml-auto text-[12px] font-semibold text-[#B84A22] hover:text-[#9E3E1B] flex items-center gap-1 transition-colors py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-[14px] text-[#666666]">
            Showing <span className="font-semibold text-[#1A130E]">{filteredDishes.length}</span> dishes
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
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
          <div className="bg-white border border-[#E5E5E5] p-12 text-center rounded-3xl max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[rgb(249,249,249)] text-[#B84A22] flex items-center justify-center mx-auto mb-4 border border-[#E5E5E5]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1A130E] mb-2">No culinary matches found</h3>
            <p className="text-[14px] text-[#747474] mb-6">
              We couldn't find any dishes matching "{searchQuery}". Try searching for biryani, tandoori, or resetting your dietary filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white text-[13px] font-semibold inline-flex items-center gap-2 shadow-sm"
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
