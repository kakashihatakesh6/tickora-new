const BASE_URL = '/api/v1'; // Use Next.js rewrites to avoid CORS

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

interface ApiError extends Error {
  response?: ApiResponse;
}

const api = {
  request: async <T = any>(method: string, endpoint: string, body?: any): Promise<ApiResponse<T>> => {
    const url = `${BASE_URL}${endpoint}`;
    
    // Get token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      const response = await fetch(url, config);
      
      let data: any;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      const result: ApiResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };

      if (!response.ok) {
        // Handle 401
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            // window.location.href = '/login'; // Optional: Redirect
          }
        }

        const error = new Error(data?.message || 'API Error') as ApiError;
        error.response = result;
        throw error;
      }

      return result;
    } catch (error: any) {
        // Re-throw if it's already our custom error
        if (error.response) {
            // Log for debugging similar to previous interceptor
            console.error('API Error:', {
                url,
                method,
                status: error.response.status,
                data: error.response.data,
                message: error.message
            });
            throw error;
        }

        // Handle network errors or other fetch failures
        console.error('API Network Error:', error);
        throw error;
    }
  },

  get: <T = any>(endpoint: string) => api.request<T>('GET', endpoint),
  post: <T = any>(endpoint: string, body: any) => api.request<T>('POST', endpoint, body),
  put: <T = any>(endpoint: string, body: any) => api.request<T>('PUT', endpoint, body),
  delete: <T = any>(endpoint: string) => api.request<T>('DELETE', endpoint),
  patch: <T = any>(endpoint: string, body: any) => api.request<T>('PATCH', endpoint, body),
};

export default api;
