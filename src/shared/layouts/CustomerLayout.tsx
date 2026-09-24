import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  ShoppingCart,
  User as UserIcon,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

const nav = [
  { name: 'Overview', href: '/account', icon: LayoutDashboard, exact: true },
  { name: 'My Orders', href: '/account/orders', icon: ShoppingBag },
  { name: 'Favorites', href: '/account/favorites', icon: Heart },
  { name: 'Cart', href: '/account/cart', icon: ShoppingCart },
  { name: 'Profile', href: '/account/profile', icon: UserIcon },
];

export function CustomerLayout() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to storefront
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1 lg:sticky lg:top-20 lg:self-start">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.exact}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </NavLink>
            );
          })}
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}