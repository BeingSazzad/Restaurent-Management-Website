'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ArrowRight, MessageSquareQuote } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const HOME_FAQS: FAQItem[] = [
  {
    id: 1,
    question: 'Is all meat 100% Halal certified?',
    answer:
      'Yes, absolutely. All poultry, lamb, and beef prepared in our South William Street kitchen are 100% certified Halal from verified Irish suppliers. Certificates are proudly displayed on-site.',
  },
  {
    id: 2,
    question: 'How long does doorstep delivery take?',
    answer:
      'Average delivery takes between 30 to 35 minutes depending on traffic and your postal area. Dishes are prepared fresh to order and dispatched in premium thermal insulated bags.',
  },
  {
    id: 3,
    question: 'What are the delivery fees and free delivery threshold?',
    answer:
      'Delivery is FREE on all orders over €30 across delivery zones 1 to 4. For orders under €30, a modest delivery fee between €2.50 and €4.50 applies based on your postal code.',
  },
  {
    id: 4,
    question: 'Can I customize the spice level of my curries and biryanis?',
    answer:
      'Yes! When selecting any dish on our menu, you can customize the spice level (Mild, Medium, Royal Spicy, or Extra Hot) as well as specify custom cooking notes and dietary preferences.',
  },
  {
    id: 5,
    question: 'Do you cater to gluten-free, dairy-free, and vegan diets?',
    answer:
      'Yes. Our Dum Biryanis and several lentils (Dal Tadka, Chana Masala) are naturally gluten-free. We also offer dairy-free curries upon request and clearly label all 14 EU allergens on our menu.',
  },
  {
    id: 6,
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and secure Cash on Delivery.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<number[]>([1]);

  const toggleAccordion = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-white py-16 sm:py-20 border-t border-[#EAEAEA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="section-decorator mx-auto mb-3.5" />
          <h2 className="section-title mb-3">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about our authentic cuisine, doorstep delivery, Halal
            certification, and orders.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5 mb-10">
          {HOME_FAQS.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`bg-[rgb(249,249,249)] border rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? 'border-[#B84A22]/50 shadow-xs bg-white'
                    : 'border-[#E5E5E5] hover:border-[#B84A22]/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-[15px] sm:text-[16px] hover:text-[#B84A22] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className={`leading-snug transition-colors ${isOpen ? 'text-[#B84A22]' : 'text-[#1A130E]'}`}>
                    {item.question}
                  </span>
                  <div
                    className={`w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] aspect-square rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 ${
                      isOpen
                        ? 'text-white bg-gradient-to-r from-[#B84A22] to-[#FBA138] border-transparent shadow-xs'
                        : 'bg-white text-[#747474] border-[#E5E5E5]'
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-3 text-[14px] sm:text-[15px] text-[#555555] leading-[24px] border-t border-[#F0F0F0] animate-in fade-in duration-150">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="rounded-2xl sm:rounded-3xl bg-[rgb(249,249,249)] border border-[#E5E5E5] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-bold text-[16px] text-[#1A130E]">Have more questions?</h4>
            <p className="text-[13px] sm:text-[14px] text-[#666666]">
              Our restaurant team is always here to assist with dietary queries, reservations, or large orders.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/faq"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-50 text-[#1A130E] text-[13px] font-semibold border border-[#E5E5E5] transition-all hover:scale-105"
            >
              All FAQs
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_4px_14px_rgba(184,74,34,0.25)] transition-all hover:scale-105"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
