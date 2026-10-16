'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';
import { getCmsPage, DEFAULT_CMS_DATA } from '@/services/cmsService';

export default function FAQPage() {
  const [faqData, setFaqData] = useState(() => getCmsPage('faq') || DEFAULT_CMS_DATA.faq);
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2']);

  useEffect(() => {
    const handleCmsUpdate = () => {
      setFaqData(getCmsPage('faq') || DEFAULT_CMS_DATA.faq);
    };
    window.addEventListener('amber_spice_cms_updated', handleCmsUpdate);
    window.addEventListener('storage', handleCmsUpdate);
    return () => {
      window.removeEventListener('amber_spice_cms_updated', handleCmsUpdate);
      window.removeEventListener('storage', handleCmsUpdate);
    };
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="section-decorator mx-auto" />
        <h1 className="section-title mb-3">{faqData.title}</h1>
        <p className="section-subtitle">{faqData.subtitle}</p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5 mb-14">
        {faqData.items.map((item) => {
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
                <div className="flex flex-col">
                  {item.category && (
                    <span className="text-[11px] font-bold text-[#F15A24] uppercase tracking-wider mb-0.5">
                      {item.category}
                    </span>
                  )}
                  <span className={`text-[16.5px] sm:text-[18px] font-bold leading-snug transition-colors ${isOpen ? 'text-[#B84A22]' : 'text-[#1A130E]'}`}>
                    {item.question}
                  </span>
                </div>
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
                <div className="px-5 sm:px-6 pb-4 sm:pb-5 pt-1 text-[13.5px] sm:text-[14px] text-[#555555] leading-[24px] animate-in fade-in duration-150 whitespace-pre-line">
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
