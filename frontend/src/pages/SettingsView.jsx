import React, { useState } from "react";
import {
    Bell,
    Lock,
    Globe,
    Shield,
    Moon,
    Smartphone,
    ChevronRight,
    Calendar,
    CreditCard,
    Clock,
    Zap,
    IndianRupee,
    Wallet,
} from "lucide-react";

const SettingsSection = ({ settings: initialSettings, setSettings: updateSettings }) => {
    const [radius, setRadius] = useState(initialSettings.radius);
    const [notifications, setNotifications] = useState(initialSettings.notifications);
    const [availability, setAvailability] = useState(initialSettings.availability || { acceptingBookings: true, instantBooking: true, emergencyServices: true });
    const [booking, setBooking] = useState(initialSettings.booking || { autoConfirm: false, minLeadTime: 2, maxAdvanceBooking: 14, cancellationWindow: 24 });
    const [payment, setPayment] = useState(initialSettings.payment || { acceptCash: true, acceptOnline: true, acceptUPI: true });

    const handleRadiusChange = (newRadius) => {
        setRadius(newRadius);
        updateSettings({ ...initialSettings, radius: newRadius, notifications, availability, booking, payment });
    };

    const handleNotificationChange = (key) => {
        const newNotifications = { ...notifications, [key]: !notifications[key] };
        setNotifications(newNotifications);
        updateSettings({ ...initialSettings, radius, notifications: newNotifications, availability, booking, payment });
    };

    const handleAvailabilityChange = (key) => {
        const newAvailability = { ...availability, [key]: !availability[key] };
        setAvailability(newAvailability);
        updateSettings({ ...initialSettings, radius, notifications, availability: newAvailability, booking, payment });
    };

    const handleBookingChange = (key, value) => {
        const newBooking = { ...booking, [key]: value };
        setBooking(newBooking);
        updateSettings({ ...initialSettings, radius, notifications, availability, booking: newBooking, payment });
    };

    const handlePaymentChange = (key) => {
        const newPayment = { ...payment, [key]: !payment[key] };
        setPayment(newPayment);
        updateSettings({ ...initialSettings, radius, notifications, availability, booking, payment: newPayment });
    };

    const Toggle = ({ checked, onChange }) => (
        <div
            onClick={onChange}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                checked ? "bg-indigo-600" : "bg-slate-300"
            }`}
        >
            <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    checked ? "translate-x-5" : "translate-x-0"
                }`}
            />
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
                <p className="text-slate-500">
                    Manage your account preferences and service details.
                </p>
            </div>

            {/* Business Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-500" />
                        Service Area Preferences
                    </h3>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-slate-700">
                                Service Radius
                            </label>
                            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                {radius} km
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="50"
                            value={radius}
                            onChange={(e) => handleRadiusChange(e.target.value)}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            You will only receive job requests within this
                            distance from your registered address.
                        </p>
                    </div>
                </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        Availability
                    </h3>
                </div>
                <div className="divide-y divide-slate-100">
                    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                        <div>
                            <p className="font-medium text-slate-800">
                                Accepting Bookings
                            </p>
                            <p className="text-sm text-slate-500">
                                Turn off to pause all new booking requests.
                            </p>
                        </div>
                        <Toggle
                            checked={availability.acceptingBookings}
                            onChange={() => handleAvailabilityChange('acceptingBookings')}
                        />
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                        <div>
                            <p className="font-medium text-slate-800">
                                Instant Booking
                            </p>
                            <p className="text-sm text-slate-500">
                                Allow customers to book without approval.
                            </p>
                        </div>
                        <Toggle
                            checked={availability.instantBooking}
                            onChange={() => handleAvailabilityChange('instantBooking')}
                        />
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                        <div className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-amber-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-slate-800">
                                    Emergency Services
                                </p>
                                <p className="text-sm text-slate-500">
                                    Accept urgent same-day requests (premium rates).
                                </p>
                            </div>
                        </div>
                        <Toggle
                            checked={availability.emergencyServices}
                            onChange={() => handleAvailabilityChange('emergencyServices')}
                        />
                    </div>
                </div>
            </div>

            {/* Booking Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        Booking Preferences
                    </h3>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-slate-700">
                                Minimum Lead Time
                            </label>
                            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                {booking.minLeadTime} hours
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="24"
                            value={booking.minLeadTime}
                            onChange={(e) => handleBookingChange('minLeadTime', parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Minimum hours notice required before a booking.
                        </p>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-slate-700">
                                Max Advance Booking
                            </label>
                            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                {booking.maxAdvanceBooking} days
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            value={booking.maxAdvanceBooking}
                            onChange={(e) => handleBookingChange('maxAdvanceBooking', parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            How far in advance customers can book your services.
                        </p>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-slate-700">
                                Cancellation Window
                            </label>
                            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                {booking.cancellationWindow} hours
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="48"
                            value={booking.cancellationWindow}
                            onChange={(e) => handleBookingChange('cancellationWindow', parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Free cancellation allowed until this many hours before the appointment.
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-slate-500" />
                        Accepted Payment Methods
                    </h3>
                </div>
                <div className="divide-y divide-slate-100">
                    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Wallet className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-800">
                                    Cash Payment
                                </p>
                                <p className="text-sm text-slate-500">
                                    Accept cash on service completion.
                                </p>
                            </div>
                        </div>
                        <Toggle
                            checked={payment.acceptCash}
                            onChange={() => handlePaymentChange('acceptCash')}
                        />
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-800">
                                    Online Payment
                                </p>
                                <p className="text-sm text-slate-500">
                                    Credit/Debit cards via payment gateway.
                                </p>
                            </div>
                        </div>
                        <Toggle
                            checked={payment.acceptOnline}
                            onChange={() => handlePaymentChange('acceptOnline')}
                        />
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <IndianRupee className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-800">
                                    UPI Payment
                                </p>
                                <p className="text-sm text-slate-500">
                                    Accept GPay, PhonePe, Paytm, etc.
                                </p>
                            </div>
                        </div>
                        <Toggle
                            checked={payment.acceptUPI}
                            onChange={() => handlePaymentChange('acceptUPI')}
                        />
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Bell className="w-4 h-4 text-slate-500" />
                        Notifications
                    </h3>
                </div>
                <div className="divide-y divide-slate-100">
                    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                        <div>
                            <p className="font-medium text-slate-800">
                                Push Notifications
                            </p>
                            <p className="text-sm text-slate-500">
                                Receive alerts on your device for new bookings.
                            </p>
                        </div>
                        <Toggle
                            checked={notifications.push}
                            onChange={() => handleNotificationChange('push')}
                        />
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                        <div>
                            <p className="font-medium text-slate-800">
                                Email Updates
                            </p>
                            <p className="text-sm text-slate-500">
                                Daily summaries and booking receipts.
                            </p>
                        </div>
                        <Toggle
                            checked={notifications.email}
                            onChange={() => handleNotificationChange('email')}
                        />
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                        <div>
                            <p className="font-medium text-slate-800">
                                SMS Alerts
                            </p>
                            <p className="text-sm text-slate-500">
                                Urgent updates for last-minute changes.
                            </p>
                        </div>
                        <Toggle
                            checked={notifications.sms}
                            onChange={() => handleNotificationChange('sms')}
                        />
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-slate-500" />
                        Security & Login
                    </h3>
                </div>
                <div className="divide-y divide-slate-100">
                    <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 text-left transition group">
                        <div>
                            <p className="font-medium text-slate-800">
                                Change Password
                            </p>
                            <p className="text-sm text-slate-500">
                                Last changed 3 months ago
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
                    </button>
                    <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 text-left transition group">
                        <div>
                            <p className="font-medium text-slate-800">
                                Two-Factor Authentication
                            </p>
                            <p className="text-sm text-slate-500">
                                Currently disabled
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-100 rounded-xl overflow-hidden bg-red-50/30">
                <div className="p-4 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-red-700">
                            Delete Account
                        </h4>
                        <p className="text-sm text-red-600/70">
                            Permanently remove your account and all data.
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsSection;
