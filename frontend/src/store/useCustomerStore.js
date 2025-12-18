import { create } from 'zustand';
import { customerApi, publicApi } from '../services/api';

const useCustomerStore = create((set, get) => ({
    // Profile state
    profile: null,
    
    // Bookings state
    bookings: [],
    upcomingBookings: [],
    pastBookings: [],
    
    // Providers/Services state
    categories: [],
    providers: [],
    selectedProvider: null,
    
    // Saved addresses
    savedAddresses: [],
    
    // Reviews
    myReviews: [],
    
    // Loading states
    isLoading: false,
    isLoadingProfile: false,
    isLoadingBookings: false,
    isLoadingProviders: false,
    
    // Error state
    error: null,

    // ==================== PROFILE ====================
    
    fetchProfile: async () => {
        set({ isLoadingProfile: true, error: null });
        try {
            const response = await customerApi.getProfile();
            set({ profile: response.data.data, isLoadingProfile: false });
            return response.data.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch profile',
                isLoadingProfile: false 
            });
            throw error;
        }
    },

    updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await customerApi.updateProfile(data);
            set({ profile: response.data.data, isLoading: false });
            return response.data.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to update profile',
                isLoading: false 
            });
            throw error;
        }
    },

    // ==================== BOOKINGS ====================
    
    fetchBookings: async () => {
        set({ isLoadingBookings: true, error: null });
        try {
            const response = await customerApi.getBookings();
            set({ bookings: response.data.data, isLoadingBookings: false });
            return response.data.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch bookings',
                isLoadingBookings: false 
            });
            throw error;
        }
    },

    fetchUpcomingBookings: async () => {
        set({ isLoadingBookings: true, error: null });
        try {
            const response = await customerApi.getUpcomingBookings();
            set({ upcomingBookings: response.data.data, isLoadingBookings: false });
            return response.data.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch upcoming bookings',
                isLoadingBookings: false 
            });
            throw error;
        }
    },

    fetchPastBookings: async () => {
        set({ isLoadingBookings: true, error: null });
        try {
            const response = await customerApi.getPastBookings();
            set({ pastBookings: response.data.data, isLoadingBookings: false });
            return response.data.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch past bookings',
                isLoadingBookings: false 
            });
            throw error;
        }
    },

    createBooking: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await customerApi.createBooking(data);
            const newBooking = response.data.data;
            set(state => ({ 
                bookings: [newBooking, ...state.bookings],
                upcomingBookings: [newBooking, ...state.upcomingBookings],
                isLoading: false 
            }));
            return newBooking;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to create booking',
                isLoading: false 
            });
            throw error;
        }
    },

    cancelBooking: async (bookingId, reason) => {
        set({ isLoading: true, error: null });
        try {
            const response = await customerApi.cancelBooking(bookingId, reason);
            const updatedBooking = response.data.data;
            set(state => ({
                bookings: state.bookings.map(b => 
                    b.id === bookingId ? updatedBooking : b
                ),
                upcomingBookings: state.upcomingBookings.filter(b => b.id !== bookingId),
                pastBookings: [updatedBooking, ...state.pastBookings],
                isLoading: false
            }));
            return updatedBooking;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to cancel booking',
                isLoading: false 
            });
            throw error;
        }
    },

    // ==================== PROVIDERS/SERVICES ====================
    
    fetchCategories: async () => {
        try {
            const response = await publicApi.getCategories();
            set({ categories: response.data.data });
            return response.data.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch categories' });
            throw error;
        }
    },

    searchProviders: async (params) => {
        set({ isLoadingProviders: true, error: null });
        try {
            const response = await publicApi.searchProviders(params);
            set({ providers: response.data.data, isLoadingProviders: false });
            return response.data.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to search providers',
                isLoadingProviders: false 
            });
            throw error;
        }
    },

    fetchProviderDetails: async (providerId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await publicApi.getProviderDetails(providerId);
            set({ selectedProvider: response.data.data, isLoading: false });
            return response.data.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch provider details',
                isLoading: false 
            });
            throw error;
        }
    },

    clearSelectedProvider: () => set({ selectedProvider: null }),

    // ==================== SAVED ADDRESSES ====================
    
    fetchSavedAddresses: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await customerApi.getSavedAddresses();
            set({ savedAddresses: response.data.data, isLoading: false });
            return response.data.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch addresses',
                isLoading: false 
            });
            throw error;
        }
    },

    addSavedAddress: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await customerApi.addSavedAddress(data);
            const newAddress = response.data.data;
            set(state => ({ 
                savedAddresses: [...state.savedAddresses, newAddress],
                isLoading: false 
            }));
            return newAddress;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to add address',
                isLoading: false 
            });
            throw error;
        }
    },

    updateSavedAddress: async (addressId, data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await customerApi.updateSavedAddress(addressId, data);
            const updatedAddress = response.data.data;
            set(state => ({
                savedAddresses: state.savedAddresses.map(a => 
                    a.id === addressId ? updatedAddress : a
                ),
                isLoading: false
            }));
            return updatedAddress;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to update address',
                isLoading: false 
            });
            throw error;
        }
    },

    deleteSavedAddress: async (addressId) => {
        set({ isLoading: true, error: null });
        try {
            await customerApi.deleteSavedAddress(addressId);
            set(state => ({
                savedAddresses: state.savedAddresses.filter(a => a.id !== addressId),
                isLoading: false
            }));
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to delete address',
                isLoading: false 
            });
            throw error;
        }
    },

    setDefaultAddress: async (addressId) => {
        set({ isLoading: true, error: null });
        try {
            await customerApi.setDefaultAddress(addressId);
            set(state => ({
                savedAddresses: state.savedAddresses.map(a => ({
                    ...a,
                    isDefault: a.id === addressId
                })),
                isLoading: false
            }));
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to set default address',
                isLoading: false 
            });
            throw error;
        }
    },

    // ==================== REVIEWS ====================
    
    createReview: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await customerApi.createReview(data);
            const newReview = response.data.data;
            set(state => ({
                myReviews: [newReview, ...state.myReviews],
                // Update booking to show it has been reviewed
                bookings: state.bookings.map(b => 
                    b.id === data.bookingId ? { ...b, hasReview: true, reviewRating: data.rating } : b
                ),
                pastBookings: state.pastBookings.map(b => 
                    b.id === data.bookingId ? { ...b, hasReview: true, reviewRating: data.rating } : b
                ),
                isLoading: false
            }));
            return newReview;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to create review',
                isLoading: false 
            });
            throw error;
        }
    },

    fetchMyReviews: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await customerApi.getMyReviews();
            set({ myReviews: response.data.data, isLoading: false });
            return response.data.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch reviews',
                isLoading: false 
            });
            throw error;
        }
    },

    // ==================== UTILITY ====================
    
    clearError: () => set({ error: null }),
    
    clearData: () => set({
        profile: null,
        bookings: [],
        upcomingBookings: [],
        pastBookings: [],
        categories: [],
        providers: [],
        selectedProvider: null,
        savedAddresses: [],
        myReviews: [],
        error: null,
    }),
}));

export default useCustomerStore;
