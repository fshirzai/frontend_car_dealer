import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse, PaginatedResponse } from '@/shared/api/types';
import type {
  ChangePasswordInput,
  CreateUserInput,
  UpdateProfileInput,
  UpdateUserInput,
  User,
  UserFilters,
} from './users.types';

export const usersApi = {
  /* -------------------- Self -------------------- */
  async me(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>(ENDPOINTS.users.me);
    return data.data;
  },

  async updateMe(input: UpdateProfileInput): Promise<User> {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      ENDPOINTS.users.updateMe,
      input
    );
    return data.data;
  },

  async changePassword(input: ChangePasswordInput): Promise<void> {
    await apiClient.patch(ENDPOINTS.users.changePassword, input);
  },

  /* -------------------- Admin -------------------- */
  async list(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
      ENDPOINTS.users.list,
      { params: filters }
    );
    return data.data;
  },

  async get(id: string): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>(
      ENDPOINTS.users.byId(id)
    );
    return data.data;
  },

  async create(input: CreateUserInput): Promise<User> {
    const { data } = await apiClient.post<ApiResponse<User>>(
      ENDPOINTS.users.create,
      input
    );
    return data.data;
  },

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      ENDPOINTS.users.byId(id),
      input
    );
    return data.data;
  },

  async activate(id: string): Promise<User> {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      ENDPOINTS.users.activate(id)
    );
    return data.data;
  },

  async deactivate(id: string): Promise<User> {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      ENDPOINTS.users.deactivate(id)
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.users.byId(id));
  },
};