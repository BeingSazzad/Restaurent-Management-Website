'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { login } from '@/redux/slices/authSlice';
import { getUserByEmail, registerCustomer } from '@/services/staffService';
import { MOCK_USER } from '@/Mockdata';
import { Lock, Mail, ArrowRight, ShieldCheck, ChefHat, UserCheck, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('sarah.ahmed@dublin.ie');
  const [password, setPassword] = useState('••••••••');
  const [detectedRole, setDetectedRole] = useState<'admin' | 'manager' | 'chef' | 'user'>('user');

  // Live detection of role as user types email
  const handleEmailChange = (val: string) => {
    setEmail(val);
    const matched = getUserByEmail(val);
    if (matched) {
      setDetectedRole(matched.role);
    } else {
      setDetectedRole('user');
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    const matched = getUserByEmail(demoEmail);
    if (matched) {
      setDetectedRole(matched.role);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Check if user exists in the staff/user registry
    const matched = getUserByEmail(email);

    if (matched) {
      dispatch(
        login({
          name: matched.name,
          email: matched.email,
          phone: matched.phone,
          role: matched.role,
          station: matched.station,
          addresses: MOCK_USER.addresses,
        })
      );

      // Intelligent routing: staff/kitchen goes to KDS / agent-dashboard, customer goes to user-dashboard
      if (matched.role === 'admin' || matched.role === 'manager' || matched.role === 'chef') {
        router.push('/agent-dashboard');
      } else {
        router.push('/user-dashboard');
      }
    } else {
      // Default to customer role if not in staff directory
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
      router.push('/user-dashboard');
    }
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
            Sign In to Amber Spice
          </h1>
          <p className="text-[13px] text-[#7A746E] mt-1.5 leading-relaxed">
            Enter your email to access your diner dashboard or staff kitchen portal
          </p>

          {/* Role Detection Pill */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border">
            {detectedRole === 'admin' && (
              <span className="bg-purple-50 text-purple-700 border-purple-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Restaurant Admin Role</span>
              </span>
            )}
            {detectedRole === 'manager' && (
              <span className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Shift Operations Manager</span>
              </span>
            )}
            {detectedRole === 'chef' && (
              <span className="bg-amber-50 text-amber-800 border-amber-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5" />
                <span>Kitchen Staff (KDS Station)</span>
              </span>
            )}
            {detectedRole === 'user' && (
              <span className="bg-stone-50 text-stone-700 border-stone-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>Customer &amp; Diner Account</span>
              </span>
            )}
          </div>
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
                onChange={(e) => handleEmailChange(e.target.value)}
                required
                placeholder="name@domain.com"
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

          <div className="flex justify-end items-center text-[12.5px] pt-0.5">
            <Link
              href="/forgot-password"
              className="text-[#8C8681] hover:text-[#B84A22] font-medium transition-colors cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white shadow-[0_4px_14px_rgba(184,74,34,0.3)] flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>
              {detectedRole === 'user' ? 'Sign In as Diner' : 'Sign In to Staff Portal'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Switcher for Evaluation */}
        <div className="mt-6 pt-4 border-t border-[#F2EFE9] space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block text-center">
            Quick Role Switcher (For Evaluation)
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11.5px]">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@amberspice.ie')}
              className="px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 font-medium text-left truncate cursor-pointer transition-colors"
            >
              👑 <strong>Admin</strong> (Tariq)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('chef@amberspice.ie')}
              className="px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 font-medium text-left truncate cursor-pointer transition-colors"
            >
              👨‍🍳 <strong>Chef</strong> (Kabir)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('manager@amberspice.ie')}
              className="px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 font-medium text-left truncate cursor-pointer transition-colors"
            >
              📋 <strong>Manager</strong> (Marcus)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('sarah.ahmed@dublin.ie')}
              className="px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 font-medium text-left truncate cursor-pointer transition-colors"
            >
              👤 <strong>Customer</strong> (Sarah)
            </button>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#F2EFE9] text-center text-[13px]">
          <p className="text-[#7A746E]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#B84A22] font-bold hover:underline">
              Create Diner Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
