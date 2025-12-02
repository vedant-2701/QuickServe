import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage (zustand persists there)
        const authData = localStorage.getItem('quickserve-auth');
        if (authData) {
            try {
                const { state } = JSON.parse(authData);
                if (state?.accessToken) {
                    config.headers.Authorization = `Bearer ${state.accessToken}`;
                }
            } catch (e) {
                console.error('Error parsing auth data:', e);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const authData = localStorage.getItem('quickserve-auth');
                if (authData) {
                    const { state } = JSON.parse(authData);
                    if (state?.refreshToken) {
                        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                            refreshToken: state.refreshToken,
                        });

                        const { accessToken, refreshToken } = response.data.data;

                        // Update stored tokens
                        const newState = {
                            ...state,
                            accessToken,
                            refreshToken,
                        };
                        localStorage.setItem('quickserve-auth', JSON.stringify({ state: newState }));

                        // Retry original request with new token
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Refresh failed, clear auth and redirect to login
                localStorage.removeItem('quickserve-auth');
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (data) => api.post('/auth/signup', data),
    logout: (email) => api.post('/auth/logout', { email }),
    refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
    verifyToken: () => api.get('/auth/me'),
};

// Provider API
export const providerApi = {
    getProfile: () => api.get('/provider/profile'),
    updateProfile: (data) => api.put('/provider/profile', data),
    getStats: () => api.get('/provider/stats'),
    getBookings: () => api.get('/provider/bookings'),
    updateAvailability: (available) => api.patch('/provider/availability', { available }),
};

// Services API
export const servicesApi = {
    getCategories: () => api.get('/public/services/categories'),
    searchProviders: (params) => api.get('/public/providers', { params }),
};

export default api;
