'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../shared/Logo';

export const Footer: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  return (
    <footer className="bg-[#1A130E] text-[#C4B5A5] pt-16 pb-10 border-t border-[#2D241E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">
          {/* Col 1: Brand & Socials (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo variant="footer" />

            <p className="text-xs text-[#9B8C80] max-w-sm leading-relaxed">
              Crafted with authentic hand-ground spices, slow-cooked royal traditions, and genuine
              culinary passion.
            </p>

            {/* Social Icons with SVGs */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="#facebook"
                className="w-8 h-8 rounded-full bg-[#271E18] hover:bg-[#B84A22] text-white flex items-center justify-center transition-colors text-xs"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#instagram"
                className="w-8 h-8 rounded-full bg-[#271E18] hover:bg-[#B84A22] text-white flex items-center justify-center transition-colors text-xs"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#youtube"
                className="w-8 h-8 rounded-full bg-[#271E18] hover:bg-[#B84A22] text-white flex items-center justify-center transition-colors text-xs"
                aria-label="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-semibold text-[16px] text-white">Quick Links</h4>
            <ul className="space-y-2.5 text-[14px] text-[#9B8C80]">
              <li>
                <Link href="/" className="hover:text-white transition-colors text-[14px]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-white transition-colors text-[14px]">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-white transition-colors text-[14px]">
                  Offers
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors text-[14px]">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors text-[14px]">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors text-[14px]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-semibold text-[16px] text-white">Services</h4>
            <ul className="space-y-2.5 text-[14px] text-[#9B8C80]">
              <li>
                <Link href="/delivery" className="hover:text-white transition-colors text-[14px]">
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link href="/location" className="hover:text-white transition-colors text-[14px]">
                  Our Location
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-white transition-colors text-[14px]">
                  Table Reservations
                </Link>
              </li>
              <li>
                <Link href="/allergens" className="hover:text-white transition-colors text-[14px]">
                  Allergen Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors text-[14px]">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/user-dashboard" className="hover:text-white transition-colors text-[14px]">
                  Order Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Box (4 cols) */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="font-semibold text-[16px] text-white">
              Subscribe to our newsletter
            </h4>
            <p className="text-[13px] text-[#A6998E]">
              Get the latest seasonal offers and royal menu updates.
            </p>

            {!isSubscribed ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSubscribed(true);
                }}
                className="flex items-center bg-gradient-to-r from-[#29221C] to-[#302821] border border-[#3E342B] rounded-xl p-1.5 focus-within:border-[#FBA138]/60 transition-colors shadow-inner max-w-md pt-1"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your Email"
                  className="flex-1 bg-transparent px-3.5 py-2 text-[13px] text-white placeholder:text-[#8C7D72] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#FBA138] to-[#F15A24] hover:from-[#F59828] hover:to-[#E54E18] text-white text-[13px] font-semibold shrink-0 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  Subscribe Now
                </button>
              </form>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#29221C] border border-[#0FA958]/40 text-[#0FA958] text-xs font-semibold flex items-center gap-2">
                <span>✓ Thank you for subscribing to Amber Spice specials!</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Copyright Line */}
        <div className="pt-6 border-t border-[#271E18] flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-[#8C7D72]">
          <p>© {new Date().getFullYear()} Amber Spice. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[#8C7D72]">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span>·</span>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
