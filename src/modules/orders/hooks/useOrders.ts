import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { normalizeError } from '@/shared/api/client';
import type { OrderStatus } from '@/shared/types';
import { ordersApi } from '../api/orders.api';
import type { CreateOrderInput, OrderFilters } from '../api/orders.types';

/* -------------------- Customer keys -------------------- */
export const orderKeys = {
  all: ['orders'] as const,
  mine: (filters: OrderFilters) =>
    [...orderKeys.all, 'mine', 'list', filters] as const,
  mineDetail: (id: string) =>
    [...orderKeys.all, 'mine', 'detail', id] as const,
};

/* -------------------- Staff keys -------------------- */
export const staffOrderKeys = {
  all: ['orders', 'staff'] as const,
  list: (filters: OrderFilters) =>
    [...staffOrderKeys.all, 'list', filters] as const,
  detail: (id: string) => [...staffOrderKeys.all, 'detail', id] as const,
};

/* -------------------- Customer hooks -------------------- */

export function useMyOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: orderKeys.mine(filters),
    queryFn: () => ordersApi.listMine(filters),
  });
}

export function useMyOrder(id: string | undefined) {
  return useQuery({
    queryKey: orderKeys.mineDetail(id ?? ''),
    queryFn: () => ordersApi.getMine(id!),
    enabled: Boolean(id),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => ordersApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all });
      qc.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useCancelMyOrder(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reason?: string) => ordersApi.cancelMine(id, reason),
    onSuccess: () => {
      toast.success('Order cancelled');
      qc.invalidateQueries({ queryKey: orderKeys.all });
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

/* -------------------- Staff hooks -------------------- */

export function useStaffOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: staffOrderKeys.list(filters),
    queryFn: () => ordersApi.listStaff(filters),
  });
}

export function useStaffOrder(id: string | undefined) {
  return useQuery({
    queryKey: staffOrderKeys.detail(id ?? ''),
    queryFn: () => ordersApi.getStaff(id!),
    enabled: Boolean(id),
  });
}

export function useUpdateOrderStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      status,
      cancelReason,
    }: {
      status: OrderStatus;
      cancelReason?: string;
    }) => ordersApi.updateStatus(id, status, cancelReason),
    onSuccess: () => {
      toast.success('Order status updated');
      qc.invalidateQueries({ queryKey: staffOrderKeys.all });
      qc.invalidateQueries({ queryKey: orderKeys.all });
      qc.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useUpdateStaffNotes(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (staffNotes: string | null) =>
      ordersApi.updateStaffNotes(id, staffNotes),
    onSuccess: () => {
      toast.success('Notes saved');
      qc.invalidateQueries({ queryKey: staffOrderKeys.detail(id) });
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}