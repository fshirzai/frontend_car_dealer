import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse } from '@/shared/api/types';
import type { DealershipSettings, UpsertSettingsInput } from './settings.types';

export const settingsApi = {
  async get(): Promise<DealershipSettings> {
    const { data } = await apiClient.get<ApiResponse<DealershipSettings>>(
      ENDPOINTS.dealershipSettings.get
    );
    return data.data;
  },

  async upsert(input: UpsertSettingsInput): Promise<DealershipSettings> {
    const { data } = await apiClient.put<ApiResponse<DealershipSettings>>(
      ENDPOINTS.dealershipSettings.upsert,
      input
    );
    return data.data;
  },

  async update(
    input: Partial<UpsertSettingsInput>
  ): Promise<DealershipSettings> {
    const { data } = await apiClient.patch<ApiResponse<DealershipSettings>>(
      ENDPOINTS.dealershipSettings.update,
      input
    );
    return data.data;
  },
};