import React, { useState, useMemo } from 'react';
import { INITIAL_STAFF_USERS } from '../../lib/constants';
import { StaffUser, UserRole } from '../../types/common.types';
import { PageHeader } from '../layout/PageHeader';
import { Avatar } from '../shared/Avatar';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import {
  Search,
  X,
  Trash2,
  CheckCircle2,
  UserPlus,
} from 'lucide-react';

export function StaffManager() {
  const [users, setUsers] = useState<StaffUser[]>(INITIAL_STAFF_USERS);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('admin');
  const [newStation, setNewStation] = useState<'all' | 'curries' | 'biryani' | 'grill' | 'breads'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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

  const handleRoleChange = (userId: string, nextRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
    );
    showToast(`Role updated to ${nextRole.toUpperCase()}`);
  };

  const handleToggleActive = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
    showToast('Duty status toggled');
  };

  const handleDeleteStaff = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast('Staff member removed');
  };

  const handleInviteStaff = (e: React.FormEvent) => {
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
    setNewRole('admin');
    setNewStation('all');
    setIsInviteModalOpen(false);
    showToast(`✓ Invited ${newStaff.name} as ${newRole.toUpperCase()}!`);
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    const matchesSearch =
      !searchQuery.trim() ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center gap-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Staff & Roles"
        description="Kitchen brigade roster, role assignments, and admin invites."
        action={
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            onClick={() => setIsInviteModalOpen(true)}
          >
            Invite Admin / Staff
          </Button>
        }
      />

      {/* 2 Clean Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
            Kitchen Brigade
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">{counts.total} Members</span>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              {counts.admins} Admins · {counts.chefs} Chefs
            </span>
          </div>
          <span className="text-[11.5px] text-stone-400 mt-0.5 block">
            {counts.expo} Expo Dispatch · {counts.staff} Line Staff
          </span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
            Current Shift Duty
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">{counts.onDuty} On Duty</span>
            <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
              {counts.total - counts.onDuty} Off Duty
            </span>
          </div>
          <span className="text-[11.5px] text-stone-400 mt-0.5 block">Active on floor &amp; stations</span>
        </div>
      </div>

      {/* Toolbar: Search + Quick Filter */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-2.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search staff by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#F15A24] rounded-xl pl-9 pr-8 text-xs font-medium text-stone-900 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
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
              className={`h-7 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedRole === r.id
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Grid of Staff */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredUsers.map((staff) => (
          <div
            key={staff.id}
            className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar name={staff.name} size="md" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-stone-900 text-xs leading-tight truncate">{staff.name}</h3>
                    <p className="text-[11px] text-stone-400 truncate mt-0.5">{staff.email}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    staff.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {staff.isActive ? 'On Duty' : 'Off Duty'}
                </span>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400">Role</span>
                <span className="font-bold uppercase tracking-wider text-[10.5px] px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                  {staff.role}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
              <select
                value={staff.role}
                onChange={(e) => handleRoleChange(staff.id, e.target.value as UserRole)}
                className="h-7 px-2 text-xs font-medium rounded-lg border border-stone-200 bg-stone-50 text-stone-800 outline-none cursor-pointer"
              >
                <option value="admin">Admin</option>
                <option value="chef">Chef</option>
                <option value="expo">Expo</option>
                <option value="staff">Staff</option>
              </select>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleActive(staff.id)}
                  className={`h-7 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    staff.isActive
                      ? 'bg-stone-100 text-stone-600 border-stone-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {staff.isActive ? 'Set Off' : 'Set On'}
                </button>

                <button
                  onClick={() => handleDeleteStaff(staff.id)}
                  title="Remove"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Admin or Staff"
        subtitle="Add a team member to the portal"
        maxWidth="sm"
      >
        <form onSubmit={handleInviteStaff} className="space-y-3">
          <Input
            label="Full Name"
            placeholder="e.g. Liam O'Connor"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <Input
            label="Staff Email"
            type="email"
            placeholder="e.g. liam@amberspice.ie"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700">Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="w-full h-9 rounded-xl border border-stone-200 bg-white px-2.5 text-xs text-stone-900 outline-none"
            >
              <option value="admin">Administrator (Full Access)</option>
              <option value="chef">Head Chef / Cook (KDS &amp; Stations)</option>
              <option value="expo">Expo Dispatch (Packaging &amp; Drivers)</option>
              <option value="staff">Station Line Staff</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            >
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default StaffManager;
