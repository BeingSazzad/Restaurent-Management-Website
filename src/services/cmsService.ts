export interface CmsSection {
  id: string;
  title: string;
  content: string;
}

export interface CmsPageData {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: CmsSection[];
}

export interface CmsFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface CmsStoreInfo {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  eircode: string;
  openingHours: string;
  minOrderDelivery: number;
  deliveryPrepTime: string;
  collectionPrepTime: string;
  announcementBanner?: string;
  isAnnouncementActive?: boolean;
}

export interface CmsDatabase {
  terms: CmsPageData;
  privacy: CmsPageData;
  cookie: CmsPageData;
  about: {
    heroTitle: string;
    heroSubtitle: string;
    storyTitle: string;
    storyParagraph1: string;
    storyParagraph2: string;
    founderQuote: string;
    founderName: string;
    stats: { label: string; value: string }[];
    coreValues: { title: string; desc: string }[];
  };
  faq: {
    title: string;
    subtitle: string;
    items: CmsFaqItem[];
  };
  storeInfo: CmsStoreInfo;
}

export const DEFAULT_CMS_DATA: CmsDatabase = {
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Customer terms and conditions for ordering, delivery, and dining services.',
    lastUpdated: 'October 2026',
    sections: [
      {
        id: 'term-1',
        title: '1. Agreement to Terms',
        content:
          'By accessing our website or placing an online order for delivery or collection, you agree to be bound by these Terms & Conditions. If you disagree with any portion of these terms, please refrain from utilizing our online ordering platform.',
      },
      {
        id: 'term-2',
        title: '2. Pricing, VAT & Payment',
        content:
          'All menu prices are listed in Euros (€) and are inclusive of standard Irish Value Added Tax (VAT). While we endeavor to ensure accurate pricing across the platform, we reserve the right to update prices, seasonal dishes, and special promotions without prior notice.',
      },
      {
        id: 'term-3',
        title: '3. Fulfillment, Delivery & Collections',
        content:
          'Estimated delivery times (~30-35 mins) and collection preparation times (~15-20 mins) are approximate and may vary due to peak hours, kitchen volume, or inclement weather in Dublin. Customers are responsible for providing complete and accurate Dublin addresses, Eircodes, and contact numbers.',
      },
      {
        id: 'term-4',
        title: '4. Cancellations & Refunds',
        content:
          'Orders can be modified or cancelled within 5 minutes of placement by phoning our kitchen directly at +353 (01) 485 9210. Once an order has entered "preparing" status in our kitchen, cancellations or refunds cannot be guaranteed.',
      },
      {
        id: 'term-5',
        title: '5. Allergens & Special Dietary Requests',
        content:
          'We take food safety and allergen management with extreme seriousness. However, as our dishes are handcrafted in an active kitchen that handles dairy, nuts, and gluten, cross-contact is possible. Please inform our team of severe allergies prior to placing your order.',
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
          'When you place an order, create an account, or book a table, we collect your name, phone number, email address, delivery address, and Eircode. Payment credentials are tokenized securely through Stripe / Apple Pay and never stored on our servers.',
      },
      {
        id: 'priv-2',
        title: '2. How We Use Your Information',
        content:
          'Your data is used strictly for order fulfillment, kitchen dispatch, SMS/email status notifications, customer support, and, where opted in, royal promotions and loyalty rewards.',
      },
      {
        id: 'priv-3',
        title: '3. Data Security & Storage',
        content:
          'All communication between your browser and our platform is encrypted using industry-standard SSL (Transport Layer Security). We comply fully with the European Union General Data Protection Regulation (GDPR) and Irish Data Protection Act 2018.',
      },
      {
        id: 'priv-4',
        title: '4. Your Rights',
        content:
          'Under GDPR, you have the right to request access to your personal data, request correction of inaccurate records, or request complete deletion of your customer profile at any time by contacting privacy@amberspice.ie.',
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
          'Cookies and browser storage are small data files saved on your device to keep your shopping cart intact, remember delivery addresses, and ensure smooth checkout without losing your selected modifiers.',
      },
      {
        id: 'cook-2',
        title: '2. Essential Cookies',
        content:
          'These cookies are strictly required for our ordering platform to function: cart persistence, user session authentication, and active order tracking status synchronization.',
      },
      {
        id: 'cook-3',
        title: '3. Managing Preferences',
        content:
          'You can modify your browser settings to block or notify you about cookies. Please note that disabling essential storage may prevent you from placing orders or tracking live deliveries.',
      },
    ],
  },
  about: {
    heroTitle: 'About Us',
    heroSubtitle: 'Preserving authentic royal culinary heritage in the heart of Dublin since 2014.',
    storyTitle: 'From Imperial Durbars to South William Street',
    storyParagraph1:
      'Amber Spice was founded with a singular conviction: that authentic South Asian culinary art cannot be rushed. Every biryani pot is sealed with wholewheat dough, gently cooked on low flame (dum pukht) to lock in saffron aromas and delicate spice vapors.',
    storyParagraph2:
      'We stone-grind our own garam masala blends, slow-braise grass-fed Irish lamb shoulder for seven hours, and source farm-fresh poultry and dairy directly from verified Irish producers.',
    founderQuote:
      'Authentic cooking is not a performance; it is patience, respect for heirloom spices, and heartfelt hospitality.',
    founderName: 'Chef Tariq Al-Hassan — Executive Head Chef',
    stats: [
      { label: 'Years of Heritage', value: '12+' },
      { label: 'Authentic Dishes', value: '45+' },
      { label: 'Happy Dublin Diners', value: '85k+' },
      { label: 'Halal Certified', value: '100%' },
    ],
    coreValues: [
      {
        title: 'Slow Dum Cooking',
        desc: 'Traditional clay handis sealed with dough to capture pure aromatic essence.',
      },
      {
        title: '100% Certified Halal',
        desc: 'Verified premium cuts from Ireland’s finest trusted ethical suppliers.',
      },
      {
        title: 'Fresh Stone-Ground Spices',
        desc: 'Zero artificial coloring or generic premixes; crafted fresh weekly.',
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
          'Yes, absolutely. All poultry, lamb, and beef prepared in our South William Street kitchen are 100% certified Halal from verified Irish suppliers. Certificates are proudly displayed on-site.',
      },
      {
        id: 'faq-2',
        category: 'Food & Dietary',
        question: 'Do you offer vegetarian and vegan curries?',
        answer:
          'Yes! We have an extensive heritage vegetarian & vegan section including Paneer Tikka Masala, Dal Makhani, Aloo Gobi, and Chana Masala.',
      },
      {
        id: 'faq-3',
        category: 'Ordering & Delivery',
        question: 'What are your delivery zones and minimum orders in Dublin?',
        answer:
          'We deliver across Dublin 1, 2, 4, 6, and 8. Minimum order is €15.00 for Dublin 2, and delivery is completely FREE on orders over €30.00.',
      },
      {
        id: 'faq-4',
        category: 'Ordering & Delivery',
        question: 'How long does delivery take during peak evening hours?',
        answer:
          'Standard delivery time is between 30 to 45 minutes. You can track your order live from our kitchen to your doorstep in real time.',
      },
      {
        id: 'faq-5',
        category: 'Dining & Events',
        question: 'Can I book a table for large groups or private dining?',
        answer:
          'Yes, we accommodate parties and private group bookings up to 45 guests. Please book through our reservations page or call +353 (01) 485 9210.',
      },
    ],
  },
  storeInfo: {
    name: 'AMBER SPICE',
    tagline: 'Authentic Flavors · Timeless Recipes',
    phone: '+353 (01) 485 9210',
    email: 'orders@amberspice.ie',
    address: '18 South William St, Dublin 2',
    eircode: 'D02 HR58',
    openingHours: 'Mon – Thu: 17:00 – 22:00, Fri – Sat: 16:30 – 22:30 (Sun: Closed)',
    minOrderDelivery: 15.0,
    deliveryPrepTime: '30-40 min',
    collectionPrepTime: '15-20 min',
    announcementBanner: '🌟 Weekend Royal Feast Offer: 10% OFF on all Dum Biryanis with code ROYAL10!',
    isAnnouncementActive: true,
  },
};

