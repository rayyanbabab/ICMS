import { ApiResponse } from '@icms/shared';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export class ApiError extends Error {
  statusCode: number;
  errors?: string[];

  constructor(message: string, statusCode: number, errors?: string[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'ApiError';
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('icms_access_token');
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  });

  const data: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    statusCode: response.status,
    message: response.statusText,
    data: null as any,
    timestamp: new Date().toISOString(),
  }));

  if (!response.ok || !data.success) {
    throw new ApiError(data.message || 'Request failed', data.statusCode || response.status, data.errors);
  }

  return data;
}

export const api = {
  get: async <T = any>(endpoint: string, config?: { params?: Record<string, any> }): Promise<ApiResponse<T>> => {
    let url = endpoint;
    if (config?.params) {
      const sp = new URLSearchParams();
      Object.entries(config.params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          sp.append(k, String(v));
        }
      });
      const qs = sp.toString();
      if (qs) url += (url.includes('?') ? '&' : '?') + qs;
    }
    return apiRequest<T>(url, { method: 'GET' });
  },
  post: async <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  patch: async <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  delete: async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, { method: 'DELETE' });
  },
};

