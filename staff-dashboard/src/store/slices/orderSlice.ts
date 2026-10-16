import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KdsOrder, OrderStatus } from '../../types/common.types';
import { INITIAL_ORDERS } from '../../lib/constants';

interface OrderState {
  orders: KdsOrder[];
  soundEnabled: boolean;
  rushMode: boolean;
  rushMinutes: number;
}

const initialState: OrderState = {
  orders: INITIAL_ORDERS,
  soundEnabled: true,
  rushMode: false,
  rushMinutes: 20,
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createManualOrder: (state, action: PayloadAction<KdsOrder>) => {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: OrderStatus }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId || o.orderNumber === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    toggleRushMode: (state, action: PayloadAction<number | undefined>) => {
      state.rushMode = !state.rushMode;
      if (action.payload) {
        state.rushMinutes = action.payload;
      }
    },
  },
});

export const { createManualOrder, updateOrderStatus, toggleSound, toggleRushMode } = orderSlice.actions;
export const addOrder = createManualOrder;
export default orderSlice.reducer;
