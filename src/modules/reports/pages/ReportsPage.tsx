import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Car,
  ShoppingBag,
  Wallet,
  Users,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { PageHeader } from '@/shared/components/common/PageHeader';

const reports = [
  {
    to: '/admin/reports/sales',
    title: 'Sales Report',
    description: 'Revenue, monthly trends, top sales, channel breakdown',
    Icon: Wallet,
  },
  {
    to: '/admin/reports/inventory',
    title: 'Inventory Report',
    description: 'Stock levels, aging, cost vs asking value',
    Icon: Car,
  },
  {
    to: '/admin/reports/profit',
    title: 'Profit Report',
    description: 'Gross profit per vehicle and monthly margin',
    Icon: TrendingUp,
  },
  {
    to: '/admin/reports/orders',
    title: 'Orders Report',
    description: 'Pipeline status, conversion, cancellation rates',
    Icon: ShoppingBag,
  },
  {
    to: '/admin/reports/expenses',
    title: 'Expenses Report',
    description: 'Vehicle vs general expenses by category',
    Icon: BarChart3,
  },
  {
    to: '/admin/reports/customers',
    title: 'Customers Report',
    description: 'Total customers, active, top buyers',
    Icon: Users,
  },
];

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Business analytics and performance insights"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => {
          const Icon = r.Icon;
          return (
            <Link key={r.to} to={r.to}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base">{r.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{r.description}</p>
                  <Button variant="link" className="h-auto p-0" asChild>
                    <span>
                      Open <ArrowRight className="ml-1 h-3 w-3" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}