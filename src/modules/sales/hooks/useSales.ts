import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { normalizeError } from '@/shared/api/client';
import { salesApi } from '../api/sales.api';
import type {
  CreateSaleInput,
  SaleFilters,
  UpdateSaleInput,
} from '../api/sales.types';

export const saleKeys = {
  all: ['sales'] as const,
  list: (filters: SaleFilters) => [...saleKeys.all, 'list', filters] as const,
  detail: (id: string) => [...saleKeys.all, 'detail', id] as const,
};

export function useSales(filters: SaleFilters = {}) {
  return useQuery({
    queryKey: saleKeys.list(filters),
    queryFn: () => salesApi.list(filters),
  });
}

export function useSale(id: string | undefined) {
  return useQuery({
    queryKey: saleKeys.detail(id ?? ''),
    queryFn: () => salesApi.get(id!),
    enabled: Boolean(id),
  });
}

function useInvalidateSales() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: saleKeys.all });
    qc.invalidateQueries({ queryKey: ['vehicles'] });
  };
}

export function useCreateSale() {
  const invalidate = useInvalidateSales();
  return useMutation({
    mutationFn: (input: CreateSaleInput) => salesApi.create(input),
    onSuccess: () => {
      toast.success('Sale recorded');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useUpdateSale(id: string) {
  const invalidate = useInvalidateSales();
  return useMutation({
    mutationFn: (input: UpdateSaleInput) => salesApi.update(id, input),
    onSuccess: () => {
      toast.success('Sale updated');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useDeleteSale() {
  const invalidate = useInvalidateSales();
  return useMutation({
    mutationFn: (id: string) => salesApi.remove(id),
    onSuccess: () => {
      toast.success('Sale reversed — vehicle restored');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}