'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToCart, setCartOpen } from '@/redux/slices/cartSlice';
import { setActiveTrackingOrderId } from '@/redux/slices/orderSlice';
import { toggleFavorite } from '@/redux/slices/favoritesSlice';
import { logout } from '@/redux/slices/authSlice';
import { MOCK_USER, MENU_ITEMS, RESTAURANT_INFO, MenuItem } from '@/Mockdata';
import { ModifierModal } from '@/components/shared/ModifierModal';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShoppingBag,
  MapPin,
  CreditCard,
  HelpCircle,
  Settings,
  LogOut,
  Camera,
  CheckCircle2,
  ChevronDown,
  Trash2,
  RotateCcw,
  PackageCheck,
  Heart,
  Plus,
  ShieldCheck,
  Bell,
} from 'lucide-react';

type TabType = 'profile' | 'orders' | 'addresses' | 'cards' | 'help' | 'settings' | 'logout';

interface SavedCardItem {
  id: string;
  cardType: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expMonth: string;
  expYear: string;
  holder: string;
  isDefault: boolean;
}

export default function UserDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const favoriteDishIds = useAppSelector((state) => state.favorites.favoriteDishIds);

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [selectedDishForCustomize, setSelectedDishForCustomize] = useState<MenuItem | null>(null);

  // Profile data (matches screenshot layout: Name, Email, Phone Number, Password)
  const [profile, setProfile] = useState({
    name: 'Mark Jecno',
    email: 'mark-jecno@gmail.com',
    phone: '+1 (692)52 - 95555',
    password: '••••••••',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  });

  // 1-Click inline edit state (No popup modals)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: 'Mark Jecno',
    email: 'mark-jecno@gmail.com',
    phone: '+1 (692)52 - 95555',
    newPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Address management state
  const [addresses, setAddresses] = useState(MOCK_USER.addresses);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newAddress, setNewAddress] = useState('');
  const [newEircode, setNewEircode] = useState('');

  // Payment cards state
  const [savedCards, setSavedCards] = useState<SavedCardItem[]>([
    {
      id: 'card-1',
      cardType: 'visa',
      last4: '4242',
      expMonth: '08',
      expYear: '28',
      holder: 'Mark Jecno',
      isDefault: true,
    },
    {
      id: 'card-2',
      cardType: 'mastercard',
      last4: '8831',
      expMonth: '11',
      expYear: '27',
      holder: 'Mark Jecno',
      isDefault: false,
    },
  ]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('Mark Jecno');
  const [newCardExp, setNewCardExp] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');

  // Settings toggles
  const [notifications, setNotifications] = useState({
    orderSms: true,
    emailReceipts: true,
    promotions: false,
    twoFactor: false,
  });

  // Support inquiry state
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [supportSubject, setSupportSubject] = useState('Order inquiry');
  const [supportMessage, setSupportMessage] = useState('');

  // FAQs open state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // 1-Click inline edit handlers
  const handleStartEdit = () => {
    setEditForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      newPassword: '',
    });
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      name: editForm.name.trim() || prev.name,
      email: editForm.email.trim() || prev.email,
      phone: editForm.phone.trim() || prev.phone,
      password: editForm.newPassword ? '••••••••' : prev.password,
    }));
    setIsEditingProfile(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 4000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, avatar: url }));
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 3000);
    }
  };

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach((item) => {
      dispatch(
        addToCart({
          ...item,
          cartItemId: `${item.dish.id}-${Date.now()}-${Math.random()}`,
        })
      );
    });
    dispatch(setCartOpen(true));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress || !newEircode) return;

    const newEntry = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      address: newAddress,
      eircode: newEircode.toUpperCase(),
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, newEntry]);
    setNewAddress('');
    setNewEircode('');
    setIsAddingAddress(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = newCardNumber.replace(/\s+/g, '');
    if (!cleanNumber || cleanNumber.length < 4) return;

    const last4 = cleanNumber.slice(-4);
    const [expMonth = '12', expYear = '28'] = newCardExp.split('/');

    const newCard: SavedCardItem = {
      id: `card-${Date.now()}`,
      cardType: cleanNumber.startsWith('4') ? 'visa' : 'mastercard',
      last4,
      expMonth,
      expYear,
      holder: newCardHolder || profile.name,
      isDefault: savedCards.length === 0,
    };

    setSavedCards([...savedCards, newCard]);
    setNewCardNumber('');
    setNewCardExp('');
    setNewCardCvv('');
    setIsAddingCard(false);
  };

  const handleDeleteCard = (id: string) => {
    setSavedCards(savedCards.filter((c) => c.id !== id));
  };

  const handleSetDefaultCard = (id: string) => {
    setSavedCards(
      savedCards.map((c) => ({
        ...c,
        isDefault: c.id === id,
      }))
    );
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage) return;
    setSupportSubmitted(true);
    setSupportMessage('');
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const faqs = [
    {
      q: 'What are your delivery hours and estimated delivery times?',
      a: 'We deliver daily across Dublin 1, 2, 4, 6, and 8 from 12:00 PM to 10:30 PM. Average delivery time is 30–35 minutes during weekdays and 40 minutes during peak weekend evenings.',
    },
    {
      q: 'Are all meats 100% Halal certified?',
      a: 'Yes, 100% of our chicken, lamb, and goat meats are strictly sourced from verified, certified Halal Irish purveyors.',
    },
    {
      q: 'How does doorstep delivery fee calculation work?',
      a: 'Delivery is €2.00–€3.00 depending on postal district. All orders of €30.00 or higher qualify automatically for free delivery.',
    },
    {
      q: 'Can I request adjustments for nut or dairy allergies?',
      a: 'Absolutely. You can specify mild/medium/spicy spice levels or allergen exclusions in the dish customization modal or checkout order notes.',
    },
  ];

  const navigationItems = [
    { id: 'profile' as TabType, label: 'Change Profile', icon: User },
    { id: 'orders' as TabType, label: 'My Order', icon: ShoppingBag, badge: orders.length },
    { id: 'addresses' as TabType, label: 'Saved Address', icon: MapPin, badge: addresses.length },
    { id: 'cards' as TabType, label: 'Saved Card', icon: CreditCard, badge: savedCards.length },
    { id: 'help' as TabType, label: 'Help', icon: HelpCircle },
    { id: 'settings' as TabType, label: 'Setting', icon: Settings },
    { id: 'logout' as TabType, label: 'Log Out', icon: LogOut },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT SIDEBAR CARD ================= */}
          <aside className="lg:col-span-4 xl:col-span-4">
            <div className="bg-white border border-[#EBEBEB] rounded-2xl shadow-xs overflow-hidden">
              {/* Gradient Banner */}
              <div className="h-28 sm:h-32 bg-gradient-to-r from-[#FBA138] to-[#F15A24] w-full relative" />

              {/* Overlapping Avatar */}
              <div className="px-6 text-center">
                <div className="relative inline-block -mt-12 sm:-mt-14 mb-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    title="Click to change photo (no modal)"
                    className="w-22 h-22 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white mx-auto cursor-pointer relative group"
                  >
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span className="text-[10px] font-medium">Change</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* User Identity */}
                <h2 className="text-[18px] sm:text-[19px] font-bold text-[#1A130E] leading-snug">
                  {profile.name}
                </h2>
                <p className="text-[13px] text-[#777777] font-normal mt-0.5">
                  {profile.email}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-[#F0F0F0] mt-6" />

              {/* Navigation Menu List */}
              <nav className="py-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'logout') {
                          setActiveTab('logout');
                        } else {
                          setActiveTab(item.id);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-6 py-3 text-[14px] font-medium transition-all text-left cursor-pointer group ${
                        isActive
                          ? 'text-[#F15A24] font-semibold bg-orange-50/40'
                          : 'text-[#444444] hover:text-[#F15A24] hover:bg-orange-50/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? 'text-[#F15A24]'
                              : 'text-[#666666] group-hover:text-[#F15A24]'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {/* Right Indicator (Orange vertical bar for active tab as seen in screenshot) */}
                      <div className="flex items-center gap-2">
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-orange-100 text-[#F15A24]'
                                : 'bg-neutral-100 text-[#777777]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <div className="w-[3px] h-5 bg-[#F15A24] rounded-full" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* ================= RIGHT CONTENT AREA ================= */}
          <main className="lg:col-span-8 xl:col-span-8 min-w-0">
            {/* Success Toast / Notification */}
            {saveSuccessMsg && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-medium flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Profile details have been updated successfully!</span>
              </div>
            )}

            {/* TAB 1: CHANGE PROFILE (Exact match to screenshot with 1-click inline editing) */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Header Title with Orange Accent Line */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="w-7 h-[3px] bg-[#F15A24] rounded-full mb-2" />
                    <h1 className="text-xl sm:text-2xl font-bold text-[#1A130E]">
                      Change Profile
                    </h1>
                  </div>

                  {/* 1-Click Master Edit / View Toggle */}
                  {!isEditingProfile ? (
                    <button
                      onClick={handleStartEdit}
                      className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-xs hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveProfile}
                        className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-xs hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 rounded-xl text-[13px] font-semibold border border-[#E5E5E5] text-[#666666] hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Inline Editing Notice Banner */}
                {isEditingProfile && (
                  <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200/80 text-[#F15A24] text-[13px] font-medium flex items-center justify-between">
                    <span>
                      Inline edit mode active: edit any detail directly below without modals.
                    </span>
                    <button
                      onClick={handleCancelEdit}
                      className="text-xs underline font-bold ml-2 cursor-pointer"
                    >
                      Discard
                    </button>
                  </div>
                )}

                {/* 4 Cards (Name, Email, Phone Number, Password) */}
                <div className="space-y-3.5">
                  {/* CARD 1: NAME */}
                  <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 sm:p-6 shadow-xs transition-all hover:border-[#F15A24]/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-[14px] font-bold text-[#1A130E]">
                          <User className="w-4 h-4 text-[#F15A24]" />
                          <span>Name :</span>
                        </div>

                        {!isEditingProfile ? (
                          <p className="text-[14px] text-[#555555] font-normal pl-6 mt-1">
                            {profile.name}
                          </p>
                        ) : (
                          <div className="pl-6 mt-2">
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({ ...editForm, name: e.target.value })
                              }
                              placeholder="Your full name"
                              className="w-full max-w-lg bg-neutral-50/70 border border-[#E5E5E5] focus:bg-white focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24] rounded-xl px-4 py-2 text-[14px] text-[#1A130E] outline-none transition-all"
                            />
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 pl-6 sm:pl-0">
                        {!isEditingProfile ? (
                          <button
                            onClick={handleStartEdit}
                            className="px-5 py-1.5 rounded-full border border-[#F15A24] text-[#F15A24] text-[13px] font-semibold hover:bg-[#F15A24] hover:text-white transition-all cursor-pointer"
                          >
                            Edit
                          </button>
                        ) : (
                          <span className="text-[12px] text-orange-500 font-semibold px-2.5 py-1 bg-orange-50 rounded-full border border-orange-200">
                            Editing
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: EMAIL */}
                  <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 sm:p-6 shadow-xs transition-all hover:border-[#F15A24]/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-[14px] font-bold text-[#1A130E]">
                          <Mail className="w-4 h-4 text-[#F15A24]" />
                          <span>Email :</span>
                        </div>

                        {!isEditingProfile ? (
                          <p className="text-[14px] text-[#555555] font-normal pl-6 mt-1">
                            {profile.email}
                          </p>
                        ) : (
                          <div className="pl-6 mt-2">
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) =>
                                setEditForm({ ...editForm, email: e.target.value })
                              }
                              placeholder="Your email address"
                              className="w-full max-w-lg bg-neutral-50/70 border border-[#E5E5E5] focus:bg-white focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24] rounded-xl px-4 py-2 text-[14px] text-[#1A130E] outline-none transition-all"
                            />
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 pl-6 sm:pl-0">
                        {!isEditingProfile ? (
                          <button
                            onClick={handleStartEdit}
                            className="px-5 py-1.5 rounded-full border border-[#F15A24] text-[#F15A24] text-[13px] font-semibold hover:bg-[#F15A24] hover:text-white transition-all cursor-pointer"
                          >
                            Change
                          </button>
                        ) : (
                          <span className="text-[12px] text-orange-500 font-semibold px-2.5 py-1 bg-orange-50 rounded-full border border-orange-200">
                            Editing
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: PHONE NUMBER */}
                  <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 sm:p-6 shadow-xs transition-all hover:border-[#F15A24]/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-[14px] font-bold text-[#1A130E]">
                          <Phone className="w-4 h-4 text-[#F15A24]" />
                          <span>Phone Number :</span>
                        </div>

                        {!isEditingProfile ? (
                          <p className="text-[14px] text-[#555555] font-normal pl-6 mt-1">
                            {profile.phone}
                          </p>
                        ) : (
                          <div className="pl-6 mt-2">
                            <input
                              type="tel"
                              value={editForm.phone}
                              onChange={(e) =>
                                setEditForm({ ...editForm, phone: e.target.value })
                              }
                              placeholder="Your phone number"
                              className="w-full max-w-lg bg-neutral-50/70 border border-[#E5E5E5] focus:bg-white focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24] rounded-xl px-4 py-2 text-[14px] text-[#1A130E] outline-none transition-all"
                            />
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 pl-6 sm:pl-0">
                        {!isEditingProfile ? (
                          <button
                            onClick={handleStartEdit}
                            className="px-5 py-1.5 rounded-full border border-[#F15A24] text-[#F15A24] text-[13px] font-semibold hover:bg-[#F15A24] hover:text-white transition-all cursor-pointer"
                          >
                            Change
                          </button>
                        ) : (
                          <span className="text-[12px] text-orange-500 font-semibold px-2.5 py-1 bg-orange-50 rounded-full border border-orange-200">
                            Editing
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CARD 4: PASSWORD */}
                  <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 sm:p-6 shadow-xs transition-all hover:border-[#F15A24]/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-[14px] font-bold text-[#1A130E]">
                          <Lock className="w-4 h-4 text-[#F15A24]" />
                          <span>Password :</span>
                        </div>

                        {!isEditingProfile ? (
                          <p className="text-[14px] text-[#555555] font-normal pl-6 mt-1 tracking-widest">
                            {profile.password}
                          </p>
                        ) : (
                          <div className="pl-6 mt-2 relative w-full max-w-lg">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={editForm.newPassword}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  newPassword: e.target.value,
                                })
                              }
                              placeholder="Enter new password (optional)"
                              className="w-full bg-neutral-50/70 border border-[#E5E5E5] focus:bg-white focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24] rounded-xl px-4 py-2 pr-11 text-[14px] text-[#1A130E] outline-none transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#1A130E] p-1 cursor-pointer"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 pl-6 sm:pl-0">
                        {!isEditingProfile ? (
                          <button
                            onClick={handleStartEdit}
                            className="px-5 py-1.5 rounded-full border border-[#F15A24] text-[#F15A24] text-[13px] font-semibold hover:bg-[#F15A24] hover:text-white transition-all cursor-pointer"
                          >
                            Change
                          </button>
                        ) : (
                          <span className="text-[12px] text-orange-500 font-semibold px-2.5 py-1 bg-orange-50 rounded-full border border-orange-200">
                            Editing
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save / Cancel Action Buttons at Bottom in Edit Mode */}
                {isEditingProfile && (
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-2.5 rounded-xl font-bold text-[13px] bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-xs hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-5 py-2.5 rounded-xl font-semibold text-[13px] border border-[#E5E5E5] text-[#666666] hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <div className="w-7 h-[3px] bg-[#F15A24] rounded-full mb-2" />
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1A130E]">
                    My Orders
                  </h1>
                  <p className="text-[13px] text-[#666666] mt-0.5">
                    Track active meals or re-order your favorite heritage dishes
                  </p>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-5 sm:p-6 rounded-2xl bg-white border border-[#EBEBEB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-[#F15A24]/40"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-bold text-[15px] sm:text-[16px] text-[#1A130E]">
                              #{order.orderNumber}
                            </span>
                            <span
                              className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                                order.status === 'completed'
                                  ? 'bg-neutral-100 text-[#555555] border border-[#E5E5E5]'
                                  : order.status === 'preparing'
                                  ? 'bg-[#FFF8E7] text-[#D49B37] border border-[#D49B37]/30'
                                  : 'bg-orange-50 text-[#F15A24] border border-orange-200'
                              }`}
                            >
                              {order.status.replace('_', ' ')}
                            </span>
                            <span className="text-[12px] text-[#888888]">
                              {new Date(order.createdAt).toLocaleDateString('en-IE', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <p className="text-[13px] sm:text-[14px] text-[#444444] font-normal leading-relaxed">
                            {order.items.map((i) => `${i.quantity}x ${i.dish.name}`).join(' · ')}
                          </p>

                          <div className="flex items-center gap-3 text-[13px] text-[#666666]">
                            <span className="font-bold text-[#1A130E] text-[16px]">
                              €{order.total.toFixed(2)}
                            </span>
                            <span>•</span>
                            <span className="capitalize">{order.fulfillmentType}</span>
                            {order.deliveryAddress && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-xs">{order.deliveryAddress}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                          <button
                            onClick={() => dispatch(setActiveTrackingOrderId(order.id))}
                            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-white hover:bg-neutral-50 text-[#1A130E] border border-[#E5E5E5] hover:border-[#F15A24] transition-colors cursor-pointer"
                          >
                            Track Delivery
                          </button>
                          <button
                            onClick={() => handleReorder(order)}
                            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-xs hover:opacity-95 flex items-center justify-center gap-1.5 transition-opacity cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Re-order</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-10 text-center border border-[#EBEBEB]">
                    <PackageCheck className="w-12 h-12 text-[#9B8C80] mx-auto mb-3" />
                    <h3 className="font-bold text-[16px] text-[#1A130E] mb-1">
                      No orders placed yet
                    </h3>
                    <p className="text-[14px] text-[#666666] mb-4">
                      Start by exploring our authentic Dublin menu
                    </p>
                    <button
                      onClick={() => router.push('/menu')}
                      className="px-6 py-2.5 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-xs cursor-pointer"
                    >
                      Browse Dublin Menu
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SAVED ADDRESS */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="w-7 h-[3px] bg-[#F15A24] rounded-full mb-2" />
                    <h1 className="text-xl sm:text-2xl font-bold text-[#1A130E]">
                      Saved Address
                    </h1>
                    <p className="text-[13px] text-[#666666] mt-0.5">
                      Manage delivery destinations across Dublin postal districts
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="px-4 py-2 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-xs hover:opacity-95 flex items-center gap-1.5 transition-opacity cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Address</span>
                  </button>
                </div>

                {/* Inline Add Address Form (No Modal) */}
                {isAddingAddress && (
                  <form
                    onSubmit={handleAddAddress}
                    className="p-6 rounded-2xl bg-white border border-[#EBEBEB] space-y-3.5 text-[13px] shadow-sm animate-in fade-in"
                  >
                    <h4 className="font-bold text-[15px] text-[#1A130E]">
                      Add New Dublin Address
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {['Home', 'Office', 'Other'].map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setNewLabel(label)}
                          className={`p-2.5 rounded-xl text-[13px] font-semibold border transition-all cursor-pointer ${
                            newLabel === label
                              ? 'bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white border-transparent'
                              : 'bg-white text-[#555555] border-[#E5E5E5]'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#1A130E] mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 18 South William St, Apt 4"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        className="w-full bg-neutral-50 border border-[#E5E5E5] focus:bg-white rounded-xl px-3.5 py-2.5 text-[14px] text-[#1A130E] focus:outline-none focus:border-[#F15A24]"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#1A130E] mb-1">
                        Eircode
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="D02 P682"
                        value={newEircode}
                        onChange={(e) => setNewEircode(e.target.value.toUpperCase())}
                        className="w-full bg-neutral-50 border border-[#E5E5E5] focus:bg-white rounded-xl px-3.5 py-2.5 text-[14px] text-[#1A130E] focus:outline-none focus:border-[#F15A24] uppercase"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-xs hover:opacity-95 cursor-pointer"
                      >
                        Save Destination
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#666666] hover:text-[#1A130E] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Address Cards List */}
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 rounded-2xl bg-white border border-[#EBEBEB] flex items-start justify-between gap-3 shadow-xs hover:border-[#F15A24]/30 transition-all"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-full bg-orange-50 text-[#F15A24] flex items-center justify-center shrink-0 border border-orange-200/60 mt-0.5">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[14px] text-[#1A130E]">
                              {addr.label}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-orange-50 text-[#F15A24] px-2 py-0.5 rounded-full font-semibold border border-orange-200">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] text-[#444444] mt-0.5">{addr.address}</p>
                          <span className="text-[12px] text-[#888888] block">{addr.eircode}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-[12px] text-[#F15A24] hover:underline font-semibold cursor-pointer"
                          >
                            Make Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-[#888888] hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SAVED CARD */}
            {activeTab === 'cards' && (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="w-7 h-[3px] bg-[#F15A24] rounded-full mb-2" />
                    <h1 className="text-xl sm:text-2xl font-bold text-[#1A130E]">
                      Saved Card
                    </h1>
                    <p className="text-[13px] text-[#666666] mt-0.5">
                      Encrypted payment methods for 1-click Dublin takeaway checkout
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingCard(!isAddingCard)}
                    className="px-4 py-2 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-xs hover:opacity-95 flex items-center gap-1.5 transition-opacity cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Card</span>
                  </button>
                </div>

                {/* Inline Add Card Form (No Modal) */}
                {isAddingCard && (
                  <form
                    onSubmit={handleAddCard}
                    className="p-6 rounded-2xl bg-white border border-[#EBEBEB] space-y-3.5 text-[13px] shadow-sm animate-in fade-in"
                  >
                    <h4 className="font-bold text-[15px] text-[#1A130E]">
                      Add New Credit / Debit Card
                    </h4>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#1A130E] mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newCardHolder}
                        onChange={(e) => setNewCardHolder(e.target.value)}
                        placeholder="Mark Jecno"
                        className="w-full bg-neutral-50 border border-[#E5E5E5] focus:bg-white rounded-xl px-3.5 py-2.5 text-[14px] text-[#1A130E] focus:outline-none focus:border-[#F15A24]"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#1A130E] mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        value={newCardNumber}
                        onChange={(e) => setNewCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• 4242"
                        className="w-full bg-neutral-50 border border-[#E5E5E5] focus:bg-white rounded-xl px-3.5 py-2.5 text-[14px] text-[#1A130E] focus:outline-none focus:border-[#F15A24]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[12px] font-semibold text-[#1A130E] mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={newCardExp}
                          onChange={(e) => setNewCardExp(e.target.value)}
                          placeholder="12/28"
                          className="w-full bg-neutral-50 border border-[#E5E5E5] focus:bg-white rounded-xl px-3.5 py-2.5 text-[14px] text-[#1A130E] focus:outline-none focus:border-[#F15A24]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-[#1A130E] mb-1">
                          CVV Security Code
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={newCardCvv}
                          onChange={(e) => setNewCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-neutral-50 border border-[#E5E5E5] focus:bg-white rounded-xl px-3.5 py-2.5 text-[14px] text-[#1A130E] focus:outline-none focus:border-[#F15A24]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-xs hover:opacity-95 cursor-pointer"
                      >
                        Save Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingCard(false)}
                        className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#666666] hover:text-[#1A130E] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Cards List */}
                <div className="space-y-3">
                  {savedCards.map((card) => (
                    <div
                      key={card.id}
                      className="p-5 rounded-2xl bg-white border border-[#EBEBEB] flex items-center justify-between gap-4 shadow-xs hover:border-[#F15A24]/30 transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-8 rounded-lg bg-neutral-100 border border-[#E5E5E5] flex items-center justify-center font-bold text-[11px] text-[#333333] tracking-wider uppercase">
                          {card.cardType}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[14px] text-[#1A130E]">
                              •••• •••• •••• {card.last4}
                            </span>
                            {card.isDefault && (
                              <span className="text-[10px] bg-orange-50 text-[#F15A24] px-2 py-0.5 rounded-full font-semibold border border-orange-200">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-[#777777] mt-0.5">
                            Expires {card.expMonth}/{card.expYear} · {card.holder}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {!card.isDefault && (
                          <button
                            onClick={() => handleSetDefaultCard(card.id)}
                            className="text-[12px] text-[#F15A24] hover:underline font-semibold cursor-pointer"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="text-[#888888] hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: HELP & SUPPORT */}
            {activeTab === 'help' && (
              <div className="space-y-6">
                <div>
                  <div className="w-7 h-[3px] bg-[#F15A24] rounded-full mb-2" />
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1A130E]">
                    Help & Dublin Support
                  </h1>
                  <p className="text-[13px] text-[#666666] mt-0.5">
                    Clear answers on delivery, dietary certifications, and orders
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* FAQs */}
                  <div className="md:col-span-7 space-y-3">
                    {faqs.map((faq, idx) => {
                      const isOpen = openFaq === idx;
                      return (
                        <div
                          key={idx}
                          className="bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden shadow-xs"
                        >
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : idx)}
                            className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-[14px] font-semibold text-[#1A130E] cursor-pointer"
                          >
                            <span>{faq.q}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-[#747474] transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-5 text-[13px] text-[#555555] leading-relaxed border-t border-[#F0F0F0] pt-3.5">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Direct Contact Box */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-xs space-y-4">
                      <div className="space-y-2 pb-3 border-b border-[#F0F0F0]">
                        <h4 className="font-bold text-[15px] text-[#1A130E]">
                          Dublin Store Supervisor
                        </h4>
                        <p className="text-[13px] text-[#666666]">
                          {RESTAURANT_INFO.location}
                        </p>
                        <div className="flex items-center gap-2 text-[13px] text-[#F15A24] font-semibold pt-1">
                          <Phone className="w-4 h-4" />
                          <span>{RESTAURANT_INFO.phone}</span>
                        </div>
                      </div>

                      {!supportSubmitted ? (
                        <form onSubmit={handleSupportSubmit} className="space-y-3">
                          <div>
                            <label className="block text-[12px] font-semibold text-[#1A130E] mb-1">
                              Subject
                            </label>
                            <select
                              value={supportSubject}
                              onChange={(e) => setSupportSubject(e.target.value)}
                              className="w-full bg-neutral-50 border border-[#E5E5E5] focus:bg-white rounded-xl px-3 py-2 text-[13px] text-[#1A130E] focus:outline-none focus:border-[#F15A24]"
                            >
                              <option value="Order inquiry">Active Order Status Inquiry</option>
                              <option value="Allergen question">Special Allergen Request</option>
                              <option value="Feedback">Feedback or Suggestion</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[12px] font-semibold text-[#1A130E] mb-1">
                              Message
                            </label>
                            <textarea
                              rows={3}
                              required
                              value={supportMessage}
                              onChange={(e) => setSupportMessage(e.target.value)}
                              placeholder="How can we help with your order?"
                              className="w-full bg-neutral-50 border border-[#E5E5E5] focus:bg-white rounded-xl p-3 text-[13px] text-[#1A130E] focus:outline-none focus:border-[#F15A24] resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 rounded-xl text-[13px] font-bold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
                          >
                            Send Inquiry
                          </button>
                        </form>
                      ) : (
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                          <h4 className="font-bold text-[14px] text-emerald-800">
                            Message Received
                          </h4>
                          <p className="text-[12px] text-emerald-700">
                            Our team will get back to you shortly.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SETTING */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <div className="w-7 h-[3px] bg-[#F15A24] rounded-full mb-2" />
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1A130E]">
                    Setting
                  </h1>
                  <p className="text-[13px] text-[#666666] mt-0.5">
                    Customize your alerts, receipts, and dining security
                  </p>
                </div>

                <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#F0F0F0]">
                    <div>
                      <h4 className="font-bold text-[14px] text-[#1A130E]">
                        SMS Order Tracking Alerts
                      </h4>
                      <p className="text-[13px] text-[#777777] mt-0.5">
                        Receive instant SMS when driver leaves Dublin kitchen
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.orderSms}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          orderSms: e.target.checked,
                        })
                      }
                      className="w-5 h-5 accent-[#F15A24] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#F0F0F0]">
                    <div>
                      <h4 className="font-bold text-[14px] text-[#1A130E]">
                        Email Delivery Receipts & VAT Invoices
                      </h4>
                      <p className="text-[13px] text-[#777777] mt-0.5">
                        Send detailed PDF invoices directly to {profile.email}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailReceipts}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailReceipts: e.target.checked,
                        })
                      }
                      className="w-5 h-5 accent-[#F15A24] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#F0F0F0]">
                    <div>
                      <h4 className="font-bold text-[14px] text-[#1A130E]">
                        Chef Tariq’s Tasting Specials & Seasonal Promos
                      </h4>
                      <p className="text-[13px] text-[#777777] mt-0.5">
                        Exclusive weekly weekend secret tasting invitations
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.promotions}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          promotions: e.target.checked,
                        })
                      }
                      className="w-5 h-5 accent-[#F15A24] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-[14px] text-[#1A130E]">
                        Two-Factor Authentication (2FA)
                      </h4>
                      <p className="text-[13px] text-[#777777] mt-0.5">
                        Require SMS verification code on account login
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.twoFactor}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          twoFactor: e.target.checked,
                        })
                      }
                      className="w-5 h-5 accent-[#F15A24] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: LOG OUT */}
            {activeTab === 'logout' && (
              <div className="space-y-6">
                <div>
                  <div className="w-7 h-[3px] bg-[#F15A24] rounded-full mb-2" />
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1A130E]">
                    Log Out
                  </h1>
                </div>

                <div className="bg-white border border-[#EBEBEB] rounded-2xl p-8 shadow-xs text-center max-w-md mx-auto space-y-4">
                  <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                    <LogOut className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[17px] text-[#1A130E]">
                      Sign out of AMBER SPICE?
                    </h3>
                    <p className="text-[13px] text-[#666666] mt-1">
                      You will need to sign back in to access saved addresses and past orders.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex-1 py-2.5 rounded-xl text-[13px] font-bold bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Yes, Sign Out
                    </button>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold border border-[#E5E5E5] text-[#555555] hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      Stay Logged In
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Customize Modal for Saved Dishes */}
      <ModifierModal
        dish={selectedDishForCustomize}
        onClose={() => setSelectedDishForCustomize(null)}
      />
    </div>
  );
}
