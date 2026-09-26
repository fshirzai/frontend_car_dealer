import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ShoppingBag, CheckCircle2, XCircle } from 'lucide-react';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { ReportFilters } from '../components/ReportFilters';
import { ReportKpiCard } from '../components/ReportKpiCard';
import { ReportChart } from '../components/ReportChart';
import { useOrdersReport } from '../hooks/useReports';
import type { ReportFilters as Filters } from '../api/reports.types';

const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'];

export function OrdersReportPage() {
  const [filters, setFilters] = useState<Filters>({});
  const { data, isLoading } = useOrdersReport(filters);

  if (isLoading) return <FullPageSpinner />;
  if (!data) return <EmptyState title="No data" />;

  const { summary, byMonth } = data;

  const statusData = [
    { name: 'Pending', value: summary.pending },
    { name: 'Contacted', value: summary.contacted },
    { name: 'Confirmed', value: summary.confirmed },
    { name: 'Completed', value: summary.completed },
    { name: 'Cancelled', value: summary.cancelled },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders Report"
        description="Pipeline and conversion analysis"
      />

      <ReportFilters filters={filters} onChange={setFilters} />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportKpiCard
          title="Total Orders"
          value={summary.total}
          Icon={ShoppingBag}
        />
        <ReportKpiCard
          title="Completed"
          value={summary.completed}
          Icon={CheckCircle2}
        />
        <ReportKpiCard
          title="Cancelled"
          value={summary.cancelled}
          Icon={XCircle}
        />
        <ReportKpiCard
          title="Conversion Rate"
          value={`${summary.conversionRate.toFixed(1)}%`}
          Icon={CheckCircle2}
          highlight
        />
      </div>

      <ReportKpiCard
        title="Cancellation Rate"
        value={`${summary.cancellationRate.toFixed(1)}%`}
      />

      {/* Status + Monthly volume */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ReportChart
          title="Status Breakdown"
          isEmpty={statusData.length === 0}
          emptyMessage="No orders."
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ReportChart>

        <ReportChart
          title="Monthly Volume"
          isEmpty={byMonth.length === 0}
          emptyMessage="No orders in this period."
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ReportChart>
      </div>
    </div>
  );
}