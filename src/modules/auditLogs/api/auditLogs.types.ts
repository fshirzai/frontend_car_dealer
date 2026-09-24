import type { AuditAction } from '@/shared/types';

export interface AuditLog {
  id: string;
  userId: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  action: AuditAction;
  entityType: string;
  entityId: string | null;
  description: string | null;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  userId?: string;
  action?: AuditAction;
  entityType?: string;
  entityId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sort?: string;
}