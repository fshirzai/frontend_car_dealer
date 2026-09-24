import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { normalizeError } from '@/shared/api/client';
import { uploadApi } from '../api/upload.api';

export function useUploadLogo() {
  return useMutation({
    mutationFn: (file: File) => uploadApi.logo(file),
    onSuccess: () => toast.success('Logo uploaded'),
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadApi.image(file),
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useUploadImages() {
  return useMutation({
    mutationFn: (files: File[]) => uploadApi.images(files),
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useUploadVideo() {
  return useMutation({
    mutationFn: (file: File) => uploadApi.video(file),
    onSuccess: () => toast.success('Video uploaded'),
    onError: (err) => toast.error(normalizeError(err).message),
  });
}

export function useUploadDocument() {
  return useMutation({
    mutationFn: (file: File) => uploadApi.document(file),
    onSuccess: () => toast.success('Document uploaded'),
    onError: (err) => toast.error(normalizeError(err).message),
  });
}