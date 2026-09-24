import { Badge } from '@/shared/components/ui/badge';
import { VEHICLE_CONDITION, type VehicleCondition } from '@/shared/types';

const LABELS: Record<VehicleCondition, string> = {
  [VEHICLE_CONDITION.NEW]: 'New',
  [VEHICLE_CONDITION.USED]: 'Used',
  [VEHICLE_CONDITION.CERTIFIED_PRE_OWNED]: 'Certified Pre-Owned',
};

export function VehicleConditionBadge({
  condition,
}: {
  condition: VehicleCondition;
}) {
  return <Badge variant="secondary">{LABELS[condition]}</Badge>;
}