import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { BarChart3 } from 'lucide-react';

interface ReportChartProps {
  title?: string;
  description?: string;
  /** True while data is loading. */
  isLoading?: boolean;
  /** True when there is no data to display. */
  isEmpty?: boolean;
  /** Custom empty message. */
  emptyMessage?: string;
  /** Height of the chart area (px). Default: 300. */
  height?: number;
  /** Chart content (Recharts `<BarChart>`, `<LineChart>`, etc). */
  children: ReactNode;
  /** Optional content on the right side of the header (e.g. legend). */
  action?: ReactNode;
}

/**
 * A wrapper card for any Recharts chart.
 * Handles loading, empty, and layout states.
 */
export function ReportChart({
  title,
  description,
  isLoading,
  isEmpty,
  emptyMessage = 'No data available',
  height = 300,
  children,
  action,
}: ReportChartProps) {
  return (
    <Card>
      {title && (
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </CardHeader>
      )}

      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full" style={{ height }} />
        ) : isEmpty ? (
          <EmptyState
            icon={BarChart3}
            title={emptyMessage}
            className="border-0 py-8"
          />
        ) : (
          <div style={{ height }}>{children}</div>
        )}
      </CardContent>
    </Card>
  );
}