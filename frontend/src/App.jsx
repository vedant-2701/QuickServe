import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { INITIAL_SETTINGS } from "./data/mockData";

// Shared pages
import LandingPage from "./pages/LandingPage";
import AuthPages from "./pages/AuthPages";

// Service Provider pages and layouts
import ProviderSidebar from "./layouts/service-provider/ProviderSidebar";
import ProviderHeader from "./layouts/service-provider/ProviderHeader";
import ProviderDashboardView from "./pages/service-provider/DashboardView";
import ProviderBookingsView from "./pages/service-provider/BookingsView";
import ProviderServicesView from "./pages/service-provider/ServicesView";
import ProviderProfileView from "./pages/service-provider/ProfileView";
import ProviderSettingsView from "./pages/service-provider/SettingsView";

// Customer pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";

// Stores
import useAuthStore from "./store/useAuthStore";
import useDashboardStore from "./store/useDashboardStore";

// Loading spinner component
function LoadingSpinner({ message = "Loading..." }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-600 font-medium">{message}</p>
            </div>
        </div>
    );
}

// Protected route component
function ProtectedRoute({ children, allowedRole }) {
    const { user, isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (allowedRole && user?.role !== allowedRole) {
        // Redirect to appropriate dashboard based on role
        if (user?.role === 'CUSTOMER') {
            return <Navigate to="/customer" replace />;
        } else if (user?.role === 'SERVICE_PROVIDER') {
            return <Navigate to="/provider" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
}

// Auth page wrapper to handle routing
function AuthPageWrapper() {
    const { role } = useParams();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    };

    return <AuthPages selectedRole={role} onBack={handleBack} />;
}

// Service Provider Dashboard Layout
function ProviderDashboardLayout() {
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();
    const { 
        stats, 
        profile, 
        services, 
        bookings, 
        isLoading: dashboardLoading,
        fetchDashboardData,
        updateBookingStatus,
        toggleServiceStatus,
        deleteService,
        updateProfile,
        clearData
    } = useDashboardStore();
    
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [settings, setSettings] = useState(INITIAL_SETTINGS);

    // Fetch dashboard data when component mounts
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Sync activeTab with current route
    useEffect(() => {
        const path = window.location.pathname;
        if (path.includes('/provider/bookings')) setActiveTab('bookings');
        else if (path.includes('/provider/services')) setActiveTab('services');
        else if (path.includes('/provider/profile')) setActiveTab('profile');
        else if (path.includes('/provider/settings')) setActiveTab('settings');
        else setActiveTab('dashboard');
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'dashboard') navigate('/provider');
        else navigate(`/provider/${tab}`);
    };

    const handleLogout = () => {
        logout();
        clearData();
        navigate('/');
    };

    const handleBookingAction = async (id, newStatus) => {
        await updateBookingStatus(id, newStatus.toUpperCase());
    };

    const handleToggleServiceStatus = async (id) => {
        await toggleServiceStatus(id);
    };

    const handleDeleteService = async (id) => {
        await deleteService(id);
    };

    const handleUpdateProfile = async (profileData) => {
        await updateProfile(profileData);
    };

    // Transform data for views
    const dashboardStats = stats ? {
        earnings: stats.totalEarnings || 0,
        bookings: stats.totalBookings || 0,
        rating: stats.averageRating || 0,
        views: stats.profileViews || 0,
        earningsTrend: stats.earningsTrend || '+0%',
        bookingsTrend: stats.bookingsTrend || '+0 new',
        ratingStatus: stats.ratingStatus || 'Good Rating',
        viewsTrend: stats.viewsTrend || '+0%'
    } : { earnings: 0, bookings: 0, rating: 0, views: 0 };

    const transformedBookings = bookings.map(b => ({
        id: b.id,
        customer: b.customer,
        service: b.service,
        date: b.date,
        time: b.time ? b.time.substring(0, 5) : '',
        status: b.status,
        address: b.address,
        price: parseFloat(b.price) || 0,
    }));

    const transformedServices = services.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        price: parseFloat(s.price) || 0,
        duration: s.duration,
        active: s.active,
    }));

    const transformedProfile = profile ? {
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        avatar: profile.avatar,
        rating: parseFloat(profile.rating) || 0,
        reviews: profile.reviews || 0,
        experience: profile.experience,
        completedJobs: profile.completedJobs || 0,
        responseTime: profile.responseTime,
        languages: profile.languages || [],
        skills: profile.skills || [],
        certifications: profile.certifications || [],
        workingHours: profile.workingHours || {},
        verified: profile.verified,
        memberSince: profile.memberSince,
    } : null;

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            <ProviderSidebar
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                bookings={transformedBookings}
                onLogout={handleLogout}
                user={user}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <ProviderHeader
                    activeTab={activeTab}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    user={user}
                    profile={transformedProfile}
                />

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {dashboardLoading && !stats ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                <p className="text-slate-500">Loading dashboard...</p>
                            </div>
                        </div>
                    ) : (
                        <Routes>
                            <Route index element={
                                <ProviderDashboardView
                                    stats={dashboardStats}
                                    bookings={transformedBookings}
                                    handleBookingAction={handleBookingAction}
                                    setActiveTab={handleTabChange}
                                    profile={transformedProfile}
                                />
                            } />
                            <Route path="bookings" element={
                                <ProviderBookingsView
                                    bookings={transformedBookings}
                                    handleBookingAction={handleBookingAction}
                                />
                            } />
                            <Route path="services" element={
                                <ProviderServicesView
                                    services={transformedServices}
                                    toggleServiceStatus={handleToggleServiceStatus}
                                    deleteService={handleDeleteService}
                                />
                            } />
                            <Route path="profile" element={
                                <ProviderProfileView 
                                    profile={transformedProfile} 
                                    setProfile={handleUpdateProfile} 
                                />
                            } />
                            <Route path="settings" element={
                                <ProviderSettingsView 
                                    settings={settings} 
                                    setSettings={setSettings} 
                                />
                            } />
                        </Routes>
                    )}
                </main>
            </div>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}

// Customer Dashboard wrapper
function CustomerDashboardWrapper() {
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();
    const { clearData } = useDashboardStore();

    const handleLogout = () => {
        logout();
        clearData();
        navigate('/');
    };

    return (
        <CustomerDashboard 
            user={{
                name: user?.fullName,
                email: user?.email,
                avatar: user?.avatar
            }}
            onLogout={handleLogout}
        />
    );
}

// Landing page wrapper
function LandingPageWrapper() {
    const navigate = useNavigate();
    const { isAuthenticated, user, isLoading } = useAuthStore();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'CUSTOMER') {
                navigate('/customer', { replace: true });
            } else if (user.role === 'SERVICE_PROVIDER') {
                navigate('/provider', { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const handleSelectRole = (role) => {
        navigate(`/auth/${role}`);
    };

    return <LandingPage onSelectRole={handleSelectRole} />;
}

// Main App component with routing
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPageWrapper />} />
                <Route path="/auth/:role" element={<AuthPageWrapper />} />
                
                {/* Customer routes */}
                <Route path="/customer/*" element={
                    <ProtectedRoute allowedRole="CUSTOMER">
                        <CustomerDashboardWrapper />
                    </ProtectedRoute>
                } />
                
                {/* Service Provider routes */}
                <Route path="/provider/*" element={
                    <ProtectedRoute allowedRole="SERVICE_PROVIDER">
                        <ProviderDashboardLayout />
                    </ProtectedRoute>
                } />
                
                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
