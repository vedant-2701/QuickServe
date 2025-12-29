import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    Briefcase, 
    Calendar, 
    Settings, 
    LogOut,
    Shield,
    ChevronRight,
    X
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useAdminStore from '../../store/useAdminStore';

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'providers', label: 'Providers', icon: Briefcase, path: '/admin/providers' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/admin/bookings' },
];

const AdminSidebar = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const { clearData } = useAdminStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        clearData();
        logout();
        navigate('/');
    };

    return (
        <>
            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50
                w-64 bg-slate-900 text-white
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold">Quick<span className="text-red-400">Serve</span></span>
                            <p className="text-xs text-slate-400">Admin Panel</p>
                        </div>
                    </div>
                    <button 
                        className="lg:hidden p-1 hover:bg-slate-700 rounded"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            
                            return (
                                <li key={item.id}>
                                    <NavLink
                                        to={item.path}
                                        end={item.path === '/admin'}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) => `
                                            w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                            transition-all duration-200
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30' 
                                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                            }
                                        `}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon className={`w-5 h-5 ${isActive ? 'text-red-400' : ''}`} />
                                                <span className="font-medium">{item.label}</span>
                                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Admin Badge */}
                <div className="p-4 mx-3 mb-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl border border-red-500/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Admin Access</p>
                            <p className="text-xs text-slate-400">Full System Control</p>
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <div className="p-3 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
