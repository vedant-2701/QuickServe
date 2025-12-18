import React, { useState } from 'react';
import { 
    Mail, 
    User, 
    Phone,
    MapPin,
    Home,
    Globe,
    Loader2,
    CheckCircle
} from 'lucide-react';
import InputField from './InputField';
import PasswordField from './PasswordField';

const CustomerSignupForm = ({ onSwitchToLogin, onSignup, isLoading = false, error = null }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });

    const [step, setStep] = useState(1);

    const stateOptions = [
        "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat", 
        "Rajasthan", "Uttar Pradesh", "West Bengal", "Telangana", "Kerala",
        "Andhra Pradesh", "Bihar", "Madhya Pradesh", "Punjab", "Haryana"
    ];

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSignup) {
            onSignup({
                ...formData,
                role: 'CUSTOMER'
            });
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 2));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const isStepValid = () => {
        if (step === 1) {
            return formData.fullName && formData.email && formData.phone && 
                   formData.password && formData.password === formData.confirmPassword &&
                   formData.password.length >= 8;
        }
        return formData.city && formData.state;
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Create Your Account</h2>
                <p className="text-slate-500 mt-2">Join QuickServe and book services easily.</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-6">
                {[1, 2].map((s, i) => (
                    <div key={s} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                            step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                            {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                        </div>
                        {i < 1 && (
                            <div className={`w-16 h-1 mx-2 transition-colors ${
                                step > s ? 'bg-indigo-600' : 'bg-slate-200'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mb-6 px-8">
                <span>Account Details</span>
                <span>Location</span>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1: Account Details */}
                {step === 1 && (
                    <div className="space-y-4">
                        <InputField 
                            label="Full Name" 
                            type="text" 
                            icon={User} 
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleChange('fullName')}
                            required
                        />

                        <InputField 
                            label="Email Address" 
                            type="email" 
                            icon={Mail} 
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange('email')}
                            required
                        />

                        <InputField 
                            label="Phone Number" 
                            type="tel" 
                            icon={Phone} 
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={handleChange('phone')}
                            required
                        />

                        <PasswordField 
                            label="Create Password" 
                            placeholder="Min. 8 characters"
                            value={formData.password}
                            onChange={handleChange('password')}
                        />

                        <PasswordField 
                            label="Confirm Password" 
                            placeholder="Re-enter password"
                            value={formData.confirmPassword}
                            onChange={handleChange('confirmPassword')}
                        />

                        {formData.password && formData.confirmPassword && 
                         formData.password !== formData.confirmPassword && (
                            <p className="text-red-500 text-sm">Passwords do not match</p>
                        )}

                        {formData.password && formData.password.length < 8 && (
                            <p className="text-amber-500 text-sm">Password must be at least 8 characters</p>
                        )}
                    </div>
                )}

                {/* Step 2: Location */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 mb-4">
                            <p className="text-sm text-indigo-700 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Your location helps us show nearby service providers.
                            </p>
                        </div>

                        <InputField 
                            label="Street Address (Optional)" 
                            type="text" 
                            icon={Home} 
                            placeholder="123, MG Road, Near City Mall"
                            value={formData.address}
                            onChange={handleChange('address')}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField 
                                label="City" 
                                type="text" 
                                icon={MapPin} 
                                placeholder="Mumbai"
                                value={formData.city}
                                onChange={handleChange('city')}
                                required
                            />
                            <InputField 
                                label="State" 
                                type="select" 
                                icon={Globe} 
                                options={["Select State...", ...stateOptions]}
                                value={formData.state}
                                onChange={handleChange('state')}
                                required
                            />
                        </div>

                        <InputField 
                            label="Pincode (Optional)" 
                            type="text" 
                            icon={MapPin} 
                            placeholder="400001"
                            value={formData.pincode}
                            onChange={handleChange('pincode')}
                        />
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="flex-1 py-3 px-4 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition"
                        >
                            Back
                        </button>
                    )}
                    
                    {step < 2 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={!isStepValid()}
                            className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={!isStepValid() || isLoading}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    )}
                </div>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <button 
                    onClick={onSwitchToLogin}
                    className="text-indigo-600 font-semibold hover:underline"
                >
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default CustomerSignupForm;
