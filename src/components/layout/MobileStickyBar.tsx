'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setCartOpen } from '../../redux/slices/cartSlice';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const MobileStickyBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = cartItems.reduce((acc, i) => acc + i.totalPrice, 0);

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
      <button
        onClick={() => dispatch(setCartOpen(true))}
        className="w-full btn-amber-primary py-3.5 px-5 rounded-2xl flex items-center justify-between shadow-amber text-white font-bold text-xs"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-white text-[#B84A22] text-xs flex items-center justify-center font-black">
            {totalCount}
          </div>
          <span>View Cart</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>€{subtotal.toFixed(2)}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
};
