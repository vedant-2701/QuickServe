import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Briefcase, Zap } from 'lucide-react';
import AuthFooter from '../components/auth/AuthFooter';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import CustomerSignupForm from '../components/auth/CustomerSignupForm';
import useAuthStore from '../store/useAuthStore';

const AuthPages = ({ selectedRole = 'provider', onBack }) => {
    const navigate = useNavigate();
    const [view, setView] = useState(selectedRole === 'customer' ? 'login' : 'signup');
    const { login, signup, signupCustomer, isLoading, error, clearError, isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        // Set initial view based on role
        if (selectedRole === 'customer') {
            setView('login');
        } else {
            setView('signup');
        }
    }, [selectedRole]);

    // Redirect after successful authentication
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'CUSTOMER') {
                navigate('/customer', { replace: true });
            } else if (user.role === 'SERVICE_PROVIDER') {
                navigate('/provider', { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleLogin = async (email, password) => {
        clearError();
        const result = await login(email, password);
        // Navigation will happen automatically via useEffect when isAuthenticated changes
    };

    const handleSignup = async (formData) => {
        clearError();
        const result = await signup(formData);
        // Navigation will happen automatically via useEffect when isAuthenticated changes
    };

    const handleCustomerSignup = async (formData) => {
        clearError();
        const result = await signupCustomer(formData);
        // Navigation will happen automatically via useEffect when isAuthenticated changes
    };

    const switchView = (newView) => {
        clearError();
        setView(newView);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex flex-col py-8 sm:py-12 sm:px-6 lg:px-8 font-sans">
            
            {/* Back Button & Header */}
            <div className="sm:mx-auto sm:w-full sm:max-w-[40rem] mb-6 px-4">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Zap className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-slate-900">
                        Quick<span className="text-indigo-600">Serve</span>
                    </span>
                </div>

                {/* Role Indicator */}
                <div className="flex justify-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                        selectedRole === 'customer'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                    }`}>
                        {selectedRole === 'customer' ? (
                            <>
                                <Users className="w-4 h-4" />
                                Customer Portal
                            </>
                        ) : (
                            <>
                                <Briefcase className="w-4 h-4" />
                                Service Provider Portal
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-[40rem] flex-1 flex flex-col">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
                    
                    {/* View Container */}
                    {view === 'login' ? (
                        <LoginForm 
                            onSwitchToSignup={() => switchView('signup')} 
                            onLogin={handleLogin}
                            isLoading={isLoading}
                            error={error}
                            isCustomer={selectedRole === 'customer'}
                        />
                    ) : selectedRole === 'customer' ? (
                        <CustomerSignupForm 
                            onSwitchToLogin={() => switchView('login')} 
                            onSignup={handleCustomerSignup}
                            isLoading={isLoading}
                            error={error}
                        />
                    ) : (
                        <SignupForm 
                            onSwitchToLogin={() => switchView('login')} 
                            onSignup={handleSignup}
                            isLoading={isLoading}
                            error={error}
                        />
                    )}
                    
                </div>
                
                {/* Footer Info */}
                <AuthFooter />
            </div>
        </div>
    );
};

export default AuthPages;