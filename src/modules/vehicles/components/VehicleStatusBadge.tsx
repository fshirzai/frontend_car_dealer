import { Badge } from '@/shared/components/ui/badge';
import { VEHICLE_STATUS, type VehicleStatus } from '@/shared/types';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

const CONFIG: Record<
  VehicleStatus,
  { label: string; variant: 'success' | 'warning' | 'destructive'; Icon: typeof CheckCircle2 }
> = {
  [VEHICLE_STATUS.AVAILABLE]: {
    label: 'Available',
    variant: 'success',
    Icon: CheckCircle2,
  },
  [VEHICLE_STATUS.RESERVED]: {
    label: 'Reserved',
    variant: 'warning',
    Icon: Clock,
  },
  [VEHICLE_STATUS.SOLD]: {
    label: 'Sold',
    variant: 'destructive',
    Icon: XCircle,
  },
};

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  const { label, variant, Icon } = CONFIG[status];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}