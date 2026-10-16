'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

const ALLERGENS_LIST = [
  { id: 1, name: 'Gluten / Wheat', notes: 'Present in naans, rotis, and samosa pastry. Gluten-free biryanis & rice dishes available.' },
  { id: 2, name: 'Milk / Dairy', notes: 'Used in butter chicken, paneer, and raita. Can be omitted upon request for most curries.' },
  { id: 3, name: 'Tree Nuts', notes: 'Cashews & almonds used in royal korma gravies and desserts. Clearly separated in kitchen prep.' },
  { id: 4, name: 'Peanuts', notes: 'We do not cook with peanut oil. Pre-packaged items checked strictly.' },
  { id: 5, name: 'Mustard', notes: 'Used in selected authentic pickling spices and marinades.' },
  { id: 6, name: 'Sesame Seeds', notes: 'Present on select clay oven naans and garnished bread items.' },
  { id: 7, name: 'Eggs', notes: 'Egg Dum Biryani and specific dessert custards contain eggs.' },
  { id: 8, name: 'Fish', notes: 'Goan fish curry and coastal specialties contain authentic fish fillets.' },
  { id: 9, name: 'Crustaceans', notes: 'Tiger prawn curries contain crustaceans.' },
  { id: 10, name: 'Soybeans', notes: 'Present in select seasonings and marinades.' },
  { id: 11, name: 'Celery', notes: 'Used in vegetable aromatic stocks and slow-simmered bases.' },
  { id: 12, name: 'Sulphur Dioxide / Sulphites', notes: 'Present in small quantities in preserved sundried fenugreek.' },
  { id: 13, name: 'Lupin', notes: 'Not commonly utilized; verified in flour supplies.' },
  { id: 14, name: 'Molluscs', notes: 'Not used in our standard heritage menu.' },
];

export default function AllergensPage() {
  return (
    <div className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="section-decorator mx-auto mb-3" />
        <h1 className="section-title mb-3">
          Allergen &amp; Dietary Information
        </h1>
        <p className="section-subtitle">
          Full transparency in compliance with the Food Safety Authority of Ireland (FSAI) and EU
          Regulation No. 1169/2011.
        </p>
      </div>

      {/* 2 Core Highlights: 100% Halal + Rigorous Kitchen Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0FA958]/10 text-[#0FA958] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#1A130E]">100% Certified Halal</h3>
          <p className="text-xs text-[#747474] leading-relaxed">
            All poultry, lamb, and beef prepared in our South William Street kitchen are ethically
            sourced from certified Irish suppliers. We maintain complete traceability from farm to
            tandoor.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D49B37]/10 text-[#D49B37] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#1A130E]">Allergen Awareness & Safety</h3>
          <p className="text-xs text-[#747474] leading-relaxed">
            Our chefs prepare individual dishes with clean cookware upon request. However, due to
            the presence of nuts, gluten, and dairy in our open kitchen, mild airborne
            cross-contact cannot be 100% excluded.
          </p>
        </div>
      </div>

      {/* 14 EU Allergens Table */}
      <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 shadow-xs mb-10">
        <h3 className="text-lg font-bold text-[#1A130E] mb-1">14 EU Declared Allergens Guide</h3>
        <p className="text-xs text-[#747474] mb-6">
          Check how each statutory allergen is handled in our recipes:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALLERGENS_LIST.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[rgb(249,249,249)] border border-[#E5E5E5] space-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white text-[#B84A22] font-bold text-xs flex items-center justify-center border border-[#E5E5E5]">
                  {item.id}
                </span>
                <span className="font-bold text-xs text-[#1A130E]">{item.name}</span>
              </div>
              <p className="text-[11px] text-[#747474] pl-8">{item.notes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Contact */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="font-bold text-sm text-[#1A130E]">Have a severe allergy or specific question?</h4>
          <p className="text-xs text-[#747474]">
            Speak directly with our duty chef at (+353) 1 485 9210 prior to ordering.
          </p>
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
