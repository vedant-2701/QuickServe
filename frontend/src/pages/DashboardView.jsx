import React from "react";
import {
    MapPin,
    Calendar,
    DollarSign,
    Star,
    User,
    Plus,
    Clock,
    ChevronRight,
} from "lucide-react";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

const DashboardView = ({
    stats,
    bookings,
    handleBookingAction,
    setActiveTab,
}) => {
    const todayBookings = bookings.filter(
        (b) => b.status === "confirmed" || b.status === "pending"
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Overview
                    </h2>
                    <p className="text-slate-500">
                        Welcome back, John! Here's what's happening today.
                    </p>
                </div>
                <div className="hidden sm:block text-right">
                    <p className="text-sm text-slate-500">Current Location</p>
                    <p className="font-medium text-slate-800 flex items-center justify-end gap-1">
                        <MapPin className="w-4 h-4 text-indigo-600" /> XYZ, IN
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Earnings"
                    value={`$${stats.earnings}`}
                    icon={DollarSign}
                    trend="+12% from last week"
                />
                <StatCard
                    title="Total Bookings"
                    value={stats.bookings}
                    icon={Calendar}
                    trend="+4 new today"
                />
                <StatCard
                    title="Average Rating"
                    value={stats.rating}
                    icon={Star}
                    trend="Top Rated Provider"
                />
                <StatCard
                    title="Profile Views"
                    value={stats.views}
                    icon={User}
                    trend="+24% this month"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">
                            Upcoming Schedule
                        </h3>
                        <button
                            onClick={() => setActiveTab("bookings")}
                            className="text-sm text-indigo-600 font-medium hover:text-indigo-800"
                        >
                            View All
                        </button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {todayBookings.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                No upcoming bookings for today.
                            </div>
                        ) : (
                            todayBookings.slice(0, 3).map((booking) => (
                                <div
                                    key={booking.id}
                                    className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg font-bold text-center min-w-[3.5rem]">
                                            <div className="text-xs uppercase">
                                                {new Date(
                                                    booking.date
                                                ).toLocaleString("default", {
                                                    month: "short",
                                                })}
                                            </div>
                                            <div className="text-lg">
                                                {new Date(
                                                    booking.date
                                                ).getDate()}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">
                                                {booking.service}
                                            </h4>
                                            <p className="text-sm text-slate-500 mb-1">
                                                {booking.customer} •{" "}
                                                {booking.time}
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                                <MapPin className="w-3 h-3" />{" "}
                                                {booking.address}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <StatusBadge status={booking.status} />
                                        {booking.status === "pending" && (
                                            <button
                                                onClick={() =>
                                                    handleBookingAction(
                                                        booking.id,
                                                        "confirmed"
                                                    )
                                                }
                                                className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition"
                                            >
                                                Accept
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <h3 className="font-bold text-slate-800 mb-4">
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => setActiveTab("services")}
                            className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition text-left group"
                        >
                            <span className="flex items-center gap-3 font-medium text-slate-700 group-hover:text-indigo-700">
                                <div className="bg-green-100 p-2 rounded-md">
                                    <Plus className="w-4 h-4 text-green-600" />
                                </div>
                                Add New Service
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition text-left group">
                            <span className="flex items-center gap-3 font-medium text-slate-700 group-hover:text-indigo-700">
                                <div className="bg-orange-100 p-2 rounded-md">
                                    <Clock className="w-4 h-4 text-orange-600" />
                                </div>
                                Update Availability
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                        </button>
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                Recent Alerts
                            </h4>
                            <div className="flex gap-3 mb-3">
                                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                                <p className="text-sm text-slate-600">
                                    New booking request from{" "}
                                    <strong>Evan Wright</strong> pending
                                    approval.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                <p className="text-sm text-slate-600">
                                    <strong>Diana Prince</strong> left a 5-star
                                    review!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
