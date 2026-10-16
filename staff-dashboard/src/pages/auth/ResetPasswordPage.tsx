import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, KeyRound, CheckCircle2, AlertCircle, Eye, EyeOff, Hash } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ROUTES } from '../../constants/routes';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stationPin, setStationPin] = useState('4402');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (stationPin && (stationPin.length !== 4 || isNaN(Number(stationPin)))) {
      setError('Station PIN must be exactly 4 digits.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#B84A22] to-[#FBA138] rounded-2xl mx-auto flex items-center justify-center text-white shadow-md shadow-[#B84A22]/20 mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <span className="inline-block text-[10.5px] font-bold text-[#B84A22] bg-orange-50 border border-orange-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
              Terminal Security
            </span>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">Reset Password &amp; Station PIN</h2>
            <p className="text-xs text-stone-500 mt-1">
              Choose a strong password and quick 4-digit station PIN.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
            {isSuccess ? (
              <div className="space-y-4 text-center py-2 animate-in fade-in duration-300">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200/60">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Credentials Updated Successfully</h3>
                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                    Your password and station PIN have been saved. You can now use them to unlock any kitchen KDS terminal.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                >
                  Proceed to Terminal Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <Input
                  label="New Secure Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  leftIcon={<KeyRound className="w-4 h-4" />}
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
                  placeholder="Re-enter new password"
                  leftIcon={<Lock className="w-4 h-4" />}
                />

                <Input
                  label="4-Digit Station Quick PIN"
                  type="text"
                  maxLength={4}
                  value={stationPin}
                  onChange={(e) => setStationPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="e.g. 4402"
                  leftIcon={<Hash className="w-4 h-4" />}
                  helperText="Used for touch-screen station switching during live kitchen rushes."
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  isLoading={isLoading}
                >
                  Save Credentials &amp; Continue
                </Button>

                <div className="text-center pt-2">
                  <Link
                    to={ROUTES.AUTH.LOGIN}
                    className="text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
                  >
                    Cancel &amp; Return to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
