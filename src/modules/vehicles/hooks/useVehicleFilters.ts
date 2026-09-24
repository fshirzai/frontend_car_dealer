import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { VehicleFilters } from '../api/vehicles.types';

/**
 * Filters are kept in the URL query string. This makes pages shareable
 * and preserves state on refresh/back-forward.
 */
export function useVehicleFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: VehicleFilters = useMemo(() => {
    const toNumber = (v: string | null) => (v ? Number(v) : undefined);
    return {
      page: toNumber(searchParams.get('page')) ?? 1,
      limit: toNumber(searchParams.get('limit')) ?? 12,
      make: searchParams.get('make') ?? undefined,
      model: searchParams.get('model') ?? undefined,
      yearMin: toNumber(searchParams.get('yearMin')),
      yearMax: toNumber(searchParams.get('yearMax')),
      priceMin: toNumber(searchParams.get('priceMin')),
      priceMax: toNumber(searchParams.get('priceMax')),
      mileageMax: toNumber(searchParams.get('mileageMax')),
      bodyType: (searchParams.get('bodyType') as never) ?? undefined,
      fuelType: (searchParams.get('fuelType') as never) ?? undefined,
      transmission: (searchParams.get('transmission') as never) ?? undefined,
      driveType: (searchParams.get('driveType') as never) ?? undefined,
      condition: (searchParams.get('condition') as never) ?? undefined,
      status: (searchParams.get('status') as never) ?? undefined,
      isPublished: searchParams.has('isPublished')
        ? searchParams.get('isPublished') === 'true'
        : undefined,
      search: searchParams.get('search') ?? undefined,
      sort: searchParams.get('sort') ?? '-createdAt',
    };
  }, [searchParams]);

  const setFilter = useCallback(
    (key: keyof VehicleFilters, value: unknown) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === undefined || value === null || value === '') {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
        // Any filter change resets pagination to page 1
        if (key !== 'page') next.set('page', '1');
        return next;
      });
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams();
      // Preserve nothing except maybe sort
      const sort = prev.get('sort');
      if (sort) next.set('sort', sort);
      next.set('page', '1');
      return next;
    });
  }, [setSearchParams]);

  const setPage = useCallback(
    (page: number) => setFilter('page', page),
    [setFilter]
  );

  return { filters, setFilter, clearFilters, setPage };
}