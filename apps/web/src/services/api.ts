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

