import { Badge } from '@/shared/components/ui/badge';
import { ORDER_STATUS, type OrderStatus } from '@/shared/types';

const CONFIG: Record<
  OrderStatus,
  {
    label: string;
    variant: 'default' | 'success' | 'warning' | 'destructive' | 'info';
  }
> = {
  [ORDER_STATUS.PENDING]: { label: 'Pending', variant: 'warning' },
  [ORDER_STATUS.CONTACTED]: { label: 'Contacted', variant: 'info' },
  [ORDER_STATUS.CONFIRMED]: { label: 'Confirmed', variant: 'default' },
  [ORDER_STATUS.COMPLETED]: { label: 'Completed', variant: 'success' },
  [ORDER_STATUS.CANCELLED]: { label: 'Cancelled', variant: 'destructive' },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, variant } = CONFIG[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export { CONFIG as ORDER_STATUS_CONFIG };