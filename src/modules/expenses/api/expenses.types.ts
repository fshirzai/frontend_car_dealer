import type { ExpenseCategory, GeneralExpenseCategory } from '@/shared/types';

export interface VehicleExpense {
  id: string;
  vehicleId: {
    id: string;
    stockNumber: string;
    make: string;
    model: string;
    year: number;
    status: string;
  };
  category: ExpenseCategory;
  description: string;
  amount: number;
  currency: string;
  expenseDate: string;
  documentUrl: string | null;
  notes: string | null;
  createdById: { id: string; name: string; email: string; role: string };
  createdAt: string;
  updatedAt: string;
}

export interface GeneralExpense {
  id: string;
  category: GeneralExpenseCategory;
  description: string;
  amount: number;
  currency: string;
  expenseDate: string;
  documentUrl: string | null;
  notes: string | null;
  createdById: { id: string; name: string; email: string; role: string };
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFilters {
  page?: number;
  limit?: number;
  vehicleId?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sort?: string;
}

export interface VehicleExpenseSummary {
  total: number;
  byCategory: Record<string, number>;
}

export interface GeneralExpenseSummary {
  total: number;
  count: number;
  byCategory: Record<string, { total: number; count: number }>;
}

export interface CreateVehicleExpenseInput {
  vehicleId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  currency?: string;
  expenseDate?: string;
  documentUrl?: string | null;
  notes?: string | null;
}

export interface CreateGeneralExpenseInput {
  category: GeneralExpenseCategory;
  description: string;
  amount: number;
  currency?: string;
  expenseDate?: string;
  documentUrl?: string | null;
  notes?: string | null;
}