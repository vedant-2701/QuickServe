import React from 'react';
import { 
    Home,
    Search,
    Calendar,
    User,
    Heart,
    Settings,
    HelpCircle,
    MessageCircle,
    X
} from 'lucide-react';

const CustomerSidebar = ({ currentPage, onNavigate, isOpen, onClose }) => {
    const menuItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'browse', label: 'Browse Services', icon: Search },
        { id: 'bookings', label: 'My Bookings', icon: Calendar },
        // { id: 'favorites', label: 'Saved Providers', icon: Heart },
        // { id: 'messages', label: 'Messages', icon: MessageCircle, badge: 3 },
    ];

    const secondaryItems = [
        { id: 'profile', label: 'My Profile', icon: User },
        // { id: 'settings', label: 'Settings', icon: Settings },
        // { id: 'help', label: 'Help & Support', icon: HelpCircle },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            QS
                        </div>
                        <span className="font-bold text-xl text-slate-800">QuickServe</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Hidden on mobile - Logo shows in header */}
                <div className="hidden lg:flex items-center gap-2 p-4 border-b border-slate-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        QS
                    </div>
                    <span className="font-bold text-xl text-slate-800">QuickServe</span>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col h-[calc(100%-4rem)] lg:h-[calc(100%-4rem)]">
                    {/* Main Menu */}
                    <div className="flex-1 p-4 space-y-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                            Menu
                        </p>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPage === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onNavigate(item.id);
                                        onClose && onClose();
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                                        isActive
                                            ? 'bg-indigo-50 text-indigo-600 font-medium'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.badge && (
                                        <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}

                        <div className="pt-6">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                                Account
                            </p>
                            {secondaryItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPage === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            onNavigate(item.id);
                                            onClose && onClose();
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                                            isActive
                                                ? 'bg-indigo-50 text-indigo-600 font-medium'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="p-4 border-t border-slate-100">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
                            <h3 className="font-semibold mb-1">Need Help?</h3>
                            <p className="text-sm opacity-80 mb-3">Our support team is ready to help you</p>
                            <button className="w-full py-2 bg-white text-indigo-600 rounded-lg font-medium text-sm hover:bg-opacity-90 transition">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default CustomerSidebar;
