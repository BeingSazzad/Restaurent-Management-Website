import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { loginSuccess } from '../../../store/slices/authSlice';
import { authService } from '../services/authService';
import { LoginFormData } from '../types';
import { ROUTES } from '../../../constants/routes';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const login = async (formData: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.loginStaff(formData);
      dispatch(loginSuccess(response));
      navigate(ROUTES.DASHBOARD.ROOT);
    } catch {
      setError('Invalid staff credentials. Try headchef@amberspice.ie');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
