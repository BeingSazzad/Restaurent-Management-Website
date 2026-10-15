'use client';

import React, { useState } from 'react';
import { RESTAURANT_INFO } from '@/Mockdata';
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Send,
  RotateCcw,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
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
      fullName: '',
      email: '',
      subject: '',
      message: '',
    });
    setIsSubmitted(false);
  };

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header matching reference styling */}
      <div className="mb-10">
        <div className="section-decorator mb-3.5" />
        <h1 className="section-title mb-2.5">
          Get in Touch With Us
        </h1>
        <p className="section-subtitle">
          Have queries regarding table reservations, catering feasts, allergen guidance, or custom orders? Reach out directly to our Dublin team.
        </p>
      </div>

      {/* 3 Contact Info Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10">
        {/* Card 1: Phone */}
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 sm:p-6 shadow-xs flex items-center gap-4 hover:border-[#B84A22]/50 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Phone className="w-5 h-5 fill-current" />
          </div>
          <div className="min-w-0">
            <span className="block font-bold text-[15px] text-[#1A130E]">Phone</span>
            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="text-[13px] sm:text-[14px] text-[#555555] hover:text-[#B84A22] truncate block transition-colors mt-0.5"
            >
              {RESTAURANT_INFO.phone}
            </a>
          </div>
        </div>

        {/* Card 2: Email */}
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 sm:p-6 shadow-xs flex items-center gap-4 hover:border-[#B84A22]/50 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="block font-bold text-[15px] text-[#1A130E]">Email</span>
            <a
              href={`mailto:${RESTAURANT_INFO.email}`}
              className="text-[13px] sm:text-[14px] text-[#555555] hover:text-[#B84A22] truncate block transition-colors mt-0.5"
            >
              {RESTAURANT_INFO.email}
            </a>
          </div>
        </div>

        {/* Card 3: Dublin Central Kitchen */}
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 sm:p-6 shadow-xs flex items-center gap-4 hover:border-[#B84A22]/50 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white flex items-center justify-center shrink-0 shadow-xs">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="block font-bold text-[15px] text-[#1A130E]">Dublin Kitchen</span>
            <span className="text-[13px] sm:text-[14px] text-[#555555] truncate block mt-0.5">
              18 South William St, D02
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Form (Left) & Live Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 shadow-xs">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-[#0FA958]/10 text-[#0FA958] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A130E]">Message Sent Successfully!</h3>
              <p className="text-[14px] text-[#555555] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.fullName || 'valued diner'}</strong>. Our South
                William Street kitchen and customer team have received your note and will respond
                promptly.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[rgb(249,249,249)] hover:bg-white text-[#1A130E] text-[13px] font-semibold border border-[#E5E5E5] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Send Another Message</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#1A130E] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full bg-[rgb(249,249,249)] focus:bg-white rounded-xl px-4 py-3 text-[14px] text-[#1A130E] placeholder:text-[#888888] border border-[#E5E5E5] focus:border-[#B84A22] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#1A130E] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full bg-[rgb(249,249,249)] focus:bg-white rounded-xl px-4 py-3 text-[14px] text-[#1A130E] placeholder:text-[#888888] border border-[#E5E5E5] focus:border-[#B84A22] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Subject */}
              <div>
                <label className="block text-[13px] font-semibold text-[#1A130E] mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Enter subject (e.g. Table Reservation, Catering, Feedback)"
                  className="w-full bg-[rgb(249,249,249)] focus:bg-white rounded-xl px-4 py-3 text-[14px] text-[#1A130E] placeholder:text-[#888888] border border-[#E5E5E5] focus:border-[#B84A22] focus:outline-none transition-all"
                />
              </div>

              {/* Row 3: Message */}
              <div>
                <label className="block text-[13px] font-semibold text-[#1A130E] mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full bg-[rgb(249,249,249)] focus:bg-white rounded-2xl p-4 text-[14px] text-[#1A130E] placeholder:text-[#888888] border border-[#E5E5E5] focus:border-[#B84A22] focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Bottom Action Button */}
              <div className="flex items-center justify-end pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-[14px] font-semibold shadow-[0_4px_14px_rgba(184,74,34,0.3)] hover:shadow-[0_6px_20px_rgba(184,74,34,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Map Card (lg:col-span-5) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-[#E5E5E5] overflow-hidden shadow-xs">
            {/* Embedded Live Google Maps Iframe */}
            <div className="relative h-[480px] sm:h-[520px] w-full bg-[#E8E4DF]">
              <iframe
                title="Amber Spice Dublin Location"
                src="https://maps.google.com/maps?q=18+South+William+Street,+Dublin+2,+Ireland&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
