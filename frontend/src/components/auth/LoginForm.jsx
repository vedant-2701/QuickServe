import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import InputField from './InputField';
import PasswordField from './PasswordField';

const LoginForm = ({ onSwitchToSignup, onLogin, isLoading = false, error = null, isCustomer = false, isAdmin = false }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const handleChange = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onLogin) {
            onLogin(formData.email, formData.password);
        }
    };

    const getTitle = () => {
        if (isAdmin) return 'Admin Sign In';
        if (isCustomer) return 'Customer Sign In';
        return 'Welcome Back';
    };

    const getSubtitle = () => {
        if (isAdmin) return 'Access the admin dashboard to manage the platform.';
        if (isCustomer) return 'Log in to discover and book local services.';
        return 'Log in to manage your bookings and services.';
    };

    const getButtonColor = () => {
        if (isAdmin) return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-red-500/30 disabled:bg-red-300';
        return 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 shadow-indigo-500/30 disabled:bg-indigo-300';
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                    {getTitle()}
                </h2>
                <p className="text-slate-500 mt-2">
                    {getSubtitle()}
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <InputField 
                    label="Email Address" 
                    type="email" 
                    icon={Mail} 
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange('email')}
                />
                <PasswordField 
                    label="Password" 
                    placeholder="••••••••" 
                    showForgotLink={!isAdmin}
                    value={formData.password}
                    onChange={handleChange('password')}
                />
                
                <div className="flex items-center mb-6">
                    <input
                        id="remember-me"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleChange('rememberMe')}
                        className={`h-4 w-4 focus:ring-2 border-slate-300 rounded ${isAdmin ? 'text-red-600 focus:ring-red-500' : 'text-indigo-600 focus:ring-indigo-500'}`}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                        Keep me logged in
                    </label>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading || !formData.email || !formData.password}
                    className={`w-full text-white py-2.5 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed ${getButtonColor()}`}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        <>
                            Sign In <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            {onSwitchToSignup && (
                <div className="mt-8 text-center border-t border-slate-100 pt-6">
                    <p className="text-slate-600">
                        {isCustomer ? (
                            <>
                                New to QuickServe?{' '}
                                <button 
                                    onClick={onSwitchToSignup} 
                                    className="font-bold text-indigo-600 hover:text-indigo-500"
                                >
                                    Create Account
                                </button>
                            </>
                        ) : (
                            <>
                                Want to become a provider?{' '}
                                <button 
                                    onClick={onSwitchToSignup} 
                                    className="font-bold text-indigo-600 hover:text-indigo-500"
                                >
                                    Join QuickServe
                                </button>
                            </>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
};

export default LoginForm;
