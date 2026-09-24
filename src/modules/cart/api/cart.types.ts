import type { PublicVehicle } from '@/modules/vehicles/api/vehicles.types';

export interface CartItem {
  id: string;
  userId: string;
  vehicleId: PublicVehicle;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartCountResponse {
  count: number;
}

export interface ClearCartResponse {
  cleared: number;
}