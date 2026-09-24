import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse, PaginatedResponse } from '@/shared/api/types';
import type {
  CreateGeneralExpenseInput,
  CreateVehicleExpenseInput,
  ExpenseFilters,
  GeneralExpense,
  GeneralExpenseSummary,
  VehicleExpense,
  VehicleExpenseSummary,
} from './expenses.types';

export const expensesApi = {
  /* -------------------- Vehicle expenses -------------------- */
  async listVehicle(
    filters: ExpenseFilters = {}
  ): Promise<PaginatedResponse<VehicleExpense>> {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<VehicleExpense>>
    >(ENDPOINTS.vehicleExpenses.list, { params: filters });
    return data.data;
  },

  async createVehicle(
    input: CreateVehicleExpenseInput
  ): Promise<VehicleExpense> {
    const { data } = await apiClient.post<ApiResponse<VehicleExpense>>(
      ENDPOINTS.vehicleExpenses.create,
      input
    );
    return data.data;
  },

  async updateVehicle(
    id: string,
    input: Partial<CreateVehicleExpenseInput>
  ): Promise<VehicleExpense> {
    const { data } = await apiClient.patch<ApiResponse<VehicleExpense>>(
      ENDPOINTS.vehicleExpenses.byId(id),
      input
    );
    return data.data;
  },

  async deleteVehicle(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.vehicleExpenses.byId(id));
  },

  async vehicleSummary(vehicleId: string): Promise<VehicleExpenseSummary> {
    const { data } = await apiClient.get<ApiResponse<VehicleExpenseSummary>>(
      ENDPOINTS.vehicleExpenses.summaryByVehicle(vehicleId)
    );
    return data.data;
  },

  /* -------------------- General expenses -------------------- */
  async listGeneral(
    filters: ExpenseFilters = {}
  ): Promise<PaginatedResponse<GeneralExpense>> {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<GeneralExpense>>
    >(ENDPOINTS.generalExpenses.list, { params: filters });
    return data.data;
  },

  async createGeneral(
    input: CreateGeneralExpenseInput
  ): Promise<GeneralExpense> {
    const { data } = await apiClient.post<ApiResponse<GeneralExpense>>(
      ENDPOINTS.generalExpenses.create,
      input
    );
    return data.data;
  },

  async updateGeneral(
    id: string,
    input: Partial<CreateGeneralExpenseInput>
  ): Promise<GeneralExpense> {
    const { data } = await apiClient.patch<ApiResponse<GeneralExpense>>(
      ENDPOINTS.generalExpenses.byId(id),
      input
    );
    return data.data;
  },

  async deleteGeneral(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.generalExpenses.byId(id));
  },

  async generalSummary(params: {
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<GeneralExpenseSummary> {
    const { data } = await apiClient.get<ApiResponse<GeneralExpenseSummary>>(
      ENDPOINTS.generalExpenses.summary,
      { params }
    );
    return data.data;
  },
};