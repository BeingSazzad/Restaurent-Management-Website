'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  KeyRound,
  Mail,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

type Step = 'request' | 'verify' | 'reset' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('request');

  // Step 1: Request
  const [email, setEmail] = useState('sarah.ahmed@dublin.ie');
  const [emailError, setEmailError] = useState('');

  // Step 2: OTP Code
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3: New Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Step 1 Handler: Send Code
  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setStep('verify');
  };

  // Step 2 OTP Handlers
  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setStep('reset');
  };

  const handleResendCode = () => {
    setIsResending(true);
    setOtp(['', '', '', '', '', '']);
    setTimeout(() => {
      setIsResending(false);
      otpInputsRef.current[0]?.focus();
    }, 800);
  };

  // Step 3 Handler: Set New Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setStep('success');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-md p-7 sm:p-9 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs">
        {/* Step Progression Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 'request' ? 'w-8 bg-[#B84A22]' : 'w-2 bg-[#E6E1DC]'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 'verify' ? 'w-8 bg-[#B84A22]' : 'w-2 bg-[#E6E1DC]'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 'reset' ? 'w-8 bg-[#B84A22]' : 'w-2 bg-[#E6E1DC]'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 'success' ? 'w-8 bg-emerald-500' : 'w-2 bg-[#E6E1DC]'
            }`}
          />
        </div>

        {/* ================= STEP 1: REQUEST CODE ================= */}
        {step === 'request' && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(184,74,34,0.22)] shrink-0">
                  <KeyRound className="w-8 h-8 stroke-[2.2]" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-[#1A130E] tracking-tight">
                Forgot Password?
              </h1>
              <p className="text-[13px] text-[#7A746E] mt-1.5 leading-relaxed max-w-xs mx-auto">
                Enter your registered email address and we&apos;ll send you a 6-digit verification code.
              </p>
            </div>

            {emailError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{emailError}</span>
              </div>
            )}

            <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
              <div>
                <label className="block text-[#1A130E] font-semibold mb-1.5 text-[13px]">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4.5 h-4.5 absolute left-3.5 text-[#9E9790] pointer-events-none" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@dublin.ie"
                    className="w-full h-12 bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#B84A22] focus:ring-2 focus:ring-[#B84A22]/15 rounded-xl pl-11 pr-4 text-[14px] text-[#1A130E] outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white shadow-[0_4px_14px_rgba(184,74,34,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all mt-1"
              >
                <span>Send Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#F2EFE9] text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#7A746E] hover:text-[#1A130E] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </div>
        )}

        {/* ================= STEP 2: VERIFY OTP CODE ================= */}
        {step === 'verify' && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(184,74,34,0.22)] shrink-0">
                  <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-[#1A130E] tracking-tight">
                Verify Your Email
              </h1>
              <p className="text-[13px] text-[#7A746E] mt-1.5 leading-relaxed max-w-xs mx-auto">
                We sent a 6-digit code to <strong className="text-[#1A130E]">{email || 'your email'}</strong>
              </p>
            </div>

            {otpError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{otpError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
              {/* 6 Digit OTP Inputs */}
              <div>
                <label className="block text-center text-[#1A130E] font-semibold mb-2 text-[13px]">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-between gap-1.5 sm:gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 sm:w-12 h-12 sm:h-13 text-center text-xl font-bold bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#B84A22] focus:ring-2 focus:ring-[#B84A22]/15 rounded-xl outline-none transition-all shadow-xs text-[#1A130E]"
                    />
                  ))}
                </div>
              </div>

              {/* Resend Link */}
              <div className="flex items-center justify-center text-[13px] pt-1">
                <span className="text-[#7A746E]">Didn&apos;t receive code?</span>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="ml-1.5 text-[#B84A22] hover:text-[#9E3E1B] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                  <span>{isResending ? 'Sending...' : 'Resend Code'}</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white shadow-[0_4px_14px_rgba(184,74,34,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all mt-1"
              >
                <span>Verify Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#F2EFE9] text-center">
              <button
                type="button"
                onClick={() => setStep('request')}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#7A746E] hover:text-[#1A130E] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change email address</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: RESET PASSWORD ================= */}
        {step === 'reset' && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(184,74,34,0.22)] shrink-0">
                  <Lock className="w-8 h-8 stroke-[2.2]" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-[#1A130E] tracking-tight">
                Create New Password
              </h1>
              <p className="text-[13px] text-[#7A746E] mt-1.5 leading-relaxed max-w-xs mx-auto">
                Choose a new, strong password with at least 6 characters for your account.
              </p>
            </div>

            {passwordError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div>
                <label className="block text-[#1A130E] font-semibold mb-1.5 text-[13px]">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full h-12 bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#B84A22] focus:ring-2 focus:ring-[#B84A22]/15 rounded-xl pl-4 pr-11 text-[14px] text-[#1A130E] outline-none transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 text-[#9E9790] hover:text-[#1A130E] p-1.5 cursor-pointer transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#1A130E] font-semibold mb-1.5 text-[13px]">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full h-12 bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#B84A22] focus:ring-2 focus:ring-[#B84A22]/15 rounded-xl pl-4 pr-11 text-[14px] text-[#1A130E] outline-none transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-[#9E9790] hover:text-[#1A130E] p-1.5 cursor-pointer transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-[12px] text-[#8C8681]">
                <span>Must be at least 6 characters long</span>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white shadow-[0_4px_14px_rgba(184,74,34,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all mt-1"
              >
                <span>Reset Password</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#F2EFE9] text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#7A746E] hover:text-[#1A130E] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel and Back to Sign In</span>
              </Link>
            </div>
          </div>
        )}

        {/* ================= STEP 4: SUCCESS ================= */}
        {step === 'success' && (
          <div className="animate-in fade-in zoom-in-95 duration-200 text-center py-4">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#0FA958] to-[#2ecc71] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(15,169,88,0.22)] shrink-0">
                <CheckCircle2 className="w-8 h-8 stroke-[2.4]" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-[#1A130E] tracking-tight">
              Password Reset Complete!
            </h1>
            <p className="text-[13px] text-[#7A746E] mt-2 leading-relaxed max-w-sm mx-auto">
              Your password has been changed successfully. You can now sign in with your new credentials.
            </p>

            <div className="mt-7">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="w-full h-12 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white shadow-[0_4px_14px_rgba(184,74,34,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

