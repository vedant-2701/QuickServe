import React, { useState } from 'react';
import { 
    Mail, 
    User, 
    Briefcase, 
    MapPin, 
    Phone, 
    CheckCircle,
    Hammer,
    CreditCard,
    Home,
    Globe,
    FileText,
    Clock,
    IndianRupee,
    Upload,
    Loader2
} from 'lucide-react';
import InputField from './InputField';
import PasswordField from './PasswordField';

const SignupForm = ({ onSwitchToLogin, onSignup, isLoading = false, error = null }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        aadharNumber: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        primaryService: '',
        secondaryServices: [],
        experience: '',
        serviceRadius: '5',
        hourlyRate: '',
        bio: '',
        languages: [],
    });

    const [step, setStep] = useState(1);

    const serviceOptions = [
        "Plumbing", "Electrical", "Cleaning", "Carpentry", 
        "Painting", "HVAC", "Landscaping", "Pest Control",
        "Appliance Repair", "Home Security", "Roofing", "Flooring"
    ];

    const languageOptions = ["Hindi", "English", "Marathi", "Tamil", "Telugu", "Kannada", "Bengali", "Gujarati"];

    const stateOptions = [
        "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat", 
        "Rajasthan", "Uttar Pradesh", "West Bengal", "Telangana", "Kerala"
    ];

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleMultiSelect = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(v => v !== value)
                : [...prev[field], value]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSignup) onSignup(formData);
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const isStepValid = () => {
        if (step === 1) {
            return formData.fullName && formData.email && formData.phone && 
                   formData.password && formData.password === formData.confirmPassword;
        }
        if (step === 2) {
            return formData.aadharNumber && formData.address && formData.city && 
                   formData.state && formData.pincode;
        }
        return formData.primaryService && formData.experience;
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Partner with Us</h2>
                <p className="text-slate-500 mt-2">Create your provider profile and start earning.</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-6">
                {[1, 2, 3].map((s, i) => (
                    <div key={s} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                            step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                            {s}
                        </div>
                        {i < 2 && (
                            <div className={`w-12 h-1 mx-1 transition-colors ${
                                step > s ? 'bg-indigo-600' : 'bg-slate-200'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mb-6 px-2">
                <span>Account</span>
                <span>Identity</span>
                <span>Services</span>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField 
                                label="Full Name" 
                                type="text" 
                                icon={User} 
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange('fullName')}
                            />
                            <InputField 
                                label="Phone Number" 
                                type="tel" 
                                icon={Phone} 
                                placeholder="+91 98765 43210"
                                value={formData.phone}
                                onChange={handleChange('phone')}
                            />
                        </div>

                        <InputField 
                            label="Email Address" 
                            type="email" 
                            icon={Mail} 
                            placeholder="john@business.com"
                            value={formData.email}
                            onChange={handleChange('email')}
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
                    </div>
                )}

                {/* Step 2: Identity & Address */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-4">
                            <p className="text-sm text-amber-700 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Your Aadhar is used for identity verification only.
                            </p>
                        </div>

                        <InputField 
                            label="Aadhar Number" 
                            type="text" 
                            icon={CreditCard} 
                            placeholder="XXXX XXXX XXXX"
                            value={formData.aadharNumber}
                            onChange={handleChange('aadharNumber')}
                        />

                        <InputField 
                            label="Street Address" 
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
                                placeholder="Pune"
                                value={formData.city}
                                onChange={handleChange('city')}
                            />
                            <InputField 
                                label="State" 
                                type="select" 
                                icon={Globe} 
                                options={["Select State...", ...stateOptions]}
                                value={formData.state}
                                onChange={handleChange('state')}
                            />
                        </div>

                        <InputField 
                            label="Pincode" 
                            type="text" 
                            icon={MapPin} 
                            placeholder="411001"
                            value={formData.pincode}
                            onChange={handleChange('pincode')}
                        />
                    </div>
                )}

                {/* Step 3: Service Details */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Professional Details
                            </h3>

                            <InputField 
                                label="Primary Service" 
                                type="select" 
                                icon={Hammer} 
                                options={["Select Primary Service...", ...serviceOptions]}
                                value={formData.primaryService}
                                onChange={handleChange('primaryService')}
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Additional Services (Optional)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {serviceOptions.filter(s => s !== formData.primaryService).slice(0, 6).map(service => (
                                        <button
                                            type="button"
                                            key={service}
                                            onClick={() => handleMultiSelect('secondaryServices', service)}
                                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                                                formData.secondaryServices.includes(service)
                                                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                                                    : 'bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200'
                                            }`}
                                        >
                                            {service}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField 
                                    label="Experience (Years)" 
                                    type="number" 
                                    icon={CheckCircle} 
                                    placeholder="e.g. 5"
                                    value={formData.experience}
                                    onChange={handleChange('experience')}
                                />
                                <InputField 
                                    label="Service Radius (km)" 
                                    type="number" 
                                    icon={MapPin} 
                                    placeholder="e.g. 10"
                                    value={formData.serviceRadius}
                                    onChange={handleChange('serviceRadius')}
                                />
                            </div>

                            <InputField 
                                label="Hourly Rate (₹)" 
                                type="number" 
                                icon={IndianRupee} 
                                placeholder="e.g. 500"
                                value={formData.hourlyRate}
                                onChange={handleChange('hourlyRate')}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Languages Spoken
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {languageOptions.map(lang => (
                                    <button
                                        type="button"
                                        key={lang}
                                        onClick={() => handleMultiSelect('languages', lang)}
                                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                                            formData.languages.includes(lang)
                                                ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                                                : 'bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200'
                                        }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Short Bio (Optional)
                            </label>
                            <textarea
                                className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 text-slate-900 transition-shadow resize-none"
                                rows={3}
                                placeholder="Tell customers about yourself and your expertise..."
                                value={formData.bio}
                                onChange={handleChange('bio')}
                            />
                        </div>

                        <div className="text-xs text-slate-500 leading-relaxed">
                            By creating an account, you agree to our{' '}
                            <a href="#" className="underline hover:text-indigo-600">Terms of Service</a> and{' '}
                            <a href="#" className="underline hover:text-indigo-600">Privacy Policy</a>.
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-2">
                    {step > 1 && (
                        <button 
                            type="button"
                            onClick={prevStep}
                            className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                        >
                            Back
                        </button>
                    )}
                    
                    {step < 3 ? (
                        <button 
                            type="button"
                            onClick={nextStep}
                            disabled={!isStepValid()}
                            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/30"
                        >
                            Continue
                        </button>
                    ) : (
                        <button 
                            type="submit"
                            disabled={!isStepValid() || isLoading}
                            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Provider Account'
                            )}
                        </button>
                    )}
                </div>
            </form>

            <div className="mt-6 text-center border-t border-slate-100 pt-6">
                <p className="text-slate-600">
                    Already have an account?{' '}
                    <button 
                        onClick={onSwitchToLogin} 
                        className="font-bold text-indigo-600 hover:text-indigo-500"
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupForm;
