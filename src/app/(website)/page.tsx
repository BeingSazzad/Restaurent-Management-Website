import React from 'react';
import { HeroSection } from '../../components/web-pages/HeroSection';
import { MarqueeRibbon } from '../../components/shared/MarqueeRibbon';
import { MenuSection } from '../../components/web-pages/MenuSection';
import { ReviewsSection } from '../../components/web-pages/ReviewsSection';
import { FaqSection } from '../../components/web-pages/FaqSection';

export default function WebsitePage() {
  return (
    <div className="bg-[rgb(249,249,249)]">
      {/* Amber Spice Hero Section with Delivery Dock */}
      <HeroSection />

      {/* Auto-scrolling Brand Essence Marquee Ribbon */}
      <MarqueeRibbon />

      {/* Categories, Popular Dishes & Dual Promo Banners */}
      <MenuSection />

      {/* Customer Testimonials: Loved by Food Lovers */}
      <ReviewsSection />

      {/* Frequently Asked Questions Section */}
      <FaqSection />
    </div>
  );
}
