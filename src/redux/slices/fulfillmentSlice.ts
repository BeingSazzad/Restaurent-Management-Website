import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DELIVERY_ZONES } from '../../Mockdata';

interface FulfillmentState {
  type: 'delivery' | 'collection';
  eircode: string;
  selectedZone: typeof DELIVERY_ZONES[0] | null;
  customerAddress: string;
  isZoneValid: boolean;
  isCheckoutOpen: boolean;
}

const initialState: FulfillmentState = {
  type: 'delivery',
  eircode: 'D02 P682',
  selectedZone: DELIVERY_ZONES[0],
  customerAddress: '14 Grafton Street, Dublin 2',
  isZoneValid: true,
  isCheckoutOpen: false,
};

export const fulfillmentSlice = createSlice({
  name: 'fulfillment',
  initialState,
  reducers: {
    setFulfillmentType: (state, action: PayloadAction<'delivery' | 'collection'>) => {
      state.type = action.payload;
    },
    setEircode: (state, action: PayloadAction<string>) => {
      const code = action.payload.trim().toUpperCase();
      state.eircode = code;
      const prefix = code.slice(0, 3);
      const zone = DELIVERY_ZONES.find((z) => z.key === prefix);
      if (zone) {
        state.selectedZone = zone;
        state.isZoneValid = true;
      } else if (code.length >= 3) {
        state.selectedZone = null;
        state.isZoneValid = false;
      }
    },
    setCustomerAddress: (state, action: PayloadAction<string>) => {
      state.customerAddress = action.payload;
    },
    setCheckoutOpen: (state, action: PayloadAction<boolean>) => {
      state.isCheckoutOpen = action.payload;
    },
  },
});

export const { setFulfillmentType, setEircode, setCustomerAddress, setCheckoutOpen } =
  fulfillmentSlice.actions;
export default fulfillmentSlice.reducer;
