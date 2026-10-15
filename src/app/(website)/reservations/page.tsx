'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  MapPin,
  ArrowRight,
  User,
  Mail,
  Phone,
  UtensilsCrossed,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';

export default function ReservationsPage() {
  const [guests, setGuests] = useState('2');
  const [date, setDate] = useState('2026-10-18');
  const [time, setTime] = useState('19:30');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [occasion, setOccasion] = useState('Casual Dining');
  const [specialRequest, setSpecialRequest] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const handleBookTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    setIsBooked(true);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="w-10 h-1 bg-[#F15A24] rounded-full mx-auto mb-3" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A130E] tracking-tight">
            Table Reservations
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#8C8681] mt-2 leading-relaxed">
            Reserve a dining table at our South William Street restaurant for an intimate royal culinary experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Booking Card (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-[24px] border border-[#EFEAE4] p-6 sm:p-9 shadow-[0_4px_24px_rgba(26,19,14,0.02)]">
            {isBooked ? (
              <div className="py-12 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1A130E]">Reservation Confirmed!</h2>
                  <p className="text-[14px] text-[#7A746E] max-w-md mx-auto leading-relaxed mt-2">
                    Thank you, <strong className="text-[#1A130E]">{name}</strong>. Your table for{' '}
                    <strong className="text-[#1A130E]">{guests} guests</strong> is reserved for{' '}
                    <strong className="text-[#1A130E]">{date}</strong> at <strong className="text-[#1A130E]">{time}</strong>{' '}
                    at Amber Spice, 18 South William St, Dublin 2.
                  </p>
                  <p className="text-[12.5px] text-[#8C8681] mt-1.5">
                    A confirmation email and SMS have been sent to <strong>{email}</strong>.
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsBooked(false)}
                    className="px-5 py-2.5 rounded-xl text-[13px] font-semibold border border-[#E5DFD7] text-[#666059] hover:bg-[#FAF8F5] transition-all cursor-pointer"
                  >
                    Book Another Table
                  </button>
                  <Link
                    href="/menu"
                    className="px-6 py-2.5 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white shadow-xs hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Preview Menu</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookTable} className="space-y-6">
                {/* Step 1: Party & Timing */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-[#1A130E] mb-2">
                      <Users className="w-4 h-4 text-[#F15A24]" />
                      <span>Guests</span>
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 rounded-xl px-4 py-3 text-[14px] text-[#1A130E] font-medium outline-none transition-all shadow-2xs cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, '9+ (Large Party)'].map((num) => (
                        <option key={num} value={num}>
                          {num} {typeof num === 'number' && num > 1 ? 'Guests' : 'Guest'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-[#1A130E] mb-2">
                      <Calendar className="w-4 h-4 text-[#F15A24]" />
                      <span>Date</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 rounded-xl px-4 py-3 text-[14px] text-[#1A130E] font-medium outline-none transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-[#1A130E] mb-2">
                      <Clock className="w-4 h-4 text-[#F15A24]" />
                      <span>Time Slot</span>
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 rounded-xl px-4 py-3 text-[14px] text-[#1A130E] font-medium outline-none transition-all shadow-2xs cursor-pointer"
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

                {/* Step 2: Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-[#1A130E] mb-2">
                      <User className="w-4 h-4 text-[#F15A24]" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Liam Gallagher"
                      className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 rounded-xl px-4 py-3 text-[14px] text-[#1A130E] font-medium outline-none transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-[#1A130E] mb-2">
                      <Mail className="w-4 h-4 text-[#F15A24]" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="liam.gallagher@dublin.ie"
                      className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 rounded-xl px-4 py-3 text-[14px] text-[#1A130E] font-medium outline-none transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Step 3: Phone & Occasion */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-[#1A130E] mb-2">
                      <Phone className="w-4 h-4 text-[#F15A24]" />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+353 87 123 4567"
                      className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 rounded-xl px-4 py-3 text-[14px] text-[#1A130E] font-medium outline-none transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-[#1A130E] mb-2">
                      <UtensilsCrossed className="w-4 h-4 text-[#F15A24]" />
                      <span>Dining Occasion</span>
                    </label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 rounded-xl px-4 py-3 text-[14px] text-[#1A130E] font-medium outline-none transition-all shadow-2xs cursor-pointer"
                    >
                      <option value="Casual Dining">Casual Dining</option>
                      <option value="Birthday Celebration">Birthday Celebration</option>
                      <option value="Anniversary Dinner">Anniversary Dinner</option>
                      <option value="Business Lunch">Business Lunch</option>
                      <option value="Family Gathering">Family Gathering</option>
                    </select>
                  </div>
                </div>

                {/* Step 4: Special Dietary Requests */}
                <div>
                  <label className="flex items-center gap-2 text-[13px] font-bold text-[#1A130E] mb-2">
                    <Sparkles className="w-4 h-4 text-[#F15A24]" />
                    <span>Special Dietary Requests (Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="Seating preferences (booth or window), high chair, allergen precautions..."
                    className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 rounded-xl p-4 text-[14px] text-[#1A130E] font-medium outline-none transition-all shadow-2xs resize-none"
                  />
                </div>

                {/* Form Actions */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#F2EFEA]">
                  <div className="flex items-center gap-2 text-[12.5px] text-[#7A746E]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant confirmation via SMS & Email</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white shadow-[0_4px_16px_rgba(241,90,36,0.25)] hover:opacity-95 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Confirm Table Reservation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Sidebar: Dining Information (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Dining Guidelines */}
            <div className="bg-white rounded-[24px] border border-[#EFEAE4] p-6 sm:p-7 shadow-[0_4px_24px_rgba(26,19,14,0.02)] space-y-5">
              <h3 className="font-bold text-[16px] text-[#1A130E] flex items-center gap-2.5 pb-3 border-b border-[#F2EFEA]">
                <Sparkles className="w-4 h-4 text-[#F15A24]" />
                <span>Dining Information</span>
              </h3>

              <div className="space-y-4 text-[13px] text-[#666059]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F15A24] flex items-center justify-center shrink-0 border border-orange-100">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A130E] text-[13.5px]">Prime Dublin Location</h4>
                    <p className="text-[#8C8681] mt-0.5 leading-relaxed">
                      18 South William St, Dublin 2 (steps from Grafton Street)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F15A24] flex items-center justify-center shrink-0 border border-orange-100">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A130E] text-[13.5px]">15-Min Grace Period</h4>
                    <p className="text-[#8C8681] mt-0.5 leading-relaxed">
                      Reserved tables are held for 15 minutes past your chosen booking slot.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0FA958] flex items-center justify-center shrink-0 border border-emerald-100">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A130E] text-[13.5px]">Halal & Fresh Ingredients</h4>
                    <p className="text-[#8C8681] mt-0.5 leading-relaxed">
                      100% Halal certified Irish meats with dedicated vegan and gluten-free choices.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Large Parties & Private Events Box */}
            <div className="bg-gradient-to-br from-[#FFF9F3] to-[#FFF4EC] rounded-[24px] border border-[#FADCC7] p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F15A24] text-white flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-[14.5px] text-[#1A130E]">Large Party or Event?</h4>
              </div>
              <p className="text-[12.5px] text-[#7A746E] leading-relaxed mb-3.5">
                For groups of 9 or more, or private dining events, please call our reservations desk directly.
              </p>
              <a
                href="tel:+35314859210"
                className="inline-flex items-center gap-2 text-[13px] font-bold text-[#F15A24] hover:text-[#d44715] transition-colors"
              >
                <span>(+353) 1 485 9210</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
