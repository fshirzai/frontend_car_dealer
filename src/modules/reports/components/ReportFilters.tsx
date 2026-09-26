import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { ReportFilters } from '../api/reports.types';

interface ReportFiltersProps {
  filters: ReportFilters;
  onChange: (filters: ReportFilters) => void;
  showDateRange?: boolean;
}

const presets = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'This year', days: 365 },
];

export function ReportFilters({
  filters,
  onChange,
  showDateRange = true,
}: ReportFiltersProps) {
  const [localFrom, setLocalFrom] = useState(filters.dateFrom ?? '');
  const [localTo, setLocalTo] = useState(filters.dateTo ?? '');

  const applyPreset = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);

    const dateFrom = from.toISOString().slice(0, 10);
    const dateTo = to.toISOString().slice(0, 10);

    setLocalFrom(dateFrom);
    setLocalTo(dateTo);
    onChange({ dateFrom, dateTo });
  };

  const clear = () => {
    setLocalFrom('');
    setLocalTo('');
    onChange({});
  };

  if (!showDateRange) return null;

  return (
    <Card>
      <CardContent className="flex flex-wrap items-end gap-3 pt-6">
        <div className="space-y-2">
          <Label htmlFor="report-from">From</Label>
          <Input
            id="report-from"
            type="date"
            value={localFrom}
            onChange={(e) => setLocalFrom(e.target.value)}
            className="w-40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="report-to">To</Label>
          <Input
            id="report-to"
            type="date"
            value={localTo}
            onChange={(e) => setLocalTo(e.target.value)}
            className="w-40"
          />
        </div>

        <Button
          onClick={() => onChange({ dateFrom: localFrom || undefined, dateTo: localTo || undefined })}
        >
          Apply
        </Button>

        <div className="ml-auto flex flex-wrap gap-2">
          {presets.map((p) => (
            <Button
              key={p.label}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(p.days)}
            >
              {p.label}
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={clear}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}