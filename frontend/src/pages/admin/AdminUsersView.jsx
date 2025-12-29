import React, { useEffect, useState } from 'react';
import { 
    Search, 
    Filter, 
    MoreVertical, 
    User, 
    UserCheck, 
    Shield,
    Ban,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    X
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';

const StatusBadge = ({ status }) => {
    const statusStyles = {
        ACTIVE: 'bg-green-100 text-green-700',
        INACTIVE: 'bg-gray-100 text-gray-700',
        SUSPENDED: 'bg-red-100 text-red-700',
        PENDING: 'bg-yellow-100 text-yellow-700'
    };

    return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
};

const RoleBadge = ({ role }) => {
    const roleStyles = {
        ADMIN: 'bg-purple-100 text-purple-700',
        SERVICE_PROVIDER: 'bg-blue-100 text-blue-700',
        CUSTOMER: 'bg-green-100 text-green-700'
    };

    const roleLabels = {
        ADMIN: 'Admin',
        SERVICE_PROVIDER: 'Provider',
        CUSTOMER: 'Customer'
    };

    return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${roleStyles[role] || 'bg-gray-100 text-gray-700'}`}>
            {roleLabels[role] || role}
        </span>
    );
};

const AdminUsersView = () => {
    const { 
        users, 
        usersPagination, 
        isLoadingUsers, 
        error,
        fetchUsers, 
        updateUserStatus,
        deleteUser,
        clearError
    } = useAdminStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [statusReason, setStatusReason] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        loadUsers();
    }, [roleFilter, statusFilter]);

    const loadUsers = (page = 0) => {
        const params = { page, size: 10 };
        if (roleFilter) params.role = roleFilter;
        if (statusFilter) params.status = statusFilter;
        if (searchTerm) params.search = searchTerm;
        fetchUsers(params);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadUsers();
    };

    const handlePageChange = (newPage) => {
        loadUsers(newPage);
    };

    const handleStatusUpdate = async () => {
        if (!selectedUser || !newStatus) return;
        try {
            await updateUserStatus(selectedUser.id, newStatus, statusReason);
            setShowStatusModal(false);
            setSelectedUser(null);
            setNewStatus('');
            setStatusReason('');
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete.id);
            setShowDeleteModal(false);
            setUserToDelete(null);
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const openStatusModal = (user, status) => {
        setSelectedUser(user);
        setNewStatus(status);
        setShowActionMenu(null);
        setShowStatusModal(true);
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setShowActionMenu(null);
        setShowDeleteModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-1">Manage all users, customers, and providers</p>
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
                                placeholder="Search users by name or email..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </form>

                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SERVICE_PROVIDER">Provider</option>
                        <option value="CUSTOMER">Customer</option>
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

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoadingUsers ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
                        <p className="text-gray-600">{error}</p>
                        <button 
                            onClick={() => { clearError(); loadUsers(); }}
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
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">User</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Email</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Role</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Joined</th>
                                        <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                            {user.phone && (
                                                                <p className="text-xs text-gray-500">{user.phone}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                                                <td className="py-4 px-6">
                                                    <RoleBadge role={user.role} />
                                                </td>
                                                <td className="py-4 px-6">
                                                    <StatusBadge status={user.status} />
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-500">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                                        >
                                                            <MoreVertical className="w-5 h-5 text-gray-500" />
                                                        </button>
                                                        {showActionMenu === user.id && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                                                                <button
                                                                    onClick={() => openStatusModal(user, 'ACTIVE')}
                                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                                                >
                                                                    <UserCheck className="w-4 h-4 mr-2" />
                                                                    Activate
                                                                </button>
                                                                <button
                                                                    onClick={() => openStatusModal(user, 'SUSPENDED')}
                                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center"
                                                                >
                                                                    <Ban className="w-4 h-4 mr-2" />
                                                                    Suspend
                                                                </button>
                                                                <hr className="my-1" />
                                                                <button
                                                                    onClick={() => openDeleteModal(user)}
                                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center"
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Delete User
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-12 text-center text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {usersPagination.totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500">
                                    Showing page {usersPagination.page + 1} of {usersPagination.totalPages}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(usersPagination.page - 1)}
                                        disabled={usersPagination.page === 0}
                                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(usersPagination.page + 1)}
                                        disabled={usersPagination.page >= usersPagination.totalPages - 1}
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
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {newStatus === 'ACTIVE' ? 'Activate' : 'Suspend'} User
                            </h3>
                            <button onClick={() => setShowStatusModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to {newStatus === 'ACTIVE' ? 'activate' : 'suspend'} <strong>{selectedUser?.name}</strong>?
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-red-600">Delete User</h3>
                            <button onClick={() => setShowDeleteModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersView;
