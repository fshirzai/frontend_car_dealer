import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { Pagination } from '@/shared/components/common/Pagination';
import { Spinner } from '@/shared/components/common/Spinner';
import { VehicleGrid } from '../components/VehicleGrid';
import { VehicleFilters } from '../components/VehicleFilters';
import { usePublicVehicles } from '../hooks/useVehicles';
import { useVehicleFilters } from '../hooks/useVehicleFilters';

export function VehicleListPage() {
  const { filters, setFilter, clearFilters, setPage } = useVehicleFilters();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data, isLoading, isFetching } = usePublicVehicles(filters);

  return (
    <div className="container py-8">
      <PageHeader
        title="Browse Vehicles"
        description="Find your perfect car from our curated inventory"
        actions={
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setShowMobileFilters((s) => !s)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        }
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar — desktop always visible, mobile toggleable */}
        <div
          className={`${
            showMobileFilters ? 'block' : 'hidden'
          } lg:sticky lg:top-20 lg:block lg:self-start`}
        >
          <VehicleFilters
            filters={filters}
            onChange={setFilter}
            onClear={clearFilters}
          />
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Result count + loading indicator */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {data
                ? `${data.meta.total.toLocaleString()} vehicle${
                    data.meta.total === 1 ? '' : 's'
                  } found`
                : 'Loading…'}
            </p>
            {isFetching && !isLoading && <Spinner className="h-4 w-4" />}
          </div>

          <VehicleGrid
            vehicles={data?.items}
            isLoading={isLoading}
            emptyTitle="No vehicles match your filters"
            emptyDescription="Try removing some filters or broadening your search."
          />

          {data && (
            <Pagination meta={data.meta} onPageChange={setPage} />
          )}
        </div>
      </div>
    </div>
  );
}