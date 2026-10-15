'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="section-decorator mx-auto" />
        <h1 className="section-title mb-3">Cookie Policy</h1>
        <p className="section-subtitle">
          How Amber Spice uses cookies to deliver a smooth and secure ordering experience.
        </p>
        <span className="text-[11px] text-[#747474] font-medium mt-2 block">
          Compliant with EU ePrivacy Directive & Irish Data Protection Commission guidelines
        </span>
      </div>

      <div className="space-y-8 bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-10 text-[14px] sm:text-[15px] text-[#444444] leading-[26px] shadow-xs">
        {/* What are cookies */}
        <section className="space-y-2">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E]">
            1. What Are Cookies?
          </h2>
          <p>
            Cookies are small text files stored on your computer or mobile device when you browse
            websites. They help remember your preferences, keep your shopping cart active across
            pages, and improve site loading performance.
          </p>
        </section>

        {/* Categories of Cookies We Use */}
        <section className="space-y-4">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E]">
            2. Types of Cookies We Use
          </h2>

          <div className="space-y-3">
            <div className="p-4 sm:p-5 rounded-2xl bg-[rgb(249,249,249)] border border-[#E5E5E5]">
              <h3 className="font-bold text-[15px] text-[#1A130E] mb-1">
                Session & Cart Persistence
              </h3>
              <p className="text-[#666666] leading-relaxed">
                Necessary for the core operation of our ordering platform. These cookies retain the
                items in your food basket, your chosen Dublin delivery zone, and your authentication
                status. The website cannot function properly without them.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[rgb(249,249,249)] border border-[#E5E5E5]">
              <h3 className="font-bold text-[15px] text-[#1A130E] mb-1">
                Preferences & Customization
              </h3>
              <p className="text-[#666666] leading-relaxed">
                Remember your past delivery notes, spice preference defaults, and saved Dublin delivery
                addresses for quicker future checkouts.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[rgb(249,249,249)] border border-[#E5E5E5]">
              <h3 className="font-bold text-[15px] text-[#1A130E] mb-1">
                Anonymous Traffic Analytics
              </h3>
              <p className="text-[#666666] leading-relaxed">
                Help us understand which heritage dishes are most popular and identify any slow-loading
                pages to continually enhance speed and responsiveness.
              </p>
            </div>
          </div>
        </section>

        {/* How to Manage Cookies */}
        <section className="space-y-2">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E]">
            3. Managing Cookie Preferences
          </h2>
          <p>
            Most modern web browsers allow you to manage or delete cookies via browser settings. You
            can choose to block third-party cookies or receive alerts when a cookie is placed. Please
            note that disabling strictly essential cookies may impact your ability to checkout online.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-2 pt-4 border-t border-[#E5E5E5]">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E]">
            4. Questions Regarding Cookies
          </h2>
          <p>
            For further information regarding our cookie practices, please contact us at{' '}
            <strong className="text-[#F15A24]">support@amberspice.ie</strong>.
          </p>
        </section>
      </div>

      {/* Back to Home */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl text-[13px] font-semibold bg-white border border-[#E5E5E5] text-[#1A130E] hover:border-[#F15A24] hover:text-[#F15A24] shadow-xs inline-flex items-center gap-2 transition-colors"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
