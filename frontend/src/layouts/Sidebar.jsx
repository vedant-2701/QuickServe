import React from "react";
import {
    LayoutDashboard,
    Calendar,
    Briefcase,
    Settings,
    User,
    LogOut,
    X,
} from "lucide-react";

const Sidebar = ({
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    bookings,
}) => {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <div className="flex items-center justify-between h-16 px-6 bg-slate-950">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <span className="text-white">Q</span>
                    </div>
                    QuickServe
                </div>
                <button
                    className="lg:hidden text-slate-400 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="p-4">
                <div className="flex items-center gap-3 p-3 mb-6 bg-slate-800 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-lg font-bold">
                        JD
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="font-bold text-sm truncate">John Doe</h4>
                        <p className="text-xs text-slate-400 truncate">
                            Service Provider
                        </p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {[
                        {
                            id: "dashboard",
                            icon: LayoutDashboard,
                            label: "Overview",
                        },
                        {
                            id: "bookings",
                            icon: Calendar,
                            label: "Bookings",
                            badge: bookings.filter(
                                (b) => b.status === "pending"
                            ).length,
                        },
                        {
                            id: "services",
                            icon: Briefcase,
                            label: "My Services",
                        },
                        // { id: 'profile', icon: User, label: 'Profile' },
                        // { id: 'settings', icon: Settings, label: 'Settings' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === item.id
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon
                                    className={`w-5 h-5 ${
                                        activeTab === item.id
                                            ? "text-indigo-200"
                                            : "text-slate-500"
                                    }`}
                                />
                                {item.label}
                            </div>
                            {item.badge > 0 && (
                                <span className="bg-indigo-500 text-white text-xs py-0.5 px-2 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 text-slate-400 hover:text-white text-sm font-medium w-full p-2 rounded-lg hover:bg-slate-800 transition">
                    <LogOut className="w-5 h-5" /> Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
