import { create } from 'zustand';
import { adminApi } from '../services/api';

const useAdminStore = create((set, get) => ({
    // State
    dashboardStats: null,
    users: [],
    providers: [],
    bookings: [],
    selectedUser: null,
    selectedProvider: null,
    selectedBooking: null,
    
    // Pagination
    usersPagination: { page: 0, totalPages: 0, totalElements: 0 },
    providersPagination: { page: 0, totalPages: 0, totalElements: 0 },
    bookingsPagination: { page: 0, totalPages: 0, totalElements: 0 },
    
    // Loading states
    isLoading: false,
    isLoadingUsers: false,
    isLoadingProviders: false,
    isLoadingBookings: false,
    
    error: null,

    // Dashboard Actions
    fetchDashboardStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await adminApi.getDashboardStats();
            set({ dashboardStats: response.data.data, isLoading: false });
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch dashboard stats';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    // User Management Actions
    fetchUsers: async (params = {}) => {
        set({ isLoadingUsers: true, error: null });
        try {
            const response = await adminApi.getUsers(params);
            const data = response.data.data;
            set({ 
                users: data.content || [],
                usersPagination: {
                    page: data.number || 0,
                    totalPages: data.totalPages || 0,
                    totalElements: data.totalElements || 0
                },
                isLoadingUsers: false 
            });
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch users';
            set({ error: message, isLoadingUsers: false });
            throw error;
        }
    },

    fetchUserById: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await adminApi.getUserById(userId);
            set({ selectedUser: response.data.data, isLoading: false });
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch user';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    updateUserStatus: async (userId, status, reason) => {
        set({ isLoading: true, error: null });
        try {
            const response = await adminApi.updateUserStatus(userId, { status, reason });
            // Update user in list
            set(state => ({
                users: state.users.map(u => u.id === userId ? response.data.data : u),
                selectedUser: response.data.data,
                isLoading: false
            }));
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update user status';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    deleteUser: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            await adminApi.deleteUser(userId);
            set(state => ({
                users: state.users.filter(u => u.id !== userId),
                isLoading: false
            }));
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete user';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    // Provider Management Actions
    fetchProviders: async (params = {}) => {
        set({ isLoadingProviders: true, error: null });
        try {
            const response = await adminApi.getProviders(params);
            const data = response.data.data;
            set({ 
                providers: data.content || [],
                providersPagination: {
                    page: data.number || 0,
                    totalPages: data.totalPages || 0,
                    totalElements: data.totalElements || 0
                },
                isLoadingProviders: false 
            });
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch providers';
            set({ error: message, isLoadingProviders: false });
            throw error;
        }
    },

    fetchProviderById: async (providerId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await adminApi.getProviderById(providerId);
            set({ selectedProvider: response.data.data, isLoading: false });
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch provider';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    verifyProvider: async (providerId, verified, notes) => {
        set({ isLoading: true, error: null });
        try {
            const response = await adminApi.verifyProvider(providerId, { verified, notes });
            set(state => ({
                providers: state.providers.map(p => p.id === providerId ? response.data.data : p),
                selectedProvider: response.data.data,
                isLoading: false
            }));
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to verify provider';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    updateProviderStatus: async (providerId, status, reason) => {
        set({ isLoading: true, error: null });
        try {
            const response = await adminApi.updateProviderStatus(providerId, { status, reason });
            set(state => ({
                providers: state.providers.map(p => p.id === providerId ? response.data.data : p),
                selectedProvider: response.data.data,
                isLoading: false
            }));
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update provider status';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    // Booking Management Actions
    fetchBookings: async (params = {}) => {
        set({ isLoadingBookings: true, error: null });
        try {
            const response = await adminApi.getBookings(params);
            const data = response.data.data;
            set({ 
                bookings: data.content || [],
                bookingsPagination: {
                    page: data.number || 0,
                    totalPages: data.totalPages || 0,
                    totalElements: data.totalElements || 0
                },
                isLoadingBookings: false 
            });
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch bookings';
            set({ error: message, isLoadingBookings: false });
            throw error;
        }
    },

    fetchBookingById: async (bookingId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await adminApi.getBookingById(bookingId);
            set({ selectedBooking: response.data.data, isLoading: false });
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch booking';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    updateBookingStatus: async (bookingId, status, notes) => {
        set({ isLoading: true, error: null });
        try {
            const response = await adminApi.updateBookingStatus(bookingId, { status, notes });
            set(state => ({
                bookings: state.bookings.map(b => b.id === bookingId ? response.data.data : b),
                selectedBooking: response.data.data,
                isLoading: false
            }));
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update booking status';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    // Clear selections
    clearSelectedUser: () => set({ selectedUser: null }),
    clearSelectedProvider: () => set({ selectedProvider: null }),
    clearSelectedBooking: () => set({ selectedBooking: null }),
    clearError: () => set({ error: null }),
    
    // Reset store
    clearData: () => set({
        dashboardStats: null,
        users: [],
        providers: [],
        bookings: [],
        selectedUser: null,
        selectedProvider: null,
        selectedBooking: null,
        error: null
    })
}));

export default useAdminStore;
