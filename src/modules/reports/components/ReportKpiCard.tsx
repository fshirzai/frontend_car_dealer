import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface ReportKpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  Icon?: LucideIcon;
  highlight?: boolean;
}

export function ReportKpiCard({
  title,
  value,
  description,
  Icon,
  highlight,
}: ReportKpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${highlight ? 'text-emerald-600' : ''}`}>
          {value}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}