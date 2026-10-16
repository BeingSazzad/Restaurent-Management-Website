import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KdsOrder, OrderStatus } from '../../types/common.types';
import { INITIAL_ORDERS } from '../../lib/constants';

interface OrderState {
  orders: KdsOrder[];
  soundEnabled: boolean;
  rushMode: boolean;
  rushMinutes: number;
}

const getInitialOrders = (): KdsOrder[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('amber_spice_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: KdsOrder) => p.id || p.orderNumber));
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

const saveOrders = (orders: KdsOrder[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('amber_spice_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }
};

const initialState: OrderState = {
  orders: getInitialOrders(),
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
      saveOrders(state.orders);
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: OrderStatus }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId || o.orderNumber === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
        saveOrders(state.orders);
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
    syncOrdersFromStorage: (state) => {
      state.orders = getInitialOrders();
    },
  },
});

export const { createManualOrder, updateOrderStatus, toggleSound, toggleRushMode, syncOrdersFromStorage } = orderSlice.actions;
export const addOrder = createManualOrder;
export default orderSlice.reducer;
