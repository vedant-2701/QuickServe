import React from 'react';
import { 
    Mail, 
    User, 
    Briefcase, 
    MapPin, 
    Phone, 
    CheckCircle,
    Hammer
} from 'lucide-react';
import InputField from './InputField';
import PasswordField from './PasswordField';

const SignupForm = ({ onSwitchToLogin, onSignup }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would create account here
        if (onSignup) onSignup();
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Partner with Us</h2>
                <p className="text-slate-500 mt-2">Create your provider profile and start earning.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField 
                        label="Full Name" 
                        type="text" 
                        icon={User} 
                        placeholder="John Doe" 
                    />
                    <InputField 
                        label="Phone Number" 
                        type="tel" 
                        icon={Phone} 
                        placeholder="+91 98765 43210" 
                    />
                </div>

                <InputField 
                    label="Email Address" 
                    type="email" 
                    icon={Mail} 
                    placeholder="john@business.com" 
                />
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Business Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField 
                            label="Primary Service" 
                            type="select" 
                            icon={Hammer} 
                            options={["Select...", "Plumbing", "Cleaning", "Electrical", "Carpentry", "Landscaping", "HVAC"]} 
                        />
                        <InputField 
                            label="Experience (Years)" 
                            type="number" 
                            icon={CheckCircle} 
                            placeholder="e.g. 5" 
                        />
                    </div>
                    
                    <InputField 
                        label="Base Location (City/Zip)" 
                        type="text" 
                        icon={MapPin} 
                        placeholder="e.g. Pune, 411001" 
                    />
                </div>

                <PasswordField 
                    label="Create Password" 
                    placeholder="Min. 8 characters" 
                />

                <div className="text-xs text-slate-500 leading-relaxed">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="underline hover:text-indigo-600">Terms of Service</a> and{' '}
                    <a href="#" className="underline hover:text-indigo-600">Privacy Policy</a>.
                </div>

                <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-lg shadow-indigo-500/30">
                    Create Provider Account
                </button>
            </form>

            <div className="mt-8 text-center border-t border-slate-100 pt-6">
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
