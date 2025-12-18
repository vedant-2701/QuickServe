import React, { useState, useEffect } from 'react';
import { 
    User,
    Mail,
    Phone,
    MapPin,
    Edit2,
    Camera,
    Save,
    X,
    Shield,
    Bell,
    CreditCard,
    Heart,
    Clock,
    Star,
    ChevronRight,
    LogOut,
    Loader2
} from 'lucide-react';
import useCustomerStore from '../../store/useCustomerStore';

const CustomerProfile = ({ onLogout }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const { 
        profile, 
        isLoadingProfile, 
        fetchProfile, 
        updateProfile 
    } = useCustomerStore();

    const [editedProfile, setEditedProfile] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (profile) {
            setEditedProfile({
                fullName: profile.fullName || '',
                phone: profile.phone || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                pincode: profile.pincode || ''
            });
        }
    }, [profile]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile(editedProfile);
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setEditedProfile({
                fullName: profile.fullName || '',
                phone: profile.phone || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                pincode: profile.pincode || ''
            });
        }
        setIsEditing(false);
    };

    const stats = [
        { label: 'Total Bookings', value: profile?.totalBookings || 0, icon: Clock, color: 'bg-indigo-100 text-indigo-600' },
        { label: 'Completed', value: profile?.completedBookings || 0, icon: Star, color: 'bg-green-100 text-green-600' },
        { label: 'Cancelled', value: profile?.cancelledBookings || 0, icon: X, color: 'bg-red-100 text-red-600' },
    ];

    const menuItems = [
        { icon: Heart, label: 'Saved Providers', description: 'View your favorite service providers' },
        { icon: CreditCard, label: 'Payment Methods', description: 'Manage your payment options' },
        { icon: Bell, label: 'Notifications', description: 'Manage notification preferences' },
        { icon: Shield, label: 'Privacy & Security', description: 'Account security settings' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                <p className="text-slate-500">Manage your account settings and preferences</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {/* Cover */}
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />

                {/* Profile Info */}
                <div className="relative px-6 pb-6">
                    {/* Avatar */}
                    <div className="absolute -top-12 left-6">
                        <div className="relative">
                            <img
                                src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'}
                                alt={profile?.fullName || 'Profile'}
                                className="w-24 h-24 rounded-xl border-4 border-white object-cover shadow-lg"
                            />
                            {isEditing && (
                                <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition">
                                    <Camera className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Edit Button */}
                    <div className="flex justify-end pt-4">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Profile Details */}
                    <div className="mt-8">
                        {isLoadingProfile ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                            </div>
                        ) : !isEditing ? (
                            <>
                                <h2 className="text-2xl font-bold text-slate-800">{profile?.fullName || 'Your Name'}</h2>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="p-2 bg-slate-100 rounded-lg">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <span>{profile?.email || 'Email not set'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="p-2 bg-slate-100 rounded-lg">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <span>{profile?.phone || 'Phone not set'}</span>
                                    </div>
                                    {(profile?.address || profile?.city) && (
                                        <div className="flex items-start gap-3 text-slate-600 md:col-span-2">
                                            <div className="p-2 bg-slate-100 rounded-lg">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <span>
                                                {[profile?.address, profile?.city, profile?.state, profile?.pincode].filter(Boolean).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={editedProfile.fullName}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editedProfile.email}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={editedProfile.phone}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        value={editedProfile.pincode}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, pincode: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={editedProfile.address}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        value={editedProfile.city}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, city: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        value={editedProfile.state}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, state: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                            <div className={`inline-flex p-3 rounded-xl ${stat.color} mb-3`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                            <div className="text-sm text-slate-500">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* Menu Items */}
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={index}
                            className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition text-left"
                        >
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <Icon className="w-5 h-5 text-slate-600" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-slate-800">{item.label}</div>
                                <div className="text-sm text-slate-500">{item.description}</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                        </button>
                    );
                })}
            </div>

            {/* Logout Button */}
            <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-4 text-red-600 font-medium hover:bg-red-50 rounded-xl transition"
            >
                <LogOut className="w-5 h-5" />
                Logout
            </button>
        </div>
    );
};

export default CustomerProfile;
