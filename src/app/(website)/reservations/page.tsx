'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import { RESTAURANT_INFO } from '@/Mockdata';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  User,
  RotateCcw,
} from 'lucide-react';

interface ReservationRecord {
  id: string;
  referenceNumber: string;
  partySize: number;
  date: string;
  timeSlot: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  specialRequests?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

const TIME_SLOTS = [
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
  '9:30 PM',
];

export default function ReservationsPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState<boolean>(false);

  // Form State
  const [partySize, setPartySize] = useState<number>(2);
  const [date, setDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('7:00 PM');
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedReservation, setConfirmedReservation] = useState<ReservationRecord | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setMounted(true);
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  // Auto-fill for logged in users
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.name && !guestName) setGuestName(user.name);
      if (user.email && !guestEmail) setGuestEmail(user.email);
    }
  }, [isAuthenticated, user]);

  const minDate = mounted ? new Date().toISOString().split('T')[0] : '';

  const handleValidate = () => {
    const errs: { [key: string]: string } = {};
    if (!date) errs.date = 'Please select a date';
    if (!guestName.trim()) errs.guestName = 'Name is required';
    if (!guestPhone.trim()) errs.guestPhone = 'Phone number is required';
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      errs.guestEmail = 'Valid email is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidate()) return;

    setIsSubmitting(true);

    const refNum = `AS-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord: ReservationRecord = {
      id: `res-${Date.now()}`,
      referenceNumber: refNum,
      partySize,
      date,
      timeSlot,
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
      guestEmail: guestEmail.trim(),
      specialRequests: specialRequests.trim() || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    try {
      const existingStr = localStorage.getItem('amber_spice_reservations');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem('amber_spice_reservations', JSON.stringify([newRecord, ...existing]));
      window.dispatchEvent(new Event('amber_spice_reservations_updated'));
    } catch {
      // LocalStorage fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedReservation(newRecord);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  };

  const handleReset = () => {
    setConfirmedReservation(null);
    setSpecialRequests('');
    setPartySize(2);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 sm:py-20 text-stone-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header - Refined Global Typography */}
        <div className="text-center max-w-lg mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50/80 border border-orange-200/50 text-[#B84A22] text-[11px] font-medium tracking-widest uppercase mb-3">
            <Sparkles className="w-3 h-3 text-[#B84A22]" />
            <span>Table Reservation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-stone-900 tracking-tight mb-2.5">
            Book a Table
          </h1>
          <p className="text-[13.5px] sm:text-[14px] text-stone-500 font-normal leading-relaxed">
            Reserve your table at Amber Spice. Instant booking confirmation.
          </p>
        </div>

        {/* ================= CONFIRMATION SUCCESS VIEW ================= */}
        {confirmedReservation ? (
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-10 shadow-sm animate-in fade-in duration-300">
            <div className="text-center pb-6 border-b border-stone-100">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium tracking-wide uppercase mb-1">
                Confirmed
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-stone-900">
                Reservation Confirmed
              </h2>
              <p className="text-[13px] text-stone-500 mt-1 font-normal">
                We have reserved your table and look forward to welcoming you.
              </p>
            </div>

            {/* Reference Ticket Card */}
            <div className="my-6 p-5 rounded-xl bg-stone-50/70 border border-stone-200/60 space-y-3.5 text-[13px]">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/60">
                <span className="text-stone-500 font-medium">Reference Code</span>
                <span className="font-mono font-semibold text-[15px] text-[#B84A22]">
                  {confirmedReservation.referenceNumber}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <span className="text-stone-400 block text-[11px] uppercase font-medium tracking-wider">
                    Date & Time
                  </span>
                  <span className="font-medium text-stone-800 text-[13.5px]">
                    {confirmedReservation.date} at {confirmedReservation.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px] uppercase font-medium tracking-wider">
                    Guests
                  </span>
                  <span className="font-medium text-stone-800 text-[13.5px]">
                    {confirmedReservation.partySize}{' '}
                    {confirmedReservation.partySize === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px] uppercase font-medium tracking-wider">
                    Guest Name
                  </span>
                  <span className="font-medium text-stone-800 text-[13.5px] truncate">
                    {confirmedReservation.guestName}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px] uppercase font-medium tracking-wider">
                    Phone
                  </span>
                  <span className="font-medium text-stone-800 text-[13.5px] truncate">
                    {confirmedReservation.guestPhone}
                  </span>
                </div>
              </div>

              {confirmedReservation.specialRequests && (
                <div className="pt-2.5 border-t border-stone-200/60 text-[12px] text-stone-600">
                  <span className="font-medium text-stone-700">Note: </span>
                  &ldquo;{confirmedReservation.specialRequests}&rdquo;
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/menu"
                className="flex-1 h-11 px-5 rounded-xl bg-[#B84A22] hover:bg-[#9E3E1B] text-white text-[13.5px] font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Browse Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={handleReset}
                className="h-11 px-5 rounded-xl bg-white border border-stone-200 hover:border-stone-400 text-stone-700 text-[13.5px] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                <span>Book Another Table</span>
              </button>
            </div>
          </div>
        ) : (
          /* ================= GLOBAL STANDARD FORM ================= */
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-9 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Guests, Date, Time (3-Column Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* 1. Guests Dropdown */}
                <div>
                  <label className="block text-[13px] font-medium text-stone-700 mb-1.5">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={partySize}
                      onChange={(e) => setPartySize(Number(e.target.value))}
                      className="w-full h-11 bg-white border border-stone-200 focus:border-[#B84A22] focus:ring-1 focus:ring-[#B84A22]/20 rounded-xl pl-9 pr-8 text-[13.5px] text-stone-800 font-normal outline-none transition-all cursor-pointer appearance-none"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                      <option value={5}>5 Guests</option>
                      <option value={6}>6 Guests</option>
                      <option value={7}>7 Guests</option>
                      <option value={8}>8 Guests</option>
                      <option value={10}>10+ Guests</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>

                {/* 2. Date Input */}
                <div>
                  <label className="block text-[13px] font-medium text-stone-700 mb-1.5">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      min={minDate}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`w-full h-11 bg-white border ${
                        errors.date ? 'border-rose-400' : 'border-stone-200'
                      } focus:border-[#B84A22] focus:ring-1 focus:ring-[#B84A22]/20 rounded-xl pl-9 pr-3 text-[13.5px] text-stone-800 font-normal outline-none transition-all cursor-pointer`}
                    />
                  </div>
                  {errors.date && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.date}</p>
                  )}
                </div>

                {/* 3. Time Slot Select */}
                <div>
                  <label className="block text-[13px] font-medium text-stone-700 mb-1.5">
                    Time
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full h-11 bg-white border border-stone-200 focus:border-[#B84A22] focus:ring-1 focus:ring-[#B84A22]/20 rounded-xl pl-9 pr-8 text-[13.5px] text-stone-800 font-normal outline-none transition-all cursor-pointer appearance-none"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Contact Details (Name, Phone, Email) */}
              <div className="pt-3 border-t border-stone-100 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Name */}
                  <div>
                    <label className="block text-[13px] font-medium text-stone-700 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. John Murphy"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className={`w-full h-11 bg-white border ${
                          errors.guestName ? 'border-rose-400' : 'border-stone-200'
                        } focus:border-[#B84A22] focus:ring-1 focus:ring-[#B84A22]/20 rounded-xl pl-9 pr-3.5 text-[13.5px] text-stone-800 placeholder:text-stone-400 outline-none transition-all`}
                      />
                    </div>
                    {errors.guestName && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.guestName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[13px] font-medium text-stone-700 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        placeholder="+353 87 123 4567"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className={`w-full h-11 bg-white border ${
                          errors.guestPhone ? 'border-rose-400' : 'border-stone-200'
                        } focus:border-[#B84A22] focus:ring-1 focus:ring-[#B84A22]/20 rounded-xl pl-9 pr-3.5 text-[13.5px] text-stone-800 placeholder:text-stone-400 outline-none transition-all`}
                      />
                    </div>
                    {errors.guestPhone && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.guestPhone}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[13px] font-medium text-stone-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="john.murphy@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className={`w-full h-11 bg-white border ${
                        errors.guestEmail ? 'border-rose-400' : 'border-stone-200'
                      } focus:border-[#B84A22] focus:ring-1 focus:ring-[#B84A22]/20 rounded-xl pl-9 pr-3.5 text-[13.5px] text-stone-800 placeholder:text-stone-400 outline-none transition-all`}
                    />
                  </div>
                  {errors.guestEmail && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.guestEmail}</p>
                  )}
                </div>

                {/* Special Note */}
                <div>
                  <label className="block text-[13px] font-medium text-stone-700 mb-1.5">
                    Special Requests <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Dietary requirements or special requests..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-white border border-stone-200 focus:border-[#B84A22] focus:ring-1 focus:ring-[#B84A22]/20 rounded-xl p-3 text-[13.5px] text-stone-800 placeholder:text-stone-400 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-[#B84A22] hover:bg-[#9E3E1B] text-white text-[14px] font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-[0.99] cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Confirming...</span>
                  ) : (
                    <>
                      <span>Confirm Reservation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Restaurant Location & Phone Footer */}
            <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-[12px] text-stone-500 gap-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{RESTAURANT_INFO.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>{RESTAURANT_INFO.phone}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
