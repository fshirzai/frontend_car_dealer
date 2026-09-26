import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../api/reports.api';
import type { ReportFilters } from '../api/reports.types';

export const reportKeys = {
  all: ['reports'] as const,
  sales: (f: ReportFilters) => [...reportKeys.all, 'sales', f] as const,
  inventory: () => [...reportKeys.all, 'inventory'] as const,
  profit: (f: ReportFilters) => [...reportKeys.all, 'profit', f] as const,
  orders: (f: ReportFilters) => [...reportKeys.all, 'orders', f] as const,
  expenses: (f: ReportFilters) => [...reportKeys.all, 'expenses', f] as const,
  customers: (f: ReportFilters) => [...reportKeys.all, 'customers', f] as const,
};

export function useSalesReport(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: reportKeys.sales(filters),
    queryFn: () => reportsApi.sales(filters),
  });
}

export function useInventoryReport() {
  return useQuery({
    queryKey: reportKeys.inventory(),
    queryFn: () => reportsApi.inventory(),
  });
}

export function useProfitReport(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: reportKeys.profit(filters),
    queryFn: () => reportsApi.profit(filters),
  });
}

export function useOrdersReport(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: reportKeys.orders(filters),
    queryFn: () => reportsApi.orders(filters),
  });
}

export function useExpensesReport(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: reportKeys.expenses(filters),
    queryFn: () => reportsApi.expenses(filters),
  });
}

export function useCustomersReport(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: reportKeys.customers(filters),
    queryFn: () => reportsApi.customers(filters),
  });
}