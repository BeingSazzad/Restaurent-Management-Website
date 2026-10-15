'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { login } from '@/redux/slices/authSlice';
import { MOCK_USER } from '@/Mockdata';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState(MOCK_USER.email);
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      login({
        name: MOCK_USER.name,
        email,
        phone: MOCK_USER.phone,
        addresses: MOCK_USER.addresses,
      })
    );
    router.push('/user-dashboard');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#FBF9F6]">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-[20px] bg-white border border-[#EFEAE4] shadow-[0_4px_24px_rgba(26,19,14,0.03)]">
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#B84A22] flex items-center justify-center mx-auto mb-3 border border-orange-200/60 shadow-xs">
            <svg viewBox="0 0 100 100" className="w-7 h-7 fill-[#B84A22]">
              <path d="M50 0 C45 25 25 45 0 50 C25 55 45 75 50 100 C55 75 75 55 100 50 C75 45 55 25 50 0 Z" />
              <circle cx="50" cy="50" r="10" fill="#FBA138" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1A130E] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-[13px] text-[#7A746E] mt-1.5 leading-relaxed">
            Sign in to access saved addresses and 1-click re-orders
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
          <div>
            <label className="block text-[#1A130E] font-semibold mb-1.5 text-[13px]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E9790]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#B84A22] focus:ring-2 focus:ring-[#B84A22]/15 rounded-xl pl-10 pr-3.5 py-2.5 text-[14px] text-[#1A130E] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1A130E] font-semibold mb-1.5 text-[13px]">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E9790]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#B84A22] focus:ring-2 focus:ring-[#B84A22]/15 rounded-xl pl-10 pr-3.5 py-2.5 text-[14px] text-[#1A130E] outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end items-center text-[12px] text-[#7A746E] pt-0.5">
            <span className="hover:text-[#B84A22] cursor-pointer transition-colors">Forgot password?</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white shadow-[0_4px_14px_rgba(184,74,34,0.3)] flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#F2EFE9] text-center text-[13px]">
          <p className="text-[#7A746E]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#B84A22] font-bold hover:underline">
              Sign Up Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
