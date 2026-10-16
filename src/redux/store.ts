import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import menuReducer from './slices/menuSlice';
import fulfillmentReducer from './slices/fulfillmentSlice';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';
import couponReducer from './slices/couponSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: orderReducer,
    menu: menuReducer,
    fulfillment: fulfillmentReducer,
    auth: authReducer,
    favorites: favoritesReducer,
    coupons: couponReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
