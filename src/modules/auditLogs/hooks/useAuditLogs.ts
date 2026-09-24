import { useQuery } from '@tanstack/react-query';
import { auditLogsApi } from '../api/auditLogs.api';
import type { AuditLogFilters } from '../api/auditLogs.types';

export const auditLogKeys = {
  all: ['audit-logs'] as const,
  list: (filters: AuditLogFilters) =>
    [...auditLogKeys.all, 'list', filters] as const,
  detail: (id: string) => [...auditLogKeys.all, 'detail', id] as const,
};

export function useAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: auditLogKeys.list(filters),
    queryFn: () => auditLogsApi.list(filters),
  });
}