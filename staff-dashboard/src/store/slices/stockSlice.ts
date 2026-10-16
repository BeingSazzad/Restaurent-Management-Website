import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DishItem } from '../../types/common.types';
import { INITIAL_DISHES } from '../../lib/constants';

interface StockState {
  dishes: DishItem[];
}

const initialState: StockState = {
  dishes: INITIAL_DISHES,
};

export const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    toggleDishAvailability: (state, action: PayloadAction<string>) => {
      const dish = state.dishes.find((d) => d.id === action.payload);
      if (dish) {
        dish.isAvailable = !dish.isAvailable;
      }
    },
    restockAllDishes: (state) => {
      state.dishes.forEach((d) => {
        d.isAvailable = true;
      });
    },
  },
});

export const { toggleDishAvailability, restockAllDishes } = stockSlice.actions;
export default stockSlice.reducer;
