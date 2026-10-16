import { StaffUser, KdsOrder } from './common.types';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginRequest {
  pinOrEmail: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  user: StaffUser;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: KdsOrder['status'];
}
