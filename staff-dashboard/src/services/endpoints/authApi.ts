import { LoginRequest, LoginResponse } from '../../types/api.types';
import { INITIAL_STAFF_USERS } from '../../lib/constants';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Simulated auth service for live operations
    const user = INITIAL_STAFF_USERS.find(
      (u) => u.email.toLowerCase() === credentials.pinOrEmail.toLowerCase()
    ) || INITIAL_STAFF_USERS[0];

    return {
      token: 'jwt-staff-token-' + Date.now(),
      user,
    };
  },
  verifySession: async (): Promise<boolean> => {
    return true;
  },
};