const CMS_STORAGE_KEY = 'amber_spice_cms_data';

export function getFullCmsData(): CmsDatabase {
  if (typeof window === 'undefined') return DEFAULT_CMS_DATA;
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_CMS_DATA,
        ...parsed,
        terms: { ...DEFAULT_CMS_DATA.terms, ...(parsed.terms || {}) },
        privacy: { ...DEFAULT_CMS_DATA.privacy, ...(parsed.privacy || {}) },
        cookie: { ...DEFAULT_CMS_DATA.cookie, ...(parsed.cookie || {}) },
        about: {
          ...DEFAULT_CMS_DATA.about,
          ...(parsed.about || {}),
          heroTitle:
            parsed.about?.heroTitle === 'Our Heritage Kitchen & Craft'
              ? 'About Us'
              : (parsed.about?.heroTitle || 'About Us'),
        },
        faq: { ...DEFAULT_CMS_DATA.faq, ...(parsed.faq || {}) },
        storeInfo: { ...DEFAULT_CMS_DATA.storeInfo, ...(parsed.storeInfo || {}) },
      };
    }
  } catch {
    // fallback
  }
  return DEFAULT_CMS_DATA;
}

export function saveFullCmsData(data: CmsDatabase): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('amber_spice_cms_updated'));
  } catch (err) {
    console.error('Failed to save CMS data to localStorage:', err);
  }
}

export function getCmsPage<K extends keyof CmsDatabase>(pageKey: K): CmsDatabase[K] {
  const full = getFullCmsData();
  return full[pageKey];
}

export function updateCmsPage<K extends keyof CmsDatabase>(
  pageKey: K,
  updatedData: Partial<CmsDatabase[K]>
): CmsDatabase {
  const full = getFullCmsData();
  const merged = {
    ...full,
    [pageKey]: {
      ...(full[pageKey] as any),
      ...updatedData,
    },
  };
  saveFullCmsData(merged);
  return merged;
}
