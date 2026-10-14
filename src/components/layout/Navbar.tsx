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
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EF]/95 backdrop-blur-md border-b border-[#EBE2D7] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Star Anise Emblem */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 flex items-center justify-center text-[#B84A22] group-hover:rotate-45 transition-transform duration-500">
              <svg viewBox="0 0 100 100" className="w-9 h-9 fill-[#B84A22]">
                <path d="M50 0 C45 25 25 45 0 50 C25 55 45 75 50 100 C55 75 75 55 100 50 C75 45 55 25 50 0 Z" opacity="0.9" />
                <path d="M50 15 C40 32 32 40 15 50 C32 60 40 68 50 85 C60 68 68 60 85 50 C68 40 60 32 50 15 Z" fill="#D49B37" opacity="0.8" />
                <circle cx="50" cy="50" r="8" fill="#1A130E" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-xl sm:text-2xl tracking-[0.1em] text-[#1A130E] block uppercase">
                AMBER SPICE
              </span>
            </div>
          </Link>

          {/* Pure Customer Navigation Menu (No Admin Mixed In) */}
          <nav className="hidden lg:flex items-center gap-8 text-[16px] font-medium text-[#3D3D3D]">
            <Link
              href="/"
              className={`relative py-1 transition-colors hover:text-[#B84A22] ${
                pathname === '/' ? 'text-[#B84A22] font-semibold' : ''
              }`}
            >
              Home
              {pathname === '/' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B84A22] rounded-full" />
              )}
            </Link>
            <Link
              href="/menu"
              className={`py-1 transition-colors hover:text-[#B84A22] ${
                pathname === '/menu' ? 'text-[#B84A22] font-semibold' : ''
              }`}
            >
              Menu
            </Link>
            <Link
              href="/offers"
              className={`py-1 transition-colors hover:text-[#B84A22] ${
                pathname === '/offers' ? 'text-[#B84A22] font-semibold' : ''
              }`}
            >
              Offers
            </Link>
            <Link
              href="/about"
              className={`py-1 transition-colors hover:text-[#B84A22] ${
                pathname === '/about' ? 'text-[#B84A22] font-semibold' : ''
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`py-1 transition-colors hover:text-[#B84A22] ${
                pathname === '/contact' ? 'text-[#B84A22] font-semibold' : ''
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Customer Action Icons & Order CTA */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search Icon */}
            <button
              onClick={() => scrollToSection('menu-section')}
              className="text-[#3D3D3D] hover:text-[#B84A22] p-1.5 transition-colors"
              aria-label="Search Dishes"
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Shopping Cart Icon with Red Counter Badge */}
            <button
              onClick={() => dispatch(setCartOpen(true))}
              className="relative text-[#3D3D3D] hover:text-[#B84A22] p-1.5 transition-colors"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#B84A22] text-white text-[10px] font-bold flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Customer Account Icon (Takes user to My Orders) */}
            <Link
              href="/user-dashboard"
              className="text-[#3D3D3D] hover:text-[#B84A22] p-1.5 transition-colors hidden sm:block"
              title="My Account & Orders"
              aria-label="User Account"
            >
              <User className="w-5 h-5 stroke-[1.8]" />
            </Link>

            {/* Solid Terracotta "Order Now →" Pill Button */}
            <Link
              href="/menu"
              className="btn-amber-primary px-5 py-2.5 text-sm font-semibold flex items-center gap-2 shadow-sm"
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
