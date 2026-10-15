'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RESTAURANT_INFO } from '@/Mockdata';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle2,
  Send,
  RotateCcw,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    });
    setIsSubmitted(false);
  };

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header matching reference styling */}
      <div className="mb-10">
        <div className="w-12 h-1 bg-[#E85D26] rounded-full mb-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1A130E] tracking-tight mb-2">
          Inform us of Yourself
        </h1>
        <p className="text-sm text-[#747474] font-normal">
          Contact us if you have any queries, catering requests, or merely want to say hi.
        </p>
      </div>

      {/* 4 Info Cards Row (Identical to reference layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
        {/* Card 1: Phone */}
        <div className="bg-white rounded-2xl border border-[#EBE2D7] p-5 shadow-xs flex items-center gap-4 hover:border-[#E85D26]/50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#E85D26] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Phone className="w-5 h-5 fill-current" />
          </div>
          <div className="min-w-0">
            <span className="block font-bold text-sm text-[#1A130E]">Phone</span>
            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="text-xs text-[#747474] hover:text-[#E85D26] truncate block transition-colors mt-0.5"
            >
              {RESTAURANT_INFO.phone}
            </a>
          </div>
        </div>

        {/* Card 2: Email */}
        <div className="bg-white rounded-2xl border border-[#EBE2D7] p-5 shadow-xs flex items-center gap-4 hover:border-[#E85D26]/50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#E85D26] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="block font-bold text-sm text-[#1A130E]">Email</span>
            <a
              href={`mailto:${RESTAURANT_INFO.email}`}
              className="text-xs text-[#747474] hover:text-[#E85D26] truncate block transition-colors mt-0.5"
            >
              {RESTAURANT_INFO.email}
            </a>
          </div>
        </div>

        {/* Card 3: Dublin Central Kitchen */}
        <div className="bg-white rounded-2xl border border-[#EBE2D7] p-5 shadow-xs flex items-center gap-4 hover:border-[#E85D26]/50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#E85D26] text-white flex items-center justify-center shrink-0 shadow-xs">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="block font-bold text-sm text-[#1A130E]">Dublin Kitchen</span>
            <span className="text-xs text-[#747474] truncate block mt-0.5">
              18 South William St, D02 HR58
            </span>
          </div>
        </div>

        {/* Card 4: Hours & Service */}
        <div className="bg-white rounded-2xl border border-[#EBE2D7] p-5 shadow-xs flex items-center gap-4 hover:border-[#E85D26]/50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#E85D26] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="block font-bold text-sm text-[#1A130E]">Service Hours</span>
            <span className="text-xs text-[#747474] truncate block mt-0.5">
              Mon – Sun: 11:00 AM – 11:00 PM
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Form (Left) & Live Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EBE2D7] p-6 sm:p-8 shadow-xs">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-[#0FA958]/10 text-[#0FA958] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A130E]">Message Sent Successfully!</h3>
              <p className="text-xs text-[#747474] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.firstName || 'valued diner'}</strong>. Our South
                William Street kitchen and customer team have received your note and will respond
                promptly.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FAF6EF] hover:bg-[#F3ECE2] text-[#1A130E] text-xs font-semibold border border-[#EBE2D7] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Send Another Message</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#1A130E] mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter your first name"
                    className="w-full bg-[#FAF6EF]/60 hover:bg-[#FAF6EF] focus:bg-white rounded-xl px-4 py-3 text-xs text-[#1A130E] placeholder:text-[#9B8C80] border border-[#EBE2D7] focus:border-[#E85D26] focus:outline-none focus:ring-2 focus:ring-[#E85D26]/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A130E] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter your last name"
                    className="w-full bg-[#FAF6EF]/60 hover:bg-[#FAF6EF] focus:bg-white rounded-xl px-4 py-3 text-xs text-[#1A130E] placeholder:text-[#9B8C80] border border-[#EBE2D7] focus:border-[#E85D26] focus:outline-none focus:ring-2 focus:ring-[#E85D26]/10 transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#1A130E] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full bg-[#FAF6EF]/60 hover:bg-[#FAF6EF] focus:bg-white rounded-xl px-4 py-3 text-xs text-[#1A130E] placeholder:text-[#9B8C80] border border-[#EBE2D7] focus:border-[#E85D26] focus:outline-none focus:ring-2 focus:ring-[#E85D26]/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A130E] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your number"
                    className="w-full bg-[#FAF6EF]/60 hover:bg-[#FAF6EF] focus:bg-white rounded-xl px-4 py-3 text-xs text-[#1A130E] placeholder:text-[#9B8C80] border border-[#EBE2D7] focus:border-[#E85D26] focus:outline-none focus:ring-2 focus:ring-[#E85D26]/10 transition-all"
                  />
                </div>
              </div>

              {/* Row 3: How Can We Help You? (Textarea) */}
              <div>
                <label className="block text-xs font-semibold text-[#1A130E] mb-2">
                  How Can We Help You?
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Hi there, I would like to inquire about..."
                  className="w-full bg-[#FAF6EF]/60 hover:bg-[#FAF6EF] focus:bg-white rounded-2xl p-4 text-xs text-[#1A130E] placeholder:text-[#9B8C80] border border-[#EBE2D7] focus:border-[#E85D26] focus:outline-none focus:ring-2 focus:ring-[#E85D26]/10 transition-all resize-none"
                />
              </div>

              {/* Bottom Action Buttons matching reference */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#747474] hover:text-[#1A130E] hover:bg-[#FAF6EF] transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 rounded-full bg-[#E85D26] hover:bg-[#D44E18] active:scale-95 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Submit</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Map Card (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-[#EBE2D7] overflow-hidden shadow-xs relative">
            {/* Floating Map Address Card matching reference screenshot */}
            <div className="p-4 sm:p-5 border-b border-[#EBE2D7] bg-white flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm text-[#1A130E] leading-snug">
                  18 South William Street
                </h4>
                <p className="text-[11px] text-[#747474] mt-0.5">
                  Dublin 2, D02 HR58, Republic of Ireland
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=18+South+William+Street+Dublin+2"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0066FF] hover:bg-[#0052CC] text-white text-[11px] font-semibold transition-colors shrink-0 shadow-xs"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open in Maps</span>
              </a>
            </div>

            {/* Embedded Live Google Maps Iframe */}
            <div className="relative h-96 sm:h-[420px] w-full bg-[#E8E4DF]">
              <iframe
                title="Amber Spice Dublin Location"
                src="https://maps.google.com/maps?q=18+South+William+Street,+Dublin+2,+Ireland&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#EBE2D7] text-xs text-[#747474] flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-[#1A130E] block text-xs">
                Takeaway Counter & Delivery Hub
              </span>
              <p className="text-[11px] mt-0.5">Walk in or order online for 15-min counter pickup.</p>
            </div>
            <Link
              href="/menu"
              className="text-[#E85D26] hover:underline font-semibold text-xs shrink-0"
            >
              Order Online →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
