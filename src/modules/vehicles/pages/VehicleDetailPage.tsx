import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { usePublicVehicle, useVehicleImages, useVehicleVideo } from '../hooks/useVehicles';
import { VehicleGallery } from '../components/VehicleGallery';
import { VehicleSpecs } from '../components/VehicleSpecs';
import { VehicleStatusBadge } from '../components/VehicleStatusBadge';
import { VehicleConditionBadge } from '../components/VehicleConditionBadge';
import { formatCurrency } from '@/shared/lib/utils';
import { VideoPlayer } from '@/shared/components/common/VideoPlayer';
import { FavoriteButton } from '@/modules/favorites/components/FavoriteButton';
import { AddToCartButton } from '@/modules/cart/components/AddToCartButton';


export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: vehicle, isLoading, isError } = usePublicVehicle(id);
  const { data: images = [] } = useVehicleImages(id);
  const { data: video } = useVehicleVideo(id);

  if (isLoading) return <FullPageSpinner />;

  if (isError || !vehicle) {
    return (
      <div className="container py-20">
        <EmptyState
          title="Vehicle not found"
          description="This vehicle may have been sold or removed."
          action={
            <Button asChild>
              <Link to="/vehicles">Browse all vehicles</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const fullName = `${vehicle.year} ${vehicle.make} ${vehicle.model}${
    vehicle.trim ? ` ${vehicle.trim}` : ''
  }`;

  return (
    <div className="container py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/vehicles">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to vehicles
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left — gallery + specs */}
        <div className="space-y-8">
          <VehicleGallery images={images} />

          {video && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">
                {video.title ?? 'Walk-around video'}
              </h2>
              <VideoPlayer
                url={video.url}
                poster={video.thumbnailUrl}
                title={video.title}
              />
            </div>
          )}

          <VehicleSpecs vehicle={vehicle} />
        </div>

        {/* Right — sticky action panel */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-wrap items-center gap-2">
              <VehicleStatusBadge status={vehicle.status} />
              <VehicleConditionBadge condition={vehicle.condition} />
              <Badge variant="outline">Stock #{vehicle.stockNumber}</Badge>
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight">{fullName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {vehicle.bodyType.toLowerCase()} · {vehicle.fuelType.toLowerCase()} ·{' '}
              {vehicle.transmission.toLowerCase()}
            </p>

            <div className="mt-6">
              <p className="text-sm text-muted-foreground">Asking price</p>
              <p className="text-3xl font-bold">
                {formatCurrency(vehicle.askingPrice, vehicle.currency)}
              </p>
            </div>

            <Separator className="my-6" />

            {vehicle.status === 'AVAILABLE' ? (
              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  <FileText className="mr-2 h-4 w-4" />
                  Place order request
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <FavoriteButton vehicleId={vehicle.id} variant="full" />
                  <AddToCartButton vehicleId={vehicle.id} variant="full" />
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-dashed bg-muted/40 p-4 text-center text-sm text-muted-foreground">
                {vehicle.status === 'SOLD'
                  ? 'This vehicle has been sold.'
                  : 'This vehicle is currently reserved.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}