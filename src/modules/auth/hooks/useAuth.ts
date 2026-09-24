import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { normalizeError } from '@/shared/api/client';
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from '../api/auth.types';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    user,
    setAuth,
    setUser,
    clearAuth,
    isAuthenticated,
    isAdmin,
    isSeller,
    isCustomer,
    isStaff,
  } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (data) => {
      setAuth(data.user, data.tokens);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      navigate('/');
    },
    onError: (err) => {
      const e = normalizeError(err);
      toast.error(e.message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: (data) => {
      setAuth(data.user, data.tokens);
      toast.success('Account created. Welcome!');
      navigate('/');
    },
    onError: (err) => {
      const e = normalizeError(err);
      toast.error(e.message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { refreshToken } = useAuthStore.getState();
      if (refreshToken) {
        await authApi.logout(refreshToken).catch(() => {});
      }
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Logged out');
      navigate('/login');
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (input: ForgotPasswordInput) => authApi.forgotPassword(input),
    onSuccess: () => {
      toast.success('If that email exists, a reset link was sent');
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (input: ResetPasswordInput) => authApi.resetPassword(input),
    onSuccess: () => {
      toast.success('Password reset. You can now sign in.');
      navigate('/login');
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });

  const logout = useCallback(() => logoutMutation.mutate(), [logoutMutation]);

  return {
    user,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    isSeller: isSeller(),
    isCustomer: isCustomer(),
    isStaff: isStaff(),

    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,

    logout,
    isLoggingOut: logoutMutation.isPending,

    forgotPassword: forgotPasswordMutation.mutate,
    isSendingReset: forgotPasswordMutation.isPending,

    resetPassword: resetPasswordMutation.mutate,
    isResettingPassword: resetPasswordMutation.isPending,

    // Manual token/user setters
    setUser,
    clearAuth,
  };
}