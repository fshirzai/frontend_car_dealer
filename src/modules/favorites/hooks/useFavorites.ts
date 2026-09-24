import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { normalizeError } from '@/shared/api/client';
import { favoritesApi } from '../api/favorites.api';

export const favoriteKeys = {
  all: ['favorites'] as const,
  list: () => [...favoriteKeys.all, 'list'] as const,
};

export function useFavorites() {
  return useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: () => favoritesApi.list(),
  });
}

/**
 * Quick lookup — is a specific vehicle favorited?
 * Derived from the cached list (no extra request).
 */
export function useIsFavorited(vehicleId: string | undefined) {
  const { data } = useFavorites();
  if (!vehicleId || !data) return false;
  return data.items.some((f) => f.vehicleId.id === vehicleId);
}

export function useToggleFavorite() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vehicleId: string) => favoritesApi.toggle(vehicleId),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: favoriteKeys.all });
      toast.success(result.favorited ? 'Added to favorites' : 'Removed from favorites');
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (favoriteId: string) => favoritesApi.removeById(favoriteId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: favoriteKeys.all });
      toast.success('Removed from favorites');
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}