export interface SalesReportSummary {
  totalSales: number;
  totalRevenue: number;
  averageSalePrice: number;
}

export interface SalesReport {
  summary: SalesReportSummary;
  byMonth: { month: string; count: number; revenue: number }[];
  byChannel: Record<string, { count: number; revenue: number }>;
  byPaymentStatus: Record<string, { count: number; revenue: number }>;
  topSales: Array<{
    _id: string;
    saleNumber: string;
    salePrice: number;
    currency: string;
    saleDate: string;
    channel: string;
    vehicleId?: { stockNumber: string; make: string; model: string; year: number };
    customerId?: { name: string; email: string };
  }>;
}

export interface InventoryReport {
  summary: {
    total: number;
    available: number;
    reserved: number;
    sold: number;
    published: number;
    totalCost: number;
    totalAskingValue: number;
    potentialProfit: number;
  };
  byMake: { make: string; count: number }[];
  byBodyType: Record<string, number>;
  byFuelType: Record<string, number>;
  byCondition: Record<string, number>;
  aging: {
    under30: number;
    under60: number;
    under90: number;
    over90: number;
  };
}

export interface ProfitReport {
  items: Array<{
    saleId: string;
    saleNumber: string;
    vehicle: { stockNumber: string; make: string; model: string; year: number };
    salePrice: number;
    purchasePrice: number;
    totalExpenses: number;
    totalCost: number;
    grossProfit: number;
    margin: number;
    saleDate: string;
    channel: string;
  }>;
  totals: {
    count: number;
    totalRevenue: number;
    totalCost: number;
    totalGrossProfit: number;
    avgProfit: number;
    avgMargin: number;
  };
  byMonth: Array<{
    month: string;
    revenue: number;
    cost: number;
    profit: number;
    count: number;
  }>;
}

export interface OrdersReport {
  summary: {
    total: number;
    pending: number;
    contacted: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    conversionRate: number;
    cancellationRate: number;
  };
  byMonth: { month: string; count: number }[];
}

export interface ExpensesReport {
  summary: {
    totalVehicle: number;
    totalGeneral: number;
    total: number;
  };
  vehicle: { category: string; total: number; count: number }[];
  general: { category: string; total: number; count: number }[];
}

export interface CustomersReport {
  summary: {
    totalCustomers: number;
    activeCustomers: number;
    verifiedCustomers: number;
  };
  topCustomers: Array<{
    customerId: string;
    name: string;
    email: string;
    totalSpent: number;
    purchaseCount: number;
  }>;
}

export interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
}