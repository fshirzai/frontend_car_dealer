import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { VehicleCard } from '@/modules/vehicles/components/VehicleCard';
import { useFavorites, useRemoveFavorite } from '../hooks/useFavorites';

export function FavoritesPage() {
  const { data, isLoading } = useFavorites();
  const remove = useRemoveFavorite();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Favorites"
        description="Vehicles you've saved for later"
      />

      {isLoading ? (
        <FullPageSpinner />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Browse vehicles and tap the heart to save them here."
          action={
            <Button asChild>
              <Link to="/vehicles">Browse vehicles</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((fav) => (
            <div key={fav.id} className="relative">
              <VehicleCard vehicle={fav.vehicleId} />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-3 top-3 z-10 shadow-md"
                onClick={() => {
                  if (confirm('Remove from favorites?')) {
                    remove.mutate(fav.id);
                  }
                }}
                disabled={remove.isPending}
                title="Remove from favorites"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}