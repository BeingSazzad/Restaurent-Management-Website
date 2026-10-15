'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '../shared/Logo';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setCartOpen } from '../../redux/slices/cartSlice';
import { logout } from '../../redux/slices/authSlice';
import {
  ShoppingBag,
  Search,
  User,
  ArrowRight,
  Menu as MenuIcon,
  X,
  Calendar,
  UtensilsCrossed,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    dispatch(logout());
    setIsAccountMenuOpen(false);
    setIsMobileMenuOpen(false);
    if (pathname.startsWith('/user-dashboard')) {
      router.push('/');
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
  }, [pathname]);

  // Click outside to close account menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
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
                  className={`relative py-1 text-[16px] font-medium transition-colors hover:text-[#B84A22] ${
                    isActive ? 'text-[#B84A22] font-semibold' : 'text-[#3D3D3D]'
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

            {/* Shopping Cart Icon with Counter Badge */}
            <button
              onClick={() => dispatch(setCartOpen(true))}
              className="relative text-[#3D3D3D] hover:text-[#B84A22] p-1.5 transition-colors cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in-75">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Right Action: When Logged Out -> "Get Started →", When Logged In -> User Avatar + "Order Now →" */}
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-[12px] bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-[0_4px_14px_rgba(184,74,34,0.3)] hover:shadow-[0_6px_20px_rgba(184,74,34,0.4)] transition-all hover:scale-102 active:scale-95 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Customer Account Button & Dropdown */}
                <div className="relative" ref={accountMenuRef}>
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className="flex items-center gap-1.5 text-[#3D3D3D] hover:text-[#B84A22] p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-orange-50/70 transition-all border border-transparent hover:border-[#F2ECE4] cursor-pointer"
                    title={`Account: ${user?.name || 'Customer'}`}
                    aria-label="User Account Menu"
                    aria-expanded={isAccountMenuOpen}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white text-[11px] font-bold flex items-center justify-center">
                      {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <span className="text-xs font-semibold text-[#2D2621]">
                      {user?.name?.split(' ')[0] || 'Profile'}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#8C847C] transition-transform duration-200 ${
                        isAccountMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Card */}
                  {isAccountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#EAE5DF] shadow-[0_12px_36px_rgba(26,19,14,0.12)] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EFEAE4]">
                          <p className="text-[13px] font-bold text-[#1A130E] truncate">
                            {user?.name || 'Amber Spice Diner'}
                          </p>
                          <p className="text-[11px] text-[#7A746E] truncate mt-0.5">
                            {user?.email || 'diner@example.com'}
                          </p>
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active Account</span>
                          </div>
                        </div>

                        <div className="space-y-0.5 pt-1 text-[13px]">
                          <Link
                            href="/user-dashboard"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#3D3D3D] hover:bg-orange-50/70 hover:text-[#B84A22] font-medium transition-colors"
                          >
                            <User className="w-4 h-4 text-[#B84A22]" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            href="/user-dashboard?tab=orders"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#3D3D3D] hover:bg-orange-50/70 hover:text-[#B84A22] font-medium transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4 text-[#B84A22]" />
                            <span>Orders</span>
                          </Link>
                          <Link
                            href="/reservations"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#3D3D3D] hover:bg-orange-50/70 hover:text-[#B84A22] font-medium transition-colors"
                          >
                            <Calendar className="w-4 h-4 text-[#B84A22]" />
                            <span>Reservations</span>
                          </Link>
                        </div>

                        <div className="pt-1.5 border-t border-[#F0ECE7]">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-[13px] font-semibold transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/menu"
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-[12px] bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-xs sm:text-sm font-semibold hidden md:flex items-center gap-1.5 shadow-[0_4px_14px_rgba(184,74,34,0.3)] hover:shadow-[0_6px_20px_rgba(184,74,34,0.4)] transition-all hover:scale-102 active:scale-95 cursor-pointer"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

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
                  className={`block px-4 py-2.5 rounded-xl text-[16px] font-medium transition-colors ${
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
              href="/reservations"
              className={`block px-4 py-2.5 rounded-xl text-[16px] font-medium transition-colors ${
                pathname === '/reservations'
                  ? 'bg-orange-50 text-[#B84A22] font-semibold'
                  : 'text-[#3D3D3D] hover:bg-neutral-50 hover:text-[#B84A22]'
              }`}
            >
              Table Reservations
            </Link>
          </nav>

          {/* Account Section in Mobile Menu */}
          {isAuthenticated ? (
            <div className="pt-2 pb-1 border-t border-[#F0ECE7] space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/60 border border-orange-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1A130E] truncate">{user?.name || 'Valued Diner'}</p>
                    <p className="text-[11px] text-[#7A746E] truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
              <Link
                href="/user-dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-xs font-medium text-[#3D3D3D] hover:bg-neutral-50 transition-colors"
              >
                Dashboard & Orders
              </Link>
            </div>
          ) : (
            <div className="pt-2 pb-1 border-t border-[#F0ECE7] space-y-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-center text-sm font-semibold shadow-xs flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-xs text-[#7A746E]">
                <span>Don&apos;t have an account? </span>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#B84A22] font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-[#F0ECE7] flex flex-col gap-2">
            <Link
              href="/menu"
              className="w-full py-3 rounded-[12px] bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(184,74,34,0.3)] transition-all"
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
