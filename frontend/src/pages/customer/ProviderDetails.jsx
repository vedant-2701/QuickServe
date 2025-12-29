import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft,
    Star, 
    Clock, 
    MapPin,
    Shield,
    Phone,
    Mail,
    Calendar,
    CheckCircle,
    MessageCircle,
    Share2,
    Heart,
    Briefcase,
    Award,
    ThumbsUp,
    ChevronRight,
    IndianRupee,
    X,
    Loader2
} from 'lucide-react';
import useCustomerStore from '../../store/useCustomerStore';

// Generic placeholder avatar using UI Avatars
const getPlaceholderAvatar = (name) => {
    const encodedName = encodeURIComponent(name || 'User');
    return `https://ui-avatars.com/api/?name=${encodedName}&background=6366f1&color=fff&size=200`;
};

const ProviderDetails = ({ providerId, showReviewModal, bookingId, onNavigate, onBook }) => {
    const [selectedService, setSelectedService] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [activeTab, setActiveTab] = useState('services');
    const [isFavorite, setIsFavorite] = useState(false);

    const { 
        selectedProvider: provider, 
        isLoading, 
        fetchProviderDetails, 
        clearSelectedProvider 
    } = useCustomerStore();

    useEffect(() => {
        if (providerId) {
            fetchProviderDetails(providerId);
        }
        return () => clearSelectedProvider();
    }, [providerId, fetchProviderDetails, clearSelectedProvider]);

    // Open review modal if showReviewModal prop is true
    useEffect(() => {
        if (showReviewModal && provider && !showReviewForm) {
            // Use timeout to avoid setState in sync effect
            const timer = setTimeout(() => {
                setShowReviewForm(true);
                setActiveTab('reviews');
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [showReviewModal, provider, showReviewForm]);

    const handleBookService = (service) => {
        setSelectedService(service);
        setShowBookingModal(true);
    };

    // Normalize provider data from API response
    const normalizedProvider = provider ? {
        ...provider,
        avgRating: provider.averageRating || provider.avgRating,
        reviews: provider.recentReviews || provider.reviews || [],
        yearsOfExperience: provider.experienceYears || provider.yearsOfExperience || 0,
        completedBookings: provider.completedJobs || provider.completedBookings || 0,
        // Transform workingHours from Map to Array for rendering
        workingHours: provider.workingHours ? 
            Object.entries(provider.workingHours).map(([day, info]) => ({
                dayOfWeek: day,
                startTime: info.startTime,
                endTime: info.endTime,
                isClosed: !info.isAvailable
            })) : []
    } : null;

    if (isLoading || !provider) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-slate-500">Loading provider details...</p>
                </div>
            </div>
        );
    }

    // Use normalized provider for rendering
    const displayProvider = normalizedProvider;

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={() => onNavigate && onNavigate('browse')}
                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Search
            </button>

            {/* Provider Header */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4"></div>
                    </div>
                </div>
                
                <div className="px-6 pb-6">
                    <div className="flex flex-col md:flex-row gap-6 -mt-12">
                        {/* Profile Image */}
                        <div className="relative flex-shrink-0">
                            <img
                                src={displayProvider.avatarUrl || getPlaceholderAvatar(displayProvider.name)}
                                alt={displayProvider.name}
                                className="w-32 h-32 rounded-2xl border-4 border-white object-cover shadow-lg"
                            />
                            {displayProvider.verified && (
                                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
                                    <Shield className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        {/* Provider Info */}
                        <div className="flex-1 pt-14 md:pt-4">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h1 className="text-2xl font-bold text-slate-800">{displayProvider.name}</h1>
                                        {displayProvider.verified && (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                                                <Shield className="w-3 h-3" /> Verified
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-indigo-600 font-medium mb-3">{displayProvider.primaryService || 'Service Provider'}</p>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="font-bold text-slate-800">{displayProvider.avgRating?.toFixed(1) || 'New'}</span>
                                            <span>({displayProvider.totalReviews || 0} reviews)</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Briefcase className="w-4 h-4 text-slate-400" />
                                            <span>{displayProvider.completedBookings || 0} jobs completed</span>
                                        </div>
                                        {displayProvider.city && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                <span>{displayProvider.city}{displayProvider.state ? `, ${displayProvider.state}` : ''}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 z-10">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`p-3 rounded-xl border transition ${
                                            isFavorite 
                                                ? 'bg-red-50 border-red-200 text-red-500' 
                                                : 'bg-white border-slate-200 text-slate-400 hover:text-red-500'
                                        }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                    </button>
                                    <button className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 transition">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    {displayProvider.phone && (
                                        <a 
                                            href={`tel:${displayProvider.phone}`}
                                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
                                        >
                                            <Phone className="w-5 h-5" />
                                            Contact
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="flex border-b border-slate-200">
                            {['services', 'reviews', 'about'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 px-6 py-4 font-medium capitalize transition ${
                                        activeTab === tab
                                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            {/* Services Tab */}
                            {activeTab === 'services' && (
                                <div className="space-y-4">
                                    {displayProvider.services && displayProvider.services.length > 0 ? (
                                        displayProvider.services.map((service) => (
                                            <div
                                                key={service.id}
                                                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition group"
                                            >
                                                <div>
                                                    <h4 className="font-semibold text-slate-800">{service.name}</h4>
                                                    <p className="text-sm text-slate-500">{service.description || 'No description'}</p>
                                                    <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                                                        {service.duration && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-4 h-4" />
                                                                {service.duration}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-lg text-slate-800">₹{service.price || 0}</div>
                                                    <button
                                                        onClick={() => handleBookService(service)}
                                                        className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                                                    >
                                                        Book Now
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-slate-500">
                                            No services listed yet
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Reviews Tab */}
                            {activeTab === 'reviews' && (
                                <div className="space-y-6">
                                    {/* Rating Summary */}
                                    <div className="flex items-center gap-8 p-6 bg-slate-50 rounded-xl">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-slate-800">{displayProvider.avgRating?.toFixed(1) || 'New'}</div>
                                            <div className="flex items-center justify-center gap-1 my-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-5 h-5 ${
                                                            star <= Math.round(displayProvider.avgRating || 0)
                                                                ? 'text-yellow-500 fill-yellow-500'
                                                                : 'text-slate-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-sm text-slate-500">{displayProvider.totalReviews || 0} reviews</div>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            {[5, 4, 3, 2, 1].map((rating) => {
                                                // Calculate the count and percentage for each rating
                                                const reviews = displayProvider.reviews || [];
                                                const totalReviews = displayProvider.totalReviews || reviews.length || 0;
                                                const ratingCount = reviews.filter(r => r.rating === rating).length;
                                                const percentage = totalReviews > 0 ? (ratingCount / totalReviews) * 100 : 0;
                                                
                                                return (
                                                    <div key={rating} className="flex items-center gap-3">
                                                        <span className="text-sm text-slate-600 w-3">{rating}</span>
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs text-slate-400 w-8">{ratingCount}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Reviews List */}
                                    {displayProvider.reviews && displayProvider.reviews.length > 0 ? (
                                        displayProvider.reviews.map((review) => (
                                            <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0">
                                                <div className="flex items-start gap-4">
                                                    <img
                                                        src={review.customerAvatar || getPlaceholderAvatar(review.customerName)}
                                                        alt={review.customerName}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-semibold text-slate-800">{review.customerName}</h4>
                                                            <span className="text-sm text-slate-500">
                                                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 my-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-4 h-4 ${
                                                                        star <= review.rating
                                                                            ? 'text-yellow-500 fill-yellow-500'
                                                                            : 'text-slate-300'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className="text-slate-600 mt-2">{review.comment}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-slate-500">
                                            No reviews yet
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* About Tab */}
                            {activeTab === 'about' && (
                                <div className="space-y-6">
                                    {displayProvider.bio && (
                                        <div>
                                            <h3 className="font-semibold text-slate-800 mb-3">About</h3>
                                            <p className="text-slate-600 leading-relaxed">{displayProvider.bio}</p>
                                        </div>
                                    )}

                                    {displayProvider.yearsOfExperience > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-slate-800 mb-3">Experience</h3>
                                            <p className="text-slate-600">{displayProvider.yearsOfExperience}+ years of professional experience</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Booking Card */}
                <div className="space-y-6">
                    {/* Quick Book Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-6">
                        <div className="text-center mb-6">
                            <div className="text-3xl font-bold text-slate-800">₹{displayProvider.hourlyRate || 0}</div>
                            <div className="text-slate-500">Starting price per hour</div>
                        </div>

                        <button
                            onClick={() => setShowBookingModal(true)}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
                        >
                            Book Now
                        </button>

                        <div className="mt-6 space-y-4">
                            {displayProvider.yearsOfExperience > 0 && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Award className="w-5 h-5 text-green-500" />
                                    <span className="text-slate-600">{displayProvider.yearsOfExperience}+ years experience</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-sm">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-slate-600">{displayProvider.completedBookings || 0}+ jobs completed</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <ThumbsUp className="w-5 h-5 text-green-500" />
                                <span className="text-slate-600">{displayProvider.totalReviews || 0} customer reviews</span>
                            </div>
                        </div>

                        {displayProvider.workingHours && displayProvider.workingHours.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h4 className="font-semibold text-slate-800 mb-3">Working Hours</h4>
                                <div className="space-y-2 text-sm">
                                    {displayProvider.workingHours.map((wh, index) => (
                                        <div key={index} className="flex justify-between">
                                            <span className="text-slate-500">{wh.dayOfWeek}</span>
                                            <span className="text-slate-700">
                                                {wh.isClosed ? 'Closed' : `${wh.startTime} - ${wh.endTime}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <h4 className="font-semibold text-slate-800 mb-3">Contact</h4>
                            <div className="space-y-3">
                                {displayProvider.phone && (
                                    <a href={`tel:${displayProvider.phone}`} className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 transition">
                                        <Phone className="w-5 h-5" />
                                        <span>{displayProvider.phone}</span>
                                    </a>
                                )}
                                {displayProvider.email && (
                                    <a href={`mailto:${displayProvider.email}`} className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 transition">
                                        <Mail className="w-5 h-5" />
                                        <span>{displayProvider.email}</span>
                                    </a>
                                )}
                                {displayProvider.city && (
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <MapPin className="w-5 h-5" />
                                        <span>{[displayProvider.address, displayProvider.city, displayProvider.state].filter(Boolean).join(', ')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <BookingModal
                    provider={displayProvider}
                    selectedService={selectedService}
                    onClose={() => {
                        setShowBookingModal(false);
                        setSelectedService(null);
                    }}
                    onBook={onBook}
                />
            )}

            {/* Review Modal */}
            {showReviewForm && (
                <ReviewModal
                    provider={displayProvider}
                    bookingId={bookingId}
                    onClose={() => setShowReviewForm(false)}
                    onSuccess={() => {
                        setShowReviewForm(false);
                        // Refresh provider details to show new review
                        fetchProviderDetails(providerId);
                    }}
                />
            )}
        </div>
    );
};

// Booking Modal Component
const BookingModal = ({ provider, selectedService, onClose, onBook }) => {
    const [step, setStep] = useState(1);
    const [selectedServiceId, setSelectedServiceId] = useState(selectedService?.id || null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { createBooking } = useCustomerStore();

    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00',
        '17:00', '18:00'
    ];

    const formatTimeSlot = (time) => {
        const [hours] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:00 ${ampm}`;
    };

    const getSelectedServiceDetails = () => {
        return provider.services?.find(s => s.id === selectedServiceId);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const bookingData = {
                providerId: provider.id,
                serviceId: selectedServiceId,
                bookingDate: selectedDate,
                bookingTime: selectedTime,
                address: address,
                notes: notes
            };
            await createBooking(bookingData);
            if (onBook) {
                onBook(bookingData);
            }
            onClose();
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Failed to create booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
                
                <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <h2 className="text-xl font-bold text-slate-800 mb-6">Book Service</h2>

                    {/* Progress */}
                    <div className="flex items-center justify-center mb-6">
                        {[1, 2, 3].map((s, i) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                    step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                                }`}>
                                    {s}
                                </div>
                                {i < 2 && <div className={`w-12 h-1 mx-1 ${step > s ? 'bg-indigo-600' : 'bg-slate-200'}`} />}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Select Service */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-700">Select a Service</h3>
                            {provider.services && provider.services.length > 0 ? (
                                provider.services.map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => setSelectedServiceId(service.id)}
                                        className={`w-full p-4 rounded-xl border text-left transition ${
                                            selectedServiceId === service.id
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-slate-200 hover:border-indigo-300'
                                        }`}
                                    >
                                        <div className="flex justify-between">
                                            <span className="font-medium text-slate-800">{service.name}</span>
                                            <span className="font-bold text-indigo-600">₹{service.price || 0}</span>
                                        </div>
                                        {service.duration && (
                                            <div className="text-sm text-slate-500 mt-1">{service.duration}</div>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-4 text-slate-500">
                                    No services available
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Select Date & Time */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-slate-700 mb-2">Select Date</h3>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-700 mb-2">Select Time</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                                                selectedTime === time
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-indigo-100'
                                            }`}
                                        >
                                            {formatTimeSlot(time)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Address & Notes */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-slate-700 mb-2">Service Address</h3>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter complete address..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-700 mb-2">Additional Notes (Optional)</h3>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any specific instructions..."
                                    rows={2}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Booking Summary */}
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <h4 className="font-semibold text-slate-800 mb-3">Booking Summary</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Service</span>
                                        <span className="text-slate-800">{getSelectedServiceDetails()?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Date</span>
                                        <span className="text-slate-800">{selectedDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Time</span>
                                        <span className="text-slate-800">{selectedTime ? formatTimeSlot(selectedTime) : ''}</span>
                                    </div>
                                    <div className="flex justify-between font-bold pt-2 border-t border-slate-200">
                                        <span>Total</span>
                                        <span className="text-indigo-600">₹{getSelectedServiceDetails()?.price || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-3 mt-6">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                disabled={isSubmitting}
                                className="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition disabled:opacity-50"
                            >
                                Back
                            </button>
                        )}
                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={step === 1 && !selectedServiceId || step === 2 && (!selectedDate || !selectedTime)}
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={!address || isSubmitting}
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Booking...
                                    </>
                                ) : (
                                    'Confirm Booking'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Review Modal Component
const ReviewModal = ({ provider, bookingId, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { createReview } = useCustomerStore();

    const handleSubmit = async () => {
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        if (!bookingId) {
            setError('Booking ID is required. Please try again from your bookings page.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await createReview({
                bookingId: Number(bookingId),
                rating: rating,
                comment: comment.trim() || null
            });
            
            setSuccess(true);
            setTimeout(() => {
                onSuccess && onSuccess();
            }, 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to submit review. Please try again.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Review Submitted!</h2>
                    <p className="text-slate-500">Thank you for your feedback.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800">Write a Review</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-full transition"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>
                    <p className="text-slate-500 text-sm mt-1">
                        Share your experience with {provider?.name || 'this provider'}
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Rating Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            How would you rate your experience?
                        </label>
                        <div className="flex items-center justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-10 h-10 ${
                                            star <= (hoverRating || rating)
                                                ? 'text-yellow-500 fill-yellow-500'
                                                : 'text-slate-300'
                                        } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="text-center mt-2 text-sm text-slate-500">
                            {rating === 0 && 'Select a rating'}
                            {rating === 1 && 'Poor'}
                            {rating === 2 && 'Fair'}
                            {rating === 3 && 'Good'}
                            {rating === 4 && 'Very Good'}
                            {rating === 5 && 'Excellent'}
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Your Review (Optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell others about your experience..."
                            rows={4}
                            maxLength={1000}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                        <div className="text-right text-xs text-slate-400 mt-1">
                            {comment.length}/1000 characters
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={rating === 0 || isSubmitting}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Star className="w-5 h-5" />
                                Submit Review
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProviderDetails;
