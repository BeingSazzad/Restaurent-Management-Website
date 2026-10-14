'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToCart, setCartOpen } from '@/redux/slices/cartSlice';
import { setActiveTrackingOrderId } from '@/redux/slices/orderSlice';
import { toggleFavorite } from '@/redux/slices/favoritesSlice';
import { MOCK_USER, MENU_ITEMS, RESTAURANT_INFO, MenuItem } from '@/Mockdata';
import { ModifierModal } from '@/components/shared/ModifierModal';
import {
  MapPin,
  RotateCcw,
  Clock,
  ArrowRight,
  PackageCheck,
  Heart,
  Star,
  User,
  HelpCircle,
  Plus,
  Phone,
  Mail,
  CheckCircle2,
  ChevronDown,
  Trash2,
  ShoppingBag,
} from 'lucide-react';

export default function UserDashboardPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const favoriteDishIds = useAppSelector((state) => state.favorites.favoriteDishIds);

  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'profile' | 'reviews' | 'support'>('orders');
  const [selectedDishForCustomize, setSelectedDishForCustomize] = useState<MenuItem | null>(null);

  // Address management state
  const [addresses, setAddresses] = useState(MOCK_USER.addresses);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newAddress, setNewAddress] = useState('');
  const [newEircode, setNewEircode] = useState('');

  // Support inquiry state
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [supportSubject, setSupportSubject] = useState('Order inquiry');
  const [supportMessage, setSupportMessage] = useState('');

  // FAQs open state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const favoriteDishes = MENU_ITEMS.filter((item) =>
    favoriteDishIds.includes(item.id)
  );

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

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage) return;
    setSupportSubmitted(true);
    setSupportMessage('');
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

  return (
    <div className="min-h-screen bg-[#FAF6EF] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Customer Header Section */}
        <div className="bg-white border border-[#EBE2D7] rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#F3ECE2] text-[#B84A22] flex items-center justify-center font-bold text-2xl border border-[#E9DFD3] shrink-0">
              {MOCK_USER.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1A130E]">{MOCK_USER.name}</h1>
                <span className="text-[11px] bg-[#FAF6EF] text-[#B84A22] font-semibold px-2.5 py-0.5 rounded-full border border-[#EBE2D7]">
                  Verified Diner
                </span>
              </div>
              <p className="text-xs text-[#747474] mt-0.5">{MOCK_USER.email} · {MOCK_USER.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => dispatch(setCartOpen(true))}
              className="btn-amber-primary px-5 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-sm flex-1 md:flex-initial justify-center"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Active Cart</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Orders, Favorites, Profile, Reviews, Support) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none border-b border-[#EBE2D7]">
          {[
            { id: 'orders', label: 'My Orders', icon: PackageCheck, badge: orders.length },
            { id: 'favorites', label: 'Saved Dishes', icon: Heart, badge: favoriteDishIds.length },
            { id: 'profile', label: 'Addresses & Details', icon: User },
            { id: 'reviews', label: 'Reviews & Feedback', icon: Star },
            { id: 'support', label: 'Help & Dublin Support', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-[#B84A22] text-white shadow-sm'
                    : 'bg-white hover:bg-[#FAF6EF] text-[#3D3D3D] border border-[#EBE2D7]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#F3ECE2] text-[#B84A22]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="mb-2">
              <h2 className="text-lg font-bold text-[#1A130E]">Order History & Live Deliveries</h2>
              <p className="text-xs text-[#747474]">Track active meals or re-order your favorite heritage recipes</p>
            </div>

            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-white border border-[#EBE2D7] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-[#B84A22]/40"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-[#1A130E]">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                          order.status === 'completed'
                            ? 'bg-[#F4EDE2] text-[#747474]'
                            : order.status === 'preparing'
                            ? 'bg-[#FFF8E7] text-[#D49B37] border border-[#D49B37]/30'
                            : 'bg-[#F3ECE2] text-[#B84A22] border border-[#E9DFD3]'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-[#9B8C80]">
                        {new Date(order.createdAt).toLocaleDateString('en-IE', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-[#3D3D3D] font-normal leading-relaxed">
                      {order.items.map((i) => `${i.quantity}x ${i.dish.name}`).join(' · ')}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[#747474]">
                      <span className="font-bold text-[#B84A22] text-sm">
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
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-full text-xs font-semibold bg-[#FAF6EF] hover:bg-[#F3ECE2] text-[#3D3D3D] border border-[#EBE2D7] transition-colors"
                    >
                      Track Delivery
                    </button>
                    <button
                      onClick={() => handleReorder(order)}
                      className="flex-1 sm:flex-initial btn-amber-primary px-4 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-order</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#EBE2D7]">
                <PackageCheck className="w-12 h-12 text-[#9B8C80] mx-auto mb-3" />
                <h3 className="font-bold text-sm text-[#1A130E] mb-1">No orders placed yet</h3>
                <p className="text-xs text-[#747474] mb-4">Start by exploring our authentic Dublin menu</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FAVORITES & SAVED DISHES */}
        {activeTab === 'favorites' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#1A130E]">My Saved Culinary Favorites</h2>
              <p className="text-xs text-[#747474]">Heart your favorite dishes across the menu to quickly re-order anytime</p>
            </div>

            {favoriteDishes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favoriteDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="amber-card bg-white border border-[#EBE2D7] rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/11] bg-[#F3ECE2]">
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => dispatch(toggleFavorite(dish.id))}
                        aria-label="Remove favorite"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-[#EBE2D7] flex items-center justify-center text-[#B84A22] shadow-sm hover:scale-110 transition-transform"
                      >
                        <Heart className="w-4 h-4 fill-[#B84A22]" />
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-sm text-[#1A130E] line-clamp-1 mb-1">{dish.name}</h3>
                        <p className="text-xs text-[#747474] line-clamp-2 mb-3">{dish.description}</p>
                      </div>

                      <div className="pt-2 border-t border-[#F0E8DE] flex items-center justify-between">
                        <span className="font-bold text-sm text-[#1A130E]">€{dish.price.toFixed(2)}</span>
                        <button
                          onClick={() => setSelectedDishForCustomize(dish)}
                          className="btn-amber-primary px-3 py-1.5 text-xs font-semibold flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Order</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#EBE2D7]">
                <Heart className="w-12 h-12 text-[#9B8C80] mx-auto mb-3" />
                <h3 className="font-bold text-sm text-[#1A130E] mb-1">Your wishlist is empty</h3>
                <p className="text-xs text-[#747474] mb-4">Click the heart icon on any dish in the menu to save it here</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADDRESSES & PROFILE */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-bold text-[#1A130E]">Saved Delivery Addresses</h2>
                  <p className="text-xs text-[#747474]">Manage your delivery destinations across Dublin</p>
                </div>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="btn-amber-primary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              </div>

              {/* Add Address Form Accordion */}
              {isAddingAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="p-5 rounded-2xl bg-white border border-[#B84A22] space-y-3 text-xs shadow-sm"
                >
                  <h4 className="font-bold text-[#1A130E]">Add New Dublin Address</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewLabel('Home')}
                      className={`p-2 rounded-xl text-xs font-semibold border ${
                        newLabel === 'Home'
                          ? 'bg-[#B84A22] text-white border-[#B84A22]'
                          : 'bg-[#FAF6EF] text-[#747474] border-[#EBE2D7]'
                      }`}
                    >
                      Home
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewLabel('Office')}
                      className={`p-2 rounded-xl text-xs font-semibold border ${
                        newLabel === 'Office'
                          ? 'bg-[#B84A22] text-white border-[#B84A22]'
                          : 'bg-[#FAF6EF] text-[#747474] border-[#EBE2D7]'
                      }`}
                    >
                      Office
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewLabel('Other')}
                      className={`p-2 rounded-xl text-xs font-semibold border ${
                        newLabel === 'Other'
                          ? 'bg-[#B84A22] text-white border-[#B84A22]'
                          : 'bg-[#FAF6EF] text-[#747474] border-[#EBE2D7]'
                      }`}
                    >
                      Other
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#747474] mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 18 South William St, Apt 4"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full bg-[#FAF6EF] border border-[#EBE2D7] rounded-xl px-3 py-2 text-xs text-[#3D3D3D] focus:outline-none focus:border-[#B84A22]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#747474] mb-1">Eircode</label>
                    <input
                      type="text"
                      required
                      placeholder="D02 P682"
                      value={newEircode}
                      onChange={(e) => setNewEircode(e.target.value.toUpperCase())}
                      className="w-full bg-[#FAF6EF] border border-[#EBE2D7] rounded-xl px-3 py-2 text-xs text-[#3D3D3D] focus:outline-none focus:border-[#B84A22] uppercase"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button type="submit" className="btn-amber-primary px-4 py-2 text-xs font-semibold">
                      Save Destination
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#747474] hover:text-[#1A130E]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl bg-white border border-[#EBE2D7] flex items-start justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FAF6EF] text-[#B84A22] flex items-center justify-center shrink-0 border border-[#EBE2D7] mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#1A130E]">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-[#F3ECE2] text-[#B84A22] px-2 py-0.5 rounded-full font-semibold border border-[#E9DFD3]">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#3D3D3D] mt-0.5">{addr.address}</p>
                        <span className="text-[11px] text-[#9B8C80] block">{addr.eircode}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[11px] text-[#B84A22] hover:underline font-medium"
                        >
                          Make Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-[#9B8C80] hover:text-red-600 p-1 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile info & Preferences */}
            <div className="md:col-span-6 space-y-4">
              <div className="mb-2">
                <h2 className="text-lg font-bold text-[#1A130E]">Personal Account</h2>
                <p className="text-xs text-[#747474]">Update contact info for delivery SMS and receipts</p>
              </div>

              <div className="bg-white border border-[#EBE2D7] rounded-2xl p-5 space-y-4 text-xs shadow-xs">
                <div>
                  <label className="block text-[11px] text-[#747474] mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    defaultValue={MOCK_USER.name}
                    className="w-full bg-[#FAF6EF] border border-[#EBE2D7] rounded-xl px-3 py-2 text-xs text-[#3D3D3D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#747474] mb-1">Email Address</label>
                  <input
                    type="email"
                    defaultValue={MOCK_USER.email}
                    className="w-full bg-[#FAF6EF] border border-[#EBE2D7] rounded-xl px-3 py-2 text-xs text-[#3D3D3D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#747474] mb-1">Mobile Phone (Delivery SMS)</label>
                  <input
                    type="tel"
                    defaultValue={MOCK_USER.phone}
                    className="w-full bg-[#FAF6EF] border border-[#EBE2D7] rounded-xl px-3 py-2 text-xs text-[#3D3D3D]"
                  />
                </div>

                <div className="pt-2">
                  <button className="btn-amber-primary px-5 py-2 text-xs font-semibold">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS & FEEDBACK */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 max-w-3xl">
            <div className="mb-2">
              <h2 className="text-lg font-bold text-[#1A130E]">My Submitted Reviews</h2>
              <p className="text-xs text-[#747474]">Feedback shared with our culinary kitchen</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EBE2D7] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#1A130E]">Grand Royal Dum Biryani Feast</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-[#D49B37] text-[#D49B37]" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#3D3D3D] leading-relaxed">
                "Piping hot delivery! The aroma of saffron and cardamom was incredible right when opening the seal. Authentic flavors just like old heritage recipes."
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-[#9B8C80]">
                <span>Reviewed Oct 12, 2026</span>
                <span>•</span>
                <span className="text-[#0FA958] font-semibold">Verified Dine-at-Home</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SUPPORT & FAQS */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-4">
              <div className="mb-2">
                <h2 className="text-lg font-bold text-[#1A130E]">Frequently Asked Questions</h2>
                <p className="text-xs text-[#747474]">Clear details regarding orders, delivery, and dietary standards</p>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white border border-[#EBE2D7] rounded-2xl overflow-hidden shadow-xs"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-[#1A130E]"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#747474] transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-[#747474] leading-relaxed border-t border-[#F3ECE2] pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Contact & Inquiry Box */}
            <div className="md:col-span-5 space-y-4">
              <div className="mb-2">
                <h2 className="text-lg font-bold text-[#1A130E]">Dublin Kitchen Support</h2>
                <p className="text-xs text-[#747474]">Immediate assistance with active deliveries</p>
              </div>

              <div className="bg-white border border-[#EBE2D7] rounded-2xl p-5 space-y-4 text-xs shadow-xs">
                <div className="p-3.5 rounded-xl bg-[#FAF6EF] border border-[#EBE2D7] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#1A130E]">
                    <Phone className="w-4 h-4 text-[#B84A22]" />
                    <span>{RESTAURANT_INFO.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#747474]">
                    <Mail className="w-4 h-4 text-[#B84A22]" />
                    <span>{RESTAURANT_INFO.email}</span>
                  </div>
                  <p className="text-[11px] text-[#9B8C80] pt-1">
                    Store: {RESTAURANT_INFO.location}
                  </p>
                </div>

                {!supportSubmitted ? (
                  <form onSubmit={handleSupportSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-[#747474] mb-1">Subject</label>
                      <select
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        className="w-full bg-[#FAF6EF] border border-[#EBE2D7] rounded-xl px-3 py-2 text-xs text-[#3D3D3D] focus:outline-none"
                      >
                        <option value="Order inquiry">Active Order Status Inquiry</option>
                        <option value="Allergen question">Special Allergen / Dietary Request</option>
                        <option value="Feedback">Feedback or Issue</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#747474] mb-1">Message</label>
                      <textarea
                        rows={3}
                        required
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        placeholder="Describe your question or order number..."
                        className="w-full bg-[#FAF6EF] border border-[#EBE2D7] rounded-xl p-2.5 text-xs text-[#3D3D3D] focus:outline-none focus:border-[#B84A22]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-amber-primary w-full py-2.5 text-xs font-semibold"
                    >
                      Send Message to Kitchen
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#0FA958]/30 text-center space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-[#0FA958] mx-auto mb-1" />
                    <h4 className="font-bold text-xs text-[#1A130E]">Message Received</h4>
                    <p className="text-[11px] text-[#747474]">Our store supervisor will reach you back shortly.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customize Modal for Saved Dishes */}
      <ModifierModal
        dish={selectedDishForCustomize}
        onClose={() => setSelectedDishForCustomize(null)}
      />
    </div>
  );
}
