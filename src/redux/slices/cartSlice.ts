import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, RESTAURANT_INFO } from '../../Mockdata';

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discountPercentage: number;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  promoCode: null,
  discountPercentage: 0,
  isOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingIndex = state.items.findIndex(
        (i) =>
          i.dish.id === action.payload.dish.id &&
          JSON.stringify(i.selectedModifiers) === JSON.stringify(action.payload.selectedModifiers) &&
          i.specialInstructions === action.payload.specialInstructions
      );

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += action.payload.quantity;
        state.items[existingIndex].totalPrice =
          (state.items[existingIndex].totalPrice / (state.items[existingIndex].quantity - action.payload.quantity)) *
          state.items[existingIndex].quantity;
      } else {
        state.items.push(action.payload);
      }
      state.isOpen = true;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.cartItemId !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ cartItemId: string; quantity: number }>) => {
      const item = state.items.find((i) => i.cartItemId === action.payload.cartItemId);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.cartItemId !== action.payload.cartItemId);
        } else {
          const unitPrice = item.totalPrice / item.quantity;
          item.quantity = action.payload.quantity;
          item.totalPrice = unitPrice * action.payload.quantity;
        }
      }
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    applyPromoCode: (state, action: PayloadAction<string>) => {
      const code = action.payload.trim().toUpperCase();
      if (code === 'SPICE20' || code === 'CHEF20') {
        state.promoCode = code;
        state.discountPercentage = 20;
      } else if (code === 'FAMILYFEST') {
        state.promoCode = code;
        state.discountPercentage = 15;
      } else if (code === 'WELCOME10' || code === 'FIRSTBITE') {
        state.promoCode = code;
        state.discountPercentage = 10;
      } else {
        state.promoCode = null;
        state.discountPercentage = 0;
      }
    },
    removePromoCode: (state) => {
      state.promoCode = null;
      state.discountPercentage = 0;
    },
    clearCart: (state) => {
      state.items = [];
      state.promoCode = null;
      state.discountPercentage = 0;
      state.isOpen = false;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, setCartOpen, applyPromoCode, removePromoCode, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
