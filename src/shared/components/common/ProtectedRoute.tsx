import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import type { UserRole } from '@/shared/types';

interface ProtectedRouteProps {
  roles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  roles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const location = useLocation();
  const { user, accessToken } = useAuthStore();

  if (!accessToken || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}