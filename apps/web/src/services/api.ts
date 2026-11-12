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
  const activeRole = localStorage.getItem('icms_active_role');
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (activeRole && !headers.has('X-Active-Role')) {
    headers.set('X-Active-Role', activeRole);
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
      ...options,
      headers,
    });
  } catch (netErr: any) {
    throw new ApiError(
      'Gagal terhubung ke server ICMS. Mohon periksa koneksi internet Anda atau coba muat ulang halaman.',
      0,
    );
  }

  let data: ApiResponse<T>;
  try {
    data = await response.json();
  } catch {
    const fallbackMessage =
      response.status === 429
        ? 'Terlalu banyak percobaan masuk. Mohon tunggu 1 menit lalu coba kembali.'
        : response.status >= 500
        ? 'Layanan server sedang bersiap (cold start). Silakan coba lagi beberapa detik lagi.'
        : response.statusText || 'Gagal memproses respons dari server.';
    data = {
      success: false,
      statusCode: response.status,
      message: fallbackMessage,
      data: null as any,
      timestamp: new Date().toISOString(),
    };
  }

  if (!response.ok || !data.success) {
    const defaultMsg =
      response.status === 401
        ? 'Kredensial tidak valid. Silakan periksa kembali email atau username dan password Anda.'
        : response.status === 403
        ? 'Akses ditolak: Akun Anda tidak memiliki izin untuk fitur ini.'
        : response.status === 429
        ? 'Terlalu banyak percobaan masuk. Mohon tunggu 1 menit lalu coba kembali.'
        : 'Permintaan gagal diproses. Silakan coba beberapa saat lagi.';

    throw new ApiError(data.message || defaultMsg, data.statusCode || response.status, data.errors);
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
