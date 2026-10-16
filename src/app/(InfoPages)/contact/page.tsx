'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RESTAURANT_INFO } from '@/Mockdata';
import { getFullCmsData } from '@/services/cmsService';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  RotateCcw,
  Navigation,
  ArrowRight,
} from 'lucide-react';

export default function ContactPage() {
  const [storeInfo, setStoreInfo] = useState(() => (typeof window !== 'undefined' ? getFullCmsData().storeInfo : null));

  useEffect(() => {
    const refreshData = () => {
      setStoreInfo(getFullCmsData().storeInfo);
    };
    window.addEventListener('amber_spice_cms_updated', refreshData);
    window.addEventListener('storage', refreshData);
    return () => {
      window.removeEventListener('amber_spice_cms_updated', refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  const phone = storeInfo?.phone || RESTAURANT_INFO.phone;
  const email = storeInfo?.email || RESTAURANT_INFO.email;
  const address = storeInfo?.address || '18 South William St, Dublin 2';
  const eircode = storeInfo?.eircode || 'D02 HR58';

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
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
      {/* Page Header - Centered */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="section-decorator mx-auto mb-3.5" />
        <h1 className="section-title mb-2.5">
          Get in Touch With Us
        </h1>
        <p className="section-subtitle text-[#666666]">
          Have queries regarding catering feasts, allergen guidance, or custom orders? Reach out directly to our Dublin team.
        </p>
      </div>

      {/* 3 Contact Info Cards Matching Reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {/* Card 1: Phone */}
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 sm:p-6 shadow-xs flex items-center gap-4 hover:border-[#B84A22]/50 hover:shadow-md transition-all hover:-translate-y-0.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Phone className="w-5 h-5 fill-current" />
          </div>
          <div className="min-w-0">
            <span className="block font-bold text-[15px] text-[#1A130E]">Phone</span>
            <a
              href={`tel:${phone}`}
              className="text-[13px] sm:text-[14px] text-[#555555] hover:text-[#B84A22] truncate block transition-colors mt-0.5"
            >
              {phone}
            </a>
          </div>
        </div>

        {/* Card 2: Email */}
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 sm:p-6 shadow-xs flex items-center gap-4 hover:border-[#B84A22]/50 hover:shadow-md transition-all hover:-translate-y-0.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="block font-bold text-[15px] text-[#1A130E]">Email</span>
            <a
              href={`mailto:${email}`}
              className="text-[13px] sm:text-[14px] text-[#555555] hover:text-[#B84A22] truncate block transition-colors mt-0.5"
            >
              {email}
            </a>
          </div>
        </div>

        {/* Card 3: Dublin Central Kitchen */}
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 sm:p-6 shadow-xs flex items-center gap-4 hover:border-[#B84A22]/50 hover:shadow-md transition-all hover:-translate-y-0.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white flex items-center justify-center shrink-0 shadow-xs">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="block font-bold text-[15px] text-[#1A130E]">Dublin Kitchen</span>
            <span className="text-[13px] sm:text-[14px] text-[#555555] truncate block mt-0.5">
              {address} · {eircode}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Contact Form (Left) & Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 shadow-xs flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1A130E]">Send Us a Message</h2>
            <p className="text-[13px] text-[#666666] mt-1">
              Have queries regarding dietary allergens, catering events, or custom requests? Let us know below.
            </p>
          </div>

          {isSubmitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-[#B84A22]/10 text-[#B84A22] flex items-center justify-center mx-auto">
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
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[rgb(249,249,249)] hover:bg-white text-[#1A130E] text-[13px] font-semibold border border-[#E5E5E5] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Send Another Message</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#1A130E] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full bg-[rgb(249,249,249)] focus:bg-white rounded-xl px-4 py-3 text-[14px] text-[#1A130E] placeholder:text-[#888888] border border-[#E5E5E5] focus:border-[#B84A22] focus:outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#1A130E] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full bg-[rgb(249,249,249)] focus:bg-white rounded-xl px-4 py-3 text-[14px] text-[#1A130E] placeholder:text-[#888888] border border-[#E5E5E5] focus:border-[#B84A22] focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Subject */}
              <div>
                <label className="block text-[13px] font-semibold text-[#1A130E] mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Catering Feasts, Dietary Guidance, Private Orders"
                  className="w-full bg-[rgb(249,249,249)] focus:bg-white rounded-xl px-4 py-3 text-[14px] text-[#1A130E] placeholder:text-[#888888] border border-[#E5E5E5] focus:border-[#B84A22] focus:outline-hidden transition-all"
                />
              </div>

              {/* Row 3: Message */}
              <div>
                <label className="block text-[13px] font-semibold text-[#1A130E] mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full bg-[rgb(249,249,249)] focus:bg-white rounded-2xl p-4 text-[14px] text-[#1A130E] placeholder:text-[#888888] border border-[#E5E5E5] focus:border-[#B84A22] focus:outline-hidden transition-all resize-none"
                />
              </div>

              {/* Bottom Submit */}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-[14px] font-semibold shadow-[0_4px_14px_rgba(184,74,34,0.3)] hover:shadow-[0_6px_20px_rgba(184,74,34,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
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

        {/* Right: Map (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Live Google Map Card */}
          <div className="bg-white rounded-3xl border border-[#E5E5E5] overflow-hidden shadow-xs flex flex-col h-full">
            <div className="p-5 sm:p-6 border-b border-[#EAEAEA] flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-[16px] text-[#1A130E]">Central Dublin Location</h3>
                <p className="text-[12.5px] text-[#666666] mt-0.5">18 South William Street · Dublin 2</p>
              </div>
              <a
                href="https://maps.google.com/?q=18+South+William+Street+Dublin+2"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[rgb(249,249,249)] hover:bg-[#F0ECE7] border border-[#E5E5E5] text-[12px] font-semibold text-[#1A130E] inline-flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Navigation className="w-3.5 h-3.5 text-[#B84A22]" />
                <span>Open Maps</span>
              </a>
            </div>

            <div className="relative flex-1 min-h-[320px] w-full bg-[#E8E4DF]">
              <iframe
                title="Amber Spice Dublin Location"
                src="https://maps.google.com/maps?q=18+South+William+Street,+Dublin+2,+Ireland&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 absolute inset-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1C1510] via-[#241A14] to-[#17110D] border border-[#3A2D24] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className="font-bold text-xl sm:text-2xl text-white">
            Craving Authentic Indian Cuisine?
          </h3>
          <p className="text-[13.5px] text-[#D5CBC2] max-w-lg leading-relaxed">
            Order online for fast takeaway collection or direct hot delivery right to your door in Dublin.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
          <Link
            href="/menu"
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-[13.5px] font-semibold shadow-[0_4px_14px_rgba(184,74,34,0.3)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <span>Order Takeaway & Delivery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
