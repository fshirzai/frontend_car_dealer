import { X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  BODY_TYPE,
  FUEL_TYPE,
  TRANSMISSION,
  DRIVE_TYPE,
  VEHICLE_CONDITION,
} from '@/shared/types';
import type { VehicleFilters as Filters } from '../api/vehicles.types';

interface VehicleFiltersProps {
  filters: Filters;
  onChange: (key: keyof Filters, value: unknown) => void;
  onClear: () => void;
}

const ALL = '__all__';

export function VehicleFilters({
  filters,
  onChange,
  onClear,
}: VehicleFiltersProps) {
  const hasFilters =
    filters.make ||
    filters.model ||
    filters.bodyType ||
    filters.fuelType ||
    filters.transmission ||
    filters.driveType ||
    filters.condition ||
    filters.yearMin ||
    filters.yearMax ||
    filters.priceMin ||
    filters.priceMax ||
    filters.search;

  return (
    <aside className="space-y-5 rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-auto px-2 py-1">
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label>Search</Label>
        <Input
          placeholder="Make, model, keyword…"
          value={filters.search ?? ''}
          onChange={(e) => onChange('search', e.target.value || undefined)}
        />
      </div>

      {/* Make / Model */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Make</Label>
          <Input
            placeholder="Toyota"
            value={filters.make ?? ''}
            onChange={(e) => onChange('make', e.target.value || undefined)}
          />
        </div>
        <div className="space-y-2">
          <Label>Model</Label>
          <Input
            placeholder="Corolla"
            value={filters.model ?? ''}
            onChange={(e) => onChange('model', e.target.value || undefined)}
          />
        </div>
      </div>

      {/* Year range */}
      <div className="space-y-2">
        <Label>Year</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="From"
            value={filters.yearMin ?? ''}
            onChange={(e) =>
              onChange('yearMin', e.target.value ? Number(e.target.value) : undefined)
            }
          />
          <Input
            type="number"
            placeholder="To"
            value={filters.yearMax ?? ''}
            onChange={(e) =>
              onChange('yearMax', e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
      </div>

      {/* Price range */}
      <div className="space-y-2">
        <Label>Price (USD)</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min"
            value={filters.priceMin ?? ''}
            onChange={(e) =>
              onChange('priceMin', e.target.value ? Number(e.target.value) : undefined)
            }
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.priceMax ?? ''}
            onChange={(e) =>
              onChange('priceMax', e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
      </div>

      {/* Dropdowns */}
      <FilterSelect
        label="Body Type"
        value={filters.bodyType}
        onChange={(v) => onChange('bodyType', v === ALL ? undefined : v)}
        options={Object.values(BODY_TYPE)}
      />
      <FilterSelect
        label="Fuel Type"
        value={filters.fuelType}
        onChange={(v) => onChange('fuelType', v === ALL ? undefined : v)}
        options={Object.values(FUEL_TYPE)}
      />
      <FilterSelect
        label="Transmission"
        value={filters.transmission}
        onChange={(v) => onChange('transmission', v === ALL ? undefined : v)}
        options={Object.values(TRANSMISSION)}
      />
      <FilterSelect
        label="Drive Type"
        value={filters.driveType}
        onChange={(v) => onChange('driveType', v === ALL ? undefined : v)}
        options={Object.values(DRIVE_TYPE)}
      />
      <FilterSelect
        label="Condition"
        value={filters.condition}
        onChange={(v) => onChange('condition', v === ALL ? undefined : v)}
        options={Object.values(VEHICLE_CONDITION)}
      />
    </aside>
  );
}

interface FilterSelectProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: readonly string[];
}

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value ?? ALL} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Any" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Any</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt.split('_').map((s) => s[0] + s.slice(1).toLowerCase()).join(' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}