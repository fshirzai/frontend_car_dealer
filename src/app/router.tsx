import { createBrowserRouter, Navigate } from 'react-router-dom';

import { PublicLayout } from '@/shared/layouts/PublicLayout';
import { AdminLayout } from '@/shared/layouts/AdminLayout';
import { AuthLayout } from '@/shared/layouts/AuthLayout';
import { CustomerLayout } from '@/shared/layouts/CustomerLayout';
import { ProtectedRoute } from '@/shared/components/common/ProtectedRoute';

import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { RegisterPage } from '@/modules/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@/modules/auth/pages/ForgotPasswordPage';

import { HomePage } from '@/modules/dashboard/pages/HomePage';
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage';
import { CustomerDashboardPage } from '@/modules/dashboard/pages/CustomerDashboardPage';
import { NotFoundPage } from '@/modules/dashboard/pages/NotFoundPage';

import { VehicleListPage } from '@/modules/vehicles/pages/VehicleListPage';
import { VehicleDetailPage } from '@/modules/vehicles/pages/VehicleDetailPage';
import { AdminVehicleListPage } from '@/modules/vehicles/pages/AdminVehicleListPage';
import { AdminVehicleFormPage } from '@/modules/vehicles/pages/AdminVehicleFormPage';
import { AdminVehicleDetailPage } from '@/modules/vehicles/pages/AdminVehicleDetailPage';

import { FavoritesPage } from '@/modules/favorites/pages/FavoritesPage';
import { CartPage } from '@/modules/cart/pages/CartPage';
import { CartCheckoutPage } from '@/modules/cart/pages/CartCheckoutPage';

import { MyOrdersPage } from '@/modules/orders/pages/MyOrdersPage';
import { OrderDetailPage } from '@/modules/orders/pages/OrderDetailPage';
import { AdminOrderListPage } from '@/modules/orders/pages/AdminOrderListPage';
import { AdminOrderDetailPage } from '@/modules/orders/pages/AdminOrderDetailPage';

import { ProfilePage } from '@/modules/users/pages/ProfilePage';
import { AdminUserListPage } from '@/modules/users/pages/AdminUserListPage';

import { AdminSellerListPage } from '@/modules/sellers/pages/AdminSellerListPage';
import { AdminPurchaseListPage } from '@/modules/purchases/pages/AdminPurchaseListPage';
import { AdminSaleListPage } from '@/modules/sales/pages/AdminSaleListPage';
import { AdminVehicleExpenseListPage } from '@/modules/expenses/pages/AdminVehicleExpenseListPage';
import { AdminGeneralExpenseListPage } from '@/modules/expenses/pages/AdminGeneralExpenseListPage';
import { AdminAuditLogPage } from '@/modules/auditLogs/pages/AdminAuditLogPage';
import { AdminSettingsPage } from '@/modules/settings/pages/AdminSettingsPage';

import { USER_ROLES } from '@/shared/types';
import  { AboutPage } from '@/modules/dashboard/pages/AboutPage';
import { ContactPage } from '@/modules/dashboard/pages/ContactPage';
import { ReportsPage } from '@/modules/reports/pages/ReportsPage';
import { SalesReportPage } from '@/modules/reports/pages/SalesReportPage';
import { InventoryReportPage } from '@/modules/reports/pages/InventoryReportPage';
import { ProfitReportPage } from '@/modules/reports/pages/ProfitReportPage';
import { OrdersReportPage } from '@/modules/reports/pages/OrdersReportPage';
import { ExpensesReportPage } from '@/modules/reports/pages/ExpensesReportPage';
import { CustomersReportPage } from '@/modules/reports/pages/CustomersReportPage';
export const router = createBrowserRouter([
  /* -------------------- Auth -------------------- */
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },

  /* -------------------- Public / Storefront -------------------- */
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/vehicles', element: <VehicleListPage /> },
      { path: '/vehicles/:id', element: <VehicleDetailPage /> },

      // Legacy redirect — any authenticated user
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/profile',
            element: <Navigate to="/account/profile" replace />,
          },
        ],
      },
{ path: '/about', element: <AboutPage /> },
{ path: '/contact', element: <ContactPage /> },
      /* -------------------- Customer account area -------------------- */
      {
        element: <ProtectedRoute roles={[USER_ROLES.CUSTOMER]} />,
        children: [
          {
            path: '/account',
            element: <CustomerLayout />,
            children: [
              { index: true, element: <CustomerDashboardPage /> },
              { path: 'orders', element: <MyOrdersPage /> },
              { path: 'orders/:id', element: <OrderDetailPage /> },
              { path: 'favorites', element: <FavoritesPage /> },
              { path: 'cart', element: <CartPage /> },
              { path: 'cart/checkout/:vehicleId', element: <CartCheckoutPage /> },
              { path: 'profile', element: <ProfilePage /> },
            ],
          },
        ],
      },

      /* -------------------- Legacy customer URL redirects -------------------- */
      {
        element: <ProtectedRoute roles={[USER_ROLES.CUSTOMER]} />,
        children: [
          {
            path: '/favorites',
            element: <Navigate to="/account/favorites" replace />,
          },
          { path: '/cart', element: <Navigate to="/account/cart" replace /> },
          {
            path: '/orders/mine',
            element: <Navigate to="/account/orders" replace />,
          },
        ],
      },
    ],
  },

  /* -------------------- Admin -------------------- */
  {
    path: '/admin',
    element: <ProtectedRoute roles={[USER_ROLES.ADMIN, USER_ROLES.SELLER]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },

          // Vehicles
          { path: 'vehicles', element: <AdminVehicleListPage /> },
          { path: 'vehicles/new', element: <AdminVehicleFormPage /> },
          { path: 'vehicles/:id', element: <AdminVehicleDetailPage /> },
          { path: 'vehicles/:id/edit', element: <AdminVehicleFormPage /> },

          // Orders
          { path: 'orders', element: <AdminOrderListPage /> },
          { path: 'orders/:id', element: <AdminOrderDetailPage /> },

          // Financials
          { path: 'purchases', element: <AdminPurchaseListPage /> },
          { path: 'sales', element: <AdminSaleListPage /> },
          {
            path: 'vehicle-expenses',
            element: <AdminVehicleExpenseListPage />,
          },
          {
            path: 'general-expenses',
            element: <AdminGeneralExpenseListPage />,
          },

          // People
          { path: 'sellers', element: <AdminSellerListPage /> },
          { path: 'users', element: <AdminUserListPage /> },

          // Admin-only
          {
            element: <ProtectedRoute roles={[USER_ROLES.ADMIN]} />,
            children: [
              { path: 'audit-logs', element: <AdminAuditLogPage /> },
              { path: 'settings', element: <AdminSettingsPage /> },
              { path: 'reports', element: <ReportsPage /> },
{ path: 'reports/sales', element: <SalesReportPage /> },
{ path: 'reports/inventory', element: <InventoryReportPage /> },
{ path: 'reports/profit', element: <ProfitReportPage /> },
{ path: 'reports/orders', element: <OrdersReportPage /> },
{ path: 'reports/expenses', element: <ExpensesReportPage /> },
{ path: 'reports/customers', element: <CustomersReportPage /> },
            ],
          },
        ],
      },
    ],
  },

  /* -------------------- Fallbacks -------------------- */
  { path: '/dashboard', element: <Navigate to="/admin" replace /> },
  { path: '*', element: <NotFoundPage /> },
]);