import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { formatCurrency, formatDateTime } from '@/shared/lib/utils';
import { ORDER_STATUS, type OrderStatus } from '@/shared/types';
import { useMyOrders } from '../hooks/useOrders';
import type { Order } from '../api/orders.types';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'info' }
> = {
  [ORDER_STATUS.PENDING]: { label: 'Pending', variant: 'warning' },
  [ORDER_STATUS.CONTACTED]: { label: 'Contacted', variant: 'info' },
  [ORDER_STATUS.CONFIRMED]: { label: 'Confirmed', variant: 'default' },
  [ORDER_STATUS.COMPLETED]: { label: 'Completed', variant: 'success' },
  [ORDER_STATUS.CANCELLED]: { label: 'Cancelled', variant: 'destructive' },
};

export function MyOrdersPage() {
  const { data, isLoading } = useMyOrders({ limit: 50 });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Orders"
        description="Track your order requests"
        actions={
          <Button asChild variant="outline">
            <Link to="/vehicles">
              <Plus className="mr-2 h-4 w-4" />
              Browse vehicles
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <FullPageSpinner />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="When you place an order request, it will appear here."
          action={
            <Button asChild>
              <Link to="/vehicles">Browse vehicles</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {data.items.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const statusCfg = STATUS_CONFIG[order.status];
  const itemCount = order.items.length;
  const total = order.items.reduce((sum, item) => sum + item.unitPrice, 0);
  const currency = order.items[0]?.currency ?? 'USD';

  return (
    <Link to={`/account/orders/${order.id}`} className="block">
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-semibold">
                {order.orderNumber}
              </span>
              <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {itemCount} vehicle{itemCount === 1 ? '' : 's'} ·{' '}
              {formatDateTime(order.createdAt)}
            </p>

            <div className="mt-2 space-y-1">
              {order.items.slice(0, 2).map((item) => (
                <p key={item._id} className="text-sm">
                  {item.vehicleName}{' '}
                  <span className="text-muted-foreground">
                    · {item.vehicleStockNumber}
                  </span>
                </p>
              ))}
              {itemCount > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{itemCount - 2} more
                </p>
              )}
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold">
              {formatCurrency(total, currency)}
            </p>
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
}