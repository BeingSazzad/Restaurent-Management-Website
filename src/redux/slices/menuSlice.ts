import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MENU_ITEMS, MenuItem } from '../../Mockdata';

interface MenuState {
  items: MenuItem[];
  selectedCategory: string;
  searchQuery: string;
  dietaryFilter: string | null;
}

const MENU_STORAGE_KEY = 'amber_spice_menu_items';

const getStoredMenu = (): MenuItem[] => {
  if (typeof window === 'undefined') return MENU_ITEMS;
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback to initial
  }
  return MENU_ITEMS;
};

const saveMenuToStorage = (items: MenuItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('amber_spice_menu_updated'));
  } catch {
    // storage fallback
  }
};

const initialState: MenuState = {
  items: MENU_ITEMS,
  selectedCategory: 'all',
  searchQuery: '',
  dietaryFilter: null,
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    syncMenuFromStorage: (state) => {
      state.items = getStoredMenu();
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDietaryFilter: (state, action: PayloadAction<string | null>) => {
      state.dietaryFilter = action.payload;
    },
    toggleItemAvailability: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.isAvailable = !item.isAvailable;
        saveMenuToStorage(state.items);
      }
    },
    updateItemPrice: (state, action: PayloadAction<{ id: string; newPrice: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.price = action.payload.newPrice;
        saveMenuToStorage(state.items);
      }
    },
    addMenuItem: (state, action: PayloadAction<MenuItem>) => {
      state.items.unshift(action.payload);
      saveMenuToStorage(state.items);
    },
    updateMenuItem: (state, action: PayloadAction<MenuItem>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveMenuToStorage(state.items);
      }
    },
    deleteMenuItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveMenuToStorage(state.items);
    },
  },
});

export const {
  syncMenuFromStorage,
  setSelectedCategory,
  setSearchQuery,
  setDietaryFilter,
  toggleItemAvailability,
  updateItemPrice,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = menuSlice.actions;
export default menuSlice.reducer;
