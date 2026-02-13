const BASE_URL = '/api/v1'; // Use Next.js rewrites to avoid CORS

export interface ApiResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Headers;
}


const handleResponse = async <T = unknown>(response: Response): Promise<ApiResponse<T>> => {
    let data: unknown;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    const result: ApiResponse<T> = {
        data: data as T,
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

        const errorData = data as { error?: string, message?: string } | null;
        const error = new Error(errorData?.error || errorData?.message || 'API Error') as Error & { response?: ApiResponse<T> };
        error.response = result;

        console.error('API Error:', {
            url: response.url,
            status: response.status,
            data: data,
            message: error.message
        });

        throw error;
    }

    return result;
};

const api = {
    request: async <T = unknown>(method: string, endpoint: string, body?: unknown): Promise<ApiResponse<T>> => {
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
            return await handleResponse<T>(response);
        } catch (error: unknown) {
            // Handle network errors or other fetch failures
            const err = error as Error & { response?: ApiResponse<T> };
            if (!err.response) {
                console.error('API Network Error:', err);
            }
            throw err;
        }
    },

    get: <T = unknown>(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>) => {
        let queryString = '';
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, value.toString());
                }
            });
            queryString = searchParams.toString();
        }
        const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
        return api.request<T>('GET', fullEndpoint);
    },
    post: <T = unknown>(endpoint: string, body: unknown) => api.request<T>('POST', endpoint, body),
    put: <T = unknown>(endpoint: string, body: unknown) => api.request<T>('PUT', endpoint, body),
    delete: <T = unknown>(endpoint: string) => api.request<T>('DELETE', endpoint),
    patch: <T = unknown>(endpoint: string, body: unknown) => api.request<T>('PATCH', endpoint, body),
};


export default api;
