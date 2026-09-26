import { apiClient } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/api/types';
import type {
  CustomersReport,
  ExpensesReport,
  InventoryReport,
  OrdersReport,
  ProfitReport,
  ReportFilters,
  SalesReport,
} from './reports.types';

export const reportsApi = {
  async sales(filters: ReportFilters = {}): Promise<SalesReport> {
    const { data } = await apiClient.get<ApiResponse<SalesReport>>(
      '/reports/sales',
      { params: filters }
    );
    return data.data;
  },

  async inventory(): Promise<InventoryReport> {
    const { data } = await apiClient.get<ApiResponse<InventoryReport>>(
      '/reports/inventory'
    );
    return data.data;
  },

  async profit(filters: ReportFilters = {}): Promise<ProfitReport> {
    const { data } = await apiClient.get<ApiResponse<ProfitReport>>(
      '/reports/profit',
      { params: filters }
    );
    return data.data;
  },

  async orders(filters: ReportFilters = {}): Promise<OrdersReport> {
    const { data } = await apiClient.get<ApiResponse<OrdersReport>>(
      '/reports/orders',
      { params: filters }
    );
    return data.data;
  },

  async expenses(filters: ReportFilters = {}): Promise<ExpensesReport> {
    const { data } = await apiClient.get<ApiResponse<ExpensesReport>>(
      '/reports/expenses',
      { params: filters }
    );
    return data.data;
  },

  async customers(filters: ReportFilters = {}): Promise<CustomersReport> {
    const { data } = await apiClient.get<ApiResponse<CustomersReport>>(
      '/reports/customers',
      { params: filters }
    );
    return data.data;
  },
};