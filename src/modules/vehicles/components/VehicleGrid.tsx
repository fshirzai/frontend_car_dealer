import { Car } from 'lucide-react';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { VehicleCard } from './VehicleCard';
import type { PublicVehicle } from '../api/vehicles.types';

interface VehicleGridProps {
  vehicles: PublicVehicle[] | undefined;
  isLoading: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function VehicleGrid({
  vehicles,
  isLoading,
  emptyTitle = 'No vehicles found',
  emptyDescription = 'Try adjusting your filters or check back later.',
}: VehicleGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[16/10] w-full rounded-lg" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <EmptyState
        icon={Car}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}