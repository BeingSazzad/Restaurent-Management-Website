import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_ORDERS, OrderItem } from '../../Mockdata';

interface OrderState {
  orders: OrderItem[];
  activeTrackingOrderId: string | null;
  kitchenSnoozeActive: boolean;
  kitchenSnoozeMinutes: number;
}

const initialState: OrderState = {
  orders: INITIAL_ORDERS,
  activeTrackingOrderId: null,
  kitchenSnoozeActive: false,
  kitchenSnoozeMinutes: 0,
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<OrderItem>) => {
      state.orders.unshift(action.payload);
      state.activeTrackingOrderId = action.payload.id;
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: OrderItem['status'] }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
    setActiveTrackingOrderId: (state, action: PayloadAction<string | null>) => {
      state.activeTrackingOrderId = action.payload;
    },
    toggleKitchenSnooze: (state, action: PayloadAction<number | undefined>) => {
      state.kitchenSnoozeActive = !state.kitchenSnoozeActive;
      state.kitchenSnoozeMinutes = state.kitchenSnoozeActive ? action.payload || 20 : 0;
    },
  },
});

export const { createOrder, updateOrderStatus, setActiveTrackingOrderId, toggleKitchenSnooze } =
  orderSlice.actions;
export default orderSlice.reducer;
