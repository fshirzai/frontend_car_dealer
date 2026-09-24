import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse, PaginatedResponse } from '@/shared/api/types';
import type {
  CreateSellerInput,
  Seller,
  SellerFilters,
  UpdateSellerInput,
} from './sellers.types';

export const sellersApi = {
  async list(filters: SellerFilters = {}): Promise<PaginatedResponse<Seller>> {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<Seller>>
    >(ENDPOINTS.sellers.list, { params: filters });
    return data.data;
  },

  async get(id: string): Promise<Seller> {
    const { data } = await apiClient.get<ApiResponse<Seller>>(
      ENDPOINTS.sellers.byId(id)
    );
    return data.data;
  },

  async create(input: CreateSellerInput): Promise<Seller> {
    const { data } = await apiClient.post<ApiResponse<Seller>>(
      ENDPOINTS.sellers.create,
      input
    );
    return data.data;
  },

  async update(id: string, input: UpdateSellerInput): Promise<Seller> {
    const { data } = await apiClient.patch<ApiResponse<Seller>>(
      ENDPOINTS.sellers.byId(id),
      input
    );
    return data.data;
  },

  async activate(id: string): Promise<Seller> {
    const { data } = await apiClient.patch<ApiResponse<Seller>>(
      ENDPOINTS.sellers.activate(id)
    );
    return data.data;
  },

  async deactivate(id: string): Promise<Seller> {
    const { data } = await apiClient.patch<ApiResponse<Seller>>(
      ENDPOINTS.sellers.deactivate(id)
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.sellers.byId(id));
  },
};