'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToCart, setCartOpen } from '@/redux/slices/cartSlice';
import { setActiveTrackingOrderId } from '@/redux/slices/orderSlice';
import { logout } from '@/redux/slices/authSlice';
import { MenuItem, MOCK_USER } from '@/Mockdata';
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
  LogOut,
  Camera,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus,
  Home,
  Briefcase,
  KeyRound,
  Bell,
  Sparkles,
  Clock,
  Edit3,
} from 'lucide-react';

type TabType = 'profile' | 'orders' | 'addresses' | 'payment' | 'security' | 'notifications' | 'logout';

interface SavedCardItem {
  id: string;
  cardType: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expMonth: string;
  expYear: string;
  holder: string;
  isDefault?: boolean;
}

interface AddressItem {
  id: string;
  label: string;
  address: string;
  phone?: string;
  isDefault?: boolean;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const { user } = useAppSelector((state) => state.auth);

  const tabParam = searchParams.get('tab') as TabType | null;
  const validTab = tabParam && ['profile', 'orders', 'addresses', 'payment', 'security', 'notifications', 'logout'].includes(tabParam) ? tabParam : null;
  const [userTab, setUserTab] = useState<TabType | null>(null);
  const activeTab: TabType = userTab ?? validTab ?? 'profile';
  const setActiveTab = (tab: TabType | ((prev: TabType) => TabType)) => {
    if (typeof tab === 'function') {
      setUserTab(tab(activeTab));
    } else {
      setUserTab(tab);
    }
  };
  const [selectedDishForCustomize, setSelectedDishForCustomize] = useState<MenuItem | null>(null);

  // Profile data
  const [profile, setProfile] = useState({
    name: user?.name || MOCK_USER?.name || 'Sarah Ahmed',
    email: user?.email || MOCK_USER?.email || 'sarah.ahmed@dublin.ie',
    phone: user?.phone || MOCK_USER?.phone || '+353 87 555 1234',
    password: '••••••••',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  });

