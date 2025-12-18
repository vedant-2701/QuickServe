import React, { useState } from "react";
import {
    Briefcase,
    IndianRupee,
    Clock,
    Edit2,
    Trash2,
    Plus,
} from "lucide-react";
import AddServiceModal from "../../components/service-provider/AddServiceModal";
import EditServiceModal from "../../components/service-provider/EditServiceModal";
import useDashboardStore from "../../store/useDashboardStore";

const ServicesView = ({ services, toggleServiceStatus, deleteService }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const { createService, updateService, isLoading } = useDashboardStore();

    const handleAddService = async (serviceData) => {
        const result = await createService(serviceData);
        return result.success;
    };

    const handleEditService = async (serviceId, serviceData) => {
        const result = await updateService(serviceId, serviceData);
        return result.success;
    };

    const openEditModal = (service) => {
        setSelectedService(service);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedService(null);
        setIsEditModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        My Services
                    </h2>
                    <p className="text-slate-500">
                        Manage what you offer and your pricing.
                    </p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Add Service
                </button>
            </div>

            {services.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">No services yet</h3>
                    <p className="text-slate-500 mb-6">Start by adding your first service to attract customers.</p>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Your First Service
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`bg-white rounded-xl shadow-sm border transition-all ${
                                service.active
                                    ? "border-slate-200"
                                    : "border-slate-100 opacity-75"
                            }`}
                        >
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div
                                className={`p-2 rounded-lg ${
                                    service.active
                                        ? "bg-indigo-100 text-indigo-600"
                                        : "bg-slate-100 text-slate-400"
                                }`}
                            >
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input
                                    type="checkbox"
                                    name={`toggle-${service.id}`}
                                    id={`toggle-${service.id}`}
                                    checked={service.active}
                                    onChange={() =>
                                        toggleServiceStatus(service.id)
                                    }
                                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5"
                                    style={{
                                        right: service.active ? "0" : "1.25rem",
                                        borderColor: service.active
                                            ? "#4f46e5"
                                            : "#cbd5e1",
                                    }}
                                />
                                <label
                                    htmlFor={`toggle-${service.id}`}
                                    className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${
                                        service.active
                                            ? "bg-indigo-600"
                                            : "bg-slate-300"
                                    }`}
                                ></label>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg text-slate-800 mb-1">
                            {service.name}
                        </h3>
                        <p className="text-sm text-slate-500 mb-4 h-10 overflow-hidden">
                            {service.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                            <div className="flex items-center gap-1">
                                <IndianRupee className="w-4 h-4 text-slate-400" />
                                {service.price}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-slate-400" />
                                {service.duration}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => openEditModal(service)}
                                className="flex-1 py-2 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button
                                onClick={() => deleteService(service.id)}
                                className="py-2 px-3 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 transition"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    {!service.active && (
                        <div className="bg-slate-50 p-2 text-center text-xs font-medium text-slate-500 border-t border-slate-100">
                            Currently Inactive
                        </div>
                    )}
                </div>
                    ))}
                </div>
            )}

            <AddServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddService}
                isLoading={isLoading}
            />

            <EditServiceModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSubmit={handleEditService}
                service={selectedService}
                isLoading={isLoading}
            />
        </div>
    );
};

export default ServicesView;
