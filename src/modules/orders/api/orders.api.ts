import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse, PaginatedResponse } from '@/shared/api/types';
import type { OrderStatus } from '@/shared/types';
import type { CreateOrderInput, Order, OrderFilters } from './orders.types';

export const ordersApi = {
  /* -------------------- Customer -------------------- */
  async create(input: CreateOrderInput): Promise<Order> {
    const { data } = await apiClient.post<ApiResponse<Order>>(
      ENDPOINTS.orders.create,
      input
    );
    return data.data;
  },

  async listMine(filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>(
      ENDPOINTS.orders.mine,
      { params: filters }
    );
    return data.data;
  },

  async getMine(id: string): Promise<Order> {
    const { data } = await apiClient.get<ApiResponse<Order>>(
      ENDPOINTS.orders.mineById(id)
    );
    return data.data;
  },

  async cancelMine(id: string, reason?: string): Promise<Order> {
    const { data } = await apiClient.post<ApiResponse<Order>>(
      ENDPOINTS.orders.cancelMine(id),
      { reason }
    );
    return data.data;
  },

  /* -------------------- Staff -------------------- */
  async listStaff(filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>(
      ENDPOINTS.orders.staffList,
      { params: filters }
    );
    return data.data;
  },

  async getStaff(id: string): Promise<Order> {
    const { data } = await apiClient.get<ApiResponse<Order>>(
      ENDPOINTS.orders.staffById(id)
    );
    return data.data;
  },

  async updateStatus(
    id: string,
    status: OrderStatus,
    cancelReason?: string
  ): Promise<Order> {
    const { data } = await apiClient.patch<ApiResponse<Order>>(
      ENDPOINTS.orders.staffStatus(id),
      { status, cancelReason }
    );
    return data.data;
  },

  async updateStaffNotes(id: string, staffNotes: string | null): Promise<Order> {
    const { data } = await apiClient.patch<ApiResponse<Order>>(
      ENDPOINTS.orders.staffNotes(id),
      { staffNotes }
    );
    return data.data;
  },
};