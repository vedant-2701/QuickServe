import React, { useState } from "react";
import { MapPin, Calendar, Clock, XCircle, CheckCircle } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";

const BookingsView = ({ bookings, handleBookingAction }) => {
    const [filter, setFilter] = useState("all");

    const filteredBookings = bookings.filter((b) => {
        if (filter === "all") return true;
        return b.status === filter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800">
                    Bookings Management
                </h2>
                <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    {["all", "pending", "confirmed", "completed"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                                filter === f
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">
                                    Customer
                                </th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">
                                    Service
                                </th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">
                                    Date & Time
                                </th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">
                                    Status
                                </th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="p-8 text-center text-slate-500"
                                    >
                                        No bookings found in this category.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="font-medium text-slate-800">
                                                {booking.customer}
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                <MapPin className="w-3 h-3" />{" "}
                                                {booking.address}
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-700">
                                            {booking.service}
                                            <div className="text-xs text-indigo-600 font-medium mt-1">
                                                ₹{booking.price}
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {booking.date}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                                {booking.time}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge
                                                status={booking.status}
                                            />
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {booking.status ===
                                                    "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleBookingAction(
                                                                    booking.id,
                                                                    "cancelled"
                                                                )
                                                            }
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleBookingAction(
                                                                    booking.id,
                                                                    "confirmed"
                                                                )
                                                            }
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition"
                                                            title="Accept"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status ===
                                                    "confirmed" && (
                                                    <button
                                                        onClick={() =>
                                                            handleBookingAction(
                                                                booking.id,
                                                                "completed"
                                                            )
                                                        }
                                                        className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 transition shadow-sm"
                                                    >
                                                        Mark Complete
                                                    </button>
                                                )}
                                                {(booking.status ===
                                                    "completed" ||
                                                    booking.status ===
                                                        "cancelled") && (
                                                    <span className="text-slate-400 text-sm">
                                                        -
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BookingsView;
