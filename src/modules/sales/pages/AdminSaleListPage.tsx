import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  X,
  Loader2,
  MoreHorizontal,
  Trash2,
  Wallet,
  Car,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { Pagination } from '@/shared/components/common/Pagination';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { formatCurrency, formatDate } from '@/shared/lib/utils';
import { PAYMENT_STATUS, SALE_CHANNEL } from '@/shared/types';
import {
  useStaffVehicles,
  useStaffVehicle,
} from '@/modules/vehicles/hooks/useVehicles';
import { useSales, useCreateSale, useDeleteSale } from '../hooks/useSales';
import type { CreateSaleInput } from '../api/sales.types';

const ALL = '__all__';

const EMPTY_FORM: CreateSaleInput = {
  vehicleId: '',
  salePrice: 0,
  currency: 'USD',
  saleDate: new Date().toISOString().slice(0, 10),
  channel: 'OFFLINE',
  paymentStatus: 'PAID',
  notes: '',
  invoiceNumber: '',
};

export function AdminSaleListPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [channelFilter, setChannelFilter] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const search = useDebounce(searchInput, 400);

  const { data, isLoading } = useSales({
    page,
    limit: 20,
    search: search || undefined,
    channel: (channelFilter as never) || undefined,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales"
        description="Recorded vehicle sales — one per vehicle"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record sale
          </Button>
        }
      />

      <div className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-12">
        <div className="relative sm:col-span-7">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sale #, invoice…"
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
            value={channelFilter ?? ALL}
            onValueChange={(v) => {
              setChannelFilter(v === ALL ? undefined : v);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any channel</SelectItem>
              {Object.values(SALE_CHANNEL).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
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
            icon={Wallet}
            title="No sales yet"
            description="When you complete a sale, it will appear here."
            action={
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Record sale
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sale #</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">
                        {s.saleNumber}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {s.vehicleId?.year} {s.vehicleId?.make}{' '}
                          {s.vehicleId?.model}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {s.vehicleId?.stockNumber}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm">
                        {s.customerId?.name ?? (
                          <span className="text-muted-foreground">Walk-in</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{s.channel}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(s.saleDate)}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatCurrency(s.salePrice, s.currency)}
                      </TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={s.paymentStatus} />
                      </TableCell>
                      <TableCell>
                        <SaleRowActions id={s.id} saleNumber={s.saleNumber} />
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

      <SaleDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

/* -------------------- Row actions -------------------- */

function SaleRowActions({
  id,
  saleNumber,
}: {
  id: string;
  saleNumber: string;
}) {
  const remove = useDeleteSale();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            if (
              confirm(
                `Reverse sale ${saleNumber}? The vehicle will be restored to AVAILABLE.`
              )
            ) {
              remove.mutate(id);
            }
          }}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Reverse sale
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const variants: Record<
    string,
    'success' | 'warning' | 'destructive' | 'info' | 'outline'
  > = {
    PAID: 'success',
    PENDING: 'warning',
    PARTIAL: 'info',
    REFUNDED: 'destructive',
  };
  return <Badge variant={variants[status] ?? 'outline'}>{status}</Badge>;
}

/* -------------------- Dialog -------------------- */

function SaleDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState<CreateSaleInput>(EMPTY_FORM);

  // ✅ Reset once when the dialog opens
  useEffect(() => {
    if (open) setForm(EMPTY_FORM);
  }, [open]);

  const { data: vehiclesData } = useStaffVehicles({
    limit: 100,
    status: 'AVAILABLE',
  });

  const { data: selectedVehicle } = useStaffVehicle(
    form.vehicleId || undefined
  );

  // Prefill salePrice only when it's still 0
  useEffect(() => {
    if (selectedVehicle && form.salePrice === 0) {
      setForm((f) => ({
        ...f,
        salePrice: selectedVehicle.askingPrice,
        currency: f.currency || selectedVehicle.currency,
      }));
    }
  }, [selectedVehicle, form.salePrice]);

  const create = useCreateSale();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicleId || form.salePrice <= 0) return;

    create.mutate(
      {
        ...form,
        notes: form.notes?.trim() || null,
        invoiceNumber: form.invoiceNumber?.trim() || null,
        saleDate: form.saleDate
  ? new Date(form.saleDate).toISOString()
  : new Date().toISOString(),
      },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader className="border-b p-6 pb-4">
            <DialogTitle>Record sale</DialogTitle>
            <DialogDescription>
              Recording a sale marks the vehicle as SOLD and removes it from
              the public storefront.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Vehicle *</Label>
              <Select
                value={form.vehicleId}
                onValueChange={(v) => setForm({ ...form, vehicleId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an available vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehiclesData?.items.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground">
                      No available vehicles
                    </div>
                  ) : (
                    vehiclesData?.items.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.stockNumber} — {v.year} {v.make} {v.model} —{' '}
                        {formatCurrency(v.askingPrice, v.currency)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Selected vehicle preview */}
            {selectedVehicle && (
              <div className="rounded-lg border bg-muted/40 p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {selectedVehicle.year} {selectedVehicle.make}{' '}
                    {selectedVehicle.model}
                    {selectedVehicle.trim ? ` ${selectedVehicle.trim}` : ''}
                  </span>
                </div>
                <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                  <span>Stock: {selectedVehicle.stockNumber}</span>
                  <span>
                    Asking:{' '}
                    {formatCurrency(
                      selectedVehicle.askingPrice,
                      selectedVehicle.currency
                    )}
                  </span>
                  <span>
                    Mileage: {selectedVehicle.mileage.toLocaleString()}
                  </span>
                  <span>
                    {selectedVehicle.bodyType} · {selectedVehicle.fuelType}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="sale-price">Sale price *</Label>
              <Input
                id="sale-price"
                type="number"
                step="0.01"
                min="0"
                value={form.salePrice}
                onChange={(e) =>
                  setForm({ ...form, salePrice: Number(e.target.value) })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale-currency">Currency</Label>
              <Input
                id="sale-currency"
                value={form.currency ?? 'USD'}
                maxLength={3}
                onChange={(e) =>
                  setForm({ ...form, currency: e.target.value.toUpperCase() })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale-date">Sale date</Label>
              <Input
                id="sale-date"
                type="date"
                value={form.saleDate}
                onChange={(e) =>
                  setForm({ ...form, saleDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Channel</Label>
              <Select
                value={form.channel}
                onValueChange={(v) =>
                  setForm({ ...form, channel: v as never })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SALE_CHANNEL).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Payment status</Label>
              <Select
                value={form.paymentStatus ?? 'PAID'}
                onValueChange={(v) =>
                  setForm({ ...form, paymentStatus: v as never })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PAYMENT_STATUS).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s[0] + s.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="sale-invoice">Invoice number</Label>
              <Input
                id="sale-invoice"
                value={form.invoiceNumber ?? ''}
                onChange={(e) =>
                  setForm({ ...form, invoiceNumber: e.target.value })
                }
                placeholder="e.g. INV-2026-0001"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="sale-notes">Notes</Label>
              <Textarea
                id="sale-notes"
                rows={3}
                value={form.notes ?? ''}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="border-t p-6 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !form.vehicleId || form.salePrice <= 0 || create.isPending
              }
            >
              {create.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Record sale
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}