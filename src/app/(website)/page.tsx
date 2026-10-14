import React from 'react';
import { HeroSection } from '../../components/web-pages/HeroSection';
import { MenuSection } from '../../components/web-pages/MenuSection';
import { ReviewsSection } from '../../components/web-pages/ReviewsSection';

export default function WebsitePage() {
  return (
    <div className="bg-[#FAF6EF]">
      {/* Amber Spice Hero Section */}
      <HeroSection />

      {/* Categories, Popular Dishes & Dual Promo Banners */}
      <MenuSection />

      {/* Customer Testimonials: Loved by Food Lovers */}
      <ReviewsSection />
    </div>
  );
}
