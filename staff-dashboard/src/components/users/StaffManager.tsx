import React, { useState } from 'react';
import { INITIAL_STAFF_USERS } from '../../lib/constants';
import { StaffUser, UserRole } from '../../types/common.types';
import { PageHeader } from '../layout/PageHeader';
import { Avatar } from '../shared/Avatar';
import { Badge } from '../shared/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Plus, ShieldCheck, Search, X, Trash2, CheckCircle2 } from 'lucide-react';

export function StaffManager() {
  const [users, setUsers] = useState<StaffUser[]>(INITIAL_STAFF_USERS);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('chef');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    showToast(`Role updated to ${newRole}`);
  };

  const handleToggleActive = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
    showToast('Staff status updated');
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
      shiftStation: newRole === 'chef' ? 'curries' : 'all',
    };

    setUsers((prev) => [newStaff, ...prev]);
    setNewName('');
    setNewEmail('');
    setNewRole('chef');
    setIsAddModalOpen(false);
    showToast(`${newStaff.name} added to kitchen brigade!`);
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    const matchesSearch = !searchQuery.trim() || 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center gap-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <PageHeader
        title="Staff & Roles"
        description="Manage kitchen team members, roles, and shift status."
        action={
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Staff Member
          </Button>
        }
      />

      {/* Standard Unified Toolbar Card (Equal h-10 height across controls) */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Field (Equal h-10 height, spacious pl-11 icon clearance) */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search staff by name or email..."
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

        {/* Role Segmented Filter (Equal h-10 height) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="h-10 flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 overflow-x-auto overflow-y-hidden scrollbar-none">
            {[
              { id: 'all', label: 'All Staff' },
              { id: 'chef', label: 'Chefs' },
              { id: 'expo', label: 'Expo' },
              { id: 'staff', label: 'Line Staff' },
              { id: 'admin', label: 'Admins' },
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
          <span className="text-xs text-stone-400 font-medium hidden sm:inline px-1">
            {filteredUsers.length} Members
          </span>
        </div>
      </div>

      {/* Staff Members List */}
      <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs">
        <div className="divide-y divide-stone-100">
          {filteredUsers.map((staff) => (
            <div key={staff.id} className="p-4 flex items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar name={staff.name} isOnline={staff.isActive} />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-stone-900">{staff.name}</h4>
                    {!staff.isActive && (
                      <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded font-medium">
                        Off Duty
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500">{staff.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    staff.role === 'chef'
                      ? 'primary'
                      : staff.role === 'admin'
                      ? 'warning'
                      : 'neutral'
                  }
                  size="sm"
                >
                  <ShieldCheck className="w-3 h-3 mr-0.5" />
                  <span className="capitalize">{staff.role}</span>
                </Badge>

                {/* Role Selector */}
                <select
                  value={staff.role}
                  onChange={(e) => handleRoleChange(staff.id, e.target.value as UserRole)}
                  className="h-8 px-2.5 rounded-lg border border-stone-200 text-xs bg-stone-50 text-stone-800 outline-none hover:border-stone-300 transition-colors cursor-pointer"
                >
                  <option value="chef">Chef / Line Cook</option>
                  <option value="expo">Expo Dispatch</option>
                  <option value="staff">Station Staff</option>
                  <option value="admin">Kitchen Admin</option>
                </select>

                {/* Toggle Online / Offline */}
                <button
                  onClick={() => handleToggleActive(staff.id)}
                  title={staff.isActive ? 'Mark Off Duty' : 'Mark On Duty'}
                  className={`h-8 px-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    staff.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  {staff.isActive ? 'On Duty' : 'Off Duty'}
                </button>

                {/* Delete Staff Member */}
                <button
                  onClick={() => handleDeleteStaff(staff.id)}
                  title="Remove staff member"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Staff Member"
        subtitle="Add a new kitchen or management team member"
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
            label="Staff Email"
            type="email"
            placeholder="e.g. liam@amberspice.ie"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <div className="space-y-1">
            <label className="block text-xs font-medium text-stone-700">Kitchen Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="w-full h-10 rounded-xl border border-stone-200 bg-white px-3 text-xs text-stone-900 outline-none focus:border-[#F15A24] cursor-pointer"
            >
              <option value="chef">Chef / Line Cook</option>
              <option value="expo">Expo Dispatch</option>
              <option value="staff">Station Staff</option>
              <option value="admin">Kitchen Admin</option>
            </select>
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
              Save Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
