import type { SellerType } from '@/shared/types';

export interface Seller {
  id: string;
  name: string;
  type: SellerType | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SellerFilters {
  page?: number;
  limit?: number;
  type?: SellerType;
  isActive?: boolean;
  city?: string;
  country?: string;
  search?: string;
  sort?: string;
}

export interface CreateSellerInput {
  name: string;
  type?: SellerType | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  notes?: string | null;
  isActive?: boolean;
}

export type UpdateSellerInput = Partial<CreateSellerInput>;