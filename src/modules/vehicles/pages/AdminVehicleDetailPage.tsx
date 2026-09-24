import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { VehicleStatusBadge } from '../components/VehicleStatusBadge';
import { VehicleGallery } from '../components/VehicleGallery';
import { useVehicleImages } from '../hooks/useVehicles';
import {
  useStaffVehicle,
  usePublishVehicle,
  useUnpublishVehicle,
  useDeleteVehicle,
  useVehicleProfit,
} from '../hooks/useVehicles';
import { formatCurrency, formatDate } from '@/shared/lib/utils';
import { useNavigate } from 'react-router-dom';
import { VehicleMediaSection } from '../components/VehicleMediaSection';
export function AdminVehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: vehicle, isLoading } = useStaffVehicle(id);
  const { data: images = [] } = useVehicleImages(id);
  const { data: profit } = useVehicleProfit(id);

  const publish = usePublishVehicle(id ?? '');
  const unpublish = useUnpublishVehicle(id ?? '');
  const remove = useDeleteVehicle();

  if (isLoading) return <FullPageSpinner />;

  if (!vehicle) {
    return (
      <EmptyState
        title="Vehicle not found"
        action={<Button asChild><Link to="/admin/vehicles">Back</Link></Button>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/admin/vehicles">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to vehicles
        </Link>
      </Button>

      <PageHeader
        title={`${vehicle.year} ${vehicle.make} ${vehicle.model}${
          vehicle.trim ? ` ${vehicle.trim}` : ''
        }`}
        description={`Stock #${vehicle.stockNumber}`}
        actions={
          <>
            {vehicle.isPublished ? (
              <Button
                variant="outline"
                onClick={() => unpublish.mutate()}
                disabled={unpublish.isPending}
              >
                <EyeOff className="mr-2 h-4 w-4" />
                Unpublish
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => publish.mutate()}
                disabled={publish.isPending}
              >
                <Eye className="mr-2 h-4 w-4" />
                Publish
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link to={`/admin/vehicles/${vehicle.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                if (confirm(`Delete ${vehicle.stockNumber}?`)) {
                  remove.mutate(vehicle.id, {
                    onSuccess: () => navigate('/admin/vehicles'),
                  });
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: gallery + media management + profit */}
        <div className="space-y-6 lg:col-span-2">
          <VehicleGallery images={images} />

          {/* Media management */}
          <VehicleMediaSection vehicleId={vehicle.id} />

          {/* Profit card */}
          {profit && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profit summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <Stat label="Purchase price" value={formatCurrency(profit.purchasePrice, profit.currency)} />
                <Stat label="Total expenses" value={formatCurrency(profit.totalExpenses, profit.currency)} />
                <Stat label="Total cost" value={formatCurrency(profit.totalCost, profit.currency)} />
                <Stat
                  label="Sale price"
                  value={profit.salePrice !== null ? formatCurrency(profit.salePrice, profit.currency) : '—'}
                />
                <Stat
                  label="Gross profit"
                  value={
                    profit.grossProfit !== null
                      ? formatCurrency(profit.grossProfit, profit.currency)
                      : '—'
                  }
                  highlight
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: meta */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Availability</span>
                <VehicleStatusBadge status={vehicle.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Published</span>
                <span className="text-sm font-medium">
                  {vehicle.isPublished ? 'Yes' : 'No'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="VIN" value={vehicle.vin ?? '—'} mono />
              <Row label="Engine #" value={vehicle.engineNumber ?? '—'} mono />
              <Row label="Body" value={vehicle.bodyType} />
              <Row label="Fuel" value={vehicle.fuelType} />
              <Row label="Transmission" value={vehicle.transmission} />
              <Row label="Drive" value={vehicle.driveType} />
              <Row label="Mileage" value={`${vehicle.mileage.toLocaleString()} ${vehicle.mileageUnit.toLowerCase()}`} />
              <Separator />
              <Row label="Created" value={formatDate(vehicle.createdAt)} />
              <Row label="Updated" value={formatDate(vehicle.updatedAt)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold ${
          highlight ? 'text-emerald-600' : ''
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? 'font-mono text-xs' : 'font-medium'}>{value}</span>
    </div>
  );
}