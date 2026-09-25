import { useEffect, useState } from 'react';
import { Plus, Loader2, Trash2, Receipt, Search, X } from 'lucide-react';
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
import { EXPENSE_CATEGORY } from '@/shared/types';
import { useStaffVehicles } from '@/modules/vehicles/hooks/useVehicles';
import {
  useVehicleExpenses,
  useCreateVehicleExpense,
  useDeleteVehicleExpense,
} from '../hooks/useExpenses';
import type { CreateVehicleExpenseInput } from '../api/expenses.types';
import { DocumentUploader } from '@/shared/components/common/DocumentUploader';
const ALL = '__all__';

const EMPTY_FORM: CreateVehicleExpenseInput = {
  vehicleId: '',
  category: 'REPAIR',
  description: '',
  amount: 0,
  currency: 'USD',
  expenseDate: new Date().toISOString().slice(0, 10),
  documentUrl: '',
  notes: '',
};

export function AdminVehicleExpenseListPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const search = useDebounce(searchInput, 400);

  const { data, isLoading } = useVehicleExpenses({
    page,
    limit: 20,
    search: search || undefined,
    category: categoryFilter || undefined,
  });

  const remove = useDeleteVehicleExpense();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Expenses"
        description="Per-vehicle costs — transport, repairs, customs, etc."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record expense
          </Button>
        }
      />

      {/* Filter bar */}
      <div className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-12">
        <div className="relative sm:col-span-7">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search description…"
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
            value={categoryFilter ?? ALL}
            onValueChange={(v) => {
              setCategoryFilter(v === ALL ? undefined : v);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any category</SelectItem>
              {Object.values(EXPENSE_CATEGORY).map((c) => (
                <SelectItem key={c} value={c}>
                  {c[0] + c.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-card">
        {isLoading ? (
          <FullPageSpinner />
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No vehicle expenses"
            description="Record costs tied to a specific vehicle."
            action={
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Record expense
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>
                        <p className="font-medium">
                          {e.vehicleId?.year} {e.vehicleId?.make}{' '}
                          {e.vehicleId?.model}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {e.vehicleId?.stockNumber}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{e.category}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm">
                        {e.description}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(e.expenseDate)}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatCurrency(e.amount, e.currency)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm('Delete this expense?'))
                              remove.mutate(e.id);
                          }}
                          disabled={remove.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
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

      <VehicleExpenseDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

/* -------------------- Dialog -------------------- */

function VehicleExpenseDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState<CreateVehicleExpenseInput>(EMPTY_FORM);

  // ✅ Reset only when the dialog opens
  useEffect(() => {
    if (open) setForm(EMPTY_FORM);
  }, [open]);

  const { data: vehiclesData } = useStaffVehicles({ limit: 100 });
  const create = useCreateVehicleExpense();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicleId || !form.description.trim() || form.amount <= 0) return;

    create.mutate(
      {
        ...form,
        description: form.description.trim(),
        documentUrl: form.documentUrl?.trim() || null,
        notes: form.notes?.trim() || null,
        expenseDate: form.expenseDate
  ? new Date(form.expenseDate).toISOString()
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
            <DialogTitle>Record vehicle expense</DialogTitle>
            <DialogDescription>
              Costs tied to a specific vehicle. Frozen once the vehicle is
              sold.
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
                  <SelectValue placeholder="Select a vehicle" />
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

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm({ ...form, category: v as never })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EXPENSE_CATEGORY).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c[0] + c.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exp-amount">Amount *</Label>
              <Input
                id="exp-amount"
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: Number(e.target.value) })
                }
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="exp-desc">Description *</Label>
              <Input
                id="exp-desc"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="e.g. Brake pad replacement"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exp-date">Date</Label>
              <Input
                id="exp-date"
                type="date"
                value={form.expenseDate}
                onChange={(e) =>
                  setForm({ ...form, expenseDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exp-currency">Currency</Label>
              <Input
                id="exp-currency"
                maxLength={3}
                value={form.currency ?? 'USD'}
                onChange={(e) =>
                  setForm({
                    ...form,
                    currency: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>

           <div className="space-y-2 sm:col-span-2">
  <Label>Receipt / document</Label>
  <DocumentUploader
    value={form.documentUrl}
    onChange={(url) => setForm({ ...form, documentUrl: url ?? '' })}
  />
</div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="exp-notes">Notes</Label>
              <Textarea
                id="exp-notes"
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
                !form.description.trim() ||
                form.amount <= 0 ||
                create.isPending
              }
            >
              {create.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Record expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}