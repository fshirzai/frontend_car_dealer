import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse, PaginatedResponse } from '@/shared/api/types';
import type { Favorite, FavoriteToggleResponse } from './favorites.types';

export const favoritesApi = {
  async list(): Promise<PaginatedResponse<Favorite>> {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<Favorite>>
    >(ENDPOINTS.favorites.list, { params: { limit: 100 } });
    return data.data;
  },

  async add(vehicleId: string): Promise<Favorite> {
    const { data } = await apiClient.post<ApiResponse<Favorite>>(
      ENDPOINTS.favorites.add,
      { vehicleId }
    );
    return data.data;
  },

  async toggle(vehicleId: string): Promise<FavoriteToggleResponse> {
    const { data } = await apiClient.post<ApiResponse<FavoriteToggleResponse>>(
      ENDPOINTS.favorites.toggle,
      { vehicleId }
    );
    return data.data;
  },

  async removeByVehicle(vehicleId: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.favorites.removeByVehicle, {
      data: { vehicleId },
    });
  },

  async removeById(favoriteId: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.favorites.removeById(favoriteId));
  },
};