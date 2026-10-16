import React, { useState } from 'react';
import { ChefHat, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pin: '',
    role: 'line_cook',
    station: 'grill',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.AUTH.LOGIN);
      }, 1200);
    }, 600);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-stone-900 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md mb-3">
          <ChefHat className="w-6 h-6 text-[#F15A24]" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 tracking-tight">Staff Onboarding</h2>
        <p className="text-xs text-stone-500 mt-1">Register new kitchen brigade or expo member</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Staff profile created! Redirecting to login...</span>
          </div>
        )}

        <Input
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Liam O'Connor"
          leftIcon={<User className="w-4 h-4" />}
          required
        />

        <Input
          label="Staff Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="liam@amberspice.ie"
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-stone-700">Kitchen Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full h-9 rounded-lg border border-stone-200 bg-white px-2.5 text-xs text-stone-900 outline-none focus:border-[#F15A24]"
            >
              <option value="line_cook">Line Cook</option>
              <option value="sous_chef">Sous Chef</option>
              <option value="expo">Kitchen Expo</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-stone-700">Assigned Station</label>
            <select
              value={formData.station}
              onChange={(e) => setFormData({ ...formData, station: e.target.value })}
              className="w-full h-9 rounded-lg border border-stone-200 bg-white px-2.5 text-xs text-stone-900 outline-none focus:border-[#F15A24]"
            >
              <option value="grill">Grill / Tandoor</option>
              <option value="curry">Curry Station</option>
              <option value="bread">Bread & Naan</option>
              <option value="fryer">Fryer & Starters</option>
              <option value="expo">Pass / Expo</option>
            </select>
          </div>
        </div>

        <Input
          label="4-Digit Quick PIN"
          type="password"
          maxLength={4}
          value={formData.pin}
          onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
          placeholder="••••"
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Create Staff Access
        </Button>

        <div className="text-center pt-3 text-xs text-stone-500">
          Already registered?{' '}
          <Link to={ROUTES.AUTH.LOGIN} className="font-semibold text-[#F15A24] hover:underline">
            Sign In here
          </Link>
        </div>
      </form>
    </div>
  );
}
