import React, { useState } from 'react';
import {
  FileText,
  Shield,
  Cookie,
  HelpCircle,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
} from 'lucide-react';

const CMS_STORAGE_KEY = 'amber_spice_cms_data';

interface CmsSection {
  id: string;
  title: string;
  content: string;
}

interface CmsPageData {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: CmsSection[];
}

interface CmsFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface CmsData {
  terms: CmsPageData;
  privacy: CmsPageData;
  cookie: CmsPageData;
  faq: {
    title: string;
    subtitle: string;
    items: CmsFaqItem[];
  };
}

const DEFAULT_DATA: CmsData = {
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Customer terms and conditions for ordering, delivery, and dining services.',
    lastUpdated: 'October 2026',
    sections: [
      {
        id: 'term-1',
        title: '1. Agreement to Terms',
        content:
          'By accessing our website or placing an online order for delivery or collection, you agree to be bound by these Terms & Conditions.',
      },
      {
        id: 'term-2',
        title: '2. Pricing, VAT & Payment',
        content:
          'All menu prices are listed in Euros (€) and are inclusive of standard Irish Value Added Tax (VAT).',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How Amber Spice protects and handles your personal ordering and payment information under GDPR.',
    lastUpdated: 'October 2026',
    sections: [
      {
        id: 'priv-1',
        title: '1. Information We Collect',
        content:
          'When you place an order, create an account, or book a table, we collect your name, phone number, email address, delivery address, and Eircode.',
      },
    ],
  },
  cookie: {
    title: 'Cookie Policy',
    subtitle: 'Transparency regarding cookies and local storage utilized to ensure seamless ordering and tracking.',
    lastUpdated: 'October 2026',
    sections: [
      {
        id: 'cook-1',
        title: '1. What Are Cookies?',
        content:
          'Cookies and browser storage are small data files saved on your device to keep your shopping cart intact and remember delivery addresses.',
      },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Find fast answers to common questions about our food, halal certification, delivery, and catering.',
    items: [
      {
        id: 'faq-1',
        category: 'Food & Dietary',
        question: 'Is all meat 100% Halal certified?',
        answer:
          'Yes, absolutely. All poultry, lamb, and beef prepared in our South William Street kitchen are 100% certified Halal from verified Irish suppliers.',
      },
    ],
  },
};

const getStoredCms = (): CmsData => {
  if (typeof window === 'undefined') return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_DATA,
        ...parsed,
        terms: { ...DEFAULT_DATA.terms, ...(parsed.terms || {}) },
        privacy: { ...DEFAULT_DATA.privacy, ...(parsed.privacy || {}) },
        cookie: { ...DEFAULT_DATA.cookie, ...(parsed.cookie || {}) },
        faq: { ...DEFAULT_DATA.faq, ...(parsed.faq || {}) },
      };
    }
  } catch {
    // fallback
  }
  return DEFAULT_DATA;
};

