'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Eye, Clock, ShieldCheck, UtensilsCrossed, Calendar } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: 'biryani' | 'curry' | 'tandoor' | 'heritage';
  image: string;
  tag: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: "Chef's Signature Dum Biryani",
    category: 'biryani',
    image: '/images/amber_hero_dish.jpg',
    tag: 'Antique Copper Handi',
    description: 'Slow dum-cooked with saffron, whole roasted spices, and tender marinated lamb.',
  },
  {
    id: 2,
    title: 'Old Delhi Butter Chicken',
    category: 'curry',
    image: '/images/curry_dish.jpg',
    tag: 'Slow Simmered 8+ Hrs',
    description: 'Velvety tomato cashew gravy infused with roasted fenugreek and cultured butter.',
  },
  {
    id: 3,
    title: 'Tandoori Chicken Skewers',
    category: 'tandoor',
    image: '/images/grill_dish.jpg',
    tag: '480°C Clay Oven',
    description: 'Char-grilled over live embers with yogurt marinade and royal ground spices.',
  },
  {
    id: 4,
    title: 'Grand Royal Family Feast',
    category: 'heritage',
    image: '/images/hero_dish.jpg',
    tag: 'Royal Spread',
    description: 'Generous platter featuring biryanis, fresh tandoor naans, gravies and raita.',
  },
  {
    id: 5,
    title: 'Clay Oven Tandoori Naan Pizza',
    category: 'tandoor',
    image: '/images/pizza_dish.jpg',
    tag: 'Wood-Fired Fusion',
    description: 'Crispy blistered naan crust topped with spiced chicken tikka and aged cheese.',
  },
  {
    id: 6,
    title: 'Heritage Charcoal Sizzler',
    category: 'heritage',
    image: '/images/steak_dish.jpg',
    tag: 'Sizzling Platter',
    description: 'Hot cast-iron plate with spiced tandoori cuts, caramelized onions and mint chutney.',
  },
];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'biryani' | 'curry' | 'tandoor' | 'heritage'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredItems =
    activeFilter === 'all'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="section-decorator mx-auto" />
        <h1 className="section-title mb-3">Culinary Craft & Heritage Gallery</h1>
        <p className="section-subtitle">
          A visual journey through authentic copper handi dum cooking, 480°C clay tandoor flames,
          and fresh Dublin kitchen craft.
        </p>
      </div>

      {/* Modern Segmented Control Filter Bar */}
      <div className="flex justify-center mb-12">
        <div className="bg-white border border-[#E5E5E5] p-1.5 rounded-2xl shadow-xs inline-flex items-center gap-1.5 max-w-full overflow-x-auto scrollbar-none">
          {[
            { key: 'all', label: 'All Dishes', count: GALLERY_ITEMS.length },
            {
              key: 'biryani',
              label: 'Dum Biryanis',
              count: GALLERY_ITEMS.filter((i) => i.category === 'biryani').length,
            },
            {
              key: 'curry',
              label: 'Royal Curries',
              count: GALLERY_ITEMS.filter((i) => i.category === 'curry').length,
            },
            {
              key: 'tandoor',
              label: 'Clay Tandoor',
              count: GALLERY_ITEMS.filter((i) => i.category === 'tandoor').length,
            },
            {
              key: 'heritage',
              label: 'Heritage Feasts',
              count: GALLERY_ITEMS.filter((i) => i.category === 'heritage').length,
            },
          ].map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key as any)}
                className={`whitespace-nowrap px-4 sm:px-5 py-2.5 rounded-xl text-[13px] sm:text-[14px] font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-xs'
                    : 'text-[#555555] hover:text-[#1A130E] hover:bg-[rgb(249,249,249)]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-md font-bold transition-colors ${
                    isActive ? 'bg-white/25 text-white' : 'bg-[rgb(249,249,249)] text-[#747474]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group relative rounded-3xl overflow-hidden bg-white border border-[#E5E5E5] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="relative h-64 overflow-hidden bg-[rgb(249,249,249)]">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Tag Badge */}
              <div className="absolute top-4 left-4">
                <span className="badge-base badge-gold backdrop-blur-md">
                  <Sparkles className="w-3 h-3" />
                  <span>{item.tag}</span>
                </span>
              </div>

              {/* Hover Zoom Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4" />
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-base font-bold text-white mb-1 leading-snug drop-shadow-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-[#E2D8CE] line-clamp-2 font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full border border-[#E5E5E5] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="relative h-80 sm:h-96">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <span className="badge-base badge-terracotta mb-2 inline-block">
                {selectedImage.tag}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A130E] mb-2">{selectedImage.title}</h2>
              <p className="text-[14px] text-[#555555] leading-relaxed mb-6">
                {selectedImage.description}
              </p>
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#E5E5E5]">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-white border border-[#E5E5E5] text-[#1A130E] hover:bg-neutral-50 transition-colors"
                >
                  Close Preview
                </button>
                <Link
                  href="/menu"
                  className="px-6 py-2.5 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-xs hover:opacity-95 flex items-center gap-2 transition-opacity"
                >
                  <span>Order on Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Luxury Culinary Experience Call to Action */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1C120C] via-[#241710] to-[#150D08] border border-[#3E291C] text-white p-8 sm:p-12 shadow-2xl">
        {/* Ambient Warm Embers Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F15A24]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D49B37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#D49B37] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Taste the Royal Dublin Heritage</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Ready to Taste the Craft in Person?
            </h2>

            <p className="text-[14px] sm:text-[15px] text-[#D5CBC2] max-w-2xl leading-relaxed">
              Every dish in our gallery is cooked to order using whole spices stone-ground daily, 
              simmered slowly in antique copper handis, and dispatched steaming hot across Dublin.
            </p>

            {/* Dublin Service Highlights */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#E2D8CE]">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-[#0FA958]" />
                <span>30-45 Min Express Dublin Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D49B37]" />
                <span>100% Certified Irish Halal Meats</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#F15A24]" />
                <span>Collection at South William St, D2</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center lg:items-end">
            <Link
              href="/menu"
              className="w-full sm:w-auto lg:w-full py-3.5 px-7 rounded-xl bg-gradient-to-r from-[#FBA138] to-[#F15A24] hover:from-[#F59828] hover:to-[#E54E18] text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-98 transition-all"
            >
              <span>Explore Complete Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/reservations"
              className="w-full sm:w-auto lg:w-full py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-[14px] font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4 text-[#D49B37]" />
              <span>Book Table in Dublin 2</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
