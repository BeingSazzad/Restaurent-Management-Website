import React, { useState } from 'react';
import { KeyRound, Lock, Hash, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';

export function ChangePasswordPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stationPin, setStationPin] = useState('4402');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setError('Please provide your current password or station PIN.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (stationPin && (stationPin.length !== 4 || isNaN(Number(stationPin)))) {
      setError('Station PIN must be a 4-digit numeric code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Credentials updated successfully! Your new password and station PIN are active.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
          Security &amp; PIN Management
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage your personal terminal login password and touch-screen station switch PIN.
        </p>
      </div>

      {/* Active User Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#B84A22] border border-orange-200/60 flex items-center justify-center font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-[#F15A24]" />
          </div>
          <div>
            <div className="font-bold text-stone-900 text-sm">{user?.name || 'Authorized Staff'}</div>
            <div className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
              <span>{user?.email || 'staff@amberspice.ie'}</span>
              <span>·</span>
              <span className="capitalize font-semibold text-[#B84A22] bg-orange-50 px-2 py-0.2 rounded">
                {user?.role || 'Chef'}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Session
          </span>
        </div>
      </div>

      {/* Main Change Form */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-800 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current Password / Station PIN"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password or station PIN"
            leftIcon={<KeyRound className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <Input
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              leftIcon={<Lock className="w-4 h-4" />}
            />
          </div>

          <div className="pt-2">
            <Input
              label="4-Digit Touchscreen Station PIN"
              type="text"
              maxLength={4}
              value={stationPin}
              onChange={(e) => setStationPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="e.g. 4402"
              leftIcon={<Hash className="w-4 h-4" />}
              helperText="Used for rapid single-tap cook station switching at KDS kitchen display terminals."
            />
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-start gap-2.5 text-xs text-stone-600">
            <ShieldAlert className="w-4 h-4 text-[#F15A24] shrink-0 mt-0.5" />
            <span>
              Updating your credentials will apply across all active line stations and kitchen display terminals immediately.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="px-6"
            >
              Update Security Credentials
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