  // Profile Inline Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || MOCK_USER?.name || 'Sarah Ahmed',
    email: user?.email || MOCK_USER?.email || 'sarah.ahmed@dublin.ie',
    phone: user?.phone || MOCK_USER?.phone || '+353 87 555 1234',
  });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Update State (in Password & Security Tab)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Address management state - 1 Default Dublin Address
  const [addresses, setAddresses] = useState<AddressItem[]>([
    {
      id: 'addr-1',
      label: 'Home',
      address: '18 South William St, Dublin 2, D02 HR58, Ireland',
      isDefault: true,
    },
  ]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newAddress, setNewAddress] = useState('');

  // Editing single address inline
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editAddressData, setEditAddressData] = useState({ label: '', address: '' });

  // Payment cards state (in Payment Option Tab)
  const [savedCards, setSavedCards] = useState<SavedCardItem[]>([
    {
      id: 'card-1',
      cardType: 'visa',
      last4: '4242',
      expMonth: '08',
      expYear: '28',
      holder: "Liam O'Connor",
      isDefault: true,
    },
  ]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardHolder, setNewCardHolder] = useState("Liam O'Connor");
  const [newCardExp, setNewCardExp] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [cardSuccessMsg, setCardSuccessMsg] = useState(false);

  // Sample Dublin Takeaway Orders
  const [mockOrders] = useState([
    {
      id: 'ord-mcd',
      brand: "Mcdonald's",
      transactionId: '#ACB12345458',
      date: 'Today, 3:00 PM',
      totalAmount: 40.0,
      currency: '$',
      logo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=120&q=80',
      itemsSummary: '2x Big Mac Meal, 1x 9pc McNuggets, 1x Large Fries',
    },
    {
      id: 'ord-sbx',
      brand: 'Starbucks',
      transactionId: '#ACB12345459',
      date: 'Yesterday, 6:00 PM',
      totalAmount: 100.0,
      currency: '$',
      logo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=120&q=80',
      itemsSummary: '3x Caramel Macchiato, 2x Butter Croissant, 1x Cold Brew',
    },
    {
      id: 'ord-pzh',
      brand: 'Pizza Hut',
      transactionId: '#ACB12345678',
      date: '25 March 2026, 8:00 PM',
      totalAmount: 60.0,
      currency: '$',
      logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=120&q=80',
      itemsSummary: '1x Stuffed Crust Pepperoni Feast, 1x Garlic Breadsticks',
    },
    {
      id: 'ord-bk',
      brand: 'Burger King',
      transactionId: '#ACB12345679',
      date: '20 March 2026, 2:00 PM',
      totalAmount: 45.0,
      currency: '$',
      logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=120&q=80',
      itemsSummary: '2x Flame-Grilled Whopper, 1x Onion Rings, 2x Coke Zero',
    },
  ]);

  // Notification Preferences toggles
  const [notifications, setNotifications] = useState({
    orderSms: true,
    emailReceipts: true,
    kitchenUpdates: true,
    offers: true,
    twoFactor: false,
  });

  // Profile Edit Handlers
  const handleStartEdit = () => {
    setEditForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
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
    }));
    setIsEditingProfile(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3500);
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

  // Password Change Handler
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    // Success
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  // Address Handlers
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress) return;

    const newEntry: AddressItem = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      address: newAddress,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, newEntry]);
    setNewAddress('');
    setIsAddingAddress(false);
  };

  const handleStartEditAddress = (addr: AddressItem) => {
    setEditingAddressId(addr.id);
    setEditAddressData({ label: addr.label, address: addr.address });
  };

  const handleSaveEditAddress = (id: string) => {
    setAddresses(
      addresses.map((a) =>
        a.id === id
          ? {
              ...a,
              label: editAddressData.label.trim() || a.label,
              address: editAddressData.address.trim() || a.address,
            }
          : a
      )
    );
    setEditingAddressId(null);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  // Card Handlers (in Payment Option Tab)
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
    setCardSuccessMsg(true);
    setTimeout(() => setCardSuccessMsg(false), 3000);
  };

  const handleDeleteCard = (id: string) => {
    setSavedCards(savedCards.filter((c) => c.id !== id));
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  // Navigation Items
  const navigationItems = [
    { id: 'profile' as TabType, label: 'Edit Profile', icon: User },
    { id: 'orders' as TabType, label: 'My Order', icon: ShoppingBag },
    { id: 'addresses' as TabType, label: 'Saved Address', icon: MapPin },
    { id: 'payment' as TabType, label: 'Payment Option', icon: CreditCard },
    { id: 'security' as TabType, label: 'Password & Security', icon: Lock },
    { id: 'notifications' as TabType, label: 'Notification Preferences', icon: Bell },
    { id: 'logout' as TabType, label: 'Log Out', icon: LogOut },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F6] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Responsive Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT SIDEBAR CARD ================= */}
          <aside className="lg:col-span-4 xl:col-span-4">
            <div className="bg-white border border-[#EFEAE4] rounded-[20px] shadow-[0_4px_24px_rgba(26,19,14,0.03)] overflow-hidden">
              {/* Sunset Citrus Gradient Banner Header */}
              <div className="h-28 sm:h-32 bg-gradient-to-r from-[#FFA940] via-[#FA822D] to-[#F15A24] w-full relative" />

              {/* Overlapping Avatar with Crisp White Frame */}
              <div className="px-6 text-center">
                <div className="relative inline-block -mt-12 sm:-mt-14 mb-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-22 h-22 sm:w-24 sm:h-24 rounded-full border-[3.5px] border-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] overflow-hidden bg-white mx-auto cursor-pointer relative group"
                  >
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span className="text-[10px] font-semibold tracking-wide">Change</span>
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
                <h2 className="text-[18px] sm:text-[19px] font-bold text-[#1A130E] tracking-tight leading-snug">
                  {profile.name}
                </h2>
                <p className="text-[13px] text-[#8C8681] font-normal mt-0.5">
                  {profile.email}
                </p>
              </div>

              {/* Clean Subtle Separator */}
              <div className="border-t border-[#F2EFE9] mt-6" />

              {/* Navigation Menu List */}
              <nav className="py-2.5">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'logout') {
                          handleLogout();
                          return;
                        }
                        setActiveTab(item.id);
                      }}
                      className={`w-full flex items-center justify-between px-6 py-3.5 text-[14px] transition-all text-left cursor-pointer group relative ${
                        isActive
                          ? 'text-[#F15A24] font-semibold bg-gradient-to-r from-orange-50/70 to-transparent'
                          : 'text-[#55504A] hover:text-[#F15A24] hover:bg-[#FFF9F5] font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <Icon
                          className={`w-[17px] h-[17px] transition-colors ${
                            isActive
                              ? 'text-[#F15A24]'
                              : 'text-[#7A746E] group-hover:text-[#F15A24]'
                          }`}
                        />
                        <span className="tracking-[-0.01em]">{item.label}</span>
                      </div>

                      {/* Right Indicator (Orange vertical bar for active tab) */}
                      {isActive && (
                        <div className="w-[3px] h-6 bg-[#F15A24] rounded-full shrink-0" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* ================= RIGHT CONTENT AREA ================= */}
          <main className="lg:col-span-8 xl:col-span-8 min-w-0">
            {/* Global Success Notification */}
            {saveSuccessMsg && (
              <div className="mb-5 p-4 rounded-[14px] bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[13px] font-medium flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Profile details updated successfully.</span>
              </div>
            )}

            {/* TAB 1: EDIT PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Header Title with Orange Accent Line and Master Edit Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                  <div>
                    <div className="w-9 h-[3px] bg-[#F15A24] rounded-full mb-2.5" />
                    <h1 className="text-[22px] sm:text-[25px] font-extrabold text-[#1A130E] tracking-tight">
                      Personal Profile
                    </h1>
                    <p className="text-[13px] text-[#8C8681] mt-0.5 font-normal">
                      Manage your personal credentials, contact points, and verified account information.
                    </p>
                  </div>

                  {!isEditingProfile ? (
                    <button
                      onClick={handleStartEdit}
                      className="self-start sm:self-auto px-5 py-2.5 rounded-xl text-[12.5px] font-semibold bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white shadow-xs hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="self-start sm:self-auto px-4 py-2 rounded-xl text-[12.5px] font-semibold border border-[#E5DFD7] text-[#666059] hover:bg-[#FAF8F5] transition-all cursor-pointer"
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>

                {/* Main Profile Container */}
                <div className="bg-white border border-[#EFEAE4] rounded-[24px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,19,14,0.02)]">
                  {!isEditingProfile ? (
                    /* View Mode: Single Unified Container with Standard Spacing */
                    <div className="divide-y divide-[#F2EFEA]">
                      {/* Full Name */}
                      <div className="py-5 first:pt-0 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50/80 text-[#F15A24] flex items-center justify-center shrink-0 border border-orange-100/80">
                          <User className="w-5 h-5 text-[#F15A24]" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E968F] block">
                            Full Name
                          </span>
                          <span className="text-[16px] sm:text-[17px] font-bold text-[#1A130E] mt-0.5 block">
                            {profile.name}
                          </span>
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="py-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50/80 text-[#D49B37] flex items-center justify-center shrink-0 border border-amber-100/80">
                          <Mail className="w-5 h-5 text-[#D49B37]" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E968F] block">
                            Email Address
                          </span>
                          <span className="text-[16px] sm:text-[17px] font-bold text-[#1A130E] mt-0.5 block break-all">
                            {profile.email}
                          </span>
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="py-5 last:pb-0 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50/80 text-[#0FA958] flex items-center justify-center shrink-0 border border-emerald-100/80">
                          <Phone className="w-5 h-5 text-[#0FA958]" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E968F] block">
                            Phone Number
                          </span>
                          <span className="text-[16px] sm:text-[17px] font-bold text-[#1A130E] mt-0.5 block">
                            {profile.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Edit Mode: Clean Form */
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="space-y-5">
                        {/* Name Input */}
                        <div>
                          <label className="flex items-center gap-2 text-[13px] font-bold text-[#1A130E] mb-2">
                            <User className="w-4 h-4 text-[#F15A24]" />
                            <span>Full Name</span>
                          </label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            placeholder="Your full name"
                            required
                            className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 rounded-xl px-4 py-3 text-[14px] text-[#1A130E] font-medium outline-none transition-all shadow-2xs"
                          />
                        </div>

                        {/* Email Input */}
                        <div>
                          <label className="flex items-center gap-2 text-[13px] font-bold text-[#1A130E] mb-2">
                            <Mail className="w-4 h-4 text-[#F15A24]" />
                            <span>Email Address</span>
                          </label>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) =>
                              setEditForm({ ...editForm, email: e.target.value })
                            }
                            placeholder="Your email address"
                            required
                            className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 rounded-xl px-4 py-3 text-[14px] text-[#1A130E] font-medium outline-none transition-all shadow-2xs"
                          />
                        </div>

                        {/* Phone Number Input */}
                        <div>
                          <label className="flex items-center gap-2 text-[13px] font-bold text-[#1A130E] mb-2">
                            <Phone className="w-4 h-4 text-[#F15A24]" />
                            <span>Phone Number</span>
                          </label>
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) =>
                              setEditForm({ ...editForm, phone: e.target.value })
                            }
                            placeholder="Your phone number"
                            required
                            className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 rounded-xl px-4 py-3 text-[14px] text-[#1A130E] font-medium outline-none transition-all shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 flex items-center gap-3 border-t border-[#F2EFEA]">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl font-bold text-[13px] bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white shadow-xs hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-5 py-2.5 rounded-xl font-semibold text-[13px] border border-[#E5DFD7] text-[#666059] hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: MY ORDERS & ORDER DETAILS PAGE */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <div className="w-8 h-[2.5px] bg-[#F15A24] rounded-full mb-2.5" />
                  <h1 className="text-[22px] sm:text-[24px] font-bold text-[#1A130E] tracking-tight">
                    My Order
                  </h1>
                </div>

                {/* Real-time Orders from Redux */}
                {orders.length > 0 && (
                  <div className="space-y-4 mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C8681]">
                      Live Dublin Kitchen Deliveries
                    </h3>
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white border border-[#EFEAE4] rounded-[18px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(26,19,14,0.02)] hover:border-[#F15A24]/30 hover:shadow-[0_4px_20px_rgba(241,90,36,0.05)] transition-all cursor-pointer"
                        onClick={() => {
                          dispatch(setActiveTrackingOrderId(null));
                          router.push('/order-details/' + (order.orderNumber || order.id));
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFA940] to-[#F15A24] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                              AS
                            </div>
                            <div>
                              <h3 className="text-[16px] font-bold text-[#1A130E]">
                                AMBER SPICE Dublin
                              </h3>
                              <p className="text-[12.5px] text-[#8C8681] font-medium mt-0.5">
                                Transaction Id :{' '}
                                <span className="font-semibold text-[#1A130E]">
                                  #{order.orderNumber}
                                </span>
                              </p>
                            </div>
                          </div>
                          <span className="text-[12px] text-[#8C8681] font-medium">
                            {new Date(order.createdAt).toLocaleDateString('en-IE', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="border-b border-dashed border-[#EAE6E1] my-4" />

                        <div className="flex items-center justify-between gap-4 pt-1">
                          <p className="text-[14px] text-[#1A130E]">
                            <span className="text-[#666059] font-medium">Total Amount : </span>
                            <span className="font-bold text-[16px]">
                              € {order.total.toFixed(2)}
                            </span>
                          </p>

                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                dispatch(setActiveTrackingOrderId(null));
                                router.push('/order-details/' + (order.orderNumber || order.id));
                              }}
                              className="px-5 py-1.5 rounded-xl border border-[#F15A24] text-[#F15A24] text-[12.5px] font-semibold tracking-wide hover:bg-[#F15A24] hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
                            >
                              Track
                            </button>
                            <button
                              onClick={() => {
                                order.items.forEach((item) => {
                                  dispatch(
                                    addToCart({
                                      ...item,
                                      cartItemId: `${item.dish.id}-${Date.now()}-${Math.random()}`,
                                    })
                                  );
                                });
                                dispatch(setCartOpen(true));
                              }}
                              className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white text-[12.5px] font-semibold tracking-wide hover:opacity-95 transition-opacity cursor-pointer shadow-xs active:scale-95"
                            >
                              Re-order
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* List of Previous Orders */}
                <div className="space-y-4">
                  {mockOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white border border-[#EFEAE4] rounded-[18px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(26,19,14,0.02)] hover:border-[#F15A24]/30 hover:shadow-[0_4px_20px_rgba(241,90,36,0.05)] transition-all cursor-pointer"
                      onClick={() => {
                        dispatch(setActiveTrackingOrderId(null));
                        router.push('/order-details/' + (ord.transactionId.replace('#', '') || ord.id));
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#EAE6E1] bg-white flex items-center justify-center p-1 shadow-xs shrink-0">
                            <img
                              src={ord.logo}
                              alt={ord.brand}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <div>
                            <h3 className="text-[16px] font-bold text-[#1A130E] tracking-tight">
                              {ord.brand}
                            </h3>
                            <p className="text-[12.5px] text-[#8C8681] font-medium mt-0.5">
                              Transaction Id :{' '}
                              <span className="font-semibold text-[#332E29]">
                                {ord.transactionId}
                              </span>
                            </p>
                          </div>
                        </div>

                        <span className="text-[12.5px] text-[#8C8681] font-medium">
                          {ord.date}
                        </span>
                      </div>

                      <div className="border-b border-dashed border-[#EAE6E1] my-4" />

                      <div className="flex items-center justify-between gap-4 pt-0.5">
                        <p className="text-[14px] text-[#1A130E]">
                          <span className="text-[#666059] font-medium">Total Amount : </span>
                          <span className="font-bold text-[15.5px]">
                            {ord.currency} {ord.totalAmount.toFixed(2)}
                          </span>
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setActiveTrackingOrderId(null));
                            router.push('/order-details/' + (ord.transactionId.replace('#', '') || ord.id));
                          }}
                          className="px-6 py-1.5 rounded-xl border border-[#F15A24] text-[#F15A24] text-[12.5px] font-semibold tracking-wide hover:bg-[#F15A24] hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SAVED ADDRESS */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div>
                  <div className="w-8 h-[2.5px] bg-[#F15A24] rounded-full mb-2.5" />
                  <h1 className="text-[22px] sm:text-[24px] font-bold text-[#1A130E] tracking-tight">
                    Saved Address
                  </h1>
                </div>

                {/* Inline Add Address Form Accordion */}
                {isAddingAddress && (
                  <form
                    onSubmit={handleAddAddress}
                    className="p-6 rounded-[18px] bg-white border border-[#EFEAE4] space-y-4 text-[13px] shadow-[0_4px_20px_rgba(26,19,14,0.03)] animate-in fade-in mb-6"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[15px] text-[#1A130E]">
                        Add New Delivery Address
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="text-xs text-[#8C8681] hover:text-[#1A130E] cursor-pointer"
                      >
                        Close
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      {['Home', 'Office', 'Other'].map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setNewLabel(label)}
                          className={`p-2.5 rounded-xl text-[13px] font-semibold border transition-all cursor-pointer ${
                            newLabel === label
                              ? 'bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white border-transparent shadow-xs'
                              : 'bg-white text-[#55504A] border-[#E5DFD7]'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#1A130E] mb-1">
                        Full Street Address
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 93, Songbird Cir, Blackville, South Carolina, USA-29817"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] rounded-xl px-4 py-2.5 text-[14px] text-[#1A130E] outline-none transition-all"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-[12.5px] font-semibold bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white shadow-xs hover:opacity-95 cursor-pointer active:scale-95"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="px-4 py-2 rounded-xl text-[12.5px] font-semibold text-[#666059] hover:text-[#1A130E] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* 2-Column Standard Grid: 1 Address Card + 1 Add Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {addresses.map((addr) => {
                    const isEditingThis = editingAddressId === addr.id;

                    return (
                      <div
                        key={addr.id}
                        className="bg-white border border-[#EFEAE4] rounded-[20px] p-6 shadow-[0_2px_12px_rgba(26,19,14,0.02)] hover:border-[#F15A24]/30 hover:shadow-[0_4px_20px_rgba(241,90,36,0.05)] transition-all flex flex-col justify-between min-h-[170px]"
                      >
                        {!isEditingThis ? (
                          <>
                            <div>
                              <div className="flex items-center justify-between pb-3.5 border-b border-[#F2EFE9]">
                                <div className="flex items-center gap-2 text-[#F15A24] font-bold text-[14.5px]">
                                  {addr.label.toLowerCase().includes('home') ? (
                                    <Home className="w-4 h-4 text-[#F15A24]" />
                                  ) : addr.label.toLowerCase().includes('office') ? (
                                    <Briefcase className="w-4 h-4 text-[#F15A24]" />
                                  ) : (
                                    <MapPin className="w-4 h-4 text-[#F15A24]" />
                                  )}
                                  <span>{addr.label}</span>
                                  {addr.isDefault && (
                                    <span className="ml-1.5 px-2 py-0.5 rounded-full bg-orange-100/70 text-[#B84A22] text-[10.5px] font-semibold">
                                      Default
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleStartEditAddress(addr)}
                                    className="px-3.5 py-1 rounded-lg bg-orange-50/70 border border-orange-200/60 text-[#F15A24] text-[12px] font-semibold hover:bg-[#F15A24] hover:text-white transition-all cursor-pointer active:scale-95"
                                  >
                                    Edit
                                  </button>
                                  {addresses.length > 1 && (
                                    <button
                                      onClick={() => handleDeleteAddress(addr.id)}
                                      title="Delete address"
                                      className="text-[#A59F98] hover:text-red-600 transition-colors p-1.5 cursor-pointer rounded-lg hover:bg-neutral-50"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <p className="text-[14px] text-[#55504A] font-medium leading-relaxed mt-4">
                                {addr.address}
                              </p>
                            </div>
                          </>
                        ) : (
                          /* Inline Edit Mode */
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[13px] text-[#1A130E]">
                                Edit {addr.label}
                              </span>
                            </div>

                            <input
                              type="text"
                              value={editAddressData.label}
                              onChange={(e) =>
                                setEditAddressData({
                                  ...editAddressData,
                                  label: e.target.value,
                                })
                              }
                              className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white rounded-lg px-3 py-1.5 text-[13px] outline-none"
                              placeholder="Label (e.g. Home, Office)"
                            />

                            <textarea
                              rows={2}
                              value={editAddressData.address}
                              onChange={(e) =>
                                setEditAddressData({
                                  ...editAddressData,
                                  address: e.target.value,
                                })
                              }
                              className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white rounded-lg px-3 py-1.5 text-[13px] outline-none resize-none"
                              placeholder="Address"
                            />

                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => handleSaveEditAddress(addr.id)}
                                className="px-4 py-1 rounded-lg text-xs font-semibold bg-[#F15A24] text-white hover:opacity-90 cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingAddressId(null)}
                                className="px-3 py-1 rounded-lg text-xs font-medium text-[#666059] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add New Address Card Slot - Standard Design */}
                  <div
                    onClick={() => setIsAddingAddress(true)}
                    className="border-2 border-dashed border-[#E5DFD7] hover:border-[#F15A24]/60 bg-[#FCFBF9] hover:bg-orange-50/20 rounded-[20px] p-6 flex flex-col items-center justify-center min-h-[170px] transition-all cursor-pointer group shadow-[0_2px_12px_rgba(26,19,14,0.01)] text-center"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#F15A24] group-hover:bg-[#F15A24] group-hover:text-white border border-orange-200/60 flex items-center justify-center mb-2.5 transition-all shadow-xs group-hover:scale-105">
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-[14px] font-bold text-[#1A130E] group-hover:text-[#F15A24] transition-colors">
                      Add New Address
                    </span>
                    <p className="text-[12px] text-[#8C8681] mt-0.5">
                      Save another delivery location
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PAYMENT OPTION (Dedicated Left Sidebar Section) */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="w-8 h-[2.5px] bg-[#F15A24] rounded-full mb-2.5" />
                    <h1 className="text-[22px] sm:text-[24px] font-bold text-[#1A130E] tracking-tight">
                      Payment Option
                    </h1>
                    <p className="text-[13px] text-[#8C8681] mt-1">
                      Manage your saved credit & debit cards for fast Dublin dining checkout
                    </p>
                  </div>

                  {!isAddingCard && (
                    <button
                      type="button"
                      onClick={() => setIsAddingCard(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white text-[12.5px] font-semibold hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95 self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Add New Card</span>
                    </button>
                  )}
                </div>

                {cardSuccessMsg && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-medium flex items-center gap-2.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Card added successfully!</span>
                  </div>
                )}

                {/* Inline Add Card Form */}
                {isAddingCard && (
                  <form
                    onSubmit={handleAddCard}
                    className="p-6 sm:p-7 rounded-[22px] bg-white border border-[#EFEAE4] space-y-4 text-[13px] shadow-[0_2px_12px_rgba(26,19,14,0.02)] animate-in fade-in"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#F2EFE9]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F15A24] flex items-center justify-center">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-[15px] text-[#1A130E]">
                          Add New Payment Card
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddingCard(false)}
                        className="text-xs text-[#8C8681] hover:text-[#1A130E] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] font-semibold text-[#1A130E] mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newCardHolder}
                          onChange={(e) => setNewCardHolder(e.target.value)}
                          placeholder="Liam O'Connor"
                          className="w-full bg-[#FCFBF9] border border-[#E6E1DC] focus:border-[#F15A24] rounded-xl px-4 py-2.5 text-[13.5px] text-[#1A130E] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-semibold text-[#1A130E] mb-1">
                          16-Digit Card Number
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={newCardNumber}
                          onChange={(e) => setNewCardNumber(e.target.value)}
                          placeholder="•••• •••• •••• 4242"
                          className="w-full bg-[#FCFBF9] border border-[#E6E1DC] focus:border-[#F15A24] rounded-xl px-4 py-2.5 text-[13.5px] text-[#1A130E] outline-none"
                        />
                      </div>

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
                          className="w-full bg-[#FCFBF9] border border-[#E6E1DC] focus:border-[#F15A24] rounded-xl px-4 py-2.5 text-[13.5px] text-[#1A130E] outline-none"
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
                          className="w-full bg-[#FCFBF9] border border-[#E6E1DC] focus:border-[#F15A24] rounded-xl px-4 py-2.5 text-[13.5px] text-[#1A130E] outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl text-[12.5px] font-semibold bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white shadow-xs hover:opacity-95 cursor-pointer active:scale-95"
                      >
                        Save Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingCard(false)}
                        className="px-4 py-2.5 rounded-xl text-[12.5px] font-semibold text-[#666059] hover:text-[#1A130E] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedCards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white border border-[#EFEAE4] rounded-[22px] p-6 hover:border-[#F15A24]/40 transition-all flex flex-col justify-between min-h-[160px] shadow-[0_2px_12px_rgba(26,19,14,0.02)] relative group"
                    >
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-[#F2EFE9]">
                          <div className="flex items-center gap-2 text-[#F15A24] font-bold text-[13.5px] uppercase tracking-wider">
                            <CreditCard className="w-4 h-4 text-[#F15A24]" />
                            <span>{card.cardType}</span>
                          </div>
                          {card.isDefault && (
                            <span className="text-[10.5px] bg-orange-100/70 text-[#F15A24] px-2.5 py-0.5 rounded-full font-semibold border border-orange-200">
                              Default
                            </span>
                          )}
                        </div>

                        <p className="text-[18px] font-bold text-[#1A130E] tracking-widest mt-4 font-mono">
                          •••• •••• •••• {card.last4}
                        </p>
                      </div>

                      <div className="pt-4 flex items-center justify-between text-[12px] text-[#7A746E] border-t border-[#F8F6F2] mt-3">
                        <span className="font-medium">
                          Expires {card.expMonth}/{card.expYear} · {card.holder}
                        </span>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          title="Delete card"
                          className="text-[#A59F98] hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Card dashed trigger button */}
                  {!isAddingCard && (
                    <div
                      onClick={() => setIsAddingCard(true)}
                      className="border-2 border-dashed border-[#E5DFD7] hover:border-[#F15A24]/60 bg-[#FCFBF9] hover:bg-orange-50/20 rounded-[22px] p-6 flex flex-col items-center justify-center min-h-[160px] transition-all cursor-pointer group shadow-[0_2px_12px_rgba(26,19,14,0.01)] text-center"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#F15A24] group-hover:bg-[#F15A24] group-hover:text-white border border-orange-200/60 flex items-center justify-center mb-2.5 transition-all shadow-xs group-hover:scale-105">
                        <Plus className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span className="text-[14px] font-bold text-[#1A130E] group-hover:text-[#F15A24] transition-colors">
                        Add New Card
                      </span>
                      <p className="text-[12px] text-[#8C8681] mt-0.5">
                        Save another payment method
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: PASSWORD & SECURITY (Dedicated Section) */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <div className="w-8 h-[2.5px] bg-[#F15A24] rounded-full mb-2.5" />
                  <h1 className="text-[22px] sm:text-[24px] font-bold text-[#1A130E] tracking-tight">
                    Password & Security
                  </h1>
                  <p className="text-[13px] text-[#8C8681] mt-1">
                    Manage your credentials and secure your Amber Spice diner account
                  </p>
                </div>

                {/* Password Change Card */}
                <div className="bg-white border border-[#EFEAE4] rounded-[24px] p-6 sm:p-8 shadow-[0_2px_12px_rgba(26,19,14,0.02)] space-y-6">
                  <div className="flex items-center justify-between pb-5 border-b border-[#F2EFEA]">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#F15A24] flex items-center justify-center shrink-0 border border-orange-100">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[16px] text-[#1A130E]">
                          Change Password
                        </h3>
                        <p className="text-[13px] text-[#8C8681] mt-0.5">
                          Update your password to keep your account secure
                        </p>
                      </div>
                    </div>
                  </div>

                  {passwordSuccess && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-medium flex items-center gap-2.5 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Password has been changed successfully!</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium flex items-center gap-2.5 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-xl">
                    <div className="space-y-5">
                      {/* Current Password */}
                      <div>
                        <label className="block text-[13px] font-bold text-[#1A130E] mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current account password"
                            required
                            className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 rounded-xl px-4 py-3 pr-11 text-[14px] text-[#1A130E] outline-none transition-all shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C8681] hover:text-[#1A130E] p-1 cursor-pointer transition-colors"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-[13px] font-bold text-[#1A130E] mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password (min. 6 characters)"
                            required
                            className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 rounded-xl px-4 py-3 pr-11 text-[14px] text-[#1A130E] outline-none transition-all shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C8681] hover:text-[#1A130E] p-1 cursor-pointer transition-colors"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label className="block text-[13px] font-bold text-[#1A130E] mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                            className="w-full bg-[#FAF8F5] border border-[#E6E1DC] focus:bg-white focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 rounded-xl px-4 py-3 pr-11 text-[14px] text-[#1A130E] outline-none transition-all shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C8681] hover:text-[#1A130E] p-1 cursor-pointer transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-start">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl font-bold text-[13px] bg-gradient-to-r from-[#FFA940] to-[#F15A24] text-white shadow-xs hover:opacity-95 transition-opacity cursor-pointer active:scale-95"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: NOTIFICATION PREFERENCES (Dedicated Left Sidebar Section) */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <div className="w-8 h-[2.5px] bg-[#F15A24] rounded-full mb-2.5" />
                  <h1 className="text-[22px] sm:text-[24px] font-bold text-[#1A130E] tracking-tight">
                    Notification Preferences
                  </h1>
                  <p className="text-[13px] text-[#8C8681] mt-0.5">
                    Choose the updates and messages you want to receive.
                  </p>
                </div>

                <div className="bg-white border border-[#EFEAE4] rounded-[24px] p-6 sm:p-8 shadow-[0_2px_12px_rgba(26,19,14,0.02)]">
                  <div className="divide-y divide-[#F2EFEA]">
                    {/* SMS Live Order Tracking */}
                    <div className="py-6 first:pt-0 last:pb-0 flex items-center justify-between gap-5 sm:gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F15A24] flex items-center justify-center shrink-0 border border-orange-100">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[15px] sm:text-[16px] text-[#1A130E]">
                            SMS Order Tracking
                          </h4>
                          <p className="text-[13px] text-[#8C8681] mt-0.5">
                            Real-time text alerts when your order is accepted and out for delivery
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={notifications.orderSms}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              orderSms: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#E5DFD7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F15A24]"></div>
                      </label>
                    </div>

                    {/* Email Receipts */}
                    <div className="py-6 flex items-center justify-between gap-5 sm:gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D49B37] flex items-center justify-center shrink-0 border border-amber-100">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[15px] sm:text-[16px] text-[#1A130E]">
                            Email Receipts
                          </h4>
                          <p className="text-[13px] text-[#8C8681] mt-0.5">
                            Digital order receipts and VAT invoices sent to {profile.email}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={notifications.emailReceipts}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              emailReceipts: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#E5DFD7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F15A24]"></div>
                      </label>
                    </div>

                    {/* Kitchen Status Alerts */}
                    <div className="py-6 flex items-center justify-between gap-5 sm:gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F15A24] flex items-center justify-center shrink-0 border border-orange-100">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[15px] sm:text-[16px] text-[#1A130E]">
                            Kitchen Cooking Updates
                          </h4>
                          <p className="text-[13px] text-[#8C8681] mt-0.5">
                            Notifications when the head chef starts preparing and packaging your meal
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={notifications.kitchenUpdates}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              kitchenUpdates: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#E5DFD7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F15A24]"></div>
                      </label>
                    </div>

                    {/* Special Offers & Promotions */}
                    <div className="py-6 last:pb-0 flex items-center justify-between gap-5 sm:gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0FA958] flex items-center justify-center shrink-0 border border-emerald-100">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[15px] sm:text-[16px] text-[#1A130E]">
                            Special Offers & Dining Specials
                          </h4>
                          <p className="text-[13px] text-[#8C8681] mt-0.5">
                            Exclusive seasonal promotions, weekend specials, and loyalty discounts
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={notifications.offers}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              offers: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#E5DFD7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F15A24]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* TAB 5: LOG OUT */}
            {activeTab === 'logout' && (
              <div className="space-y-6">
                <div>
                  <div className="w-8 h-[2.5px] bg-[#F15A24] rounded-full mb-2.5" />
                  <h1 className="text-[22px] sm:text-[24px] font-bold text-[#1A130E] tracking-tight">
                    Log Out
                  </h1>
                </div>

                <div className="bg-white border border-[#EFEAE4] rounded-[18px] p-8 shadow-[0_4px_24px_rgba(26,19,14,0.03)] text-center max-w-md mx-auto space-y-4">
                  <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                    <LogOut className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[17px] text-[#1A130E]">
                      Sign out of AMBER SPICE?
                    </h3>
                    <p className="text-[13px] text-[#7A746E] mt-1">
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
                      className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold border border-[#E5DFD7] text-[#666059] hover:bg-neutral-50 transition-colors cursor-pointer"
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

export default function UserDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF9F6] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#F15A24] border-t-transparent animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
