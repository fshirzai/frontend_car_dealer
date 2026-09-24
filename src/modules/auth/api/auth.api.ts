import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse } from '@/shared/api/types';
import type {
  AuthResponse,
  ForgotPasswordInput,
  LoginInput,
  LoginResponse,
  RegisterInput,
  ResetPasswordInput,
} from './auth.types';

export const authApi = {
  async login(input: LoginInput): Promise<LoginResponse> {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
      ENDPOINTS.auth.login,
      input
    );
    return data.data;
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      ENDPOINTS.auth.register,
      input
    );
    return data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post(ENDPOINTS.auth.logout, { refreshToken });
  },

  async logoutAll(): Promise<void> {
    await apiClient.post(ENDPOINTS.auth.logoutAll);
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    await apiClient.post(ENDPOINTS.auth.forgotPassword, input);
  },

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    await apiClient.post(ENDPOINTS.auth.resetPassword, input);
  },

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post(ENDPOINTS.auth.verifyEmail, { token });
  },
};