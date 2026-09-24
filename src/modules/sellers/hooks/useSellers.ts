import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { normalizeError } from '@/shared/api/client';
import { sellersApi } from '../api/sellers.api';
import type {
  CreateSellerInput,
  SellerFilters,
  UpdateSellerInput,
} from '../api/sellers.types';

export const sellerKeys = {
  all: ['sellers'] as const,
  list: (filters: SellerFilters) =>
    [...sellerKeys.all, 'list', filters] as const,
  detail: (id: string) => [...sellerKeys.all, 'detail', id] as const,
};

export function useSellers(filters: SellerFilters = {}) {
  return useQuery({
    queryKey: sellerKeys.list(filters),
    queryFn: () => sellersApi.list(filters),
  });
}

export function useSeller(id: string | undefined) {
  return useQuery({
    queryKey: sellerKeys.detail(id ?? ''),
    queryFn: () => sellersApi.get(id!),
    enabled: Boolean(id),
  });
}

function useInvalidateSellers() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: sellerKeys.all });
}

export function useCreateSeller() {
  const invalidate = useInvalidateSellers();
  return useMutation({
    mutationFn: (input: CreateSellerInput) => sellersApi.create(input),
    onSuccess: () => {
      toast.success('Seller created');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useUpdateSeller(id: string) {
  const invalidate = useInvalidateSellers();
  return useMutation({
    mutationFn: (input: UpdateSellerInput) => sellersApi.update(id, input),
    onSuccess: () => {
      toast.success('Seller updated');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useToggleSellerActive(id: string, isActive: boolean) {
  const invalidate = useInvalidateSellers();
  return useMutation({
    mutationFn: () =>
      isActive ? sellersApi.deactivate(id) : sellersApi.activate(id),
    onSuccess: () => {
      toast.success(isActive ? 'Seller deactivated' : 'Seller activated');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useDeleteSeller() {
  const invalidate = useInvalidateSellers();
  return useMutation({
    mutationFn: (id: string) => sellersApi.remove(id),
    onSuccess: () => {
      toast.success('Seller deleted');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}