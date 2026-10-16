'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RESTAURANT_INFO } from '@/Mockdata';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  RotateCcw,
  Navigation,
  Car,
  Train,
  ArrowRight,
  UtensilsCrossed,
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
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="section-decorator mx-auto mb-3.5" />
        <h1 className="section-title mb-2.5">
          Contact Us &amp; Location
        </h1>
        <p className="section-subtitle">
          Visit our central Dublin kitchen on South William Street, send us an inquiry, or order direct takeaway collection.
        </p>
      </div>

      {/* 4 Unified Clean Info Cards (Deduplicated) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Dublin Central Kitchen */}
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 shadow-xs hover:border-[#B84A22]/50 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="block font-bold text-[15px] text-[#1A130E]">Dublin Kitchen</span>
              <p className="text-[13px] text-[#555555] mt-0.5 leading-snug">
                18 South William Street
              </p>
              <span className="text-[11.5px] font-semibold text-[#B84A22] block mt-0.5">
                Dublin 2, D02 HR58
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0F0F0]">
            <a
              href="https://maps.google.com/?q=18+South+William+Street+Dublin+2"
              target="_blank"
              rel="noreferrer"
              className="text-[12px] font-semibold text-[#B84A22] hover:text-[#9E3E1B] inline-flex items-center gap-1 transition-colors"
            >
              <span>Get Directions</span>
              <Navigation className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Card 2: Opening Hours */}
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 shadow-xs hover:border-[#B84A22]/50 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0FA958] to-[#2ecc71] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="block font-bold text-[15px] text-[#1A130E]">Opening Hours</span>
              </div>
              <p className="text-[12.5px] text-[#555555] mt-0.5 leading-snug">
                Mon–Thu: 17:00–22:00
                <br />
                Fri–Sat: 16:30–22:30
              </p>
              <span className="text-[11.5px] font-semibold text-[#D49B37] block mt-0.5">
                Sunday: Closed
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0F0F0] flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0FA958] bg-[#0FA958]/10 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0FA958] animate-pulse" />
              Kitchen Open Now
            </span>
          </div>
        </div>

        {/* Card 3: Phone Support */}
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 shadow-xs hover:border-[#B84A22]/50 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Phone className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0">
              <span className="block font-bold text-[15px] text-[#1A130E]">Phone Support</span>
              <p className="text-[12px] text-[#777777] mt-0.5">Kitchen &amp; orders desk</p>
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="text-[13.5px] font-semibold text-[#1A130E] hover:text-[#B84A22] block mt-1 transition-colors"
              >
                {RESTAURANT_INFO.phone}
              </a>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0F0F0]">
            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="text-[12px] font-semibold text-[#B84A22] hover:text-[#9E3E1B] inline-flex items-center gap-1 transition-colors"
            >
              <span>Call Kitchen</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Card 4: Email Inquiries */}
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 shadow-xs hover:border-[#B84A22]/50 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="block font-bold text-[15px] text-[#1A130E]">Email Inquiries</span>
              <p className="text-[12px] text-[#777777] mt-0.5">Catering &amp; bookings</p>
              <a
                href={`mailto:${RESTAURANT_INFO.email}`}
                className="text-[13.5px] font-semibold text-[#1A130E] hover:text-[#B84A22] block mt-1 transition-colors truncate"
              >
                {RESTAURANT_INFO.email}
              </a>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0F0F0]">
            <a
              href={`mailto:${RESTAURANT_INFO.email}`}
              className="text-[12px] font-semibold text-[#B84A22] hover:text-[#9E3E1B] inline-flex items-center gap-1 transition-colors"
            >
              <span>Send Email</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Contact Form (Left) & Map + Transit Guide (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1A130E]">Send Us a Message</h2>
            <p className="text-[13px] text-[#666666] mt-1">
              Have queries regarding reservations, dietary allergens, catering events, or custom requests? Let us know below.
            </p>
          </div>

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
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[rgb(249,249,249)] hover:bg-white text-[#1A130E] text-[13px] font-semibold border border-[#E5E5E5] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Send Another Message</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="e.g. Table Reservation, Catering Feasts, Allergen Guidance"
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
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full bg-[rgb(249,249,249)] focus:bg-white rounded-2xl p-4 text-[14px] text-[#1A130E] placeholder:text-[#888888] border border-[#E5E5E5] focus:border-[#B84A22] focus:outline-hidden transition-all resize-none"
                />
              </div>

              {/* Bottom Submit */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#777777]">
                  We typically reply within 2–4 operational hours.
                </span>
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

        {/* Right: Map, Getting Here, & Collection Counter (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Google Map Card */}
          <div className="bg-white rounded-3xl border border-[#E5E5E5] overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-[#EAEAEA] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[15px] text-[#1A130E]">Central Dublin Location</h3>
                <p className="text-[12px] text-[#747474]">Heart of Dublin Creative Quarter</p>
              </div>
              <a
                href="https://maps.google.com/?q=18+South+William+Street+Dublin+2"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[rgb(249,249,249)] hover:bg-[#F0ECE7] border border-[#E5E5E5] text-[11.5px] font-semibold text-[#1A130E] inline-flex items-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3 h-3 text-[#B84A22]" />
                <span>Open Maps</span>
              </a>
            </div>

            <div className="relative h-64 sm:h-72 w-full bg-[#E8E4DF]">
              <iframe
                title="Amber Spice Dublin Location"
                src="https://maps.google.com/maps?q=18+South+William+Street,+Dublin+2,+Ireland&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>

          {/* Transit & Getting Here Advice */}
          <div className="bg-white border border-[#E5E5E5] rounded-3xl p-5 sm:p-6 shadow-xs space-y-3.5">
            <h4 className="font-bold text-[15px] text-[#1A130E]">Getting Here</h4>
            <div className="space-y-3 text-[13px] text-[#555555] leading-relaxed">
              <div className="flex items-start gap-3">
                <Train className="w-4 h-4 text-[#B84A22] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1A130E]">Luas Green Line:</strong> 3-minute walk from St. Stephen&apos;s Green or Dawson Street stops.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Car className="w-4 h-4 text-[#B84A22] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1A130E]">Parking:</strong> Underground multi-storey parking nearby at St. Stephen&apos;s Green Shopping Centre and Drury Street Car Park.
                </span>
              </div>
            </div>
          </div>

          {/* Takeaway Collection Counter Strip */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[rgb(249,249,249)] border border-[#E5E5E5] shadow-xs flex items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-[14px] text-[#1A130E]">Takeaway Collection Counter</h4>
              <p className="text-[12px] text-[#666666] mt-0.5">
                Ready in ~15–20 mins · Pick up hot from counter
              </p>
            </div>
            <Link
              href="/menu"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-[12.5px] font-semibold shrink-0 shadow-[0_3px_10px_rgba(184,74,34,0.25)] hover:scale-105 active:scale-95 transition-all"
            >
              Order Online
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1C1510] via-[#241A14] to-[#17110D] border border-[#3A2D24] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className="font-bold text-xl sm:text-2xl text-white">
            Planning a Visit or Takeaway?
          </h3>
          <p className="text-[13.5px] text-[#D5CBC2] max-w-lg leading-relaxed">
            Order ahead online to have your food packed hot when you arrive, or reserve an intimate table for dinner.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
          <Link
            href="/reservations"
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[13px] font-semibold transition-all inline-flex items-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4 text-[#FBA138]" />
            <span>Book a Table</span>
          </Link>
          <Link
            href="/menu"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(184,74,34,0.3)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <span>Order Takeaway</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
