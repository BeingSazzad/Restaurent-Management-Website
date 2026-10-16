import { authApi } from '../../../services/endpoints/authApi';
import { LoginFormData } from '../types';

export const authService = {
  loginStaff: async (data: LoginFormData) => {
    return authApi.login({ pinOrEmail: data.emailOrPin, password: data.password });
  },
};
