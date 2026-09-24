import { Link } from 'react-router-dom';
import {
  Car,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Wallet,
  FileText,
  ArrowRight,
  Package,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { formatCurrency, formatDate } from '@/shared/lib/utils';
import { useDashboardStats } from '../hooks/useDashboard';

export function DashboardPage() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading || !data) return <FullPageSpinner />;

  const { inventory, orders, financials, recentSales } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your dealership performance"
      />

      {/* Primary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Inventory"
          value={inventory.total.toString()}
          description={`${inventory.available} available · ${inventory.reserved} reserved`}
          Icon={Car}
        />
        <KpiCard
          title="Open Orders"
          value={(orders.pending + orders.contacted + orders.confirmed).toString()}
          description={`${orders.pending} pending · ${orders.contacted} contacted`}
          Icon={ShoppingBag}
        />
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(financials.totalRevenue, financials.currency)}
          description={`${financials.saleCount} sale${financials.saleCount === 1 ? '' : 's'}`}
          Icon={DollarSign}
        />
        <KpiCard
          title="Gross Profit"
          value={formatCurrency(financials.totalGrossProfit, financials.currency)}
          description="From all completed sales"
          Icon={TrendingUp}
          highlight
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SmallKpi
          label="Available"
          value={inventory.available}
          badgeVariant="success"
        />
        <SmallKpi
          label="Reserved"
          value={inventory.reserved}
          badgeVariant="warning"
        />
        <SmallKpi
          label="Sold"
          value={inventory.sold}
          badgeVariant="destructive"
        />
        <SmallKpi
          label="Published"
          value={inventory.published}
          badgeVariant="info"
        />
      </div>

      {/* Charts + Recent sales */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Inventory breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventory Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <BarRow
              label="Available"
              value={inventory.available}
              max={inventory.total}
              color="bg-emerald-500"
            />
            <BarRow
              label="Reserved"
              value={inventory.reserved}
              max={inventory.total}
              color="bg-amber-500"
            />
            <BarRow
              label="Sold"
              value={inventory.sold}
              max={inventory.total}
              color="bg-red-500"
            />
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold">{inventory.total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Order pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <BarRow
              label="Pending"
              value={orders.pending}
              max={orders.total}
              color="bg-amber-500"
            />
            <BarRow
              label="Contacted"
              value={orders.contacted}
              max={orders.total}
              color="bg-blue-500"
            />
            <BarRow
              label="Confirmed"
              value={orders.confirmed}
              max={orders.total}
              color="bg-indigo-500"
            />
            <BarRow
              label="Completed"
              value={orders.completed}
              max={orders.total}
              color="bg-emerald-500"
            />
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold">{orders.total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Financial summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Financials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total revenue</span>
              <span className="font-semibold">
                {formatCurrency(financials.totalRevenue, financials.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total cost</span>
              <span className="font-medium">
                {formatCurrency(financials.totalCost, financials.currency)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Gross profit
              </span>
              <span className="text-lg font-bold text-emerald-600">
                {formatCurrency(financials.totalGrossProfit, financials.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">General expenses</span>
              <span className="font-medium">
                {formatCurrency(
                  financials.totalGeneralExpenses,
                  financials.currency
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent sales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Recent sales</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/sales">
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentSales.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No sales yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentSales.map((sale) => (
                <div
                  key={sale._id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {sale.vehicle.year} {sale.vehicle.make}{' '}
                      {sale.vehicle.model}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sale.saleNumber} · {sale.vehicle.stockNumber} ·{' '}
                      {formatDate(sale.saleDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {formatCurrency(sale.salePrice)}
                    </p>
                    <p className="text-xs text-emerald-600">
                      +{formatCurrency(sale.grossProfit)} profit
                    </p>
                  </div>
                  <Badge variant="outline">{sale.channel}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction
          to="/admin/vehicles/new"
          Icon={Package}
          label="Add vehicle"
          description="Add a new car to inventory"
        />
        <QuickAction
          to="/admin/orders"
          Icon={ShoppingBag}
          label="View orders"
          description="Process customer requests"
        />
        <QuickAction
          to="/admin/sales"
          Icon={Wallet}
          label="Record sale"
          description="Complete a vehicle sale"
        />
        <QuickAction
          to="/admin/general-expenses"
          Icon={FileText}
          label="Add expense"
          description="Record overhead costs"
        />
      </div>
    </div>
  );
}

/* -------------------- Components -------------------- */

function KpiCard({
  title,
  value,
  description,
  Icon,
  highlight,
}: {
  title: string;
  value: string;
  description: string;
  Icon: typeof Car;
  highlight?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold ${highlight ? 'text-emerald-600' : ''}`}
        >
          {value}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function SmallKpi({
  label,
  value,
  badgeVariant,
}: {
  label: string;
  value: number;
  badgeVariant: 'success' | 'warning' | 'destructive' | 'info';
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between pt-6">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Badge variant={badgeVariant}>●</Badge>
      </CardContent>
    </Card>
  );
}

function BarRow({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const percent = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function QuickAction({
  to,
  Icon,
  label,
  description,
}: {
  to: string;
  Icon: typeof Car;
  label: string;
  description: string;
}) {
  return (
    <Link to={to}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-start gap-3 pt-6">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">{label}</p>
            <CardDescription className="mt-0.5 text-xs">
              {description}
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}