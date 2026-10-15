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
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#FBF9F6]">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-[20px] bg-white border border-[#EFEAE4] shadow-[0_4px_24px_rgba(26,19,14,0.03)]">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F15A24] flex items-center justify-center mx-auto mb-3 border border-orange-200/60 shadow-xs">
            <svg viewBox="0 0 100 100" className="w-7 h-7 fill-[#F15A24]">
              <path d="M50 0 C45 25 25 45 0 50 C25 55 45 75 50 100 C55 75 75 55 100 50 C75 45 55 25 50 0 Z" />
              <circle cx="50" cy="50" r="10" fill="#D49B37" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1A130E] tracking-tight">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-[13px] text-[#7A746E] mt-1.5 leading-relaxed">
            {authMode === 'login'
              ? 'Sign in to access saved Dublin addresses and 1-click re-orders'
              : 'Save favorite dishes, track live deliveries, and get member discounts'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`py-2.5 text-[13px] font-semibold rounded-xl transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-white text-[#F15A24] shadow-xs'
                : 'text-[#666059] hover:text-[#1A130E]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`py-2.5 text-[13px] font-semibold rounded-xl transition-all cursor-pointer ${
              authMode === 'register'
                ? 'bg-white text-[#F15A24] shadow-xs'
                : 'text-[#666059] hover:text-[#1A130E]'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-[#1A130E] font-semibold mb-1 text-[13px]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E9790]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Sarah Ahmed"
                    className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] rounded-xl pl-10 pr-3.5 py-2.5 text-[14px] text-[#1A130E] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1A130E] font-semibold mb-1 text-[13px]">
                  Mobile Phone (for delivery SMS)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E9790]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+353 87 555 1234"
                    className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] rounded-xl pl-10 pr-3.5 py-2.5 text-[14px] text-[#1A130E] outline-none transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[#1A130E] font-semibold mb-1 text-[13px]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E9790]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] rounded-xl pl-10 pr-3.5 py-2.5 text-[14px] text-[#1A130E] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1A130E] font-semibold mb-1 text-[13px]">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E9790]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] rounded-xl pl-10 pr-3.5 py-2.5 text-[14px] text-[#1A130E] outline-none transition-all"
              />
            </div>
          </div>

          {authMode === 'login' && (
            <div className="flex justify-between items-center text-[12px] text-[#7A746E] pt-1">
              <span className="hover:text-[#F15A24] cursor-pointer">Forgot password?</span>
              <span className="text-[#F15A24] font-semibold">Demo Account Ready</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-full text-[13px] font-bold bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white shadow-xs hover:opacity-95 flex items-center justify-center gap-2 mt-3 transition-opacity cursor-pointer active:scale-95"
          >
            <span>{authMode === 'login' ? 'Sign In to Account' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#F2EFE9] text-center text-[13px] text-[#7A746E]">
          <span>Want to order without an account? </span>
          <Link href="/menu" className="text-[#F15A24] font-semibold hover:underline">
            Use Guest Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
