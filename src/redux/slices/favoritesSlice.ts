import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  favoriteDishIds: string[];
}

const initialState: FavoritesState = {
  // Pre-populate with two popular heritage dishes for demonstration
  favoriteDishIds: ['dish-biryani-01', 'dish-curry-01', 'dish-grill-01'],
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const dishId = action.payload;
      const index = state.favoriteDishIds.indexOf(dishId);
      if (index > -1) {
        state.favoriteDishIds.splice(index, 1);
      } else {
        state.favoriteDishIds.push(dishId);
      }
    },
    clearFavorites: (state) => {
      state.favoriteDishIds = [];
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
