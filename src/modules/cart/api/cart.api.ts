import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse, PaginatedResponse } from '@/shared/api/types';
import type { CartCountResponse, CartItem, ClearCartResponse } from './cart.types';

export const cartApi = {
  async list(): Promise<PaginatedResponse<CartItem>> {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<CartItem>>
    >(ENDPOINTS.cart.list, { params: { limit: 100 } });
    return data.data;
  },

  async count(): Promise<number> {
    const { data } = await apiClient.get<ApiResponse<CartCountResponse>>(
      ENDPOINTS.cart.count
    );
    return data.data.count;
  },

  async add(vehicleId: string): Promise<CartItem> {
    const { data } = await apiClient.post<ApiResponse<CartItem>>(
      ENDPOINTS.cart.add,
      { vehicleId }
    );
    return data.data;
  },

  async removeByVehicle(vehicleId: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.cart.remove, {
      data: { vehicleId },
    });
  },

  async removeById(cartItemId: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.cart.removeById(cartItemId));
  },

  async clear(): Promise<ClearCartResponse> {
    const { data } = await apiClient.delete<ApiResponse<ClearCartResponse>>(
      ENDPOINTS.cart.clear
    );
    return data.data;
  },
};