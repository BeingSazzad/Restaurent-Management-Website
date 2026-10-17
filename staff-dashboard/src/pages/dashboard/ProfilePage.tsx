import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../store/hooks';
import { updateProfile } from '../../store/slices/authSlice';

export function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  // Profile details state
  const [name, setName] = useState(user?.name || 'Tariq Al-Hassan');
  const [email, setEmail] = useState(user?.email || 'admin@amberspice.ie');
  const [phone, setPhone] = useState(user?.phone || '+353 (01) 485 9210');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('⚠️ Name and email are required');
      return;
    }
    dispatch(updateProfile({ name: name.trim(), email: email.trim(), phone: phone.trim() }));
    showToast('✓ Profile updated successfully');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    // Success simulation
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSuccess('Password updated successfully.');
    showToast('✓ Password updated successfully');
  };

  const initials = (name || 'Admin')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Admin Profile"
        description="Manage your staff account credentials and security password."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column: Profile Overview Card */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-4 text-center">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-800 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-sm ring-4 ring-orange-500/10">
            <img
              src={user?.avatarUrl || '/images/chef_master.jpg'}
              alt={user?.name || name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/chef_master.jpg';
              }}
            />
          </div>

          <div>
            <h3 className="font-bold text-base text-[#1A130E]">{user?.name || name}</h3>
            <p className="text-xs text-stone-500 mt-0.5">{user?.email || email}</p>
          </div>

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2 text-left">
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-stone-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#F15A24]" />
                <span>Role</span>
              </span>
              <span className="font-semibold text-stone-800 capitalize bg-stone-100 px-2 py-0.5 rounded-md text-[11px]">
                {user?.role || 'Admin'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-stone-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Joined</span>
              </span>
              <span className="font-semibold text-stone-800 text-[11px]">
                {user?.joinedAt || 'Jan 2024'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-stone-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Status</span>
              </span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px] border border-emerald-100">
                Active Staff
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Info & Change Password Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Form 1: Account Information */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
            <div className="pb-3 border-b border-stone-100 flex items-center gap-2">
              <User className="w-4 h-4 text-[#F15A24]" />
              <h3 className="font-bold text-sm text-[#1A130E]">Account Information</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full h-9 pl-9 pr-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs font-medium text-stone-900 outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@amberspice.ie"
                      className="w-full h-9 pl-9 pr-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs font-medium text-stone-900 outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Contact Phone</label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+353 (01) 485 9210"
                      className="w-full h-9 pl-9 pr-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs font-medium text-stone-900 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Role Permissions</label>
                  <div className="relative flex items-center">
                    <Shield className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      disabled
                      value="System Administrator & Manager"
                      className="w-full h-9 pl-9 pr-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                >
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Form 2: Password Change */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
            <div className="pb-3 border-b border-stone-100 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#F15A24]" />
              <div>
                <h3 className="font-bold text-sm text-[#1A130E]">Security &amp; Password</h3>
                <p className="text-[11px] text-stone-500">Update your account login password.</p>
              </div>
            </div>

            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-medium text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Current Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full h-9 pl-9 pr-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs font-medium text-stone-900 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">New Password</label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full h-9 pl-9 pr-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs font-medium text-stone-900 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Confirm New Password</label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full h-9 pl-9 pr-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs font-medium text-stone-900 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  leftIcon={<KeyRound className="w-3.5 h-3.5" />}
                >
                  <span>Update Password</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#140F0C] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold border border-stone-800 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
