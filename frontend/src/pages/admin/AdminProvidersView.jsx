import React, { useEffect, useState } from 'react';
import { 
    Search, 
    MoreVertical, 
    CheckCircle, 
    XCircle,
    Star,
    MapPin,
    Phone,
    Mail,
    Shield,
    ShieldCheck,
    ShieldX,
    Ban,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    X,
    Eye,
    Briefcase
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';

const VerificationBadge = ({ verified }) => {
    if (verified) {
        return (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Verified
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            <Shield className="w-3 h-3 mr-1" />
            Pending
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const statusStyles = {
        ACTIVE: 'bg-green-100 text-green-700',
        INACTIVE: 'bg-gray-100 text-gray-700',
        SUSPENDED: 'bg-red-100 text-red-700'
    };

    return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
};

const AdminProvidersView = () => {
    const { 
        providers, 
        providersPagination, 
        isLoadingProviders, 
        error,
        fetchProviders, 
        verifyProvider,
        updateProviderStatus,
        clearError
    } = useAdminStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [verifiedFilter, setVerifiedFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [verificationNotes, setVerificationNotes] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [statusReason, setStatusReason] = useState('');

    useEffect(() => {
        loadProviders();
    }, [verifiedFilter, statusFilter]);

    const loadProviders = (page = 0) => {
        const params = { page, size: 10 };
        if (verifiedFilter !== '') params.verified = verifiedFilter === 'true';
        if (statusFilter) params.status = statusFilter;
        if (searchTerm) params.search = searchTerm;
        fetchProviders(params);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadProviders();
    };

    const handlePageChange = (newPage) => {
        loadProviders(newPage);
    };

    const handleVerify = async (verified) => {
        if (!selectedProvider) return;
        try {
            await verifyProvider(selectedProvider.id, verified, verificationNotes);
            setShowVerifyModal(false);
            setSelectedProvider(null);
            setVerificationNotes('');
        } catch (error) {
            console.error('Failed to verify provider:', error);
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedProvider || !newStatus) return;
        try {
            await updateProviderStatus(selectedProvider.id, newStatus, statusReason);
            setShowStatusModal(false);
            setSelectedProvider(null);
            setNewStatus('');
            setStatusReason('');
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const openVerifyModal = (provider) => {
        setSelectedProvider(provider);
        setShowActionMenu(null);
        setShowVerifyModal(true);
    };

    const openStatusModal = (provider, status) => {
        setSelectedProvider(provider);
        setNewStatus(status);
        setShowActionMenu(null);
        setShowStatusModal(true);
    };

    const openDetailModal = (provider) => {
        setSelectedProvider(provider);
        setShowActionMenu(null);
        setShowDetailModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Provider Management</h1>
                    <p className="text-gray-500 mt-1">Manage service providers and verifications</p>
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
                                placeholder="Search providers..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </form>

                    {/* Verification Filter */}
                    <select
                        value={verifiedFilter}
                        onChange={(e) => setVerifiedFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Verification</option>
                        <option value="true">Verified</option>
                        <option value="false">Not Verified</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="SUSPENDED">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Providers Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoadingProviders ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
                        <p className="text-gray-600">{error}</p>
                        <button 
                            onClick={() => { clearError(); loadProviders(); }}
                            className="mt-2 text-blue-600 hover:underline"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                            {providers.length > 0 ? (
                                providers.map((provider) => (
                                    <div key={provider.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                        {/* Provider Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-lg">
                                                    {provider.businessName?.charAt(0).toUpperCase() || 'P'}
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="font-semibold text-gray-900">{provider.businessName || provider.name}</h3>
                                                    <p className="text-sm text-gray-500">{provider.category}</p>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowActionMenu(showActionMenu === provider.id ? null : provider.id)}
                                                    className="p-1 hover:bg-gray-100 rounded"
                                                >
                                                    <MoreVertical className="w-5 h-5 text-gray-500" />
                                                </button>
                                                {showActionMenu === provider.id && (
                                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                                                        <button
                                                            onClick={() => openDetailModal(provider)}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                                        >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View Details
                                                        </button>
                                                        <button
                                                            onClick={() => openVerifyModal(provider)}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                                        >
                                                            <ShieldCheck className="w-4 h-4 mr-2" />
                                                            {provider.verified ? 'Revoke Verification' : 'Verify Provider'}
                                                        </button>
                                                        <hr className="my-1" />
                                                        {provider.status !== 'ACTIVE' && (
                                                            <button
                                                                onClick={() => openStatusModal(provider, 'ACTIVE')}
                                                                className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-gray-50 flex items-center"
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                Activate
                                                            </button>
                                                        )}
                                                        {provider.status !== 'SUSPENDED' && (
                                                            <button
                                                                onClick={() => openStatusModal(provider, 'SUSPENDED')}
                                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center"
                                                            >
                                                                <Ban className="w-4 h-4 mr-2" />
                                                                Suspend
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <VerificationBadge verified={provider.verified} />
                                            <StatusBadge status={provider.status} />
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                                            <div className="bg-gray-50 rounded-lg p-2">
                                                <div className="flex items-center justify-center text-yellow-500">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="ml-1 font-semibold text-gray-900">{provider.rating?.toFixed(1) || 'N/A'}</span>
                                                </div>
                                                <p className="text-xs text-gray-500">Rating</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-2">
                                                <p className="font-semibold text-gray-900">{provider.totalBookings || 0}</p>
                                                <p className="text-xs text-gray-500">Bookings</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-2">
                                                <p className="font-semibold text-gray-900">{provider.serviceCount || 0}</p>
                                                <p className="text-xs text-gray-500">Services</p>
                                            </div>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="space-y-1 text-sm text-gray-600">
                                            {provider.email && (
                                                <div className="flex items-center">
                                                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                    <span className="truncate">{provider.email}</span>
                                                </div>
                                            )}
                                            {provider.phone && (
                                                <div className="flex items-center">
                                                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                    <span>{provider.phone}</span>
                                                </div>
                                            )}
                                            {provider.city && (
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                    <span>{provider.city}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center text-gray-500">
                                    No providers found
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {providersPagination.totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500">
                                    Showing page {providersPagination.page + 1} of {providersPagination.totalPages}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(providersPagination.page - 1)}
                                        disabled={providersPagination.page === 0}
                                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(providersPagination.page + 1)}
                                        disabled={providersPagination.page >= providersPagination.totalPages - 1}
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

            {/* Verify Modal */}
            {showVerifyModal && selectedProvider && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {selectedProvider.verified ? 'Revoke Verification' : 'Verify Provider'}
                            </h3>
                            <button onClick={() => setShowVerifyModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">
                            {selectedProvider.verified 
                                ? `Are you sure you want to revoke verification for ${selectedProvider.businessName || selectedProvider.name}?`
                                : `Verify ${selectedProvider.businessName || selectedProvider.name} as a trusted service provider?`
                            }
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                            <textarea
                                value={verificationNotes}
                                onChange={(e) => setVerificationNotes(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Enter verification notes..."
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowVerifyModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleVerify(!selectedProvider.verified)}
                                className={`px-4 py-2 text-white rounded-lg ${
                                    selectedProvider.verified ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {selectedProvider.verified ? 'Revoke' : 'Verify'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {newStatus === 'ACTIVE' ? 'Activate' : 'Suspend'} Provider
                            </h3>
                            <button onClick={() => setShowStatusModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to {newStatus === 'ACTIVE' ? 'activate' : 'suspend'} <strong>{selectedProvider?.businessName || selectedProvider?.name}</strong>?
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
                            <textarea
                                value={statusReason}
                                onChange={(e) => setStatusReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Enter reason..."
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
                                className={`px-4 py-2 text-white rounded-lg ${
                                    newStatus === 'ACTIVE' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {newStatus === 'ACTIVE' ? 'Activate' : 'Suspend'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedProvider && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Provider Details</h3>
                            <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                                    {selectedProvider.businessName?.charAt(0).toUpperCase() || 'P'}
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-xl font-semibold text-gray-900">{selectedProvider.businessName}</h4>
                                    <p className="text-gray-500">{selectedProvider.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <VerificationBadge verified={selectedProvider.verified} />
                                        <StatusBadge status={selectedProvider.status} />
                                    </div>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{selectedProvider.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium">{selectedProvider.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Category</p>
                                    <p className="font-medium">{selectedProvider.category || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-medium">{selectedProvider.city || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Rating</p>
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                        <span className="font-medium">{selectedProvider.rating?.toFixed(1) || 'N/A'}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Bookings</p>
                                    <p className="font-medium">{selectedProvider.totalBookings || 0}</p>
                                </div>
                            </div>

                            {/* Services */}
                            {selectedProvider.services && selectedProvider.services.length > 0 && (
                                <div>
                                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                                        <Briefcase className="w-4 h-4 mr-2" />
                                        Services ({selectedProvider.services.length})
                                    </h5>
                                    <div className="space-y-2">
                                        {selectedProvider.services.map((service, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="font-medium">{service.name}</span>
                                                <span className="text-green-600 font-semibold">₹{service.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProvidersView;
