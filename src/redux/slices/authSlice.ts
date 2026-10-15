import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MOCK_USER } from '../../Mockdata';

interface AuthState {
  isAuthenticated: boolean;
  user: typeof MOCK_USER | null;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isAuthModalOpen: false,
  authMode: 'login',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<typeof MOCK_USER>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isAuthModalOpen = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    openAuthModal: (state, action: PayloadAction<'login' | 'register'>) => {
      state.isAuthModalOpen = true;
      state.authMode = action.payload;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
  },
});

export const { login, logout, openAuthModal, closeAuthModal } = authSlice.actions;
export default authSlice.reducer;
