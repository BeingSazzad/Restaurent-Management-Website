'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  syncCouponsFromStorage,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  Coupon,
} from '@/redux/slices/couponSlice';
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  Copy,
  Percent,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const CouponManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const coupons = useAppSelector((state) => state.coupons?.items || []);

  useEffect(() => {
    dispatch(syncCouponsFromStorage());
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form Fields
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDiscountType, setFormDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [formDiscountValue, setFormDiscountValue] = useState<number>(20);
  const [formMinOrderAmount, setFormMinOrderAmount] = useState<number>(30);
  const [formValidTill, setFormValidTill] = useState('Valid all week');
  const [formBadge, setFormBadge] = useState('Special Deal');
  const [formIsActive, setFormIsActive] = useState(true);

  const openAddModal = () => {
    setEditingCoupon(null);
    setFormCode('');
    setFormTitle('');
    setFormDescription('');
    setFormDiscountType('percentage');
    setFormDiscountValue(20);
    setFormMinOrderAmount(30);
    setFormValidTill('Valid all week');
    setFormBadge('Special Deal');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormCode(coupon.code);
    setFormTitle(coupon.title);
    setFormDescription(coupon.description);
    setFormDiscountType(coupon.discountType);
    setFormDiscountValue(coupon.discountValue);
    setFormMinOrderAmount(coupon.minOrderAmount || 0);
    setFormValidTill(coupon.validTill || 'Ongoing');
    setFormBadge(coupon.badge || 'Discount Voucher');
    setFormIsActive(coupon.isActive);
    setIsModalOpen(true);
  };

  const handleCopyCode = async (code: string, id: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      }
    } catch {
      // fallback
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = formCode.trim().toUpperCase().replace(/\s+/g, '');
    if (!cleanCode) {
      alert('Please enter a valid coupon code (e.g. SPICE20).');
      return;
    }
    if (!formTitle.trim()) {
      alert('Please enter a campaign title.');
      return;
    }

    const payload: Coupon = {
      id: editingCoupon ? editingCoupon.id : `coup-${Date.now()}`,
      code: cleanCode,
      title: formTitle.trim(),
      description: formDescription.trim() || `Enjoy discount on your delicious Dublin dining.`,
      discountType: formDiscountType,
      discountValue: Number(formDiscountValue) || 10,
      minOrderAmount: Number(formMinOrderAmount) || 0,
      validTill: formValidTill.trim() || 'Ongoing',
      badge: formBadge.trim() || 'Special Promo',
      isActive: formIsActive,
    };

    if (editingCoupon) {
      dispatch(updateCoupon(payload));
    } else {
      dispatch(addCoupon(payload));
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`Are you sure you want to delete coupon code "${code}"?`)) {
      dispatch(deleteCoupon(id));
    }
  };

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? c.isActive
        : !c.isActive;

    return matchesSearch && matchesStatus;
  });

  const activeCount = coupons.filter((c) => c.isActive).length;
  const maxDiscount = Math.max(
    0,
    ...coupons.filter((c) => c.discountType === 'percentage').map((c) => c.discountValue)
  );

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#1A130E] flex items-center gap-2">
            <span>Discounts & Coupon Campaigns</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-[#F15A24] font-semibold">
              {coupons.length} Vouchers
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure discount promo codes, minimum spend limits, and published offers for the cart and storefront.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#F15A24] to-[#FBA138] hover:from-[#d94e1c] hover:to-[#e89228] text-white text-xs font-bold shadow-md shadow-[#F15A24]/20 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Active Campaigns
            </span>
            <h3 className="text-2xl font-extrabold text-[#1A130E] mt-0.5">
              {activeCount} of {coupons.length}
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
              ● Ready for customer checkout
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#F15A24] flex items-center justify-center border border-orange-100">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Max Discount Rate
            </span>
            <h3 className="text-2xl font-extrabold text-[#1A130E] mt-0.5">
              {maxDiscount}% OFF
            </h3>
            <span className="text-[11px] text-stone-500 font-medium mt-0.5 block">
              Highest active promo value
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#F15A24] flex items-center justify-center border border-orange-100">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Storefront Sync
            </span>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-0.5">
              Live & Synced
            </h3>
            <span className="text-[11px] text-stone-500 font-medium mt-0.5 block">
              Cart + /offers page dynamic
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by coupon code (e.g. SPICE20), title, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl pl-10 pr-4 text-xs text-stone-800 placeholder:text-stone-400 shadow-2xs outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              statusFilter === 'all'
                ? 'bg-[#F15A24] text-white border-[#F15A24] shadow-xs'
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            All Coupons ({coupons.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            Active Only ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              statusFilter === 'inactive'
                ? 'bg-stone-700 text-white border-stone-700'
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            Paused ({coupons.length - activeCount})
          </button>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCoupons.map((coupon) => {
          const discountLabel =
            coupon.discountType === 'percentage'
              ? `${coupon.discountValue}% OFF`
              : `€${coupon.discountValue.toFixed(2)} OFF`;

          const minOrderLabel =
            coupon.minOrderAmount > 0
              ? `Min. order €${coupon.minOrderAmount.toFixed(2)}`
              : 'No minimum spend';

          return (
            <div
              key={coupon.id}
              className={`bg-white border rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all group ${
                coupon.isActive
                  ? 'border-stone-200/90 hover:border-[#F15A24]/40 hover:shadow-md'
                  : 'border-stone-200/60 bg-stone-50/60 opacity-80'
              }`}
            >
              <div>
                {/* Header Badge & Discount Rate */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-50 text-[#F15A24] border border-orange-100">
                    {coupon.badge || 'Promo Voucher'}
                  </span>
                  <span className="text-xl font-extrabold text-[#F15A24] tracking-tight">
                    {discountLabel}
                  </span>
                </div>

                {/* Coupon Code Pill */}
                <div className="mb-3 p-2.5 rounded-xl bg-stone-50 border border-dashed border-stone-300 flex items-center justify-between">
                  <span className="font-mono font-extrabold text-sm tracking-wider text-[#1A130E]">
                    {coupon.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(coupon.code, coupon.id)}
                    className="p-1 rounded-md text-stone-500 hover:text-[#F15A24] hover:bg-white cursor-pointer transition-colors"
                    title="Copy coupon code"
                  >
                    {copiedId === coupon.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Title & Description */}
                <div className="space-y-1 mb-3">
                  <h3 className="font-bold text-sm text-[#1A130E] leading-snug line-clamp-1">
                    {coupon.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {coupon.description}
                  </p>
                </div>

                {/* Info Points */}
                <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium pt-2 border-t border-stone-100">
                  <span>{minOrderLabel}</span>
                  <span>•</span>
                  <span>{coupon.validTill || 'Ongoing'}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3.5 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                {/* Status Toggle Button */}
                <button
                  type="button"
                  onClick={() => dispatch(toggleCouponStatus(coupon.id))}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    coupon.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  {coupon.isActive ? '● Active in Store' : '○ Paused'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(coupon)}
                    className="h-8 px-3 rounded-lg border border-stone-200 hover:border-[#F15A24] hover:text-[#F15A24] text-stone-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id, coupon.code)}
                    className="h-8 w-8 rounded-lg border border-stone-200 hover:border-rose-400 hover:text-rose-600 text-stone-400 flex items-center justify-center cursor-pointer transition-colors"
                    title="Remove coupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCoupons.length === 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500">
          <AlertCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-[#1A130E]">No coupons match your filter</h4>
          <p className="text-xs text-stone-400 mt-1">
            Try searching for another keyword or click "Create New Coupon".
          </p>
        </div>
      )}

      {/* ================= ADD / EDIT COUPON MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div>
                <h3 className="font-extrabold text-lg text-[#1A130E]">
                  {editingCoupon ? 'Edit Discount Coupon' : 'Create New Discount Coupon'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Set discount values, promo code, minimum order thresholds, and validity.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
              {/* Code & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Coupon Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SPICE25, RAMADAN20"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    className="w-full h-10 px-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 font-mono font-bold tracking-wider uppercase outline-none"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Customer enters this at checkout
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formDiscountType}
                    onChange={(e) => setFormDiscountType(e.target.value as any)}
                    className="w-full h-10 px-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none cursor-pointer"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed">Fixed Concession (€)</option>
                  </select>
                </div>
              </div>

              {/* Discount Value & Min Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {formDiscountType === 'percentage' ? 'Discount Percentage (%)' : 'Fixed Discount Amount (€)'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">
                      {formDiscountType === 'percentage' ? '%' : '€'}
                    </span>
                    <input
                      type="number"
                      step={formDiscountType === 'percentage' ? '1' : '0.01'}
                      min="1"
                      max={formDiscountType === 'percentage' ? '90' : '200'}
                      required
                      value={formDiscountValue}
                      onChange={(e) => setFormDiscountValue(parseFloat(e.target.value) || 0)}
                      className="w-full h-10 pl-8 pr-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Minimum Order Amount (€)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">
                      €
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formMinOrderAmount}
                      onChange={(e) => setFormMinOrderAmount(parseFloat(e.target.value) || 0)}
                      placeholder="0.00 (No minimum)"
                      className="w-full h-10 pl-8 pr-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Set 0 for no minimum cart spend
                  </span>
                </div>
              </div>

              {/* Campaign Title */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Campaign Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Royal Feast Discount"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe offer conditions, eligible categories, or festive treats..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none resize-none"
                />
              </div>

              {/* Validity & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Validity Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Valid until Sunday, Valid all week"
                    value={formValidTill}
                    onChange={(e) => setFormValidTill(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Trending Special, Weekend Promo"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none"
                  />
                </div>
              </div>

              {/* Storefront Active Switch */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">
                      Active for Checkout & Cart Application
                    </span>
                    <span className="text-[11px] text-stone-400">
                      When active, customers can apply this code in the cart drawer and browse it on the /offers page.
                    </span>
                  </div>
                </label>
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">Customer View Preview:</span>
                  <span className="font-bold text-[#F15A24] uppercase tracking-wider text-[11px]">
                    {formBadge || 'Promo'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#1A130E]">
                      {formTitle || 'Sample Promo Campaign'}
                    </h4>
                    <span className="text-[11px] text-stone-500 font-mono">
                      Code: <strong className="text-[#1A130E]">{formCode || 'SAMPLECODE'}</strong> · Min €{formMinOrderAmount || 0}
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-[#F15A24]">
                    {formDiscountType === 'percentage'
                      ? `${formDiscountValue || 0}% OFF`
                      : `€${(formDiscountValue || 0).toFixed(2)} OFF`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#F15A24] hover:bg-[#d94e1c] text-white text-xs font-bold shadow-md shadow-[#F15A24]/20 cursor-pointer transition-colors"
                >
                  {editingCoupon ? 'Save Coupon Changes' : 'Create & Publish Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
