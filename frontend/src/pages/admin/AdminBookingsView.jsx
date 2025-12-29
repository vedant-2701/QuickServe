import React, { useEffect, useState } from 'react';
import { 
    Search, 
    MoreVertical, 
    CheckCircle, 
    XCircle,
    Clock,
    Calendar,
    MapPin,
    User,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    X,
    Eye,
    DollarSign,
    Phone,
    Mail
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';

const StatusBadge = ({ status }) => {
    const statusConfig = {
        PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
        CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
        IN_PROGRESS: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Clock },
        COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
        CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
            <Icon className="w-3 h-3 mr-1" />
            {status?.replace('_', ' ')}
        </span>
    );
};

const AdminBookingsView = () => {
    const { 
        bookings, 
        bookingsPagination, 
        isLoadingBookings, 
        error,
        fetchBookings, 
        updateBookingStatus,
        clearError
    } = useAdminStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [statusNotes, setStatusNotes] = useState('');

    useEffect(() => {
        loadBookings();
    }, [statusFilter]);

    const loadBookings = (page = 0) => {
        const params = { page, size: 10 };
        if (statusFilter) params.status = statusFilter;
        if (searchTerm) params.search = searchTerm;
        fetchBookings(params);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadBookings();
    };

    const handlePageChange = (newPage) => {
        loadBookings(newPage);
    };

    const handleStatusUpdate = async () => {
        if (!selectedBooking || !newStatus) return;
        try {
            await updateBookingStatus(selectedBooking.id, newStatus, statusNotes);
            setShowStatusModal(false);
            setSelectedBooking(null);
            setNewStatus('');
            setStatusNotes('');
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const openStatusModal = (booking, status) => {
        setSelectedBooking(booking);
        setNewStatus(status);
        setShowActionMenu(null);
        setShowStatusModal(true);
    };

    const openDetailModal = (booking) => {
        setSelectedBooking(booking);
        setShowActionMenu(null);
        setShowDetailModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        return timeString;
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
                    <p className="text-gray-500 mt-1">View and manage all bookings</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by customer or provider..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </form>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoadingBookings ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
                        <p className="text-gray-600">{error}</p>
                        <button 
                            onClick={() => { clearError(); loadBookings(); }}
                            className="mt-2 text-blue-600 hover:underline"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Booking ID</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Customer</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Provider</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Service</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Date & Time</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Amount</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                                        <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length > 0 ? (
                                        bookings.map((booking) => (
                                            <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                <td className="py-4 px-6 text-sm text-gray-900 font-mono">
                                                    #{booking.id?.toString().padStart(5, '0')}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm text-gray-900">{booking.customerName}</div>
                                                    <div className="text-xs text-gray-500">{booking.customerEmail}</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm text-gray-900">{booking.providerName}</div>
                                                    <div className="text-xs text-gray-500">{booking.providerBusinessName}</div>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600">{booking.serviceName}</td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm text-gray-900">{formatDate(booking.bookingDate)}</div>
                                                    <div className="text-xs text-gray-500">{formatTime(booking.bookingTime)}</div>
                                                </td>
                                                <td className="py-4 px-6 text-sm font-semibold text-green-600">
                                                    ₹{booking.price?.toLocaleString() || 0}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <StatusBadge status={booking.status} />
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setShowActionMenu(showActionMenu === booking.id ? null : booking.id)}
                                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                                        >
                                                            <MoreVertical className="w-5 h-5 text-gray-500" />
                                                        </button>
                                                        {showActionMenu === booking.id && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                                                                <button
                                                                    onClick={() => openDetailModal(booking)}
                                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                                                >
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    View Details
                                                                </button>
                                                                <hr className="my-1" />
                                                                {booking.status === 'PENDING' && (
                                                                    <button
                                                                        onClick={() => openStatusModal(booking, 'CONFIRMED')}
                                                                        className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-gray-50 flex items-center"
                                                                    >
                                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                                        Confirm
                                                                    </button>
                                                                )}
                                                                {booking.status === 'CONFIRMED' && (
                                                                    <button
                                                                        onClick={() => openStatusModal(booking, 'IN_PROGRESS')}
                                                                        className="w-full px-4 py-2 text-left text-sm text-purple-600 hover:bg-gray-50 flex items-center"
                                                                    >
                                                                        <Clock className="w-4 h-4 mr-2" />
                                                                        Mark In Progress
                                                                    </button>
                                                                )}
                                                                {(booking.status === 'CONFIRMED' || booking.status === 'IN_PROGRESS') && (
                                                                    <button
                                                                        onClick={() => openStatusModal(booking, 'COMPLETED')}
                                                                        className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-gray-50 flex items-center"
                                                                    >
                                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                                        Mark Completed
                                                                    </button>
                                                                )}
                                                                {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                                                                    <button
                                                                        onClick={() => openStatusModal(booking, 'CANCELLED')}
                                                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center"
                                                                    >
                                                                        <XCircle className="w-4 h-4 mr-2" />
                                                                        Cancel Booking
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="py-12 text-center text-gray-500">
                                                No bookings found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {bookingsPagination.totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500">
                                    Showing page {bookingsPagination.page + 1} of {bookingsPagination.totalPages}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(bookingsPagination.page - 1)}
                                        disabled={bookingsPagination.page === 0}
                                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(bookingsPagination.page + 1)}
                                        disabled={bookingsPagination.page >= bookingsPagination.totalPages - 1}
                                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Status Update Modal */}
            {showStatusModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Update Booking Status
                            </h3>
                            <button onClick={() => setShowStatusModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Change booking #{selectedBooking.id?.toString().padStart(5, '0')} status to <strong>{newStatus?.replace('_', ' ')}</strong>?
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                            <textarea
                                value={statusNotes}
                                onChange={(e) => setStatusNotes(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Enter any notes..."
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Booking Details #{selectedBooking.id?.toString().padStart(5, '0')}
                            </h3>
                            <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div className="flex items-center justify-between">
                                <StatusBadge status={selectedBooking.status} />
                                <span className="text-2xl font-bold text-green-600">₹{selectedBooking.price?.toLocaleString() || 0}</span>
                            </div>

                            {/* Service Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <Briefcase className="w-5 h-5 text-gray-400 mr-2" />
                                    <h4 className="font-semibold text-gray-900">Service</h4>
                                </div>
                                <p className="text-gray-700">{selectedBooking.serviceName}</p>
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                                        <h4 className="font-semibold text-gray-900">Date</h4>
                                    </div>
                                    <p className="text-gray-700">{formatDate(selectedBooking.bookingDate)}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <Clock className="w-5 h-5 text-gray-400 mr-2" />
                                        <h4 className="font-semibold text-gray-900">Time</h4>
                                    </div>
                                    <p className="text-gray-700">{formatTime(selectedBooking.bookingTime)}</p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="border border-gray-100 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                    <User className="w-5 h-5 text-blue-500 mr-2" />
                                    <h4 className="font-semibold text-gray-900">Customer</h4>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-900 font-medium">{selectedBooking.customerName}</p>
                                    {selectedBooking.customerEmail && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Mail className="w-4 h-4 mr-2" />
                                            {selectedBooking.customerEmail}
                                        </div>
                                    )}
                                    {selectedBooking.customerPhone && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Phone className="w-4 h-4 mr-2" />
                                            {selectedBooking.customerPhone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Provider Info */}
                            <div className="border border-gray-100 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                    <Briefcase className="w-5 h-5 text-purple-500 mr-2" />
                                    <h4 className="font-semibold text-gray-900">Provider</h4>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-900 font-medium">{selectedBooking.providerBusinessName || selectedBooking.providerName}</p>
                                    {selectedBooking.providerEmail && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Mail className="w-4 h-4 mr-2" />
                                            {selectedBooking.providerEmail}
                                        </div>
                                    )}
                                    {selectedBooking.providerPhone && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Phone className="w-4 h-4 mr-2" />
                                            {selectedBooking.providerPhone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            {selectedBooking.address && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                                        <h4 className="font-semibold text-gray-900">Service Address</h4>
                                    </div>
                                    <p className="text-gray-700">{selectedBooking.address}</p>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedBooking.notes && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                                    <p className="text-gray-700">{selectedBooking.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookingsView;
