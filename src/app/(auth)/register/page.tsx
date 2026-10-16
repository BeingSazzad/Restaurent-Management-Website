'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { login } from '@/redux/slices/authSlice';
import { registerCustomer } from '@/services/staffService';
import { MOCK_USER } from '@/Mockdata';
import { Lock, Mail, ArrowRight, User, Phone } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // 1. Register strictly as diner/customer into system directory
    const customer = registerCustomer({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+353 87 555 1234',
    });

    // 2. Log in with role: 'user'
    dispatch(
      login({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: 'user',
        addresses: MOCK_USER.addresses,
      })
    );
    router.push('/user-dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-md p-7 sm:p-9 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white flex items-center justify-center shadow-xs shrink-0">
              <svg viewBox="0 0 100 100" className="w-7 h-7 fill-white">
                <path d="M50 0 C45 25 25 45 0 50 C25 55 45 75 50 100 C55 75 75 55 100 50 C75 45 55 25 50 0 Z" />
                <circle cx="50" cy="50" r="10" fill="#FFE2C4" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#1A130E] tracking-tight">
            Create Account
          </h1>
          <p className="text-[13px] text-[#7A746E] mt-1.5 leading-relaxed max-w-xs mx-auto">
            Create an account to track your orders and enjoy faster checkout
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-[13px]">
          <div>
            <label className="block text-[#1A130E] font-semibold mb-1.5 text-[13px]">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="w-4.5 h-4.5 absolute left-3.5 text-[#9E9790] pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Ahmed"
                className="w-full h-12 bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#B84A22] focus:ring-2 focus:ring-[#B84A22]/15 rounded-xl pl-11 pr-4 text-[14px] text-[#1A130E] outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1A130E] font-semibold mb-1.5 text-[13px]">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4.5 h-4.5 absolute left-3.5 text-[#9E9790] pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full h-12 bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#B84A22] focus:ring-2 focus:ring-[#B84A22]/15 rounded-xl pl-11 pr-4 text-[14px] text-[#1A130E] outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1A130E] font-semibold mb-1.5 text-[13px]">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <Phone className="w-4.5 h-4.5 absolute left-3.5 text-[#9E9790] pointer-events-none" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+353 87 555 1234"
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create secure password"
                className="w-full h-12 bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#B84A22] focus:ring-2 focus:ring-[#B84A22]/15 rounded-xl pl-11 pr-4 text-[14px] text-[#1A130E] outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[12px] text-[#7A746E]">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="accent-[#B84A22] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="terms" className="cursor-pointer">
              I agree to the{' '}
              <Link href="/terms" className="text-[#B84A22] hover:underline font-medium">
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="text-[#B84A22] hover:underline font-medium">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={!termsAccepted}
            className="w-full h-12 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white shadow-[0_4px_14px_rgba(184,74,34,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all active:scale-95 mt-1"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#F2EFE9] text-center text-[13px]">
          <p className="text-[#7A746E]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#B84A22] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
