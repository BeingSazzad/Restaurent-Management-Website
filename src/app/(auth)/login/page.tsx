'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { login } from '@/redux/slices/authSlice';
import { MOCK_USER } from '@/Mockdata';
import { Lock, Mail, ArrowRight, User, Phone } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState(MOCK_USER.name);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [phone, setPhone] = useState(MOCK_USER.phone);
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      login({
        name,
        email,
        phone,
        addresses: MOCK_USER.addresses,
      })
    );
    router.push('/user-dashboard');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-[#EBE2D7] shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#F3ECE2] text-[#B84A22] flex items-center justify-center mx-auto mb-3 border border-[#E9DFD3] shadow-sm">
            <svg viewBox="0 0 100 100" className="w-7 h-7 fill-[#B84A22]">
              <path d="M50 0 C45 25 25 45 0 50 C25 55 45 75 50 100 C55 75 75 55 100 50 C75 45 55 25 50 0 Z" />
              <circle cx="50" cy="50" r="10" fill="#D49B37" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A130E]">
            {authMode === 'login' ? 'Welcome to AMBER SPICE' : 'Create Diner Account'}
          </h1>
          <p className="text-xs text-[#747474] mt-1">
            {authMode === 'login'
              ? 'Sign in to access saved Dublin addresses and 1-click re-orders'
              : 'Save favorite dishes, track live deliveries, and get member discounts'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF6EF] border border-[#EBE2D7] rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`py-2 text-xs font-semibold rounded-xl transition-all ${
              authMode === 'login'
                ? 'bg-white text-[#B84A22] shadow-xs'
                : 'text-[#747474] hover:text-[#1A130E]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`py-2 text-xs font-semibold rounded-xl transition-all ${
              authMode === 'register'
                ? 'bg-white text-[#B84A22] shadow-xs'
                : 'text-[#747474] hover:text-[#1A130E]'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-[#747474] font-semibold mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-[#A0A0A0]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Sarah Ahmed"
                    className="w-full bg-[#FAF6EF] border border-[#EBE2D7] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#3D3D3D] focus:outline-none focus:border-[#B84A22]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#747474] font-semibold mb-1">Mobile Phone (for delivery SMS)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-[#A0A0A0]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+353 87 555 1234"
                    className="w-full bg-[#FAF6EF] border border-[#EBE2D7] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#3D3D3D] focus:outline-none focus:border-[#B84A22]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[#747474] font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-[#A0A0A0]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#FAF6EF] border border-[#EBE2D7] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#3D3D3D] focus:outline-none focus:border-[#B84A22]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#747474] font-semibold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-[#A0A0A0]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#FAF6EF] border border-[#EBE2D7] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#3D3D3D] focus:outline-none focus:border-[#B84A22]"
              />
            </div>
          </div>

          {authMode === 'login' && (
            <div className="flex justify-between items-center text-[11px] text-[#747474] pt-1">
              <span className="hover:text-[#B84A22] cursor-pointer">Forgot password?</span>
              <span className="text-[#B84A22] font-semibold">Demo User Ready</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-amber-primary py-3 text-xs font-semibold flex items-center justify-center gap-2 mt-4 shadow-amber"
          >
            <span>{authMode === 'login' ? 'Sign In to Account' : 'Complete Registration'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#EBE2D7] text-center text-xs text-[#747474]">
          <span>Want to order without an account? </span>
          <Link href="/menu" className="text-[#B84A22] font-semibold hover:underline">
            Use Guest Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
