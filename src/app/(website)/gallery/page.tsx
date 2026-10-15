'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Eye } from 'lucide-react';

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

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {[
          { key: 'all', label: 'All Dishes' },
          { key: 'biryani', label: 'Dum Biryanis' },
          { key: 'curry', label: 'Royal Curries' },
          { key: 'tandoor', label: 'Clay Tandoor' },
          { key: 'heritage', label: 'Heritage Feasts' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key as any)}
            className={`px-5 py-2.5 rounded-full text-[13px] sm:text-[14px] font-semibold transition-all ${
              activeFilter === tab.key
                ? 'bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-md'
                : 'bg-white text-[#555555] hover:text-[#1A130E] border border-[#E5E5E5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
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
                  className="px-5 py-2.5 rounded-full text-[13px] font-semibold bg-white border border-[#E5E5E5] text-[#1A130E] hover:bg-neutral-50 transition-colors"
                >
                  Close Preview
                </button>
                <Link
                  href="/menu"
                  className="px-6 py-2.5 rounded-full text-[13px] font-semibold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-xs hover:opacity-95 flex items-center gap-2 transition-opacity"
                >
                  <span>Order on Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action Footer */}
      <div className="text-center p-8 sm:p-10 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs">
        <h3 className="font-bold text-[20px] text-[#1A130E] mb-2">Want to Taste the Difference?</h3>
        <p className="text-[14px] text-[#555555] max-w-md mx-auto mb-6">
          Explore our complete online menu with direct doorstep delivery across Dublin zones.
        </p>
        <Link
          href="/menu"
          className="px-8 py-3.5 rounded-full text-[14px] font-bold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-md hover:scale-[1.01] active:scale-98 inline-flex items-center gap-2 transition-all"
        >
          <span>View Online Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
