import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { normalizeError } from '@/shared/api/client';
import { expensesApi } from '../api/expenses.api';
import type {
  CreateGeneralExpenseInput,
  CreateVehicleExpenseInput,
  ExpenseFilters,
} from '../api/expenses.types';

export const expenseKeys = {
  all: ['expenses'] as const,
  vehicle: (filters: ExpenseFilters) =>
    [...expenseKeys.all, 'vehicle', 'list', filters] as const,
  vehicleSummary: (vehicleId: string) =>
    [...expenseKeys.all, 'vehicle', 'summary', vehicleId] as const,
  general: (filters: ExpenseFilters) =>
    [...expenseKeys.all, 'general', 'list', filters] as const,
  generalSummary: (params: { dateFrom?: string; dateTo?: string }) =>
    [...expenseKeys.all, 'general', 'summary', params] as const,
};

/* -------------------- Vehicle -------------------- */

export function useVehicleExpenses(filters: ExpenseFilters = {}) {
  return useQuery({
    queryKey: expenseKeys.vehicle(filters),
    queryFn: () => expensesApi.listVehicle(filters),
  });
}

export function useVehicleExpenseSummary(vehicleId: string | undefined) {
  return useQuery({
    queryKey: expenseKeys.vehicleSummary(vehicleId ?? ''),
    queryFn: () => expensesApi.vehicleSummary(vehicleId!),
    enabled: Boolean(vehicleId),
  });
}

export function useCreateVehicleExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVehicleExpenseInput) =>
      expensesApi.createVehicle(input),
    onSuccess: () => {
      toast.success('Expense recorded');
      qc.invalidateQueries({ queryKey: expenseKeys.all });
      qc.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useDeleteVehicleExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expensesApi.deleteVehicle(id),
    onSuccess: () => {
      toast.success('Expense deleted');
      qc.invalidateQueries({ queryKey: expenseKeys.all });
      qc.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

/* -------------------- General -------------------- */

export function useGeneralExpenses(filters: ExpenseFilters = {}) {
  return useQuery({
    queryKey: expenseKeys.general(filters),
    queryFn: () => expensesApi.listGeneral(filters),
  });
}

export function useGeneralExpenseSummary(
  params: { dateFrom?: string; dateTo?: string } = {}
) {
  return useQuery({
    queryKey: expenseKeys.generalSummary(params),
    queryFn: () => expensesApi.generalSummary(params),
  });
}

export function useCreateGeneralExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGeneralExpenseInput) =>
      expensesApi.createGeneral(input),
    onSuccess: () => {
      toast.success('Expense recorded');
      qc.invalidateQueries({ queryKey: expenseKeys.all });
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useDeleteGeneralExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expensesApi.deleteGeneral(id),
    onSuccess: () => {
      toast.success('Expense deleted');
      qc.invalidateQueries({ queryKey: expenseKeys.all });
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}