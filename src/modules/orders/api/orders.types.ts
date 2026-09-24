import type { PublicVehicle } from '@/modules/vehicles/api/vehicles.types';
import type { OrderStatus } from '@/shared/types';

export interface OrderItem {
  _id: string;
  vehicleId: PublicVehicle | string;
  vehicleName: string;
  vehicleStockNumber: string;
  unitPrice: number;
  currency: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string | null;
  customerNotes: string | null;
  staffNotes?: string;
  contactedAt: string | null;
  confirmedAt: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
  cancelReason: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  items: { vehicleId: string }[];
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string | null;
  customerNotes?: string | null;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
  sort?: string;
}