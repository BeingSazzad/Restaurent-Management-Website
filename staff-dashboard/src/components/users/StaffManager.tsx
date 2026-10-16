import React, { useState, useMemo } from 'react';
import { INITIAL_STAFF_USERS } from '../../lib/constants';
import { StaffUser, UserRole } from '../../types/common.types';
import { PageHeader } from '../layout/PageHeader';
import { Avatar } from '../shared/Avatar';
import { Badge } from '../shared/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import {
  Plus,
  ShieldCheck,
  Search,
  X,
  Trash2,
  CheckCircle2,
  Users,
  ChefHat,
  Send,
  KeyRound,
  Sparkles,
  UserPlus,
  Pencil,
} from 'lucide-react';

export function StaffManager() {
  const [users, setUsers] = useState<StaffUser[]>(INITIAL_STAFF_USERS);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Staff Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('admin');
  const [newStation, setNewStation] = useState<'all' | 'curries' | 'biryani' | 'grill' | 'breads'>('all');

  // Edit Staff Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('staff');
  const [editStation, setEditStation] = useState<'all' | 'curries' | 'biryani' | 'grill' | 'breads'>('all');
  const [editIsActive, setEditIsActive] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const counts = useMemo(() => {
    const total = users.length;
    const onDuty = users.filter((u) => u.isActive).length;
    const admins = users.filter((u) => u.role === 'admin').length;
    const chefs = users.filter((u) => u.role === 'chef').length;
    const expo = users.filter((u) => u.role === 'expo').length;
    const staff = users.filter((u) => u.role === 'staff').length;
    return { total, onDuty, admins, chefs, expo, staff };
  }, [users]);

  const handleOpenEdit = (staff: StaffUser) => {
    setEditingStaff(staff);
    setEditName(staff.name);
    setEditEmail(staff.email);
    setEditRole(staff.role);
    setEditStation(staff.shiftStation || 'all');
    setEditIsActive(staff.isActive);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    if (!editName.trim()) {
      showToast('⚠️ Please enter a valid staff name');
      return;
    }
    if (!editEmail.trim() || !editEmail.includes('@')) {
      showToast('⚠️ Please enter a valid email address');
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingStaff.id
          ? {
              ...u,
              name: editName.trim(),
              email: editEmail.trim().toLowerCase(),
              role: editRole,
              shiftStation: editRole === 'chef' ? editStation : 'all',
              isActive: editIsActive,
            }
          : u
      )
    );

    setIsEditModalOpen(false);
    setEditingStaff(null);
    showToast(`Staff member "${editName.trim()}" updated successfully`);
  };

  const handleToggleActive = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
    showToast('Staff duty status updated');
  };

  const handleDeleteStaff = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast('Staff member removed');
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newStaff: StaffUser = {
      id: `staff-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      isActive: true,
      shiftStation: newRole === 'chef' ? newStation : 'all',
    };

    setUsers((prev) => [newStaff, ...prev]);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewRole('admin');
    setNewStation('all');
    setIsAddModalOpen(false);
    showToast(`🎉 Staff member "${newStaff.name}" added as ${newRole.toUpperCase()}!`);
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    const matchesSearch =
      !searchQuery.trim() ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center gap-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header with Add Staff Member Button */}
      <PageHeader
        title="Staff & Roles"
        description="Team members, roles, and shift status."
        action={
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Staff Member
          </Button>
        }
      />

      {/* Staff Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Total Staff
          </span>
          <span className="text-xl font-bold text-stone-900 mt-1 block">{counts.total}</span>
          <span className="text-[10.5px] text-stone-400">Registered staff</span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            On Duty
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xl font-bold text-emerald-600">{counts.onDuty}</span>
          </div>
          <span className="text-[10.5px] text-stone-400">Active today</span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Admins
          </span>
          <span className="text-xl font-bold text-purple-700 mt-1 block">{counts.admins}</span>
          <span className="text-[10.5px] text-stone-400">Full access</span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Chefs
          </span>
          <span className="text-xl font-bold text-amber-700 mt-1 block">{counts.chefs}</span>
          <span className="text-[10.5px] text-stone-400">Kitchen leads</span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Expo
          </span>
          <span className="text-xl font-bold text-blue-700 mt-1 block">{counts.expo}</span>
          <span className="text-[10.5px] text-stone-400">Packaging</span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Line Staff
          </span>
          <span className="text-xl font-bold text-stone-700 mt-1 block">{counts.staff}</span>
          <span className="text-[10.5px] text-stone-400">Cooks &amp; prep</span>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search staff by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/10 rounded-xl pl-11 pr-10 text-[13.5px] font-medium text-stone-900 placeholder:text-stone-400 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Role Segmented Filter */}
        <div className="flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'admin', label: 'Admins' },
            { id: 'chef', label: 'Chefs' },
            { id: 'expo', label: 'Expo' },
            { id: 'staff', label: 'Staff' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedRole === r.id
                  ? 'bg-white text-stone-900 font-semibold shadow-xs border border-stone-200/60'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/70 text-[11.5px] font-semibold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Station</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-[13px]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No staff members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((staff) => (
                  <tr key={staff.id} className="hover:bg-stone-50/60 transition-colors">
                    {/* Staff Member */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={staff.name} size="sm" />
                        <div>
                          <p className="font-semibold text-stone-900 leading-tight">{staff.name}</p>
                          <p className="text-xs text-stone-500 mt-0.5">{staff.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      {staff.role === 'admin' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                          Admin
                        </span>
                      )}
                      {staff.role === 'chef' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                          <ChefHat className="w-3.5 h-3.5 text-amber-600" />
                          Chef
                        </span>
                      )}
                      {staff.role === 'expo' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          Expo
                        </span>
                      )}
                      {staff.role === 'staff' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                          Staff
                        </span>
                      )}
                    </td>

                    {/* Station */}
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md capitalize">
                        {staff.shiftStation || 'All Stations'}
                      </span>
                    </td>

                    {/* Duty Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
                          staff.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-100 text-stone-500 border border-stone-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            staff.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                          }`}
                        />
                        {staff.isActive ? 'On Duty' : 'Off Duty'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(staff)}
                          title="Edit staff details and role"
                          className="h-7 px-2.5 rounded-lg text-xs font-semibold border border-stone-200 bg-white hover:bg-stone-50 hover:text-stone-900 text-stone-700 inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Pencil className="w-3 h-3 text-stone-500" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleActive(staff.id)}
                          className={`h-7 px-2.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                            staff.isActive
                              ? 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {staff.isActive ? 'Set Off Duty' : 'Set On Duty'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteStaff(staff.id)}
                          title="Remove staff member"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add Staff Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Staff Member"
        subtitle="Create a new team account and assign their role & kitchen station."
        maxWidth="md"
      >
        <form onSubmit={handleAddStaff} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Liam O'Connor"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. liam@amberspice.ie"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <Input
            label="Phone (Optional)"
            placeholder="e.g. +353 87 234 5678"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700">Role & Access Level</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'admin', label: 'Administrator', desc: 'Full control (Revenue, CMS, Staff, Menu)' },
                { id: 'chef', label: 'Head Chef', desc: 'KDS kitchen display, stations, and 86 inventory' },
                { id: 'expo', label: 'Expo Dispatch', desc: 'Packaging, driver dispatch, and tickets' },
                { id: 'staff', label: 'Line Staff', desc: 'Station food prep and stock availability' },
              ].map((r) => (
                <label
                  key={r.id}
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    newRole === r.id
                      ? 'border-[#F15A24] bg-orange-50/50 ring-1 ring-[#F15A24]'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{r.label}</span>
                    <input
                      type="radio"
                      name="newRole"
                      value={r.id}
                      checked={newRole === r.id}
                      onChange={() => setNewRole(r.id as UserRole)}
                      className="accent-[#F15A24]"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">{r.desc}</p>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700">Kitchen Station (Optional)</label>
            <select
              value={newStation}
              onChange={(e) => setNewStation(e.target.value as any)}
              className="w-full h-10 rounded-xl border border-stone-200 bg-white px-3 text-xs text-stone-900 outline-none focus:border-[#F15A24] cursor-pointer"
            >
              <option value="all">All Stations (General Dispatch)</option>
              <option value="curries">Karahi &amp; Curries</option>
              <option value="biryani">Dum Biryani &amp; Rice</option>
              <option value="grill">Clay Oven Tandoor Grill</option>
              <option value="breads">Artisan Naan &amp; Breads</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-stone-400 shrink-0" />
            <span>A temporary login PIN will be dispatched to this email address automatically.</span>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Staff Member
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Staff Member Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingStaff(null);
        }}
        title="Edit Staff Member"
        subtitle="Update name, email, role permissions, and assigned station."
        maxWidth="md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Liam O'Connor"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. liam@amberspice.ie"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700">Role & Access Level</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'admin', label: 'Administrator', desc: 'Full control (Revenue, CMS, Staff, Menu)' },
                { id: 'chef', label: 'Head Chef', desc: 'KDS kitchen display, stations, and 86 inventory' },
                { id: 'expo', label: 'Expo Dispatch', desc: 'Packaging, driver dispatch, and tickets' },
                { id: 'staff', label: 'Line Staff', desc: 'Station food prep and stock availability' },
              ].map((r) => (
                <label
                  key={r.id}
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    editRole === r.id
                      ? 'border-[#F15A24] bg-orange-50/50 ring-1 ring-[#F15A24]'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{r.label}</span>
                    <input
                      type="radio"
                      name="editRole"
                      value={r.id}
                      checked={editRole === r.id}
                      onChange={() => setEditRole(r.id as UserRole)}
                      className="accent-[#F15A24]"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">{r.desc}</p>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700">Kitchen Station</label>
            <select
              value={editStation}
              onChange={(e) => setEditStation(e.target.value as any)}
              className="w-full h-10 rounded-xl border border-stone-200 bg-white px-3 text-xs text-stone-900 outline-none focus:border-[#F15A24] cursor-pointer"
            >
              <option value="all">All Stations (General Dispatch)</option>
              <option value="curries">Karahi &amp; Curries</option>
              <option value="biryani">Dum Biryani &amp; Rice</option>
              <option value="grill">Clay Oven Tandoor Grill</option>
              <option value="breads">Artisan Naan &amp; Breads</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-800">Shift Duty Status</p>
              <p className="text-[11px] text-stone-500">Enable or pause active shift permissions</p>
            </div>
            <button
              type="button"
              onClick={() => setEditIsActive(!editIsActive)}
              className={`h-7 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                editIsActive
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {editIsActive ? 'On Duty' : 'Off Duty'}
            </button>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingStaff(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default StaffManager;
