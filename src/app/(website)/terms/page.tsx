'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { getCmsPage, DEFAULT_CMS_DATA } from '@/services/cmsService';
import { PolicyContentRenderer } from '@/components/shared/PolicyContentRenderer';

export default function TermsPage() {
  const [termsData, setTermsData] = useState(() => getCmsPage('terms') || DEFAULT_CMS_DATA.terms);

  useEffect(() => {
    const handleCmsUpdate = () => {
      setTermsData(getCmsPage('terms') || DEFAULT_CMS_DATA.terms);
    };
    window.addEventListener('amber_spice_cms_updated', handleCmsUpdate);
    window.addEventListener('storage', handleCmsUpdate);
    return () => {
      window.removeEventListener('amber_spice_cms_updated', handleCmsUpdate);
      window.removeEventListener('storage', handleCmsUpdate);
    };
  }, []);

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="section-decorator mx-auto" />
        <h1 className="section-title mb-3">{termsData.title}</h1>
        <p className="section-subtitle">{termsData.subtitle}</p>
        <span className="text-[11px] text-[#747474] font-medium mt-2 block">
          Last Updated: {termsData.lastUpdated}
        </span>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-10 shadow-xs">
        <PolicyContentRenderer content={termsData.content} sections={termsData.sections} />
      </div>

      {/* Back to Home & Privacy Link */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl text-[13px] font-semibold bg-white border border-[#E5E5E5] text-[#1A130E] hover:border-[#F15A24] hover:text-[#F15A24] shadow-xs inline-flex items-center gap-2 transition-colors"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/privacy-policy"
          className="px-6 py-2.5 rounded-xl text-[13px] font-semibold bg-white border border-[#E5E5E5] text-[#1A130E] hover:border-[#F15A24] hover:text-[#F15A24] shadow-xs inline-flex items-center gap-2 transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-[#F15A24]" />
          <span>View Privacy Policy</span>
        </Link>
      </div>
    </div>
  );
}
