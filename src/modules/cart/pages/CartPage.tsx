import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, X, FileText } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { Badge } from '@/shared/components/ui/badge';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { formatCurrency } from '@/shared/lib/utils';
import { useVehicleImages } from '@/modules/vehicles/hooks/useVehicles';
import { useCart, useRemoveFromCart, useClearCart } from '../hooks/useCart';
import type { CartItem } from '../api/cart.types';

export function CartPage() {
  const { data, isLoading } = useCart();
  const remove = useRemoveFromCart();
  const clear = useClearCart();
  const navigate = useNavigate();

  if (isLoading) return <FullPageSpinner />;

  if (!data || data.items.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Cart" description="Vehicles ready to order" />
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Browse vehicles and add them to your cart to start an order."
          action={
            <Button asChild>
              <Link to="/vehicles">Browse vehicles</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const subtotal = data.items.reduce(
    (sum, item) => sum + item.vehicleId.askingPrice,
    0
  );
  const currency = data.items[0]?.vehicleId.currency ?? 'USD';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cart"
        description={`${data.items.length} vehicle${
          data.items.length === 1 ? '' : 's'
        } ready to order`}
        actions={
          <Button
            variant="outline"
            onClick={() => {
              if (confirm('Clear your entire cart?')) clear.mutate();
            }}
            disabled={clear.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear cart
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Items */}
        <div className="space-y-3">
          {data.items.map((item) => (
            <CartRow
              key={item.id}
              item={item}
              onRemove={() => remove.mutate(item.id)}
              onPlaceOrder={() =>
                navigate(`/account/cart/checkout/${item.vehicleId.id}`)
              }
              removing={remove.isPending}
            />
          ))}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h3 className="text-lg font-semibold">Cart summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Vehicles ({data.items.length})
                  </span>
                  <span className="font-medium">
                    {formatCurrency(subtotal, currency)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-base font-semibold">
                <span>Estimated total</span>
                <span>{formatCurrency(subtotal, currency)}</span>
              </div>

              <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
                Each vehicle is ordered individually. Click{' '}
                <strong>Place order</strong> on the vehicle you want to
                purchase — a staff member will contact you to confirm.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Row -------------------- */

function CartRow({
  item,
  onRemove,
  onPlaceOrder,
  removing,
}: {
  item: CartItem;
  onRemove: () => void;
  onPlaceOrder: () => void;
  removing: boolean;
}) {
  const vehicle = item.vehicleId;
  const { data: images } = useVehicleImages(vehicle.id);
  const primaryImage = images?.find((i) => i.isPrimary) ?? images?.[0];

  const fullName = `${vehicle.year} ${vehicle.make} ${vehicle.model}${
    vehicle.trim ? ` ${vehicle.trim}` : ''
  }`;

  const canOrder = vehicle.status === 'AVAILABLE';

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
        <Link
          to={`/vehicles/${vehicle.id}`}
          className="relative h-28 w-full shrink-0 overflow-hidden rounded-md border bg-muted sm:h-24 sm:w-32"
        >
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </Link>

        <div className="flex flex-1 flex-col justify-between gap-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  to={`/vehicles/${vehicle.id}`}
                  className="line-clamp-1 font-semibold hover:underline"
                >
                  {fullName}
                </Link>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Stock #{vehicle.stockNumber} · {vehicle.bodyType} ·{' '}
                  {vehicle.fuelType}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                disabled={removing}
                title="Remove from cart"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline">{vehicle.condition}</Badge>
              {vehicle.status !== 'AVAILABLE' && (
                <Badge variant="warning">{vehicle.status}</Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-lg font-bold">
                {formatCurrency(vehicle.askingPrice, vehicle.currency)}
              </p>
            </div>

            <Button
              onClick={onPlaceOrder}
              disabled={!canOrder}
              title={
                !canOrder
                  ? 'This vehicle is not available for order'
                  : 'Place an order for this vehicle'
              }
            >
              <FileText className="mr-2 h-4 w-4" />
              Place order
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}