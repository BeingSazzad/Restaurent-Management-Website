'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, Sparkles, CheckCircle2, MapPin, ArrowRight } from 'lucide-react';

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
    <div className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="w-12 h-1 bg-[#E85D26] rounded-full mx-auto mb-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1A130E] tracking-tight mb-2">
          Table Reservations
        </h1>
        <p className="text-sm text-[#747474]">
          Reserve a dining table at our South William Street restaurant for an intimate royal
          culinary experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Booking */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 shadow-xs">
          {isBooked ? (
            <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#0FA958]/10 text-[#0FA958] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-[#1A130E]">Reservation Confirmed!</h2>
              <p className="text-xs text-[#747474] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. Your table for <strong>{guests} guests</strong>{' '}
                is reserved for <strong>{date}</strong> at <strong>{time}</strong> at Amber Spice,
                18 South William St, Dublin 2. A confirmation email and SMS have been sent to{' '}
                <strong>{email}</strong>.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsBooked(false)}
                  className="btn-secondary px-5 py-2 text-xs font-semibold"
                >
                  Book Another Table
                </button>
                <Link
                  href="/menu"
                  className="btn-amber-primary px-6 py-2 text-xs font-semibold flex items-center gap-2"
                >
                  <span>Preview Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookTable} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A130E] mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#E85D26]" /> Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-[rgb(249,249,249)] rounded-xl px-3.5 py-2.5 text-xs text-[#1A130E] border border-[#E5E5E5] focus:outline-none focus:border-[#E85D26]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, '9+ (Large Party)'].map((num) => (
                      <option key={num} value={num}>
                        {num} {typeof num === 'number' && num > 1 ? 'Guests' : 'Guest'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A130E] mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#E85D26]" /> Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[rgb(249,249,249)] rounded-xl px-3.5 py-2.5 text-xs text-[#1A130E] border border-[#E5E5E5] focus:outline-none focus:border-[#E85D26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A130E] mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#E85D26]" /> Time Slot
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[rgb(249,249,249)] rounded-xl px-3.5 py-2.5 text-xs text-[#1A130E] border border-[#E5E5E5] focus:outline-none focus:border-[#E85D26]"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A130E] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Liam Gallagher"
                    className="w-full bg-[rgb(249,249,249)] rounded-xl px-3.5 py-2.5 text-xs text-[#1A130E] border border-[#E5E5E5] focus:outline-none focus:border-[#E85D26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A130E] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-[rgb(249,249,249)] rounded-xl px-3.5 py-2.5 text-xs text-[#1A130E] border border-[#E5E5E5] focus:outline-none focus:border-[#E85D26]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A130E] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+353 87 123 4567"
                    className="w-full bg-[rgb(249,249,249)] rounded-xl px-3.5 py-2.5 text-xs text-[#1A130E] border border-[#E5E5E5] focus:outline-none focus:border-[#E85D26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A130E] mb-1.5">
                    Dining Occasion
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full bg-[rgb(249,249,249)] rounded-xl px-3.5 py-2.5 text-xs text-[#1A130E] border border-[#E5E5E5] focus:outline-none focus:border-[#E85D26]"
                  >
                    <option value="Casual Dining">Casual Dining</option>
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="Anniversary Dinner">Anniversary Dinner</option>
                    <option value="Business Lunch">Business Lunch</option>
                    <option value="Family Gathering">Family Gathering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#1A130E] mb-1.5">
                  Special Dietary Requests (Optional)
                </label>
                <textarea
                  rows={3}
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="Seating preferences (booth or window), high chair, allergen precautions..."
                  className="w-full bg-[rgb(249,249,249)] focus:bg-white rounded-2xl p-3.5 text-[14px] text-[#1A130E] border border-[#E5E5E5] focus:outline-none focus:border-[#F15A24] resize-none transition-colors"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-md hover:scale-[1.01] active:scale-98 transition-all cursor-pointer"
                >
                  Confirm Table Reservation
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#1A130E] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D49B37]" /> Dining Information
            </h3>
            <div className="space-y-3 text-xs text-[#747474]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E85D26] shrink-0 mt-0.5" />
                <span>
                  <strong>Location:</strong> 18 South William St, Dublin 2 (just off Grafton St)
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#E85D26] shrink-0 mt-0.5" />
                <span>
                  <strong>Grace Period:</strong> Tables are held for 15 minutes past booking time.
                </span>
              </div>
              <p className="text-[11px] pt-2 border-t border-[#E5E5E5]">
                For parties of 10 or more, please call us directly at <strong>(+353) 1 485 9210</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
