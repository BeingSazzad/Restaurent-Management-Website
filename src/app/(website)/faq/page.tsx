'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'all' | 'ordering' | 'dietary' | 'delivery' | 'payments'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<number[]>([1, 2]);

  const toggleAccordion = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filtered = FAQ_LIST.filter((item) => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="section-decorator mx-auto" />
        <h1 className="section-title mb-3">Frequently Asked Questions</h1>
        <p className="section-subtitle">
          Everything you need to know about our authentic cuisine, Dublin delivery zones, Halal
          standards, and ordering.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto mb-8">
        <Search className="w-4 h-4 text-[#9B8C80] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions (e.g. Halal, delivery time, gluten-free)..."
          className="w-full bg-white rounded-full pl-11 pr-5 py-3 text-xs text-[#1A130E] border border-[#EBE2D7] focus:outline-none focus:border-[#B84A22] shadow-sm transition-all"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {[
          { key: 'all', label: 'All Questions' },
          { key: 'ordering', label: 'Ordering & Takeaway' },
          { key: 'delivery', label: 'Dublin Delivery' },
          { key: 'dietary', label: 'Halal & Dietary' },
          { key: 'payments', label: 'Payments & Promo' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-[#B84A22] text-white shadow-md'
                : 'bg-white text-[#747474] hover:text-[#1A130E] border border-[#EBE2D7]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5 mb-14">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#EBE2D7] p-8">
            <HelpCircle className="w-10 h-10 text-[#9B8C80] mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#1A130E] mb-1">No questions found</h3>
            <p className="text-xs text-[#747474]">
              Try searching with different keywords or browse all categories.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="amber-card overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[#1A130E] hover:text-[#B84A22] transition-colors"
                >
                  <span className="leading-snug">{item.question}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#FAF6EF] text-[#747474] flex items-center justify-center shrink-0 border border-[#EBE2D7] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#B84A22]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#747474] leading-relaxed border-t border-[#FAF6EF]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still Have Questions Box */}
      <div className="p-8 rounded-3xl bg-white border border-[#EBE2D7] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF6EF] text-[#B84A22] border border-[#EBE2D7] flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#1A130E]">Still have a specific question?</h3>
            <p className="text-xs text-[#747474]">
              Our central Dublin kitchen team is happy to assist with allergies, catering or custom
              orders.
            </p>
          </div>
        </div>

        <Link
          href="/contact"
          className="btn-amber-primary px-6 py-2.5 text-xs font-semibold shrink-0 flex items-center gap-2"
        >
          <span>Contact Kitchen</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
