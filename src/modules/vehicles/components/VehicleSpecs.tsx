import { Separator } from '@/shared/components/ui/separator';
import { formatNumber } from '@/shared/lib/utils';
import type { PublicVehicle } from '../api/vehicles.types';

interface VehicleSpecsProps {
  vehicle: PublicVehicle;
}

export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const specs: { label: string; value: string }[] = [
    { label: 'Stock Number', value: vehicle.stockNumber },
    { label: 'Year', value: String(vehicle.year) },
    { label: 'Make', value: vehicle.make },
    { label: 'Model', value: vehicle.model },
    { label: 'Trim', value: vehicle.trim ?? '—' },
    { label: 'Body Type', value: formatEnum(vehicle.bodyType) },
    { label: 'Color', value: vehicle.color ?? '—' },
    { label: 'Fuel Type', value: formatEnum(vehicle.fuelType) },
    { label: 'Transmission', value: formatEnum(vehicle.transmission) },
    { label: 'Drive Type', value: formatEnum(vehicle.driveType) },
    { label: 'Condition', value: formatEnum(vehicle.condition) },
    {
      label: 'Mileage',
      value: `${formatNumber(vehicle.mileage)} ${
        vehicle.mileageUnit === 'KM' ? 'km' : 'miles'
      }`,
    },
  ];

  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Specifications</h2>
      </div>
      <div className="grid grid-cols-1 gap-y-3 p-4 sm:grid-cols-2">
        {specs.map((spec) => (
          <div key={spec.label} className="flex items-center justify-between gap-4 py-1">
            <span className="text-sm text-muted-foreground">{spec.label}</span>
            <span className="text-sm font-medium">{spec.value}</span>
          </div>
        ))}
      </div>
      {vehicle.description && (
        <>
          <Separator />
          <div className="p-4">
            <h3 className="mb-2 text-sm font-semibold">Description</h3>
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              {vehicle.description}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function formatEnum(value: string): string {
  return value
    .split('_')
    .map((s) => s[0] + s.slice(1).toLowerCase())
    .join(' ');
}