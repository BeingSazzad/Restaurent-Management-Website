'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  setCartOpen,
  updateQuantity,
  removeFromCart,
  applyPromoCode,
  removePromoCode,
} from '../../redux/slices/cartSlice';
import { setCheckoutOpen } from '../../redux/slices/fulfillmentSlice';
import { RESTAURANT_INFO } from '../../Mockdata';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Bike,
  Store,
  Tag,
  CheckCircle2,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const fulfillment = useAppSelector((state) => state.fulfillment);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!cart.isOpen) return null;

  const subtotal = cart.items.reduce((acc, i) => acc + i.totalPrice, 0);
  const isFreeDeliveryEligible = subtotal >= RESTAURANT_INFO.freeDeliveryThreshold;
  const deliveryFee =
    fulfillment.type === 'delivery'
      ? isFreeDeliveryEligible
        ? 0
        : fulfillment.selectedZone?.fee || RESTAURANT_INFO.baseDeliveryFee
      : 0;

  const discountAmount = (subtotal * cart.discountPercentage) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);
  const freeDeliveryRemaining = Math.max(0, RESTAURANT_INFO.freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(
    100,
    (subtotal / RESTAURANT_INFO.freeDeliveryThreshold) * 100
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    if (promoInput.trim().toUpperCase() === 'WELCOME10' || promoInput.trim().toUpperCase() === 'CHEF20') {
      dispatch(applyPromoCode(promoInput));
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "WELCOME10"');
    }
  };

  const handleProceedToCheckout = () => {
    dispatch(setCartOpen(false));
    dispatch(setCheckoutOpen(true));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => dispatch(setCartOpen(false))}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E5E5E5] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#F15A24] border border-orange-200/60 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-[17px] text-[#1A130E]">My Order Cart</h2>
                <div className="flex items-center gap-1.5 text-[12px] text-[#666666]">
                  {fulfillment.type === 'delivery' ? (
                    <>
                      <Bike className="w-3.5 h-3.5 text-[#0FA958]" />
                      <span>Delivery · ~30-35 mins</span>
                    </>
                  ) : (
                    <>
                      <Store className="w-3.5 h-3.5 text-[#B84A22]" />
                      <span>Takeaway Pickup · ~15-20 mins</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => dispatch(setCartOpen(false))}
              className="w-8 h-8 rounded-full bg-[rgb(249,249,249)] text-[#747474] hover:text-[#1A130E] flex items-center justify-center transition-colors border border-[#E5E5E5]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {fulfillment.type === 'delivery' && (
            <div className="bg-[rgb(249,249,249)] px-6 py-3.5 border-b border-[#E5E5E5]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#3D3D3D] font-medium">
                  {isFreeDeliveryEligible ? (
                    <span className="text-[#0FA958] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> FREE Delivery unlocked!
                    </span>
                  ) : (
                    <>
                      Add <span className="text-[#B84A22] font-bold">€{freeDeliveryRemaining.toFixed(2)}</span> more for Free Delivery
                    </>
                  )}
                </span>
                <span className="text-[11px] font-bold text-[#B84A22]">
                  {Math.round(freeDeliveryProgress)}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FBA138] to-[#F15A24] transition-all duration-300 rounded-full"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[rgb(249,249,249)]">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#747474]">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xs mb-4 border border-[#E5E5E5]">
                  <ShoppingBag className="w-8 h-8 text-[#9B8C80]" />
                </div>
                <h3 className="font-bold text-[#1A130E] text-base mb-1">Your cart is empty</h3>
                <p className="text-[13px] text-[#747474] max-w-xs mb-6">
                  Add delicious dishes from our menu to begin ordering.
                </p>
                <button
                  onClick={() => dispatch(setCartOpen(false))}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white text-[13px] font-semibold shadow-sm"
                >
                  Explore Food Menu
                </button>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3.5 rounded-2xl bg-white border border-[#E5E5E5] shadow-xs flex gap-3"
                >
                  <img
                    src={item.dish.image}
                    alt={item.dish.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h4 className="font-bold text-[14px] text-[#1A130E] truncate">
                        {item.dish.name}
                      </h4>
                      <button
                        onClick={() => dispatch(removeFromCart(item.cartItemId))}
                        className="text-[#A0A0A0] hover:text-[#B84A22] p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Modifiers List */}
                    {item.selectedModifiers.length > 0 && (
                      <div className="text-[11px] text-[#747474] mb-1 space-y-0.5">
                        {item.selectedModifiers.map((mod, idx) => (
                          <div key={idx}>+ {mod.optionName}</div>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[11px] text-[#888888] italic mb-1.5">
                        Note: &ldquo;{item.specialInstructions}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F1F1F1]">
                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 bg-[rgb(249,249,249)] px-2.5 py-1 rounded-full border border-[#E5E5E5]">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                cartItemId: item.cartItemId,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          className="text-[#747474] hover:text-[#1A130E] p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[13px] font-bold text-[#1A130E] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                cartItemId: item.cartItemId,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="text-[#747474] hover:text-[#1A130E] p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-[14px] text-[#1A130E]">
                        €{item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.items.length > 0 && (
            <div className="p-5 border-t border-[#EAEAEA] bg-white space-y-4">
              {/* Promo Code Input with Nested Concentric Radius */}
              <form onSubmit={handleApplyPromo} className="flex items-center bg-[rgb(249,249,249)] border border-[#E5E5E5] rounded-xl p-1 focus-within:border-[#B84A22]/60 transition-colors shadow-xs">
                <Tag className="w-3.5 h-3.5 ml-2.5 text-[#A0A0A0] shrink-0" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Coupon code (e.g. SPICE20)"
                  className="flex-1 bg-transparent px-2.5 py-1.5 text-xs text-[#3D3D3D] placeholder:text-[#A0A0A0] focus:outline-none uppercase font-semibold"
                />
                {cart.promoCode ? (
                  <button
                    type="button"
                    onClick={() => dispatch(removePromoCode())}
                    className="px-3 py-1.5 rounded-lg text-xs bg-rose-50 text-[#B84A22] border border-[#B84A22]/20 font-semibold shrink-0"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shrink-0 shadow-xs active:scale-95 transition-transform"
                  >
                    Apply
                  </button>
                )}
              </form>
              {promoError && <p className="text-[11px] text-[#E23744]">{promoError}</p>}
              {cart.promoCode && (
                <p className="text-[11px] text-[#0FA958] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Code {cart.promoCode} applied ({cart.discountPercentage}% OFF)
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-[13px] text-[#747474]">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-[#1A130E]">€{subtotal.toFixed(2)}</span>
                </div>
                {cart.discountPercentage > 0 && (
                  <div className="flex justify-between text-[#0FA958] font-semibold">
                    <span>Discount ({cart.discountPercentage}%)</span>
                    <span>-€{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {fulfillment.type === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery Partner Fee</span>
                    <span className="font-semibold text-[#1A130E]">
                      {deliveryFee === 0 ? (
                        <span className="text-[#0FA958]">FREE</span>
                      ) : (
                        `€${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-[#1A130E] pt-2 border-t border-[#EAEAEA]">
                  <span>To Pay</span>
                  <span className="text-[#B84A22]">€{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#FBA138] to-[#F15A24] hover:from-[#F59828] hover:to-[#E54E18] text-white text-[14px] font-bold flex items-center justify-between shadow-md hover:scale-[1.02] active:scale-98 transition-all"
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center gap-1.5">
                  <span>€{finalTotal.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
