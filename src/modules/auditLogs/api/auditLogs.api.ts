import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse, PaginatedResponse } from '@/shared/api/types';
import type { AuditLog, AuditLogFilters } from './auditLogs.types';

export const auditLogsApi = {
  async list(
    filters: AuditLogFilters = {}
  ): Promise<PaginatedResponse<AuditLog>> {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<AuditLog>>
    >(ENDPOINTS.auditLogs.list, { params: filters });
    return data.data;
  },

  async get(id: string): Promise<AuditLog> {
    const { data } = await apiClient.get<ApiResponse<AuditLog>>(
      ENDPOINTS.auditLogs.byId(id)
    );
    return data.data;
  },
};