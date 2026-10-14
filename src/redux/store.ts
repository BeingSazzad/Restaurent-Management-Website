import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import menuReducer from './slices/menuSlice';
import fulfillmentReducer from './slices/fulfillmentSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: orderReducer,
    menu: menuReducer,
    fulfillment: fulfillmentReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
