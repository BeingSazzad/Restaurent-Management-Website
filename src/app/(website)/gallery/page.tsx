'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Eye, UtensilsCrossed, Calendar } from 'lucide-react';
import { getFullCmsData, GalleryItem, DEFAULT_GALLERY_ITEMS } from '@/services/cmsService';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(() => {
    if (typeof window !== 'undefined') {
      return getFullCmsData().gallery || DEFAULT_GALLERY_ITEMS;
    }
    return DEFAULT_GALLERY_ITEMS;
  });

  useEffect(() => {
    const refreshGallery = () => {
      const full = getFullCmsData();
      if (full.gallery && full.gallery.length > 0) {
        setItems(full.gallery);
      }
    };
    window.addEventListener('amber_spice_cms_updated', refreshGallery);
    window.addEventListener('storage', refreshGallery);
    return () => {
      window.removeEventListener('amber_spice_cms_updated', refreshGallery);
      window.removeEventListener('storage', refreshGallery);
    };
  }, []);

  const [activeFilter, setActiveFilter] = useState<'all' | 'dining' | 'private' | 'bar_kitchen' | 'exterior'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredItems =
    activeFilter === 'all'
      ? items
      : items.filter((item) => item.category === activeFilter);

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="section-decorator mx-auto" />
        <h1 className="section-title mb-3">Restaurant Spaces &amp; Ambiance</h1>
        <p className="section-subtitle">
          Step inside Amber Spice on South William Street: historic Dublin brick arches,
          intimate candlelit private alcoves, live clay tandoor theater, and our ambient cocktail lounge.
        </p>
      </div>

      {/* Modern Segmented Control Filter Bar */}
      <div className="flex justify-center mb-12">
        <div className="bg-white border border-[#E5E5E5] p-1.5 rounded-2xl shadow-xs inline-flex items-center gap-1.5 max-w-full overflow-x-auto overflow-y-hidden scrollbar-none">
          {[
            { key: 'all', label: 'All Spaces', count: items.length },
            {
              key: 'dining',
              label: 'Dining Halls',
              count: items.filter((i) => i.category === 'dining').length,
            },
            {
              key: 'private',
              label: 'Private Dining Rooms',
              count: items.filter((i) => i.category === 'private').length,
            },
            {
              key: 'bar_kitchen',
              label: 'Bar & Open Kitchen',
              count: items.filter((i) => i.category === 'bar_kitchen').length,
            },
            {
              key: 'exterior',
              label: 'Dublin Facade',
              count: items.filter((i) => i.category === 'exterior').length,
            },
          ].map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key as any)}
                className={`whitespace-nowrap shrink-0 px-4 sm:px-5 py-2.5 rounded-xl text-[13px] sm:text-[14px] font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white shadow-[0_2px_8px_rgba(184,74,34,0.25)]'
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
            <div className="relative h-64 sm:h-72 overflow-hidden bg-[rgb(249,249,249)]">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

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
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
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
                  className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-white border border-[#E5E5E5] text-[#1A130E] hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
                <div className="flex items-center gap-2">
                  <Link
                    href="/reservations"
                    className="px-6 py-2.5 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white shadow-[0_4px_12px_rgba(184,74,34,0.3)] flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Reserve a Table</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
