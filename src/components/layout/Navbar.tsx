'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setCartOpen } from '../../redux/slices/cartSlice';
import {
  ShoppingBag,
  Search,
  User,
  ArrowRight,
  ChefHat,
  Sparkles,
  Clock,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const kitchenSnooze = useAppSelector((state) => state.orders.kitchenSnoozeActive);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EF]/95 backdrop-blur-md border-b border-[#EBE2D7] transition-all">
      {kitchenSnooze && (
        <div className="bg-[#B84A22] text-white px-4 py-1.5 text-center text-xs font-medium flex items-center justify-center gap-2">
          <Clock className="w-3.5 h-3.5 animate-spin" />
          <span>Kitchen is busy! Order preparation is extended by 20 mins.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Star Anise Spice Emblem */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Star Anise SVG Emblem */}
            <div className="w-9 h-9 flex items-center justify-center text-[#B84A22] group-hover:rotate-45 transition-transform duration-500">
              <svg viewBox="0 0 100 100" className="w-9 h-9 fill-[#B84A22]">
                {/* Stylized Star Anise / Spice Flower */}
                <path d="M50 0 C45 25 25 45 0 50 C25 55 45 75 50 100 C55 75 75 55 100 50 C75 45 55 25 50 0 Z" opacity="0.9" />
                <path d="M50 15 C40 32 32 40 15 50 C32 60 40 68 50 85 C60 68 68 60 85 50 C68 40 60 32 50 15 Z" fill="#D49B37" opacity="0.8" />
                <circle cx="50" cy="50" r="8" fill="#1A130E" />
              </svg>
            </div>
            <div>
              <span className="font-serif font-bold text-xl sm:text-2xl tracking-[0.12em] text-[#1A130E] block uppercase">
                AMBER SPICE
              </span>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-[#2C221C]">
            <Link
              href="/"
              className={`relative py-2 transition-colors hover:text-[#B84A22] ${
                pathname === '/' ? 'text-[#B84A22]' : ''
              }`}
            >
              Home
              {pathname === '/' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B84A22] rounded-full" />
              )}
            </Link>
            <button
              onClick={scrollToMenu}
              className="py-2 transition-colors hover:text-[#B84A22]"
            >
              Menu
            </button>
            <button
              onClick={scrollToMenu}
              className="py-2 transition-colors hover:text-[#B84A22]"
            >
              Offers
            </button>
            <Link
              href="/about"
              className={`py-2 transition-colors hover:text-[#B84A22] ${
                pathname === '/about' ? 'text-[#B84A22]' : ''
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`py-2 transition-colors hover:text-[#B84A22] ${
                pathname === '/contact' ? 'text-[#B84A22]' : ''
              }`}
            >
              Contact
            </Link>

            {/* Quick KDS link for restaurant staff */}
            <Link
              href="/agent-dashboard"
              className="text-[#786960] hover:text-[#B84A22] flex items-center gap-1 font-normal text-[11px]"
              title="Staff Kitchen Display"
            >
              <ChefHat className="w-3.5 h-3.5 text-[#B84A22]" />
              <span>Kitchen KDS</span>
            </Link>
          </nav>

          {/* Right Action Icons & Primary CTA Button */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search Icon */}
            <button
              onClick={scrollToMenu}
              className="text-[#2C221C] hover:text-[#B84A22] p-1 transition-colors"
              aria-label="Search Dishes"
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Shopping Cart Icon with Red Counter Badge */}
            <button
              onClick={() => dispatch(setCartOpen(true))}
              className="relative text-[#2C221C] hover:text-[#B84A22] p-1 transition-colors"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#B84A22] text-white text-[10px] font-bold flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Profile Account Icon */}
            <Link
              href="/user-dashboard"
              className="text-[#2C221C] hover:text-[#B84A22] p-1 transition-colors hidden sm:block"
              aria-label="User Account"
            >
              <User className="w-5 h-5 stroke-[1.8]" />
            </Link>

            {/* Solid Terracotta "Order Now →" Pill Button */}
            <button
              onClick={scrollToMenu}
              className="btn-amber-primary px-5 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              <span>Order Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
