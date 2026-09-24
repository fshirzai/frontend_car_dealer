export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginatedMeta;
}

export interface ApiErrorField {
  field: string;
  message: string;
}

export interface ApiErrorPayload {
  success: false;
  statusCode: number;
  message: string;
  errors?: ApiErrorField[];
}