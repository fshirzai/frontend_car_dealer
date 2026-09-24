import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  ShoppingBag,
  MoreHorizontal,
  Eye,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { Pagination } from '@/shared/components/common/Pagination';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { cn, formatCurrency, formatDateTime } from '@/shared/lib/utils';
import { ORDER_STATUS, type OrderStatus } from '@/shared/types';
import { useStaffOrders } from '../hooks/useOrders';
import { OrderStatusBadge } from '../components/OrderStatusBadge';

const STATUS_TABS: { value: OrderStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: ORDER_STATUS.PENDING, label: 'Pending' },
  { value: ORDER_STATUS.CONTACTED, label: 'Contacted' },
  { value: ORDER_STATUS.CONFIRMED, label: 'Confirmed' },
  { value: ORDER_STATUS.COMPLETED, label: 'Completed' },
  { value: ORDER_STATUS.CANCELLED, label: 'Cancelled' },
];

export function AdminOrderListPage() {
  const [statusTab, setStatusTab] = useState<OrderStatus | 'ALL'>('ALL');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);

  const search = useDebounce(searchInput, 400);

  const { data, isLoading } = useStaffOrders({
    page,
    limit: 20,
    status: statusTab === 'ALL' ? undefined : statusTab,
    search: search || undefined,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Customer order requests"
      />

      {/* Status tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusTab(tab.value);
              setPage(1);
            }}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              statusTab === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search order #, customer name, phone, email…"
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
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {data && (
          <span className="text-sm text-muted-foreground">
            {data.meta.total.toLocaleString()} order
            {data.meta.total === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <FullPageSpinner />
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders"
            description={
              statusTab === 'ALL'
                ? 'Orders will appear here once customers submit them.'
                : `No ${statusTab.toLowerCase()} orders.`
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Placed</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="font-medium hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.customerPhone}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.items.length} vehicle
                      {order.items.length === 1 ? '' : 's'}
                      {order.items[0] && (
                        <p className="text-xs text-muted-foreground">
                          {order.items[0].vehicleName}
                          {order.items.length > 1 &&
                            ` +${order.items.length - 1} more`}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {formatCurrency(
                        order.items.reduce((s, i) => s + i.unitPrice, 0),
                        order.items[0]?.currency ?? 'USD'
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/orders/${order.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="border-t p-4">
              <Pagination meta={data.meta} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}