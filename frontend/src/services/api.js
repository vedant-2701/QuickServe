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
    signupCustomer: (data) => api.post('/auth/signup/customer', data),
    logout: (email) => api.post('/auth/logout', { email }),
    refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
    verifyToken: () => api.get('/auth/me'),
};

// Provider API
export const providerApi = {
    // Dashboard
    getStats: () => api.get('/provider/stats'),
    
    // Profile
    getProfile: () => api.get('/provider/profile'),
    updateProfile: (data) => api.put('/provider/profile', data),
    updateAvailability: (available) => api.patch('/provider/availability', { available }),
    
    // Services
    getServices: () => api.get('/provider/services'),
    createService: (data) => api.post('/provider/services', data),
    updateService: (serviceId, data) => api.put(`/provider/services/${serviceId}`, data),
    deleteService: (serviceId) => api.delete(`/provider/services/${serviceId}`),
    toggleServiceStatus: (serviceId) => api.patch(`/provider/services/${serviceId}/toggle`),
    
    // Bookings
    getBookings: () => api.get('/provider/bookings'),
    getUpcomingBookings: () => api.get('/provider/bookings/upcoming'),
    updateBookingStatus: (bookingId, data) => api.patch(`/provider/bookings/${bookingId}/status`, data),
};

// Customer API
export const customerApi = {
    // Profile
    getProfile: () => api.get('/customer/profile'),
    updateProfile: (data) => api.put('/customer/profile', data),
    
    // Bookings
    createBooking: (data) => api.post('/customer/bookings', data),
    getBookings: () => api.get('/customer/bookings'),
    getUpcomingBookings: () => api.get('/customer/bookings/upcoming'),
    getPastBookings: () => api.get('/customer/bookings/past'),
    getBookingById: (bookingId) => api.get(`/customer/bookings/${bookingId}`),
    cancelBooking: (bookingId, reason) => api.post(`/customer/bookings/${bookingId}/cancel`, { reason }),
    
    // Reviews
    createReview: (data) => api.post('/customer/reviews', data),
    getMyReviews: () => api.get('/customer/reviews'),
    
    // Saved Addresses
    getSavedAddresses: () => api.get('/customer/addresses'),
    addSavedAddress: (data) => api.post('/customer/addresses', data),
    updateSavedAddress: (addressId, data) => api.put(`/customer/addresses/${addressId}`, data),
    deleteSavedAddress: (addressId) => api.delete(`/customer/addresses/${addressId}`),
    setDefaultAddress: (addressId) => api.patch(`/customer/addresses/${addressId}/default`),
};

// Public API (no auth required)
export const publicApi = {
    // Categories
    getCategories: () => api.get('/public/categories'),
    
    // Providers
    searchProviders: (params) => api.get('/public/providers', { params }),
    getProviderDetails: (providerId) => api.get(`/public/providers/${providerId}`),
    getProviderReviews: (providerId, page = 0, size = 10) => 
        api.get(`/public/providers/${providerId}/reviews`, { params: { page, size } }),
};

// Services API (legacy - use publicApi instead)
export const servicesApi = {
    getCategories: () => api.get('/public/categories'),
    searchProviders: (params) => api.get('/public/providers', { params }),
};

export default api;
