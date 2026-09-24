import { Link } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Eye,
  EyeOff,
  Trash2,
  MoreHorizontal,
  Filter,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
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
import { Badge } from '@/shared/components/ui/badge';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { Pagination } from '@/shared/components/common/Pagination';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { formatCurrency, formatDate } from '@/shared/lib/utils';
import {
  BODY_TYPE,
  FUEL_TYPE,
  TRANSMISSION,
  DRIVE_TYPE,
  VEHICLE_CONDITION,
  VEHICLE_STATUS,
} from '@/shared/types';
import {
  useStaffVehicles,
  usePublishVehicle,
  useUnpublishVehicle,
  useDeleteVehicle,
} from '../hooks/useVehicles';
import { useVehicleFilters } from '../hooks/useVehicleFilters';
import { VehicleStatusBadge } from '../components/VehicleStatusBadge';

const ALL = '__all__';

export function AdminVehicleListPage() {
  const { filters, setFilter, clearFilters, setPage } = useVehicleFilters();
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 400);
  if (debouncedSearch !== (filters.search ?? '')) {
    setFilter('search', debouncedSearch || undefined);
  }

  const { data, isLoading } = useStaffVehicles(filters);
  const deleteVehicle = useDeleteVehicle();

  const hasAnyFilter =
    Boolean(filters.search) ||
    Boolean(filters.status) ||
    filters.isPublished !== undefined ||
    Boolean(filters.make) ||
    Boolean(filters.model) ||
    Boolean(filters.bodyType) ||
    Boolean(filters.fuelType) ||
    Boolean(filters.transmission) ||
    Boolean(filters.driveType) ||
    Boolean(filters.condition) ||
    filters.yearMin !== undefined ||
    filters.yearMax !== undefined ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicles"
        description="Manage your dealership inventory"
        actions={
          <Button asChild>
            <Link to="/admin/vehicles/new">
              <Plus className="mr-2 h-4 w-4" />
              New vehicle
            </Link>
          </Button>
        }
      />

      {/* Filter bar */}
      <div className="space-y-4 rounded-lg border bg-card p-4">
        {/* Primary row */}
        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-6">
            <Input
              placeholder="Search stock, VIN, make, model…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Select
              value={filters.status ?? ALL}
              onValueChange={(v) =>
                setFilter('status', v === ALL ? undefined : v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Any status</SelectItem>
                {Object.values(VEHICLE_STATUS).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s[0] + s.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Select
              value={
                filters.isPublished === undefined
                  ? ALL
                  : filters.isPublished
                  ? 'true'
                  : 'false'
              }
              onValueChange={(v) =>
                setFilter('isPublished', v === ALL ? undefined : v === 'true')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Any visibility</SelectItem>
                <SelectItem value="true">Published</SelectItem>
                <SelectItem value="false">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 md:col-span-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowAdvanced((s) => !s)}
            >
              <Filter className="mr-2 h-4 w-4" />
              More
            </Button>
            {hasAnyFilter && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchInput('');
                  clearFilters();
                }}
                title="Clear filters"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Advanced row */}
        {showAdvanced && (
          <div className="grid gap-3 border-t pt-4 md:grid-cols-3 lg:grid-cols-4">
            <AdvancedInput
              label="Make"
              value={filters.make ?? ''}
              placeholder="Toyota"
              onChange={(v) => setFilter('make', v || undefined)}
            />
            <AdvancedInput
              label="Model"
              value={filters.model ?? ''}
              placeholder="Corolla"
              onChange={(v) => setFilter('model', v || undefined)}
            />

            <AdvancedSelect
              label="Body type"
              value={filters.bodyType}
              options={Object.values(BODY_TYPE)}
              onChange={(v) => setFilter('bodyType', v)}
            />
            <AdvancedSelect
              label="Fuel type"
              value={filters.fuelType}
              options={Object.values(FUEL_TYPE)}
              onChange={(v) => setFilter('fuelType', v)}
            />
            <AdvancedSelect
              label="Transmission"
              value={filters.transmission}
              options={Object.values(TRANSMISSION)}
              onChange={(v) => setFilter('transmission', v)}
            />
            <AdvancedSelect
              label="Drive type"
              value={filters.driveType}
              options={Object.values(DRIVE_TYPE)}
              onChange={(v) => setFilter('driveType', v)}
            />
            <AdvancedSelect
              label="Condition"
              value={filters.condition}
              options={Object.values(VEHICLE_CONDITION)}
              onChange={(v) => setFilter('condition', v)}
            />

            <div className="grid grid-cols-2 gap-2">
              <AdvancedInput
                label="Year from"
                type="number"
                value={filters.yearMin?.toString() ?? ''}
                placeholder="2015"
                onChange={(v) =>
                  setFilter('yearMin', v ? Number(v) : undefined)
                }
              />
              <AdvancedInput
                label="Year to"
                type="number"
                value={filters.yearMax?.toString() ?? ''}
                placeholder="2026"
                onChange={(v) =>
                  setFilter('yearMax', v ? Number(v) : undefined)
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <AdvancedInput
                label="Price min"
                type="number"
                value={filters.priceMin?.toString() ?? ''}
                placeholder="0"
                onChange={(v) =>
                  setFilter('priceMin', v ? Number(v) : undefined)
                }
              />
              <AdvancedInput
                label="Price max"
                type="number"
                value={filters.priceMax?.toString() ?? ''}
                placeholder="100000"
                onChange={(v) =>
                  setFilter('priceMax', v ? Number(v) : undefined)
                }
              />
            </div>

            <AdvancedInput
              label="Max mileage"
              type="number"
              value={filters.mileageMax?.toString() ?? ''}
              placeholder="100000"
              onChange={(v) =>
                setFilter('mileageMax', v ? Number(v) : undefined)
              }
            />
          </div>
        )}
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {data
            ? `${data.meta.total.toLocaleString()} vehicle${
                data.meta.total === 1 ? '' : 's'
              }`
            : 'Loading…'}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <FullPageSpinner />
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            title={hasAnyFilter ? 'No matching vehicles' : 'No vehicles yet'}
            description={
              hasAnyFilter
                ? 'Try removing some filters.'
                : 'Get started by adding your first vehicle.'
            }
            action={
              hasAnyFilter ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchInput('');
                    clearFilters();
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/admin/vehicles/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add vehicle
                  </Link>
                </Button>
              )
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock #</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead>Purchase</TableHead>
                  <TableHead>Asking</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-mono text-xs">
                      {v.stockNumber}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/admin/vehicles/${v.id}`}
                        className="font-medium hover:underline"
                      >
                        {v.year} {v.make} {v.model}
                        {v.trim ? ` ${v.trim}` : ''}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {v.bodyType} · {v.fuelType}
                      </p>
                    </TableCell>
                    <TableCell>
                      <VehicleStatusBadge status={v.status} />
                    </TableCell>
                    <TableCell className="text-sm">
                      {v.mileage.toLocaleString()} {v.mileageUnit.toLowerCase()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatCurrency(v.purchasePrice, v.currency)}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {formatCurrency(v.askingPrice, v.currency)}
                    </TableCell>
                    <TableCell>
                      {v.isPublished ? (
                        <Badge variant="success">Public</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(v.createdAt)}
                    </TableCell>
                    <TableCell>
                      <RowActions
                        id={v.id}
                        isPublished={v.isPublished}
                        onDelete={() => {
                          if (
                            confirm(
                              `Delete vehicle ${v.stockNumber}? This cannot be undone.`
                            )
                          ) {
                            deleteVehicle.mutate(v.id);
                          }
                        }}
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
    </div>
  );
}

/* -------------------- Helpers -------------------- */

function AdvancedInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function AdvancedSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | undefined;
  options: readonly string[];
  onChange: (v: string | undefined) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      <Select
        value={value ?? ALL}
        onValueChange={(v) => onChange(v === ALL ? undefined : v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Any" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Any</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt
                .split('_')
                .map((s) => s[0] + s.slice(1).toLowerCase())
                .join(' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/* -------------------- Row actions -------------------- */

interface RowActionsProps {
  id: string;
  isPublished: boolean;
  onDelete: () => void;
}

function RowActions({ id, isPublished, onDelete }: RowActionsProps) {
  const publish = usePublishVehicle(id);
  const unpublish = useUnpublishVehicle(id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link to={`/admin/vehicles/${id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/admin/vehicles/${id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isPublished ? (
          <DropdownMenuItem onClick={() => unpublish.mutate()}>
            <EyeOff className="mr-2 h-4 w-4" />
            Unpublish
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => publish.mutate()}>
            <Eye className="mr-2 h-4 w-4" />
            Publish
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}