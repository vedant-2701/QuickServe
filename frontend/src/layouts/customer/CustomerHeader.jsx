import React, { useState } from 'react';
import { 
    Search,
    Bell,
    Menu,
    X,
    User,
    LogOut,
    Settings,
    Heart,
    Calendar,
    ChevronDown,
    MapPin
} from 'lucide-react';

const CustomerHeader = ({ user, onMenuToggle, onNavigate, onLogout }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [location] = useState('Mumbai, MH');

    const notifications = [
        {
            id: 1,
            title: 'Booking Confirmed',
            message: 'Your booking with Rajesh Kumar has been confirmed for Dec 12, 10:00 AM',
            time: '2 hours ago',
            unread: true
        },
        {
            id: 2,
            title: 'Provider on the way',
            message: 'Priya Sharma is on the way to your location',
            time: '1 day ago',
            unread: false
        },
        {
            id: 3,
            title: 'Rate your experience',
            message: 'How was your experience with Amit Patel?',
            time: '3 days ago',
            unread: false
        },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onNavigate && onNavigate('browse', { search: searchQuery });
        }
    };

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Logo & Menu Toggle */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onMenuToggle}
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                QS
                            </div>
                            <span className="font-bold text-xl text-slate-800 hidden sm:block">QuickServe</span>
                        </div>
                    </div>

                    {/* Center: Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search for services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-l-xl focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                            />
                        </div>
                        <button
                            type="button"
                            className="flex items-center gap-2 px-4 bg-slate-100 border-y border-r border-transparent hover:bg-slate-200 transition"
                        >
                            <MapPin className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-600">{location}</span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>
                        <button
                            type="submit"
                            className="px-6 bg-indigo-600 text-white rounded-r-xl hover:bg-indigo-700 transition"
                        >
                            Search
                        </button>
                    </form>

                    {/* Right: Notifications & Profile */}
                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    setShowProfileMenu(false);
                                }}
                                className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                            >
                                <Bell className="w-6 h-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
                                    <div className="p-4 border-b border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-slate-800">Notifications</h3>
                                            <button className="text-sm text-indigo-600 hover:underline">Mark all read</button>
                                        </div>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <button
                                                key={notification.id}
                                                className={`w-full text-left p-4 hover:bg-slate-50 transition ${
                                                    notification.unread ? 'bg-indigo-50/50' : ''
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {notification.unread && (
                                                        <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                                                    )}
                                                    <div className={notification.unread ? '' : 'ml-5'}>
                                                        <div className="font-medium text-slate-800">{notification.title}</div>
                                                        <div className="text-sm text-slate-500 line-clamp-2">{notification.message}</div>
                                                        <div className="text-xs text-slate-400 mt-1">{notification.time}</div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="p-3 border-t border-slate-100">
                                        <button className="w-full text-center text-sm text-indigo-600 font-medium hover:underline">
                                            View all notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowProfileMenu(!showProfileMenu);
                                    setShowNotifications(false);
                                }}
                                className="flex items-center gap-3 p-1.5 hover:bg-slate-100 rounded-lg transition"
                            >
                                <img
                                    src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop'}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-lg object-cover"
                                />
                                <div className="hidden sm:block text-left">
                                    <div className="text-sm font-medium text-slate-800">
                                        {user?.name || 'John Doe'}
                                    </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                            </button>

                            {/* Profile Dropdown */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
                                    <div className="p-3 border-b border-slate-100">
                                        <div className="font-medium text-slate-800">{user?.name || 'John Doe'}</div>
                                        <div className="text-sm text-slate-500">{user?.email || 'john@example.com'}</div>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                onNavigate && onNavigate('profile');
                                                setShowProfileMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
                                        >
                                            <User className="w-5 h-5" />
                                            <span>My Profile</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                onNavigate && onNavigate('bookings');
                                                setShowProfileMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
                                        >
                                            <Calendar className="w-5 h-5" />
                                            <span>My Bookings</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                onNavigate && onNavigate('favorites');
                                                setShowProfileMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
                                        >
                                            <Heart className="w-5 h-5" />
                                            <span>Saved Providers</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                onNavigate && onNavigate('settings');
                                                setShowProfileMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
                                        >
                                            <Settings className="w-5 h-5" />
                                            <span>Settings</span>
                                        </button>
                                    </div>
                                    <div className="p-2 border-t border-slate-100">
                                        <button
                                            onClick={() => {
                                                onLogout && onLogout();
                                                setShowProfileMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden px-4 pb-3">
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search for services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </form>
            </div>

            {/* Click outside to close dropdowns */}
            {(showNotifications || showProfileMenu) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setShowNotifications(false);
                        setShowProfileMenu(false);
                    }}
                />
            )}
        </header>
    );
};

export default CustomerHeader;
