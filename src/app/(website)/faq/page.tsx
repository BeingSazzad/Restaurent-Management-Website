'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';

interface FAQItem {
  id: number;
  category: 'ordering' | 'dietary' | 'delivery' | 'payments';
  question: string;
  answer: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: 1,
    category: 'dietary',
    question: 'Is all meat 100% Halal certified?',
    answer:
      'Yes, absolutely. All poultry, lamb, and beef prepared in our South William Street kitchen are 100% certified Halal from reputable Irish suppliers. Certificates are displayed on-site.',
  },
  {
    id: 2,
    category: 'delivery',
    question: 'How long does Dublin doorstep delivery take?',
    answer:
      'Average delivery takes between 30 to 35 minutes depending on traffic and Dublin postal zone. Orders are prepared fresh and dispatched in thermal insulated bags.',
  },
  {
    id: 3,
    category: 'delivery',
    question: 'What are the delivery fees and free delivery threshold?',
    answer:
      'Delivery is FREE on all orders over €30 across Dublin Zones 1 to 4. For orders under €30, a modest delivery fee between €2.50 and €4.50 applies depending on your postal code.',
  },
  {
    id: 4,
    category: 'ordering',
    question: 'Can I customize the spice level of my curries and biryanis?',
    answer:
      'Yes! When selecting any dish on our menu, you can customize the spice level (Mild, Medium, Royal Spicy, or Extra Hot) as well as add dietary preferences and cooking instructions.',
  },
  {
    id: 5,
    category: 'dietary',
    question: 'Do you cater to gluten-free, dairy-free, and vegan diets?',
    answer:
      'Yes. Our Dum Biryanis and several lentils (Dal Tadka, Chana Masala) are naturally gluten-free. We also offer dairy-free curries upon request and clearly label all 14 EU allergens on our menu.',
  },
  {
    id: 6,
    category: 'ordering',
    question: 'How does takeaway counter collection work?',
    answer:
      'Choose "Counter Takeaway" at checkout. Your order will be cooked and packaged hot in approximately 15-20 minutes. Pick it up directly from our collection counter at 18 South William St, Dublin 2.',
  },
  {
    id: 7,
    category: 'payments',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and secure Cash on Delivery.',
  },
  {
    id: 8,
    category: 'ordering',
    question: 'Can I track my order live?',
    answer:
      'Yes! Right after placing your order, our visual Live Tracker displays live updates: Order Placed -> Tandoor Preparation -> Out for Delivery -> Delivered.',
  },
];

export default function FAQPage() {
  const [openIds, setOpenIds] = useState<number[]>([1, 2]);

  const toggleAccordion = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="section-decorator mx-auto" />
        <h1 className="section-title mb-3">Frequently Asked Questions</h1>
        <p className="section-subtitle">
          Everything you need to know about our authentic cuisine, doorstep delivery, Halal
          standards, and ordering.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5 mb-14">
        {FAQ_LIST.map((item) => {
          const isOpen = openIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs transition-all duration-200 ${
                isOpen ? 'border-[#B84A22]/50' : 'border-[#E5E5E5] hover:border-[#B84A22]/40'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(item.id)}
                className={`w-full px-5 sm:px-6 pt-4 sm:pt-5 ${
                  isOpen ? 'pb-2 sm:pb-2.5' : 'pb-4 sm:pb-5'
                } text-left flex items-center justify-between gap-4 hover:text-[#B84A22] transition-colors cursor-pointer`}
              >
                <span className={`text-[16.5px] sm:text-[18px] font-bold leading-snug transition-colors ${isOpen ? 'text-[#B84A22]' : 'text-[#1A130E]'}`}>
                  {item.question}
                </span>
                <div
                  className={`w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] aspect-square rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 ${
                    isOpen
                      ? 'text-white bg-gradient-to-r from-[#B84A22] to-[#FBA138] border-transparent shadow-xs'
                      : 'bg-[rgb(249,249,249)] text-[#747474] border-[#E5E5E5]'
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
                <div className="px-5 sm:px-6 pb-4 sm:pb-5 pt-1 text-[13.5px] sm:text-[14px] text-[#555555] leading-[24px] animate-in fade-in duration-150">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions Box */}
      <div className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#E5E5E5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white flex items-center justify-center shrink-0 shadow-xs">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[17px] text-[#1A130E]">Still have a specific question?</h3>
            <p className="text-[13px] sm:text-[14px] text-[#666666] mt-0.5">
              Our restaurant kitchen team is happy to assist with allergies, catering or custom
              orders.
            </p>
          </div>
        </div>

        <Link
          href="/contact"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-[13px] font-semibold shrink-0 flex items-center gap-2 shadow-[0_4px_14px_rgba(184,74,34,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          <span>Contact Kitchen</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