export function CmsPage() {
  const [data, setData] = useState<CmsData>(() => getStoredCms());
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'cookie' | 'faq'>('terms');
  const [notice, setNotice] = useState<string | null>(null);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      try {
        const existing = localStorage.getItem(CMS_STORAGE_KEY);
        const parsed = existing ? JSON.parse(existing) : {};
        const merged = { ...parsed, ...data };
        localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new Event('amber_spice_cms_updated'));
        setNotice('✓ Published to customer website successfully!');
        setTimeout(() => setNotice(null), 3000);
      } catch {
        // ignore
      }
    }
  };

  const updateSection = (page: 'terms' | 'privacy' | 'cookie', index: number, field: 'title' | 'content', val: string) => {
    const sections = [...data[page].sections];
    sections[index] = { ...sections[index], [field]: val };
    setData((prev) => ({
      ...prev,
      [page]: { ...prev[page], sections },
    }));
  };

  const addSection = (page: 'terms' | 'privacy' | 'cookie') => {
    const newSec = {
      id: `${page}-${Date.now()}`,
      title: `${data[page].sections.length + 1}. New Policy Clause`,
      content: 'Enter clause text...',
    };
    setData((prev) => ({
      ...prev,
      [page]: { ...prev[page], sections: [...prev[page].sections, newSec] },
    }));
  };

  const removeSection = (page: 'terms' | 'privacy' | 'cookie', index: number) => {
    const sections = data[page].sections.filter((_, i) => i !== index);
    setData((prev) => ({
      ...prev,
      [page]: { ...prev[page], sections },
    }));
  };

  return (
    <div className="space-y-6 text-[#1A130E]">
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 text-[#1A130E]">
            <span>Dynamic CMS Policy & Content Editor</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Live Sync
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Modify Terms & Conditions, Privacy Policy, Cookie Policy and FAQs in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {notice && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{notice}</span>}
          <button
            onClick={handleSave}
            className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer border transition-colors ${
            activeTab === 'terms'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white border-transparent shadow-xs'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Terms & Conditions</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer border transition-colors ${
            activeTab === 'privacy'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white border-transparent shadow-xs'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy Policy</span>
        </button>

        <button
          onClick={() => setActiveTab('cookie')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer border transition-colors ${
            activeTab === 'cookie'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white border-transparent shadow-xs'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Cookie className="w-3.5 h-3.5" />
          <span>Cookie Policy</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer border transition-colors ${
            activeTab === 'faq'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white border-transparent shadow-xs'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FAQ Questions</span>
        </button>
      </div>

      {/* Editor Body */}
      {(activeTab === 'terms' || activeTab === 'privacy' || activeTab === 'cookie') && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-4 border-b border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Title</label>
              <input
                type="text"
                value={data[activeTab].title}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    [activeTab]: { ...prev[activeTab], title: e.target.value },
                  }))
                }
                className="w-full h-9 px-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-lg text-xs text-[#1A130E] outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={data[activeTab].subtitle}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    [activeTab]: { ...prev[activeTab], subtitle: e.target.value },
                  }))
                }
                className="w-full h-9 px-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-lg text-xs text-[#1A130E] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Last Updated Stamp</label>
              <input
                type="text"
                value={data[activeTab].lastUpdated}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    [activeTab]: { ...prev[activeTab], lastUpdated: e.target.value },
                  }))
                }
                className="w-full h-9 px-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-lg text-xs text-[#1A130E] outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#1A130E]">Sections & Clauses</h3>
              <button
                type="button"
                onClick={() => addSection(activeTab)}
                className="h-8 px-3 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#B84A22] text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-orange-200/60 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Section</span>
              </button>
            </div>

            {data[activeTab].sections.map((sec, idx) => (
              <div key={sec.id || idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => updateSection(activeTab, idx, 'title', e.target.value)}
                    className="flex-1 h-8 px-3 bg-white border border-stone-200 focus:border-[#B84A22] rounded-lg text-xs font-bold text-[#1A130E] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeSection(activeTab, idx)}
                    className="w-8 h-8 rounded-lg border border-stone-200 hover:border-rose-500 hover:text-rose-600 text-stone-400 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={sec.content}
                  onChange={(e) => updateSection(activeTab, idx, 'content', e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-200 focus:border-[#B84A22] rounded-lg text-xs text-stone-700 outline-none leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-[#1A130E]">FAQ List</h3>
          {data.faq.items.map((item, idx) => (
            <div key={item.id || idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
              <input
                type="text"
                value={item.question}
                onChange={(e) => {
                  const items = [...data.faq.items];
                  items[idx] = { ...items[idx], question: e.target.value };
                  setData((prev) => ({ ...prev, faq: { ...prev.faq, items } }));
                }}
                className="w-full h-8 px-3 bg-white border border-stone-200 rounded-lg text-xs font-bold text-[#1A130E] outline-none focus:border-[#B84A22]"
              />
              <textarea
                rows={2}
                value={item.answer}
                onChange={(e) => {
                  const items = [...data.faq.items];
                  items[idx] = { ...items[idx], answer: e.target.value };
                  setData((prev) => ({ ...prev, faq: { ...prev.faq, items } }));
                }}
                className="w-full p-2.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-700 outline-none focus:border-[#B84A22]"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CmsPage;
