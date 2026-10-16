import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StaffUser } from '../../types/common.types';
import { INITIAL_STAFF_USERS } from '../../lib/constants';

interface AuthState {
  user: StaffUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: INITIAL_STAFF_USERS[0], // Default logged-in as Head Chef for instant display
  token: 'mock-jwt-token-staff-kitchen',
  isAuthenticated: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: StaffUser; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    switchStation: (state, action: PayloadAction<StaffUser['shiftStation']>) => {
      if (state.user) {
        state.user.shiftStation = action.payload;
      }
    },
    updateProfile: (state, action: PayloadAction<{ name: string; email: string; phone?: string }>) => {
      if (state.user) {
        state.user.name = action.payload.name;
        state.user.email = action.payload.email;
        if (action.payload.phone !== undefined) {
          state.user.phone = action.payload.phone;
        }
      }
    },
    setActiveRole: (state, action: PayloadAction<StaffUser['role']>) => {
      if (state.user) {
        state.user.role = action.payload;
        if (action.payload === 'chef') {
          state.user.name = 'Chef Tariq';
        } else if (action.payload === 'expo') {
          state.user.name = 'Sarah O’Connor';
        } else if (action.payload === 'admin') {
          state.user.name = 'Manager Tariq';
        } else {
          state.user.name = 'Vikram Singh';
        }
      }
    },
  },
});

export const { loginSuccess, logout, switchStation, setActiveRole, updateProfile } = authSlice.actions;
export default authSlice.reducer;
