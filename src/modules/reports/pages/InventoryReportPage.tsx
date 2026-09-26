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
import { Car, CheckCircle2, Clock, Package, DollarSign } from 'lucide-react';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { formatCurrency } from '@/shared/lib/utils';
import { ReportKpiCard } from '../components/ReportKpiCard';
import { ReportChart } from '../components/ReportChart';
import { useInventoryReport } from '../hooks/useReports';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function InventoryReportPage() {
  const { data, isLoading } = useInventoryReport();

  if (isLoading) return <FullPageSpinner />;
  if (!data) return <EmptyState title="No data" />;

  const statusData = [
    { name: 'Available', value: data.summary.available },
    { name: 'Reserved', value: data.summary.reserved },
    { name: 'Sold', value: data.summary.sold },
  ].filter((d) => d.value > 0);

  const agingData = [
    { bucket: '< 30 days', count: data.aging.under30 },
    { bucket: '30-60 days', count: data.aging.under60 },
    { bucket: '60-90 days', count: data.aging.under90 },
    { bucket: '90+ days', count: data.aging.over90 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Report"
        description="Stock levels, aging, and value"
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportKpiCard title="Total Vehicles" value={data.summary.total} Icon={Car} />
        <ReportKpiCard title="Available" value={data.summary.available} Icon={CheckCircle2} />
        <ReportKpiCard title="Reserved" value={data.summary.reserved} Icon={Clock} />
        <ReportKpiCard title="Published" value={data.summary.published} Icon={Package} />
      </div>

      {/* Value */}
      <div className="grid gap-4 sm:grid-cols-3">
        <ReportKpiCard
          title="Total Cost"
          value={formatCurrency(data.summary.totalCost)}
          Icon={DollarSign}
        />
        <ReportKpiCard
          title="Asking Value"
          value={formatCurrency(data.summary.totalAskingValue)}
        />
        <ReportKpiCard
          title="Potential Profit"
          value={formatCurrency(data.summary.potentialProfit)}
          highlight
        />
      </div>

      {/* Status + Aging charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ReportChart
          title="By Status"
          isEmpty={statusData.length === 0}
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
          title="Aging (unsold)"
          isEmpty={agingData.every((d) => d.count === 0)}
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bucket" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ReportChart>
      </div>

      {/* Top makes */}
      <ReportChart
        title="Top Makes"
        isEmpty={data.byMake.length === 0}
        height={300}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.byMake}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="make" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ReportChart>
    </div>
  );
}