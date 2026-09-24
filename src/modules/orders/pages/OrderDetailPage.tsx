import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { formatCurrency, formatDateTime } from '@/shared/lib/utils';
import { ORDER_STATUS, type OrderStatus } from '@/shared/types';
import { useMyOrder, useCancelMyOrder } from '../hooks/useOrders';

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

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, isError } = useMyOrder(id);
  const cancel = useCancelMyOrder(id ?? '');

  if (isLoading) return <FullPageSpinner />;

  if (isError || !order) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/account/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to orders
          </Link>
        </Button>
        <EmptyState
          title="Order not found"
          action={
            <Button asChild>
              <Link to="/account/orders">Back to orders</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[order.status];
  const total = order.items.reduce((sum, item) => sum + item.unitPrice, 0);
  const currency = order.items[0]?.currency ?? 'USD';
  const cancellable = order.status === ORDER_STATUS.PENDING;

  const handleCancel = () => {
    const reason = prompt(
      'Why are you cancelling this order? (optional)',
      'Changed my mind'
    );
    if (reason === null) return; // user pressed cancel on prompt
    cancel.mutate(reason, {
      onSuccess: () => navigate('/account/orders'),
    });
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/account/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to orders
        </Link>
      </Button>

      <PageHeader
        title={order.orderNumber}
        description={`Placed ${formatDateTime(order.createdAt)}`}
        actions={
          <Badge variant={statusCfg.variant} className="text-sm">
            {statusCfg.label}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{item.vehicleName}</p>
                    <p className="text-xs text-muted-foreground">
                      Stock #{item.vehicleStockNumber}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(item.unitPrice, item.currency)}
                  </p>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total, currency)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <TimelineRow
                  label="Order placed"
                  time={order.createdAt}
                  done
                />
                <TimelineRow
                  label="Staff contacted you"
                  time={order.contactedAt}
                  done={Boolean(order.contactedAt)}
                />
                <TimelineRow
                  label="Order confirmed"
                  time={order.confirmedAt}
                  done={Boolean(order.confirmedAt)}
                />
                <TimelineRow
                  label="Sale completed"
                  time={order.completedAt}
                  done={Boolean(order.completedAt)}
                />
                {order.cancelledAt && (
                  <TimelineRow
                    label={`Cancelled${
                      order.cancelReason ? ` — ${order.cancelReason}` : ''
                    }`}
                    time={order.cancelledAt}
                    done
                    danger
                  />
                )}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Customer info + actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Name" value={order.customerName} />
              <Row label="Phone" value={order.customerPhone} />
              <Row label="Email" value={order.customerEmail} />
              <Row label="Address" value={order.customerAddress ?? '—'} />
            </CardContent>
          </Card>

          {order.customerNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {order.customerNotes}
                </p>
              </CardContent>
            </Card>
          )}

          {cancellable && (
            <Card>
              <CardContent className="pt-6">
                <p className="mb-3 text-xs text-muted-foreground">
                  You can cancel this order while it is still pending.
                </p>
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={handleCancel}
                  disabled={cancel.isPending}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel order
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function TimelineRow({
  label,
  time,
  done,
  danger,
}: {
  label: string;
  time: string | null;
  done: boolean;
  danger?: boolean;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-1.5 flex h-3 w-3 shrink-0 rounded-full ${
          done
            ? danger
              ? 'bg-destructive'
              : 'bg-primary'
            : 'border-2 border-muted bg-background'
        }`}
      />
      <div className="flex-1">
        <p
          className={`text-sm ${
            done ? 'font-medium' : 'text-muted-foreground'
          }`}
        >
          {label}
        </p>
        {time && (
          <p className="text-xs text-muted-foreground">
            {formatDateTime(time)}
          </p>
        )}
      </div>
    </li>
  );
}