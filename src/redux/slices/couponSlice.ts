import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  validTill: string;
  badge: string;
  isActive: boolean;
}

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-spice20',
    code: 'SPICE20',
    title: 'Grand Royal Feast Discount',
    description: 'Enjoy 20% discount on all heritage curries, dum biryanis, and chef specials.',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 35.0,
    validTill: 'Valid until Sunday',
    badge: 'Trending Special',
    isActive: true,
  },
  {
    id: 'coup-familyfest',
    code: 'FAMILYFEST',
    title: 'Family Gathering Platter Offer',
    description: 'Special 15% concession for family platters, mixed tandoori grills, and sides.',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 45.0,
    validTill: 'Valid all week',
    badge: 'Family Weekend',
    isActive: true,
  },
  {
    id: 'coup-firstbite',
    code: 'FIRSTBITE',
    title: 'Welcome First-Time Diner Gift',
    description: 'First time ordering? Enjoy 10% off your authentic doorstep delivery.',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 0,
    validTill: 'First order only',
    badge: 'New Customer',
    isActive: true,
  },
  {
    id: 'coup-welcome10',
    code: 'WELCOME10',
    title: 'Welcome Special Voucher',
    description: 'Get 10% off your next delicious Dublin meal with Amber Spice.',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 0,
    validTill: 'Ongoing',
    badge: 'Welcome Deal',
    isActive: true,
  },
  {
    id: 'coup-chef20',
    code: 'CHEF20',
    title: 'Head Chef Signature Treat',
    description: '20% discount on chef-curated handi specialties and dum biryanis.',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 30.0,
    validTill: 'Limited Time',
    badge: 'Chef Special',
    isActive: true,
  },
];

const COUPONS_STORAGE_KEY = 'amber_spice_coupons';

export const getStoredCoupons = (): Coupon[] => {
  if (typeof window === 'undefined') return INITIAL_COUPONS;
  try {
    const raw = localStorage.getItem(COUPONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_COUPONS;
};

const saveCouponsToStorage = (coupons: Coupon[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
    window.dispatchEvent(new Event('amber_spice_coupons_updated'));
  } catch {
    // fallback
  }
};

interface CouponState {
  items: Coupon[];
}

const initialState: CouponState = {
  items: INITIAL_COUPONS,
};

export const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    syncCouponsFromStorage: (state) => {
      state.items = getStoredCoupons();
    },
    addCoupon: (state, action: PayloadAction<Coupon>) => {
      state.items.unshift(action.payload);
      saveCouponsToStorage(state.items);
    },
    updateCoupon: (state, action: PayloadAction<Coupon>) => {
      const idx = state.items.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
        saveCouponsToStorage(state.items);
      }
    },
    deleteCoupon: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
      saveCouponsToStorage(state.items);
    },
    toggleCouponStatus: (state, action: PayloadAction<string>) => {
      const coupon = state.items.find((c) => c.id === action.payload);
      if (coupon) {
        coupon.isActive = !coupon.isActive;
        saveCouponsToStorage(state.items);
      }
    },
  },
});

export const {
  syncCouponsFromStorage,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
} = couponSlice.actions;

export default couponSlice.reducer;
