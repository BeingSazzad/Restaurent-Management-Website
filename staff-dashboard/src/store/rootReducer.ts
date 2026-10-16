import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import stockReducer from './slices/stockSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  orders: orderReducer,
  stock: stockReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
