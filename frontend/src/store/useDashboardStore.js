import { create } from 'zustand';
import { providerApi } from '../services/api';

const useDashboardStore = create((set, get) => ({
    // State
    stats: null,
    profile: null,
    services: [],
    bookings: [],
    upcomingBookings: [],
    isLoading: false,
    error: null,

    // Dashboard Stats
    fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await providerApi.getStats();
            set({ stats: response.data.data, isLoading: false });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch stats';
            set({ isLoading: false, error: message });
            return { success: false, error: message };
        }
    },

    // Profile
    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await providerApi.getProfile();
            set({ profile: response.data.data, isLoading: false });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch profile';
            set({ isLoading: false, error: message });
            return { success: false, error: message };
        }
    },

    updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await providerApi.updateProfile(profileData);
            set({ profile: response.data.data, isLoading: false });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update profile';
            set({ isLoading: false, error: message });
            return { success: false, error: message };
        }
    },

    updateAvailability: async (available) => {
        try {
            await providerApi.updateAvailability(available);
            // Update local state
            const profile = get().profile;
            if (profile) {
                set({ profile: { ...profile, isAvailable: available } });
            }
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update availability';
            return { success: false, error: message };
        }
    },

    // Services
    fetchServices: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await providerApi.getServices();
            set({ services: response.data.data, isLoading: false });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch services';
            set({ isLoading: false, error: message });
            return { success: false, error: message };
        }
    },

    createService: async (serviceData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await providerApi.createService(serviceData);
            const newService = response.data.data;
            set(state => ({
                services: [newService, ...state.services],
                isLoading: false
            }));
            return { success: true, data: newService };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create service';
            set({ isLoading: false, error: message });
            return { success: false, error: message };
        }
    },

    updateService: async (serviceId, serviceData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await providerApi.updateService(serviceId, serviceData);
            const updatedService = response.data.data;
            set(state => ({
                services: state.services.map(s => 
                    s.id === serviceId ? updatedService : s
                ),
                isLoading: false
            }));
            return { success: true, data: updatedService };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update service';
            set({ isLoading: false, error: message });
            return { success: false, error: message };
        }
    },

    deleteService: async (serviceId) => {
        set({ isLoading: true, error: null });
        try {
            await providerApi.deleteService(serviceId);
            set(state => ({
                services: state.services.filter(s => s.id !== serviceId),
                isLoading: false
            }));
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete service';
            set({ isLoading: false, error: message });
            return { success: false, error: message };
        }
    },

    toggleServiceStatus: async (serviceId) => {
        try {
            await providerApi.toggleServiceStatus(serviceId);
            set(state => ({
                services: state.services.map(s => 
                    s.id === serviceId ? { ...s, active: !s.active } : s
                )
            }));
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to toggle service status';
            return { success: false, error: message };
        }
    },

    // Bookings
    fetchBookings: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await providerApi.getBookings();
            set({ bookings: response.data.data, isLoading: false });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch bookings';
            set({ isLoading: false, error: message });
            return { success: false, error: message };
        }
    },

    fetchUpcomingBookings: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await providerApi.getUpcomingBookings();
            set({ upcomingBookings: response.data.data, isLoading: false });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch upcoming bookings';
            set({ isLoading: false, error: message });
            return { success: false, error: message };
        }
    },

    updateBookingStatus: async (bookingId, status, cancellationReason = null) => {
        set({ isLoading: true, error: null });
        try {
            const response = await providerApi.updateBookingStatus(bookingId, { 
                status, 
                cancellationReason 
            });
            const updatedBooking = response.data.data;
            set(state => ({
                bookings: state.bookings.map(b => 
                    b.id === bookingId ? updatedBooking : b
                ),
                upcomingBookings: state.upcomingBookings.map(b => 
                    b.id === bookingId ? updatedBooking : b
                ).filter(b => !['completed', 'cancelled'].includes(b.status)),
                isLoading: false
            }));
            return { success: true, data: updatedBooking };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update booking status';
            set({ isLoading: false, error: message });
            return { success: false, error: message };
        }
    },

    // Load all dashboard data
    fetchDashboardData: async () => {
        set({ isLoading: true, error: null });
        try {
            const [statsRes, profileRes, servicesRes, bookingsRes, upcomingRes] = await Promise.all([
                providerApi.getStats(),
                providerApi.getProfile(),
                providerApi.getServices(),
                providerApi.getBookings(),
                providerApi.getUpcomingBookings(),
            ]);

            set({
                stats: statsRes.data.data,
                profile: profileRes.data.data,
                services: servicesRes.data.data,
                bookings: bookingsRes.data.data,
                upcomingBookings: upcomingRes.data.data,
                isLoading: false,
            });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch dashboard data';
            set({ isLoading: false, error: message });
            return { success: false, error: message };
        }
    },

    // Clear all data (on logout)
    clearData: () => {
        set({
            stats: null,
            profile: null,
            services: [],
            bookings: [],
            upcomingBookings: [],
            isLoading: false,
            error: null,
        });
    },

    clearError: () => set({ error: null }),
}));

export default useDashboardStore;
