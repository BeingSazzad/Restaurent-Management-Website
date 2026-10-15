import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_ORDERS, OrderItem } from '../../Mockdata';

interface OrderState {
  orders: OrderItem[];
  activeTrackingOrderId: string | null;
  kitchenSnoozeActive: boolean;
  kitchenSnoozeMinutes: number;
}

const getInitialOrders = (): OrderItem[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('amber_spice_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: OrderItem) => p.id || p.orderNumber));
          const missing = INITIAL_ORDERS.filter((o) => !existingIds.has(o.id) && !existingIds.has(o.orderNumber));
          return [...parsed, ...missing];
        }
      }
    } catch {
      // fallback
    }
  }
  return INITIAL_ORDERS;
};

const initialState: OrderState = {
  orders: getInitialOrders(),
  activeTrackingOrderId: null,
  kitchenSnoozeActive: false,
  kitchenSnoozeMinutes: 0,
};

const saveOrdersToStorage = (orders: OrderItem[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('amber_spice_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<OrderItem>) => {
      state.orders.unshift(action.payload);
      state.activeTrackingOrderId = action.payload.id;
      saveOrdersToStorage(state.orders);
    },
    syncOrdersFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('amber_spice_orders');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const existingIds = new Set(parsed.map((p: OrderItem) => p.id || p.orderNumber));
              const missing = INITIAL_ORDERS.filter((o) => !existingIds.has(o.id) && !existingIds.has(o.orderNumber));
              state.orders = [...parsed, ...missing];
              return;
            }
          }
        } catch {
          // ignore
        }
      }
      state.orders = INITIAL_ORDERS;
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: OrderItem['status'] }>
    ) => {
      const order = state.orders.find(
        (o) =>
          o.id === action.payload.orderId ||
          o.orderNumber === action.payload.orderId ||
          o.orderNumber.toLowerCase() === action.payload.orderId.toLowerCase()
      );
      if (order) {
        order.status = action.payload.status;
      }
      saveOrdersToStorage(state.orders);
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

export const { createOrder, updateOrderStatus, syncOrdersFromStorage, setActiveTrackingOrderId, toggleKitchenSnooze } =
  orderSlice.actions;
export default orderSlice.reducer;
