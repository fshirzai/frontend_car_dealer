import type { PaymentStatus } from '@/shared/types';

export interface Purchase {
  id: string;
  purchaseNumber: string;
  vehicleId: {
    id: string;
    stockNumber: string;
    make: string;
    model: string;
    year: number;
    status: string;
  };
  sellerId: {
    id: string;
    name: string;
    type: string | null;
    phone: string | null;
    email: string | null;
    city: string | null;
    country: string | null;
    isActive: boolean;
  };
  purchasePrice: number;
  currency: string;
  purchaseDate: string;
  paymentStatus: PaymentStatus;
  notes: string | null;
  documentUrl: string | null;
  createdById: { id: string; name: string; email: string; role: string };
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseFilters {
  page?: number;
  limit?: number;
  sellerId?: string;
  vehicleId?: string;
  paymentStatus?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sort?: string;
}

export interface CreatePurchaseInput {
  vehicleId: string;
  sellerId: string;
  purchasePrice: number;
  currency?: string;
  purchaseDate?: string;
  paymentStatus?: PaymentStatus;
  notes?: string | null;
  documentUrl?: string | null;
}

export type UpdatePurchaseInput = Omit<
  Partial<CreatePurchaseInput>,
  'vehicleId' | 'sellerId'
>;