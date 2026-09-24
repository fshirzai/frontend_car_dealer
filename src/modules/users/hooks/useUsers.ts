import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { normalizeError } from '@/shared/api/client';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { usersApi } from '../api/users.api';
import type {
  ChangePasswordInput,
  CreateUserInput,
  UpdateProfileInput,
  UpdateUserInput,
  UserFilters,
} from '../api/users.types';

export const userKeys = {
  all: ['users'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  list: (filters: UserFilters) => [...userKeys.all, 'list', filters] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

/* -------------------- Self -------------------- */

export function useMe() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => usersApi.me(),
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => usersApi.updateMe(input),
    onSuccess: (user) => {
      setUser(user);
      qc.invalidateQueries({ queryKey: userKeys.me() });
      toast.success('Profile updated');
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => usersApi.changePassword(input),
    onSuccess: () => toast.success('Password changed'),
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

/* -------------------- Admin -------------------- */

export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => usersApi.list(filters),
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ''),
    queryFn: () => usersApi.get(id!),
    enabled: Boolean(id),
  });
}

function useInvalidateUsers() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: userKeys.all });
}

export function useCreateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (input: CreateUserInput) => usersApi.create(input),
    onSuccess: () => {
      toast.success('User created');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useUpdateUser(id: string) {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (input: UpdateUserInput) => usersApi.update(id, input),
    onSuccess: () => {
      toast.success('User updated');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useToggleUserActive(id: string, isActive: boolean) {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: () =>
      isActive ? usersApi.deactivate(id) : usersApi.activate(id),
    onSuccess: () => {
      toast.success(isActive ? 'User deactivated' : 'User activated');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useDeleteUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => {
      toast.success('User deleted');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}