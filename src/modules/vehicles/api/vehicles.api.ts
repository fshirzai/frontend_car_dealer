import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse, PaginatedResponse } from '@/shared/api/types';
import type {
  CreateVehicleImageInput,
  CreateVehicleInput,
  ProfitReport,
  PublicVehicle,
  StaffVehicle,
  UpdateVehicleInput,
  UpdateVehicleStatusInput,
  UpsertVehicleVideoInput,
  VehicleFilters,
  VehicleImage,
  VehicleProfit,
  VehicleVideo,
} from './vehicles.types';

export const vehiclesApi = {
  /* -------------------- Public -------------------- */
  async listPublic(
    filters: VehicleFilters = {}
  ): Promise<PaginatedResponse<PublicVehicle>> {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<PublicVehicle>>
    >(ENDPOINTS.vehicles.publicList, { params: filters });
    return data.data;
  },

  async getPublic(id: string): Promise<PublicVehicle> {
    const { data } = await apiClient.get<ApiResponse<PublicVehicle>>(
      ENDPOINTS.vehicles.publicById(id)
    );
    return data.data;
  },

  async listImages(vehicleId: string): Promise<VehicleImage[]> {
    const { data } = await apiClient.get<ApiResponse<VehicleImage[]>>(
      ENDPOINTS.vehicles.images(vehicleId)
    );
    return data.data;
  },

  async getVideo(vehicleId: string): Promise<VehicleVideo | null> {
    const { data } = await apiClient.get<ApiResponse<VehicleVideo | null>>(
      ENDPOINTS.vehicles.video(vehicleId)
    );
    return data.data;
  },

  /* -------------------- Staff -------------------- */
  async listStaff(
    filters: VehicleFilters = {}
  ): Promise<PaginatedResponse<StaffVehicle>> {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<StaffVehicle>>
    >(ENDPOINTS.vehicles.staffList, { params: filters });
    return data.data;
  },

  async getStaff(id: string): Promise<StaffVehicle> {
    const { data } = await apiClient.get<ApiResponse<StaffVehicle>>(
      ENDPOINTS.vehicles.staffById(id)
    );
    return data.data;
  },

  async create(input: CreateVehicleInput): Promise<StaffVehicle> {
    const { data } = await apiClient.post<ApiResponse<StaffVehicle>>(
      ENDPOINTS.vehicles.staffCreate,
      input
    );
    return data.data;
  },

  async update(id: string, input: UpdateVehicleInput): Promise<StaffVehicle> {
    const { data } = await apiClient.patch<ApiResponse<StaffVehicle>>(
      ENDPOINTS.vehicles.staffById(id),
      input
    );
    return data.data;
  },

  async changeStatus(
    id: string,
    input: UpdateVehicleStatusInput
  ): Promise<StaffVehicle> {
    const { data } = await apiClient.patch<ApiResponse<StaffVehicle>>(
      ENDPOINTS.vehicles.staffStatus(id),
      input
    );
    return data.data;
  },

  async publish(id: string): Promise<StaffVehicle> {
    const { data } = await apiClient.patch<ApiResponse<StaffVehicle>>(
      ENDPOINTS.vehicles.staffPublish(id)
    );
    return data.data;
  },

  async unpublish(id: string): Promise<StaffVehicle> {
    const { data } = await apiClient.patch<ApiResponse<StaffVehicle>>(
      ENDPOINTS.vehicles.staffUnpublish(id)
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.vehicles.staffById(id));
  },

  /* -------------------- Images (staff) -------------------- */
  async addImage(
    vehicleId: string,
    input: CreateVehicleImageInput
  ): Promise<VehicleImage> {
    const { data } = await apiClient.post<ApiResponse<VehicleImage>>(
      ENDPOINTS.vehicles.createImage(vehicleId),
      input
    );
    return data.data;
  },

  async addImagesBulk(
    vehicleId: string,
    images: CreateVehicleImageInput[]
  ): Promise<VehicleImage[]> {
    const { data } = await apiClient.post<ApiResponse<VehicleImage[]>>(
      ENDPOINTS.vehicles.bulkImages(vehicleId),
      { images }
    );
    return data.data;
  },

  async updateImage(
    imageId: string,
    input: Partial<CreateVehicleImageInput>
  ): Promise<VehicleImage> {
    const { data } = await apiClient.patch<ApiResponse<VehicleImage>>(
      ENDPOINTS.vehicles.updateImage(imageId),
      input
    );
    return data.data;
  },

  async setPrimaryImage(imageId: string): Promise<VehicleImage> {
    const { data } = await apiClient.patch<ApiResponse<VehicleImage>>(
      ENDPOINTS.vehicles.setPrimaryImage(imageId)
    );
    return data.data;
  },

  async deleteImage(imageId: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.vehicles.deleteImage(imageId));
  },

  async reorderImages(
    vehicleId: string,
    order: string[]
  ): Promise<VehicleImage[]> {
    const { data } = await apiClient.patch<ApiResponse<VehicleImage[]>>(
      ENDPOINTS.vehicles.reorderImages(vehicleId),
      { order }
    );
    return data.data;
  },

  /* -------------------- Video (staff) -------------------- */
  async upsertVideo(
    vehicleId: string,
    input: UpsertVehicleVideoInput
  ): Promise<VehicleVideo> {
    const { data } = await apiClient.put<ApiResponse<VehicleVideo>>(
      ENDPOINTS.vehicles.upsertVideo(vehicleId),
      input
    );
    return data.data;
  },

  async deleteVideo(vehicleId: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.vehicles.deleteVideo(vehicleId));
  },

  /* -------------------- Profit -------------------- */
  async getProfit(id: string): Promise<VehicleProfit> {
    const { data } = await apiClient.get<ApiResponse<VehicleProfit>>(
      ENDPOINTS.vehicles.staffProfit(id)
    );
    return data.data;
  },

  async getProfitReport(params: {
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<ProfitReport> {
    const { data } = await apiClient.get<ApiResponse<ProfitReport>>(
      ENDPOINTS.vehicles.staffReport,
      { params }
    );
    return data.data;
  },
};