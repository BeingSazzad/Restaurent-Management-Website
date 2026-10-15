'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { login } from '@/redux/slices/authSlice';
import { MOCK_USER } from '@/Mockdata';
import { Lock, Mail, ArrowRight, User, Phone, CheckCircle2 } from 'lucide-react';

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

    dispatch(
      login({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '+353 87 555 1234',
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
            Create Diner Account
          </h1>
          <p className="text-[13px] text-[#7A746E] mt-1.5 leading-relaxed">
            Join AMBER SPICE to save Dublin delivery addresses, earn tasting perks, and order in 1 click.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-2xl mb-6">
          <Link
            href="/login"
            className="py-2.5 text-[13px] font-semibold rounded-xl text-center text-[#666059] hover:text-[#1A130E] transition-all"
          >
            Sign In
          </Link>
          <div className="py-2.5 text-[13px] font-semibold rounded-xl text-center bg-white text-[#F15A24] shadow-xs">
            Create Account
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
          <div>
            <label className="block text-[#1A130E] font-semibold mb-1 text-[13px]">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E9790]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Ahmed"
                className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] rounded-xl pl-10 pr-3.5 py-2.5 text-[14px] text-[#1A130E] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1A130E] font-semibold mb-1 text-[13px]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E9790]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
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
                placeholder="+353 87 555 1234"
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create secure password"
                className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] rounded-xl pl-10 pr-3.5 py-2.5 text-[14px] text-[#1A130E] outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[12px] text-[#7A746E]">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="accent-[#F15A24] w-4 h-4"
            />
            <label htmlFor="terms" className="cursor-pointer">
              I agree to the{' '}
              <Link href="/terms" className="text-[#F15A24] hover:underline">
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="text-[#F15A24] hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={!termsAccepted}
            className="w-full py-3 rounded-full text-[13px] font-bold bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white shadow-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
          >
            <span>Create Account & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-[13px] text-[#7A746E] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#F15A24] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
