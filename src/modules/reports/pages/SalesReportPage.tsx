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
  Legend,
} from 'recharts';
import { Wallet, TrendingUp, DollarSign } from 'lucide-react';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { formatCurrency, formatDate } from '@/shared/lib/utils';
import { ReportFilters } from '../components/ReportFilters';
import { ReportKpiCard } from '../components/ReportKpiCard';
import { ReportChart } from '../components/ReportChart';
import { ReportTable } from '../components/ReportTable';
import { useSalesReport } from '../hooks/useReports';
import type { ReportFilters as Filters, SalesReport } from '../api/reports.types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

type TopSale = SalesReport['topSales'][number];

export function SalesReportPage() {
  const [filters, setFilters] = useState<Filters>({});
  const { data, isLoading } = useSalesReport(filters);

  if (isLoading) return <FullPageSpinner />;
  if (!data) return <EmptyState title="No data" />;

  const channelData = Object.entries(data.byChannel).map(([name, v]) => ({
    name,
    value: v.revenue,
    count: v.count,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Report"
        description="Revenue and sales performance"
      />

      <ReportFilters filters={filters} onChange={setFilters} />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <ReportKpiCard
          title="Total Sales"
          value={data.summary.totalSales.toLocaleString()}
          Icon={Wallet}
        />
        <ReportKpiCard
          title="Total Revenue"
          value={formatCurrency(data.summary.totalRevenue)}
          Icon={DollarSign}
          highlight
        />
        <ReportKpiCard
          title="Average Sale Price"
          value={formatCurrency(data.summary.averageSalePrice)}
          Icon={TrendingUp}
        />
      </div>

      {/* Monthly Revenue */}
      <ReportChart
        title="Monthly Revenue"
        isEmpty={data.byMonth.length === 0}
        emptyMessage="No sales in this period."
        height={300}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.byMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ReportChart>

      {/* Channel + Payment charts side by side */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ReportChart
          title="Sales by Channel"
          isEmpty={channelData.length === 0}
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={channelData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
              >
                {channelData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ReportChart>

        {/* Payment status — plain list inside a Card */}
        <div className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <h3 className="text-lg font-semibold">By Payment Status</h3>
          </div>
          <div className="p-4">
            {Object.entries(data.byPaymentStatus).length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No data
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(data.byPaymentStatus).map(([status, v]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <span className="text-sm">{status}</span>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(v.revenue)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {v.count} sale{v.count === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top 5 sales */}
      <ReportTable<TopSale>
        title="Top 5 Sales"
        columns={[
          {
            key: 'vehicle',
            header: 'Vehicle',
            render: (sale) => (
              <>
                <p className="font-medium">
                  {sale.vehicleId?.year} {sale.vehicleId?.make}{' '}
                  {sale.vehicleId?.model}
                </p>
                <p className="text-xs text-muted-foreground">
                  {sale.saleNumber} · {sale.vehicleId?.stockNumber}
                </p>
              </>
            ),
          },
          {
            key: 'customer',
            header: 'Customer',
            className: 'hidden md:table-cell',
            render: (sale) =>
              sale.customerId?.name ?? (
                <span className="text-muted-foreground">Walk-in</span>
              ),
          },
          {
            key: 'date',
            header: 'Date',
            className: 'hidden md:table-cell',
            render: (sale) => (
              <span className="text-xs text-muted-foreground">
                {formatDate(sale.saleDate)}
              </span>
            ),
          },
          {
            key: 'price',
            header: 'Price',
            align: 'right',
            render: (sale) => (
              <span className="text-lg font-bold">
                {formatCurrency(sale.salePrice, sale.currency)}
              </span>
            ),
          },
        ]}
        rows={data.topSales}
        rowKey={(sale) => sale._id}
        emptyMessage="No sales yet."
      />
    </div>
  );
}