'use client';

import React, { useState, useRef } from 'react';
import {
  getFullCmsData,
  saveFullCmsData,
  CmsDatabase,
  CmsPageData,
  CmsFaqItem,
  CmsSection,
} from '@/services/cmsService';
import { PolicyContentRenderer } from '@/components/shared/PolicyContentRenderer';
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
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Eye,
  Edit3,
} from 'lucide-react';

type CmsTab = 'terms' | 'privacy' | 'cookie' | 'about' | 'faq' | 'storeInfo';

// Helper: parse single-box markdown content into structured clauses for backwards-compatibility
const contentToSections = (content: string): CmsSection[] => {
  const parts = content.split(/\n(?=##\s+)/);
  if (parts.length === 0 || (parts.length === 1 && !parts[0].trim())) {
    return [{ id: 'sec-1', title: 'Terms & Conditions', content: content.trim() }];
  }
  return parts.map((part, idx) => {
    const lines = part.trim().split('\n');
    const headerMatch = lines[0].match(/^##\s+(.*)/);
    const title = headerMatch ? headerMatch[1].trim() : `${idx + 1}. Clause`;
    const body = headerMatch ? lines.slice(1).join('\n').trim() : part.trim();
    return {
      id: `sec-${idx + 1}`,
      title,
      content: body.replace(/^---\n*/, '').trim(),
    };
  });
};

export const CmsManager: React.FC = () => {
  const [cmsData, setCmsData] = useState<CmsDatabase>(() => getFullCmsData());
  const [activeTab, setActiveTab] = useState<CmsTab>('terms');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    const autoStamp = new Date().toLocaleDateString('en-IE', { month: 'long', year: 'numeric' });
    const updatedData: CmsDatabase = {
      ...cmsData,
      terms: {
        ...cmsData.terms,
        lastUpdated: autoStamp,
        content: cmsData.terms.content || '',
        sections: contentToSections(cmsData.terms.content || ''),
      },
      privacy: {
        ...cmsData.privacy,
        lastUpdated: autoStamp,
        content: cmsData.privacy.content || '',
        sections: contentToSections(cmsData.privacy.content || ''),
      },
      cookie: {
        ...cmsData.cookie,
        lastUpdated: autoStamp,
        content: cmsData.cookie.content || '',
        sections: contentToSections(cmsData.cookie.content || ''),
      },
    };
    setCmsData(updatedData);
    saveFullCmsData(updatedData);
    setSaveSuccessNotice('✓ Published with auto-timestamp!');
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

  const insertFormatting = (prefix: string, suffix: string = '', placeholder: string = '') => {
    if (activeTab !== 'terms' && activeTab !== 'privacy' && activeTab !== 'cookie') return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = cmsData[activeTab].content || '';
    const selectedText = text.substring(start, end);
    const replacement = selectedText ? `${prefix}${selectedText}${suffix}` : `${prefix}${placeholder}${suffix}`;

    const nextVal = text.substring(0, start) + replacement + text.substring(end);
    setCmsData((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], content: nextVal },
    }));

    setTimeout(() => {
      textarea.focus();
      const cursorStart = start + prefix.length;
      const cursorEnd = cursorStart + (selectedText ? selectedText.length : placeholder.length);
      textarea.setSelectionRange(cursorStart, cursorEnd);
    }, 15);
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

  const isPolicyTab = activeTab === 'terms' || activeTab === 'privacy' || activeTab === 'cookie';
  const policyContent = isPolicyTab ? cmsData[activeTab].content || '' : '';
  const policyWordCount = policyContent.trim() ? policyContent.trim().split(/\s+/).length : 0;
  const policyCharCount = policyContent.length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#1A130E]">
            Content Management System
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage website policies, legal documentation, and customer FAQs.
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
            className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#F15A24] to-[#FBA138] hover:from-[#d94e1c] hover:to-[#e89228] text-white text-xs font-bold shadow-md shadow-[#F15A24]/20 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('terms');
            setEditorMode('edit');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'terms'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileText className={`w-3.5 h-3.5 ${activeTab === 'terms' ? 'text-white' : 'text-[#F15A24]'}`} />
          <span>Terms &amp; Conditions</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('privacy');
            setEditorMode('edit');
          }}
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
          onClick={() => {
            setActiveTab('cookie');
            setEditorMode('edit');
          }}
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
          onClick={() => {
            setActiveTab('about');
            setEditorMode('edit');
          }}
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
          onClick={() => {
            setActiveTab('faq');
            setEditorMode('edit');
          }}
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
          onClick={() => {
            setActiveTab('storeInfo');
            setEditorMode('edit');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'storeInfo'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          <Store className={`w-3.5 h-3.5 ${activeTab === 'storeInfo' ? 'text-white' : 'text-orange-500'}`} />
          <span>Store &amp; Contact Info</span>
        </button>
      </div>

      {/* ================= TAB 1, 2, 3: SINGLE-BOX RICH TEXT EDITOR FOR TERMS / PRIVACY / COOKIE ================= */}
      {isPolicyTab && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          {/* Header 2-Column Row (No Last Updated Stamp Input - Auto Stamped) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Page Title</label>
              <input
                type="text"
                value={cmsData[activeTab].title}
                onChange={(e) => updatePolicyField(activeTab, 'title', e.target.value)}
                className="w-full h-10 px-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none font-bold transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={cmsData[activeTab].subtitle}
                onChange={(e) => updatePolicyField(activeTab, 'subtitle', e.target.value)}
                className="w-full h-10 px-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none transition-all"
              />
            </div>
          </div>

          {/* Single Box Editor with Rich Toolbar on Top */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs font-bold text-[#1A130E] uppercase tracking-wider">
                Full Policy Content &amp; Clauses
              </span>

              {/* Edit / Customer Preview Switcher */}
              <div className="inline-flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200/80 text-xs">
                <button
                  type="button"
                  onClick={() => setEditorMode('edit')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    editorMode === 'edit'
                      ? 'bg-white text-stone-900 shadow-xs font-bold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('preview')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    editorMode === 'preview'
                      ? 'bg-white text-stone-900 shadow-xs font-bold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Customer Preview</span>
                </button>
              </div>
            </div>

            {/* Rich Text Editor Frame */}
            <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs focus-within:border-[#F15A24] transition-colors">
              {/* Toolbar */}
              <div className="bg-stone-50 px-3 py-2 border-b border-stone-200 flex items-center gap-1 sm:gap-1.5 flex-wrap text-stone-600">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**', 'bold text')}
                  title="Bold (**text**)"
                  className="p-1.5 hover:bg-stone-200/70 hover:text-stone-900 rounded-md transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                >
                  <Bold className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Bold</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*', 'italic text')}
                  title="Italic (*text*)"
                  className="p-1.5 hover:bg-stone-200/70 hover:text-stone-900 rounded-md transition-colors cursor-pointer text-xs flex items-center gap-1"
                >
                  <Italic className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Italic</span>
                </button>

                <div className="w-[1px] h-4 bg-stone-300 mx-0.5" />

                <button
                  type="button"
                  onClick={() => insertFormatting('\n## ', '\n', 'Clause Heading')}
                  title="Heading 2 (## Title)"
                  className="p-1.5 hover:bg-stone-200/70 hover:text-stone-900 rounded-md transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                >
                  <Heading2 className="w-3.5 h-3.5 text-[#F15A24]" />
                  <span>H2</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('\n### ', '\n', 'Sub-clause')}
                  title="Heading 3 (### Sub-title)"
                  className="p-1.5 hover:bg-stone-200/70 hover:text-stone-900 rounded-md transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                >
                  <Heading3 className="w-3.5 h-3.5 text-[#F15A24]" />
                  <span>H3</span>
                </button>

                <div className="w-[1px] h-4 bg-stone-300 mx-0.5" />

                <button
                  type="button"
                  onClick={() => insertFormatting('\n• ', '\n', 'Bullet point item')}
                  title="Bullet List (• item)"
                  className="p-1.5 hover:bg-stone-200/70 hover:text-stone-900 rounded-md transition-colors cursor-pointer text-xs flex items-center gap-1"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Bullet List</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('\n1. ', '\n', 'Numbered step item')}
                  title="Numbered List (1. item)"
                  className="p-1.5 hover:bg-stone-200/70 hover:text-stone-900 rounded-md transition-colors cursor-pointer text-xs flex items-center gap-1"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Numbered</span>
                </button>

                <div className="w-[1px] h-4 bg-stone-300 mx-0.5" />

                <button
                  type="button"
                  onClick={() => insertFormatting('\n> ', '\n', 'Important policy callout or legal warning')}
                  title="Blockquote (> quote)"
                  className="p-1.5 hover:bg-stone-200/70 hover:text-stone-900 rounded-md transition-colors cursor-pointer text-xs flex items-center gap-1"
                >
                  <Quote className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Quote</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('\n\n---\n\n', '', '')}
                  title="Horizontal Divider (---)"
                  className="p-1.5 hover:bg-stone-200/70 hover:text-stone-900 rounded-md transition-colors cursor-pointer text-xs flex items-center gap-1"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Divider</span>
                </button>
              </div>

              {/* Single Box Editor or Live Preview */}
              {editorMode === 'edit' ? (
                <textarea
                  ref={textareaRef}
                  rows={16}
                  value={cmsData[activeTab].content || ''}
                  onChange={(e) => updatePolicyField(activeTab, 'content', e.target.value)}
                  placeholder="Write your entire policy, clauses, terms, bullet points, and notices in this single box..."
                  className="w-full p-4 bg-white text-xs sm:text-[13.5px] text-[#1A130E] leading-relaxed font-sans outline-none resize-y min-h-[380px]"
                />
              ) : (
                <div className="p-6 bg-white min-h-[380px] overflow-y-auto">
                  <div className="max-w-2xl">
                    <div className="pb-3 mb-4 border-b border-stone-100">
                      <h3 className="text-base font-bold text-[#1A130E]">{cmsData[activeTab].title}</h3>
                      <p className="text-xs text-stone-500 mt-0.5">{cmsData[activeTab].subtitle}</p>
                    </div>
                    <PolicyContentRenderer content={cmsData[activeTab].content || ''} />
                  </div>
                </div>
              )}

              {/* Status bar */}
              <div className="bg-stone-50/80 px-4 py-2 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span>{policyWordCount} words</span>
                  <span>•</span>
                  <span>{policyCharCount} characters</span>
                </div>
                <span className="text-stone-400">Timestamp automatically set on publish</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: ABOUT PAGE STORY ================= */}
      {activeTab === 'about' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          <h3 className="font-bold text-sm text-[#1A130E]">About Us Page Story &amp; Heritage</h3>

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

      {/* ================= TAB 5: FAQ (ONLY FAQ WITH QUESTION ITEMS, ADD, REMOVE, EDIT) ================= */}
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
                    title="Delete question"
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
          <h3 className="font-bold text-sm text-[#1A130E]">Restaurant Brand &amp; Dublin Contact Info</h3>

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
              <label className="block text-xs font-bold text-stone-700 mb-1">Dublin Address &amp; Eircode</label>
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
