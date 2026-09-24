import type { PaymentStatus, SaleChannel } from '@/shared/types';

export interface Sale {
  id: string;
  saleNumber: string;
  vehicleId: {
    id: string;
    stockNumber: string;
    make: string;
    model: string;
    year: number;
    status: string;
  };
  customerId:
    | {
        id: string;
        name: string;
        email: string;
        phone?: string;
        role: string;
      }
    | null;
  salePrice: number;
  currency: string;
  saleDate: string;
  channel: SaleChannel;
  orderId: { id: string; orderNumber: string; status: string } | null;
  paymentStatus: PaymentStatus;
  notes: string | null;
  invoiceNumber: string | null;
  createdById: { id: string; name: string; email: string; role: string };
  createdAt: string;
  updatedAt: string;
}

export interface SaleFilters {
  page?: number;
  limit?: number;
  vehicleId?: string;
  customerId?: string;
  channel?: SaleChannel;
  paymentStatus?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sort?: string;
}

export interface CreateSaleInput {
  vehicleId: string;
  customerId?: string | null;
  salePrice: number;
  currency?: string;
  saleDate?: string;
  channel: SaleChannel;
  orderId?: string | null;
  paymentStatus?: PaymentStatus;
  notes?: string | null;
  invoiceNumber?: string | null;
}

export type UpdateSaleInput = Omit<
  Partial<CreateSaleInput>,
  'vehicleId' | 'customerId' | 'channel' | 'orderId'
>;