'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="section-decorator mx-auto" />
        <h1 className="section-title mb-3">Privacy Policy</h1>
        <p className="section-subtitle">
          How Amber Spice handles and protects your personal data under GDPR.
        </p>
        <span className="text-[11px] text-[#747474] font-medium mt-2 block">
          Last Updated: October 2026 · Effective Immediately
        </span>
      </div>

      <div className="space-y-8 bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-10 text-[14px] sm:text-[15px] text-[#444444] leading-[26px] shadow-xs">
        {/* Intro */}
        <section className="space-y-2">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E]">
            1. Commitment to Your Privacy
          </h2>
          <p>
            Amber Spice (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), operating from 18 South
            William Street, Dublin 2, Ireland, values and respects the privacy of every diner,
            customer, and website visitor. This policy explains what personal data we collect, why we
            collect it, how it is safeguarded, and your statutory rights.
          </p>
        </section>

        {/* What We Collect */}
        <section className="space-y-2">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E]">
            2. Information We Collect
          </h2>
          <p>When you place an online delivery order, takeaway request, or contact us, we collect:</p>
          <ul className="list-disc pl-5 space-y-1 text-[#666666]">
            <li><strong>Customer Details:</strong> Name, phone number, and email address.</li>
            <li><strong>Delivery Information:</strong> Postal address, Dublin Eircode, and delivery instructions.</li>
            <li><strong>Order History:</strong> Dish preferences, dietary notes, and receipt timestamps.</li>
            <li><strong>Technical Data:</strong> IP address, device type, and session cookies for cart maintenance.</li>
          </ul>
        </section>

        {/* Payments */}
        <section className="space-y-2">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E]">
            3. Payment Processing Security
          </h2>
          <p>
            We do <strong>not</strong> store or have direct access to your credit or debit card
            numbers. All online payment transactions are processed securely through PCI-DSS Level 1
            certified payment gateways with end-to-end 256-bit SSL encryption.
          </p>
        </section>

        {/* How We Use Your Data */}
        <section className="space-y-2">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E]">
            4. How We Use Personal Information
          </h2>
          <p>We process your data exclusively for legitimate operational reasons:</p>
          <ul className="list-disc pl-5 space-y-1 text-[#666666]">
            <li>Preparing, dispatching, and fulfilling your food delivery and collection orders.</li>
            <li>Sending SMS or email order confirmation and live delivery driver updates.</li>
            <li>Responding to customer support questions, allergen queries, and feedback.</li>
            <li>Sending seasonal promotions and voucher codes (only where explicit consent was given).</li>
          </ul>
        </section>

        {/* GDPR Rights */}
        <section className="space-y-2">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E]">
            5. Your Statutory GDPR Rights
          </h2>
          <p>Under Irish and EU law, you are entitled to:</p>
          <ul className="list-disc pl-5 space-y-1 text-[#666666]">
            <li>The right to access a copy of the personal data we hold about you.</li>
            <li>The right to request rectification of inaccurate contact or address information.</li>
            <li>The right to erasure (&quot;Right to be Forgotten&quot;) of your account and records.</li>
            <li>The right to withdraw consent for marketing newsletters at any moment.</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="space-y-2 pt-4 border-t border-[#E5E5E5]">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E]">
            6. Data Protection Inquiries
          </h2>
          <p>
            If you have any questions regarding your data or wish to exercise your rights, please
            contact our Data Protection Officer at{' '}
            <strong className="text-[#F15A24]">dpo@amberspice.ie</strong> or visit us at 18 South
            William Street, Dublin 2, Ireland.
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
