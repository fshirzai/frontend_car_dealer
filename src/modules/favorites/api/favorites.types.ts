import type { PublicVehicle } from '@/modules/vehicles/api/vehicles.types';

export interface Favorite {
  id: string;
  userId: string;
  vehicleId: PublicVehicle;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteToggleResponse {
  favorited: boolean;
}