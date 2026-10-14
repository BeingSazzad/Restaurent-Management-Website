import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MENU_ITEMS, MenuItem } from '../../Mockdata';

interface MenuState {
  items: MenuItem[];
  selectedCategory: string;
  searchQuery: string;
  dietaryFilter: string | null;
}

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
      }
    },
    updateItemPrice: (state, action: PayloadAction<{ id: string; newPrice: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.price = action.payload.newPrice;
      }
    },
  },
});

export const {
  setSelectedCategory,
  setSearchQuery,
  setDietaryFilter,
  toggleItemAvailability,
  updateItemPrice,
} = menuSlice.actions;
export default menuSlice.reducer;
