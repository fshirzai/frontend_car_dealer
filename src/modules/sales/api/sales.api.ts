import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse, PaginatedResponse } from '@/shared/api/types';
import type {
  CreateSaleInput,
  Sale,
  SaleFilters,
  UpdateSaleInput,
} from './sales.types';

export const salesApi = {
  async list(filters: SaleFilters = {}): Promise<PaginatedResponse<Sale>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Sale>>>(
      ENDPOINTS.sales.list,
      { params: filters }
    );
    return data.data;
  },

  async get(id: string): Promise<Sale> {
    const { data } = await apiClient.get<ApiResponse<Sale>>(
      ENDPOINTS.sales.byId(id)
    );
    return data.data;
  },

  async create(input: CreateSaleInput): Promise<Sale> {
    const { data } = await apiClient.post<ApiResponse<Sale>>(
      ENDPOINTS.sales.create,
      input
    );
    return data.data;
  },

  async update(id: string, input: UpdateSaleInput): Promise<Sale> {
    const { data } = await apiClient.patch<ApiResponse<Sale>>(
      ENDPOINTS.sales.byId(id),
      input
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.sales.byId(id));
  },
};