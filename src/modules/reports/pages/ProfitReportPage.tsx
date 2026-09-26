import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { DollarSign, TrendingUp, Percent, Car } from 'lucide-react';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { formatCurrency, formatDate } from '@/shared/lib/utils';
import { ReportFilters } from '../components/ReportFilters';
import { ReportKpiCard } from '../components/ReportKpiCard';
import { ReportChart } from '../components/ReportChart';
import { ReportTable } from '../components/ReportTable';
import { useProfitReport } from '../hooks/useReports';
import type { ReportFilters as Filters, ProfitReport } from '../api/reports.types';

type ProfitRow = ProfitReport['items'][number];

export function ProfitReportPage() {
  const [filters, setFilters] = useState<Filters>({});
  const { data, isLoading } = useProfitReport(filters);

  if (isLoading) return <FullPageSpinner />;
  if (!data) return <EmptyState title="No data" />;

  const { totals, items, byMonth } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profit Report"
        description="Gross profit per vehicle and total margin"
      />

      <ReportFilters filters={filters} onChange={setFilters} />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportKpiCard title="Sales" value={totals.count} Icon={Car} />
        <ReportKpiCard
          title="Revenue"
          value={formatCurrency(totals.totalRevenue)}
          Icon={DollarSign}
        />
        <ReportKpiCard
          title="Total Cost"
          value={formatCurrency(totals.totalCost)}
        />
        <ReportKpiCard
          title="Gross Profit"
          value={formatCurrency(totals.totalGrossProfit)}
          Icon={TrendingUp}
          highlight
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ReportKpiCard
          title="Average Profit / Sale"
          value={formatCurrency(Math.round(totals.avgProfit))}
        />
        <ReportKpiCard
          title="Average Margin"
          value={`${totals.avgMargin.toFixed(1)}%`}
          Icon={Percent}
        />
      </div>

      {/* Monthly profit trend */}
      <ReportChart
        title="Monthly Profit Trend"
        isEmpty={byMonth.length === 0}
        emptyMessage="No sales in this period."
        height={320}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={byMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="#ef4444"
              strokeWidth={2}
              name="Cost"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#10b981"
              strokeWidth={2}
              name="Profit"
            />
          </LineChart>
        </ResponsiveContainer>
      </ReportChart>

      {/* Per-vehicle table */}
      <ReportTable<ProfitRow>
        title="Per-Vehicle Profit"
        columns={[
          {
            key: 'saleNumber',
            header: 'Sale #',
            className: 'font-mono text-xs',
            render: (row) => row.saleNumber,
          },
          {
            key: 'vehicle',
            header: 'Vehicle',
            render: (row) => (
              <>
                <p className="font-medium">
                  {row.vehicle?.year} {row.vehicle?.make} {row.vehicle?.model}
                </p>
                <p className="text-xs text-muted-foreground">
                  {row.vehicle?.stockNumber}
                </p>
              </>
            ),
          },
          {
            key: 'date',
            header: 'Date',
            className: 'hidden md:table-cell text-xs text-muted-foreground',
            render: (row) => formatDate(row.saleDate),
          },
          {
            key: 'purchasePrice',
            header: 'Purchase',
            align: 'right',
            className: 'hidden lg:table-cell',
            render: (row) => formatCurrency(row.purchasePrice),
          },
          {
            key: 'expenses',
            header: 'Expenses',
            align: 'right',
            className: 'hidden lg:table-cell',
            render: (row) => formatCurrency(row.totalExpenses),
          },
          {
            key: 'totalCost',
            header: 'Cost',
            align: 'right',
            render: (row) => (
              <span className="font-medium">{formatCurrency(row.totalCost)}</span>
            ),
          },
          {
            key: 'salePrice',
            header: 'Sale Price',
            align: 'right',
            render: (row) => (
              <span className="font-medium">{formatCurrency(row.salePrice)}</span>
            ),
          },
          {
            key: 'grossProfit',
            header: 'Profit',
            align: 'right',
            render: (row) => (
              <span className="font-bold text-emerald-600">
                {formatCurrency(row.grossProfit)}
              </span>
            ),
          },
          {
            key: 'margin',
            header: 'Margin',
            align: 'right',
            render: (row) => `${row.margin.toFixed(1)}%`,
          },
        ]}
        rows={items}
        rowKey={(row) => row.saleId}
        emptyMessage="No sales in this period."
      />
    </div>
  );
}