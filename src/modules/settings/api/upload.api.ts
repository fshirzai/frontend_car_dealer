import { apiClient } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/api/types';

export interface UploadedFile {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  originalName?: string;
}

const postFile = async (
  endpoint: string,
  formData: FormData
): Promise<UploadedFile> => {
  const { data } = await apiClient.post<ApiResponse<UploadedFile>>(
    endpoint,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data.data;
};

export const uploadApi = {
  async logo(file: File): Promise<UploadedFile> {
    const fd = new FormData();
    fd.append('file', file);
    return postFile('/uploads/logo', fd);
  },

  async image(file: File): Promise<UploadedFile> {
    const fd = new FormData();
    fd.append('file', file);
    return postFile('/uploads/image', fd);
  },

  async images(files: File[]): Promise<UploadedFile[]> {
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    const { data } = await apiClient.post<ApiResponse<UploadedFile[]>>(
      '/uploads/images',
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data;
  },

  async video(file: File): Promise<UploadedFile> {
    const fd = new FormData();
    fd.append('file', file);
    return postFile('/uploads/video', fd);
  },

  async document(file: File): Promise<UploadedFile> {
    const fd = new FormData();
    fd.append('file', file);
    return postFile('/uploads/document', fd);
  },
};