'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import {
  Clock,
  CheckCircle2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Phone,
} from 'lucide-react';

export default function ReservationsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [guests, setGuests] = useState('2');
  const [date, setDate] = useState('2026-10-18');
  const [time, setTime] = useState('19:30');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [occasion, setOccasion] = useState('Dinner');
  const [specialRequest, setSpecialRequest] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    if (user) {
      if (!name && user.name) setName(user.name);
      if (!email && user.email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  const handleBookTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    setIsBooked(true);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="section-decorator mx-auto mb-3" />
          <h1 className="section-title mb-2.5">
            Book a Table
          </h1>
          <p className="section-subtitle">
            Reserve your table online in seconds. Instant confirmation sent to your email and phone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Main Booking Card (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
            {isBooked ? (
              <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">Table Reserved!</h2>
                  <p className="text-sm text-stone-600 mt-1">
                    We look forward to hosting you, <strong className="text-stone-900">{name}</strong>.
                  </p>
                </div>

                {/* Booking Summary Pills */}
                <div className="bg-stone-50 border border-stone-200/70 rounded-xl p-4 max-w-md mx-auto grid grid-cols-2 gap-3 text-xs text-left">
                  <div>
                    <span className="text-stone-400 block font-medium">Party Size</span>
                    <strong className="text-stone-800 text-[13px]">{guests} Guests</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-medium">Date &amp; Time</span>
                    <strong className="text-stone-800 text-[13px]">{date} · {time}</strong>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-stone-200/60">
                    <span className="text-stone-400 block font-medium">Location</span>
                    <strong className="text-stone-800 text-[13px]">18 South William St, Dublin 2</strong>
                  </div>
                </div>

                <p className="text-xs text-stone-500">
                  Confirmation sent to <strong className="text-stone-700">{email}</strong> and <strong className="text-stone-700">{phone}</strong>.
                </p>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsBooked(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-all cursor-pointer"
                  >
                    Make Another Booking
                  </button>
                  <Link
                    href="/menu"
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white shadow-xs hover:scale-[1.02] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Explore Menu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookTable} className="space-y-5">
                {/* Step 1: Party Size, Date, Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                      Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full h-11 bg-stone-50 hover:bg-stone-100/60 focus:bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/10 rounded-xl px-3.5 text-sm font-medium text-stone-900 outline-none transition-all cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} {num > 1 ? 'Guests' : 'Guest'}
                        </option>
                      ))}
                      <option value="9+">9+ (Group / Event)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-11 bg-stone-50 hover:bg-stone-100/60 focus:bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/10 rounded-xl px-3.5 text-sm font-medium text-stone-900 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                      Time Slot
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full h-11 bg-stone-50 hover:bg-stone-100/60 focus:bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/10 rounded-xl px-3.5 text-sm font-medium text-stone-900 outline-none transition-all cursor-pointer"
                    >
                      {['12:30', '13:00', '14:00', '17:30', '18:30', '19:30', '20:30', '21:15'].map(
                        (t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {/* Step 2: Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Liam Gallagher"
                      className="w-full h-11 bg-stone-50 hover:bg-stone-100/60 focus:bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/10 rounded-xl px-3.5 text-sm font-medium text-stone-900 placeholder:text-stone-400 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="liam@example.ie"
                      className="w-full h-11 bg-stone-50 hover:bg-stone-100/60 focus:bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/10 rounded-xl px-3.5 text-sm font-medium text-stone-900 placeholder:text-stone-400 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Step 3: Phone & Occasion */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+353 87 123 4567"
                      className="w-full h-11 bg-stone-50 hover:bg-stone-100/60 focus:bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/10 rounded-xl px-3.5 text-sm font-medium text-stone-900 placeholder:text-stone-400 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                      Occasion <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full h-11 bg-stone-50 hover:bg-stone-100/60 focus:bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/10 rounded-xl px-3.5 text-sm font-medium text-stone-900 outline-none transition-all cursor-pointer"
                    >
                      <option value="Dinner">Casual Dinner</option>
                      <option value="Birthday">Birthday Celebration</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Business">Business Lunch / Dinner</option>
                      <option value="Family">Family Feast</option>
                    </select>
                  </div>
                </div>

                {/* Step 4: Special Requests */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    Special Requests <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="Allergies, high chair, window seating..."
                    className="w-full bg-stone-50 hover:bg-stone-100/60 focus:bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/10 rounded-xl p-3.5 text-sm font-medium text-stone-900 placeholder:text-stone-400 outline-none transition-all resize-none"
                  />
                </div>

                {/* Action Row */}
                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-100">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Instant confirmation · No booking fee</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white shadow-[0_4px_14px_rgba(184,74,34,0.3)] hover:shadow-[0_6px_20px_rgba(184,74,34,0.4)] hover:scale-[1.02] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Confirm Reservation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Sidebar: Concise Dining Details (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Dining Guidelines */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-stone-900 pb-2.5 border-b border-stone-100">
                Dining Information
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#B84A22] flex items-center justify-center shrink-0 border border-orange-100/60">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Prime Central Dublin</h4>
                    <p className="text-stone-500 mt-0.5 leading-snug">
                      18 South William St, Dublin 2
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#B84A22] flex items-center justify-center shrink-0 border border-orange-100/60">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">15-Min Grace Period</h4>
                    <p className="text-stone-500 mt-0.5 leading-snug">
                      Tables held for 15 mins past booking time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/60">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Halal Certified</h4>
                    <p className="text-stone-500 mt-0.5 leading-snug">
                      100% Halal Irish meats · Vegan options
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Large Parties & Events */}
            <div className="bg-amber-50/70 rounded-2xl border border-amber-200/80 p-5 shadow-xs">
              <h4 className="font-bold text-sm text-stone-900 mb-1">
                Party of 9+ or Event?
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed mb-3">
                For large group bookings and private dining feasts, call our team directly.
              </p>
              <a
                href="tel:+35314859210"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B84A22] hover:text-[#9E3E1B] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+353 (01) 485 9210</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
