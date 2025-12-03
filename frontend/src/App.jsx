import React, { useState, useEffect } from "react";
import { INITIAL_SETTINGS } from "./data/mockData";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import DashboardView from "./pages/DashboardView";
import BookingsView from "./pages/BookingsView";
import ServicesView from "./pages/ServicesView";
import ProfileView from "./pages/ProfileView";
import SettingsView from "./pages/SettingsView";
import LandingPage from "./pages/LandingPage";
import AuthPages from "./pages/AuthPages";
import useAuthStore from "./store/useAuthStore";
import useDashboardStore from "./store/useDashboardStore";

export default function App() {
    const { logout, user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const { 
        stats, 
        profile, 
        services, 
        bookings, 
        upcomingBookings,
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
    const [showAuth, setShowAuth] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null); // 'customer' | 'provider'
    const [settings, setSettings] = useState(INITIAL_SETTINGS);

    // Fetch dashboard data when authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            fetchDashboardData();
        }
    }, [isAuthenticated, user]);

    const handleSelectRole = (role) => {
        setSelectedRole(role);
        setShowAuth(true);
    };

    const handleBackToLanding = () => {
        setShowAuth(false);
        setSelectedRole(null);
    };

    const handleLogout = () => {
        logout();
        clearData();
        setShowAuth(false);
        setSelectedRole(null);
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

    // Loading state
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // If authenticated, show dashboard
    if (isAuthenticated) {
        // Transform stats for dashboard view
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

        // Transform bookings for views
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

        // Transform services for views
        const transformedServices = services.map(s => ({
            id: s.id,
            name: s.name,
            description: s.description,
            price: parseFloat(s.price) || 0,
            duration: s.duration,
            active: s.active,
        }));

        // Transform profile for views
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
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    bookings={transformedBookings}
                    onLogout={handleLogout}
                    user={user}
                />

                <div className="flex-1 flex flex-col min-w-0">
                    <Header
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
                            <>
                                {activeTab === "dashboard" && (
                                    <DashboardView
                                        stats={dashboardStats}
                                        bookings={transformedBookings}
                                        handleBookingAction={handleBookingAction}
                                        setActiveTab={setActiveTab}
                                        profile={transformedProfile}
                                    />
                                )}
                                {activeTab === "bookings" && (
                                    <BookingsView
                                        bookings={transformedBookings}
                                        handleBookingAction={handleBookingAction}
                                    />
                                )}
                                {activeTab === "services" && (
                                    <ServicesView
                                        services={transformedServices}
                                        toggleServiceStatus={handleToggleServiceStatus}
                                        deleteService={handleDeleteService}
                                    />
                                )}
                                {activeTab === "profile" && (
                                    <ProfileView 
                                        profile={transformedProfile} 
                                        setProfile={handleUpdateProfile} 
                                    />
                                )}
                                {activeTab === "settings" && (
                                    <SettingsView 
                                        settings={settings} 
                                        setSettings={setSettings} 
                                    />
                                )}
                            </>
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

    // If auth page selected, show auth
    if (showAuth) {
        return <AuthPages selectedRole={selectedRole} onBack={handleBackToLanding} />;
    }

    // Otherwise show landing page
    return <LandingPage onSelectRole={handleSelectRole} />;
}
