import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  User as UserIcon,
  Save,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Package,
  Loader2,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import { Separator } from '@/shared/components/ui/separator';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { formatCurrency, formatDateTime } from '@/shared/lib/utils';
import { ORDER_STATUS, type OrderStatus } from '@/shared/types';
import {
  useStaffOrder,
  useUpdateOrderStatus,
  useUpdateStaffNotes,
} from '../hooks/useOrders';
import {
  OrderStatusBadge,
  ORDER_STATUS_CONFIG,
} from '../components/OrderStatusBadge';

export function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading, isError } = useStaffOrder(id);
  const updateStatus = useUpdateOrderStatus(id ?? '');
  const updateNotes = useUpdateStaffNotes(id ?? '');

  const [staffNotes, setStaffNotes] = useState('');
  const [notesDirty, setNotesDirty] = useState(false);

  useEffect(() => {
    if (order) {
      setStaffNotes(order.staffNotes ?? '');
      setNotesDirty(false);
    }
  }, [order]);

  if (isLoading) return <FullPageSpinner />;

  if (isError || !order) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to orders
          </Link>
        </Button>
        <EmptyState
          title="Order not found"
          action={
            <Button asChild>
              <Link to="/admin/orders">Back to orders</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const total = order.items.reduce((s, i) => s + i.unitPrice, 0);
  const currency = order.items[0]?.currency ?? 'USD';
  const statusCfg = ORDER_STATUS_CONFIG[order.status];

  const canContact =
    order.status === ORDER_STATUS.PENDING;
  const canConfirm =
    order.status === ORDER_STATUS.PENDING ||
    order.status === ORDER_STATUS.CONTACTED;
  const canComplete = order.status === ORDER_STATUS.CONFIRMED;
  const canCancel =
    order.status !== ORDER_STATUS.COMPLETED &&
    order.status !== ORDER_STATUS.CANCELLED;

  const handleStatusChange = (status: OrderStatus, cancelReason?: string) => {
    updateStatus.mutate({ status, cancelReason });
  };

  const handleCancel = () => {
    const reason = prompt(
      'Why are you cancelling this order? (required)',
      ''
    );
    if (reason === null) return;
    if (!reason.trim()) {
      alert('A cancellation reason is required.');
      return;
    }
    handleStatusChange(ORDER_STATUS.CANCELLED, reason.trim());
  };

  const handleSaveNotes = () => {
    updateNotes.mutate(staffNotes.trim() || null, {
      onSuccess: () => setNotesDirty(false),
    });
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/admin/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to orders
        </Link>
      </Button>

      <PageHeader
        title={order.orderNumber}
        description={`Placed ${formatDateTime(order.createdAt)}`}
        actions={<OrderStatusBadge status={order.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Status workflow */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border bg-muted/30 p-3">
                <p className="text-sm">
                  Current status:{' '}
                  <span className="font-medium">{statusCfg.label}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {canContact && (
                  <Button
                    onClick={() => handleStatusChange(ORDER_STATUS.CONTACTED)}
                    disabled={updateStatus.isPending}
                  >
                    <PhoneCall className="mr-2 h-4 w-4" />
                    Mark as contacted
                  </Button>
                )}

                {canConfirm && (
                  <Button
                    variant={order.status === ORDER_STATUS.CONTACTED ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(ORDER_STATUS.CONFIRMED)}
                    disabled={updateStatus.isPending}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Confirm order
                  </Button>
                )}

                {canComplete && (
                  <Button
                    onClick={() => handleStatusChange(ORDER_STATUS.COMPLETED)}
                    disabled={updateStatus.isPending}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Mark as completed
                  </Button>
                )}

                {canCancel && (
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={handleCancel}
                    disabled={updateStatus.isPending}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel order
                  </Button>
                )}
              </div>

              {updateStatus.isPending && (
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Updating…
                </p>
              )}
            </CardContent>
          </Card>

          {/* Vehicles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Vehicles ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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

          {/* Staff notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Staff notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Internal only — never shown to the customer.
              </p>
              <Textarea
                rows={4}
                value={staffNotes}
                onChange={(e) => {
                  setStaffNotes(e.target.value);
                  setNotesDirty(true);
                }}
                placeholder="e.g. Left a voicemail at 3pm. Customer will call back tomorrow."
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveNotes}
                  disabled={!notesDirty || updateNotes.isPending}
                  size="sm"
                >
                  {updateNotes.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save notes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cancel reason */}
          {order.cancelledAt && (
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-lg text-destructive">
                  Cancellation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Cancelled at:</span>{' '}
                  {formatDateTime(order.cancelledAt)}
                </p>
                {order.cancelReason && (
                  <p>
                    <span className="text-muted-foreground">Reason:</span>{' '}
                    {order.cancelReason}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <UserIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${order.customerPhone}`}
                  className="hover:underline"
                >
                  {order.customerPhone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="hover:underline"
                >
                  {order.customerEmail}
                </a>
              </div>
              {order.customerAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{order.customerAddress}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer notes */}
          {order.customerNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer message</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {order.customerNotes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <TimelineRow
                  label="Order placed"
                  time={order.createdAt}
                  done
                />
                <TimelineRow
                  label="Contacted"
                  time={order.contactedAt}
                  done={Boolean(order.contactedAt)}
                />
                <TimelineRow
                  label="Confirmed"
                  time={order.confirmedAt}
                  done={Boolean(order.confirmedAt)}
                />
                <TimelineRow
                  label="Completed"
                  time={order.completedAt}
                  done={Boolean(order.completedAt)}
                />
                {order.cancelledAt && (
                  <TimelineRow
                    label="Cancelled"
                    time={order.cancelledAt}
                    done
                    danger
                  />
                )}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
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