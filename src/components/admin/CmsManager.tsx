'use client';

import React, { useState } from 'react';
import {
  getFullCmsData,
  saveFullCmsData,
  CmsDatabase,
  CmsPageData,
  CmsFaqItem,
} from '@/services/cmsService';
import {
  FileText,
  Shield,
  Cookie,
  Info,
  HelpCircle,
  Store,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
} from 'lucide-react';

type CmsTab = 'terms' | 'privacy' | 'cookie' | 'about' | 'faq' | 'storeInfo';

export const CmsManager: React.FC = () => {
  const [cmsData, setCmsData] = useState<CmsDatabase>(() => getFullCmsData());
  const [activeTab, setActiveTab] = useState<CmsTab>('terms');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const handleSave = () => {
    saveFullCmsData(cmsData);
    setSaveSuccessNotice('✓ Changes successfully published to live website!');
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  // Handlers for Standard Policy Pages (terms, privacy, cookie)
  const updatePolicyField = (
    page: 'terms' | 'privacy' | 'cookie',
    field: keyof CmsPageData,
    value: any
  ) => {
    setCmsData((prev) => ({
      ...prev,
      [page]: {
        ...prev[page],
        [field]: value,
      },
    }));
  };

  const updatePolicySection = (
    page: 'terms' | 'privacy' | 'cookie',
    index: number,
    field: 'title' | 'content',
    value: string
  ) => {
    const updatedSections = [...cmsData[page].sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value,
    };
    updatePolicyField(page, 'sections', updatedSections);
  };

  const addPolicySection = (page: 'terms' | 'privacy' | 'cookie') => {
    const newSection = {
      id: `${page}-sec-${Date.now()}`,
      title: `${cmsData[page].sections.length + 1}. New Clause Heading`,
      content: 'Enter the policy clause details here...',
    };
    updatePolicyField(page, 'sections', [...cmsData[page].sections, newSection]);
  };

  const removePolicySection = (page: 'terms' | 'privacy' | 'cookie', index: number) => {
    if (cmsData[page].sections.length <= 1) {
      alert('A policy page must contain at least one section.');
      return;
    }
    const updated = cmsData[page].sections.filter((_, i) => i !== index);
    updatePolicyField(page, 'sections', updated);
  };

  // Handlers for FAQ
  const updateFaqItem = (index: number, field: keyof CmsFaqItem, value: string) => {
    const items = [...cmsData.faq.items];
    items[index] = { ...items[index], [field]: value };
    setCmsData((prev) => ({
      ...prev,
      faq: { ...prev.faq, items },
    }));
  };

  const addFaqItem = () => {
    const newItem: CmsFaqItem = {
      id: `faq-${Date.now()}`,
      category: 'General',
      question: 'New Question Title?',
      answer: 'Detailed response for customers...',
    };
    setCmsData((prev) => ({
      ...prev,
      faq: { ...prev.faq, items: [...prev.faq.items, newItem] },
    }));
  };

  const removeFaqItem = (index: number) => {
    const items = cmsData.faq.items.filter((_, i) => i !== index);
    setCmsData((prev) => ({
      ...prev,
      faq: { ...prev.faq, items },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#1A130E] flex items-center gap-2">
            <span>Dynamic CMS & Policy Page Manager</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              Live Sync
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Instantly edit and update Terms & Conditions, Privacy Policy, Cookie Policy, About story, and FAQs without touching code.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {saveSuccessNotice && (
            <span className="text-xs font-bold text-emerald-600 animate-in fade-in flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saveSuccessNotice}
            </span>
          )}
          <button
            onClick={handleSave}
            className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#F15A24] to-[#FBA138] hover:from-[#d94e1c] hover:to-[#e89228] text-white text-xs font-bold shadow-md shadow-[#F15A24]/20 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'terms'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileText className={`w-3.5 h-3.5 ${activeTab === 'terms' ? 'text-white' : 'text-[#F15A24]'}`} />
          <span>Terms & Conditions</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          <Shield className={`w-3.5 h-3.5 ${activeTab === 'privacy' ? 'text-white' : 'text-emerald-500'}`} />
          <span>Privacy Policy</span>
        </button>

        <button
          onClick={() => setActiveTab('cookie')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'cookie'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          <Cookie className={`w-3.5 h-3.5 ${activeTab === 'cookie' ? 'text-white' : 'text-amber-500'}`} />
          <span>Cookie Policy</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'about'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          <Info className={`w-3.5 h-3.5 ${activeTab === 'about' ? 'text-white' : 'text-blue-500'}`} />
          <span>About Page Story</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'faq'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          <HelpCircle className={`w-3.5 h-3.5 ${activeTab === 'faq' ? 'text-white' : 'text-purple-500'}`} />
          <span>FAQ Questions ({cmsData.faq.items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('storeInfo')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'storeInfo'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          <Store className={`w-3.5 h-3.5 ${activeTab === 'storeInfo' ? 'text-white' : 'text-orange-500'}`} />
          <span>Store & Contact Info</span>
        </button>
      </div>

      {/* ================= TAB 1, 2, 3: TERMS / PRIVACY / COOKIE ================= */}
      {(activeTab === 'terms' || activeTab === 'privacy' || activeTab === 'cookie') && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-5 border-b border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Page Title</label>
              <input
                type="text"
                value={cmsData[activeTab].title}
                onChange={(e) => updatePolicyField(activeTab, 'title', e.target.value)}
                className="w-full h-10 px-3 bg-stone-50 border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={cmsData[activeTab].subtitle}
                onChange={(e) => updatePolicyField(activeTab, 'subtitle', e.target.value)}
                className="w-full h-10 px-3 bg-stone-50 border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Last Updated Stamp</label>
              <input
                type="text"
                value={cmsData[activeTab].lastUpdated}
                onChange={(e) => updatePolicyField(activeTab, 'lastUpdated', e.target.value)}
                className="w-full h-10 px-3 bg-stone-50 border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none"
              />
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#1A130E]">
                Policy Clauses & Sections ({cmsData[activeTab].sections.length})
              </h3>
              <button
                type="button"
                onClick={() => addPolicySection(activeTab)}
                className="h-8 px-3 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#F15A24] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Section</span>
              </button>
            </div>

            {cmsData[activeTab].sections.map((sec, idx) => (
              <div
                key={sec.id || idx}
                className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/50 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => updatePolicySection(activeTab, idx, 'title', e.target.value)}
                    className="flex-1 h-9 px-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-lg text-xs font-bold text-[#1A130E] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removePolicySection(activeTab, idx)}
                    className="w-8 h-8 rounded-lg border border-stone-200 hover:border-rose-400 hover:text-rose-600 text-stone-400 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                    title="Delete section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={sec.content}
                  onChange={(e) => updatePolicySection(activeTab, idx, 'content', e.target.value)}
                  className="w-full p-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-lg text-xs text-stone-700 leading-relaxed outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: ABOUT PAGE STORY ================= */}
      {activeTab === 'about' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          <h3 className="font-bold text-sm text-[#1A130E]">About Us Page Story & Heritage</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Hero Title</label>
              <input
                type="text"
                value={cmsData.about.heroTitle}
                onChange={(e) =>
                  setCmsData((prev) => ({
                    ...prev,
                    about: { ...prev.about, heroTitle: e.target.value },
                  }))
                }
                className="w-full h-10 px-3 bg-stone-50 border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Story Heading</label>
              <input
                type="text"
                value={cmsData.about.storyTitle}
                onChange={(e) =>
                  setCmsData((prev) => ({
                    ...prev,
                    about: { ...prev.about, storyTitle: e.target.value },
                  }))
                }
                className="w-full h-10 px-3 bg-stone-50 border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Story Paragraph 1</label>
            <textarea
              rows={3}
              value={cmsData.about.storyParagraph1}
              onChange={(e) =>
                setCmsData((prev) => ({
                  ...prev,
                  about: { ...prev.about, storyParagraph1: e.target.value },
                }))
              }
              className="w-full p-3 bg-stone-50 border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-700 outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Story Paragraph 2</label>
            <textarea
              rows={3}
              value={cmsData.about.storyParagraph2}
              onChange={(e) =>
                setCmsData((prev) => ({
                  ...prev,
                  about: { ...prev.about, storyParagraph2: e.target.value },
                }))
              }
              className="w-full p-3 bg-stone-50 border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-700 outline-none leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* ================= TAB 5: FAQ ================= */}
      {activeTab === 'faq' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-sm text-[#1A130E]">Frequently Asked Questions</h3>
              <p className="text-xs text-stone-500">Edit customer answers on delivery, halal standards and catering.</p>
            </div>
            <button
              type="button"
              onClick={addFaqItem}
              className="h-8 px-3 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#F15A24] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {cmsData.faq.items.map((item, idx) => (
              <div key={item.id || idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="w-48">
                    <input
                      type="text"
                      placeholder="Category (e.g. Delivery)"
                      value={item.category}
                      onChange={(e) => updateFaqItem(idx, 'category', e.target.value)}
                      className="w-full h-8 px-2.5 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-[#F15A24] outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Question..."
                    value={item.question}
                    onChange={(e) => updateFaqItem(idx, 'question', e.target.value)}
                    className="flex-1 h-8 px-3 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeFaqItem(idx)}
                    className="w-8 h-8 rounded-lg border border-stone-200 hover:border-rose-400 hover:text-rose-600 text-stone-400 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  placeholder="Answer..."
                  value={item.answer}
                  onChange={(e) => updateFaqItem(idx, 'answer', e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-700 outline-none leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 6: STORE & RESTAURANT INFO ================= */}
      {activeTab === 'storeInfo' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#1A130E]">Restaurant Brand & Dublin Contact Info</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Restaurant Name</label>
              <input
                type="text"
                value={cmsData.storeInfo.name}
                onChange={(e) =>
                  setCmsData((prev) => ({
                    ...prev,
                    storeInfo: { ...prev.storeInfo, name: e.target.value },
                  }))
                }
                className="w-full h-10 px-3 bg-stone-50 border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={cmsData.storeInfo.phone}
                onChange={(e) =>
                  setCmsData((prev) => ({
                    ...prev,
                    storeInfo: { ...prev.storeInfo, phone: e.target.value },
                  }))
                }
                className="w-full h-10 px-3 bg-stone-50 border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Support Email</label>
              <input
                type="text"
                value={cmsData.storeInfo.email}
                onChange={(e) =>
                  setCmsData((prev) => ({
                    ...prev,
                    storeInfo: { ...prev.storeInfo, email: e.target.value },
                  }))
                }
                className="w-full h-10 px-3 bg-stone-50 border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Dublin Address & Eircode</label>
              <input
                type="text"
                value={`${cmsData.storeInfo.address}, ${cmsData.storeInfo.eircode}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  const addr = parts[0]?.trim() || '';
                  const eircode = parts[1]?.trim() || '';
                  setCmsData((prev) => ({
                    ...prev,
                    storeInfo: { ...prev.storeInfo, address: addr, eircode },
                  }));
                }}
                className="w-full h-10 px-3 bg-stone-50 border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Opening Hours</label>
              <input
                type="text"
                value={cmsData.storeInfo.openingHours}
                onChange={(e) =>
                  setCmsData((prev) => ({
                    ...prev,
                    storeInfo: { ...prev.storeInfo, openingHours: e.target.value },
                  }))
                }
                className="w-full h-10 px-3 bg-stone-50 border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Announcement Banner (Promo Strip)
              </label>
              <input
                type="text"
                value={cmsData.storeInfo.announcementBanner || ''}
                onChange={(e) =>
                  setCmsData((prev) => ({
                    ...prev,
                    storeInfo: { ...prev.storeInfo, announcementBanner: e.target.value },
                  }))
                }
                className="w-full h-10 px-3 bg-stone-50 border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none font-medium"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
