import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

const EditServiceModal = ({ isOpen, onClose, onSubmit, service, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '1h',
        durationMinutes: 60,
    });

    useEffect(() => {
        if (service) {
            setFormData({
                name: service.name || '',
                description: service.description || '',
                price: service.price?.toString() || '',
                duration: service.duration || '1h',
                durationMinutes: service.durationMinutes || 60,
            });
        }
    }, [service]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDurationChange = (e) => {
        const duration = e.target.value;
        let durationMinutes = 60;
        
        if (duration.includes('h')) {
            const hours = parseFloat(duration);
            durationMinutes = hours * 60;
        } else if (duration.includes('min')) {
            durationMinutes = parseInt(duration);
        }
        
        setFormData(prev => ({
            ...prev,
            duration,
            durationMinutes
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onSubmit(service.id, {
            ...formData,
            price: parseFloat(formData.price)
        });
        
        if (success) {
            onClose();
        }
    };

    if (!isOpen || !service) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-black/50 transition-opacity"
                    onClick={onClose}
                />
                
                {/* Modal */}
                <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Edit Service</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Service Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Deep Home Cleaning"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe your service..."
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Duration *
                                </label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleDurationChange}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                >
                                    <option value="30min">30 min</option>
                                    <option value="45min">45 min</option>
                                    <option value="1h">1 hour</option>
                                    <option value="1.5h">1.5 hours</option>
                                    <option value="2h">2 hours</option>
                                    <option value="2.5h">2.5 hours</option>
                                    <option value="3h">3 hours</option>
                                    <option value="4h">4 hours</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !formData.name || !formData.price}
                                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditServiceModal;
