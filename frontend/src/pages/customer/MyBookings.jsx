import React, { useState, useEffect } from 'react';
import { 
    Calendar,
    Clock,
    MapPin,
    Star,
    ChevronRight,
    Filter,
    Search,
    Phone,
    MessageCircle,
    CheckCircle,
    XCircle,
    AlertCircle,
    IndianRupee,
    Loader2
} from 'lucide-react';
import useCustomerStore from '../../store/useCustomerStore';

const MyBookings = ({ onNavigate }) => {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cancellingId, setCancellingId] = useState(null);

    const { 
        bookings, 
        isLoadingBookings, 
        fetchBookings, 
        cancelBooking 
    } = useCustomerStore();

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending':
                return { 
                    color: 'bg-yellow-100 text-yellow-700', 
                    icon: AlertCircle,
                    label: 'Pending Confirmation'
                };
            case 'confirmed':
                return { 
                    color: 'bg-blue-100 text-blue-700', 
                    icon: CheckCircle,
                    label: 'Confirmed'
                };
            case 'completed':
                return { 
                    color: 'bg-green-100 text-green-700', 
                    icon: CheckCircle,
                    label: 'Completed'
                };
            case 'cancelled':
                return { 
                    color: 'bg-red-100 text-red-700', 
                    icon: XCircle,
                    label: 'Cancelled'
                };
            default:
                return { 
                    color: 'bg-slate-100 text-slate-700', 
                    icon: AlertCircle,
                    label: status
                };
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === 'all' || booking.status?.toLowerCase() === filter;
        const matchesSearch = booking.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            booking.providerName?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        // Convert 24h format to 12h format
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const isUpcoming = (dateStr) => {
        if (!dateStr) return false;
        return new Date(dateStr) >= new Date();
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            setCancellingId(bookingId);
            try {
                await cancelBooking(bookingId);
            } finally {
                setCancellingId(null);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>
                <p className="text-slate-500">View and manage your service bookings</p>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by service or provider..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                                    filter === f
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-800'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Bookings', value: bookings.length, color: 'bg-indigo-50 text-indigo-600' },
                    { label: 'Pending', value: bookings.filter(b => b.status?.toLowerCase() === 'pending').length, color: 'bg-yellow-50 text-yellow-600' },
                    { label: 'Completed', value: bookings.filter(b => b.status?.toLowerCase() === 'completed').length, color: 'bg-green-50 text-green-600' },
                    { label: 'Upcoming', value: bookings.filter(b => isUpcoming(b.scheduledDate) && b.status?.toLowerCase() !== 'cancelled').length, color: 'bg-blue-50 text-blue-600' },
                ].map((stat, index) => (
                    <div key={index} className={`${stat.color} rounded-xl p-4`}>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm opacity-80">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Bookings List */}
            {isLoadingBookings ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
                    <p className="text-slate-500">Loading your bookings...</p>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No bookings found</h3>
                    <p className="text-slate-500 mb-4">
                        {filter !== 'all' 
                            ? `You don't have any ${filter} bookings.`
                            : "You haven't made any bookings yet."}
                    </p>
                    <button
                        onClick={() => onNavigate && onNavigate('browse')}
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Browse Services
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBookings.map((booking) => {
                        const statusConfig = getStatusConfig(booking.status?.toLowerCase());
                        const StatusIcon = statusConfig.icon;

                        return (
                            <div
                                key={booking.id}
                                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Provider Info */}
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={booking.providerAvatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'}
                                            alt={booking.providerName}
                                            className="w-16 h-16 rounded-xl object-cover"
                                        />
                                        <div>
                                            <h3 className="font-bold text-slate-800">{booking.providerName}</h3>
                                            <div className="flex items-center gap-1 text-sm text-slate-500">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span>{booking.providerRating?.toFixed(1) || 'New'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <div className="text-sm text-slate-500">Service</div>
                                            <div className="font-semibold text-slate-800">{booking.serviceName}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-500">Date & Time</div>
                                            <div className="font-semibold text-slate-800">
                                                {formatDate(booking.scheduledDate)}
                                            </div>
                                            <div className="text-sm text-slate-600">{formatTime(booking.scheduledTime)}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-500">Amount</div>
                                            <div className="font-bold text-indigo-600 text-lg">₹{booking.totalAmount || 0}</div>
                                        </div>
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex flex-col items-end gap-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusConfig.color}`}>
                                            <StatusIcon className="w-4 h-4" />
                                            {statusConfig.label}
                                        </span>

                                        <div className="flex gap-2">
                                            {booking.status?.toLowerCase() === 'confirmed' && booking.providerPhone && (
                                                <>
                                                    <a
                                                        href={`tel:${booking.providerPhone}`}
                                                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                                                        title="Call Provider"
                                                    >
                                                        <Phone className="w-5 h-5" />
                                                    </a>
                                                    <button
                                                        className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition"
                                                        title="Message Provider"
                                                    >
                                                        <MessageCircle className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => onNavigate && onNavigate('provider', { id: booking.providerId })}
                                                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                {booking.serviceAddress && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2 text-sm text-slate-500">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>{booking.serviceAddress}</span>
                                    </div>
                                )}

                                {/* Notes */}
                                {booking.customerNotes && (
                                    <div className="mt-2 text-sm text-slate-500 italic">
                                        Note: {booking.customerNotes}
                                    </div>
                                )}

                                {/* Actions for pending/confirmed bookings */}
                                {(booking.status?.toLowerCase() === 'pending' || booking.status?.toLowerCase() === 'confirmed') && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
                                        <button 
                                            onClick={() => handleCancelBooking(booking.id)}
                                            disabled={cancellingId === booking.id}
                                            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {cancellingId === booking.id && <Loader2 className="w-4 h-4 animate-spin" />}
                                            Cancel Booking
                                        </button>
                                    </div>
                                )}

                                {/* Review button for completed bookings */}
                                {booking.status?.toLowerCase() === 'completed' && !booking.hasReview && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <button 
                                            onClick={() => onNavigate && onNavigate('provider', { id: booking.providerId, showReview: true })}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                                        >
                                            <Star className="w-4 h-4" />
                                            Write a Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
