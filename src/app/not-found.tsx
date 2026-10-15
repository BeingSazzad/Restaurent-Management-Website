import React from 'react';
import Link from 'next/link';
import { Home, UtensilsCrossed, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-[rgb(249,249,249)] text-[#B84A22] border border-[#E5E5E5] flex items-center justify-center mx-auto shadow-xs">
          <UtensilsCrossed className="w-8 h-8" />
        </div>

        <span className="text-4xl font-extrabold text-[#B84A22] block tracking-tight">404</span>

        <h1 className="text-xl font-bold text-[#1A130E]">Page Not Found</h1>

        <p className="text-xs text-[#747474] leading-relaxed">
          The dish or page you are looking for has been moved, renamed, or is simmering elsewhere in
          our kitchen.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto btn-amber-primary px-6 py-2.5 text-xs font-semibold inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/menu"
            className="w-full sm:w-auto btn-secondary px-6 py-2.5 text-xs font-semibold inline-flex items-center justify-center gap-2"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
