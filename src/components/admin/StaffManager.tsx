'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  getUsersList,
  assignRoleByEmail,
  addStaffMember,
  deleteStaffUser,
  AppUser,
  StaffRole,
} from '@/services/staffService';
import {
  ShieldCheck,
  ChefHat,
  UserCheck,
  User,
  Search,
  CheckCircle2,
  Trash2,
  Mail,
  Sparkles,
  KeyRound,
  X,
  UserPlus,
} from 'lucide-react';

export function StaffManager() {
  const [users, setUsers] = useState<AppUser[]>(() => getUsersList());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | StaffRole>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Role Assign by Email State
  const [assignEmail, setAssignEmail] = useState('');
  const [assignRole, setAssignRole] = useState<StaffRole>('chef');
  const [assignStation, setAssignStation] = useState<AppUser['station']>('all');

  // Add Staff Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<StaffRole>('chef');
  const [newStation, setNewStation] = useState<AppUser['station']>('curries');
  const [newNotes, setNewNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const handleSync = () => {
      setUsers(getUsersList());
    };
    window.addEventListener('amber_spice_users_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('amber_spice_users_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Filtered Users Roster
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesPhone = u.phone.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone) return false;
      }
      return true;
    });
  }, [users, roleFilter, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      total: users.length,
      admin: users.filter((u) => u.role === 'admin').length,
      manager: users.filter((u) => u.role === 'manager').length,
      chef: users.filter((u) => u.role === 'chef').length,
      user: users.filter((u) => u.role === 'user').length,
      onShift: users.filter((u) => u.status === 'on_shift').length,
    };
  }, [users]);

  // Quick Role Assignment Submit
  const handleQuickAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignEmail.trim()) {
      showToast('⚠️ Please enter a valid email address');
      return;
    }
    const updated = assignRoleByEmail(assignEmail.trim(), assignRole, assignStation);
    setUsers(getUsersList());
    showToast(`✅ Successfully assigned role "${assignRole.toUpperCase()}" to ${updated.email}`);
    setAssignEmail('');
  };

  // Inline Quick Role Change in Table
  const handleInlineRoleChange = (email: string, nextRole: StaffRole) => {
    assignRoleByEmail(email, nextRole);
    setUsers(getUsersList());
    showToast(`✅ Updated role for ${email} to ${nextRole.toUpperCase()}`);
  };

  // Add New Staff Member Submit
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) {
      showToast('⚠️ Name and Email are required');
      return;
    }
    addStaffMember({
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || '+353 (01) 485 9210',
      role: newRole,
      station: newStation,
      status: 'active',
      notes: newNotes.trim() || undefined,
    });
    setUsers(getUsersList());
    setIsAddModalOpen(false);
    showToast(`🎉 New staff member ${newName} added as ${newRole.toUpperCase()}`);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewNotes('');
  };

  // Delete / Revoke User
  const handleDeleteUser = (email: string, name: string) => {
    if (confirm(`Revoke all staff access and remove ${name} (${email})?`)) {
      deleteStaffUser(email);
      setUsers(getUsersList());
      showToast(`Removed ${email} from directory`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-xl bg-[#1A130E] text-white text-[13px] font-semibold flex items-center gap-2.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#0FA958] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Explanation & RBAC Concept */}
      <div className="bg-gradient-to-r from-[#1A130E] via-[#2A1D16] to-[#1A130E] text-white rounded-2xl p-6 sm:p-7 border border-[#3E2D22] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F15A24]/20 text-[#F15A24] border border-[#F15A24]/30 uppercase tracking-wider">
              Role-Based Access Control (RBAC)
            </span>
            <span className="text-xs text-stone-400">Enterprise Restaurant Security</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Staff &amp; Role Permissions Management
          </h2>
          <p className="text-[13px] text-stone-300 leading-relaxed">
            Public website signups are restricted to <strong>Customer / Diner</strong> accounts only.
            Kitchen staff, chefs, and shift managers must be granted access here by the Administrator by email.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white font-bold text-[13.5px] shadow-[0_4px_14px_rgba(184,74,34,0.3)] hover:scale-[1.02] active:scale-98 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Directory</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900 mt-2 font-['Poppins']">{counts.total}</p>
          <span className="text-[11.5px] text-stone-400 mt-0.5 block">{counts.onShift} currently on shift</span>
        </div>

        <div className="bg-white rounded-2xl border border-purple-200/80 bg-purple-50/20 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Admins</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-purple-900 mt-2 font-['Poppins']">{counts.admin}</p>
          <span className="text-[11.5px] text-purple-600/80 mt-0.5 block">Full system authority</span>
        </div>

        <div className="bg-white rounded-2xl border border-blue-200/80 bg-blue-50/20 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Shift Managers</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-blue-900 mt-2 font-['Poppins']">{counts.manager}</p>
          <span className="text-[11.5px] text-blue-600/80 mt-0.5 block">Floor &amp; stock controls</span>
        </div>

        <div className="bg-white rounded-2xl border border-amber-200/80 bg-amber-50/20 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Kitchen Staff</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-900 mt-2 font-['Poppins']">{counts.chef}</p>
          <span className="text-[11.5px] text-amber-700/80 mt-0.5 block">KDS &amp; 86 Station ops</span>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Diners / Users</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900 mt-2 font-['Poppins']">{counts.user}</p>
          <span className="text-[11.5px] text-stone-400 mt-0.5 block">Public customer accounts</span>
        </div>
      </div>

      {/* Quick Role Grant Bar: Enter Email -> Pick Role -> Grant */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs">
        <div className="mb-4">
          <h3 className="font-bold text-[15px] text-stone-900 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#F15A24]" />
            <span>Assign Role by Email (Instant Role Grant)</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Type any existing user&apos;s email to promote them to Staff/Admin, or invite a new email with designated clearance.
          </p>
        </div>

        <form onSubmit={handleQuickAssign} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              User Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={assignEmail}
                onChange={(e) => setAssignEmail(e.target.value)}
                placeholder="e.g. chef.tariq@amberspice.ie"
                className="w-full h-11 bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/10 rounded-xl pl-10 pr-3 text-xs sm:text-[13px] text-stone-900 outline-none transition-all"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Select Role Clearance
            </label>
            <select
              value={assignRole}
              onChange={(e) => setAssignRole(e.target.value as StaffRole)}
              className="w-full h-11 bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl px-3 text-xs sm:text-[13px] text-stone-900 outline-none font-medium cursor-pointer"
            >
              <option value="chef">👨‍🍳 Kitchen Staff (Chef)</option>
              <option value="manager">📋 Shift Manager</option>
              <option value="admin">👑 Restaurant Admin</option>
              <option value="user">👤 Customer (Revoke Staff)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Station
            </label>
            <select
              value={assignStation}
              disabled={assignRole === 'user'}
              onChange={(e) => setAssignStation(e.target.value as AppUser['station'])}
              className="w-full h-11 bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl px-3 text-xs sm:text-[13px] text-stone-900 outline-none font-medium cursor-pointer disabled:opacity-40"
            >
              <option value="all">All Stations</option>
              <option value="curries">Curries</option>
              <option value="biryani">Dum Biryani</option>
              <option value="grill">Clay Tandoor</option>
              <option value="dispatch">Dispatch Counter</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#1A130E] hover:bg-black text-white text-xs sm:text-[13px] font-bold shadow-xs hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Grant Access</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FBA138]" />
            </button>
          </div>
        </form>
      </div>

      {/* Staff Roster Table with Search and Filtering */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Role Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-semibold">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                roleFilter === 'all'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
              }`}
            >
              All Users ({counts.total})
            </button>
            <button
              onClick={() => setRoleFilter('admin')}
              className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                roleFilter === 'admin'
                  ? 'bg-purple-700 text-white border-purple-700'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
              }`}
            >
              Admins ({counts.admin})
            </button>
            <button
              onClick={() => setRoleFilter('manager')}
              className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                roleFilter === 'manager'
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
              }`}
            >
              Managers ({counts.manager})
            </button>
            <button
              onClick={() => setRoleFilter('chef')}
              className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                roleFilter === 'chef'
                  ? 'bg-amber-800 text-white border-amber-800'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
              }`}
            >
              Chefs ({counts.chef})
            </button>
            <button
              onClick={() => setRoleFilter('user')}
              className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                roleFilter === 'user'
                  ? 'bg-stone-700 text-white border-stone-700'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
              }`}
            >
              Diners ({counts.user})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, email..."
              className="w-full h-9 bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#F15A24] rounded-lg pl-9 pr-3 text-xs text-stone-800 outline-none transition-all"
            />
          </div>
        </div>

        {/* The Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Team Member / Diner</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Station</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-stone-400">
                    No users match your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const initials = u.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <tr key={u.id} className="hover:bg-stone-50/60 transition-colors">
                      {/* Member Info */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : u.role === 'manager'
                                ? 'bg-blue-100 text-blue-700'
                                : u.role === 'chef'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {initials}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block text-[13px]">{u.name}</span>
                            <span className="text-[11px] text-stone-400 block mt-0.5">
                              {u.notes || `Joined ${new Date(u.invitedAt).toLocaleDateString('en-IE', { month: 'short', year: 'numeric' })}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-medium text-stone-800 block text-xs">{u.email}</span>
                          <span className="text-[11px] text-stone-400 block">{u.phone}</span>
                        </div>
                      </td>

                      {/* Current Role + Quick Switcher */}
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleInlineRoleChange(u.email, e.target.value as StaffRole)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer outline-none ${
                            u.role === 'admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : u.role === 'manager'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : u.role === 'chef'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-stone-100 text-stone-700 border-stone-200'
                          }`}
                        >
                          <option value="admin">👑 Admin</option>
                          <option value="manager">📋 Manager</option>
                          <option value="chef">👨‍🍳 Chef (KDS)</option>
                          <option value="user">👤 Customer</option>
                        </select>
                      </td>

                      {/* Station */}
                      <td className="py-3.5 px-4">
                        {u.role === 'user' ? (
                          <span className="text-stone-400 text-xs italic">N/A</span>
                        ) : (
                          <span className="capitalize px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium text-[11px]">
                            {u.station || 'All Stations'}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {u.status === 'on_shift' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            On Shift
                          </span>
                        ) : u.status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="text-[11px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.email, u.name)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Revoke / Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#F15A24]" />
                <span>Add / Invite Staff Member</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Tariq Al-Hassan"
                  className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-[#F15A24] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Staff Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="chef@amberspice.ie"
                  className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-[#F15A24] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+353 89 456 7890"
                  className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-[#F15A24] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as StaffRole)}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-[#F15A24] outline-none font-medium cursor-pointer"
                  >
                    <option value="chef">👨‍🍳 Kitchen Staff (Chef)</option>
                    <option value="manager">📋 Shift Manager</option>
                    <option value="admin">👑 Restaurant Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Station</label>
                  <select
                    value={newStation}
                    onChange={(e) => setNewStation(e.target.value as AppUser['station'])}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-[#F15A24] outline-none font-medium cursor-pointer"
                  >
                    <option value="all">All Stations</option>
                    <option value="curries">Curries</option>
                    <option value="biryani">Dum Biryani</option>
                    <option value="grill">Clay Tandoor</option>
                    <option value="dispatch">Dispatch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Role Notes / Title</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Head Biryani Dum Master"
                  className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-[#F15A24] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white font-bold cursor-pointer"
                >
                  Save &amp; Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
