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
  Image as ImageIcon,
  Phone,
  Share2,
  MapPin,
  Clock,
  ExternalLink,
  X,
  Sparkles,
  Upload,
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

export interface GalleryItem {
  id: number | string;
  title: string;
  category: 'interior' | 'exterior' | 'kitchen' | 'promotion' | 'dining' | 'private' | 'bar_kitchen';
  image: string;
  tag?: string;
  description?: string;
}

export interface DayOperatingHours {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  short: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface CmsStoreInfo {
  name: string;
  tagline: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  address: string;
  eircode: string;
  openingHours: string;
  hoursMonThu?: string;
  hoursFriSat?: string;
  hoursSun?: string;
  weeklySchedule?: DayOperatingHours[];
  minOrderDelivery: number;
  deliveryPrepTime: string;
  collectionPrepTime: string;
  announcementBanner?: string;
  isAnnouncementActive?: boolean;
}

export interface CmsSocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  tripadvisor?: string;
  googleMaps?: string;
  whatsapp?: string;
  phone?: string;
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
  storeInfo: CmsStoreInfo;
  social: CmsSocialLinks;
  gallery: GalleryItem[];
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
• **Session & Cart Persistence**: Necessary for the core operation of our ordering platform. These cookies retain the items in your food basket, your chosen Dublin delivery zone, and your authentication status.
• **Preferences & Customization**: Remembers your past delivery notes, spice preference defaults, and saved Dublin delivery addresses for quicker future checkouts.
• **Anonymous Traffic Analytics**: Helps us understand which heritage dishes are most popular and identify any slow-loading pages to continually enhance speed and responsiveness.
• **KDS & Kitchen Sync**: Real-time order progress updates between our kitchen pass and your live tracking screen.

---

## 3. Managing Cookie Preferences
Most modern web browsers allow you to manage or delete cookies via browser settings. You can choose to block third-party cookies or receive alerts when a cookie is placed. Please note that disabling strictly essential cookies may impact your ability to checkout online.

---

## 4. Questions Regarding Cookies
For further information regarding our cookie practices, please contact our team at orders@amberspice.ie.`;

export const DEFAULT_WEEKLY_SCHEDULE: DayOperatingHours[] = [
  { day: 'Monday', short: 'Mon', isOpen: true, openTime: '17:00', closeTime: '22:00' },
  { day: 'Tuesday', short: 'Tue', isOpen: true, openTime: '17:00', closeTime: '22:00' },
  { day: 'Wednesday', short: 'Wed', isOpen: true, openTime: '17:00', closeTime: '22:00' },
  { day: 'Thursday', short: 'Thu', isOpen: true, openTime: '17:00', closeTime: '22:00' },
  { day: 'Friday', short: 'Fri', isOpen: true, openTime: '16:30', closeTime: '22:30' },
  { day: 'Saturday', short: 'Sat', isOpen: true, openTime: '16:30', closeTime: '22:30' },
  { day: 'Sunday', short: 'Sun', isOpen: false, openTime: '16:00', closeTime: '21:30' },
];

const DEFAULT_STORE_INFO: CmsStoreInfo = {
  name: 'AMBER SPICE',
  tagline: 'Authentic Flavors · Timeless Recipes',
  phone: '+353 (01) 485 9210',
  secondaryPhone: '+353 (01) 485 9211',
  email: 'orders@amberspice.ie',
  address: '18 South William St, Dublin 2',
  eircode: 'D02 HR58',
  openingHours: 'Mon – Thu: 17:00 – 22:00, Fri – Sat: 16:30 – 22:30 (Sun: Closed)',
  hoursMonThu: '17:00 – 22:00',
  hoursFriSat: '16:30 – 22:30',
  hoursSun: 'Closed',
  weeklySchedule: DEFAULT_WEEKLY_SCHEDULE,
  minOrderDelivery: 15.0,
  deliveryPrepTime: '30-40 min',
  collectionPrepTime: '15-20 min',
  announcementBanner: '🌟 Weekend Royal Feast Offer: 10% OFF on all Dum Biryanis with code ROYAL10!',
  isAnnouncementActive: true,
};

const DEFAULT_SOCIAL_LINKS: CmsSocialLinks = {
  facebook: 'https://facebook.com/amberspicedublin',
  instagram: 'https://instagram.com/amberspicedublin',
  youtube: 'https://youtube.com/@amberspicedublin',
  tripadvisor: 'https://tripadvisor.com/Restaurant_Review-Dublin_Amber_Spice',
  googleMaps: 'https://maps.google.com/?q=Amber+Spice+18+South+William+St+Dublin',
  whatsapp: '+35314859210',
  phone: '+353 (01) 485 9210',
};

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: 'Main Heritage Dining Hall',
    category: 'interior',
    image: '/images/interior/main_dining_hall.jpg',
    tag: 'Historic Brick Arches',
    description: 'Exposed Georgian Dublin brick arches, warm amber brass chandeliers, and plush terracotta velvet booths.',
  },
  {
    id: 2,
    title: 'Maharaja Private Dining Alcove',
    category: 'interior',
    image: '/images/interior/private_dining_alcove.jpg',
    tag: 'Exclusive Private Room',
    description: 'Intimate banquet dining with hand-carved mahogany jali fretwork, candlelit table settings, and bespoke royal ambiance.',
  },
  {
    id: 3,
    title: 'The Spice Lounge & Cocktail Bar',
    category: 'interior',
    image: '/images/interior/spice_lounge_bar.jpg',
    tag: 'Artisanal Cocktail Bar',
    description: 'Dark marble bar counter with backlit apothecary whole spice jars, signature saffron botanical cocktails, and velvet seating.',
  },
  {
    id: 4,
    title: 'Starlight Conservatory Courtyard',
    category: 'interior',
    image: '/images/interior/conservatory_courtyard.jpg',
    tag: 'Glass Atrium Patio',
    description: 'Romantic glass-roof courtyard dining surrounded by botanical greenery, terracotta tiles, and hanging Moorish brass lanterns.',
  },
  {
    id: 5,
    title: 'Dublin South William St Storefront',
    category: 'exterior',
    image: '/images/interior/dublin_storefront_facade.jpg',
    tag: 'Georgian Dublin Facade',
    description: 'Classic Dublin red-brick streetfront at twilight with illuminated gold-leaf brass signage and warm window glow.',
  },
  {
    id: 6,
    title: 'Twilight Outdoor Dining Terrace',
    category: 'exterior',
    image: '/images/interior/outdoor_terrace.jpg',
    tag: 'Al Fresco Dublin Patio',
    description: 'Heated outdoor dining terrace illuminated with warm fairy canopies, brass fire lanterns, and Dublin evening streetscape.',
  },
  {
    id: 7,
    title: 'Live Copper Tandoor Kitchen Theater',
    category: 'kitchen',
    image: '/images/interior/live_tandoor_kitchen.jpg',
    tag: 'Live Tandoor Embers',
    description: 'Theatrical open kitchen where master chefs bake blistered artisan naans and char-grill skewers over 480°C clay embers.',
  },
  {
    id: 8,
    title: 'Master Chef Open Kitchen Brigade',
    category: 'kitchen',
    image: '/images/interior/kitchen_brigade.jpg',
    tag: 'Kitchen Brigade in Action',
    description: 'Our culinary kitchen team operating the flame tandoor stations, copper degh pots, and active artisan plating line.',
  },
  {
    id: 9,
    title: 'Amber Spice Gala & Live Lounge Night',
    category: 'promotion',
    image: '/images/interior/promotion_event.jpg',
    tag: 'Promotional Gala Event',
    description: 'Exclusive celebration gala night featuring live acoustic melodies, festive banquet candelabras, and signature mixology.',
  },
  {
    id: 10,
    title: 'Royal Spice Masterclass & Tasting Session',
    category: 'promotion',
    image: '/images/interior/spice_tasting_event.jpg',
    tag: 'Promotional Masterclass',
    description: 'Interactive culinary spice journey with our executive chef exploring single-origin saffron, green cardamom, and royal heritage aromas.',
  },
];

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
  storeInfo: DEFAULT_STORE_INFO,
  social: DEFAULT_SOCIAL_LINKS,
  gallery: DEFAULT_GALLERY_ITEMS,
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
          content:
            parsed.terms?.content ||
            (parsed.terms?.sections
              ? parsed.terms.sections.map((s: any) => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n')
              : DEFAULT_TERMS_TEXT),
        },
        privacy: {
          ...DEFAULT_DATA.privacy,
          ...(parsed.privacy || {}),
          content:
            parsed.privacy?.content ||
            (parsed.privacy?.sections
              ? parsed.privacy.sections.map((s: any) => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n')
              : DEFAULT_PRIVACY_TEXT),
        },
        cookie: {
          ...DEFAULT_DATA.cookie,
          ...(parsed.cookie || {}),
          content:
            parsed.cookie?.content ||
            (parsed.cookie?.sections
              ? parsed.cookie.sections.map((s: any) => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n')
              : DEFAULT_COOKIE_TEXT),
        },
        faq: { ...DEFAULT_DATA.faq, ...(parsed.faq || {}) },
        storeInfo: {
          ...DEFAULT_DATA.storeInfo,
          ...(parsed.storeInfo || {}),
          weeklySchedule: parsed.storeInfo?.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE,
        },
        social: { ...DEFAULT_DATA.social, ...(parsed.social || {}) },
        gallery: Array.isArray(parsed.gallery) && parsed.gallery.length > 0 ? parsed.gallery : DEFAULT_GALLERY_ITEMS,
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

// Authentic Official Brand Visual Icons for Social & Online Profiles
const FacebookOfficialIcon = () => (
  <svg className="w-5 h-5 shrink-0 rounded-full shadow-2xs" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      fill="#FFFFFF"
      d="M15.14 12.07h-2.25v8.38c-.37.05-.75.08-1.13.08s-.76-.03-1.13-.08v-8.38H8.5v-3.02h2.13V6.85c0-2.11 1.29-3.26 3.17-3.26.9 0 1.68.07 1.9.1v2.2h-1.3c-1.02 0-1.22.49-1.22 1.2v1.96h2.44l-.48 3.02z"
    />
  </svg>
);

const InstagramOfficialIcon = () => (
  <svg className="w-5 h-5 shrink-0 rounded-[6px] overflow-hidden shadow-2xs" viewBox="0 0 24 24">
    <defs>
      <radialGradient id="cms-ig-grad" cx="20%" cy="105%" r="130%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="5.5" fill="url(#cms-ig-grad)" />
    <rect x="4.5" y="4.5" width="15" height="15" rx="4.2" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="3.4" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
    <circle cx="16.3" cy="7.7" r="1" fill="#FFFFFF" />
  </svg>
);

const YouTubeOfficialIcon = () => (
  <svg className="w-5 h-5 shrink-0 rounded-[5px] overflow-hidden shadow-2xs" viewBox="0 0 24 24">
    <rect width="24" height="24" rx="5" fill="#FF0000" />
    <polygon points="9.5,7 16.5,12 9.5,17" fill="#FFFFFF" />
  </svg>
);

const TripAdvisorOfficialIcon = () => (
  <svg className="w-5 h-5 shrink-0 rounded-full shadow-2xs" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#00AF87" />
    <circle cx="7.5" cy="12.5" r="3" fill="#FFFFFF" />
    <circle cx="7.5" cy="12.5" r="1.3" fill="#003D2E" />
    <circle cx="7.5" cy="12.5" r="0.45" fill="#FFFFFF" />
    <circle cx="16.5" cy="12.5" r="3" fill="#FFFFFF" />
    <circle cx="16.5" cy="12.5" r="1.3" fill="#003D2E" />
    <circle cx="16.5" cy="12.5" r="0.45" fill="#FFFFFF" />
    <polygon points="12,11.5 10.3,9 13.7,9" fill="#FFFFFF" />
    <polygon points="12,14.5 10.5,11.8 13.5,11.8" fill="#FFFFFF" />
    <path d="M5.5 9.2C7.3 7.8 9.5 7.2 12 7.2s4.7.6 6.5 2" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" fill="none" />
  </svg>
);

const GoogleMapsOfficialIcon = () => (
  <svg className="w-5 h-5 shrink-0 drop-shadow-xs" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="3" fill="#FFFFFF" />
    <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 1.25.25 2.44.7 3.52L12 9V2z" />
    <path fill="#34A853" d="M12 22s4.8-5.32 6.3-9.52L12 9v13z" />
    <path fill="#FBBC04" d="M12 9l-6.3 3.48c.95 2.3 2.5 4.72 6.3 9.52V9z" />
    <circle cx="12" cy="9" r="2.8" fill="#FFFFFF" />
    <circle cx="12" cy="9" r="1.3" fill="#EA4335" />
  </svg>
);

const WhatsAppOfficialIcon = () => (
  <svg className="w-5 h-5 shrink-0 rounded-full shadow-2xs" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#25D366" />
    <path
      fill="#FFFFFF"
      d="M12.01 4.5a7.5 7.5 0 00-6.4 11.41L4.5 20l4.22-1.1a7.49 7.49 0 0010.79-6.9 7.5 7.5 0 00-7.5-7.5zm4.4 10.6c-.18.51-.91.95-1.47 1.07-.38.08-.88.15-2.58-.55a9.28 9.28 0 01-3.67-3.24c-.11-.14-.88-1.16-.88-2.22 0-1.07.56-1.59.75-1.8.2-.22.43-.27.58-.27.14 0 .28 0 .4.01.14 0 .32-.05.5.37.18.44.62 1.52.68 1.63.05.12.09.25.02.39-.08.15-.11.24-.22.36-.11.13-.23.29-.33.38-.11.11-.22.23-.09.45.12.21.55.91 1.19 1.48.82.74 1.52.97 1.74 1.07.21.11.34.09.47-.05.12-.15.53-.63.68-.85.14-.21.28-.18.48-.1.2.07 1.25.59 1.46.7.22.1.36.16.42.25.05.09.05.52-.13 1.03z"
    />
  </svg>
);

const ContactPhoneOfficialIcon = () => (
  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#B84A22] to-[#FBA138] flex items-center justify-center text-white shadow-2xs">
    <Phone className="w-3 h-3 fill-current" />
  </div>
);

// Calculate Mon-Thu, Fri-Sat, Sun summary from 7-day schedule
const computeHoursSummary = (schedule: DayOperatingHours[]) => {
  const getDayStr = (d?: DayOperatingHours) => {
    if (!d || !d.isOpen) return 'Closed';
    return `${d.openTime} – ${d.closeTime}`;
  };

  // Mon-Thu
  const mon = schedule.find((d) => d.day === 'Monday');
  const tue = schedule.find((d) => d.day === 'Tuesday');
  const wed = schedule.find((d) => d.day === 'Wednesday');
  const thu = schedule.find((d) => d.day === 'Thursday');
  const monThuList = [mon, tue, wed, thu].filter(Boolean) as DayOperatingHours[];
  const allMonThuSame =
    monThuList.length === 4 &&
    monThuList.every(
      (d) =>
        d.isOpen === monThuList[0].isOpen &&
        d.openTime === monThuList[0].openTime &&
        d.closeTime === monThuList[0].closeTime
    );
  const hoursMonThu = allMonThuSame
    ? getDayStr(monThuList[0])
    : monThuList
        .map((d) => `${d.short}: ${d.isOpen ? `${d.openTime}–${d.closeTime}` : 'Closed'}`)
        .join(', ');

  // Fri-Sat
  const fri = schedule.find((d) => d.day === 'Friday');
  const sat = schedule.find((d) => d.day === 'Saturday');
  const friSatList = [fri, sat].filter(Boolean) as DayOperatingHours[];
  const allFriSatSame =
    friSatList.length === 2 &&
    friSatList.every(
      (d) =>
        d.isOpen === friSatList[0].isOpen &&
        d.openTime === friSatList[0].openTime &&
        d.closeTime === friSatList[0].closeTime
    );
  const hoursFriSat = allFriSatSame
    ? getDayStr(friSatList[0])
    : friSatList
        .map((d) => `${d.short}: ${d.isOpen ? `${d.openTime}–${d.closeTime}` : 'Closed'}`)
        .join(', ');

  // Sunday
  const sun = schedule.find((d) => d.day === 'Sunday');
  const hoursSun = getDayStr(sun);

  const openingHours = `Mon – Thu: ${hoursMonThu}, Fri – Sat: ${hoursFriSat} (Sun: ${hoursSun})`;

  return { hoursMonThu, hoursFriSat, hoursSun, openingHours };
};

export function CmsPage() {
  const [data, setData] = useState<CmsData>(() => getStoredCms());
  const [activeTab, setActiveTab] = useState<'gallery' | 'contact' | 'social' | 'terms' | 'privacy' | 'cookie' | 'faq'>('gallery');
  const [notice, setNotice] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Gallery Add/Edit modal state
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const handleGalleryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingGalleryItem) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditingGalleryItem({
        ...editingGalleryItem,
        image: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

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
        window.dispatchEvent(new Event('storage'));
        setNotice('✓ Published to live website with auto-timestamp!');
        setTimeout(() => setNotice(null), 3500);
      } catch {
        // ignore
      }
    }
  };

  const insertFormatting = (prefix: string, suffix: string = '', placeholder: string = '') => {
    if (activeTab === 'faq' || activeTab === 'gallery' || activeTab === 'contact' || activeTab === 'social') return;
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

  // Current page word count & character count for policy tabs
  const isPolicyTab = activeTab === 'terms' || activeTab === 'privacy' || activeTab === 'cookie';
  const currentContent = isPolicyTab ? data[activeTab].content || '' : '';
  const wordCount = currentContent.trim() ? currentContent.trim().split(/\s+/).length : 0;
  const charCount = currentContent.length;

  return (
    <div className="space-y-6 text-[#1A130E]">
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#1A130E] flex items-center gap-2">
            <span>CMS &amp; Website Management</span>
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#B84A22] text-[10px] font-bold uppercase tracking-wider">
              Live Sync
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage restaurant interior gallery, contact numbers, social links, FAQs and legal policies.
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
            setActiveTab('gallery');
            setEditorMode('edit');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer border transition-colors whitespace-nowrap ${
            activeTab === 'gallery'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white border-transparent shadow-xs'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Gallery Spaces ({data.gallery.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('contact');
            setEditorMode('edit');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer border transition-colors whitespace-nowrap ${
            activeTab === 'contact'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white border-transparent shadow-xs'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Contact &amp; Store Details</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('social');
            setEditorMode('edit');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer border transition-colors whitespace-nowrap ${
            activeTab === 'social'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white border-transparent shadow-xs'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Social Media Links</span>
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
          <span>Terms</span>
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
          <span>Privacy</span>
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
          <span>Cookies</span>
        </button>
      </div>

      {/* ================= 1. GALLERY MANAGEMENT TAB ================= */}
      {activeTab === 'gallery' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#1A130E] flex items-center gap-2">
                <span>Restaurant Spaces &amp; Gallery Photos</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                  {data.gallery.length} items
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Add, edit, or remove photos and architectural descriptions displayed on the customer Gallery page.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingGalleryItem({
                  id: `space-${Date.now()}`,
                  title: '',
                  category: 'interior',
                  image: '/images/interior/main_dining_hall.jpg',
                });
                setIsGalleryModalOpen(true);
              }}
              className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Space / Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {data.gallery.map((item, idx) => (
              <div
                key={item.id || idx}
                className="group bg-white border border-stone-200/90 hover:border-[#B84A22]/40 rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-28 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white uppercase tracking-wider">
                      {item.category === 'dining' || item.category === 'interior'
                        ? 'Interior'
                        : item.category === 'private'
                        ? 'Private'
                        : item.category === 'kitchen' || item.category === 'bar_kitchen'
                        ? 'Kitchen'
                        : item.category === 'promotion'
                        ? 'Events'
                        : 'Patio'}
                    </div>
                  </div>

                  <div className="p-2.5">
                    <h4 className="font-bold text-xs text-stone-900 truncate" title={item.title}>
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-stone-400 truncate font-mono mt-0.5" title={item.image}>
                      {item.image}
                    </p>
                  </div>
                </div>

                <div className="px-2.5 pb-2.5 pt-1 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingGalleryItem(item);
                      setIsGalleryModalOpen(true);
                    }}
                    className="flex-1 h-7 rounded-lg bg-stone-50 hover:bg-[#B84A22] border border-stone-200 hover:border-[#B84A22] text-stone-700 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = data.gallery.filter((_, i) => i !== idx);
                      setData((prev) => ({ ...prev, gallery: updated }));
                    }}
                    className="w-7 h-7 rounded-lg bg-stone-50 hover:bg-rose-50 border border-stone-200 hover:border-rose-300 text-stone-400 hover:text-rose-600 flex items-center justify-center cursor-pointer transition-colors"
                    title="Delete space"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 2. CONTACT & STORE DETAILS TAB ================= */}
      {activeTab === 'contact' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs space-y-6">
          <div className="pb-3 border-b border-stone-100">
            <h3 className="font-bold text-sm text-[#1A130E]">Restaurant Contact &amp; Operating Details</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Updates phone numbers, Dublin location addresses, weekly opening times, and top announcement message.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Restaurant Name</label>
              <input
                type="text"
                value={data.storeInfo.name}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    storeInfo: { ...prev.storeInfo, name: e.target.value },
                  }))
                }
                className="w-full h-9 px-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-[#1A130E] outline-none focus:border-[#B84A22]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Tagline</label>
              <input
                type="text"
                value={data.storeInfo.tagline}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    storeInfo: { ...prev.storeInfo, tagline: e.target.value },
                  }))
                }
                className="w-full h-9 px-3 bg-white border border-stone-200 rounded-xl text-xs text-[#1A130E] outline-none focus:border-[#B84A22]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Primary Phone Number (Orders &amp; Front Desk)</label>
              <input
                type="text"
                value={data.storeInfo.phone}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    storeInfo: { ...prev.storeInfo, phone: e.target.value },
                  }))
                }
                className="w-full h-9 px-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-[#1A130E] outline-none focus:border-[#B84A22]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Secondary / Catering Telephone</label>
              <input
                type="text"
                value={data.storeInfo.secondaryPhone || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    storeInfo: { ...prev.storeInfo, secondaryPhone: e.target.value },
                  }))
                }
                placeholder="+353 (01) 485 9211"
                className="w-full h-9 px-3 bg-white border border-stone-200 rounded-xl text-xs text-[#1A130E] outline-none focus:border-[#B84A22]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Official Email Address</label>
              <input
                type="email"
                value={data.storeInfo.email}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    storeInfo: { ...prev.storeInfo, email: e.target.value },
                  }))
                }
                className="w-full h-9 px-3 bg-white border border-stone-200 rounded-xl text-xs text-[#1A130E] outline-none focus:border-[#B84A22]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Dublin Eircode</label>
              <input
                type="text"
                value={data.storeInfo.eircode}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    storeInfo: { ...prev.storeInfo, eircode: e.target.value },
                  }))
                }
                className="w-full h-9 px-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-[#1A130E] outline-none focus:border-[#B84A22]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">Street Address</label>
              <input
                type="text"
                value={data.storeInfo.address}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    storeInfo: { ...prev.storeInfo, address: e.target.value },
                  }))
                }
                className="w-full h-9 px-3 bg-white border border-stone-200 rounded-xl text-xs text-[#1A130E] outline-none focus:border-[#B84A22]"
              />
            </div>
          </div>

          {/* Dynamic Operating Hours & Weekly Schedule Manager */}
          <div className="pt-4 border-t border-stone-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B84A22]" />
                  <span>Operating Hours &amp; Weekly Schedule (Dine-in, Takeaway &amp; Delivery)</span>
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Set active opening times (ON) and rest/closed days (OFF) for each day of the week.
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const updated = DEFAULT_WEEKLY_SCHEDULE;
                    const summary = computeHoursSummary(updated);
                    setData((prev) => ({
                      ...prev,
                      storeInfo: {
                        ...prev.storeInfo,
                        weeklySchedule: updated,
                        ...summary,
                      },
                    }));
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors cursor-pointer"
                >
                  Default Hours
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const currentSchedule = data.storeInfo.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE;
                    const updated = currentSchedule.map((d) => ({
                      ...d,
                      isOpen: true,
                    }));
                    const summary = computeHoursSummary(updated);
                    setData((prev) => ({
                      ...prev,
                      storeInfo: {
                        ...prev.storeInfo,
                        weeklySchedule: updated,
                        ...summary,
                      },
                    }));
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 rounded-lg transition-colors cursor-pointer"
                >
                  Open All 7 Days
                </button>
              </div>
            </div>

            {/* 7-Day Interactive Schedule Table */}
            <div className="border border-stone-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs divide-y divide-stone-100">
              {(data.storeInfo.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE).map((item, idx) => (
                <div
                  key={item.day}
                  className={`px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
                    item.isOpen ? 'bg-white hover:bg-stone-50/50' : 'bg-stone-50/60 hover:bg-stone-50'
                  }`}
                >
                  {/* Day Info & Badge */}
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <span className="w-10 text-[11px] font-bold text-stone-400 uppercase tracking-wider">{item.short}</span>
                    <span className="text-xs font-bold text-[#1A130E]">{item.day}</span>
                  </div>

                  {/* ON / OFF Switch */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const currentSchedule = data.storeInfo.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE;
                        const updated = currentSchedule.map((d, i) =>
                          i === idx ? { ...d, isOpen: !d.isOpen } : d
                        );
                        const summary = computeHoursSummary(updated);
                        setData((prev) => ({
                          ...prev,
                          storeInfo: {
                            ...prev.storeInfo,
                            weeklySchedule: updated,
                            ...summary,
                          },
                        }));
                      }}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        item.isOpen
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200/80 border border-emerald-300/60'
                          : 'bg-stone-200/80 text-stone-600 hover:bg-stone-300 border border-stone-300/60'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.isOpen ? 'bg-emerald-500' : 'bg-stone-400'
                        }`}
                      />
                      <span>{item.isOpen ? 'OPEN (ON)' : 'CLOSED (OFF)'}</span>
                    </button>
                  </div>

                  {/* Time Inputs (kobe on time, kobe off time) */}
                  <div className="flex items-center gap-2">
                    {item.isOpen ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-stone-500 font-medium">Open:</span>
                          <input
                            type="time"
                            value={item.openTime}
                            onChange={(e) => {
                              const currentSchedule = data.storeInfo.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE;
                              const updated = currentSchedule.map((d, i) =>
                                i === idx ? { ...d, openTime: e.target.value } : d
                              );
                              const summary = computeHoursSummary(updated);
                              setData((prev) => ({
                                ...prev,
                                storeInfo: {
                                  ...prev.storeInfo,
                                  weeklySchedule: updated,
                                  ...summary,
                                },
                              }));
                            }}
                            className="h-8 px-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#B84A22] rounded-lg text-xs font-semibold text-[#1A130E] outline-none shadow-2xs"
                          />
                        </div>

                        <span className="text-stone-400 text-xs font-bold">–</span>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-stone-500 font-medium">Close:</span>
                          <input
                            type="time"
                            value={item.closeTime}
                            onChange={(e) => {
                              const currentSchedule = data.storeInfo.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE;
                              const updated = currentSchedule.map((d, i) =>
                                i === idx ? { ...d, closeTime: e.target.value } : d
                              );
                              const summary = computeHoursSummary(updated);
                              setData((prev) => ({
                                ...prev,
                                storeInfo: {
                                  ...prev.storeInfo,
                                  weeklySchedule: updated,
                                  ...summary,
                                },
                              }));
                            }}
                            className="h-8 px-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#B84A22] rounded-lg text-xs font-semibold text-[#1A130E] outline-none shadow-2xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 py-1 text-xs text-stone-400 italic">
                        <span>Rest day · Kitchen &amp; deliveries closed</span>
                      </div>
                    )}
                  </div>

                  {/* Summary Status Badge */}
                  <div className="min-w-[120px] text-left md:text-right">
                    {item.isOpen ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        {item.openTime} – {item.closeTime}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200/60">
                        Closed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Website Footer Preview Cards */}
            <div className="bg-stone-50/70 border border-stone-200/80 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                  Live Website Footer Display (Auto-Generated from Schedule)
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">
                  ✓ Synced with Dublin restaurant footer &amp; contact page
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-2.5 rounded-lg border border-stone-200/70 shadow-2xs">
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">Monday – Thursday</label>
                  <input
                    type="text"
                    value={data.storeInfo.hoursMonThu || ''}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        storeInfo: { ...prev.storeInfo, hoursMonThu: e.target.value },
                      }))
                    }
                    className="w-full h-8 px-2 bg-stone-50/50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#B84A22] rounded-md text-xs font-semibold text-[#1A130E] outline-none"
                  />
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200/70 shadow-2xs">
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">Friday – Saturday</label>
                  <input
                    type="text"
                    value={data.storeInfo.hoursFriSat || ''}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        storeInfo: { ...prev.storeInfo, hoursFriSat: e.target.value },
                      }))
                    }
                    className="w-full h-8 px-2 bg-stone-50/50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#B84A22] rounded-md text-xs font-semibold text-[#1A130E] outline-none"
                  />
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200/70 shadow-2xs">
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">Sunday</label>
                  <input
                    type="text"
                    value={data.storeInfo.hoursSun || ''}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        storeInfo: { ...prev.storeInfo, hoursSun: e.target.value },
                      }))
                    }
                    className="w-full h-8 px-2 bg-stone-50/50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#B84A22] rounded-md text-xs font-semibold text-[#1A130E] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Announcement Banner */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700">Top Announcement Banner Message</label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-600">
                <input
                  type="checkbox"
                  checked={data.storeInfo.isAnnouncementActive ?? true}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      storeInfo: { ...prev.storeInfo, isAnnouncementActive: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 rounded text-[#B84A22] focus:ring-[#B84A22]"
                />
                <span>Show banner on customer website</span>
              </label>
            </div>
            <input
              type="text"
              value={data.storeInfo.announcementBanner || ''}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  storeInfo: { ...prev.storeInfo, announcementBanner: e.target.value },
                }))
              }
              placeholder="e.g. 🌟 Weekend Royal Feast Offer: 10% OFF on all Dum Biryanis with code ROYAL10!"
              className="w-full h-9 px-3 bg-white border border-stone-200 rounded-xl text-xs text-[#1A130E] outline-none focus:border-[#B84A22]"
            />
          </div>
        </div>
      )}

      {/* ================= 3. SOCIAL MEDIA & LINKS TAB ================= */}
      {activeTab === 'social' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs space-y-6">
          <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#1A130E]">Social Media Profiles &amp; Online Links</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Control social profiles, TripAdvisor links, Google Maps coordinates, official contact numbers, and WhatsApp messaging.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Facebook */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Facebook Page URL</label>
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <FacebookOfficialIcon />
                </div>
                <input
                  type="url"
                  value={data.social?.facebook || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      social: { ...prev.social, facebook: e.target.value },
                    }))
                  }
                  placeholder="https://facebook.com/amberspicedublin"
                  className="w-full h-10 pl-10 pr-3.5 bg-white border border-stone-200 hover:border-stone-300 focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/10 rounded-xl text-xs font-medium text-[#1A130E] outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Instagram Profile URL</label>
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <InstagramOfficialIcon />
                </div>
                <input
                  type="url"
                  value={data.social?.instagram || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      social: { ...prev.social, instagram: e.target.value },
                    }))
                  }
                  placeholder="https://instagram.com/amberspicedublin"
                  className="w-full h-10 pl-10 pr-3.5 bg-white border border-stone-200 hover:border-stone-300 focus:border-[#E4405F] focus:ring-2 focus:ring-[#E4405F]/10 rounded-xl text-xs font-medium text-[#1A130E] outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* YouTube */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">YouTube Channel URL</label>
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <YouTubeOfficialIcon />
                </div>
                <input
                  type="url"
                  value={data.social?.youtube || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      social: { ...prev.social, youtube: e.target.value },
                    }))
                  }
                  placeholder="https://youtube.com/@amberspicedublin"
                  className="w-full h-10 pl-10 pr-3.5 bg-white border border-stone-200 hover:border-stone-300 focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/10 rounded-xl text-xs font-medium text-[#1A130E] outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* TripAdvisor */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">TripAdvisor Review Page</label>
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <TripAdvisorOfficialIcon />
                </div>
                <input
                  type="url"
                  value={data.social?.tripadvisor || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      social: { ...prev.social, tripadvisor: e.target.value },
                    }))
                  }
                  placeholder="https://tripadvisor.com/Restaurant_Review..."
                  className="w-full h-10 pl-10 pr-3.5 bg-white border border-stone-200 hover:border-stone-300 focus:border-[#00AF87] focus:ring-2 focus:ring-[#00AF87]/10 rounded-xl text-xs font-medium text-[#1A130E] outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* WhatsApp Business */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">WhatsApp Business Direct Number</label>
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <WhatsAppOfficialIcon />
                </div>
                <input
                  type="text"
                  value={data.social?.whatsapp || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      social: { ...prev.social, whatsapp: e.target.value },
                    }))
                  }
                  placeholder="+35314859210"
                  className="w-full h-10 pl-10 pr-3.5 bg-white border border-stone-200 hover:border-stone-300 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/10 rounded-xl text-xs font-medium text-[#1A130E] outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Primary Restaurant Contact Number */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Official Restaurant Contact Number</label>
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ContactPhoneOfficialIcon />
                </div>
                <input
                  type="text"
                  value={data.social?.phone ?? data.storeInfo?.phone ?? ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      social: { ...prev.social, phone: e.target.value },
                      storeInfo: { ...prev.storeInfo, phone: e.target.value },
                    }))
                  }
                  placeholder="+353 (01) 485 9210"
                  className="w-full h-10 pl-10 pr-3.5 bg-white border border-stone-200 hover:border-stone-300 focus:border-[#B84A22] focus:ring-2 focus:ring-[#B84A22]/10 rounded-xl text-xs font-medium text-[#1A130E] outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Google Maps Location Link (Spans both columns) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Google Maps Location Link</label>
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <GoogleMapsOfficialIcon />
                </div>
                <input
                  type="url"
                  value={data.social?.googleMaps || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      social: { ...prev.social, googleMaps: e.target.value },
                    }))
                  }
                  placeholder="https://maps.google.com/?q=Amber+Spice+18+South+William+St+Dublin"
                  className="w-full h-10 pl-10 pr-3.5 bg-white border border-stone-200 hover:border-stone-300 focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/10 rounded-xl text-xs font-medium text-[#1A130E] outline-none transition-all shadow-2xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SINGLE-BOX RICH TEXT EDITOR FOR TERMS, PRIVACY, COOKIE ================= */}
      {isPolicyTab && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Page Title</label>
              <input
                type="text"
                value={data[activeTab].title}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    [activeTab]: { ...prev[activeTab], title: e.target.value },
                  }))
                }
                className="w-full h-9 px-3 bg-white border border-stone-200 rounded-xl text-xs font-bold text-[#1A130E] outline-none focus:border-[#B84A22] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle / Summary</label>
              <input
                type="text"
                value={data[activeTab].subtitle}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    [activeTab]: { ...prev[activeTab], subtitle: e.target.value },
                  }))
                }
                className="w-full h-9 px-3 bg-white border border-stone-200 rounded-xl text-xs text-stone-600 outline-none focus:border-[#B84A22] transition-colors"
              />
            </div>
          </div>

          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="bg-stone-50/90 px-3 py-2 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**', 'bold text')}
                  className="w-7 h-7 rounded-lg text-stone-600 hover:text-[#B84A22] hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Bold (**text**)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*', 'italic text')}
                  className="w-7 h-7 rounded-lg text-stone-600 hover:text-[#B84A22] hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Italic (*text*)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <span className="w-px h-4 bg-stone-200 mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting('## ', '\n', 'Section Title')}
                  className="w-7 h-7 rounded-lg text-stone-600 hover:text-[#B84A22] hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Heading 2 (## Title)"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('### ', '\n', 'Subsection Title')}
                  className="w-7 h-7 rounded-lg text-stone-600 hover:text-[#B84A22] hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Heading 3 (### Subtitle)"
                >
                  <Heading3 className="w-3.5 h-3.5" />
                </button>
                <span className="w-px h-4 bg-stone-200 mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting('• ', '\n', 'List item')}
                  className="w-7 h-7 rounded-lg text-stone-600 hover:text-[#B84A22] hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Bullet List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('1. ', '\n', 'First item')}
                  className="w-7 h-7 rounded-lg text-stone-600 hover:text-[#B84A22] hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Numbered List"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('> ', '\n', 'Important note or quote')}
                  className="w-7 h-7 rounded-lg text-stone-600 hover:text-[#B84A22] hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Blockquote (> quote)"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n---\n\n', '', '')}
                  className="w-7 h-7 rounded-lg text-stone-600 hover:text-[#B84A22] hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Divider (---)"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1 bg-stone-200/60 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setEditorMode('edit')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    editorMode === 'edit'
                      ? 'bg-white text-[#B84A22] shadow-2xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('preview')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    editorMode === 'preview'
                      ? 'bg-white text-[#B84A22] shadow-2xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Live Preview</span>
                </button>
              </div>
            </div>

            {editorMode === 'edit' ? (
              <textarea
                ref={textareaRef}
                rows={16}
                value={data[activeTab].content}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    [activeTab]: { ...prev[activeTab], content: e.target.value },
                  }))
                }
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

            <div className="bg-stone-50/80 px-4 py-2 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>{wordCount} words</span>
                <span>·</span>
                <span>{charCount} characters</span>
              </div>
              <span className="text-[11px] text-stone-400 font-medium">
                Last updated: {data[activeTab].lastUpdated || 'Current Month'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. FAQ TAB ================= */}
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

      {/* ================= GALLERY ADD / EDIT MODAL ================= */}
      {isGalleryModalOpen && editingGalleryItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-base text-[#1A130E] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#B84A22]" />
                <span>{editingGalleryItem.id ? 'Edit Space & Photo' : 'Add New Restaurant Space'}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsGalleryModalOpen(false);
                  setEditingGalleryItem(null);
                }}
                className="w-7 h-7 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingGalleryItem.title}
                  onChange={(e) =>
                    setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })
                  }
                  placeholder="e.g. Maharaja Private Dining Alcove"
                  className="w-full h-9 px-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-[#1A130E] outline-none focus:border-[#B84A22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                <select
                  value={editingGalleryItem.category}
                  onChange={(e) =>
                    setEditingGalleryItem({
                      ...editingGalleryItem,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full h-9 px-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium text-[#1A130E] outline-none focus:border-[#B84A22]"
                >
                  <option value="interior">Restaurant Interior</option>
                  <option value="exterior">Dublin Facade &amp; Exterior</option>
                  <option value="kitchen">Kitchen &amp; Tandoor</option>
                  <option value="promotion">Promotions &amp; Events</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700">Photo</label>
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="text-xs font-semibold text-[#B84A22] hover:text-[#9E3E1B] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </button>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={galleryFileInputRef}
                  onChange={handleGalleryFileUpload}
                  className="hidden"
                />

                <div
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="relative aspect-video rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group cursor-pointer"
                >
                  <img
                    src={editingGalleryItem.image}
                    alt="Preview"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/interior/main_dining_hall.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs">
                    <Upload className="w-4 h-4" />
                    <span>Click to change photo</span>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] backdrop-blur-xs font-medium">
                    Live Photo Preview
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsGalleryModalOpen(false);
                  setEditingGalleryItem(null);
                }}
                className="h-9 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingGalleryItem.title.trim()) return;
                  const idx = data.gallery.findIndex((i) => i.id === editingGalleryItem.id);
                  if (idx >= 0) {
                    const updated = [...data.gallery];
                    updated[idx] = editingGalleryItem;
                    setData((prev) => ({ ...prev, gallery: updated }));
                  } else {
                    setData((prev) => ({
                      ...prev,
                      gallery: [editingGalleryItem, ...prev.gallery],
                    }));
                  }
                  setIsGalleryModalOpen(false);
                  setEditingGalleryItem(null);
                }}
                className="h-9 px-5 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                Save Space
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CmsPage;
