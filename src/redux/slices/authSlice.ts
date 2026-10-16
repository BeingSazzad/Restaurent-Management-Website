import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  role?: 'admin' | 'manager' | 'chef' | 'user';
  station?: string;
  addresses?: Array<{ id: string; label: string; address: string; eircode: string; isDefault: boolean }>;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';
}

const getStoredUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('amber_spice_auth_user');
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return null;
};

const initialUser = getStoredUser();

const initialState: AuthState = {
  isAuthenticated: !!initialUser,
  user: initialUser,
  isAuthModalOpen: false,
  authMode: 'login',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserProfile>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isAuthModalOpen = false;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('amber_spice_auth_user', JSON.stringify(action.payload));
        } catch {
          // ignore
        }
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('amber_spice_auth_user');
        } catch {
          // ignore
        }
      }
    },
    setUserRole: (state, action: PayloadAction<'admin' | 'manager' | 'chef' | 'user'>) => {
      if (state.user) {
        state.user.role = action.payload;
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('amber_spice_auth_user', JSON.stringify(state.user));
          } catch {
            // ignore
          }
        }
      }
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

export const { login, logout, setUserRole, openAuthModal, closeAuthModal } = authSlice.actions;
export default authSlice.reducer;
