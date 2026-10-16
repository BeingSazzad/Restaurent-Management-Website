import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DishItem, RawIngredientItem, WastageRecord } from '../../types/common.types';
import { INITIAL_DISHES, INITIAL_RAW_INGREDIENTS } from '../../lib/constants';

const MENU_STORAGE_KEY = 'amber_spice_menu_items';
const RAW_STORAGE_KEY = 'amber_spice_raw_inventory';

const getInitialDishes = (): DishItem[] => {
  if (typeof window === 'undefined') return INITIAL_DISHES;
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure stockCount and lowStockThreshold exist on stored items
        return parsed.map((item: DishItem) => ({
          ...item,
          stockCount: item.stockCount !== undefined ? item.stockCount : 12,
          lowStockThreshold: item.lowStockThreshold !== undefined ? item.lowStockThreshold : 5,
        }));
      }
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

const WASTAGE_STORAGE_KEY = 'amber_spice_wastage_records';

const persistRaw = (items: RawIngredientItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RAW_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('amber_spice_raw_updated'));
  } catch {
    // ignore
  }
};

const getInitialWastage = (): WastageRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WASTAGE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return [
    {
      id: 'w-01',
      itemId: 'ing-01',
      itemName: 'Fresh Irish Chicken Fillet',
      itemType: 'raw',
      quantity: 1.2,
      unit: 'kg',
      reason: 'expired',
      costLost: 8.16,
      timestamp: '2026-10-15T16:30:00Z',
      loggedBy: 'Chef Tariq',
    },
  ];
};

const persistWastage = (records: WastageRecord[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WASTAGE_STORAGE_KEY, JSON.stringify(records));
  } catch {
    // ignore
  }
};

interface StockState {
  dishes: DishItem[];
  rawIngredients: RawIngredientItem[];
  wastageHistory: WastageRecord[];
}

const initialState: StockState = {
  dishes: getInitialDishes(),
  rawIngredients: getInitialRaw(),
  wastageHistory: getInitialWastage(),
};

export const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    syncStockFromStorage: (state) => {
      state.dishes = getInitialDishes();
      state.rawIngredients = getInitialRaw();
      state.wastageHistory = getInitialWastage();
    },
    toggleDishAvailability: (state, action: PayloadAction<string>) => {
      const dish = state.dishes.find((d) => d.id === action.payload);
      if (dish) {
        dish.isAvailable = !dish.isAvailable;
        if (!dish.isAvailable) {
          dish.stockCount = 0;
        } else if ((dish.stockCount || 0) <= 0) {
          dish.stockCount = 12; // default restock batch
        }
        persistDishes(state.dishes);
      }
    },
    adjustDishPortions: (state, action: PayloadAction<{ id: string; delta: number }>) => {
      const dish = state.dishes.find((d) => d.id === action.payload.id);
      if (dish) {
        const current = dish.stockCount !== undefined ? dish.stockCount : 10;
        const updated = Math.max(0, current + action.payload.delta);
        dish.stockCount = updated;
        if (updated === 0) {
          dish.isAvailable = false; // Auto-86 when stock reaches 0!
        } else {
          dish.isAvailable = true;
        }
        persistDishes(state.dishes);
      }
    },
    setDishPortions: (state, action: PayloadAction<{ id: string; count: number }>) => {
      const dish = state.dishes.find((d) => d.id === action.payload.id);
      if (dish) {
        const count = Math.max(0, action.payload.count);
        dish.stockCount = count;
        dish.isAvailable = count > 0;
        persistDishes(state.dishes);
      }
    },
    deductOrderedDishes: (state, action: PayloadAction<{ dishId: string; quantity: number }[]>) => {
      let changed = false;
      action.payload.forEach(({ dishId, quantity }) => {
        const dish = state.dishes.find((d) => d.id === dishId);
        if (dish && dish.stockCount !== undefined) {
          dish.stockCount = Math.max(0, dish.stockCount - quantity);
          if (dish.stockCount === 0) {
            dish.isAvailable = false; // Automatically 86 if depleted!
          }
          changed = true;
        }
      });
      if (changed) {
        persistDishes(state.dishes);
      }
    },
    deductRecipeStockForOrder: (state, action: PayloadAction<{ items: { dishId: string; quantity: number }[] }>) => {
      let rawChanged = false;
      action.payload.items.forEach(({ dishId, quantity }) => {
        const dish = state.dishes.find((d) => d.id === dishId);
        if (dish && dish.recipe && dish.recipe.length > 0) {
          dish.recipe.forEach((ingUsage) => {
            const raw = state.rawIngredients.find((r) => r.id === ingUsage.ingredientId);
            if (raw) {
              const consumed = ingUsage.quantity * quantity;
              raw.currentStock = Math.max(0, Math.round((raw.currentStock - consumed) * 100) / 100);
              if (raw.currentStock === 0) {
                raw.status = 'out_of_stock';
              } else if (raw.currentStock <= raw.parLevel) {
                raw.status = 'low_stock';
              }
              rawChanged = true;
            }
          });
        }
      });
      if (rawChanged) {
        persistRaw(state.rawIngredients);
      }
    },
    logWastage: (state, action: PayloadAction<WastageRecord>) => {
      state.wastageHistory.unshift(action.payload);
      persistWastage(state.wastageHistory);

      // Deduct from stock
      if (action.payload.itemType === 'raw') {
        const raw = state.rawIngredients.find((r) => r.id === action.payload.itemId);
        if (raw) {
          raw.currentStock = Math.max(0, Math.round((raw.currentStock - action.payload.quantity) * 100) / 100);
          if (raw.currentStock === 0) raw.status = 'out_of_stock';
          else if (raw.currentStock <= raw.parLevel) raw.status = 'low_stock';
          persistRaw(state.rawIngredients);
        }
      } else {
        const dish = state.dishes.find((d) => d.id === action.payload.itemId);
        if (dish && dish.stockCount !== undefined) {
          dish.stockCount = Math.max(0, dish.stockCount - action.payload.quantity);
          if (dish.stockCount === 0) dish.isAvailable = false;
          persistDishes(state.dishes);
        }
      }
    },
    updateDishRecipe: (state, action: PayloadAction<{ dishId: string; recipe: DishItem['recipe'] }>) => {
      const dish = state.dishes.find((d) => d.id === action.payload.dishId);
      if (dish) {
        dish.recipe = action.payload.recipe;
        persistDishes(state.dishes);
      }
    },
    restockAllDishes: (state) => {
      state.dishes.forEach((d) => {
        d.isAvailable = true;
        if ((d.stockCount || 0) <= 0) {
          d.stockCount = 15;
        }
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
  adjustDishPortions,
  setDishPortions,
  deductOrderedDishes,
  deductRecipeStockForOrder,
  logWastage,
  updateDishRecipe,
  restockAllDishes,
  adjustRawStock,
  restockRawToPar,
  addRawIngredient,
  deleteRawIngredient,
} = stockSlice.actions;

export default stockSlice.reducer;
