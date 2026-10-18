'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { login } from '@/redux/slices/authSlice';
import { getUserByEmail, registerCustomer } from '@/services/staffService';
import { MOCK_USER } from '@/Mockdata';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('sarah.ahmed@dublin.ie');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Check if user exists or register customer
    const matched = getUserByEmail(email);

    if (matched) {
      dispatch(
        login({
          name: matched.name,
          email: matched.email,
          phone: matched.phone,
          role: 'user',
          addresses: MOCK_USER.addresses,
        })
      );
    } else {
      const newDiner = registerCustomer({
        name: email.split('@')[0],
        email,
        phone: '+353 87 555 1234',
      });
      dispatch(
        login({
          name: newDiner.name,
          email: newDiner.email,
          phone: newDiner.phone,
          role: 'user',
          addresses: MOCK_USER.addresses,
        })
      );
    }
    router.push('/user-dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-md p-7 sm:p-9 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(184,74,34,0.22)] shrink-0">
              <svg viewBox="0 0 100 100" className="w-8 h-8 fill-white">
                <path d="M50 0 C45 25 25 45 0 50 C25 55 45 75 50 100 C55 75 75 55 100 50 C75 45 55 25 50 0 Z" />
                <circle cx="50" cy="50" r="10" fill="#FFE2C4" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#1A130E] tracking-tight">
            Sign In to Amber Spice
          </h1>
          <p className="text-[13px] text-[#7A746E] mt-1.5 leading-relaxed max-w-xs mx-auto">
            Welcome back! Please enter your details to access your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-[13px]">
          <div>
            <label className="block text-[#1A130E] font-semibold mb-1.5 text-[13px]">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4.5 h-4.5 absolute left-3.5 text-[#9E9790] pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@domain.com"
                className="w-full h-12 bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#B84A22] focus:ring-2 focus:ring-[#B84A22]/15 rounded-xl pl-11 pr-4 text-[14px] text-[#1A130E] outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1A130E] font-semibold mb-1.5 text-[13px]">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4.5 h-4.5 absolute left-3.5 text-[#9E9790] pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#B84A22] focus:ring-2 focus:ring-[#B84A22]/15 rounded-xl pl-11 pr-4 text-[14px] text-[#1A130E] outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end items-center text-[12.5px] -mt-1">
            <Link
              href="/forgot-password"
              className="text-[#8C8681] hover:text-[#B84A22] font-medium transition-colors cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white shadow-[0_4px_14px_rgba(184,74,34,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all mt-1"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#F2EFE9] text-center text-[13px]">
          <p className="text-[#7A746E]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#B84A22] font-bold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
