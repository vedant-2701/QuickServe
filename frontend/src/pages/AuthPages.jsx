import React, { useState } from 'react';
import AuthHeader from '../components/auth/AuthHeader';
import AuthFooter from '../components/auth/AuthFooter';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import useAuthStore from '../store/useAuthStore';

const AuthPages = () => {
    const [view, setView] = useState('login'); // 'login' | 'signup'
    const { login, signup, isLoading, error, clearError } = useAuthStore();

    const handleLogin = async (email, password) => {
        clearError();
        await login(email, password);
    };

    const handleSignup = async (formData) => {
        clearError();
        await signup(formData);
    };

    const switchView = (newView) => {
        clearError();
        setView(newView);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            
            {/* Brand Header */}
            <AuthHeader />

            <div className="sm:mx-auto sm:w-full sm:max-w-[40rem]">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
                    
                    {/* View Container */}
                    {view === 'login' ? (
                        <LoginForm 
                            onSwitchToSignup={() => switchView('signup')} 
                            onLogin={handleLogin}
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