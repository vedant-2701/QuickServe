import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import InputField from './InputField';
import PasswordField from './PasswordField';

const LoginForm = ({ onSwitchToSignup, onLogin }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would validate credentials here
        if (onLogin) onLogin();
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                <p className="text-slate-500 mt-2">Log in to manage your bookings and services.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <InputField 
                    label="Email Address" 
                    type="email" 
                    icon={Mail} 
                    placeholder="you@example.com" 
                />
                <PasswordField 
                    label="Password" 
                    placeholder="••••••••" 
                    showForgotLink={true}
                />
                
                <div className="flex items-center mb-6">
                    <input
                        id="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                        Keep me logged in
                    </label>
                </div>

                <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2">
                    Sign In <ArrowRight className="w-4 h-4" />
                </button>
            </form>

            <div className="mt-8 text-center border-t border-slate-100 pt-6">
                <p className="text-slate-600">
                    Want to become a provider?{' '}
                    <button 
                        onClick={onSwitchToSignup} 
                        className="font-bold text-indigo-600 hover:text-indigo-500"
                    >
                        Join QuickServe
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
