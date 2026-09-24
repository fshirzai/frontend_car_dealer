import { Link } from 'react-router-dom';
import { Gauge, Fuel, Cog, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useVehicleImages } from '../hooks/useVehicles';
import { formatCurrency, formatNumber } from '@/shared/lib/utils';
import type { PublicVehicle } from '../api/vehicles.types';
import { VehicleStatusBadge } from './VehicleStatusBadge';
import { FavoriteButton } from '@/modules/favorites/components/FavoriteButton';

interface VehicleCardProps {
  vehicle: PublicVehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const { data: images } = useVehicleImages(vehicle.id);
  const primaryImage =
    images?.find((img) => img.isPrimary) ?? images?.[0] ?? null;

  const fullName = `${vehicle.year} ${vehicle.make} ${vehicle.model}${
    vehicle.trim ? ` ${vehicle.trim}` : ''
  }`;

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/vehicles/${vehicle.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.altText ?? fullName}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <VehicleStatusBadge status={vehicle.status} />
            {vehicle.condition === 'NEW' && (
              <Badge variant="info">New</Badge>
            )}
          </div>
                    <div className="absolute right-3 top-3">
            <FavoriteButton vehicleId={vehicle.id} floating />
          </div>
        </div>

        <CardContent className="space-y-3 p-4">
          <div>
            <h3 className="line-clamp-1 font-semibold">{fullName}</h3>
            <p className="text-xs text-muted-foreground">
              Stock #{vehicle.stockNumber}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {vehicle.year}
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="h-3 w-3" />
              {formatNumber(vehicle.mileage)} {vehicle.mileageUnit === 'KM' ? 'km' : 'mi'}
            </span>
            <span className="flex items-center gap-1">
              <Fuel className="h-3 w-3" />
              {vehicle.fuelType.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-end justify-between pt-2">
            <div>
              <p className="text-xs text-muted-foreground">Asking price</p>
              <p className="text-lg font-bold">
                {formatCurrency(vehicle.askingPrice, vehicle.currency)}
              </p>
            </div>
            <Button size="sm" variant="outline">
              View
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}