import React, { useState, useRef } from 'react';
import {
  FileText,
  Shield,
  Cookie,
  HelpCircle,
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
import { PolicyPreview } from '../../components/cms/PolicyPreview';

const CMS_STORAGE_KEY = 'amber_spice_cms_data';

export interface CmsSection {
  id: string;
  title: string;
  content: string;
}

export interface CmsPageData {
  title: string;
  subtitle: string;
  lastUpdated: string;
  content: string;
  sections?: CmsSection[];
}

export interface CmsFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface CmsData {
  terms: CmsPageData;
  privacy: CmsPageData;
  cookie: CmsPageData;
  faq: {
    title: string;
    subtitle: string;
    items: CmsFaqItem[];
  };
}

const DEFAULT_TERMS_TEXT = `## 1. Agreement to Terms
By accessing our website or placing an online order for delivery or collection, you agree to be bound by these Terms & Conditions. If you disagree with any portion of these terms, please refrain from utilizing our online ordering platform.

---

## 2. Pricing, VAT & Payment
All menu prices are listed in Euros (€) and are inclusive of standard Irish Value Added Tax (VAT). While we endeavor to ensure accurate pricing across the platform, we reserve the right to update prices, seasonal dishes, and special promotions without prior notice.

• Cash on delivery & collection accepted
• Major credit and debit cards (Visa, MasterCard, Apple Pay)
• Corporate accounts with VAT invoices on request

---

## 3. Fulfillment, Delivery & Collections
Estimated delivery times (~30-35 mins) and collection preparation times (~15-20 mins) are approximate and may vary due to peak hours, kitchen volume, or inclement weather in Dublin. Customers are responsible for providing complete and accurate Dublin addresses, Eircodes, and contact numbers.

---

## 4. Cancellations & Refunds
Orders can be modified or cancelled within 5 minutes of placement by phoning our kitchen directly at +353 (01) 485 9210. Once an order has entered "preparing" status in our kitchen, cancellations or refunds cannot be guaranteed.

---

## 5. Allergens & Special Dietary Requests
We take food safety and allergen management with extreme seriousness. However, as our dishes are handcrafted in an active kitchen that handles dairy, nuts, and gluten, cross-contact is possible.

> **Important Allergy Advisory**: Please inform our team of severe allergies prior to placing your order.`;

const DEFAULT_PRIVACY_TEXT = `## 1. Information We Collect
When you place an order, create an account, or book a table, we collect your name, phone number, email address, delivery address, and Eircode.

• Identity Information: Full name and contact telephone
• Location Information: Dublin delivery street address and Eircode
• Transaction Records: Ordered items, payment confirmations, and special chef notes

---

## 2. How We Use Your Data
Your personal data is strictly utilized to process, cook, dispatch, and track your food orders, send receipt SMS/email confirmations, and manage table reservations under GDPR compliance.

---

## 3. Data Protection & Security
We employ industry-standard encryption protocols. We never sell, rent, or trade your personal data with third-party advertising brokers.`;

const DEFAULT_COOKIE_TEXT = `## 1. What Are Cookies?
Cookies and browser storage are small data files saved on your device to keep your shopping cart intact, remember delivery addresses, and ensure seamless order tracking.

---

## 2. Cookies We Utilize
• **Essential Session Cookies**: Retains dishes in your shopping cart during navigation
• **Preferences Storage**: Remembers your preferred order fulfillment method (Delivery vs Collection)
• **KDS & Tracking Sync**: Real-time order progress updates between kitchen and diner`;

const DEFAULT_DATA: CmsData = {
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Customer terms and conditions for ordering, delivery, and dining services.',
    lastUpdated: 'October 2026',
    content: DEFAULT_TERMS_TEXT,
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How Amber Spice protects and handles your personal ordering and payment information under GDPR.',
    lastUpdated: 'October 2026',
    content: DEFAULT_PRIVACY_TEXT,
  },
  cookie: {
    title: 'Cookie Policy',
    subtitle: 'Transparency regarding cookies and local storage utilized to ensure seamless ordering and tracking.',
    lastUpdated: 'October 2026',
    content: DEFAULT_COOKIE_TEXT,
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
      {
        id: 'faq-2',
        category: 'Ordering & Delivery',
        question: 'What is your delivery radius in Dublin?',
        answer:
          'We deliver across Dublin 1, Dublin 2, Dublin 4, Dublin 6, Dublin 8 and surrounding areas within a 6km radius.',
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
        terms: {
          ...DEFAULT_DATA.terms,
          ...(parsed.terms || {}),
          content: parsed.terms?.content || (parsed.terms?.sections ? parsed.terms.sections.map((s: any) => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n') : DEFAULT_TERMS_TEXT),
        },
        privacy: {
          ...DEFAULT_DATA.privacy,
          ...(parsed.privacy || {}),
          content: parsed.privacy?.content || (parsed.privacy?.sections ? parsed.privacy.sections.map((s: any) => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n') : DEFAULT_PRIVACY_TEXT),
        },
        cookie: {
          ...DEFAULT_DATA.cookie,
          ...(parsed.cookie || {}),
          content: parsed.cookie?.content || (parsed.cookie?.sections ? parsed.cookie.sections.map((s: any) => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n') : DEFAULT_COOKIE_TEXT),
        },
        faq: { ...DEFAULT_DATA.faq, ...(parsed.faq || {}) },
      };
    }
  } catch {
    // fallback
  }
  return DEFAULT_DATA;
};

// Helper: parse content back into sections for backwards-compatible consumers
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

export function CmsPage() {
  const [data, setData] = useState<CmsData>(() => getStoredCms());
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'cookie' | 'faq'>('terms');
  const [notice, setNotice] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      try {
        const autoStamp = new Date().toLocaleDateString('en-IE', { month: 'long', year: 'numeric' });
        const updatedData: CmsData = {
          ...data,
          terms: {
            ...data.terms,
            lastUpdated: autoStamp,
            sections: contentToSections(data.terms.content),
          },
          privacy: {
            ...data.privacy,
            lastUpdated: autoStamp,
            sections: contentToSections(data.privacy.content),
          },
          cookie: {
            ...data.cookie,
            lastUpdated: autoStamp,
            sections: contentToSections(data.cookie.content),
          },
        };
        setData(updatedData);

        const existing = localStorage.getItem(CMS_STORAGE_KEY);
        const parsed = existing ? JSON.parse(existing) : {};
        const merged = { ...parsed, ...updatedData };
        localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new Event('amber_spice_cms_updated'));
        setNotice('✓ Published to live website with auto-timestamp!');
        setTimeout(() => setNotice(null), 3500);
      } catch {
        // ignore
      }
    }
  };

  const insertFormatting = (prefix: string, suffix: string = '', placeholder: string = '') => {
    if (activeTab === 'faq') return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = data[activeTab].content || '';
    const selectedText = text.substring(start, end);
    const replacement = selectedText ? `${prefix}${selectedText}${suffix}` : `${prefix}${placeholder}${suffix}`;

    const nextVal = text.substring(0, start) + replacement + text.substring(end);
    setData((prev) => ({
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

  // Current page word count & character count
  const currentContent = activeTab !== 'faq' ? data[activeTab].content || '' : '';
  const wordCount = currentContent.trim() ? currentContent.trim().split(/\s+/).length : 0;
  const charCount = currentContent.length;

  return (
    <div className="space-y-6 text-[#1A130E]">
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#1A130E]">
            Content Management System
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage website policies, legal documentation, and customer FAQs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {notice && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {notice}
            </span>
          )}
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
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('terms');
            setEditorMode('edit');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer border transition-colors whitespace-nowrap ${
            activeTab === 'terms'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white border-transparent shadow-xs'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Terms &amp; Conditions</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('privacy');
            setEditorMode('edit');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer border transition-colors whitespace-nowrap ${
            activeTab === 'privacy'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white border-transparent shadow-xs'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy Policy</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('cookie');
            setEditorMode('edit');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer border transition-colors whitespace-nowrap ${
            activeTab === 'cookie'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white border-transparent shadow-xs'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Cookie className="w-3.5 h-3.5" />
          <span>Cookie Policy</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('faq');
            setEditorMode('edit');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer border transition-colors whitespace-nowrap ${
            activeTab === 'faq'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white border-transparent shadow-xs'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FAQ Questions ({data.faq.items.length})</span>
        </button>
      </div>

      {/* ================= SINGLE-BOX RICH TEXT EDITOR FOR TERMS, PRIVACY, COOKIE ================= */}
      {(activeTab === 'terms' || activeTab === 'privacy' || activeTab === 'cookie') && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          {/* Title & Subtitle in Clean 2-Column Row (No Last Update Input - Handled Automatically) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Document Title</label>
              <input
                type="text"
                value={data[activeTab].title}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    [activeTab]: { ...prev[activeTab], title: e.target.value },
                  }))
                }
                className="w-full h-9 px-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-lg text-xs text-[#1A130E] outline-none font-bold transition-all"
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
                className="w-full h-9 px-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-lg text-xs text-[#1A130E] outline-none transition-all"
              />
            </div>
          </div>

          {/* Single Box Editor with Rich Toolbar on Top */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs font-bold text-[#1A130E] uppercase tracking-wider">
                Full Policy Content &amp; Clauses
              </span>

              {/* Edit / Preview Segmented Switcher */}
              <div className="inline-flex items-center gap-1 bg-stone-100/90 p-0.5 rounded-lg border border-stone-200/70 text-xs">
                <button
                  type="button"
                  onClick={() => setEditorMode('edit')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    editorMode === 'edit'
                      ? 'bg-white text-stone-900 shadow-2xs font-bold'
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
                      ? 'bg-white text-stone-900 shadow-2xs font-bold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Customer Preview</span>
                </button>
              </div>
            </div>

            {/* Rich Text Editor Frame */}
            <div className="border border-stone-200 rounded-xl overflow-hidden shadow-2xs focus-within:border-[#B84A22] transition-colors">
              {/* Rich Text Toolbar on Top */}
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
                  <Heading2 className="w-3.5 h-3.5 text-[#B84A22]" />
                  <span>H2</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('\n### ', '\n', 'Sub-clause')}
                  title="Heading 3 (### Sub-title)"
                  className="p-1.5 hover:bg-stone-200/70 hover:text-stone-900 rounded-md transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                >
                  <Heading3 className="w-3.5 h-3.5 text-[#B84A22]" />
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

              {/* Single Content Area: Either Textarea (Edit) or Rendered Preview */}
              {editorMode === 'edit' ? (
                <textarea
                  ref={textareaRef}
                  rows={16}
                  value={data[activeTab].content}
                  onChange={(e) => {
                    const nextVal = e.target.value;
                    setData((prev) => ({
                      ...prev,
                      [activeTab]: { ...prev[activeTab], content: nextVal },
                    }));
                  }}
                  placeholder="Write your entire policy, terms, clauses, bullet points and notices in this single box..."
                  className="w-full p-4 bg-white text-xs sm:text-[13.5px] text-[#1A130E] leading-relaxed font-sans outline-none resize-y min-h-[380px]"
                />
              ) : (
                <div className="p-5 bg-white min-h-[380px] overflow-y-auto">
                  <div className="max-w-2xl">
                    <div className="pb-3 mb-4 border-b border-stone-100">
                      <h3 className="text-base font-bold text-[#1A130E]">{data[activeTab].title}</h3>
                      <p className="text-xs text-stone-500 mt-0.5">{data[activeTab].subtitle}</p>
                    </div>
                    <PolicyPreview content={data[activeTab].content} />
                  </div>
                </div>
              )}

              {/* Editor Footer Status Bar */}
              <div className="bg-stone-50/80 px-4 py-2 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span>{wordCount} words</span>
                  <span>·</span>
                  <span>{charCount} characters</span>
                </div>
                <div className="text-[11px] text-stone-400 font-medium">
                  Auto-stamped on publish: <strong>{data[activeTab].lastUpdated || 'Current Month'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= FAQ TAB: QUESTION LIST WITH ADD, EDIT & DELETE ================= */}
      {activeTab === 'faq' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-sm text-[#1A130E]">Frequently Asked Questions</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Add, edit, or remove customer Q&amp;A cards shown on the website FAQ page.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newItem: CmsFaqItem = {
                  id: `faq-${Date.now()}`,
                  category: 'General',
                  question: 'New Question Title?',
                  answer: 'Enter answer details here...',
                };
                setData((prev) => ({
                  ...prev,
                  faq: { ...prev.faq, items: [...prev.faq.items, newItem] },
                }));
              }}
              className="h-8 px-3.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#B84A22] text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-orange-200/60 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.faq.items.map((item, idx) => (
              <div key={item.id || idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs font-bold text-stone-400">Q{idx + 1}</span>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => {
                        const items = [...data.faq.items];
                        items[idx] = { ...items[idx], question: e.target.value };
                        setData((prev) => ({ ...prev, faq: { ...prev.faq, items } }));
                      }}
                      placeholder="e.g. Do you offer gluten-free options?"
                      className="flex-1 h-8 px-3 bg-white border border-stone-200 rounded-lg text-xs font-bold text-[#1A130E] outline-none focus:border-[#B84A22] transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const items = data.faq.items.filter((_, i) => i !== idx);
                      setData((prev) => ({ ...prev, faq: { ...prev.faq, items } }));
                    }}
                    title="Delete FAQ"
                    className="w-8 h-8 rounded-lg border border-stone-200 hover:border-rose-500 hover:text-rose-600 text-stone-400 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={item.answer}
                  onChange={(e) => {
                    const items = [...data.faq.items];
                    items[idx] = { ...items[idx], answer: e.target.value };
                    setData((prev) => ({ ...prev, faq: { ...prev.faq, items } }));
                  }}
                  placeholder="Enter detailed response..."
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-700 outline-none focus:border-[#B84A22] leading-relaxed transition-colors"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CmsPage;
