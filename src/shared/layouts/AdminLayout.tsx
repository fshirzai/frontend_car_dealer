import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  ShoppingBag,
  Users,
  UserCog,
  Wallet,
  Receipt,
  FileText,
  Settings,
  Building2,
  LogOut,
  Menu,
  X,
  Car as CarLogo,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useAppSettings } from '@/modules/settings/context/SettingsContext';
import { cn, getInitials } from '@/shared/lib/utils';
import { BarChart3 } from 'lucide-react';
const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Vehicles', href: '/admin/vehicles', icon: Car },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Purchases', href: '/admin/purchases', icon: Receipt },
  { name: 'Sales', href: '/admin/sales', icon: Wallet },
  { name: 'Vehicle Expenses', href: '/admin/vehicle-expenses', icon: Receipt },
  { name: 'General Expenses', href: '/admin/general-expenses', icon: FileText },
  { name: 'Sellers', href: '/admin/sellers', icon: Building2 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  {
    name: 'Audit Logs',
    href: '/admin/audit-logs',
    icon: UserCog,
    adminOnly: true,
  },
  { name: 'Settings', href: '/admin/settings', icon: Settings, adminOnly: true },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { businessName, logoUrl } = useAppSettings();
  const navigate = useNavigate();

  const visibleNav = navigation.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link to="/admin" className="flex items-center gap-2">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={businessName}
                className="h-8 w-8 rounded-md object-contain"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <CarLogo className="h-5 w-5" />
              </div>
            )}
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold">
                {businessName.length > 18
                  ? `${businessName.slice(0, 18)}…`
                  : businessName}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Admin
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="space-y-1 overflow-y-auto p-3 pb-20">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t bg-card p-3">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to site
            </Link>
          </Button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
              {businessName}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 rounded-full px-2">
                <Avatar className="h-8 w-8">
                  {user?.image && <AvatarImage src={user.image} />}
                  <AvatarFallback>
                    {getInitials(user?.name ?? 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                My profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/')}>
                Back to storefront
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}