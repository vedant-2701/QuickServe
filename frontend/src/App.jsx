import React, { useState } from "react";
import {
    INITIAL_STATS,
    INITIAL_BOOKINGS,
    INITIAL_SERVICES,
    INITIAL_PROFILE,
    INITIAL_SETTINGS,
} from "./data/mockData";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import DashboardView from "./pages/DashboardView";
import BookingsView from "./pages/BookingsView";
import ServicesView from "./pages/ServicesView";
import ProfileView from "./pages/ProfileView";
import SettingsView from "./pages/SettingsView";
import AuthPages from "./pages/AuthPages";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [stats, setStats] = useState(INITIAL_STATS);
    const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
    const [services, setServices] = useState(INITIAL_SERVICES);
    const [profile, setProfile] = useState(INITIAL_PROFILE);
    const [settings, setSettings] = useState(INITIAL_SETTINGS);

    const handleLogin = () => {
        setIsAuthenticated(true);
        setActiveTab("dashboard");
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const handleBookingAction = (id, newStatus) => {
        setBookings((prev) =>
            prev.map((b) => {
                if (b.id === id) {
                    if (newStatus === "completed" && b.status !== "completed") {
                        setStats((s) => ({
                            ...s,
                            earnings: s.earnings + b.price,
                            bookings: s.bookings + 1,
                        }));
                    }
                    return { ...b, status: newStatus };
                }
                return b;
            })
        );
    };

    const toggleServiceStatus = (id) => {
        setServices((prev) =>
            prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
        );
    };

    const deleteService = (id) => {
        setServices((prev) => prev.filter((s) => s.id !== id));
    };

    // Show Auth page if not authenticated
    if (!isAuthenticated) {
        return <AuthPages onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                bookings={bookings}
                onLogout={handleLogout}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    activeTab={activeTab}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {activeTab === "dashboard" && (
                        <DashboardView
                            stats={stats}
                            bookings={bookings}
                            handleBookingAction={handleBookingAction}
                            setActiveTab={setActiveTab}
                        />
                    )}
                    {activeTab === "bookings" && (
                        <BookingsView
                            bookings={bookings}
                            handleBookingAction={handleBookingAction}
                        />
                    )}
                    {activeTab === "services" && (
                        <ServicesView
                            services={services}
                            toggleServiceStatus={toggleServiceStatus}
                            deleteService={deleteService}
                        />
                    )}
                    {activeTab === "profile" && <ProfileView profile={profile} setProfile={setProfile} />}
                    {activeTab === "settings" && <SettingsView settings={settings} setSettings={setSettings} />}
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
