import { vehiclesApi } from '@/modules/vehicles/api/vehicles.api';
import { ordersApi } from '@/modules/orders/api/orders.api';
import { expensesApi } from '@/modules/expenses/api/expenses.api';
import type { ProfitReport } from '@/modules/vehicles/api/vehicles.types';

export interface DashboardStats {
  inventory: {
    total: number;
    available: number;
    reserved: number;
    sold: number;
    published: number;
  };
  orders: {
    total: number;
    pending: number;
    contacted: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  financials: {
    totalRevenue: number;
    totalCost: number;
    totalGrossProfit: number;
    totalGeneralExpenses: number;
    saleCount: number;
    currency: string;
  };
  recentSales: ProfitReport['items'];
}

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    // Fetch everything in parallel
    const [
      availableVehicles,
      reservedVehicles,
      soldVehicles,
      publishedVehicles,
      allVehicles,

      pendingOrders,
      contactedOrders,
      confirmedOrders,
      completedOrders,
      cancelledOrders,

      profitReport,
      generalExpenseSummary,
    ] = await Promise.all([
      vehiclesApi.listStaff({ limit: 1, status: 'AVAILABLE' }),
      vehiclesApi.listStaff({ limit: 1, status: 'RESERVED' }),
      vehiclesApi.listStaff({ limit: 1, status: 'SOLD' }),
      vehiclesApi.listStaff({ limit: 1, isPublished: true }),
      vehiclesApi.listStaff({ limit: 1 }),

      ordersApi.listStaff({ limit: 1, status: 'PENDING' }),
      ordersApi.listStaff({ limit: 1, status: 'CONTACTED' }),
      ordersApi.listStaff({ limit: 1, status: 'CONFIRMED' }),
      ordersApi.listStaff({ limit: 1, status: 'COMPLETED' }),
      ordersApi.listStaff({ limit: 1, status: 'CANCELLED' }),

      vehiclesApi.getProfitReport({}),
      expensesApi.generalSummary(),
    ]);

    const totals = profitReport.totals;

    return {
      inventory: {
        total: allVehicles.meta.total,
        available: availableVehicles.meta.total,
        reserved: reservedVehicles.meta.total,
        sold: soldVehicles.meta.total,
        published: publishedVehicles.meta.total,
      },
      orders: {
        total:
          pendingOrders.meta.total +
          contactedOrders.meta.total +
          confirmedOrders.meta.total +
          completedOrders.meta.total +
          cancelledOrders.meta.total,
        pending: pendingOrders.meta.total,
        contacted: contactedOrders.meta.total,
        confirmed: confirmedOrders.meta.total,
        completed: completedOrders.meta.total,
        cancelled: cancelledOrders.meta.total,
      },
      financials: {
        totalRevenue: totals.totalRevenue,
        totalCost: totals.totalCost,
        totalGrossProfit: totals.totalGrossProfit,
        totalGeneralExpenses: generalExpenseSummary.total,
        saleCount: totals.count,
        currency: 'USD',
      },
      recentSales: profitReport.items.slice(0, 5),
    };
  },
};