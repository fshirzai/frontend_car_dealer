import type {
  BodyType,
  DriveType,
  FuelType,
  MileageUnit,
  Transmission,
  VehicleCondition,
  VehicleStatus,
} from '@/shared/types';

/* -------------------- Public (customer-facing) -------------------- */
export interface PublicVehicle {
  id: string;
  stockNumber: string;
  make: string;
  model: string;
  year: number;
  trim: string | null;
  color: string | null;
  bodyType: BodyType;
  fuelType: FuelType;
  transmission: Transmission;
  driveType: DriveType;
  condition: VehicleCondition;
  mileage: number;
  mileageUnit: MileageUnit;
  description: string | null;
  askingPrice: number;
  currency: string;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
}

/* -------------------- Staff (internal) -------------------- */
export interface StaffVehicle extends PublicVehicle {
  vin: string | null;
  engineNumber: string | null;
  purchasePrice: number;
  isPublished: boolean;
}

/* -------------------- Images & video -------------------- */
export interface VehicleImage {
  id: string;
  vehicleId: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleVideo {
  id: string;
  vehicleId: string;
  url: string;
  thumbnailUrl: string | null;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

/* -------------------- Filters -------------------- */
export interface VehicleFilters {
  page?: number;
  limit?: number;
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  bodyType?: BodyType;
  fuelType?: FuelType;
  transmission?: Transmission;
  driveType?: DriveType;
  condition?: VehicleCondition;
  status?: VehicleStatus;
  isPublished?: boolean;
  search?: string;
  sort?: string;
}

/* -------------------- DTOs -------------------- */
export interface CreateVehicleInput {
  vin?: string | null;
  engineNumber?: string | null;
  make: string;
  model: string;
  year: number;
  trim?: string | null;
  color?: string | null;
  bodyType: BodyType;
  fuelType: FuelType;
  transmission: Transmission;
  driveType: DriveType;
  condition: VehicleCondition;
  mileage: number;
  mileageUnit?: MileageUnit;
  description?: string | null;
  purchasePrice: number;
  askingPrice: number;
  currency?: string;
  isPublished?: boolean;
}

export type UpdateVehicleInput = Partial<CreateVehicleInput> & {
  status?: VehicleStatus;
};

export interface UpdateVehicleStatusInput {
  status: VehicleStatus;
}

export interface CreateVehicleImageInput {
  url: string;
  altText?: string | null;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface UpsertVehicleVideoInput {
  url: string;
  thumbnailUrl?: string | null;
  title?: string | null;
}

/* -------------------- Profit -------------------- */
export interface VehicleProfit {
  vehicleId: string;
  stockNumber: string;
  make: string;
  model: string;
  year: number;
  status: VehicleStatus;
  currency: string;
  purchasePrice: number;
  totalExpenses: number;
  totalCost: number;
  salePrice: number | null;
  grossProfit: number | null;
  hasSale: boolean;
  hasPurchase: boolean;
  saleChannel: string | null;
  saleDate: string | null;
}

export interface ProfitReportRow {
  _id: string;
  saleNumber: string;
  salePrice: number;
  saleDate: string;
  channel: string;
  vehicle: { stockNumber: string; make: string; model: string; year: number };
  purchasePrice: number;
  totalExpenses: number;
  totalCost: number;
  grossProfit: number;
}

export interface ProfitReport {
  items: ProfitReportRow[];
  totals: {
    count: number;
    totalRevenue: number;
    totalCost: number;
    totalGrossProfit: number;
  };
}