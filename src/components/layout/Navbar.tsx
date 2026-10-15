'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../shared/Logo';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setCartOpen } from '../../redux/slices/cartSlice';
import {
  ShoppingBag,
  Search,
  User,
  ArrowRight,
  Menu as MenuIcon,
  X,
  Calendar,
  UtensilsCrossed,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/offers', label: 'Offers' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Auto-Updating Image Support */}
          <Logo variant="navbar" />

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-8 text-[16px] font-medium text-[#3D3D3D]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 transition-colors hover:text-[#B84A22] ${
                    isActive ? 'text-[#B84A22] font-semibold' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B84A22] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons & Mobile Hamburger */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Search Icon */}
            <button
              onClick={() => scrollToSection('menu-section')}
              className="text-[#3D3D3D] hover:text-[#B84A22] p-1.5 transition-colors cursor-pointer"
              aria-label="Search Dishes"
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Shopping Cart Icon with Red Counter Badge */}
            <button
              onClick={() => dispatch(setCartOpen(true))}
              className="relative text-[#3D3D3D] hover:text-[#B84A22] p-1.5 transition-colors cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#B84A22] text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in-75">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Customer Account Icon */}
            <Link
              href="/user-dashboard"
              className="text-[#3D3D3D] hover:text-[#B84A22] p-1.5 transition-colors hidden sm:block"
              title="My Account & Orders"
              aria-label="User Account"
            >
              <User className="w-5 h-5 stroke-[1.8]" />
            </Link>

            {/* Solid Terracotta "Order Now →" Pill Button (Desktop & Tablet) */}
            <Link
              href="/menu"
              className="btn-amber-primary px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold hidden md:flex items-center gap-1.5 shadow-sm"
            >
              <span>Order Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#3D3D3D] hover:text-[#B84A22] transition-colors rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E5E5] bg-white/98 backdrop-blur-md px-4 pt-4 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-[#B84A22] font-semibold'
                      : 'text-[#3D3D3D] hover:bg-neutral-50 hover:text-[#B84A22]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/user-dashboard"
              className={`block px-4 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                pathname === '/user-dashboard'
                  ? 'bg-orange-50 text-[#B84A22] font-semibold'
                  : 'text-[#3D3D3D] hover:bg-neutral-50 hover:text-[#B84A22]'
              }`}
            >
              My Profile & Dashboard
            </Link>
            <Link
              href="/reservations"
              className={`block px-4 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                pathname === '/reservations'
                  ? 'bg-orange-50 text-[#B84A22] font-semibold'
                  : 'text-[#3D3D3D] hover:bg-neutral-50 hover:text-[#B84A22]'
              }`}
            >
              Table Reservations
            </Link>
          </nav>

          <div className="pt-2 border-t border-[#F0ECE7] flex flex-col gap-2">
            <Link
              href="/menu"
              className="btn-amber-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-xs"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Browse Full Menu & Order</span>
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                dispatch(setCartOpen(true));
              }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold border border-[#E5E5E5] text-[#3D3D3D] hover:bg-neutral-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#B84A22]" />
              <span>View Cart ({totalCartCount} items)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
