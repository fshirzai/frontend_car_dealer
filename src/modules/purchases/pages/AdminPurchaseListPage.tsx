import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  X,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  Receipt,
  Car,
  Building2,
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
import { PAYMENT_STATUS } from '@/shared/types';
import { useSellers } from '@/modules/sellers/hooks/useSellers';
import {
  useStaffVehicles,
  useStaffVehicle,
} from '@/modules/vehicles/hooks/useVehicles';
import {
  usePurchases,
  useCreatePurchase,
  useUpdatePurchase,
  useDeletePurchase,
} from '../hooks/usePurchases';
import type { CreatePurchaseInput, Purchase } from '../api/purchases.types';
import { DocumentUploader } from '@/shared/components/common/DocumentUploader';
const ALL = '__all__';

const EMPTY_FORM: CreatePurchaseInput = {
  vehicleId: '',
  sellerId: '',
  purchasePrice: 0,
  currency: 'USD',
  purchaseDate: new Date().toISOString().slice(0, 10),
  paymentStatus: 'PENDING',
  notes: '',
  documentUrl: '',
};

export function AdminPurchaseListPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    string | undefined
  >();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Purchase | null>(null);

  const search = useDebounce(searchInput, 400);

  const { data, isLoading } = usePurchases({
    page,
    limit: 20,
    search: search || undefined,
    paymentStatus: (paymentStatusFilter as never) || undefined,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases"
        description="Vehicles you acquired from sellers"
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New purchase
          </Button>
        }
      />

      <div className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-12">
        <div className="relative sm:col-span-7">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search purchase #, invoice…"
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
            value={paymentStatusFilter ?? ALL}
            onValueChange={(v) => {
              setPaymentStatusFilter(v === ALL ? undefined : v);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any payment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any payment status</SelectItem>
              {Object.values(PAYMENT_STATUS).map((s) => (
                <SelectItem key={s} value={s}>
                  {s[0] + s.slice(1).toLowerCase()}
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
            icon={Receipt}
            title="No purchases yet"
            description="Record a purchase when you acquire a vehicle from a seller."
            action={
              <Button
                onClick={() => {
                  setEditing(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Record purchase
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purchase #</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">
                        {p.purchaseNumber}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {p.vehicleId?.year} {p.vehicleId?.make}{' '}
                          {p.vehicleId?.model}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.vehicleId?.stockNumber}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm">
                        {p.sellerId?.name}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(p.purchaseDate)}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatCurrency(p.purchasePrice, p.currency)}
                      </TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={p.paymentStatus} />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditing(p);
                                setDialogOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DeletePurchaseItem id={p.id} />
                          </DropdownMenuContent>
                        </DropdownMenu>
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

      <PurchaseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        purchase={editing}
      />
    </div>
  );
}

function DeletePurchaseItem({ id }: { id: string }) {
  const remove = useDeletePurchase();
  return (
    <DropdownMenuItem
      onClick={() => {
        if (confirm('Delete this purchase? This cannot be undone.')) {
          remove.mutate(id);
        }
      }}
      className="text-destructive focus:text-destructive"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
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

function PurchaseDialog({
  open,
  onOpenChange,
  purchase,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase: Purchase | null;
}) {
  const isEdit = Boolean(purchase);
  const [form, setForm] = useState<CreatePurchaseInput>(EMPTY_FORM);

  // ✅ Reset when the dialog opens
  useEffect(() => {
    if (!open) return;
    if (purchase) {
      setForm({
        vehicleId: purchase.vehicleId?.id ?? '',
        sellerId: purchase.sellerId?.id ?? '',
        purchasePrice: purchase.purchasePrice,
        currency: purchase.currency,
        purchaseDate: purchase.purchaseDate.slice(0, 10),
        paymentStatus: purchase.paymentStatus,
        notes: purchase.notes ?? '',
        documentUrl: purchase.documentUrl ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [open, purchase]);

  const { data: vehiclesData } = useStaffVehicles({ limit: 100 });
  const { data: sellersData } = useSellers({ limit: 100, isActive: true });

  // Selected vehicle info
  const { data: selectedVehicle } = useStaffVehicle(
    form.vehicleId || undefined
  );

  const create = useCreatePurchase();
  const update = useUpdatePurchase(purchase?.id ?? '');
  const isPending = create.isPending || update.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicleId || !form.sellerId || form.purchasePrice <= 0) return;

    const payload = {
      ...form,
      notes: form.notes?.trim() || null,
      documentUrl: form.documentUrl?.trim() || null,
      purchaseDate: new Date(form.purchaseDate).toISOString(),
    };

    if (isEdit && purchase) {
      const { vehicleId, sellerId, ...updatePayload } = payload;
      void vehicleId;
      void sellerId;
      update.mutate(updatePayload, { onSuccess: () => onOpenChange(false) });
    } else {
      create.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader className="border-b p-6 pb-4">
            <DialogTitle>
              {isEdit ? 'Edit purchase' : 'New purchase'}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update the purchase details. Vehicle and seller are fixed.'
                : 'Record a vehicle acquisition. Select the vehicle you acquired and the seller you bought it from.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 p-6 sm:grid-cols-2">
            {!isEdit ? (
              <>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Vehicle *</Label>
                  <Select
                    value={form.vehicleId}
                    onValueChange={(v) => setForm({ ...form, vehicleId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select the acquired vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehiclesData?.items.length === 0 ? (
                        <div className="p-3 text-sm text-muted-foreground">
                          No vehicles in inventory
                        </div>
                      ) : (
                        vehiclesData?.items.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.stockNumber} — {v.year} {v.make} {v.model}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {selectedVehicle && (
                  <div className="rounded-lg border bg-muted/40 p-4 sm:col-span-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {selectedVehicle.year} {selectedVehicle.make}{' '}
                        {selectedVehicle.model}
                        {selectedVehicle.trim
                          ? ` ${selectedVehicle.trim}`
                          : ''}
                      </span>
                    </div>
                    <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                      <span>Stock: {selectedVehicle.stockNumber}</span>
                      <span>
                        Current asking:{' '}
                        {formatCurrency(
                          selectedVehicle.askingPrice,
                          selectedVehicle.currency
                        )}
                      </span>
                      <span>
                        Mileage: {selectedVehicle.mileage.toLocaleString()}{' '}
                        {selectedVehicle.mileageUnit.toLowerCase()}
                      </span>
                      <span>
                        {selectedVehicle.bodyType} · {selectedVehicle.fuelType}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2 sm:col-span-2">
                  <Label>Seller *</Label>
                  <Select
                    value={form.sellerId}
                    onValueChange={(v) => setForm({ ...form, sellerId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Who did you buy it from?" />
                    </SelectTrigger>
                    <SelectContent>
                      {sellersData?.items.length === 0 ? (
                        <div className="p-3 text-sm text-muted-foreground">
                          No active sellers — add one first
                        </div>
                      ) : (
                        sellersData?.items.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            <span className="flex items-center gap-2">
                              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{s.name}</span>
                              {s.type && (
                                <span className="text-xs text-muted-foreground">
                                  · {s.type}
                                </span>
                              )}
                            </span>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Vehicle</Label>
                  <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                    <p className="font-medium">
                      {purchase?.vehicleId?.year} {purchase?.vehicleId?.make}{' '}
                      {purchase?.vehicleId?.model}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Stock: {purchase?.vehicleId?.stockNumber}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>Seller</Label>
                  <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                    <p className="font-medium">{purchase?.sellerId?.name}</p>
                    {purchase?.sellerId?.city && (
                      <p className="text-xs text-muted-foreground">
                        {[purchase.sellerId.city, purchase.sellerId.country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="purchase-price">Purchase price *</Label>
              <Input
                id="purchase-price"
                type="number"
                step="0.01"
                min="0"
                value={form.purchasePrice}
                onChange={(e) =>
                  setForm({
                    ...form,
                    purchasePrice: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase-currency">Currency</Label>
              <Input
                id="purchase-currency"
                value={form.currency ?? 'USD'}
                maxLength={3}
                onChange={(e) =>
                  setForm({ ...form, currency: e.target.value.toUpperCase() })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase-date">Purchase date</Label>
              <Input
                id="purchase-date"
                type="date"
                value={form.purchaseDate}
                onChange={(e) =>
                  setForm({ ...form, purchaseDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Payment status</Label>
              <Select
                value={form.paymentStatus ?? 'PENDING'}
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
  <Label>Purchase document</Label>
  <DocumentUploader
    value={form.documentUrl}
    onChange={(url) => setForm({ ...form, documentUrl: url ?? '' })}
  />
</div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="purchase-notes">Notes</Label>
              <Textarea
                id="purchase-notes"
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
                !form.vehicleId ||
                !form.sellerId ||
                form.purchasePrice <= 0 ||
                isPending
              }
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Save changes' : 'Record purchase'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}