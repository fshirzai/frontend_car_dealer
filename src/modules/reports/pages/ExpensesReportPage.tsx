import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Receipt, DollarSign } from 'lucide-react';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { formatCurrency } from '@/shared/lib/utils';
import { ReportFilters } from '../components/ReportFilters';
import { ReportKpiCard } from '../components/ReportKpiCard';
import { ReportChart } from '../components/ReportChart';
import { useExpensesReport } from '../hooks/useReports';
import type { ReportFilters as Filters } from '../api/reports.types';

export function ExpensesReportPage() {
  const [filters, setFilters] = useState<Filters>({});
  const { data, isLoading } = useExpensesReport(filters);

  if (isLoading) return <FullPageSpinner />;
  if (!data) return <EmptyState title="No data" />;

  const vehicleChart = data.vehicle.map((v) => ({
    name: v.category,
    total: v.total,
  }));
  const generalChart = data.general.map((v) => ({
    name: v.category,
    total: v.total,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses Report"
        description="Vehicle vs general expenses by category"
      />

      <ReportFilters filters={filters} onChange={setFilters} />

      <div className="grid gap-4 sm:grid-cols-3">
        <ReportKpiCard
          title="Vehicle Expenses"
          value={formatCurrency(data.summary.totalVehicle)}
          Icon={Receipt}
        />
        <ReportKpiCard
          title="General Expenses"
          value={formatCurrency(data.summary.totalGeneral)}
          Icon={Receipt}
        />
        <ReportKpiCard
          title="Total"
          value={formatCurrency(data.summary.total)}
          Icon={DollarSign}
          highlight
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ReportChart
          title="Vehicle Expenses by Category"
          isEmpty={vehicleChart.length === 0}
          emptyMessage="No vehicle expenses."
          height={300}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vehicleChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ReportChart>

        <ReportChart
          title="General Expenses by Category"
          isEmpty={generalChart.length === 0}
          emptyMessage="No general expenses."
          height={300}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={generalChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="total" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ReportChart>
      </div>
    </div>
  );
}