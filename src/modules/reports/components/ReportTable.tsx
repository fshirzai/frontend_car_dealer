import { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { FileText } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface ReportTableColumn<T> {
  /** Unique key — used as the React key for the column. */
  key: string;
  /** Column header content. */
  header: ReactNode;
  /** Cell render function. Receives the row and its index. */
  render: (row: T, index: number) => ReactNode;
  /** Optional className applied to both `<th>` and `<td>`. */
  className?: string;
  /** Right-align the column. Shorthand for `className="text-right"`. */
  align?: 'left' | 'right' | 'center';
}

interface ReportTableProps<T> {
  title?: string;
  description?: string;
  /** Column definitions. */
  columns: ReportTableColumn<T>[];
  /** Data rows. */
  rows: T[];
  /** Function returning a stable key for each row. */
  rowKey: (row: T, index: number) => string;
  /** Loading state. */
  isLoading?: boolean;
  /** Empty state message. */
  emptyMessage?: string;
  /** Optional click handler — makes rows interactive. */
  onRowClick?: (row: T) => void;
  /** Optional class applied to the outer wrapper. */
  className?: string;
}

/**
 * A generic data table for reports.
 * Renders loading skeletons, empty state, and dynamic columns.
 */
export function ReportTable<T>({
  title,
  description,
  columns,
  rows,
  rowKey,
  isLoading,
  emptyMessage = 'No data available',
  onRowClick,
  className,
}: ReportTableProps<T>) {
  const alignClass = (align?: 'left' | 'right' | 'center') => {
    switch (align) {
      case 'right':
        return 'text-right';
      case 'center':
        return 'text-center';
      default:
        return 'text-left';
    }
  };

  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
      )}

      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={emptyMessage}
            className="border-0 py-12"
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead
                      key={col.key}
                      className={cn(alignClass(col.align), col.className)}
                    >
                      {col.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={rowKey(row, index)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(onRowClick && 'cursor-pointer hover:bg-muted/50')}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn(alignClass(col.align), col.className)}
                      >
                        {col.render(row, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}