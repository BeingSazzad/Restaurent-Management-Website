import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ROUTES } from '../../constants/routes';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#B84A22] to-[#FBA138] rounded-2xl mx-auto flex items-center justify-center text-white shadow-md shadow-[#B84A22]/20 mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <span className="inline-block text-[10.5px] font-bold text-[#B84A22] bg-orange-50 border border-orange-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
              Staff Account Recovery
            </span>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">Forgot Password or PIN?</h2>
            <p className="text-xs text-stone-500 mt-1">
              Enter your registered staff email address to receive password reset instructions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
            {isSubmitted ? (
              <div className="space-y-4 text-center py-2 animate-in fade-in duration-300">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200/60">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Recovery Instructions Sent</h3>
                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                    We sent a secure password reset link to <strong className="text-stone-800">{email || 'your email'}</strong>. Please check your inbox or speak with the Head Chef for a manual terminal PIN reset.
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    to={ROUTES.AUTH.RESET_PASSWORD}
                    className="w-full inline-flex items-center justify-center h-9 px-4 rounded-xl text-xs font-semibold bg-[#F15A24] hover:bg-[#D94E1C] text-white transition-colors"
                  >
                    Simulate: Open Reset Password Screen &rarr;
                  </Link>

                  <Link
                    to={ROUTES.AUTH.LOGIN}
                    className="w-full inline-flex items-center justify-center h-9 px-4 rounded-xl text-xs font-medium bg-stone-100 hover:bg-stone-200/80 text-stone-700 transition-colors"
                  >
                    Back to Terminal Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Registered Staff Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. headchef@amberspice.ie"
                  leftIcon={<Mail className="w-4 h-4" />}
                  helperText="Use the email assigned to your kitchen shift or admin role."
                />

                <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Emergency floor lockout? You can also ask any Duty Manager to reset your 4-digit station PIN on the floor.
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  isLoading={isLoading}
                >
                  Send Recovery Link
                </Button>

                <div className="text-center pt-2">
                  <Link
                    to={ROUTES.AUTH.LOGIN}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Terminal Login</span>
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

export default ForgotPasswordPage;
