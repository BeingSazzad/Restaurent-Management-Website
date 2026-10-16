import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, KeyRound, Mail, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useLogin } from '../hooks/useLogin';
import { INITIAL_STAFF_USERS } from '../../../lib/constants';
import { ROUTES } from '../../../constants/routes';

export function LoginForm() {
  const [emailOrPin, setEmailOrPin] = useState('headchef@amberspice.ie');
  const [password, setPassword] = useState('kitchen123');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ emailOrPin, password });
  };

  const handleQuickSelect = (email: string) => {
    setEmailOrPin(email);
    setPassword('kitchen123');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#B84A22] to-[#FBA138] rounded-2xl mx-auto flex items-center justify-center text-white shadow-md shadow-[#B84A22]/20 mb-3">
          <ChefHat className="w-6 h-6" />
        </div>
        <span className="inline-block text-[10.5px] font-bold text-[#B84A22] bg-orange-50 border border-orange-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
          Kitchen &amp; Operations Portal
        </span>
        <h2 className="text-xl font-bold text-stone-900 tracking-tight">Staff Terminal Login</h2>
        <p className="text-xs text-stone-500 mt-1">
          Authorized head chef, expo &amp; kitchen administration only.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Staff Email or 4-Digit Station PIN"
          type="text"
          value={emailOrPin}
          onChange={(e) => setEmailOrPin(e.target.value)}
          placeholder="e.g. headchef@amberspice.ie or 4402"
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <div>
          <Input
            label="Kitchen Security PIN / Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<KeyRound className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            required
          />
          <div className="flex justify-end mt-1.5">
            <Link
              to={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-xs font-medium text-[#F15A24] hover:text-[#D94E1C] hover:underline transition-colors"
            >
              Forgot Password / Station PIN?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Sign In to Kitchen Display
        </Button>

        {/* Quick Demo Staff Switcher */}
        <div className="pt-4 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F15A24]" />
            <span>Quick Select Active Role</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {INITIAL_STAFF_USERS.map((staff) => (
              <button
                type="button"
                key={staff.id}
                onClick={() => handleQuickSelect(staff.email)}
                className={`p-2 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                  emailOrPin === staff.email
                    ? 'border-[#F15A24] bg-[#F15A24]/5 text-stone-900 font-medium'
                    : 'border-stone-200 bg-stone-50/60 hover:bg-stone-100 text-stone-600'
                }`}
              >
                <div className="font-semibold text-stone-900 truncate">{staff.name}</div>
                <div className="text-[10px] text-stone-500 capitalize">{staff.role.replace('_', ' ')}</div>
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
