import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Car,
  Heart,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useCartCount } from '@/modules/cart/hooks/useCart';
import { useAppSettings } from '@/modules/settings/context/SettingsContext';
import { cn, getInitials } from '@/shared/lib/utils';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-sm font-medium transition-colors hover:text-foreground',
    isActive ? 'text-foreground' : 'text-muted-foreground'
  );

export function PublicLayout() {
  const { user, isAuthenticated, isStaff, logout } = useAuth();
  const navigate = useNavigate();
  const cartCount = useCartCount();
  const {
    businessName,
    logoUrl,
    email,
    phone,
    address,
    city,
    country,
    website,
  } = useAppSettings();

  const count = cartCount.data ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo + name */}
            <Link to="/" className="flex items-center gap-2">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={businessName}
                  className="h-8 w-8 rounded-md object-contain"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Car className="h-5 w-5" />
                </div>
              )}
              <span className="text-lg font-bold">{businessName}</span>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/vehicles" className={navLinkClass}>
                Browse Vehicles
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                About
              </NavLink>
              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && !isStaff && (
              <>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/account/favorites" aria-label="Favorites">
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>

                <Button variant="ghost" size="icon" asChild>
                  <Link to="/account/cart" aria-label="Cart" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {count > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </Link>
                </Button>
              </>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 rounded-full px-2">
                    <Avatar className="h-8 w-8">
                      {user?.image && <AvatarImage src={user.image} />}
                      <AvatarFallback>
                        {getInitials(user?.name ?? 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium md:inline">
                      {user?.name.split(' ')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  {!isStaff && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/account')}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        My Account
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/account/orders')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        My Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate('/account/favorites')}
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/account/cart')}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Cart
                        {count > 0 && (
                          <span className="ml-auto rounded-full bg-primary px-2 text-[10px] font-bold text-primary-foreground">
                            {count}
                          </span>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate('/account/profile')}
                      >
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                    </>
                  )}

                  {isStaff && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        My Profile
                      </DropdownMenuItem>
                    </>
                  )}

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
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-10">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={businessName}
                    className="h-8 w-8 rounded-md object-contain"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Car className="h-5 w-5" />
                  </div>
                )}
                <span className="font-bold">{businessName}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted partner for quality new and pre-owned vehicles.
              </p>
            </div>

            {/* Browse */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Browse</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/vehicles" className="hover:text-foreground">
                    All vehicles
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vehicles?condition=NEW"
                    className="hover:text-foreground"
                  >
                    New cars
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vehicles?condition=CERTIFIED_PRE_OWNED"
                    className="hover:text-foreground"
                  >
                    Certified pre-owned
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/about" className="hover:text-foreground">
                    About us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact info from settings */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Get in touch</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {email && (
                  <li className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                    <a
                      href={`mailto:${email}`}
                      className="hover:text-foreground"
                    >
                      {email}
                    </a>
                  </li>
                )}
                {phone && (
                  <li className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                    <a
                      href={`tel:${phone}`}
                      className="hover:text-foreground"
                    >
                      {phone}
                    </a>
                  </li>
                )}
                {(address || city || country) && (
                  <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      {[address, city, country].filter(Boolean).join(', ')}
                    </span>
                  </li>
                )}
                {website && (
                  <li>
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground"
                    >
                      {website.replace(/^https?:\/\//, '')}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} {businessName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}