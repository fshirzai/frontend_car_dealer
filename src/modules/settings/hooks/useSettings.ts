import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { normalizeError } from '@/shared/api/client';
import { settingsApi } from '../api/settings.api';
import type { UpsertSettingsInput } from '../api/settings.types';

export const settingsKeys = {
  all: ['dealership-settings'] as const,
  detail: () => [...settingsKeys.all, 'detail'] as const,
};

export function useDealershipSettings() {
  return useQuery({
    queryKey: settingsKeys.detail(),
    queryFn: () => settingsApi.get(),
  });
}

export function useUpsertSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpsertSettingsInput) => settingsApi.upsert(input),
    onSuccess: () => {
      toast.success('Settings saved');
      qc.invalidateQueries({ queryKey: settingsKeys.all });
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}