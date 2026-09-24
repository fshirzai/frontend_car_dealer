import { useState } from 'react';
import { Search, X, FileText } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { Pagination } from '@/shared/components/common/Pagination';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { formatDateTime } from '@/shared/lib/utils';
import { AUDIT_ACTION } from '@/shared/types';
import { useAuditLogs } from '../hooks/useAuditLogs';
import type { AuditLog } from '../api/auditLogs.types';

const ALL = '__all__';

const ACTION_COLORS: Record<
  string,
  'success' | 'warning' | 'destructive' | 'info' | 'outline'
> = {
  CREATE: 'success',
  UPDATE: 'info',
  DELETE: 'destructive',
  LOGIN: 'outline',
  LOGOUT: 'outline',
  STATUS_CHANGE: 'warning',
  PUBLISH: 'success',
  UNPUBLISH: 'warning',
  PURCHASE_CREATE: 'success',
  SALE_CREATE: 'success',
  ORDER_STATUS_CHANGE: 'warning',
};

export function AdminAuditLogPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [actionFilter, setActionFilter] = useState<string | undefined>();
  const [selected, setSelected] = useState<AuditLog | null>(null);

  const search = useDebounce(searchInput, 400);

  const { data, isLoading } = useAuditLogs({
    page,
    limit: 20,
    search: search || undefined,
    action: (actionFilter as never) || undefined,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="System activity trail — every important change"
      />

      <div className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-12">
        <div className="relative sm:col-span-7">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search description, entity type…"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="sm:col-span-5">
          <Select
            value={actionFilter ?? ALL}
            onValueChange={(v) => {
              setActionFilter(v === ALL ? undefined : v);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any action</SelectItem>
              {Object.values(AUDIT_ACTION).map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        {isLoading ? (
          <FullPageSpinner />
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No audit logs"
            description="Activity will appear here as staff use the system."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatDateTime(log.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.userId?.name ?? (
                          <span className="text-muted-foreground">System</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={ACTION_COLORS[log.action] ?? 'outline'}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className="font-mono">{log.entityType}</span>
                        {log.entityId && (
                          <span className="ml-1 text-muted-foreground">
                            · {log.entityId.slice(-6)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-md truncate text-sm text-muted-foreground">
                        {log.description ?? '—'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelected(log)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="border-t p-4">
              <Pagination meta={data.meta} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit log detail</DialogTitle>
            <DialogDescription>
              {selected && formatDateTime(selected.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <Row label="Action" value={selected.action} />
                <Row label="Entity type" value={selected.entityType} />
                <Row label="Entity ID" value={selected.entityId ?? '—'} mono />
                <Row label="Actor" value={selected.userId?.name ?? 'System'} />
                <Row label="IP" value={selected.ipAddress ?? '—'} />
                <Row label="User agent" value={selected.userAgent ?? '—'} />
              </div>

              {selected.description && (
                <div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    Description
                  </p>
                  <p className="text-sm">{selected.description}</p>
                </div>
              )}

              {selected.oldValues && (
                <div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    Old values
                  </p>
                  <pre className="max-h-64 overflow-auto rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify(selected.oldValues, null, 2)}
                  </pre>
                </div>
              )}

              {selected.newValues && (
                <div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    New values
                  </p>
                  <pre className="max-h-64 overflow-auto rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify(selected.newValues, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-right ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  );
}