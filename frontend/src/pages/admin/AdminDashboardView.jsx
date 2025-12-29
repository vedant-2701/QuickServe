import React, { useEffect } from 'react';
import { 
    Users, 
    UserCheck, 
    Calendar, 
    DollarSign, 
    TrendingUp, 
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';

const StatCard = ({ title, value, icon: Icon, change, changeType, color }) => {
    const colorClasses = {
        blue: 'bg-blue-500/10 text-blue-500',
        green: 'bg-green-500/10 text-green-500',
        purple: 'bg-purple-500/10 text-purple-500',
        orange: 'bg-orange-500/10 text-orange-500',
        pink: 'bg-pink-500/10 text-pink-500',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {change !== undefined && (
                        <div className="flex items-center mt-2">
                            {changeType === 'increase' ? (
                                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span className={`text-sm ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                                {change}%
                            </span>
                            <span className="text-sm text-gray-400 ml-1">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

const BookingStatusCard = ({ title, value, icon: Icon, color }) => {
    const bgColors = {
        yellow: 'bg-yellow-50 border-yellow-200',
        blue: 'bg-blue-50 border-blue-200',
        green: 'bg-green-50 border-green-200',
        red: 'bg-red-50 border-red-200',
    };
    
    const textColors = {
        yellow: 'text-yellow-600',
        blue: 'text-blue-600',
        green: 'text-green-600',
        red: 'text-red-600',
    };

    return (
        <div className={`rounded-lg border p-4 ${bgColors[color]}`}>
            <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${textColors[color]}`} />
                <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className={`text-xl font-bold ${textColors[color]}`}>{value}</p>
                </div>
            </div>
        </div>
    );
};

const AdminDashboardView = () => {
    const { dashboardStats, isLoading, error, fetchDashboardStats } = useAdminStore();

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    if (isLoading && !dashboardStats) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">{error}</p>
                    <button 
                        onClick={fetchDashboardStats}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const stats = dashboardStats || {
        totalUsers: 0,
        totalCustomers: 0,
        totalProviders: 0,
        totalBookings: 0,
        totalRevenue: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        activeProviders: 0,
        verifiedProviders: 0,
        pendingVerification: 0,
        recentBookings: [],
        recentUsers: []
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with QuickServe.</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers?.toLocaleString() || 0}
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Total Providers"
                    value={stats.totalProviders?.toLocaleString() || 0}
                    icon={UserCheck}
                    color="purple"
                />
                <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings?.toLocaleString() || 0}
                    icon={Calendar}
                    color="green"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
                    icon={DollarSign}
                    color="orange"
                />
            </div>

            {/* Booking Status Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <BookingStatusCard 
                        title="Pending" 
                        value={stats.pendingBookings || 0} 
                        icon={Clock} 
                        color="yellow" 
                    />
                    <BookingStatusCard 
                        title="Confirmed" 
                        value={stats.confirmedBookings || 0} 
                        icon={CheckCircle} 
                        color="blue" 
                    />
                    <BookingStatusCard 
                        title="Completed" 
                        value={stats.completedBookings || 0} 
                        icon={CheckCircle} 
                        color="green" 
                    />
                    <BookingStatusCard 
                        title="Cancelled" 
                        value={stats.cancelledBookings || 0} 
                        icon={XCircle} 
                        color="red" 
                    />
                </div>
            </div>

            {/* Provider Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Overview</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Active Providers</span>
                            <span className="font-semibold text-green-600">{stats.activeProviders || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Verified Providers</span>
                            <span className="font-semibold text-blue-600">{stats.verifiedProviders || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Pending Verification</span>
                            <span className="font-semibold text-yellow-600">{stats.pendingVerification || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                        <a href="/admin/bookings" className="text-sm text-blue-600 hover:underline">View All</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Customer</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Service</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentBookings?.length > 0 ? (
                                    stats.recentBookings.slice(0, 5).map((booking, index) => (
                                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-3 px-2 text-sm text-gray-900">{booking.customerName}</td>
                                            <td className="py-3 px-2 text-sm text-gray-600">{booking.serviceName}</td>
                                            <td className="py-3 px-2">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-sm text-gray-900 text-right">₹{booking.amount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-gray-500">
                                            No recent bookings
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                    <a href="/admin/users" className="text-sm text-blue-600 hover:underline">View All</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Name</th>
                                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Email</th>
                                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Role</th>
                                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentUsers?.length > 0 ? (
                                stats.recentUsers.slice(0, 5).map((user, index) => (
                                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-3 px-2 text-sm text-gray-900">{user.name}</td>
                                        <td className="py-3 px-2 text-sm text-gray-600">{user.email}</td>
                                        <td className="py-3 px-2">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'SERVICE_PROVIDER' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-sm text-gray-500">
                                            {new Date(user.joinedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-500">
                                        No recent users
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardView;
