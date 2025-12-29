import React from 'react';
import { Menu, Bell, Search, Shield } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const AdminHeader = () => {
    const { user } = useAuthStore();

    return (
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left: Menu button and Search */}
                <div className="flex items-center gap-4">
                    <button
                        className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6 text-slate-600" />
                    </button>

                    <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2.5 w-80">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users, providers, bookings..."
                            className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 w-full"
                        />
                    </div>
                </div>

                {/* Right: Notifications and Profile */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors">
                        <Bell className="w-5 h-5 text-slate-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    {/* Divider */}
                    <div className="h-8 w-px bg-slate-200 hidden sm:block" />

                    {/* Profile */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-slate-900">
                                {user?.fullName || 'Admin'}
                            </p>
                            <p className="text-xs text-red-500 font-medium">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
