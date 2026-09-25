import { useEffect, useState } from 'react';
import { Plus, Loader2, Trash2, FileText, Search, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
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
import { GENERAL_EXPENSE_CATEGORY } from '@/shared/types';
import {
  useGeneralExpenses,
  useCreateGeneralExpense,
  useDeleteGeneralExpense,
  useGeneralExpenseSummary,
} from '../hooks/useExpenses';
import type { CreateGeneralExpenseInput } from '../api/expenses.types';

const ALL = '__all__';

const EMPTY_FORM: CreateGeneralExpenseInput = {
  category: 'RENT',
  description: '',
  amount: 0,
  currency: 'USD',
  expenseDate: new Date().toISOString().slice(0, 10),
  documentUrl: '',
  notes: '',
};

export function AdminGeneralExpenseListPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const search = useDebounce(searchInput, 400);

  const { data, isLoading } = useGeneralExpenses({
    page,
    limit: 20,
    search: search || undefined,
    category: categoryFilter || undefined,
  });
  const { data: summary } = useGeneralExpenseSummary();

  const remove = useDeleteGeneralExpense();

  return (
    <div className="space-y-6">
      <PageHeader
        title="General Expenses"
        description="Dealership-wide costs — rent, salaries, marketing, etc."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record expense
          </Button>
        }
      />

      {summary && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Total expenses</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(summary.total, 'USD')}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Entries</p>
                <p className="text-2xl font-bold">{summary.count}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">
                  {Object.keys(summary.byCategory).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              {Object.values(GENERAL_EXPENSE_CATEGORY).map((c) => (
                <SelectItem key={c} value={c}>
                  {c[0] + c.slice(1).toLowerCase()}
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
            title="No general expenses"
            description="Record rent, utilities, salaries, and other overheads."
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
                        <Badge variant="outline">{e.category}</Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate text-sm">
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

      <GeneralExpenseDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

/* -------------------- Dialog -------------------- */

function GeneralExpenseDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState<CreateGeneralExpenseInput>(EMPTY_FORM);

  // ✅ Reset only when the dialog opens
  useEffect(() => {
    if (open) setForm(EMPTY_FORM);
  }, [open]);

  const create = useCreateGeneralExpense();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim() || form.amount <= 0) return;

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
            <DialogTitle>Record general expense</DialogTitle>
            <DialogDescription>
              Dealership-wide costs. Not tied to a specific vehicle.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
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
                  {Object.values(GENERAL_EXPENSE_CATEGORY).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c[0] + c.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="gen-desc">Description *</Label>
              <Input
                id="gen-desc"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="e.g. November office rent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gen-amount">Amount *</Label>
              <Input
                id="gen-amount"
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: Number(e.target.value) })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gen-date">Date</Label>
              <Input
                id="gen-date"
                type="date"
                value={form.expenseDate}
                onChange={(e) =>
                  setForm({ ...form, expenseDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="gen-notes">Notes</Label>
              <Textarea
                id="gen-notes"
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