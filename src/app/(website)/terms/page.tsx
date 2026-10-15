'use client';

import React from 'react';
import Link from 'next/link';
import { FileCheck, ShieldAlert, Clock, CreditCard, ArrowRight } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="section-decorator mx-auto" />
        <h1 className="section-title mb-3">Terms & Conditions</h1>
        <p className="section-subtitle">
          Terms of service and customer agreement governing food orders, delivery, collection, and
          digital services provided by Amber Spice.
        </p>
        <span className="text-[11px] text-[#747474] font-medium mt-2 block">
          Effective as of October 2026 · Governing Law: Republic of Ireland
        </span>
      </div>

      <div className="space-y-8 bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-10 text-[14px] sm:text-[15px] text-[#444444] leading-[26px] shadow-xs">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E] flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#F15A24]" /> 1. Agreement to Terms
          </h2>
          <p>
            By accessing our website or placing an online order for delivery or collection, you agree
            to be bound by these Terms & Conditions. If you disagree with any portion of these terms,
            please refrain from utilizing our online ordering platform.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E] flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#F15A24]" /> 2. Pricing, VAT & Payment
          </h2>
          <p>
            All menu prices are listed in Euros (€) and are inclusive of standard Irish Value Added
            Tax (VAT). While we endeavor to ensure accurate pricing across the platform, we reserve
            the right to update prices, seasonal dishes, and special promotions without prior notice.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F15A24]" /> 3. Fulfillment, Delivery & Collections
          </h2>
          <p>
            Estimated delivery times (~30-35 mins) and collection preparation times (~15-20 mins) are
            approximate and may vary due to peak hours, kitchen volume, or inclement weather in Dublin.
            Customers are responsible for providing complete and accurate Dublin addresses, Eircodes,
            and contact numbers.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#F15A24]" /> 4. Allergen Information & Dietary Care
          </h2>
          <p>
            Our kitchen prepares food containing nuts, gluten, dairy, mustard, and sesame. While our
            chefs enforce strict hygienic separation and clear EU allergen labeling, we cannot
            guarantee complete absence of airborne cross-contamination. If you suffer from severe
            allergies, please contact our team directly before placing an order.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E]">5. Cancellations, Modifications & Refunds</h2>
          <p>
            Due to the perishable and custom nature of freshly cooked food, order cancellations can
            only be accepted within <strong>5 minutes</strong> of placing the order before cooking
            commences. If you receive an incorrect or damaged item, please contact our South William
            Street counter immediately with your order receipt for a swift replacement or refund.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2 pt-4 border-t border-[#E5E5E5]">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E]">6. Governing Jurisdiction</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of the Republic of
            Ireland. Any disputes arising in connection with these terms shall be subject to the
            exclusive jurisdiction of the courts of Dublin, Ireland.
          </p>
        </section>
      </div>

      {/* Back to Home */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full text-[13px] font-semibold bg-white border border-[#E5E5E5] text-[#1A130E] hover:border-[#F15A24] hover:text-[#F15A24] shadow-xs inline-flex items-center gap-2 transition-colors"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
