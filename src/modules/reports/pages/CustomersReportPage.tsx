import { useState } from 'react';
import { Users, UserCheck, Mail } from 'lucide-react';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { formatCurrency } from '@/shared/lib/utils';
import { ReportFilters } from '../components/ReportFilters';
import { ReportKpiCard } from '../components/ReportKpiCard';
import { ReportTable } from '../components/ReportTable';
import { useCustomersReport } from '../hooks/useReports';
import type { ReportFilters as Filters, CustomersReport } from '../api/reports.types';

type TopCustomer = CustomersReport['topCustomers'][number];

export function CustomersReportPage() {
  const [filters, setFilters] = useState<Filters>({});
  const { data, isLoading } = useCustomersReport(filters);

  if (isLoading) return <FullPageSpinner />;
  if (!data) return <EmptyState title="No data" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers Report"
        description="Customer base and top buyers"
      />

      <ReportFilters filters={filters} onChange={setFilters} />

      <div className="grid gap-4 sm:grid-cols-3">
        <ReportKpiCard
          title="Total Customers"
          value={data.summary.totalCustomers}
          Icon={Users}
        />
        <ReportKpiCard
          title="Active"
          value={data.summary.activeCustomers}
          Icon={UserCheck}
        />
        <ReportKpiCard
          title="Verified Emails"
          value={data.summary.verifiedCustomers}
          Icon={Mail}
        />
      </div>

      <ReportTable<TopCustomer>
        title="Top 10 Customers by Spending"
        columns={[
          {
            key: 'name',
            header: 'Customer',
            className: 'font-medium',
            render: (c) => c.name,
          },
          {
            key: 'email',
            header: 'Email',
            className: 'text-sm text-muted-foreground',
            render: (c) => c.email,
          },
          {
            key: 'purchases',
            header: 'Purchases',
            align: 'right',
            render: (c) => c.purchaseCount,
          },
          {
            key: 'spent',
            header: 'Total Spent',
            align: 'right',
            render: (c) => (
              <span className="font-semibold">
                {formatCurrency(c.totalSpent)}
              </span>
            ),
          },
        ]}
        rows={data.topCustomers}
        rowKey={(c) => c.customerId}
        emptyMessage="No purchases yet."
      />
    </div>
  );
}