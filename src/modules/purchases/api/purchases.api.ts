import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse, PaginatedResponse } from '@/shared/api/types';
import type {
  CreatePurchaseInput,
  Purchase,
  PurchaseFilters,
  UpdatePurchaseInput,
} from './purchases.types';

export const purchasesApi = {
  async list(
    filters: PurchaseFilters = {}
  ): Promise<PaginatedResponse<Purchase>> {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<Purchase>>
    >(ENDPOINTS.purchases.list, { params: filters });
    return data.data;
  },

  async get(id: string): Promise<Purchase> {
    const { data } = await apiClient.get<ApiResponse<Purchase>>(
      ENDPOINTS.purchases.byId(id)
    );
    return data.data;
  },

  async create(input: CreatePurchaseInput): Promise<Purchase> {
    const { data } = await apiClient.post<ApiResponse<Purchase>>(
      ENDPOINTS.purchases.create,
      input
    );
    return data.data;
  },

  async update(id: string, input: UpdatePurchaseInput): Promise<Purchase> {
    const { data } = await apiClient.patch<ApiResponse<Purchase>>(
      ENDPOINTS.purchases.byId(id),
      input
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.purchases.byId(id));
  },
};