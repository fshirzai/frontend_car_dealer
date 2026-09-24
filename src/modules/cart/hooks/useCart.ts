import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { normalizeError } from '@/shared/api/client';
import { cartApi } from '../api/cart.api';

export const cartKeys = {
  all: ['cart'] as const,
  list: () => [...cartKeys.all, 'list'] as const,
  count: () => [...cartKeys.all, 'count'] as const,
};

export function useCart() {
  return useQuery({
    queryKey: cartKeys.list(),
    queryFn: () => cartApi.list(),
  });
}

export function useCartCount() {
  return useQuery({
    queryKey: cartKeys.count(),
    queryFn: () => cartApi.count(),
    staleTime: 30 * 1000,
  });
}

export function useIsInCart(vehicleId: string | undefined) {
  const { data } = useCart();
  if (!vehicleId || !data) return false;
  return data.items.some((item) => item.vehicleId.id === vehicleId);
}

function useInvalidateCart() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: cartKeys.all });
  };
}

export function useAddToCart() {
  const invalidate = useInvalidateCart();

  return useMutation({
    mutationFn: (vehicleId: string) => cartApi.add(vehicleId),
    onSuccess: () => {
      invalidate();
      toast.success('Added to cart');
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useRemoveFromCart() {
  const invalidate = useInvalidateCart();

  return useMutation({
    mutationFn: (cartItemId: string) => cartApi.removeById(cartItemId),
    onSuccess: () => {
      invalidate();
      toast.success('Removed from cart');
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useClearCart() {
  const invalidate = useInvalidateCart();

  return useMutation({
    mutationFn: () => cartApi.clear(),
    onSuccess: () => {
      invalidate();
      toast.success('Cart cleared');
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}