import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi } from '../services/api';

const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Actions
            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authApi.login({ email, password });
                    const { accessToken, refreshToken, user } = response.data.data;
                    
                    set({
                        user,
                        accessToken,
                        refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                    
                    return { success: true };
                } catch (error) {
                    const message = error.response?.data?.message || 'Login failed. Please try again.';
                    set({ isLoading: false, error: message });
                    return { success: false, error: message };
                }
            },

            signup: async (formData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authApi.signup(formData);
                    const { accessToken, refreshToken, user } = response.data.data;
                    
                    set({
                        user,
                        accessToken,
                        refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                    
                    return { success: true };
                } catch (error) {
                    const message = error.response?.data?.message || 'Signup failed. Please try again.';
                    set({ isLoading: false, error: message });
                    return { success: false, error: message };
                }
            },

            logout: () => {
                const { user } = get();
                if (user?.email) {
                    authApi.logout(user.email).catch(() => {});
                }
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            refreshAccessToken: async () => {
                const { refreshToken } = get();
                if (!refreshToken) {
                    get().logout();
                    return false;
                }

                try {
                    const response = await authApi.refreshToken(refreshToken);
                    const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = response.data.data;
                    
                    set({
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                        user,
                    });
                    
                    return true;
                } catch {
                    get().logout();
                    return false;
                }
            },

            clearError: () => set({ error: null }),

            updateUser: (userData) => {
                set((state) => ({
                    user: { ...state.user, ...userData }
                }));
            },
        }),
        {
            name: 'quickserve-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;
