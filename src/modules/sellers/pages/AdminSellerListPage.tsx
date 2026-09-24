import { useState } from 'react';
import {
  Plus,
  Search,
  X,
  MoreHorizontal,
  Pencil,
  Power,
  Trash2,
  Building2,
  User as UserIcon,
  Loader2,
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
import { formatDate } from '@/shared/lib/utils';
import { SELLER_TYPE } from '@/shared/types';
import {
  useSellers,
  useCreateSeller,
  useUpdateSeller,
  useToggleSellerActive,
  useDeleteSeller,
} from '../hooks/useSellers';
import type { CreateSellerInput, Seller } from '../api/sellers.types';

const ALL = '__all__';

export function AdminSellerListPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [activeFilter, setActiveFilter] = useState<string | undefined>();

  const search = useDebounce(searchInput, 400);

  const { data, isLoading } = useSellers({
    page,
    limit: 20,
    search: search || undefined,
    type: (typeFilter as never) || undefined,
    isActive:
      activeFilter === undefined
        ? undefined
        : activeFilter === 'true',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Seller | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (seller: Seller) => {
    setEditing(seller);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sellers"
        description="Suppliers and individuals you acquire vehicles from"
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New seller
          </Button>
        }
      />

      {/* Filter bar */}
      <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-12">
        <div className="relative md:col-span-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, phone, email…"
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

        <div className="md:col-span-3">
          <Select
            value={typeFilter ?? ALL}
            onValueChange={(v) => {
              setTypeFilter(v === ALL ? undefined : v);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any type</SelectItem>
              {Object.values(SELLER_TYPE).map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-3">
          <Select
            value={activeFilter ?? ALL}
            onValueChange={(v) => {
              setActiveFilter(v === ALL ? undefined : v);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <FullPageSpinner />
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No sellers yet"
            description="Add a seller before recording purchases."
            action={
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add seller
              </Button>
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((seller) => (
                  <TableRow key={seller.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {seller.type === SELLER_TYPE.COMPANY ? (
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="font-medium">{seller.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {seller.type ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="space-y-0.5">
                        {seller.phone && <p>{seller.phone}</p>}
                        {seller.email && (
                          <p className="text-xs text-muted-foreground">
                            {seller.email}
                          </p>
                        )}
                        {!seller.phone && !seller.email && '—'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {[seller.city, seller.country]
                        .filter(Boolean)
                        .join(', ') || '—'}
                    </TableCell>
                    <TableCell>
                      {seller.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(seller.createdAt)}
                    </TableCell>
                    <TableCell>
                      <SellerRowActions
                        seller={seller}
                        onEdit={() => openEdit(seller)}
                      />
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

      <SellerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        seller={editing}
      />
    </div>
  );
}

/* -------------------- Row actions -------------------- */

function SellerRowActions({
  seller,
  onEdit,
}: {
  seller: Seller;
  onEdit: () => void;
}) {
  const toggle = useToggleSellerActive(seller.id, seller.isActive);
  const remove = useDeleteSeller();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toggle.mutate()}
          disabled={toggle.isPending}
        >
          <Power className="mr-2 h-4 w-4" />
          {seller.isActive ? 'Deactivate' : 'Activate'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            if (confirm(`Delete seller "${seller.name}"?`)) {
              remove.mutate(seller.id);
            }
          }}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* -------------------- Form dialog -------------------- */

function SellerFormDialog({
  open,
  onOpenChange,
  seller,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seller: Seller | null;
}) {
  const isEdit = Boolean(seller);

  const [form, setForm] = useState<CreateSellerInput>({
    name: '',
    type: null,
    phone: '',
    email: '',
    address: '',
    city: '',
    country: '',
    notes: '',
  });

  // Reset form when dialog opens
  if (open && seller && form.name !== seller.name) {
    setForm({
      name: seller.name,
      type: seller.type,
      phone: seller.phone ?? '',
      email: seller.email ?? '',
      address: seller.address ?? '',
      city: seller.city ?? '',
      country: seller.country ?? '',
      notes: seller.notes ?? '',
    });
  }
  if (open && !seller && form.name !== '') {
    setForm({
      name: '',
      type: null,
      phone: '',
      email: '',
      address: '',
      city: '',
      country: '',
      notes: '',
    });
  }

  const create = useCreateSeller();
  const update = useUpdateSeller(seller?.id ?? '');
  const isPending = create.isPending || update.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      ...form,
      name: form.name.trim(),
      phone: form.phone?.trim() || null,
      email: form.email?.trim() || null,
      address: form.address?.trim() || null,
      city: form.city?.trim() || null,
      country: form.country?.trim() || null,
      notes: form.notes?.trim() || null,
    };

    if (isEdit && seller) {
      update.mutate(payload, { onSuccess: () => onOpenChange(false) });
    } else {
      create.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit seller' : 'New seller'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update the seller information.'
                : 'Add a person or company you acquire vehicles from.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="seller-name">Name *</Label>
              <Input
                id="seller-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ahmad Motors or John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.type ?? ALL}
                onValueChange={(v) =>
                  setForm({ ...form, type: v === ALL ? null : (v as never) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Unspecified</SelectItem>
                  {Object.values(SELLER_TYPE).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seller-phone">Phone</Label>
              <Input
                id="seller-phone"
                value={form.phone ?? ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="seller-email">Email</Label>
              <Input
                id="seller-email"
                type="email"
                value={form.email ?? ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="seller-address">Address</Label>
              <Input
                id="seller-address"
                value={form.address ?? ''}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seller-city">City</Label>
              <Input
                id="seller-city"
                value={form.city ?? ''}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seller-country">Country</Label>
              <Input
                id="seller-country"
                value={form.country ?? ''}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="seller-notes">Notes</Label>
              <Textarea
                id="seller-notes"
                rows={3}
                value={form.notes ?? ''}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!form.name.trim() || isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Save changes' : 'Create seller'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}