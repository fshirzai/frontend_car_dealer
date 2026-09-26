import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { ENDPOINTS } from './endpoints';
import type { ApiErrorPayload } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'https://car-dealer-backend-laab.onrender.com/api/v1/';

/* ------------------------------------------------------------------ */
/* Main API client                                                     */
/* ------------------------------------------------------------------ */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json' },
});

/* ------------------------------------------------------------------ */
/* Request interceptor — attach access token                           */
/* ------------------------------------------------------------------ */
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ------------------------------------------------------------------ */
/* Response interceptor — refresh on 401, then retry                   */
/* ------------------------------------------------------------------ */
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

const flushQueue = (token: string | null) => {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Don't try to refresh on the auth endpoints themselves
    const isAuthEndpoint =
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/register') ||
      original?.url?.includes('/auth/refresh');

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !isAuthEndpoint
    ) {
      const { refreshToken, setTokens, clearAuth } = useAuthStore.getState();

      if (!refreshToken) {
        clearAuth();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request until the ongoing refresh finishes
        return new Promise((resolve) => {
          pendingQueue.push((token) => {
            if (token) {
              original.headers.Authorization = `Bearer ${token}`;
              original._retry = true;
              resolve(apiClient(original));
            } else {
              resolve(Promise.reject(error));
            }
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${API_URL}${ENDPOINTS.auth.refresh}`,
          { refreshToken }
        );

        const newAccess = data.data.tokens.accessToken as string;
        const newRefresh = data.data.tokens.refreshToken as string;

        setTokens({ accessToken: newAccess, refreshToken: newRefresh });
        flushQueue(newAccess);

        original.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(original);
      } catch (refreshError) {
        flushQueue(null);
        clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/* ------------------------------------------------------------------ */
/* Helper to normalise errors for UI consumption                       */
/* ------------------------------------------------------------------ */
export interface NormalizedError {
  message: string;
  statusCode?: number;
  fields?: { field: string; message: string }[];
}

export function normalizeError(error: unknown): NormalizedError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorPayload | undefined;
    if (data) {
      return {
        message: data.message || 'Something went wrong',
        statusCode: data.statusCode,
        fields: data.errors,
      };
    }
    return { message: error.message || 'Network error' };
  }
  if (error instanceof Error) return { message: error.message };
  return { message: 'Unknown error' };
}