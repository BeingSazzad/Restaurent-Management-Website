import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Phone,
  Plus,
  RotateCcw,
  UtensilsCrossed,
  X,
  Check,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';

export interface StaffReservation {
  id: string;
  referenceNumber: string;
  partySize: number;
  date: string;
  timeSlot: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  specialRequests?: string;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled';
  createdAt: string;
}

const STORAGE_KEY = 'amber_spice_reservations';

const INITIAL_MOCK_RESERVATIONS: StaffReservation[] = [
  {
    id: 'res-seed-1',
    referenceNumber: 'AS-849201',
    partySize: 4,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '7:30 PM',
    guestName: 'Mark Jecno',
    guestPhone: '+353 87 123 4567',
    guestEmail: 'mark.jecno@example.com',
    specialRequests: 'Window table preferred, celebrating family dinner.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-seed-2',
    referenceNumber: 'AS-619402',
    partySize: 2,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '8:00 PM',
    guestName: 'Sarah Ahmed',
    guestPhone: '+353 87 234 5678',
    guestEmail: 'sarah.ahmed@dublin.ie',
    specialRequests: 'Quiet corner booth for anniversary.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'res-seed-3',
    referenceNumber: 'AS-392810',
    partySize: 6,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '1:30 PM',
    guestName: 'David O’Connor',
    guestPhone: '+353 85 987 6543',
    guestEmail: 'david.oc@corporate.ie',
    specialRequests: 'Business lunch, require high chair for 1 toddler.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 'res-seed-4',
    referenceNumber: 'AS-102934',
    partySize: 2,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    timeSlot: '6:30 PM',
    guestName: 'Elena Rostova',
    guestPhone: '+353 89 444 8812',
    guestEmail: 'elena.rostova@gmail.com',
    status: 'completed',
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
  },
];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<StaffReservation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual Form State
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPartySize, setManualPartySize] = useState(2);
  const [manualDate, setManualDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [manualTime, setManualTime] = useState('7:00 PM');
  const [manualNote, setManualNote] = useState('');

  // Load from localStorage
  const loadReservations = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_RESERVATIONS));
        setReservations(INITIAL_MOCK_RESERVATIONS);
      } else {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReservations(parsed);
        } else {
          setReservations(INITIAL_MOCK_RESERVATIONS);
        }
      }
    } catch {
      setReservations(INITIAL_MOCK_RESERVATIONS);
    }
  };

  useEffect(() => {
    loadReservations();

    const handleUpdate = () => loadReservations();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('amber_spice_reservations_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('amber_spice_reservations_updated', handleUpdate);
    };
  }, []);

  const saveReservations = (updated: StaffReservation[]) => {
    setReservations(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('amber_spice_reservations_updated'));
    } catch {
      // LocalStorage fallback
    }
  };

  const handleStatusChange = (id: string, newStatus: StaffReservation['status']) => {
    const updated = reservations.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    saveReservations(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this reservation?')) {
      const updated = reservations.filter((r) => r.id !== id);
      saveReservations(updated);
    }
  };

  const handleCreateManualReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim()) {
      alert('Please provide guest name and phone number');
      return;
    }

    const newReservation: StaffReservation = {
      id: `res-${Date.now()}`,
      referenceNumber: `AS-${Math.floor(100000 + Math.random() * 900000)}`,
      partySize: manualPartySize,
      date: manualDate,
      timeSlot: manualTime,
      guestName: manualName.trim(),
      guestPhone: manualPhone.trim(),
      guestEmail: manualEmail.trim() || 'walkin@amberspice.ie',
      specialRequests: manualNote.trim() || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    saveReservations([newReservation, ...reservations]);
    setIsManualModalOpen(false);

    setManualName('');
    setManualPhone('');
    setManualEmail('');
    setManualNote('');
  };

  // Metrics
  const todayStr = new Date().toISOString().split('T')[0];

  const totalBookings = reservations.length;
  const todayBookings = reservations.filter((r) => r.date === todayStr);
  const todayGuests = todayBookings.reduce((sum, r) => sum + r.partySize, 0);
  const activeConfirmed = reservations.filter((r) => r.status === 'confirmed').length;
  const seatedCount = reservations.filter((r) => r.status === 'seated').length;

  // Filtered List
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.referenceNumber.toLowerCase().includes(q) ||
        r.guestName.toLowerCase().includes(q) ||
        r.guestPhone.includes(q) ||
        r.guestEmail.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || r.status === statusFilter;

      let matchDate = true;
      if (dateFilter === 'today') {
        matchDate = r.date === todayStr;
      } else if (dateFilter === 'upcoming') {
        matchDate = r.date >= todayStr;
      } else if (dateFilter === 'past') {
        matchDate = r.date < todayStr;
      }

      return matchSearch && matchStatus && matchDate;
    });
  }, [reservations, searchQuery, statusFilter, dateFilter, todayStr]);

  const getStatusBadge = (status: StaffReservation['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed</span>
          </span>
        );
      case 'seated':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <UtensilsCrossed className="w-3 h-3" />
            <span>Seated</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200">
            <Check className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Table Reservations"
        description="Manage live dining table bookings, guests, and phone reservations."
        badge={
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#F15A24]">
            {totalBookings} Total Bookings
          </span>
        }
        action={
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="h-9 px-3.5 rounded-xl bg-[#F15A24] hover:bg-[#D94E1B] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Reservation</span>
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11.5px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
            Today&apos;s Bookings
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {todayBookings.length}
            </span>
            <span className="text-xs font-medium text-stone-500">
              ({todayGuests} Guests)
            </span>
          </div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11.5px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
            Confirmed Active
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {activeConfirmed}
            </span>
            <span className="text-xs font-medium text-emerald-700">Ready</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11.5px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
            Currently Seated
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">
              {seatedCount}
            </span>
            <span className="text-xs font-medium text-amber-700">In Dining Room</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11.5px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
            Total Logged
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {totalBookings}
            </span>
            <span className="text-xs font-medium text-stone-500">All Time</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by guest name, phone, email, or AS- reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-[#FAF8F5] border border-stone-200 focus:border-[#F15A24] focus:bg-white rounded-xl pl-9 pr-3 text-xs sm:text-sm text-stone-800 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="h-10 bg-white border border-stone-200 rounded-xl px-3 text-xs font-semibold text-stone-700 outline-none cursor-pointer"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 bg-white border border-stone-200 rounded-xl px-3 text-xs font-semibold text-stone-700 outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="seated">Seated</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={loadReservations}
            title="Refresh List"
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-xs">
                <th className="py-3.5 px-4 sm:px-5">Reference</th>
                <th className="py-3.5 px-4">Guest Name &amp; Phone</th>
                <th className="py-3.5 px-4">Date &amp; Time</th>
                <th className="py-3.5 px-4">Guests</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Special Requests</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-medium text-stone-600">No reservations found</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Try adjusting your search query or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-4 sm:px-5">
                      <span className="font-semibold text-xs text-stone-900 tracking-tight">
                        {res.referenceNumber}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div>
                        <span className="font-bold text-stone-900 block">{res.guestName}</span>
                        <div className="flex items-center gap-2 text-stone-500 text-[11.5px] mt-0.5">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-stone-400" />
                            {res.guestPhone}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-semibold text-stone-800 block">{res.date}</span>
                      <span className="text-stone-500 text-xs flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {res.timeSlot}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-medium text-xs">
                        <Users className="w-3.5 h-3.5 text-stone-500" />
                        {res.partySize} {res.partySize === 1 ? 'Guest' : 'Guests'}
                      </span>
                    </td>

                    <td className="py-4 px-4">{getStatusBadge(res.status)}</td>

                    <td className="py-4 px-4 max-w-xs">
                      {res.specialRequests ? (
                        <p className="text-xs text-stone-700 truncate" title={res.specialRequests}>
                          {res.specialRequests}
                        </p>
                      ) : (
                        <span className="text-xs text-stone-300">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(res.id, 'seated')}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors cursor-pointer"
                            title="Seat guests at table"
                          >
                            Seat Table
                          </button>
                        )}

                        {res.status === 'seated' && (
                          <button
                            onClick={() => handleStatusChange(res.id, 'completed')}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                            title="Complete dining session"
                          >
                            Complete
                          </button>
                        )}

                        {res.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusChange(res.id, 'cancelled')}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                            title="Cancel reservation"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(res.id)}
                          className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Delete record"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Booking Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F15A24] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  New Walk-in / Phone Booking
                </h3>
              </div>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualReservation} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Guest Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Gallagher"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full h-10 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl px-3 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+353 87 000 0000"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full h-10 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl px-3 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Party Size
                  </label>
                  <select
                    value={manualPartySize}
                    onChange={(e) => setManualPartySize(Number(e.target.value))}
                    className="w-full h-10 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl px-3 outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full h-10 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl px-3 outline-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Time
                  </label>
                  <select
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full h-10 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl px-3 outline-none cursor-pointer"
                  >
                    {[
                      '12:00 PM',
                      '12:30 PM',
                      '1:00 PM',
                      '1:30 PM',
                      '2:00 PM',
                      '5:00 PM',
                      '5:30 PM',
                      '6:00 PM',
                      '6:30 PM',
                      '7:00 PM',
                      '7:30 PM',
                      '8:00 PM',
                      '8:30 PM',
                      '9:00 PM',
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="guest@example.com"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="w-full h-10 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl px-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Table / Seating Note (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Table 4 booth, anniversary..."
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                  className="w-full bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl p-2.5 outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#F15A24] hover:bg-[#D94E1B] text-white font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Confirm Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
