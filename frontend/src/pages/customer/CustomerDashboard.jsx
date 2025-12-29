import React, { useState } from 'react';
import CustomerHeader from '../../layouts/customer/CustomerHeader';
import CustomerSidebar from '../../layouts/customer/CustomerSidebar';
import CustomerHome from './CustomerHome';
import BrowseServices from './BrowseServices';
import ProviderDetails from './ProviderDetails';
import MyBookings from './MyBookings';
import CustomerProfile from './CustomerProfile';

const CustomerDashboard = ({ user, onLogout }) => {
    const [currentPage, setCurrentPage] = useState('home');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [pageParams, setPageParams] = useState({});

    const handleNavigate = (page, params = {}) => {
        setCurrentPage(page);
        setPageParams(params);
        window.scrollTo(0, 0);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return (
                    <CustomerHome 
                        onNavigate={handleNavigate}
                        onSearch={(query) => handleNavigate('browse', { search: query })}
                    />
                );
            case 'browse':
                return (
                    <BrowseServices 
                        onNavigate={handleNavigate}
                        initialSearch={pageParams.search}
                        initialCategory={pageParams.category}
                    />
                );
            case 'provider':
                return (
                    <ProviderDetails 
                        providerId={pageParams.id}
                        showReviewModal={pageParams.showReview}
                        bookingId={pageParams.bookingId}
                        onBack={() => handleNavigate('browse')}
                        onNavigate={handleNavigate}
                    />
                );
            case 'bookings':
                return (
                    <MyBookings 
                        onNavigate={handleNavigate}
                    />
                );
            case 'profile':
                return (
                    <CustomerProfile 
                        onLogout={onLogout}
                    />
                );
            case 'favorites':
                return (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <div className="text-6xl mb-4">❤️</div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Saved Providers</h2>
                        <p className="text-slate-500 mb-4">Your favorite service providers will appear here</p>
                        <button
                            onClick={() => handleNavigate('browse')}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            Browse Services
                        </button>
                    </div>
                );
            case 'messages':
                return (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <div className="text-6xl mb-4">💬</div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Messages</h2>
                        <p className="text-slate-500">Chat with service providers about your bookings</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <div className="text-6xl mb-4">⚙️</div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Settings</h2>
                        <p className="text-slate-500">Manage your account settings and preferences</p>
                    </div>
                );
            case 'help':
                return (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <div className="text-6xl mb-4">❓</div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Help & Support</h2>
                        <p className="text-slate-500">Get help with your questions and issues</p>
                    </div>
                );
            default:
                return (
                    <CustomerHome 
                        onNavigate={handleNavigate}
                        onSearch={(query) => handleNavigate('browse', { search: query })}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <CustomerHeader 
                user={user}
                onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
                onNavigate={handleNavigate}
                onLogout={onLogout}
            />

            <div className="flex">
                {/* Sidebar */}
                <CustomerSidebar 
                    currentPage={currentPage}
                    onNavigate={handleNavigate}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                    <div className="max-w-6xl mx-auto">
                        {renderPage()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CustomerDashboard;
