import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DishItem, RawIngredientItem } from '../../types/common.types';
import { INITIAL_DISHES, INITIAL_RAW_INGREDIENTS } from '../../lib/constants';

const MENU_STORAGE_KEY = 'amber_spice_menu_items';
const RAW_STORAGE_KEY = 'amber_spice_raw_inventory';

const getInitialDishes = (): DishItem[] => {
  if (typeof window === 'undefined') return INITIAL_DISHES;
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_DISHES;
};

const getInitialRaw = (): RawIngredientItem[] => {
  if (typeof window === 'undefined') return INITIAL_RAW_INGREDIENTS;
  try {
    const raw = localStorage.getItem(RAW_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_RAW_INGREDIENTS;
};

const persistDishes = (dishes: DishItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(dishes));
    window.dispatchEvent(new Event('amber_spice_menu_updated'));
  } catch {
    // ignore
  }
};

const persistRaw = (items: RawIngredientItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RAW_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('amber_spice_raw_updated'));
  } catch {
    // ignore
  }
};

interface StockState {
  dishes: DishItem[];
  rawIngredients: RawIngredientItem[];
}

const initialState: StockState = {
  dishes: getInitialDishes(),
  rawIngredients: getInitialRaw(),
};

export const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    syncStockFromStorage: (state) => {
      state.dishes = getInitialDishes();
      state.rawIngredients = getInitialRaw();
    },
    toggleDishAvailability: (state, action: PayloadAction<string>) => {
      const dish = state.dishes.find((d) => d.id === action.payload);
      if (dish) {
        dish.isAvailable = !dish.isAvailable;
        persistDishes(state.dishes);
      }
    },
    restockAllDishes: (state) => {
      state.dishes.forEach((d) => {
        d.isAvailable = true;
      });
      persistDishes(state.dishes);
    },
    adjustRawStock: (state, action: PayloadAction<{ id: string; delta: number }>) => {
      const item = state.rawIngredients.find((i) => i.id === action.payload.id);
      if (item) {
        item.currentStock = Math.max(0, Math.round((item.currentStock + action.payload.delta) * 10) / 10);
        if (item.currentStock === 0) {
          item.status = 'out_of_stock';
        } else if (item.currentStock <= item.parLevel) {
          item.status = 'low_stock';
        } else {
          item.status = 'healthy';
        }
        persistRaw(state.rawIngredients);
      }
    },
    restockRawToPar: (state, action: PayloadAction<string>) => {
      const item = state.rawIngredients.find((i) => i.id === action.payload);
      if (item) {
        item.currentStock = Math.round(item.parLevel * 1.5 * 10) / 10;
        item.status = 'healthy';
        item.lastRestocked = new Date().toISOString().split('T')[0];
        persistRaw(state.rawIngredients);
      }
    },
    addRawIngredient: (state, action: PayloadAction<RawIngredientItem>) => {
      state.rawIngredients.unshift(action.payload);
      persistRaw(state.rawIngredients);
    },
    deleteRawIngredient: (state, action: PayloadAction<string>) => {
      state.rawIngredients = state.rawIngredients.filter((i) => i.id !== action.payload);
      persistRaw(state.rawIngredients);
    },
  },
});

export const {
  syncStockFromStorage,
  toggleDishAvailability,
  restockAllDishes,
  adjustRawStock,
  restockRawToPar,
  addRawIngredient,
  deleteRawIngredient,
} = stockSlice.actions;

export default stockSlice.reducer;
