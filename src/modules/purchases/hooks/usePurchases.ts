import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { normalizeError } from '@/shared/api/client';
import { purchasesApi } from '../api/purchases.api';
import type {
  CreatePurchaseInput,
  PurchaseFilters,
  UpdatePurchaseInput,
} from '../api/purchases.types';

export const purchaseKeys = {
  all: ['purchases'] as const,
  list: (filters: PurchaseFilters) =>
    [...purchaseKeys.all, 'list', filters] as const,
  detail: (id: string) => [...purchaseKeys.all, 'detail', id] as const,
};

export function usePurchases(filters: PurchaseFilters = {}) {
  return useQuery({
    queryKey: purchaseKeys.list(filters),
    queryFn: () => purchasesApi.list(filters),
  });
}

export function usePurchase(id: string | undefined) {
  return useQuery({
    queryKey: purchaseKeys.detail(id ?? ''),
    queryFn: () => purchasesApi.get(id!),
    enabled: Boolean(id),
  });
}

function useInvalidatePurchases() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: purchaseKeys.all });
    qc.invalidateQueries({ queryKey: ['vehicles'] });
  };
}

export function useCreatePurchase() {
  const invalidate = useInvalidatePurchases();
  return useMutation({
    mutationFn: (input: CreatePurchaseInput) => purchasesApi.create(input),
    onSuccess: () => {
      toast.success('Purchase recorded');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useUpdatePurchase(id: string) {
  const invalidate = useInvalidatePurchases();
  return useMutation({
    mutationFn: (input: UpdatePurchaseInput) => purchasesApi.update(id, input),
    onSuccess: () => {
      toast.success('Purchase updated');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useDeletePurchase() {
  const invalidate = useInvalidatePurchases();
  return useMutation({
    mutationFn: (id: string) => purchasesApi.remove(id),
    onSuccess: () => {
      toast.success('Purchase deleted');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}