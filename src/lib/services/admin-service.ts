/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_URL}/api/admin`; // http://localhost:8080/api/admin

const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                // Redirect to login if unauthorized
                window.location.href = '/login?error=SessionExpired';
            }
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'API Error');
    }
    return response.json();
};

export const adminService = {
    getStats: async () => {
        const response = await fetch(`${BASE_URL}/stats`, {
            headers: getAuthHeaders(),
        });
        return handleResponse<any>(response);
    },

    getUsers: async () => {
        const response = await fetch(`${BASE_URL}/users`, {
            headers: getAuthHeaders(),
        });
        return handleResponse<any[]>(response);
    },

    deleteUser: async (id: number) => {
        const response = await fetch(`${BASE_URL}/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse<any>(response);
    },

    getMovies: async () => {
        const response = await fetch(`${BASE_URL}/movies`, {
            headers: getAuthHeaders(),
        });
        return handleResponse<any[]>(response);
    },

    createMovie: async (data: any) => {
        const response = await fetch(`${BASE_URL}/movies`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse<any>(response);
    },

    deleteMovie: async (id: number) => {
        const response = await fetch(`${BASE_URL}/movies/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse<any>(response);
    },

    getSports: async () => {
        const response = await fetch(`${BASE_URL}/sports`, {
            headers: getAuthHeaders(),
        });
        return handleResponse<any[]>(response);
    },

    createSport: async (data: any) => {
        const response = await fetch(`${BASE_URL}/sports`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse<any>(response);
    },

    deleteSport: async (id: number) => {
        const response = await fetch(`${BASE_URL}/sports/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse<any>(response);
    },

    getBookings: async () => {
        const response = await fetch(`${BASE_URL}/bookings`, {
            headers: getAuthHeaders(),
        });
        return handleResponse<any[]>(response);
    },

    cancelBooking: async (id: number) => {
        const response = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
            method: 'PUT',
            headers: getAuthHeaders(),
        });
        return handleResponse<any>(response);
    },

    getHeroImages: async () => {
        const response = await fetch(`${BASE_URL}/hero-images`, {
            headers: getAuthHeaders(),
        });
        return handleResponse<any[]>(response);
    },

    createHeroImage: async (data: any) => {
        const response = await fetch(`${BASE_URL}/hero-images`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse<any>(response);
    },

    deleteHeroImage: async (id: number) => {
        const response = await fetch(`${BASE_URL}/hero-images/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse<any>(response);
    },

    getEvents: async () => {
        const response = await fetch(`${BASE_URL}/events`, {
            headers: getAuthHeaders(),
        });
        return handleResponse<any[]>(response);
    },

    createEvent: async (data: any) => {
        const response = await fetch(`${BASE_URL}/events`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse<any>(response);
    },

    deleteEvent: async (id: number) => {
        const response = await fetch(`${BASE_URL}/events/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse<any>(response);
    },
};
