import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { normalizeError } from '@/shared/api/client';
import { vehiclesApi } from '../api/vehicles.api';
import type {
  CreateVehicleImageInput,
  CreateVehicleInput,
  UpdateVehicleInput,
  UpdateVehicleStatusInput,
  UpsertVehicleVideoInput,
  VehicleFilters,
} from '../api/vehicles.types';

/* ------------------------------------------------------------------ */
/* Query keys                                                          */
/* ------------------------------------------------------------------ */
export const vehicleKeys = {
  all: ['vehicles'] as const,

  publicList: (filters: VehicleFilters) =>
    [...vehicleKeys.all, 'public', 'list', filters] as const,
  publicDetail: (id: string) =>
    [...vehicleKeys.all, 'public', 'detail', id] as const,

  images: (vehicleId: string) =>
    [...vehicleKeys.all, 'images', vehicleId] as const,
  video: (vehicleId: string) =>
    [...vehicleKeys.all, 'video', vehicleId] as const,

  staffList: (filters: VehicleFilters) =>
    [...vehicleKeys.all, 'staff', 'list', filters] as const,
  staffDetail: (id: string) =>
    [...vehicleKeys.all, 'staff', 'detail', id] as const,

  profit: (id: string) => [...vehicleKeys.all, 'profit', id] as const,
  report: (params: { dateFrom?: string; dateTo?: string }) =>
    [...vehicleKeys.all, 'report', params] as const,
};

/* ------------------------------------------------------------------ */
/* Public queries                                                      */
/* ------------------------------------------------------------------ */
export function usePublicVehicles(filters: VehicleFilters = {}) {
  return useQuery({
    queryKey: vehicleKeys.publicList(filters),
    queryFn: () => vehiclesApi.listPublic(filters),
  });
}

export function usePublicVehicle(id: string | undefined) {
  return useQuery({
    queryKey: vehicleKeys.publicDetail(id ?? ''),
    queryFn: () => vehiclesApi.getPublic(id!),
    enabled: Boolean(id),
  });
}

export function useVehicleImages(vehicleId: string | undefined) {
  return useQuery({
    queryKey: vehicleKeys.images(vehicleId ?? ''),
    queryFn: () => vehiclesApi.listImages(vehicleId!),
    enabled: Boolean(vehicleId),
  });
}

export function useVehicleVideo(vehicleId: string | undefined) {
  return useQuery({
    queryKey: vehicleKeys.video(vehicleId ?? ''),
    queryFn: () => vehiclesApi.getVideo(vehicleId!),
    enabled: Boolean(vehicleId),
  });
}

/* ------------------------------------------------------------------ */
/* Staff queries                                                       */
/* ------------------------------------------------------------------ */
export function useStaffVehicles(filters: VehicleFilters = {}) {
  return useQuery({
    queryKey: vehicleKeys.staffList(filters),
    queryFn: () => vehiclesApi.listStaff(filters),
  });
}

export function useStaffVehicle(id: string | undefined) {
  return useQuery({
    queryKey: vehicleKeys.staffDetail(id ?? ''),
    queryFn: () => vehiclesApi.getStaff(id!),
    enabled: Boolean(id),
  });
}

export function useVehicleProfit(id: string | undefined) {
  return useQuery({
    queryKey: vehicleKeys.profit(id ?? ''),
    queryFn: () => vehiclesApi.getProfit(id!),
    enabled: Boolean(id),
  });
}

export function useProfitReport(params: { dateFrom?: string; dateTo?: string } = {}) {
  return useQuery({
    queryKey: vehicleKeys.report(params),
    queryFn: () => vehiclesApi.getProfitReport(params),
  });
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

/** Invalidate every vehicle-related query after a mutation. */
function useInvalidateAll() {
  const qc = useQueryClient();
  return () =>
    qc.invalidateQueries({ queryKey: vehicleKeys.all });
}

export function useCreateVehicle() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (input: CreateVehicleInput) => vehiclesApi.create(input),
    onSuccess: (v) => {
      toast.success(`Vehicle ${v.stockNumber} created`);
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useUpdateVehicle(id: string) {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (input: UpdateVehicleInput) => vehiclesApi.update(id, input),
    onSuccess: () => {
      toast.success('Vehicle updated');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useChangeVehicleStatus(id: string) {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (input: UpdateVehicleStatusInput) =>
      vehiclesApi.changeStatus(id, input),
    onSuccess: () => {
      toast.success('Status updated');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function usePublishVehicle(id: string) {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: () => vehiclesApi.publish(id),
    onSuccess: () => {
      toast.success('Vehicle published');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useUnpublishVehicle(id: string) {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: () => vehiclesApi.unpublish(id),
    onSuccess: () => {
      toast.success('Vehicle unpublished');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useDeleteVehicle() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (id: string) => vehiclesApi.remove(id),
    onSuccess: () => {
      toast.success('Vehicle deleted');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

/* -------------------- Images -------------------- */

export function useAddVehicleImage(vehicleId: string) {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (input: CreateVehicleImageInput) =>
      vehiclesApi.addImage(vehicleId, input),
    onSuccess: () => {
      toast.success('Image added');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useAddVehicleImagesBulk(vehicleId: string) {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (images: CreateVehicleImageInput[]) =>
      vehiclesApi.addImagesBulk(vehicleId, images),
    onSuccess: (imgs) => {
      toast.success(`${imgs.length} images added`);
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useSetPrimaryImage(vehicleId: string) {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (imageId: string) => vehiclesApi.setPrimaryImage(imageId),
    onSuccess: () => {
      toast.success('Primary image updated');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useDeleteVehicleImage(vehicleId: string) {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (imageId: string) => vehiclesApi.deleteImage(imageId),
    onSuccess: () => {
      toast.success('Image deleted');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useReorderVehicleImages(vehicleId: string) {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (order: string[]) => vehiclesApi.reorderImages(vehicleId, order),
    onSuccess: () => invalidate(),
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

/* -------------------- Video -------------------- */

export function useUpsertVehicleVideo(vehicleId: string) {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (input: UpsertVehicleVideoInput) =>
      vehiclesApi.upsertVideo(vehicleId, input),
    onSuccess: () => {
      toast.success('Video saved');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useDeleteVehicleVideo(vehicleId: string) {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: () => vehiclesApi.deleteVideo(vehicleId),
    onSuccess: () => {
      toast.success('Video removed');
      invalidate();
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });
}