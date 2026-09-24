import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  ShoppingCart,
  ArrowRight,
  Car,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export function CustomerDashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] ?? 'there';

  const cards = [
    {
      title: 'My Orders',
      description: 'Track your order requests and their status.',
      href: '/account/orders',
      Icon: ShoppingBag,
    },
    {
      title: 'Favorites',
      description: 'Vehicles you saved for later.',
      href: '/account/favorites',
      Icon: Heart,
    },
    {
      title: 'Cart',
      description: 'Vehicles ready to order.',
      href: '/account/cart',
      Icon: ShoppingCart,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Manage your orders, favorites, and cart from one place."
      />

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.Icon;
          return (
            <Card
              key={c.href}
              className="transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {c.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription>{c.description}</CardDescription>
                <Button variant="link" className="h-auto p-0" asChild>
                  <Link to={c.href}>
                    Open <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Car className="h-4 w-4" />
            Looking for your next car?
          </CardTitle>
          <CardDescription>
            Browse our latest inventory of quality new and pre-owned vehicles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/vehicles">
              Browse vehicles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}